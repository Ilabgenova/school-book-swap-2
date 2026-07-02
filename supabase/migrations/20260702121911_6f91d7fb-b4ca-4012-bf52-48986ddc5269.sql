
-- 1. messages UPDATE tightening
DROP POLICY IF EXISTS "Recipients mark read" ON public.messages;
REVOKE UPDATE ON public.messages FROM authenticated;
GRANT UPDATE (read_at) ON public.messages TO authenticated;
CREATE POLICY "Recipients mark read" ON public.messages
  FOR UPDATE TO authenticated
  USING (
    sender_id <> auth.uid()
    AND EXISTS (SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
        AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid()))
  )
  WITH CHECK (
    sender_id <> auth.uid()
    AND EXISTS (SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
        AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid()))
  );

-- 2. profiles column-level UPDATE
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (
  first_name, last_name, avatar_url, bio,
  is_from_dis, previous_grade, previous_program,
  school, class_year
) ON public.profiles TO authenticated;

-- 3. private schema functions
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT private.has_role(auth.uid(), 'admin'::public.app_role)
$$;

CREATE OR REPLACE FUNCTION private.is_account_active(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    (SELECT account_status = 'active'
       OR (account_status = 'suspended' AND suspension_until IS NOT NULL AND suspension_until < now())
     FROM public.profiles WHERE user_id = _user_id), false);
$$;

REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.is_account_active(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_account_active(uuid) TO authenticated;

-- 4. Recreate all policies referencing the public wrappers to reference private ones
-- user_ratings
DROP POLICY IF EXISTS "Authenticated can view ratings" ON public.user_ratings;
CREATE POLICY "Involved parties view ratings" ON public.user_ratings
  FOR SELECT TO authenticated
  USING (auth.uid() = rater_id OR auth.uid() = rated_user_id OR private.is_admin());

-- user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view user roles" ON public.user_roles;
CREATE POLICY "Admins can view user roles" ON public.user_roles FOR SELECT TO authenticated USING (private.is_admin());

-- listings
DROP POLICY IF EXISTS "Admins can view all listings" ON public.listings;
DROP POLICY IF EXISTS "Admins can update any listing" ON public.listings;
DROP POLICY IF EXISTS "Admins can delete any listing" ON public.listings;
DROP POLICY IF EXISTS "Active listings viewable by authenticated" ON public.listings;
DROP POLICY IF EXISTS "Active sellers create listings" ON public.listings;
CREATE POLICY "Admins can view all listings" ON public.listings FOR SELECT TO authenticated USING (private.is_admin());
CREATE POLICY "Admins can update any listing" ON public.listings FOR UPDATE TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());
CREATE POLICY "Admins can delete any listing" ON public.listings FOR DELETE TO authenticated USING (private.is_admin());
CREATE POLICY "Active listings viewable by authenticated" ON public.listings FOR SELECT TO authenticated
  USING ((seller_id = auth.uid()) OR private.is_admin() OR ((status = 'active'::listing_status) AND private.is_account_active(seller_id)));
CREATE POLICY "Active sellers create listings" ON public.listings FOR INSERT TO authenticated
  WITH CHECK ((auth.uid() = seller_id) AND private.is_account_active(auth.uid()));

-- book_catalog
DROP POLICY IF EXISTS "Admins can insert book catalog" ON public.book_catalog;
DROP POLICY IF EXISTS "Admins can update book catalog" ON public.book_catalog;
DROP POLICY IF EXISTS "Admins can delete book catalog" ON public.book_catalog;
CREATE POLICY "Admins can insert book catalog" ON public.book_catalog FOR INSERT TO authenticated WITH CHECK (private.is_admin());
CREATE POLICY "Admins can update book catalog" ON public.book_catalog FOR UPDATE TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());
CREATE POLICY "Admins can delete book catalog" ON public.book_catalog FOR DELETE TO authenticated USING (private.is_admin());

-- book_imports & book_import_rows
DROP POLICY IF EXISTS "Admins manage book imports" ON public.book_imports;
DROP POLICY IF EXISTS "Admins manage book import rows" ON public.book_import_rows;
CREATE POLICY "Admins manage book imports" ON public.book_imports FOR ALL TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());
CREATE POLICY "Admins manage book import rows" ON public.book_import_rows FOR ALL TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());

-- user_moderation_log
DROP POLICY IF EXISTS "Admins read moderation log" ON public.user_moderation_log;
DROP POLICY IF EXISTS "Admins insert moderation log" ON public.user_moderation_log;
CREATE POLICY "Admins read moderation log" ON public.user_moderation_log FOR SELECT TO authenticated USING (private.is_admin());
CREATE POLICY "Admins insert moderation log" ON public.user_moderation_log FOR INSERT TO authenticated WITH CHECK (private.is_admin());

-- reports
DROP POLICY IF EXISTS "Users view own reports" ON public.reports;
DROP POLICY IF EXISTS "Admins update reports" ON public.reports;
CREATE POLICY "Users view own reports" ON public.reports FOR SELECT TO authenticated USING ((auth.uid() = reporter_id) OR private.is_admin());
CREATE POLICY "Admins update reports" ON public.reports FOR UPDATE TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());

-- wanted_books
DROP POLICY IF EXISTS "Authenticated view wanted books" ON public.wanted_books;
DROP POLICY IF EXISTS "Active users add wanted books" ON public.wanted_books;
CREATE POLICY "Authenticated view wanted books" ON public.wanted_books FOR SELECT TO authenticated
  USING ((user_id = auth.uid()) OR private.is_admin() OR private.is_account_active(user_id));
CREATE POLICY "Active users add wanted books" ON public.wanted_books FOR INSERT TO authenticated
  WITH CHECK ((auth.uid() = user_id) AND private.is_account_active(auth.uid()));

-- messages insert
DROP POLICY IF EXISTS "Active users send messages" ON public.messages;
CREATE POLICY "Active users send messages" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (
    (auth.uid() = sender_id) AND private.is_account_active(auth.uid())
    AND EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = messages.conversation_id AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid()))
  );

-- profiles admin policies
DROP POLICY IF EXISTS "Admins read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins update any profile" ON public.profiles;
CREATE POLICY "Admins read all profiles" ON public.profiles FOR SELECT TO authenticated USING (private.is_admin());
CREATE POLICY "Admins update any profile" ON public.profiles FOR UPDATE TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());

-- Drop public wrappers
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.is_account_active(uuid);

-- 5. Admin moderation RPC
CREATE OR REPLACE FUNCTION public.admin_moderate_user(
  _user_id uuid, _action text, _reason text,
  _internal_note text DEFAULT NULL, _suspension_until timestamptz DEFAULT NULL
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _admin uuid := auth.uid();
BEGIN
  IF NOT private.is_admin() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  IF _action NOT IN ('blocked','suspended','unblocked') THEN RAISE EXCEPTION 'Invalid action'; END IF;

  IF _action = 'blocked' THEN
    UPDATE public.profiles SET account_status='blocked', blocked_at=now(), blocked_by=_admin,
      block_reason=_reason, admin_notes=COALESCE(_internal_note, admin_notes),
      suspension_until=NULL, updated_at=now() WHERE user_id=_user_id;
    UPDATE public.listings SET status='archived' WHERE seller_id=_user_id AND status='active';
  ELSIF _action = 'suspended' THEN
    UPDATE public.profiles SET account_status='suspended', blocked_by=_admin,
      block_reason=_reason, admin_notes=COALESCE(_internal_note, admin_notes),
      suspension_until=_suspension_until, updated_at=now() WHERE user_id=_user_id;
  ELSE
    UPDATE public.profiles SET account_status='active', blocked_at=NULL, blocked_by=NULL,
      block_reason=NULL, suspension_until=NULL, updated_at=now() WHERE user_id=_user_id;
  END IF;

  INSERT INTO public.user_moderation_log(user_id, admin_id, action, reason, internal_note, suspension_until)
  VALUES (_user_id, _admin, _action, _reason, _internal_note,
    CASE WHEN _action='suspended' THEN _suspension_until ELSE NULL END);
END; $$;

REVOKE ALL ON FUNCTION public.admin_moderate_user(uuid,text,text,text,timestamptz) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_moderate_user(uuid,text,text,text,timestamptz) TO authenticated;
