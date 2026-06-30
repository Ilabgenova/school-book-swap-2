
-- 1) Private phone table
CREATE TABLE IF NOT EXISTS public.profiles_private (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles_private TO authenticated;
GRANT ALL ON public.profiles_private TO service_role;
ALTER TABLE public.profiles_private ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners read own private profile" ON public.profiles_private;
CREATE POLICY "Owners read own private profile" ON public.profiles_private
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Owners insert own private profile" ON public.profiles_private;
CREATE POLICY "Owners insert own private profile" ON public.profiles_private
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Owners update own private profile" ON public.profiles_private;
CREATE POLICY "Owners update own private profile" ON public.profiles_private
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Owners delete own private profile" ON public.profiles_private;
CREATE POLICY "Owners delete own private profile" ON public.profiles_private
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

INSERT INTO public.profiles_private (user_id, phone)
SELECT user_id, phone FROM public.profiles WHERE phone IS NOT NULL
ON CONFLICT (user_id) DO UPDATE SET phone = EXCLUDED.phone;

ALTER TABLE public.profiles DROP COLUMN IF EXISTS phone;

-- 2) Counterparty profile visibility (phone is no longer in this table)
GRANT SELECT ON public.profiles TO authenticated;
DROP POLICY IF EXISTS "Authenticated can view public profiles" ON public.profiles;
CREATE POLICY "Authenticated can view public profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

-- 3) Private has_role
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO postgres, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;

-- Rebuild all amazon_links policies referencing has_role so the old function can be dropped
DROP POLICY IF EXISTS "Admins can delete amazon links" ON public.amazon_links;
DROP POLICY IF EXISTS "Admins can update amazon links" ON public.amazon_links;
DROP POLICY IF EXISTS "Admins can insert amazon links" ON public.amazon_links;

CREATE POLICY "Admins can delete amazon links" ON public.amazon_links
  FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update amazon links" ON public.amazon_links
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can insert amazon links" ON public.amazon_links
  FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- 4) Lock trigger functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_user_rating() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_completed_transactions() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- 5) Hide user_roles from Data API/GraphQL
REVOKE ALL ON public.user_roles FROM anon, authenticated;
