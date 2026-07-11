-- Public RPC: recent active listings grouped by title/book, safe for anon
CREATE OR REPLACE FUNCTION public.public_get_recent_listings(_limit integer DEFAULT 8)
RETURNS TABLE(
  listing_id uuid,
  book_id text,
  title text,
  subject text,
  class_year text,
  isbn text,
  listing_type text,
  price numeric,
  condition text,
  images text[],
  created_at timestamptz,
  seller_display_name text,
  copies_available integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH active AS (
    SELECT l.*
    FROM public.listings l
    WHERE l.status = 'active'::public.listing_status
      AND private.is_account_active(l.seller_id)
  ),
  ranked AS (
    SELECT
      a.*,
      ROW_NUMBER() OVER (
        PARTITION BY COALESCE(a.book_id, a.id::text)
        ORDER BY a.created_at DESC
      ) AS rn,
      COUNT(*) OVER (
        PARTITION BY COALESCE(a.book_id, a.id::text)
      ) AS copies
    FROM active a
  )
  SELECT
    r.id AS listing_id,
    r.book_id,
    r.title,
    r.subject,
    r.class_year,
    r.isbn,
    r.listing_type::text,
    r.price,
    r.condition::text,
    r.images,
    r.created_at,
    CASE
      WHEN NULLIF(BTRIM(p.first_name), '') IS NOT NULL
        THEN BTRIM(p.first_name) || COALESCE(' ' || LEFT(BTRIM(NULLIF(p.last_name, '')), 1) || '.', '')
      ELSE 'DISbook user'
    END AS seller_display_name,
    r.copies::integer AS copies_available
  FROM ranked r
  LEFT JOIN public.profiles p ON p.user_id = r.seller_id
  WHERE r.rn = 1
  ORDER BY r.created_at DESC
  LIMIT GREATEST(1, LEAST(_limit, 24));
$$;

GRANT EXECUTE ON FUNCTION public.public_get_recent_listings(integer) TO anon, authenticated;

-- Enable realtime on listings (safe if already added)
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.listings;
EXCEPTION WHEN duplicate_object THEN NULL;
WHEN OTHERS THEN NULL;
END $$;