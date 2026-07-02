-- 1) status enum
DO $$ BEGIN
  CREATE TYPE public.feedback_report_status AS ENUM ('open','in_progress','resolved','closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2) table
CREATE TABLE public.feedback_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN (
    'technical','listing','messages','translation','transaction','suspicious','suggestion','other'
  )),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  description text NOT NULL CHECK (char_length(description) BETWEEN 1 AND 4000),
  related_listing_id uuid REFERENCES public.listings(id) ON DELETE SET NULL,
  status public.feedback_report_status NOT NULL DEFAULT 'open',
  admin_notes text,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3) grants (auth-scoped only; no anon)
GRANT SELECT, INSERT, UPDATE ON public.feedback_reports TO authenticated;
GRANT ALL ON public.feedback_reports TO service_role;

-- 4) RLS
ALTER TABLE public.feedback_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own feedback"
  ON public.feedback_reports FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.current_user_is_admin());

CREATE POLICY "Users create own feedback"
  ON public.feedback_reports FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins update feedback"
  ON public.feedback_reports FOR UPDATE TO authenticated
  USING (public.current_user_is_admin())
  WITH CHECK (public.current_user_is_admin());

-- 5) updated_at trigger
CREATE TRIGGER update_feedback_reports_updated_at
BEFORE UPDATE ON public.feedback_reports
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6) indexes
CREATE INDEX feedback_reports_user_idx ON public.feedback_reports(user_id);
CREATE INDEX feedback_reports_status_idx ON public.feedback_reports(status);

-- 7) realtime for admin badge live-update
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback_reports;