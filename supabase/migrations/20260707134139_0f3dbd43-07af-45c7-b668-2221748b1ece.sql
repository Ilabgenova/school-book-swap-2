CREATE OR REPLACE FUNCTION public.public_get_co2_impact()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'books_reused', s.books_reused,
    'co2_kg_per_book', s.co2_kg_per_book,
    'total_co2_avoided_kg', s.co2_kg_per_book * s.books_reused,
    'source_note', s.source_note
  )
  FROM public.co2_public_stats s
  WHERE s.id = true;
$$;

GRANT EXECUTE ON FUNCTION public.public_get_co2_impact() TO anon, authenticated;

SELECT private.refresh_co2_public_stats();