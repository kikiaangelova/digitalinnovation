
-- 1. Create a security definer function to get a user's cohort_id without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_cohort_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT cohort_id FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

-- 2. Drop the recursive policy
DROP POLICY IF EXISTS "Cohort members can view profiles" ON public.profiles;

-- 3. Drop the redundant "Admins can view all profiles" (already covered by new policy)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- 4. Drop the "Users can view own profile" (will be consolidated)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- 5. Create a single consolidated SELECT policy that handles all cases without recursion
CREATE POLICY "Profiles select policy" ON public.profiles
FOR SELECT TO authenticated
USING (
  auth.uid() = user_id
  OR has_role(auth.uid(), 'admin'::app_role)
  OR (leaderboard_visible = true)
  OR (
    profile_visible = true
    AND cohort_id IS NOT NULL
    AND cohort_id = get_user_cohort_id(auth.uid())
  )
);
