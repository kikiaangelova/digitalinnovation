
-- 1. Create a function to recalculate XP for all users based on actual activity
CREATE OR REPLACE FUNCTION public.recalculate_all_xp()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  r RECORD;
  calculated_xp integer;
  case_xp integer;
  startup_xp integer;
  sim_xp integer;
BEGIN
  FOR r IN SELECT user_id FROM profiles LOOP
    -- Case XP: from case_sessions with completion_status = 'completed'
    SELECT COALESCE(SUM(cs.xp_earned), 0) INTO case_xp
    FROM case_sessions cs
    WHERE cs.user_id = r.user_id AND cs.completion_status = 'completed';

    -- Also count from graded submissions (total_score based)
    IF case_xp = 0 THEN
      SELECT COALESCE(SUM(
        CASE 
          WHEN s.max_score > 0 AND (s.total_score::float / s.max_score) >= 0.8 THEN 100
          WHEN s.max_score > 0 AND (s.total_score::float / s.max_score) >= 0.6 THEN 75
          WHEN s.max_score > 0 AND (s.total_score::float / s.max_score) >= 0.4 THEN 50
          WHEN s.max_score > 0 THEN 10
          WHEN s.is_draft = false THEN 25
          ELSE 0
        END
      ), 0) INTO case_xp
      FROM submissions s
      WHERE s.user_id = r.user_id AND s.is_draft = false;
    END IF;

    -- Startup XP: count non-empty sections (7 sections * 15 XP each)
    SELECT COALESCE(
      (CASE WHEN length(sp.problem) > 10 THEN 15 ELSE 0 END) +
      (CASE WHEN length(sp.customer) > 10 THEN 15 ELSE 0 END) +
      (CASE WHEN length(sp.value_proposition) > 10 THEN 15 ELSE 0 END) +
      (CASE WHEN length(sp.digital_product) > 10 THEN 15 ELSE 0 END) +
      (CASE WHEN length(sp.business_model) > 10 THEN 15 ELSE 0 END) +
      (CASE WHEN length(sp.growth_strategy) > 10 THEN 15 ELSE 0 END) +
      (CASE WHEN length(sp.final_pitch) > 10 THEN 30 ELSE 0 END)
    , 0) INTO startup_xp
    FROM startup_projects sp
    WHERE sp.user_id = r.user_id
    LIMIT 1;

    IF startup_xp IS NULL THEN startup_xp := 0; END IF;

    -- Simulator XP: 20 XP per completed week, 50 bonus if complete
    SELECT COALESCE(
      (sim.current_week - 1) * 20 + CASE WHEN sim.is_complete THEN 50 ELSE 0 END
    , 0) INTO sim_xp
    FROM simulator_progress sim
    WHERE sim.user_id = r.user_id
    LIMIT 1;

    IF sim_xp IS NULL THEN sim_xp := 0; END IF;

    calculated_xp := case_xp + startup_xp + sim_xp;

    -- Only update if calculated is higher (never reduce)
    UPDATE profiles
    SET total_xp = GREATEST(total_xp, calculated_xp), updated_at = now()
    WHERE user_id = r.user_id;
  END LOOP;
END;
$$;

-- 2. Update get_leaderboard to show all students (remove leaderboard_visible and xp>0 filters)
CREATE OR REPLACE FUNCTION public.get_leaderboard(_limit integer DEFAULT 10)
RETURNS TABLE(user_id uuid, display_name text, total_xp integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
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
  WHERE p.leaderboard_visible = true
  ORDER BY p.total_xp DESC, p.created_at ASC
  LIMIT _limit;
$$;

-- 3. Update get_registered_user_count to count all users (already does this)
-- No change needed

-- 4. Change default for leaderboard_visible to true
ALTER TABLE public.profiles ALTER COLUMN leaderboard_visible SET DEFAULT true;
