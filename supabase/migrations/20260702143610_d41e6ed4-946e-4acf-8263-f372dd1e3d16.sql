
-- Column to store admin review comment
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS admin_review_note text;

-- Notifications inbox
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  listing_id uuid,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users mark own notifications read" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS notifications_user_created_idx
  ON public.notifications (user_id, created_at DESC);

-- Admin: request correction
CREATE OR REPLACE FUNCTION public.admin_request_listing_correction(_listing_id uuid, _note text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_listing public.listings%ROWTYPE;
BEGIN
  IF NOT public.current_user_is_admin() THEN
    RAISE EXCEPTION 'Only admins can request corrections';
  END IF;
  IF _note IS NULL OR btrim(_note) = '' THEN
    RAISE EXCEPTION 'A correction note is required';
  END IF;

  SELECT * INTO v_listing FROM public.listings WHERE id = _listing_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Listing not found'; END IF;

  UPDATE public.listings
     SET status = 'needs_correction'::public.listing_status,
         admin_review_note = _note,
         updated_at = now()
   WHERE id = _listing_id;

  INSERT INTO public.notifications (user_id, type, title, body, listing_id)
  VALUES (
    v_listing.seller_id,
    'listing_needs_correction',
    'Correction requested / Correzione richiesta',
    'Your listing for "' || v_listing.title || '" needs correction: ' || _note ||
    E'\n\nIl tuo annuncio per "' || v_listing.title || '" richiede una correzione: ' || _note,
    _listing_id
  );
END;
$$;

-- Admin: delete listing (archive + notify)
CREATE OR REPLACE FUNCTION public.admin_delete_listing_with_reason(_listing_id uuid, _reason text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_listing public.listings%ROWTYPE;
  v_conv RECORD;
BEGIN
  IF NOT public.current_user_is_admin() THEN
    RAISE EXCEPTION 'Only admins can delete listings';
  END IF;

  SELECT * INTO v_listing FROM public.listings WHERE id = _listing_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Listing not found'; END IF;

  UPDATE public.listings
     SET status = 'archived'::public.listing_status,
         admin_review_note = COALESCE(_reason, admin_review_note),
         updated_at = now()
   WHERE id = _listing_id;

  -- Notify seller
  INSERT INTO public.notifications (user_id, type, title, body, listing_id)
  VALUES (
    v_listing.seller_id,
    'listing_deleted',
    'Listing removed / Annuncio eliminato',
    'Your listing for "' || v_listing.title || '" was removed by the admin. Reason: ' || COALESCE(_reason, '—') ||
    E'\n\nIl tuo annuncio per "' || v_listing.title || '" è stato eliminato dall''amministratore. Motivo: ' || COALESCE(_reason, '—'),
    _listing_id
  );

  -- Notify any buyers who had a conversation on this listing
  FOR v_conv IN
    SELECT DISTINCT buyer_id FROM public.conversations WHERE listing_id = _listing_id
  LOOP
    INSERT INTO public.notifications (user_id, type, title, body, listing_id)
    VALUES (
      v_conv.buyer_id,
      'listing_unavailable',
      'Listing unavailable / Annuncio non disponibile',
      'The listing for "' || v_listing.title || '" is no longer available.' ||
      E'\n\nL''annuncio per "' || v_listing.title || '" non è più disponibile.',
      _listing_id
    );
  END LOOP;
END;
$$;

-- Seller: resubmit corrected listing
CREATE OR REPLACE FUNCTION public.seller_resubmit_listing(_listing_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_seller uuid;
  v_status public.listing_status;
BEGIN
  SELECT seller_id, status INTO v_seller, v_status
    FROM public.listings WHERE id = _listing_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Listing not found'; END IF;
  IF v_seller <> auth.uid() THEN
    RAISE EXCEPTION 'You can only resubmit your own listings';
  END IF;
  IF v_status <> 'needs_correction'::public.listing_status THEN
    RAISE EXCEPTION 'Only listings needing correction can be resubmitted';
  END IF;

  UPDATE public.listings
     SET status = 'pending_review'::public.listing_status,
         updated_at = now()
   WHERE id = _listing_id;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_request_listing_correction(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_request_listing_correction(uuid, text) TO authenticated;

REVOKE ALL ON FUNCTION public.admin_delete_listing_with_reason(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_listing_with_reason(uuid, text) TO authenticated;

REVOKE ALL ON FUNCTION public.seller_resubmit_listing(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.seller_resubmit_listing(uuid) TO authenticated;
