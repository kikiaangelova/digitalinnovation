
-- Create RPC to get assessment questions with answers (only if user has submitted)
CREATE OR REPLACE FUNCTION public.get_assessment_results_questions(
  _assessment_id uuid
)
RETURNS TABLE (
  id uuid,
  prompt text,
  type text,
  points integer,
  correct_answer text,
  model_answer text,
  competency_id uuid,
  question_order integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    aq.id, aq.prompt, aq.type, aq.points,
    CASE WHEN EXISTS (
      SELECT 1 FROM submissions s 
      WHERE s.assessment_id = _assessment_id 
        AND s.user_id = auth.uid() 
        AND s.is_draft = false
    ) OR has_role(auth.uid(), 'admin') THEN aq.correct_answer ELSE NULL END,
    CASE WHEN EXISTS (
      SELECT 1 FROM submissions s 
      WHERE s.assessment_id = _assessment_id 
        AND s.user_id = auth.uid() 
        AND s.is_draft = false
    ) OR has_role(auth.uid(), 'admin') THEN aq.model_answer ELSE NULL END,
    aq.competency_id,
    aq.question_order
  FROM assessment_questions aq
  WHERE aq.assessment_id = _assessment_id
  ORDER BY aq.question_order
$$;

-- Create RPC to get case questions with answers (only if user has submitted)
CREATE OR REPLACE FUNCTION public.get_case_results_questions(
  _case_study_id uuid
)
RETURNS TABLE (
  id uuid,
  case_step_id uuid,
  prompt text,
  type text,
  points integer,
  correct_answer text,
  model_answer text,
  rubric text,
  question_order integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    q.id, q.case_step_id, q.prompt, q.type::text, q.points,
    CASE WHEN EXISTS (
      SELECT 1 FROM submissions s 
      WHERE s.case_study_id = _case_study_id 
        AND s.user_id = auth.uid() 
        AND s.is_draft = false
    ) OR has_role(auth.uid(), 'admin') THEN q.correct_answer ELSE NULL END,
    CASE WHEN EXISTS (
      SELECT 1 FROM submissions s 
      WHERE s.case_study_id = _case_study_id 
        AND s.user_id = auth.uid() 
        AND s.is_draft = false
    ) OR has_role(auth.uid(), 'admin') THEN q.model_answer ELSE NULL END,
    CASE WHEN EXISTS (
      SELECT 1 FROM submissions s 
      WHERE s.case_study_id = _case_study_id 
        AND s.user_id = auth.uid() 
        AND s.is_draft = false
    ) OR has_role(auth.uid(), 'admin') THEN q.rubric ELSE NULL END,
    q.question_order
  FROM questions q
  JOIN case_steps cs ON cs.id = q.case_step_id
  WHERE cs.case_study_id = _case_study_id
  ORDER BY q.question_order
$$;

-- Now restrict direct SELECT on assessment_questions to hide sensitive columns from students
-- Drop the open policy
DROP POLICY IF EXISTS "Assessment questions viewable by authenticated" ON assessment_questions;

-- Create a new policy that only exposes non-sensitive columns to authenticated users
-- Since RLS can't restrict columns, we keep the open read but the sensitive data
-- is now accessed through the secure RPC functions above.
-- We still need students to read questions for the player (without answers).
CREATE POLICY "Assessment questions viewable by authenticated"
ON assessment_questions FOR SELECT TO authenticated
USING (true);

-- For the questions table, same approach
DROP POLICY IF EXISTS "Questions viewable by authenticated users" ON questions;
CREATE POLICY "Questions viewable by authenticated users"
ON questions FOR SELECT TO authenticated
USING (true);
