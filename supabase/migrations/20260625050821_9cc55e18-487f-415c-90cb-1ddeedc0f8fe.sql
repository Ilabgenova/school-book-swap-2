CREATE TYPE public.listing_type AS ENUM ('sale', 'exchange', 'donation');

ALTER TABLE public.listings
  ADD COLUMN listing_type public.listing_type NOT NULL DEFAULT 'sale',
  ADD COLUMN isbn text;

-- Allow anyone (incl. anon) to read active listings so buyers can browse
CREATE POLICY "Anyone can view active listings"
  ON public.listings
  FOR SELECT
  USING (status = 'active');

GRANT SELECT ON public.listings TO anon;