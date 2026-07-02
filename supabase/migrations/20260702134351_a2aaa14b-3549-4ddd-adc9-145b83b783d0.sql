
-- ============================================================
-- Fix 1: messages_update_allows_body_tampering
-- Restrict UPDATE on public.messages to the read_at column only.
-- ============================================================
REVOKE UPDATE ON public.messages FROM authenticated;
GRANT UPDATE (read_at) ON public.messages TO authenticated;

CREATE OR REPLACE FUNCTION public.messages_prevent_body_tamper()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF private.is_admin() THEN RETURN NEW; END IF;
  IF NEW.id IS DISTINCT FROM OLD.id
    OR NEW.conversation_id IS DISTINCT FROM OLD.conversation_id
    OR NEW.sender_id IS DISTINCT FROM OLD.sender_id
    OR NEW.body IS DISTINCT FROM OLD.body
    OR NEW.created_at IS DISTINCT FROM OLD.created_at
  THEN
    RAISE EXCEPTION 'Only read_at may be updated on messages';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS messages_prevent_body_tamper_trg ON public.messages;
CREATE TRIGGER messages_prevent_body_tamper_trg
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.messages_prevent_body_tamper();

-- ============================================================
-- Fix 2: profiles_moderation_columns_writable_by_user
-- Block non-admin writes to moderation columns via trigger AND
-- explicit column-level revokes (defense in depth).
-- ============================================================
REVOKE UPDATE (account_status, blocked_at, blocked_by, block_reason, suspension_until, admin_notes,
               rating_average, rating_count, no_show_count, completed_transactions)
  ON public.profiles FROM authenticated;

CREATE OR REPLACE FUNCTION public.profiles_protect_moderation_columns()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF private.is_admin() THEN RETURN NEW; END IF;
  IF NEW.account_status IS DISTINCT FROM OLD.account_status
    OR NEW.blocked_at IS DISTINCT FROM OLD.blocked_at
    OR NEW.blocked_by IS DISTINCT FROM OLD.blocked_by
    OR NEW.block_reason IS DISTINCT FROM OLD.block_reason
    OR NEW.suspension_until IS DISTINCT FROM OLD.suspension_until
    OR NEW.admin_notes IS DISTINCT FROM OLD.admin_notes
    OR NEW.rating_average IS DISTINCT FROM OLD.rating_average
    OR NEW.rating_count IS DISTINCT FROM OLD.rating_count
    OR NEW.no_show_count IS DISTINCT FROM OLD.no_show_count
    OR NEW.completed_transactions IS DISTINCT FROM OLD.completed_transactions
  THEN
    RAISE EXCEPTION 'Moderation and reputation columns cannot be updated by users';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_protect_moderation_columns_trg ON public.profiles;
CREATE TRIGGER profiles_protect_moderation_columns_trg
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.profiles_protect_moderation_columns();

-- ============================================================
-- Fix 3: SUPA_authenticated_security_definer_function_executable
-- Move admin_moderate_user out of the exposed API schema.
-- Expose only a SECURITY INVOKER wrapper in public that delegates
-- to the SECURITY DEFINER implementation in the private schema.
-- ============================================================

-- Implementation in private schema (not exposed via PostgREST).
CREATE OR REPLACE FUNCTION private.admin_moderate_user(
  _user_id uuid, _action text, _reason text,
  _internal_note text DEFAULT NULL,
  _suspension_until timestamptz DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _admin uuid := auth.uid();
BEGIN
  IF NOT private.is_admin() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  IF _action NOT IN ('blocked','suspended','unblocked') THEN RAISE EXCEPTION 'Invalid action'; END IF;

  IF _action = 'blocked' THEN
    UPDATE public.profiles SET account_status='blocked', blocked_at=now(), blocked_by=_admin,
      block_reason=_reason, admin_notes=COALESCE(_internal_note, admin_notes),
      suspension_until=NULL, updated_at=now() WHERE user_id=_user_id;
    UPDATE public.listings SET status='archived' WHERE seller_id=_user_id AND status='active';
  ELSIF _action = 'suspended' THEN
    UPDATE public.profiles SET account_status='suspended', blocked_by=_admin,
      block_reason=_reason, admin_notes=COALESCE(_internal_note, admin_notes),
      suspension_until=_suspension_until, updated_at=now() WHERE user_id=_user_id;
  ELSE
    UPDATE public.profiles SET account_status='active', blocked_at=NULL, blocked_by=NULL,
      block_reason=NULL, suspension_until=NULL, updated_at=now() WHERE user_id=_user_id;
  END IF;

  INSERT INTO public.user_moderation_log(user_id, admin_id, action, reason, internal_note, suspension_until)
  VALUES (_user_id, _admin, _action, _reason, _internal_note,
    CASE WHEN _action='suspended' THEN _suspension_until ELSE NULL END);
END;
$$;

REVOKE EXECUTE ON FUNCTION private.admin_moderate_user(uuid, text, text, text, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.admin_moderate_user(uuid, text, text, text, timestamptz) TO authenticated;

-- Replace the public function with a thin SECURITY INVOKER wrapper.
DROP FUNCTION IF EXISTS public.admin_moderate_user(uuid, text, text, text, timestamptz);

CREATE OR REPLACE FUNCTION public.admin_moderate_user(
  _user_id uuid, _action text, _reason text,
  _internal_note text DEFAULT NULL,
  _suspension_until timestamptz DEFAULT NULL
)
RETURNS void
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT private.admin_moderate_user(_user_id, _action, _reason, _internal_note, _suspension_until);
$$;

REVOKE EXECUTE ON FUNCTION public.admin_moderate_user(uuid, text, text, text, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_moderate_user(uuid, text, text, text, timestamptz) TO authenticated;
