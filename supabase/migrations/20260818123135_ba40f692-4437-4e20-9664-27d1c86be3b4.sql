DROP FUNCTION IF EXISTS public.public_get_community_tips(text, integer);

CREATE OR REPLACE FUNCTION public.public_get_community_tips(_search text DEFAULT NULL::text, _limit integer DEFAULT 60)
 RETURNS TABLE(id uuid, entity_provider_name text, activity_opportunity_name text, brief_description text, contact_information text, website_url text, email text, phone text, social_page text, location text, approximate_age_range_suitable_level text[], language text, approximate_cost text, period text, personal_feedback text, would_recommend_again boolean, photo_logo_url text, tried_activity text, flyer_file_path text, flyer_file_name text, flyer_file_type text, flyer_file_size bigint, published_at timestamp with time zone, recommended_by_name text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT t.id, t.entity_provider_name, t.activity_opportunity_name, t.brief_description,
         t.contact_information, t.website_url, t.email, t.phone, t.social_page, t.location,
         t.approximate_age_range_suitable_level, t.language, t.approximate_cost, t.period,
         t.personal_feedback, t.would_recommend_again, t.photo_logo_url,
         t.tried_activity, t.flyer_file_path, t.flyer_file_name, t.flyer_file_type, t.flyer_file_size,
         COALESCE(t.published_at, t.updated_at) AS published_at,
         COALESCE(NULLIF(BTRIM(p.first_name), ''), 'DISbook community member') AS recommended_by_name
  FROM public.parent_community_tips t
  LEFT JOIN public.profiles p ON p.user_id = t.submitted_by_user_id
  WHERE t.status = 'approved'
    AND (
      _search IS NULL OR btrim(_search) = '' OR
      t.activity_opportunity_name ILIKE '%' || _search || '%' OR
      t.entity_provider_name ILIKE '%' || _search || '%' OR
      t.brief_description ILIKE '%' || _search || '%' OR
      t.personal_feedback ILIKE '%' || _search || '%'
    )
  ORDER BY COALESCE(t.published_at, t.updated_at) DESC
  LIMIT LEAST(COALESCE(_limit, 60), 200)
$function$;

CREATE OR REPLACE FUNCTION public.admin_get_tip_submitters(_user_ids uuid[])
 RETURNS TABLE(user_id uuid, email text, first_name text, last_name text, recommended_by_name text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT p.user_id,
         au.email::text,
         p.first_name,
         p.last_name,
         COALESCE(NULLIF(BTRIM(p.first_name), ''), 'DISbook community member')
  FROM public.profiles p
  LEFT JOIN auth.users au ON au.id = p.user_id
  WHERE public.current_user_is_admin()
    AND p.user_id = ANY(_user_ids);
$function$;

REVOKE ALL ON FUNCTION public.admin_get_tip_submitters(uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_get_tip_submitters(uuid[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.public_get_community_tips(text, integer) TO anon, authenticated;