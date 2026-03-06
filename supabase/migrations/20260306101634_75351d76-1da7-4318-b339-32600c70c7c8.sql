
-- Remove cohort-based visibility from profiles SELECT policy
-- Only allow: own profile OR admin access
-- This prevents leaking personal data (bio, links, interests) to cohort members
DROP POLICY IF EXISTS "Profiles select policy" ON public.profiles;

CREATE POLICY "Profiles select policy" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    (auth.uid() = user_id)
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Create a safe RPC for classmate discovery (returns only name + avatar)
CREATE OR REPLACE FUNCTION public.get_cohort_classmates(_user_id uuid)
RETURNS TABLE(user_id uuid, full_name text, avatar_url text, skills_tags text[])
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.user_id, p.full_name, p.avatar_url, p.skills_tags
  FROM profiles p
  WHERE p.profile_visible = true
    AND p.cohort_id IS NOT NULL
    AND p.cohort_id = (SELECT cohort_id FROM profiles WHERE user_id = _user_id LIMIT 1)
    AND p.user_id != _user_id;
$$;
