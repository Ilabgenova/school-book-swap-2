
-- Roles infra (if not present)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT TO authenticated USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Amazon affiliate links table
DO $$ BEGIN
  CREATE TYPE public.amazon_link_status AS ENUM ('coming_soon','available','not_available');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE public.amazon_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_catalog_id uuid REFERENCES public.book_catalog(id) ON DELETE SET NULL,
  isbn text,
  title text NOT NULL,
  author text,
  edition text,
  subject text,
  school_year text,
  grade text,
  program text,
  amazon_url text,
  affiliate_url text,
  status public.amazon_link_status NOT NULL DEFAULT 'coming_soon',
  note text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_amazon_links_isbn ON public.amazon_links(isbn);
CREATE INDEX idx_amazon_links_year_grade ON public.amazon_links(school_year, grade);
CREATE INDEX idx_amazon_links_status ON public.amazon_links(status);

GRANT SELECT ON public.amazon_links TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.amazon_links TO authenticated;
GRANT ALL ON public.amazon_links TO service_role;

ALTER TABLE public.amazon_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view non-unavailable amazon links" ON public.amazon_links
  FOR SELECT USING (status <> 'not_available');

CREATE POLICY "Admins can insert amazon links" ON public.amazon_links
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update amazon links" ON public.amazon_links
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete amazon links" ON public.amazon_links
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_amazon_links_updated_at
  BEFORE UPDATE ON public.amazon_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
