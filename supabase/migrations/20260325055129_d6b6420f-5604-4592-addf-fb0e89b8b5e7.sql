CREATE OR REPLACE FUNCTION public.get_weekly_leaderboard(_limit integer DEFAULT 10)
RETURNS TABLE(user_id uuid, display_name text, total_xp integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT xl.user_id,
         CASE 
           WHEN p.full_name IS NULL THEN 'Student'
           WHEN position(' ' in trim(p.full_name)) > 0 
             THEN split_part(trim(p.full_name), ' ', 1) || ' ' || left(split_part(trim(p.full_name), ' ', 2), 1) || '.'
           ELSE trim(p.full_name)
         END as display_name,
         SUM(xl.xp)::integer as total_xp
  FROM public.xp_ledger xl
  JOIN public.profiles p ON p.user_id = xl.user_id AND p.leaderboard_visible = true
  WHERE xl.created_at >= date_trunc('week', now())
  GROUP BY xl.user_id, p.full_name
  HAVING SUM(xl.xp) > 0
  ORDER BY total_xp DESC, xl.user_id
  LIMIT _limit;
$$;