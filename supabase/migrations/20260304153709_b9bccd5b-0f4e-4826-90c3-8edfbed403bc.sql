
-- ============================================
-- 1. FIX CRITICAL SECURITY: Profiles table
-- ============================================
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;

-- Authenticated users can view profiles (not anonymous internet users)
CREATE POLICY "Profiles viewable by authenticated"
  ON public.profiles FOR SELECT TO authenticated
  USING (true);

-- ============================================
-- 2. FIX CRITICAL SECURITY: Teams join_code exposure
-- ============================================
DROP POLICY IF EXISTS "Teams viewable" ON public.teams;

-- Team members and admins can see full team data (including join_code)
CREATE POLICY "Team members can view teams"
  ON public.teams FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.team_members tm WHERE tm.team_id = id AND tm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Anyone authenticated can see team name/id (for joining), but NOT join_code
-- We'll handle this via a view below

-- ============================================
-- 3. FIX: Allow peer reviewees to see their reviews
-- ============================================
DROP POLICY IF EXISTS "Users view own reviews" ON public.peer_reviews;

CREATE POLICY "Users view own reviews"
  ON public.peer_reviews FOR SELECT TO authenticated
  USING (
    auth.uid() = reviewer_user_id
    OR auth.uid() = reviewee_user_id
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- ============================================
-- 4. Fix team_members, badges, case_steps to require auth
-- ============================================
DROP POLICY IF EXISTS "Team members viewable" ON public.team_members;
CREATE POLICY "Team members viewable by authenticated"
  ON public.team_members FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Badges viewable" ON public.badges;
CREATE POLICY "Badges viewable by authenticated"
  ON public.badges FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "User badges viewable" ON public.user_badges;
CREATE POLICY "User badges viewable by authenticated"
  ON public.user_badges FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Steps viewable by authenticated" ON public.case_steps;
CREATE POLICY "Steps viewable by authenticated users"
  ON public.case_steps FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Questions viewable by authenticated" ON public.questions;
CREATE POLICY "Questions viewable by authenticated users"
  ON public.questions FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Cohorts viewable by authenticated" ON public.cohorts;
CREATE POLICY "Cohorts viewable by authenticated users"
  ON public.cohorts FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Assessment questions viewable" ON public.assessment_questions;
CREATE POLICY "Assessment questions viewable by authenticated"
  ON public.assessment_questions FOR SELECT TO authenticated
  USING (true);
