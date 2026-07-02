
-- 1. Add tracking columns to listings
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS sold_at timestamptz,
  ADD COLUMN IF NOT EXISTS sold_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS buyer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS sold_through_disbook boolean,
  ADD COLUMN IF NOT EXISTS item_type text NOT NULL DEFAULT 'book';

-- Backfill item_type from title
UPDATE public.listings SET item_type =
  CASE
    WHEN title ~* '\m(keyboard|tastiera)\M' THEN 'keyboard'
    WHEN title ~* '\msphero\M' THEN 'sphero'
    ELSE 'book'
  END
WHERE item_type = 'book';

-- Backfill sold_at for previously sold listings
UPDATE public.listings SET sold_at = COALESCE(sold_at, updated_at)
WHERE status = 'sold'::public.listing_status AND sold_at IS NULL;

CREATE INDEX IF NOT EXISTS listings_status_idx ON public.listings(status);
CREATE INDEX IF NOT EXISTS listings_sold_at_idx ON public.listings(sold_at);
CREATE INDEX IF NOT EXISTS listings_item_type_idx ON public.listings(item_type);

-- 2. Seller mark-as-sold function
CREATE OR REPLACE FUNCTION public.seller_mark_listing_sold(
  _listing_id uuid,
  _buyer_id uuid DEFAULT NULL,
  _sold_through_disbook boolean DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_seller uuid;
  v_status public.listing_status;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  SELECT seller_id, status INTO v_seller, v_status
    FROM public.listings WHERE id = _listing_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Listing not found'; END IF;
  IF v_seller <> auth.uid() THEN
    RAISE EXCEPTION 'Only the seller can mark this listing as sold';
  END IF;
  IF v_status NOT IN ('active'::public.listing_status,
                      'reserved'::public.listing_status,
                      'pending_review'::public.listing_status,
                      'needs_correction'::public.listing_status) THEN
    RAISE EXCEPTION 'Listing cannot be marked as sold in its current state';
  END IF;

  UPDATE public.listings
     SET status = 'sold'::public.listing_status,
         sold_at = COALESCE(sold_at, now()),
         sold_by_user_id = auth.uid(),
         buyer_id = COALESCE(_buyer_id, buyer_id),
         sold_through_disbook = COALESCE(_sold_through_disbook, sold_through_disbook),
         updated_at = now()
   WHERE id = _listing_id;
END;
$$;

REVOKE ALL ON FUNCTION public.seller_mark_listing_sold(uuid, uuid, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.seller_mark_listing_sold(uuid, uuid, boolean) TO authenticated;

-- 3. App settings table
CREATE TABLE IF NOT EXISTS public.app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

GRANT SELECT ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "settings readable by authenticated" ON public.app_settings;
CREATE POLICY "settings readable by authenticated" ON public.app_settings
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admins manage settings" ON public.app_settings;
CREATE POLICY "admins manage settings" ON public.app_settings
  FOR ALL TO authenticated
  USING (public.current_user_is_admin())
  WITH CHECK (public.current_user_is_admin());

INSERT INTO public.app_settings (key, value)
VALUES ('co2_kg_per_book', to_jsonb(5.0))
ON CONFLICT (key) DO NOTHING;

-- 4. Admin impact stats function
CREATE OR REPLACE FUNCTION public.admin_get_impact_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  v_coef numeric;
  v_result jsonb;
BEGIN
  IF NOT public.current_user_is_admin() THEN
    RAISE EXCEPTION 'Admins only';
  END IF;

  SELECT COALESCE((value)::text::numeric, 0) INTO v_coef
    FROM public.app_settings WHERE key = 'co2_kg_per_book';

  SELECT jsonb_build_object(
    'total_listed', (SELECT count(*) FROM public.listings),
    'active_listings', (SELECT count(*) FROM public.listings WHERE status = 'active'::public.listing_status),
    'pending_approvals', (SELECT count(*) FROM public.listings WHERE status = 'pending_review'::public.listing_status),
    'needs_correction', (SELECT count(*) FROM public.listings WHERE status = 'needs_correction'::public.listing_status),
    'total_sold', (SELECT count(*) FROM public.listings WHERE status = 'sold'::public.listing_status),
    'books_sold', (SELECT count(*) FROM public.listings WHERE status = 'sold'::public.listing_status AND item_type = 'book'),
    'books_reused_through_disbook',
      (SELECT count(*) FROM public.listings WHERE status = 'sold'::public.listing_status AND item_type = 'book' AND sold_through_disbook = true),
    'keyboards_sold', (SELECT count(*) FROM public.listings WHERE status = 'sold'::public.listing_status AND item_type = 'keyboard'),
    'sphero_sold', (SELECT count(*) FROM public.listings WHERE status = 'sold'::public.listing_status AND item_type = 'sphero'),
    'co2_kg_per_book', v_coef,
    'estimated_co2_avoided_kg',
      v_coef * (SELECT count(*) FROM public.listings WHERE status = 'sold'::public.listing_status AND item_type = 'book')
  ) INTO v_result;
  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_get_impact_stats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_get_impact_stats() TO authenticated;
