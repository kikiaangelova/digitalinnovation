-- Drop the overly permissive SELECT policies that leak correct_answer, model_answer, rubric to students
DROP POLICY IF EXISTS "Questions viewable by authenticated users" ON public.questions;
DROP POLICY IF EXISTS "Assessment questions viewable by authenticated" ON public.assessment_questions;