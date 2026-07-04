
INSERT INTO public.app_settings (key, value)
VALUES ('co2_source_note', to_jsonb(''::text))
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.public_get_co2_impact()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_coef numeric;
  v_note text;
  v_books_reused int;
BEGIN
  SELECT COALESCE((value)::text::numeric, 0) INTO v_coef
    FROM public.app_settings WHERE key = 'co2_kg_per_book';
  SELECT COALESCE(trim(both '"' from (value)::text), '') INTO v_note
    FROM public.app_settings WHERE key = 'co2_source_note';
  SELECT count(*) INTO v_books_reused
    FROM public.listings
    WHERE status = 'sold'::public.listing_status AND item_type = 'book';
  RETURN jsonb_build_object(
    'books_reused', v_books_reused,
    'co2_kg_per_book', COALESCE(v_coef, 0),
    'total_co2_avoided_kg', COALESCE(v_coef, 0) * v_books_reused,
    'source_note', COALESCE(v_note, '')
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.public_get_co2_impact() TO anon, authenticated;
