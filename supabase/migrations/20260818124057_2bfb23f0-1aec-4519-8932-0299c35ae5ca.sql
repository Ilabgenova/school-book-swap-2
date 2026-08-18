ALTER TABLE public.parent_community_tips
  ADD COLUMN IF NOT EXISTS reactions_enabled boolean NOT NULL DEFAULT true;

CREATE TABLE IF NOT EXISTS public.parent_tip_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tip_id uuid NOT NULL REFERENCES public.parent_community_tips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  reaction_type text NOT NULL CHECK (reaction_type IN ('thumbs_up','heart')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tip_id, user_id, reaction_type)
);

GRANT SELECT, INSERT, DELETE ON public.parent_tip_reactions TO authenticated;
GRANT ALL ON public.parent_tip_reactions TO service_role;

ALTER TABLE public.parent_tip_reactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage their own reactions" ON public.parent_tip_reactions;
CREATE POLICY "Users manage their own reactions"
ON public.parent_tip_reactions FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id AND private.is_account_active(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all reactions" ON public.parent_tip_reactions;
CREATE POLICY "Admins can view all reactions"
ON public.parent_tip_reactions FOR SELECT TO authenticated
USING (public.current_user_is_admin());

CREATE INDEX IF NOT EXISTS idx_parent_tip_reactions_tip ON public.parent_tip_reactions (tip_id);

-- Author edit policy: allow editing own non-archived tips
DROP POLICY IF EXISTS "Users can edit their own pending tips" ON public.parent_community_tips;
CREATE POLICY "Users can edit their own tips"
ON public.parent_community_tips FOR UPDATE TO authenticated
USING (auth.uid() = submitted_by_user_id AND status <> 'archived'::public.tip_status)
WITH CHECK (auth.uid() = submitted_by_user_id AND status = 'pending_review'::public.tip_status);

-- Toggle a reaction
CREATE OR REPLACE FUNCTION public.toggle_tip_reaction(_tip_id uuid, _reaction_type text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_deleted int;
  v_tip public.parent_community_tips%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _reaction_type NOT IN ('thumbs_up','heart') THEN RAISE EXCEPTION 'Invalid reaction type'; END IF;
  IF NOT private.is_account_active(v_uid) THEN RAISE EXCEPTION 'Account is not active'; END IF;

  SELECT * INTO v_tip FROM public.parent_community_tips WHERE id = _tip_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Tip not found'; END IF;
  IF v_tip.status <> 'approved'::public.tip_status THEN RAISE EXCEPTION 'Tip is not published'; END IF;
  IF v_tip.reactions_enabled IS NOT TRUE THEN RAISE EXCEPTION 'Reactions are disabled for this tip'; END IF;

  DELETE FROM public.parent_tip_reactions
   WHERE tip_id = _tip_id AND user_id = v_uid AND reaction_type = _reaction_type;
  GET DIAGNOSTICS v_deleted = ROW_COUNT;

  IF v_deleted = 0 THEN
    INSERT INTO public.parent_tip_reactions (tip_id, user_id, reaction_type)
    VALUES (_tip_id, v_uid, _reaction_type)
    ON CONFLICT (tip_id, user_id, reaction_type) DO NOTHING;
  END IF;

  RETURN jsonb_build_object(
    'tip_id', _tip_id,
    'thumbs_up_count', (SELECT count(*) FROM public.parent_tip_reactions WHERE tip_id = _tip_id AND reaction_type = 'thumbs_up'),
    'heart_count', (SELECT count(*) FROM public.parent_tip_reactions WHERE tip_id = _tip_id AND reaction_type = 'heart'),
    'my_reactions', COALESCE((SELECT jsonb_agg(reaction_type) FROM public.parent_tip_reactions WHERE tip_id = _tip_id AND user_id = v_uid), '[]'::jsonb)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.toggle_tip_reaction(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.toggle_tip_reaction(uuid, text) TO authenticated;

-- Public list with reaction counts
DROP FUNCTION IF EXISTS public.public_get_community_tips(text, integer);
CREATE OR REPLACE FUNCTION public.public_get_community_tips(_search text DEFAULT NULL::text, _limit integer DEFAULT 60)
RETURNS TABLE(id uuid, entity_provider_name text, activity_opportunity_name text, brief_description text, contact_information text, website_url text, email text, phone text, social_page text, location text, approximate_age_range_suitable_level text[], language text, approximate_cost text, period text, personal_feedback text, would_recommend_again boolean, photo_logo_url text, tried_activity text, flyer_file_path text, flyer_file_name text, flyer_file_type text, flyer_file_size bigint, published_at timestamp with time zone, recommended_by_name text, reactions_enabled boolean, thumbs_up_count integer, heart_count integer, my_reactions text[])
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
         COALESCE((SELECT array_agg(r.reaction_type) FROM public.parent_tip_reactions r WHERE r.tip_id = t.id AND r.user_id = auth.uid()), ARRAY[]::text[])
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
$$;

GRANT EXECUTE ON FUNCTION public.public_get_community_tips(text, integer) TO anon, authenticated;

-- Author's own tips with reaction counts
CREATE OR REPLACE FUNCTION public.my_community_tips()
RETURNS TABLE(id uuid, entity_provider_name text, activity_opportunity_name text, brief_description text, personal_feedback text, status text, rejection_reason text, admin_notes text, created_at timestamp with time zone, updated_at timestamp with time zone, published_at timestamp with time zone, reactions_enabled boolean, thumbs_up_count integer, heart_count integer)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT t.id, t.entity_provider_name, t.activity_opportunity_name, t.brief_description,
         t.personal_feedback, t.status::text, t.rejection_reason, t.admin_notes,
         t.created_at, t.updated_at, t.published_at, t.reactions_enabled,
         COALESCE((SELECT count(*) FROM public.parent_tip_reactions r WHERE r.tip_id = t.id AND r.reaction_type = 'thumbs_up'), 0)::integer,
         COALESCE((SELECT count(*) FROM public.parent_tip_reactions r WHERE r.tip_id = t.id AND r.reaction_type = 'heart'), 0)::integer
  FROM public.parent_community_tips t
  WHERE auth.uid() IS NOT NULL AND t.submitted_by_user_id = auth.uid()
  ORDER BY t.created_at DESC
$$;

REVOKE ALL ON FUNCTION public.my_community_tips() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_community_tips() TO authenticated;

-- Admin reaction counts
CREATE OR REPLACE FUNCTION public.admin_get_tip_reaction_counts(_tip_ids uuid[])
RETURNS TABLE(tip_id uuid, thumbs_up_count integer, heart_count integer)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT r.tip_id,
         count(*) FILTER (WHERE r.reaction_type = 'thumbs_up')::integer,
         count(*) FILTER (WHERE r.reaction_type = 'heart')::integer
  FROM public.parent_tip_reactions r
  WHERE public.current_user_is_admin() AND r.tip_id = ANY(_tip_ids)
  GROUP BY r.tip_id
$$;

REVOKE ALL ON FUNCTION public.admin_get_tip_reaction_counts(uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_get_tip_reaction_counts(uuid[]) TO authenticated;

-- Author update: any edit returns the tip to pending review
CREATE OR REPLACE FUNCTION public.author_update_tip(_tip_id uuid, _payload jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_tip public.parent_community_tips%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF NOT private.is_account_active(v_uid) THEN RAISE EXCEPTION 'Account is not active'; END IF;

  SELECT * INTO v_tip FROM public.parent_community_tips WHERE id = _tip_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Tip not found'; END IF;
  IF v_tip.submitted_by_user_id <> v_uid THEN RAISE EXCEPTION 'You can only edit your own tips'; END IF;
  IF v_tip.status = 'archived'::public.tip_status THEN
    RAISE EXCEPTION 'Archived tips cannot be edited. Please contact an admin.';
  END IF;

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
    status = 'pending_review'::public.tip_status,
    rejection_reason = NULL,
    admin_reviewed_by = NULL,
    admin_reviewed_at = NULL,
    published_at = NULL,
    updated_at = now()
  WHERE id = _tip_id;
END;
$$;

REVOKE ALL ON FUNCTION public.author_update_tip(uuid, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.author_update_tip(uuid, jsonb) TO authenticated;