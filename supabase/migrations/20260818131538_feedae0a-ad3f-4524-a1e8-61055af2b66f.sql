-- 1) app_settings: remove broad authenticated read (admins keep full access via existing policy)
DROP POLICY IF EXISTS "settings readable by authenticated" ON public.app_settings;

-- 2) profiles: remove full-row counterparty read access
DROP POLICY IF EXISTS "Counterparties can view profile" ON public.profiles;

-- Safe masked lookup for counterparties / listing sellers
CREATE OR REPLACE FUNCTION public.get_public_profile_names(_user_ids uuid[])
RETURNS TABLE (user_id uuid, display_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.user_id,
         CASE
           WHEN coalesce(btrim(p.first_name), '') = '' THEN 'DISbook user'
           WHEN coalesce(btrim(p.last_name), '') = '' THEN btrim(p.first_name)
           ELSE btrim(p.first_name) || ' ' || upper(left(btrim(p.last_name), 1)) || '.'
         END AS display_name
  FROM public.profiles p
  WHERE p.user_id = ANY(_user_ids)
    AND auth.uid() IS NOT NULL
    AND (
      p.user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.conversations c
        WHERE (c.buyer_id = auth.uid() AND c.seller_id = p.user_id)
           OR (c.seller_id = auth.uid() AND c.buyer_id = p.user_id)
      )
      OR EXISTS (
        SELECT 1 FROM public.transactions t
        WHERE (t.buyer_id = auth.uid() AND t.seller_id = p.user_id)
           OR (t.seller_id = auth.uid() AND t.buyer_id = p.user_id)
      )
      OR EXISTS (
        SELECT 1 FROM public.listings l
        WHERE l.seller_id = p.user_id AND l.status = 'active'::listing_status
      )
    )
$$;

REVOKE ALL ON FUNCTION public.get_public_profile_names(uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_public_profile_names(uuid[]) TO authenticated;