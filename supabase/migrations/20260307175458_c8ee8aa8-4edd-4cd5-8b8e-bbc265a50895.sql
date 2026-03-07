-- Fix: get_cohort_classmates — ignore untrusted _user_id param, use auth.uid() directly
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
    AND p.cohort_id = (SELECT cohort_id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
    AND p.user_id != auth.uid();
$$;