
DROP POLICY IF EXISTS "Anyone can view non-unavailable amazon links" ON public.amazon_links;
CREATE POLICY "Authenticated can view non-unavailable amazon links" ON public.amazon_links FOR SELECT TO authenticated USING (status <> 'not_available'::amazon_link_status);
REVOKE SELECT ON public.amazon_links FROM anon;

DROP POLICY IF EXISTS "Book catalog is publicly readable" ON public.book_catalog;
CREATE POLICY "Book catalog readable by authenticated" ON public.book_catalog FOR SELECT TO authenticated USING (true);
REVOKE SELECT ON public.book_catalog FROM anon;

DROP POLICY IF EXISTS "Anyone can view ratings" ON public.user_ratings;
CREATE POLICY "Authenticated can view ratings" ON public.user_ratings FOR SELECT TO authenticated USING (true);
REVOKE SELECT ON public.user_ratings FROM anon;
