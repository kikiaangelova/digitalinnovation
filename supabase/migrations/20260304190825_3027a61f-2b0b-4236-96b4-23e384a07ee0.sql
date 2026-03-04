
-- Fix 1: Profiles table - restrict SELECT to respect profile_visible flag
-- Drop existing permissive SELECT policy
DROP POLICY IF EXISTS "Profiles viewable by authenticated" ON public.profiles;

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can view other profiles only if profile_visible is true
CREATE POLICY "Public profiles viewable"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (profile_visible = true);

-- Fix 2: Teams table - fix broken RLS policy and restrict join_code visibility
-- Drop the broken SELECT policy (tm.team_id = tm.id is wrong, should be teams.id)
DROP POLICY IF EXISTS "Team members can view teams" ON public.teams;

-- Recreate with correct condition
CREATE POLICY "Team members can view teams"
  ON public.teams FOR SELECT
  TO authenticated
  USING (
    (EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = teams.id AND tm.user_id = auth.uid()
    ))
    OR has_role(auth.uid(), 'admin'::app_role)
  );
