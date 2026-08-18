DROP POLICY IF EXISTS "Users can edit their own tips" ON public.parent_community_tips;
CREATE POLICY "Users can edit their own tips"
ON public.parent_community_tips FOR UPDATE TO authenticated
USING (auth.uid() = submitted_by_user_id AND status <> 'archived'::public.tip_status)
WITH CHECK (
  auth.uid() = submitted_by_user_id
  AND status IN ('pending_review'::public.tip_status, 'archived'::public.tip_status)
);