
-- 1. Protect phone column on profiles via column-level privileges
REVOKE SELECT ON public.profiles FROM authenticated, anon;
GRANT SELECT (id, user_id, first_name, last_name, previous_grade, previous_program, is_from_dis, rating_average, rating_count, completed_transactions, no_show_count, created_at, updated_at, school, class_year, avatar_url, bio) ON public.profiles TO authenticated;

-- 2. Tighten user_ratings insert policy: require a completed transaction between rater and rated user
DROP POLICY IF EXISTS "Authenticated users can create ratings" ON public.user_ratings;
CREATE POLICY "Raters can rate only completed transaction counterparties"
ON public.user_ratings
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = rater_id
  AND rater_id <> rated_user_id
  AND EXISTS (
    SELECT 1 FROM public.transactions t
    WHERE t.id = user_ratings.transaction_id
      AND t.status = 'completed'
      AND (
        (t.buyer_id = auth.uid()  AND t.seller_id = user_ratings.rated_user_id)
        OR
        (t.seller_id = auth.uid() AND t.buyer_id  = user_ratings.rated_user_id)
      )
  )
);

-- 3. Hide user_roles from authenticated GraphQL discovery (only service_role + SECURITY DEFINER funcs use it)
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.user_roles FROM authenticated, anon;
