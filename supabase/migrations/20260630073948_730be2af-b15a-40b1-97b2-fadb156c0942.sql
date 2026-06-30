
-- 1) Revoke accidental anon SELECT
REVOKE SELECT ON public.bought_books FROM anon;
REVOKE SELECT ON public.profiles_private FROM anon;

-- 2) Drop the broader listing-photos SELECT policy (keep the strict one)
DROP POLICY IF EXISTS "Listing photos viewable by participants" ON storage.objects;

-- 3) Tighten profiles SELECT: only counterparties or sellers of active listings
DROP POLICY IF EXISTS "Authenticated can view public profiles" ON public.profiles;

CREATE POLICY "Counterparties can view profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE (c.buyer_id = auth.uid() AND c.seller_id = profiles.user_id)
         OR (c.seller_id = auth.uid() AND c.buyer_id = profiles.user_id)
    )
    OR EXISTS (
      SELECT 1 FROM public.transactions t
      WHERE (t.buyer_id = auth.uid() AND t.seller_id = profiles.user_id)
         OR (t.seller_id = auth.uid() AND t.buyer_id = profiles.user_id)
    )
    OR EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.seller_id = profiles.user_id AND l.status = 'active'
    )
  );
