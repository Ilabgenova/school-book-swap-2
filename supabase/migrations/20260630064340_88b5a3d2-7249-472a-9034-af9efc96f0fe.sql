
-- 1) Profiles: remove public-role policies (phone exposure)
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
REVOKE SELECT ON public.profiles FROM anon;

-- 2) Storage listing-photos: tighten SELECT to seller or conversation participants
DROP POLICY IF EXISTS "Listing photos viewable by authenticated" ON storage.objects;
CREATE POLICY "Listing photos viewable by participants"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'listing-photos'
  AND (
    (storage.foldername(name))[1] = (auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.listing_id::text = (storage.foldername(name))[2]
        AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
    )
  )
);

-- 3) SECURITY DEFINER functions: revoke EXECUTE from anon/authenticated where not needed
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_user_rating() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_completed_transactions() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
-- has_role is referenced by RLS policies — keep it callable by authenticated, revoke from anon/public
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;

-- 4) pg_graphql exposure: revoke anon SELECT on tables that should require sign-in
REVOKE SELECT ON public.conversations FROM anon;
REVOKE SELECT ON public.messages FROM anon;
REVOKE SELECT ON public.user_roles FROM anon;
REVOKE SELECT ON public.wanted_books FROM anon;
REVOKE SELECT ON public.profiles FROM anon;
