CREATE OR REPLACE FUNCTION public.my_circular_impact()
RETURNS jsonb
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT jsonb_build_object(
    'books_sold', COALESCE((
      SELECT count(*) FROM public.listings l
      WHERE l.seller_id = auth.uid()
        AND l.status = 'sold'::public.listing_status
        AND l.item_type = 'book'
    ), 0),
    'books_bought', COALESCE((
      SELECT count(*) FROM public.bought_books b
      WHERE b.user_id = auth.uid()
        AND b.status = 'completed'
    ), 0)
  )
  WHERE auth.uid() IS NOT NULL;
$$;

REVOKE ALL ON FUNCTION public.my_circular_impact() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_circular_impact() TO authenticated;