DROP FUNCTION IF EXISTS public.get_active_listing_cards(text[]);

CREATE OR REPLACE FUNCTION public.get_active_listing_cards(_book_ids text[])
 RETURNS TABLE(
   id uuid,
   book_id text,
   seller_id uuid,
   listing_type text,
   price numeric,
   condition text,
   notes text,
   images text[],
   subject text,
   class_year text,
   isbn text,
   title text,
   created_at timestamptz,
   status text,
   seller_display_name text,
   seller_rating numeric,
   seller_completed_exchanges integer
 )
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT
    l.id,
    l.book_id,
    l.seller_id,
    l.listing_type::text,
    l.price,
    l.condition::text,
    l.notes,
    l.images,
    l.subject,
    l.class_year,
    l.isbn,
    l.title,
    l.created_at,
    l.status::text,
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
$function$;