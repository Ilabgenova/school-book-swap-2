
-- 1. Extend listings
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS last_confirmed_available_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_status_prompted_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_email_reminder_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS email_reminder_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS marked_sold_by text;

-- 2. Tokens table
CREATE TABLE IF NOT EXISTS public.listing_email_action_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type text NOT NULL CHECK (action_type IN ('still_available','mark_sold')),
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  email_reminder_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS listing_email_action_tokens_listing_idx
  ON public.listing_email_action_tokens(listing_id);
CREATE INDEX IF NOT EXISTS listing_email_action_tokens_user_idx
  ON public.listing_email_action_tokens(user_id);

GRANT ALL ON public.listing_email_action_tokens TO service_role;
ALTER TABLE public.listing_email_action_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read listing email action tokens"
  ON public.listing_email_action_tokens FOR SELECT
  TO authenticated
  USING (public.current_user_is_admin());

-- 3. Reminder log
CREATE TABLE IF NOT EXISTS public.listing_reminder_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  reminder_type text NOT NULL DEFAULT 'email',
  status text NOT NULL CHECK (status IN ('sent','failed','skipped')),
  error_message text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS listing_reminder_log_listing_idx
  ON public.listing_reminder_log(listing_id);

GRANT ALL ON public.listing_reminder_log TO service_role;
ALTER TABLE public.listing_reminder_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read listing reminder log"
  ON public.listing_reminder_log FOR SELECT
  TO authenticated
  USING (public.current_user_is_admin());

-- 4. Action log
CREATE TABLE IF NOT EXISTS public.listing_status_action_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id uuid,
  action_source text NOT NULL CHECK (action_source IN ('email_link','app_dashboard','admin')),
  action text NOT NULL,
  previous_status text,
  new_status text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS listing_status_action_log_listing_idx
  ON public.listing_status_action_log(listing_id);

GRANT ALL ON public.listing_status_action_log TO service_role;
ALTER TABLE public.listing_status_action_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read listing status action log"
  ON public.listing_status_action_log FOR SELECT
  TO authenticated
  USING (public.current_user_is_admin());

-- 5. RPC: find listings needing a reminder (active, older than 14d, not reminded in 14d)
CREATE OR REPLACE FUNCTION public.list_listings_needing_reminder(_limit int DEFAULT 100)
RETURNS TABLE (
  listing_id uuid,
  seller_id uuid,
  title text,
  recipient_email text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    l.id AS listing_id,
    l.seller_id,
    l.title,
    au.email::text AS recipient_email
  FROM public.listings l
  JOIN auth.users au ON au.id = l.seller_id
  LEFT JOIN public.profiles p ON p.user_id = l.seller_id
  WHERE l.status = 'active'::public.listing_status
    AND l.created_at < now() - interval '14 days'
    AND (
      l.last_email_reminder_sent_at IS NULL
      OR l.last_email_reminder_sent_at < now() - interval '14 days'
    )
    AND (
      l.last_confirmed_available_at IS NULL
      OR l.last_confirmed_available_at < now() - interval '14 days'
    )
    AND COALESCE(p.account_status::text, 'active') = 'active'
    AND au.email IS NOT NULL
  ORDER BY l.created_at ASC
  LIMIT GREATEST(1, LEAST(_limit, 500));
$$;
REVOKE ALL ON FUNCTION public.list_listings_needing_reminder(int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_listings_needing_reminder(int) TO service_role;

-- 6. RPC: mark reminder sent + create tokens (returns raw tokens ONLY to caller)
CREATE OR REPLACE FUNCTION public.create_listing_reminder_tokens(
  _listing_id uuid,
  _user_id uuid,
  _still_available_hash text,
  _mark_sold_hash text,
  _expires_at timestamptz
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.listing_email_action_tokens (listing_id, user_id, action_type, token_hash, expires_at)
  VALUES
    (_listing_id, _user_id, 'still_available', _still_available_hash, _expires_at),
    (_listing_id, _user_id, 'mark_sold', _mark_sold_hash, _expires_at);

  UPDATE public.listings
     SET last_email_reminder_sent_at = now(),
         last_status_prompted_at = now(),
         email_reminder_count = COALESCE(email_reminder_count, 0) + 1,
         updated_at = now()
   WHERE id = _listing_id;

  INSERT INTO public.listing_reminder_log (listing_id, user_id, reminder_type, status, sent_at)
  VALUES (_listing_id, _user_id, 'email', 'sent', now());
END;
$$;
REVOKE ALL ON FUNCTION public.create_listing_reminder_tokens(uuid,uuid,text,text,timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_listing_reminder_tokens(uuid,uuid,text,text,timestamptz) TO service_role;

-- 7. RPC: consume a token and apply its action. Returns result code.
CREATE OR REPLACE FUNCTION public.consume_listing_action_token(_token_hash text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token public.listing_email_action_tokens%ROWTYPE;
  v_listing public.listings%ROWTYPE;
  v_account_status text;
BEGIN
  SELECT * INTO v_token
    FROM public.listing_email_action_tokens
   WHERE token_hash = _token_hash;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'code', 'invalid');
  END IF;

  IF v_token.used_at IS NOT NULL THEN
    RETURN jsonb_build_object('ok', false, 'code', 'used');
  END IF;

  IF v_token.expires_at < now() THEN
    RETURN jsonb_build_object('ok', false, 'code', 'expired');
  END IF;

  SELECT * INTO v_listing FROM public.listings WHERE id = v_token.listing_id;
  IF NOT FOUND OR v_listing.seller_id <> v_token.user_id THEN
    RETURN jsonb_build_object('ok', false, 'code', 'invalid');
  END IF;

  SELECT COALESCE(account_status::text, 'active') INTO v_account_status
    FROM public.profiles WHERE user_id = v_token.user_id;
  IF v_account_status <> 'active' THEN
    RETURN jsonb_build_object('ok', false, 'code', 'account_blocked');
  END IF;

  IF v_token.action_type = 'still_available' THEN
    IF v_listing.status <> 'active'::public.listing_status THEN
      RETURN jsonb_build_object('ok', false, 'code', 'not_active',
        'listing_status', v_listing.status::text);
    END IF;
    UPDATE public.listings
       SET last_confirmed_available_at = now(),
           last_status_prompted_at = now(),
           updated_at = now()
     WHERE id = v_listing.id;
    UPDATE public.listing_email_action_tokens SET used_at = now() WHERE id = v_token.id;
    INSERT INTO public.listing_status_action_log (listing_id, user_id, action_source, action, previous_status, new_status)
    VALUES (v_listing.id, v_token.user_id, 'email_link', 'still_available', v_listing.status::text, v_listing.status::text);
    RETURN jsonb_build_object('ok', true, 'code', 'still_available', 'listing_id', v_listing.id);
  ELSIF v_token.action_type = 'mark_sold' THEN
    IF v_listing.status = 'sold'::public.listing_status THEN
      UPDATE public.listing_email_action_tokens SET used_at = now() WHERE id = v_token.id;
      RETURN jsonb_build_object('ok', true, 'code', 'already_sold', 'listing_id', v_listing.id);
    END IF;
    UPDATE public.listings
       SET status = 'sold'::public.listing_status,
           sold_at = COALESCE(sold_at, now()),
           sold_by_user_id = v_token.user_id,
           marked_sold_by = 'email_link',
           updated_at = now()
     WHERE id = v_listing.id;
    UPDATE public.listing_email_action_tokens SET used_at = now() WHERE id = v_token.id;
    -- Invalidate the sibling still_available token for the same listing
    UPDATE public.listing_email_action_tokens
       SET used_at = now()
     WHERE listing_id = v_listing.id AND used_at IS NULL;
    INSERT INTO public.listing_status_action_log (listing_id, user_id, action_source, action, previous_status, new_status)
    VALUES (v_listing.id, v_token.user_id, 'email_link', 'mark_sold', v_listing.status::text, 'sold');
    RETURN jsonb_build_object('ok', true, 'code', 'marked_sold', 'listing_id', v_listing.id);
  END IF;

  RETURN jsonb_build_object('ok', false, 'code', 'invalid');
END;
$$;
REVOKE ALL ON FUNCTION public.consume_listing_action_token(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.consume_listing_action_token(text) TO service_role;

-- 8. Cron: run the reminder function once per day at 08:15 UTC
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'send-listing-reminders-daily') THEN
    PERFORM cron.unschedule('send-listing-reminders-daily');
  END IF;
  PERFORM cron.schedule(
    'send-listing-reminders-daily',
    '15 8 * * *',
    $cmd$
      SELECT net.http_post(
        url := 'https://tbhstqoixqhovzgjmmss.supabase.co/functions/v1/send-listing-reminders',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key')
        ),
        body := '{}'::jsonb
      );
    $cmd$
  );
END $$;
