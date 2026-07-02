
CREATE OR REPLACE FUNCTION public.admin_list_users_with_auth()
RETURNS TABLE(
  user_id uuid,
  email text,
  first_name text,
  last_name text,
  school text,
  account_status text,
  block_reason text,
  admin_notes text,
  suspension_until timestamptz,
  rating_average numeric,
  completed_transactions integer,
  created_at timestamptz,
  email_confirmed_at timestamptz,
  last_sign_in_at timestamptz,
  is_admin boolean,
  listings_count bigint,
  active_listings_count bigint,
  sold_listings_count bigint
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.user_id,
    au.email::text,
    p.first_name,
    p.last_name,
    p.school,
    p.account_status::text,
    p.block_reason,
    p.admin_notes,
    p.suspension_until,
    COALESCE(p.rating_average, 0),
    COALESCE(p.completed_transactions, 0),
    au.created_at,
    au.email_confirmed_at,
    au.last_sign_in_at,
    EXISTS(SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.user_id AND ur.role = 'admin'),
    (SELECT count(*) FROM public.listings l WHERE l.seller_id = p.user_id),
    (SELECT count(*) FROM public.listings l WHERE l.seller_id = p.user_id AND l.status = 'active'::public.listing_status),
    (SELECT count(*) FROM public.listings l WHERE l.seller_id = p.user_id AND l.status = 'sold'::public.listing_status)
  FROM public.profiles p
  LEFT JOIN auth.users au ON au.id = p.user_id
  WHERE public.current_user_is_admin()
  ORDER BY au.created_at DESC NULLS LAST;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_users_with_auth() TO authenticated;
