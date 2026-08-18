ALTER TABLE public.parent_community_tips
  ADD COLUMN IF NOT EXISTS original_language text NOT NULL DEFAULT 'it',
  ADD COLUMN IF NOT EXISTS activity_name_it text,
  ADD COLUMN IF NOT EXISTS activity_name_en text,
  ADD COLUMN IF NOT EXISTS brief_description_it text,
  ADD COLUMN IF NOT EXISTS brief_description_en text,
  ADD COLUMN IF NOT EXISTS personal_feedback_it text,
  ADD COLUMN IF NOT EXISTS personal_feedback_en text,
  ADD COLUMN IF NOT EXISTS translation_status text NOT NULL DEFAULT 'missing',
  ADD COLUMN IF NOT EXISTS translated_at timestamptz;

-- seed the original-language side from existing text
UPDATE public.parent_community_tips
   SET activity_name_it = COALESCE(activity_name_it, CASE WHEN original_language = 'it' THEN activity_opportunity_name END),
       brief_description_it = COALESCE(brief_description_it, CASE WHEN original_language = 'it' THEN brief_description END),
       personal_feedback_it = COALESCE(personal_feedback_it, CASE WHEN original_language = 'it' THEN personal_feedback END),
       activity_name_en = COALESCE(activity_name_en, CASE WHEN original_language = 'en' THEN activity_opportunity_name END),
       brief_description_en = COALESCE(brief_description_en, CASE WHEN original_language = 'en' THEN brief_description END),
       personal_feedback_en = COALESCE(personal_feedback_en, CASE WHEN original_language = 'en' THEN personal_feedback END);

DROP FUNCTION IF EXISTS public.public_get_community_tips(text, integer);

CREATE FUNCTION public.public_get_community_tips(_search text DEFAULT NULL::text, _limit integer DEFAULT 60)
 RETURNS TABLE(id uuid, entity_provider_name text, activity_opportunity_name text, brief_description text, contact_information text, website_url text, email text, phone text, social_page text, location text, approximate_age_range_suitable_level text[], language text, approximate_cost text, period text, personal_feedback text, would_recommend_again boolean, photo_logo_url text, tried_activity text, flyer_file_path text, flyer_file_name text, flyer_file_type text, flyer_file_size bigint, published_at timestamp with time zone, recommended_by_name text, reactions_enabled boolean, thumbs_up_count integer, heart_count integer, my_reactions text[], original_language text, activity_name_it text, activity_name_en text, brief_description_it text, brief_description_en text, personal_feedback_it text, personal_feedback_en text, translation_status text)
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
         COALESCE(NULLIF(BTRIM(p.first_name), ''), 'DISbook community member') AS recommended_by_name,
         t.reactions_enabled,
         COALESCE((SELECT count(*) FROM public.parent_tip_reactions r WHERE r.tip_id = t.id AND r.reaction_type = 'thumbs_up'), 0)::integer,
         COALESCE((SELECT count(*) FROM public.parent_tip_reactions r WHERE r.tip_id = t.id AND r.reaction_type = 'heart'), 0)::integer,
         COALESCE((SELECT array_agg(r.reaction_type) FROM public.parent_tip_reactions r WHERE r.tip_id = t.id AND r.user_id = auth.uid()), ARRAY[]::text[]),
         t.original_language, t.activity_name_it, t.activity_name_en,
         t.brief_description_it, t.brief_description_en,
         t.personal_feedback_it, t.personal_feedback_en, t.translation_status
  FROM public.parent_community_tips t
  LEFT JOIN public.profiles p ON p.user_id = t.submitted_by_user_id
  WHERE t.status = 'approved'
    AND (
      _search IS NULL OR btrim(_search) = '' OR
      t.activity_opportunity_name ILIKE '%' || _search || '%' OR
      t.entity_provider_name ILIKE '%' || _search || '%' OR
      t.brief_description ILIKE '%' || _search || '%' OR
      t.personal_feedback ILIKE '%' || _search || '%' OR
      COALESCE(t.activity_name_en,'') ILIKE '%' || _search || '%' OR
      COALESCE(t.activity_name_it,'') ILIKE '%' || _search || '%' OR
      COALESCE(t.brief_description_en,'') ILIKE '%' || _search || '%' OR
      COALESCE(t.brief_description_it,'') ILIKE '%' || _search || '%'
    )
  ORDER BY COALESCE(t.published_at, t.updated_at) DESC
  LIMIT LEAST(COALESCE(_limit, 60), 200)
$function$;

CREATE OR REPLACE FUNCTION public.author_update_tip(_tip_id uuid, _payload jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  v_tip public.parent_community_tips%ROWTYPE;
  v_lang text;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF NOT private.is_account_active(v_uid) THEN RAISE EXCEPTION 'Account is not active'; END IF;

  SELECT * INTO v_tip FROM public.parent_community_tips WHERE id = _tip_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Tip not found'; END IF;
  IF v_tip.submitted_by_user_id <> v_uid THEN RAISE EXCEPTION 'You can only edit your own tips'; END IF;
  IF v_tip.status = 'archived'::public.tip_status THEN
    RAISE EXCEPTION 'Archived tips cannot be edited. Please contact an admin.';
  END IF;

  v_lang := CASE WHEN LOWER(COALESCE(_payload->>'original_language', v_tip.original_language)) = 'en' THEN 'en' ELSE 'it' END;

  UPDATE public.parent_community_tips SET
    entity_provider_name = COALESCE(NULLIF(BTRIM(_payload->>'entity_provider_name'), ''), entity_provider_name),
    activity_opportunity_name = COALESCE(NULLIF(BTRIM(_payload->>'activity_opportunity_name'), ''), activity_opportunity_name),
    brief_description = COALESCE(NULLIF(BTRIM(_payload->>'brief_description'), ''), brief_description),
    personal_feedback = COALESCE(NULLIF(BTRIM(_payload->>'personal_feedback'), ''), personal_feedback),
    contact_information = NULLIF(BTRIM(COALESCE(_payload->>'contact_information','')), ''),
    website_url = NULLIF(BTRIM(COALESCE(_payload->>'website_url','')), ''),
    email = NULLIF(BTRIM(COALESCE(_payload->>'email','')), ''),
    phone = NULLIF(BTRIM(COALESCE(_payload->>'phone','')), ''),
    social_page = NULLIF(BTRIM(COALESCE(_payload->>'social_page','')), ''),
    location = NULLIF(BTRIM(COALESCE(_payload->>'location','')), ''),
    language = NULLIF(BTRIM(COALESCE(_payload->>'language','')), ''),
    approximate_cost = NULLIF(BTRIM(COALESCE(_payload->>'approximate_cost','')), ''),
    period = NULLIF(BTRIM(COALESCE(_payload->>'period','')), ''),
    photo_logo_url = NULLIF(BTRIM(COALESCE(_payload->>'photo_logo_url','')), ''),
    approximate_age_range_suitable_level = COALESCE(
      (SELECT array_agg(x) FROM jsonb_array_elements_text(COALESCE(_payload->'approximate_age_range_suitable_level','[]'::jsonb)) x),
      approximate_age_range_suitable_level),
    would_recommend_again = COALESCE((_payload->>'would_recommend_again')::boolean, would_recommend_again),
    tried_activity = COALESCE(NULLIF(BTRIM(_payload->>'tried_activity'), ''), tried_activity),
    original_language = v_lang,
    activity_name_it = CASE WHEN v_lang = 'it' THEN COALESCE(NULLIF(BTRIM(_payload->>'activity_opportunity_name'), ''), activity_opportunity_name) ELSE NULL END,
    brief_description_it = CASE WHEN v_lang = 'it' THEN COALESCE(NULLIF(BTRIM(_payload->>'brief_description'), ''), brief_description) ELSE NULL END,
    personal_feedback_it = CASE WHEN v_lang = 'it' THEN COALESCE(NULLIF(BTRIM(_payload->>'personal_feedback'), ''), personal_feedback) ELSE NULL END,
    activity_name_en = CASE WHEN v_lang = 'en' THEN COALESCE(NULLIF(BTRIM(_payload->>'activity_opportunity_name'), ''), activity_opportunity_name) ELSE NULL END,
    brief_description_en = CASE WHEN v_lang = 'en' THEN COALESCE(NULLIF(BTRIM(_payload->>'brief_description'), ''), brief_description) ELSE NULL END,
    personal_feedback_en = CASE WHEN v_lang = 'en' THEN COALESCE(NULLIF(BTRIM(_payload->>'personal_feedback'), ''), personal_feedback) ELSE NULL END,
    translation_status = 'missing',
    translated_at = NULL,
    status = 'pending_review'::public.tip_status,
    rejection_reason = NULL,
    admin_reviewed_by = NULL,
    admin_reviewed_at = NULL,
    published_at = NULL,
    updated_at = now()
  WHERE id = _tip_id;
END;
$function$;