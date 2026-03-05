-- Allow anonymous users to view published case studies
CREATE POLICY "Published cases viewable by anyone"
ON public.case_studies
FOR SELECT
TO anon
USING (published = true);

-- Also allow anon to view case_steps for published cases
CREATE POLICY "Case steps viewable by anyone for published cases"
ON public.case_steps
FOR SELECT
TO anon
USING (
  EXISTS (
    SELECT 1 FROM public.case_studies cs
    WHERE cs.id = case_study_id AND cs.published = true
  )
);