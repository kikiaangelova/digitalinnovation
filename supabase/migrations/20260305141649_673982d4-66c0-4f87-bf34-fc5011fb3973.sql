
-- Fix 1: Restrict case_steps to published cases for authenticated users
DROP POLICY IF EXISTS "Steps viewable by authenticated users" ON public.case_steps;

CREATE POLICY "Steps viewable for published or admin"
  ON public.case_steps FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.case_studies cs
      WHERE cs.id = case_steps.case_study_id
        AND (cs.published = true OR public.has_role(auth.uid(), 'admin'))
    )
  );
