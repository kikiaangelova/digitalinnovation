
-- Update recalculate_all_xp with new XP values
CREATE OR REPLACE FUNCTION public.recalculate_all_xp()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  r RECORD;
  calculated_xp integer;
  case_xp integer;
  startup_xp integer;
  sim_xp integer;
  dict_xp integer;
BEGIN
  FOR r IN SELECT user_id FROM profiles LOOP
    -- Case XP from xp_ledger (preferred) or fallback to case_sessions
    SELECT COALESCE(SUM(xl.xp), 0) INTO case_xp
    FROM xp_ledger xl
    WHERE xl.user_id = r.user_id AND xl.action LIKE 'case_%';

    IF case_xp = 0 THEN
      SELECT COALESCE(SUM(cs.xp_earned), 0) INTO case_xp
      FROM case_sessions cs
      WHERE cs.user_id = r.user_id AND cs.completion_status = 'completed';
    END IF;

    -- Startup XP: new values (40-50 per section, 120 for pitch)
    SELECT COALESCE(
      (CASE WHEN length(sp.problem) > 20 THEN 40 ELSE 0 END) +
      (CASE WHEN length(sp.customer) > 20 THEN 40 ELSE 0 END) +
      (CASE WHEN length(sp.value_proposition) > 20 THEN 40 ELSE 0 END) +
      (CASE WHEN length(sp.digital_product) > 20 THEN 50 ELSE 0 END) +
      (CASE WHEN length(sp.business_model) > 20 THEN 50 ELSE 0 END) +
      (CASE WHEN length(sp.growth_strategy) > 20 THEN 50 ELSE 0 END) +
      (CASE WHEN length(sp.final_pitch) > 20 THEN 120 ELSE 0 END)
    , 0) INTO startup_xp
    FROM startup_projects sp
    WHERE sp.user_id = r.user_id
    LIMIT 1;

    IF startup_xp IS NULL THEN startup_xp := 0; END IF;

    -- Simulator XP: 50 per complete scenario + 50 bonus for high performance
    SELECT COALESCE(
      CASE WHEN sim.is_complete THEN 50 ELSE 0 END +
      CASE WHEN sim.is_complete AND sim.grade IN ('A+', 'A', 'B+') THEN 50 ELSE 0 END
    , 0) INTO sim_xp
    FROM simulator_progress sim
    WHERE sim.user_id = r.user_id
    LIMIT 1;

    IF sim_xp IS NULL THEN sim_xp := 0; END IF;

    -- Dictionary XP from ledger
    SELECT COALESCE(SUM(xl.xp), 0) INTO dict_xp
    FROM xp_ledger xl
    WHERE xl.user_id = r.user_id AND xl.action LIKE 'dict_%';

    IF dict_xp IS NULL THEN dict_xp := 0; END IF;

    calculated_xp := case_xp + startup_xp + sim_xp + dict_xp;

    -- Only update if calculated is higher (never reduce)
    UPDATE profiles
    SET total_xp = GREATEST(total_xp, calculated_xp), updated_at = now()
    WHERE user_id = r.user_id;
  END LOOP;
END;
$function$;
