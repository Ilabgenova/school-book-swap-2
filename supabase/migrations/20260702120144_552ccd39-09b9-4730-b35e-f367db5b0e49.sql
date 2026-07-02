
-- 1) profiles column-level SELECT
REVOKE SELECT ON public.profiles FROM authenticated;
GRANT SELECT (
  id, user_id, first_name, last_name, previous_grade, previous_program,
  is_from_dis, rating_average, rating_count, completed_transactions,
  no_show_count, created_at, updated_at, school, class_year, avatar_url,
  bio, account_status
) ON public.profiles TO authenticated;

-- 2) is_admin() via private.has_role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT private.has_role(auth.uid(), 'admin'::public.app_role)
$$;

-- 3) transactions policies -> authenticated only
ALTER POLICY "Authenticated users can create transactions" ON public.transactions TO authenticated;
ALTER POLICY "Participants can update transactions" ON public.transactions TO authenticated;
ALTER POLICY "Users can view own transactions" ON public.transactions TO authenticated;

-- 4) Revoke execute on internal trigger/security-definer functions from authenticated
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_user_rating() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_completed_transactions() FROM authenticated, anon, PUBLIC;
