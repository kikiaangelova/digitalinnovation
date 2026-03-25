
-- 1. Add display_name column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name text;

-- 2. Backfill existing users: first initial + last initial + random 3 digits
UPDATE public.profiles
SET display_name = 
  UPPER(LEFT(COALESCE(split_part(trim(full_name), ' ', 1), 'U'), 1)) ||
  UPPER(LEFT(COALESCE(NULLIF(split_part(trim(full_name), ' ', 2), ''), split_part(trim(full_name), ' ', 1)), 1)) ||
  '_' || LPAD((floor(random() * 900 + 100))::text, 3, '0')
WHERE display_name IS NULL;

-- 3. Update handle_new_user to set display_name from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_count integer;
  assigned_role app_role;
  v_display_name text;
  v_full_name text;
BEGIN
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email);
  v_display_name := COALESCE(
    NULLIF(trim(NEW.raw_user_meta_data->>'display_name'), ''),
    UPPER(LEFT(split_part(trim(v_full_name), ' ', 1), 1)) ||
    UPPER(LEFT(COALESCE(NULLIF(split_part(trim(v_full_name), ' ', 2), ''), split_part(trim(v_full_name), ' ', 1)), 1)) ||
    '_' || LPAD((floor(random() * 900 + 100))::text, 3, '0')
  );

  INSERT INTO public.profiles (user_id, full_name, display_name)
  VALUES (NEW.id, v_full_name, v_display_name);

  SELECT COUNT(*) INTO user_count FROM public.user_roles;
  IF user_count = 0 THEN
    assigned_role := 'admin';
  ELSE
    assigned_role := 'student';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$function$;

-- 4. Update get_leaderboard to use display_name
CREATE OR REPLACE FUNCTION public.get_leaderboard(_limit integer DEFAULT 10)
RETURNS TABLE(user_id uuid, display_name text, total_xp integer)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT p.user_id,
         COALESCE(p.display_name, 
           UPPER(LEFT(COALESCE(split_part(trim(p.full_name), ' ', 1), 'U'), 1)) ||
           UPPER(LEFT(COALESCE(NULLIF(split_part(trim(p.full_name), ' ', 2), ''), 'X'), 1)) ||
           '_***'
         ) as display_name,
         p.total_xp
  FROM public.profiles p
  WHERE p.leaderboard_visible = true
  ORDER BY p.total_xp DESC, p.created_at ASC
  LIMIT _limit;
$function$;

-- 5. Update get_weekly_leaderboard to use display_name
CREATE OR REPLACE FUNCTION public.get_weekly_leaderboard(_limit integer DEFAULT 10)
RETURNS TABLE(user_id uuid, display_name text, total_xp integer)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT xl.user_id,
         COALESCE(p.display_name,
           UPPER(LEFT(COALESCE(split_part(trim(p.full_name), ' ', 1), 'U'), 1)) ||
           UPPER(LEFT(COALESCE(NULLIF(split_part(trim(p.full_name), ' ', 2), ''), 'X'), 1)) ||
           '_***'
         ) as display_name,
         SUM(xl.xp)::integer as total_xp
  FROM public.xp_ledger xl
  JOIN public.profiles p ON p.user_id = xl.user_id AND p.leaderboard_visible = true
  WHERE xl.created_at >= date_trunc('week', now())
  GROUP BY xl.user_id, p.full_name, p.display_name
  HAVING SUM(xl.xp) > 0
  ORDER BY total_xp DESC, xl.user_id
  LIMIT _limit;
$function$;
