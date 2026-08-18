CREATE TYPE public.tip_status AS ENUM ('draft','pending_review','approved','rejected','archived');

CREATE TABLE public.parent_community_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_provider_name text NOT NULL,
  activity_opportunity_name text NOT NULL,
  brief_description text NOT NULL,
  contact_information text,
  website_url text,
  email text,
  phone text,
  social_page text,
  location text,
  approximate_age_range_suitable_level text[] NOT NULL DEFAULT '{}',
  language text,
  approximate_cost text,
  period text,
  personal_feedback text NOT NULL,
  would_recommend_again boolean,
  photo_logo_url text,
  status public.tip_status NOT NULL DEFAULT 'pending_review',
  admin_reviewed_by uuid REFERENCES auth.users(id),
  admin_reviewed_at timestamptz,
  admin_notes text,
  rejection_reason text,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.parent_community_tips TO authenticated;
GRANT ALL ON public.parent_community_tips TO service_role;

ALTER TABLE public.parent_community_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own tips"
ON public.parent_community_tips FOR INSERT TO authenticated
WITH CHECK (auth.uid() = submitted_by_user_id);

CREATE POLICY "Users can view their own tips"
ON public.parent_community_tips FOR SELECT TO authenticated
USING (auth.uid() = submitted_by_user_id);

CREATE POLICY "Users can edit their own pending tips"
ON public.parent_community_tips FOR UPDATE TO authenticated
USING (auth.uid() = submitted_by_user_id AND status IN ('draft','pending_review'))
WITH CHECK (auth.uid() = submitted_by_user_id AND status IN ('draft','pending_review'));

CREATE POLICY "Admins can view all tips"
ON public.parent_community_tips FOR SELECT TO authenticated
USING (public.current_user_is_admin());

CREATE POLICY "Admins can update all tips"
ON public.parent_community_tips FOR UPDATE TO authenticated
USING (public.current_user_is_admin())
WITH CHECK (public.current_user_is_admin());

CREATE TRIGGER update_parent_community_tips_updated_at
BEFORE UPDATE ON public.parent_community_tips
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_pct_status_published ON public.parent_community_tips (status, published_at DESC);
CREATE INDEX idx_pct_submitter ON public.parent_community_tips (submitted_by_user_id);

-- Public read of approved tips only, without admin notes or submitter identity
CREATE OR REPLACE FUNCTION public.public_get_community_tips(_search text DEFAULT NULL, _limit integer DEFAULT 60)
RETURNS TABLE (
  id uuid,
  entity_provider_name text,
  activity_opportunity_name text,
  brief_description text,
  contact_information text,
  website_url text,
  email text,
  phone text,
  social_page text,
  location text,
  approximate_age_range_suitable_level text[],
  language text,
  approximate_cost text,
  period text,
  personal_feedback text,
  would_recommend_again boolean,
  photo_logo_url text,
  published_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT t.id, t.entity_provider_name, t.activity_opportunity_name, t.brief_description,
         t.contact_information, t.website_url, t.email, t.phone, t.social_page, t.location,
         t.approximate_age_range_suitable_level, t.language, t.approximate_cost, t.period,
         t.personal_feedback, t.would_recommend_again, t.photo_logo_url,
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
$$;

GRANT EXECUTE ON FUNCTION public.public_get_community_tips(text, integer) TO anon, authenticated;

-- Admin listing with submitter name
CREATE OR REPLACE FUNCTION public.admin_list_community_tips()
RETURNS SETOF public.parent_community_tips
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.parent_community_tips
  WHERE public.current_user_is_admin()
  ORDER BY created_at DESC
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_community_tips() TO authenticated;