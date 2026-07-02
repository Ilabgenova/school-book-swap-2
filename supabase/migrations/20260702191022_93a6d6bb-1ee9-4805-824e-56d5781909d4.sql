
REVOKE EXECUTE ON FUNCTION public.admin_list_users_with_auth() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_users_with_auth() TO authenticated;
