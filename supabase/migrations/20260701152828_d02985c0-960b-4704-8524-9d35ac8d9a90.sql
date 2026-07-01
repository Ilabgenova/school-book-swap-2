
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
$$;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

DO $$ BEGIN
  -- listings
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='listings' AND policyname='Admins can view all listings') THEN
    CREATE POLICY "Admins can view all listings" ON public.listings FOR SELECT TO authenticated USING (public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='listings' AND policyname='Admins can update any listing') THEN
    CREATE POLICY "Admins can update any listing" ON public.listings FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='listings' AND policyname='Admins can delete any listing') THEN
    CREATE POLICY "Admins can delete any listing" ON public.listings FOR DELETE TO authenticated USING (public.is_admin());
  END IF;
  -- book_catalog
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='book_catalog' AND policyname='Admins can insert book catalog') THEN
    CREATE POLICY "Admins can insert book catalog" ON public.book_catalog FOR INSERT TO authenticated WITH CHECK (public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='book_catalog' AND policyname='Admins can update book catalog') THEN
    CREATE POLICY "Admins can update book catalog" ON public.book_catalog FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='book_catalog' AND policyname='Admins can delete book catalog') THEN
    CREATE POLICY "Admins can delete book catalog" ON public.book_catalog FOR DELETE TO authenticated USING (public.is_admin());
  END IF;
  -- amazon_links
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='amazon_links' AND policyname='Admins can insert amazon links') THEN
    CREATE POLICY "Admins can insert amazon links" ON public.amazon_links FOR INSERT TO authenticated WITH CHECK (public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='amazon_links' AND policyname='Admins can update amazon links') THEN
    CREATE POLICY "Admins can update amazon links" ON public.amazon_links FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='amazon_links' AND policyname='Admins can delete amazon links') THEN
    CREATE POLICY "Admins can delete amazon links" ON public.amazon_links FOR DELETE TO authenticated USING (public.is_admin());
  END IF;
  -- user_roles read
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_roles' AND policyname='Admins can view user roles') THEN
    CREATE POLICY "Admins can view user roles" ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin());
  END IF;
END $$;

GRANT SELECT ON public.user_roles TO authenticated;
