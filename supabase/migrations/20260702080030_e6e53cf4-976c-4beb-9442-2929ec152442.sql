
-- 1. admin_notes_profile_leak: column-level grant on profiles
REVOKE SELECT ON public.profiles FROM authenticated;
GRANT SELECT (
  id, user_id, first_name, last_name, school, class_year, avatar_url, bio,
  is_from_dis, previous_grade, previous_program,
  rating_average, rating_count, completed_transactions, no_show_count,
  account_status, created_at, updated_at
) ON public.profiles TO authenticated;

-- 2. conversation_seller_id_spoof: enforce seller_id matches listing
DROP POLICY IF EXISTS "Buyers create conversations" ON public.conversations;
CREATE POLICY "Buyers create conversations" ON public.conversations
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = buyer_id
    AND EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_id
        AND l.seller_id = conversations.seller_id
        AND l.status = 'active'
    )
  );

-- 3 & 4. Lock down SECURITY DEFINER function execution
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_user_rating() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_completed_transactions() FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.is_account_active(uuid) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.is_account_active(uuid) TO authenticated, service_role;

-- 5. is_account_active_suspended_bypass: default to false when no profile row
CREATE OR REPLACE FUNCTION public.is_account_active(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT COALESCE(
    (SELECT
       account_status = 'active'
       OR (account_status = 'suspended' AND suspension_until IS NOT NULL AND suspension_until < now())
     FROM public.profiles WHERE user_id = _user_id),
    false
  );
$function$;

-- 6. messages_duplicate_insert_policies: drop the permissive duplicate
DROP POLICY IF EXISTS "Participants send messages" ON public.messages;
