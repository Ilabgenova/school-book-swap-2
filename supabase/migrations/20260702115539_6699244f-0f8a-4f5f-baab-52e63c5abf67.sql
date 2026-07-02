ALTER TABLE public.book_catalog ADD COLUMN IF NOT EXISTS academic_year TEXT NOT NULL DEFAULT '2026-2027';
ALTER TABLE public.book_catalog ADD COLUMN IF NOT EXISTS reusable_status TEXT;
ALTER TABLE public.book_imports ADD COLUMN IF NOT EXISTS academic_year TEXT NOT NULL DEFAULT '2026-2027';
CREATE INDEX IF NOT EXISTS book_catalog_academic_year_idx ON public.book_catalog(academic_year);
CREATE INDEX IF NOT EXISTS book_catalog_isbn_year_idx ON public.book_catalog(isbn, academic_year);