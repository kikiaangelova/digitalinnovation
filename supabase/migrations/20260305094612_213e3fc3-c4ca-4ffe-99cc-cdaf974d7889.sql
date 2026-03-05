-- Add total_xp column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_xp integer NOT NULL DEFAULT 0;

-- Function to add XP to a user (SECURITY DEFINER so edge functions can call it)
CREATE OR REPLACE FUNCTION public.add_user_xp(_user_id uuid, _xp integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  new_total integer;
BEGIN
  UPDATE public.profiles
  SET total_xp = total_xp + _xp, updated_at = now()
  WHERE user_id = _user_id
  RETURNING total_xp INTO new_total;
  RETURN COALESCE(new_total, 0);
END;
$$;

-- Function for public leaderboard reading (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_leaderboard(_limit integer DEFAULT 10)
RETURNS TABLE(user_id uuid, display_name text, total_xp integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT p.user_id, 
         CASE 
           WHEN p.full_name IS NULL THEN 'Student'
           WHEN position(' ' in trim(p.full_name)) > 0 
             THEN split_part(trim(p.full_name), ' ', 1) || ' ' || left(split_part(trim(p.full_name), ' ', 2), 1) || '.'
           ELSE trim(p.full_name)
         END as display_name,
         p.total_xp
  FROM public.profiles p
  WHERE p.leaderboard_visible = true AND p.total_xp > 0
  ORDER BY p.total_xp DESC
  LIMIT _limit;
$$;