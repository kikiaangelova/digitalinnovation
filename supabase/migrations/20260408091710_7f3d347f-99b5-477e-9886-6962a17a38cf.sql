-- Verified teachers can read all profiles
CREATE POLICY "Verified teachers read all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'teacher_verified')
);

-- Verified teachers can read all submissions
CREATE POLICY "Verified teachers read all submissions"
ON public.submissions
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'teacher_verified')
);

-- Verified teachers can read all startup_projects
CREATE POLICY "Verified teachers read all startup projects"
ON public.startup_projects
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'teacher_verified')
);

-- Verified teachers can read all simulator_progress
CREATE POLICY "Verified teachers read all sim progress"
ON public.simulator_progress
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'teacher_verified')
);

-- Verified teachers can read all quiz_results
CREATE POLICY "Verified teachers read all quiz results"
ON public.quiz_results
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'teacher_verified')
);

-- Verified teachers can read all learning_module_responses
CREATE POLICY "Verified teachers read all module responses"
ON public.learning_module_responses
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'teacher_verified')
);