
-- 1. Add needs_correction to listing_status enum
ALTER TYPE public.listing_status ADD VALUE IF NOT EXISTS 'needs_correction';
