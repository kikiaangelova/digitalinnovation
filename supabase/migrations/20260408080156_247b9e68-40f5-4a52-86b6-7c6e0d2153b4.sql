
-- Remove the permissive UPDATE policy that allows score manipulation
DROP POLICY IF EXISTS "Users can update own exam results" ON public.final_exam_results;

-- Create a security definer function that only allows updating answer text columns
CREATE OR REPLACE FUNCTION public.save_exam_draft_answers(
  p_case_analysis text,
  p_startup_concept text,
  p_strategic_decision text,
  p_reflection text
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE final_exam_results
  SET case_analysis_answer = p_case_analysis,
      startup_concept_answer = p_startup_concept,
      strategic_decision_answer = p_strategic_decision,
      reflection_answer = p_reflection,
      updated_at = now()
  WHERE user_id = auth.uid();
$$;
