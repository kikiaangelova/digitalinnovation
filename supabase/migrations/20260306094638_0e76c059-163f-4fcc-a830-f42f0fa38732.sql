
-- Fix 1: Remove leaderboard_visible exposure from profiles SELECT policy
-- Keep: own profile, admin, same-cohort visible profiles
DROP POLICY IF EXISTS "Profiles select policy" ON public.profiles;

CREATE POLICY "Profiles select policy" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    (auth.uid() = user_id)
    OR has_role(auth.uid(), 'admin'::app_role)
    OR (
      profile_visible = true
      AND cohort_id IS NOT NULL
      AND cohort_id = get_user_cohort_id(auth.uid())
    )
  );

-- Fix 2: Restrict team_members SELECT to authenticated only
DROP POLICY IF EXISTS "Team members viewable by team or admin" ON public.team_members;

CREATE POLICY "Team members viewable by team or admin" ON public.team_members
  FOR SELECT TO authenticated
  USING (
    (auth.uid() = user_id)
    OR has_role(auth.uid(), 'admin'::app_role)
    OR (EXISTS (
      SELECT 1 FROM team_members tm2
      WHERE tm2.team_id = team_members.team_id AND tm2.user_id = auth.uid()
    ))
  );

-- Fix 3: Restrict submissions UPDATE to drafts only with WITH CHECK
DROP POLICY IF EXISTS "Users can update own drafts" ON public.submissions;

CREATE POLICY "Users can update own draft submissions" ON public.submissions
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND is_draft = true)
  WITH CHECK (auth.uid() = user_id AND is_draft = true);
