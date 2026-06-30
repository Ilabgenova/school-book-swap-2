
-- 1) Harden listing-photos storage SELECT policy: verify seller_uid in path matches listing's seller_id
DROP POLICY IF EXISTS "Sellers and conversation participants can view listing photos" ON storage.objects;
DROP POLICY IF EXISTS "listing_photos_select" ON storage.objects;
DROP POLICY IF EXISTS "Listing photos select" ON storage.objects;

CREATE POLICY "listing_photos_select_strict"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'listing-photos'
  AND (
    -- Owner: first folder segment must equal auth.uid()
    (storage.foldername(name))[1] = auth.uid()::text
    OR
    -- Conversation participant: path must be {seller_uid}/{listing_id}/...
    EXISTS (
      SELECT 1
      FROM public.listings l
      JOIN public.conversations c ON c.listing_id = l.id
      WHERE (storage.foldername(name))[1] = l.seller_id::text
        AND (storage.foldername(name))[2] = l.id::text
        AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
    )
  )
);

-- 2) user_roles: add explicit restrictive policies blocking client writes; only service_role manages roles
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM authenticated, anon;

DROP POLICY IF EXISTS "No client inserts on user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "No client updates on user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "No client deletes on user_roles" ON public.user_roles;

CREATE POLICY "No client inserts on user_roles"
ON public.user_roles FOR INSERT TO authenticated, anon
WITH CHECK (false);

CREATE POLICY "No client updates on user_roles"
ON public.user_roles FOR UPDATE TO authenticated, anon
USING (false) WITH CHECK (false);

CREATE POLICY "No client deletes on user_roles"
ON public.user_roles FOR DELETE TO authenticated, anon
USING (false);

-- 3) GraphQL: revoke SELECT from authenticated on user_roles so it's not exposed via GraphQL schema discovery.
-- has_role() runs as invoker; grant it back narrowly via a SECURITY DEFINER wrapper.
REVOKE SELECT ON public.user_roles FROM authenticated, anon;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;
