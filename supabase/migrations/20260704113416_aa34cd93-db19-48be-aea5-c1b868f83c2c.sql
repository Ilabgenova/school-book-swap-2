
-- Fix: SECURITY DEFINER function executable by anon.
-- Convert public_get_co2_impact to SECURITY INVOKER, backed by a
-- cached public stats table with a safe anon-readable policy.

CREATE TABLE IF NOT EXISTS public.co2_public_stats (
  id boolean PRIMARY KEY DEFAULT true CHECK (id = true),
  books_reused integer NOT NULL DEFAULT 0,
  co2_kg_per_book numeric NOT NULL DEFAULT 0,
  source_note text NOT NULL DEFAULT '',
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.co2_public_stats TO anon, authenticated;
GRANT ALL ON public.co2_public_stats TO service_role;

ALTER TABLE public.co2_public_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read co2 public stats" ON public.co2_public_stats;
CREATE POLICY "Anyone can read co2 public stats"
  ON public.co2_public_stats FOR SELECT
  TO anon, authenticated
  USING (true);

-- Seed row
INSERT INTO public.co2_public_stats (id) VALUES (true)
  ON CONFLICT (id) DO NOTHING;

-- Refresh helper (SECURITY DEFINER, NOT exposed to anon; only triggers call it)
CREATE OR REPLACE FUNCTION private.refresh_co2_public_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_coef numeric;
  v_note text;
  v_count int;
BEGIN
  SELECT COALESCE((value)::text::numeric, 0) INTO v_coef
    FROM public.app_settings WHERE key = 'co2_kg_per_book';
  SELECT COALESCE(trim(both '"' from (value)::text), '') INTO v_note
    FROM public.app_settings WHERE key = 'co2_source_note';
  SELECT count(*) INTO v_count
    FROM public.listings
    WHERE status = 'sold'::public.listing_status AND item_type = 'book';

  UPDATE public.co2_public_stats
     SET books_reused = COALESCE(v_count, 0),
         co2_kg_per_book = COALESCE(v_coef, 0),
         source_note = COALESCE(v_note, ''),
         updated_at = now()
   WHERE id = true;
END;
$$;

REVOKE ALL ON FUNCTION private.refresh_co2_public_stats() FROM PUBLIC, anon, authenticated;

-- Trigger wrapper
CREATE OR REPLACE FUNCTION private.trg_refresh_co2_public_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM private.refresh_co2_public_stats();
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS refresh_co2_stats_on_listings ON public.listings;
CREATE TRIGGER refresh_co2_stats_on_listings
AFTER INSERT OR UPDATE OF status, item_type OR DELETE ON public.listings
FOR EACH STATEMENT EXECUTE FUNCTION private.trg_refresh_co2_public_stats();

DROP TRIGGER IF EXISTS refresh_co2_stats_on_settings ON public.app_settings;
CREATE TRIGGER refresh_co2_stats_on_settings
AFTER INSERT OR UPDATE OR DELETE ON public.app_settings
FOR EACH STATEMENT EXECUTE FUNCTION private.trg_refresh_co2_public_stats();

-- Initial population
SELECT private.refresh_co2_public_stats();

-- Rewrite the exposed RPC as SECURITY INVOKER, reading only from the
-- anon-readable cache table. No SECURITY DEFINER exposure remains.
CREATE OR REPLACE FUNCTION public.public_get_co2_impact()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY INVOKER
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
