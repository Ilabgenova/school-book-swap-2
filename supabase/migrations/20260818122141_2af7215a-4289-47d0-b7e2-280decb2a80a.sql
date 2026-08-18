
ALTER TABLE public.parent_community_tips
  ADD COLUMN IF NOT EXISTS tried_activity text,
  ADD COLUMN IF NOT EXISTS flyer_file_path text,
  ADD COLUMN IF NOT EXISTS flyer_file_name text,
  ADD COLUMN IF NOT EXISTS flyer_file_type text,
  ADD COLUMN IF NOT EXISTS flyer_file_size bigint,
  ADD COLUMN IF NOT EXISTS flyer_uploaded_at timestamptz;

ALTER TABLE public.parent_community_tips
  DROP CONSTRAINT IF EXISTS parent_community_tips_tried_activity_check;
ALTER TABLE public.parent_community_tips
  ADD CONSTRAINT parent_community_tips_tried_activity_check
  CHECK (tried_activity IS NULL OR tried_activity IN ('tried_by_family','information_shared'));

-- Storage policies for tip flyers
DROP POLICY IF EXISTS "Users upload own tip flyers" ON storage.objects;
CREATE POLICY "Users upload own tip flyers"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'tip-flyers' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users manage own tip flyers" ON storage.objects;
CREATE POLICY "Users manage own tip flyers"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'tip-flyers' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.current_user_is_admin()));

DROP POLICY IF EXISTS "Read tip flyers when approved or owner or admin" ON storage.objects;
CREATE POLICY "Read tip flyers when approved or owner or admin"
ON storage.objects FOR SELECT TO anon, authenticated
USING (
  bucket_id = 'tip-flyers'
  AND (
    EXISTS (
      SELECT 1 FROM public.parent_community_tips t
      WHERE t.flyer_file_path = storage.objects.name
        AND t.status = 'approved'
    )
    OR (auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text)
    OR public.current_user_is_admin()
  )
);

-- Public feed RPC: include tried_activity + flyer info (approved only)
DROP FUNCTION IF EXISTS public.public_get_community_tips(text, integer);
CREATE OR REPLACE FUNCTION public.public_get_community_tips(_search text DEFAULT NULL::text, _limit integer DEFAULT 60)
 RETURNS TABLE(id uuid, entity_provider_name text, activity_opportunity_name text, brief_description text, contact_information text, website_url text, email text, phone text, social_page text, location text, approximate_age_range_suitable_level text[], language text, approximate_cost text, period text, personal_feedback text, would_recommend_again boolean, photo_logo_url text, tried_activity text, flyer_file_path text, flyer_file_name text, flyer_file_type text, flyer_file_size bigint, published_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT t.id, t.entity_provider_name, t.activity_opportunity_name, t.brief_description,
         t.contact_information, t.website_url, t.email, t.phone, t.social_page, t.location,
         t.approximate_age_range_suitable_level, t.language, t.approximate_cost, t.period,
         t.personal_feedback, t.would_recommend_again, t.photo_logo_url,
         t.tried_activity, t.flyer_file_path, t.flyer_file_name, t.flyer_file_type, t.flyer_file_size,
         COALESCE(t.published_at, t.updated_at) AS published_at
  FROM public.parent_community_tips t
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
