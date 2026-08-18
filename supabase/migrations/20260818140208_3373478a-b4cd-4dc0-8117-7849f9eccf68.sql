-- Tips feed: authenticated only
REVOKE EXECUTE ON FUNCTION public.public_get_community_tips(text, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.public_get_community_tips(text, integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.public_get_community_tips(_search text DEFAULT NULL, _limit integer DEFAULT 30)
RETURNS TABLE(id uuid, entity_provider_name text, activity_opportunity_name text, brief_description text, contact_information text, website_url text, email text, phone text, social_page text, location text, approximate_age_range_suitable_level text[], language text, approximate_cost text, period text, personal_feedback text, would_recommend_again boolean, photo_logo_url text, tried_activity text, flyer_file_path text, flyer_file_name text, flyer_file_type text, flyer_file_size bigint, published_at timestamp with time zone, recommended_by_name text, reactions_enabled boolean, thumbs_up_count integer, heart_count integer, my_reactions text[], original_language text, activity_name_it text, activity_name_en text, brief_description_it text, brief_description_en text, personal_feedback_it text, personal_feedback_en text, translation_status text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to view community tips';
  END IF;

  RETURN QUERY
  SELECT
    t.id,
    t.entity_provider_name,
    t.activity_opportunity_name,
    t.brief_description,
    t.contact_information,
    t.website_url,
    t.email,
    t.phone,
    t.social_page,
    t.location,
    t.approximate_age_range_suitable_level,
    t.language,
    t.approximate_cost,
    t.period,
    t.personal_feedback,
    t.would_recommend_again,
    t.photo_logo_url,
    t.tried_activity,
    t.flyer_file_path,
    t.flyer_file_name,
    t.flyer_file_type,
    t.flyer_file_size,
    t.published_at,
    (SELECT p.first_name || ' ' || left(p.last_name, 1) || '.'
       FROM public.profiles p WHERE p.user_id = t.submitted_by_user_id) AS recommended_by_name,
    t.reactions_enabled,
    COALESCE((SELECT count(*)::int FROM public.parent_tip_reactions r
              WHERE r.tip_id = t.id AND r.reaction_type = 'thumbs_up'), 0) AS thumbs_up_count,
    COALESCE((SELECT count(*)::int FROM public.parent_tip_reactions r
              WHERE r.tip_id = t.id AND r.reaction_type = 'heart'), 0) AS heart_count,
    COALESCE((SELECT array_agg(r.reaction_type) FROM public.parent_tip_reactions r
              WHERE r.tip_id = t.id AND r.user_id = auth.uid()), ARRAY[]::text[]) AS my_reactions,
    t.original_language,
    t.activity_name_it,
    t.activity_name_en,
    t.brief_description_it,
    t.brief_description_en,
    t.personal_feedback_it,
    t.personal_feedback_en,
    t.translation_status
  FROM public.parent_community_tips t
  WHERE t.status = 'approved'
    AND (
      _search IS NULL OR _search = '' OR
      t.entity_provider_name ILIKE '%' || _search || '%' OR
      t.activity_opportunity_name ILIKE '%' || _search || '%' OR
      t.brief_description ILIKE '%' || _search || '%' OR
      t.activity_name_it ILIKE '%' || _search || '%' OR
      t.activity_name_en ILIKE '%' || _search || '%' OR
      t.brief_description_it ILIKE '%' || _search || '%' OR
      t.brief_description_en ILIKE '%' || _search || '%' OR
      COALESCE(t.location, '') ILIKE '%' || _search || '%'
    )
  ORDER BY t.published_at DESC NULLS LAST
  LIMIT LEAST(COALESCE(_limit, 30), 100);
END;
$$;

-- Flyers: authenticated only
DROP POLICY IF EXISTS "Read tip flyers when approved or owner or admin" ON storage.objects;
CREATE POLICY "Read tip flyers when approved or owner or admin"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'tip-flyers'
  AND (
    EXISTS (SELECT 1 FROM public.parent_community_tips t
            WHERE t.flyer_file_path = objects.name AND t.status = 'approved')
    OR (storage.foldername(name))[1] = auth.uid()::text
    OR public.current_user_is_admin()
  )
);