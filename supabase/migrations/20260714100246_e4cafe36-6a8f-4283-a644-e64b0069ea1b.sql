CREATE TABLE IF NOT EXISTS public.message_notification_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES public.messages(id) ON DELETE SET NULL,
  sender_user_id uuid,
  recipient_user_id uuid,
  recipient_email text,
  status text NOT NULL CHECK (status IN ('pending', 'sent', 'failed', 'skipped')),
  provider_response text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz
);

GRANT SELECT ON public.message_notification_log TO authenticated;
GRANT ALL ON public.message_notification_log TO service_role;

ALTER TABLE public.message_notification_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view message notification logs"
ON public.message_notification_log
FOR SELECT
TO authenticated
USING (public.current_user_is_admin());

CREATE POLICY "Service role can manage message notification logs"
ON public.message_notification_log
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_message_notification_log_created_at
  ON public.message_notification_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_message_notification_log_message_id
  ON public.message_notification_log(message_id);
CREATE INDEX IF NOT EXISTS idx_message_notification_log_status
  ON public.message_notification_log(status);

CREATE OR REPLACE FUNCTION public.notify_new_message_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_conversation public.conversations%ROWTYPE;
  v_recipient_id uuid;
  v_recipient_email text;
  v_recipient_opt_in boolean;
  v_sender_name text;
  v_service_key text;
  v_supabase_url text := 'https://tbhstqoixqhovzgjmmss.supabase.co';
  v_conversation_url text;
  v_log_id uuid;
  v_http_request_id bigint;
BEGIN
  SELECT * INTO v_conversation FROM public.conversations WHERE id = NEW.conversation_id;
  IF NOT FOUND THEN
    INSERT INTO public.message_notification_log (message_id, sender_user_id, status, error_message)
    VALUES (NEW.id, NEW.sender_id, 'skipped', 'Conversation not found');
    RETURN NEW;
  END IF;

  IF NEW.sender_id = v_conversation.buyer_id THEN
    v_recipient_id := v_conversation.seller_id;
  ELSIF NEW.sender_id = v_conversation.seller_id THEN
    v_recipient_id := v_conversation.buyer_id;
  ELSE
    INSERT INTO public.message_notification_log (message_id, sender_user_id, status, error_message)
    VALUES (NEW.id, NEW.sender_id, 'skipped', 'Message sender is not a conversation participant');
    RETURN NEW;
  END IF;

  IF v_recipient_id IS NULL OR v_recipient_id = NEW.sender_id THEN
    INSERT INTO public.message_notification_log (message_id, sender_user_id, recipient_user_id, status, error_message)
    VALUES (NEW.id, NEW.sender_id, v_recipient_id, 'skipped', 'Recipient is missing or matches sender');
    RETURN NEW;
  END IF;

  SELECT COALESCE(email_new_message_notifications, true) INTO v_recipient_opt_in
  FROM public.profiles WHERE user_id = v_recipient_id;

  IF v_recipient_opt_in IS DISTINCT FROM true THEN
    INSERT INTO public.message_notification_log (message_id, sender_user_id, recipient_user_id, status, error_message)
    VALUES (NEW.id, NEW.sender_id, v_recipient_id, 'skipped', 'Recipient disabled new-message email notifications');
    RETURN NEW;
  END IF;

  SELECT email INTO v_recipient_email FROM auth.users WHERE id = v_recipient_id;
  IF v_recipient_email IS NULL OR btrim(v_recipient_email) = '' THEN
    INSERT INTO public.message_notification_log (message_id, sender_user_id, recipient_user_id, status, error_message)
    VALUES (NEW.id, NEW.sender_id, v_recipient_id, 'skipped', 'Recipient email not found');
    RETURN NEW;
  END IF;

  SELECT COALESCE(NULLIF(TRIM(first_name), ''), 'DISbook user') INTO v_sender_name
  FROM public.profiles WHERE user_id = NEW.sender_id;
  IF v_sender_name IS NULL THEN v_sender_name := 'DISbook user'; END IF;

  v_conversation_url := 'https://disbook.it/messages?conversation=' || NEW.conversation_id::text;

  SELECT decrypted_secret INTO v_service_key
  FROM vault.decrypted_secrets
  WHERE name = 'email_queue_service_role_key'
  LIMIT 1;

  IF v_service_key IS NULL THEN
    INSERT INTO public.message_notification_log (message_id, sender_user_id, recipient_user_id, recipient_email, status, error_message)
    VALUES (NEW.id, NEW.sender_id, v_recipient_id, v_recipient_email, 'failed', 'Email queue service credential not found');
    RAISE WARNING 'email_queue_service_role_key not found; skipping message email';
    RETURN NEW;
  END IF;

  INSERT INTO public.message_notification_log (message_id, sender_user_id, recipient_user_id, recipient_email, status)
  VALUES (NEW.id, NEW.sender_id, v_recipient_id, v_recipient_email, 'pending')
  RETURNING id INTO v_log_id;

  BEGIN
    SELECT net.http_post(
      url := v_supabase_url || '/functions/v1/send-transactional-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || v_service_key
      ),
      body := jsonb_build_object(
        'templateName', 'new-message',
        'recipientEmail', v_recipient_email,
        'idempotencyKey', 'new-message-' || NEW.id::text,
        'messageId', NEW.id::text,
        'notificationLogId', v_log_id::text,
        'templateData', jsonb_build_object(
          'senderName', v_sender_name,
          'conversationUrl', v_conversation_url
        )
      )
    ) INTO v_http_request_id;

    UPDATE public.message_notification_log
       SET provider_response = 'Queued backend email request ' || v_http_request_id::text
     WHERE id = v_log_id;
  EXCEPTION WHEN OTHERS THEN
    UPDATE public.message_notification_log
       SET status = 'failed',
           error_message = 'Failed to enqueue new-message email: ' || SQLERRM
     WHERE id = v_log_id;
    RAISE WARNING 'Failed to enqueue new-message email: %', SQLERRM;
  END;

  RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION public.notify_new_message_email() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.notify_new_message_email() TO service_role;

UPDATE public.listings
   SET item_type = 'keyboard',
       book_id = 'generic-keyboard',
       class_year = 'Generic MYP',
       program = 'MYP',
       subject = 'Keyboard',
       title = CASE WHEN lower(title) LIKE '%keyboard%' OR lower(title) LIKE '%tastiera%'
                    THEN 'Keyboard / Tastiera (4 ottave, 49 tasti)'
                    ELSE title END,
       updated_at = now()
 WHERE (lower(title) LIKE '%keyboard%' OR lower(title) LIKE '%tastiera%' OR book_id IN ('myp1-16','myp2-18'))
   AND item_type <> 'keyboard';

UPDATE public.listings
   SET item_type = 'sphero',
       book_id = 'generic-sphero',
       class_year = 'Generic MYP',
       program = 'MYP',
       subject = 'Sphero Mini Robot',
       title = 'Sphero Mini Robot',
       updated_at = now()
 WHERE (lower(title) LIKE '%sphero%' OR book_id IN ('myp1-20','myp2-23'))
   AND item_type <> 'sphero';