-- 1. Fix profiles: remove overly permissive "Public profiles viewable" policy
-- Replace with scoped policy: users in the same cohort can see each other
DROP POLICY IF EXISTS "Public profiles viewable" ON public.profiles;

CREATE POLICY "Cohort members can view profiles"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = user_id
  OR has_role(auth.uid(), 'admin'::app_role)
  OR (
    profile_visible = true
    AND cohort_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.profiles p2
      WHERE p2.user_id = auth.uid()
        AND p2.cohort_id = profiles.cohort_id
    )
  )
);

-- 2. Fix team_members: restrict to team members + admins only
DROP POLICY IF EXISTS "Team members viewable by authenticated" ON public.team_members;

CREATE POLICY "Team members viewable by team or admin"
ON public.team_members
FOR SELECT
USING (
  auth.uid() = user_id
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.team_members tm2
    WHERE tm2.team_id = team_members.team_id
      AND tm2.user_id = auth.uid()
  )
);

-- 3. Fix user_badges: restrict to own badges + admins
DROP POLICY IF EXISTS "User badges viewable by authenticated" ON public.user_badges;

CREATE POLICY "Users view own badges or admin"
ON public.user_badges
FOR SELECT
USING (
  auth.uid() = user_id
  OR has_role(auth.uid(), 'admin'::app_role)
);