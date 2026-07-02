
-- 1. Profile status fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS account_status text NOT NULL DEFAULT 'active' CHECK (account_status IN ('active','suspended','blocked','under_review')),
  ADD COLUMN IF NOT EXISTS blocked_at timestamptz,
  ADD COLUMN IF NOT EXISTS blocked_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS block_reason text,
  ADD COLUMN IF NOT EXISTS suspension_until timestamptz,
  ADD COLUMN IF NOT EXISTS admin_notes text;

-- 2. Helper: is user account currently active (not blocked / not currently suspended)
CREATE OR REPLACE FUNCTION public.is_account_active(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT
       account_status = 'active'
       OR (account_status = 'suspended' AND suspension_until IS NOT NULL AND suspension_until < now())
     FROM public.profiles WHERE user_id = _user_id),
    true  -- if no profile row yet, allow (handle_new_user hasn't run edge case)
  );
$$;
GRANT EXECUTE ON FUNCTION public.is_account_active(uuid) TO authenticated;

-- 3. book_imports
CREATE TABLE IF NOT EXISTS public.book_imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  file_name text NOT NULL,
  school_year text,
  total_rows integer NOT NULL DEFAULT 0,
  imported_rows integer NOT NULL DEFAULT 0,
  skipped_rows integer NOT NULL DEFAULT 0,
  failed_rows integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded','processed','imported','partially_imported','failed')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_imports TO authenticated;
GRANT ALL ON public.book_imports TO service_role;
ALTER TABLE public.book_imports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage book imports" ON public.book_imports FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER update_book_imports_updated_at BEFORE UPDATE ON public.book_imports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. book_import_rows
CREATE TABLE IF NOT EXISTS public.book_import_rows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  import_id uuid NOT NULL REFERENCES public.book_imports(id) ON DELETE CASCADE,
  row_number integer NOT NULL,
  raw_data jsonb,
  isbn text,
  title text,
  author text,
  publisher text,
  edition text,
  publication_year text,
  class_year text,
  programme text,
  subject text,
  required_optional text,
  notes text,
  lookup_status text,
  validation_status text,
  warning_message text,
  import_status text NOT NULL DEFAULT 'pending' CHECK (import_status IN ('pending','ready','duplicate_db','duplicate_file','missing_isbn','invalid_isbn','missing_class','unsupported_class','needs_review','imported','skipped','failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS book_import_rows_import_idx ON public.book_import_rows(import_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_import_rows TO authenticated;
GRANT ALL ON public.book_import_rows TO service_role;
ALTER TABLE public.book_import_rows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage book import rows" ON public.book_import_rows FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER update_book_import_rows_updated_at BEFORE UPDATE ON public.book_import_rows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. user_moderation_log
CREATE TABLE IF NOT EXISTS public.user_moderation_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL CHECK (action IN ('blocked','suspended','unblocked','under_review','note_added')),
  reason text,
  internal_note text,
  suspension_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS moderation_log_user_idx ON public.user_moderation_log(user_id);
GRANT SELECT, INSERT ON public.user_moderation_log TO authenticated;
GRANT ALL ON public.user_moderation_log TO service_role;
ALTER TABLE public.user_moderation_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read moderation log" ON public.user_moderation_log FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins insert moderation log" ON public.user_moderation_log FOR INSERT TO authenticated WITH CHECK (public.is_admin());

-- 6. reports
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('listing','wanted','user','message')),
  target_id uuid NOT NULL,
  reason text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','dismissed','actioned')),
  admin_notes text,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS reports_status_idx ON public.reports(status);
GRANT SELECT, INSERT, UPDATE ON public.reports TO authenticated;
GRANT ALL ON public.reports TO service_role;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users create reports" ON public.reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users view own reports" ON public.reports FOR SELECT TO authenticated USING (auth.uid() = reporter_id OR public.is_admin());
CREATE POLICY "Admins update reports" ON public.reports FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Enforce blocking on listings/wanted/messages via RLS
-- Listings: replace public SELECT to hide listings of blocked/suspended sellers
DROP POLICY IF EXISTS "Active listings viewable by authenticated" ON public.listings;
CREATE POLICY "Active listings viewable by authenticated" ON public.listings FOR SELECT TO authenticated
  USING (
    seller_id = auth.uid()
    OR public.is_admin()
    OR (status = 'active' AND public.is_account_active(seller_id))
  );

-- Listings INSERT: enforce active account
DROP POLICY IF EXISTS "Sellers create own listings" ON public.listings;
DROP POLICY IF EXISTS "Users insert own listings" ON public.listings;
DROP POLICY IF EXISTS "Users can insert own listings" ON public.listings;
CREATE POLICY "Active sellers create listings" ON public.listings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = seller_id AND public.is_account_active(auth.uid()));

-- Wanted books SELECT: hide from blocked users' posts
DROP POLICY IF EXISTS "Authenticated users can view wanted books" ON public.wanted_books;
CREATE POLICY "Authenticated view wanted books" ON public.wanted_books FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin() OR public.is_account_active(user_id));

-- Wanted INSERT: enforce active
DROP POLICY IF EXISTS "Users can add their own wanted books" ON public.wanted_books;
CREATE POLICY "Active users add wanted books" ON public.wanted_books FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.is_account_active(auth.uid()));

-- Messages INSERT: enforce active
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users insert own messages" ON public.messages;
CREATE POLICY "Active users send messages" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND public.is_account_active(auth.uid())
    AND EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = messages.conversation_id AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid()))
  );

-- 8. Admin can update profiles for moderation
DROP POLICY IF EXISTS "Admins update any profile" ON public.profiles;
CREATE POLICY "Admins update any profile" ON public.profiles FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 9. Admin can read all profiles
DROP POLICY IF EXISTS "Admins read all profiles" ON public.profiles;
CREATE POLICY "Admins read all profiles" ON public.profiles FOR SELECT TO authenticated
  USING (public.is_admin());
