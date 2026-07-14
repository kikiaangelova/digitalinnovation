
-- 1) Remove overly broad teacher_verified read-all policies
DROP POLICY IF EXISTS "Verified teachers read all module responses" ON public.learning_module_responses;
DROP POLICY IF EXISTS "Verified teachers read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Verified teachers read all quiz results" ON public.quiz_results;
DROP POLICY IF EXISTS "Verified teachers read all sim progress" ON public.simulator_progress;
DROP POLICY IF EXISTS "Verified teachers read all startup projects" ON public.startup_projects;
DROP POLICY IF EXISTS "Verified teachers read all submissions" ON public.submissions;

-- 2) Align profiles SELECT with visibility flags for realtime consumers
CREATE POLICY "Authenticated can read visible profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (leaderboard_visible = true OR profile_visible = true);

-- 3) Lock down SECURITY DEFINER helpers not intended for direct client RPC.
-- Client-facing RPCs are preserved: get_leaderboard, get_weekly_leaderboard,
-- get_registered_user_count, get_player_questions, get_case_results_questions,
-- get_player_assessment_questions, get_assessment_results_questions,
-- generate_class_code.
REVOKE EXECUTE ON FUNCTION public.add_user_xp(uuid, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recalculate_all_xp() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.save_exam_draft_answers(text, text, text, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_cohort_classmates(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_user_cohort_id(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.create_startup_version() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_answer_history_version_number() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_data_retention() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_total_xp() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_admin_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
