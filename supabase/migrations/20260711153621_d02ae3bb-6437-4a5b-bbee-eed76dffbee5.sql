CREATE OR REPLACE FUNCTION public.public_get_recent_listings(_limit integer DEFAULT 8)
RETURNS TABLE(
  listing_id uuid,
  group_key text,
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
  copies_available integer,
  offers jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH active AS (
    SELECT
      l.*,
      lower(regexp_replace(btrim(l.title), '\s+', ' ', 'g')) AS group_key
    FROM public.listings l
    WHERE l.status = 'active'::public.listing_status
      AND cardinality(l.images) > 0
      AND private.is_account_active(l.seller_id)
  ),
  enriched AS (
    SELECT
      a.*,
      CASE
        WHEN NULLIF(BTRIM(p.first_name), '') IS NOT NULL
          THEN BTRIM(p.first_name) || COALESCE(' ' || LEFT(BTRIM(NULLIF(p.last_name, '')), 1) || '.', '')
        ELSE 'DISbook user'
      END AS safe_seller_display_name,
      COALESCE(p.rating_average, 0) AS seller_rating,
      COALESCE(p.completed_transactions, 0) AS seller_completed_exchanges
    FROM active a
    LEFT JOIN public.profiles p ON p.user_id = a.seller_id
  ),
  grouped AS (
    SELECT
      e.group_key,
      COUNT(*)::integer AS copies_available,
      MAX(e.created_at) AS latest_at,
      jsonb_agg(
        jsonb_build_object(
          'id', e.id,
          'bookId', e.book_id,
          'title', e.title,
          'subject', e.subject,
          'classYear', e.class_year,
          'isbn', e.isbn,
          'listingType', e.listing_type::text,
          'price', e.price,
          'condition', e.condition::text,
          'images', to_jsonb(e.images),
          'createdAt', e.created_at,
          'sellerDisplayName', e.safe_seller_display_name,
          'sellerRating', e.seller_rating,
          'sellerCompletedExchanges', e.seller_completed_exchanges,
          'notes', e.notes,
          'status', e.status::text
        )
        ORDER BY e.created_at DESC, e.price ASC NULLS LAST
      ) AS offers
    FROM enriched e
    GROUP BY e.group_key
  ),
  ranked AS (
    SELECT
      e.*,
      ROW_NUMBER() OVER (
        PARTITION BY e.group_key
        ORDER BY e.created_at DESC, e.price ASC NULLS LAST
      ) AS rn
    FROM enriched e
  )
  SELECT
    r.id AS listing_id,
    r.group_key,
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
    r.safe_seller_display_name AS seller_display_name,
    g.copies_available,
    g.offers
  FROM ranked r
  JOIN grouped g ON g.group_key = r.group_key
  WHERE r.rn = 1
  ORDER BY g.latest_at DESC
  LIMIT GREATEST(1, LEAST(_limit, 24));
$$;

CREATE OR REPLACE FUNCTION public.public_get_listing_group(_listing_id uuid)
RETURNS TABLE(
  id uuid,
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
  seller_rating numeric,
  seller_completed_exchanges integer,
  notes text,
  status text,
  copies_available integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH selected_group AS (
    SELECT lower(regexp_replace(btrim(l.title), '\s+', ' ', 'g')) AS group_key
    FROM public.listings l
    WHERE l.id = _listing_id
      AND l.status = 'active'::public.listing_status
      AND cardinality(l.images) > 0
      AND private.is_account_active(l.seller_id)
    LIMIT 1
  ),
  active AS (
    SELECT l.*
    FROM public.listings l
    JOIN selected_group sg
      ON lower(regexp_replace(btrim(l.title), '\s+', ' ', 'g')) = sg.group_key
    WHERE l.status = 'active'::public.listing_status
      AND cardinality(l.images) > 0
      AND private.is_account_active(l.seller_id)
  )
  SELECT
    a.id,
    a.book_id,
    a.title,
    a.subject,
    a.class_year,
    a.isbn,
    a.listing_type::text,
    a.price,
    a.condition::text,
    a.images,
    a.created_at,
    CASE
      WHEN NULLIF(BTRIM(p.first_name), '') IS NOT NULL
        THEN BTRIM(p.first_name) || COALESCE(' ' || LEFT(BTRIM(NULLIF(p.last_name, '')), 1) || '.', '')
      ELSE 'DISbook user'
    END AS seller_display_name,
    COALESCE(p.rating_average, 0) AS seller_rating,
    COALESCE(p.completed_transactions, 0) AS seller_completed_exchanges,
    a.notes,
    a.status::text,
    COUNT(*) OVER ()::integer AS copies_available
  FROM active a
  LEFT JOIN public.profiles p ON p.user_id = a.seller_id
  ORDER BY a.created_at DESC, a.price ASC NULLS LAST;
$$;

REVOKE ALL ON FUNCTION public.public_get_recent_listings(integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.public_get_listing_group(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_get_recent_listings(integer) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.public_get_listing_group(uuid) TO anon, authenticated, service_role;