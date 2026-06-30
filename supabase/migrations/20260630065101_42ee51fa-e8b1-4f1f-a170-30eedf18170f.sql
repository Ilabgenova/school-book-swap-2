
-- 1. has_role -> SECURITY INVOKER (users can read their own roles via existing RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 2. Profiles: restrict SELECT to the owner only
DROP POLICY IF EXISTS "Profiles viewable by authenticated" ON public.profiles;
CREATE POLICY "Users view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. Listings: remove anonymous/public read access
DROP POLICY IF EXISTS "Anyone can view active listings" ON public.listings;

-- 4. Revoke GraphQL/Data-API visibility from anon on all public tables
REVOKE SELECT ON public.profiles FROM anon;
REVOKE SELECT ON public.listings FROM anon;
REVOKE SELECT ON public.conversations FROM anon;
REVOKE SELECT ON public.messages FROM anon;
REVOKE SELECT ON public.transactions FROM anon;
REVOKE SELECT ON public.user_ratings FROM anon;
REVOKE SELECT ON public.user_roles FROM anon;
REVOKE SELECT ON public.wanted_books FROM anon;
REVOKE SELECT ON public.book_catalog FROM anon;
REVOKE SELECT ON public.amazon_links FROM anon;

-- 5. Hide internal tables from signed-in users' GraphQL schema where not needed
REVOKE SELECT ON public.user_roles FROM authenticated;
GRANT SELECT ON public.user_roles TO authenticated; -- keep table-level for has_role via RLS
-- (re-grant required since policies are present; revoking GraphQL discovery is best-effort)
