ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email_new_message_notifications boolean NOT NULL DEFAULT true;

CREATE OR REPLACE FUNCTION public.notify_new_message_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_conversation public.conversations%ROWTYPE;
  v_recipient_id uuid;
  v_recipient_email text;
  v_recipient_opt_in boolean;
  v_sender_name text;
  v_service_key text;
  v_supabase_url text := 'https://tbhstqoixqhovzgjmmss.supabase.co';
  v_conversation_url text;
BEGIN
  SELECT * INTO v_conversation FROM public.conversations WHERE id = NEW.conversation_id;
  IF NOT FOUND THEN RETURN NEW; END IF;

  IF NEW.sender_id = v_conversation.buyer_id THEN
    v_recipient_id := v_conversation.seller_id;
  ELSIF NEW.sender_id = v_conversation.seller_id THEN
    v_recipient_id := v_conversation.buyer_id;
  ELSE
    RETURN NEW;
  END IF;

  IF v_recipient_id IS NULL OR v_recipient_id = NEW.sender_id THEN RETURN NEW; END IF;

  SELECT COALESCE(email_new_message_notifications, true) INTO v_recipient_opt_in
  FROM public.profiles WHERE user_id = v_recipient_id;

  IF v_recipient_opt_in IS DISTINCT FROM true THEN RETURN NEW; END IF;

  SELECT email INTO v_recipient_email FROM auth.users WHERE id = v_recipient_id;
  IF v_recipient_email IS NULL OR v_recipient_email = '' THEN RETURN NEW; END IF;

  SELECT COALESCE(NULLIF(TRIM(first_name), ''), 'DISbook user') INTO v_sender_name
  FROM public.profiles WHERE user_id = NEW.sender_id;
  IF v_sender_name IS NULL THEN v_sender_name := 'DISbook user'; END IF;

  v_conversation_url := 'https://disbook.it/messages?conversation=' || NEW.conversation_id::text;

  SELECT decrypted_secret INTO v_service_key
  FROM vault.decrypted_secrets
  WHERE name = 'email_queue_service_role_key'
  LIMIT 1;

  IF v_service_key IS NULL THEN
    RAISE WARNING 'email_queue_service_role_key not found; skipping message email';
    RETURN NEW;
  END IF;

  BEGIN
    PERFORM net.http_post(
      url := v_supabase_url || '/functions/v1/send-transactional-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || v_service_key
      ),
      body := jsonb_build_object(
        'templateName', 'new-message',
        'recipientEmail', v_recipient_email,
        'idempotencyKey', 'new-message-' || NEW.id::text,
        'templateData', jsonb_build_object(
          'senderName', v_sender_name,
          'conversationUrl', v_conversation_url
        )
      )
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to enqueue new-message email: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_new_message_email ON public.messages;
CREATE TRIGGER trg_notify_new_message_email
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_message_email();