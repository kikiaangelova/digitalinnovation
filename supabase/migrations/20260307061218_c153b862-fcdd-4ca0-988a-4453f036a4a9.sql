
-- Fix 1: Drop stale profile policies that leak data to all authenticated users
DROP POLICY IF EXISTS "Public profiles viewable" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- The existing "Profiles select policy" (own + admin) remains and is sufficient.

-- Fix 2: Tighten cohort_members SELECT to same-cohort members + admin only
DROP POLICY IF EXISTS "Users can view own memberships" ON public.cohort_members;

CREATE POLICY "Users view same-cohort memberships"
  ON public.cohort_members
  FOR SELECT
  TO authenticated
  USING (
    (auth.uid() = user_id)
    OR (EXISTS (
      SELECT 1 FROM public.cohort_members cm2
      WHERE cm2.cohort_id = cohort_members.cohort_id
        AND cm2.user_id = auth.uid()
    ))
    OR has_role(auth.uid(), 'admin'::app_role)
  );
