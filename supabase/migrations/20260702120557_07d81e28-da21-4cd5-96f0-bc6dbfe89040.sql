
ALTER TABLE public.book_catalog
  ADD COLUMN IF NOT EXISTS purchasable_from_former_families boolean,
  ADD COLUMN IF NOT EXISTS former_class_source text,
  ADD COLUMN IF NOT EXISTS reuse_check_status text,
  ADD COLUMN IF NOT EXISTS reuse_match_type text,
  ADD COLUMN IF NOT EXISTS reuse_notes text,
  ADD COLUMN IF NOT EXISTS previous_year_book_id uuid,
  ADD COLUMN IF NOT EXISTS previous_year text,
  ADD COLUMN IF NOT EXISTS column_m_raw text;

ALTER TABLE public.book_import_rows
  ADD COLUMN IF NOT EXISTS purchasable_from_former_families boolean,
  ADD COLUMN IF NOT EXISTS former_class_source text,
  ADD COLUMN IF NOT EXISTS reuse_check_status text,
  ADD COLUMN IF NOT EXISTS reuse_match_type text,
  ADD COLUMN IF NOT EXISTS reuse_notes text,
  ADD COLUMN IF NOT EXISTS previous_year_book_id uuid,
  ADD COLUMN IF NOT EXISTS column_m_raw text,
  ADD COLUMN IF NOT EXISTS matched_previous_isbn text;

CREATE INDEX IF NOT EXISTS book_catalog_reuse_status_idx
  ON public.book_catalog (academic_year, reuse_check_status);
CREATE INDEX IF NOT EXISTS book_catalog_former_class_idx
  ON public.book_catalog (former_class_source);
