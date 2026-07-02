CREATE OR REPLACE FUNCTION public.get_active_listing_cards(_book_ids text[])
RETURNS TABLE (
  id uuid,
  book_id text,
  seller_id uuid,
  listing_type text,
  price numeric,
  condition text,
  seller_display_name text,
  seller_rating numeric,
  seller_completed_exchanges integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    l.id,
    l.book_id,
    l.seller_id,
    l.listing_type::text,
    l.price,
    l.condition::text,
    CASE
      WHEN NULLIF(BTRIM(p.first_name), '') IS NOT NULL
        THEN BTRIM(p.first_name) || COALESCE(' ' || LEFT(BTRIM(NULLIF(p.last_name, '')), 1) || '.', '')
      ELSE 'DISbook user'
    END AS seller_display_name,
    COALESCE(p.rating_average, 0) AS seller_rating,
    COALESCE(p.completed_transactions, 0) AS seller_completed_exchanges
  FROM public.listings l
  LEFT JOIN public.profiles p ON p.user_id = l.seller_id
  WHERE l.status = 'active'::public.listing_status
    AND l.book_id = ANY(_book_ids)
    AND private.is_account_active(l.seller_id);
$$;

REVOKE ALL ON FUNCTION public.get_active_listing_cards(text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_active_listing_cards(text[]) TO anon;
GRANT EXECUTE ON FUNCTION public.get_active_listing_cards(text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_active_listing_cards(text[]) TO service_role;