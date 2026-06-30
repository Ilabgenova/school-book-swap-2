
-- 1. Tag every listing with a school year (default = current "last year" list)
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS school_year TEXT NOT NULL DEFAULT '2025-2026';

CREATE INDEX IF NOT EXISTS listings_school_year_idx ON public.listings (school_year);
CREATE INDEX IF NOT EXISTS listings_isbn_idx ON public.listings (isbn);

-- 2. Official book catalog: holds both last-year and (later) new-year lists
CREATE TABLE IF NOT EXISTS public.book_catalog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_year TEXT NOT NULL,
  program TEXT NOT NULL,
  grade TEXT NOT NULL,
  subject TEXT,
  title TEXT NOT NULL,
  author TEXT,
  publisher TEXT,
  isbn TEXT,
  external_book_id TEXT,
  is_sellable BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (school_year, external_book_id)
);

GRANT SELECT ON public.book_catalog TO anon;
GRANT SELECT ON public.book_catalog TO authenticated;
GRANT ALL ON public.book_catalog TO service_role;

ALTER TABLE public.book_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Book catalog is publicly readable"
  ON public.book_catalog FOR SELECT
  USING (true);

CREATE INDEX IF NOT EXISTS book_catalog_isbn_idx ON public.book_catalog (isbn);
CREATE INDEX IF NOT EXISTS book_catalog_year_grade_idx ON public.book_catalog (school_year, grade);

CREATE TRIGGER update_book_catalog_updated_at
  BEFORE UPDATE ON public.book_catalog
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
