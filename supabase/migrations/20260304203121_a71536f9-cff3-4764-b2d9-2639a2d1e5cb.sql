
-- Fix 1: Restrict direct SELECT on questions and assessment_questions to admin-only
-- Students will use SECURITY DEFINER RPCs instead

DROP POLICY IF EXISTS "Questions viewable by authenticated users" ON public.questions;
DROP POLICY IF EXISTS "Assessment questions viewable by authenticated" ON public.assessment_questions;

-- Admin-only direct access
CREATE POLICY "Questions viewable by admin" ON public.questions
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Assessment questions viewable by admin" ON public.assessment_questions
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Create SECURITY DEFINER RPC for students to get questions WITHOUT answers
CREATE OR REPLACE FUNCTION public.get_player_questions(_case_study_id uuid)
RETURNS TABLE(
  id uuid,
  case_step_id uuid,
  question_order integer,
  type text,
  prompt text,
  prompt_bg text,
  options jsonb,
  points integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT q.id, q.case_step_id, q.question_order, q.type::text, q.prompt, q.prompt_bg, q.options, q.points
  FROM questions q
  JOIN case_steps cs ON cs.id = q.case_step_id
  WHERE cs.case_study_id = _case_study_id
  ORDER BY q.question_order;
$$;

-- Create SECURITY DEFINER RPC for assessment player questions WITHOUT answers
CREATE OR REPLACE FUNCTION public.get_player_assessment_questions(_assessment_id uuid)
RETURNS TABLE(
  id uuid,
  question_order integer,
  type text,
  prompt text,
  options jsonb,
  points integer,
  competency_id uuid
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT aq.id, aq.question_order, aq.type, aq.prompt, aq.options, aq.points, aq.competency_id
  FROM assessment_questions aq
  WHERE aq.assessment_id = _assessment_id
  ORDER BY aq.question_order;
$$;

-- Fix 2: Restrict responses UPDATE to only the answer column
-- Drop old permissive policy
DROP POLICY IF EXISTS "Users can update own responses" ON public.responses;

-- Recreate with column restriction via WITH CHECK
CREATE POLICY "Users can update own draft responses" ON public.responses
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM submissions s
      WHERE s.id = responses.submission_id
        AND s.user_id = auth.uid()
        AND s.is_draft = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM submissions s
      WHERE s.id = responses.submission_id
        AND s.user_id = auth.uid()
        AND s.is_draft = true
    )
  );

-- Revoke UPDATE on score/feedback columns from authenticated users, grant only answer
REVOKE UPDATE ON public.responses FROM authenticated;
GRANT UPDATE (answer) ON public.responses TO authenticated;
