
-- ============================================
-- STARTUP PROJECT VERSIONING
-- ============================================
CREATE TABLE public.startup_project_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  user_id uuid NOT NULL,
  version_number integer NOT NULL DEFAULT 1,
  problem text NOT NULL DEFAULT '',
  customer text NOT NULL DEFAULT '',
  value_proposition text NOT NULL DEFAULT '',
  digital_product text NOT NULL DEFAULT '',
  business_model text NOT NULL DEFAULT '',
  growth_strategy text NOT NULL DEFAULT '',
  final_pitch text NOT NULL DEFAULT '',
  industry text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES public.startup_projects(id) ON DELETE CASCADE
);

ALTER TABLE public.startup_project_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own versions"
  ON public.startup_project_versions FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert own versions"
  ON public.startup_project_versions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Auto-create version on startup_projects update
CREATE OR REPLACE FUNCTION public.create_startup_version()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_version integer;
BEGIN
  SELECT COALESCE(MAX(version_number), 0) + 1 INTO next_version
  FROM public.startup_project_versions WHERE project_id = NEW.id;

  INSERT INTO public.startup_project_versions (
    project_id, user_id, version_number,
    problem, customer, value_proposition, digital_product,
    business_model, growth_strategy, final_pitch, industry
  ) VALUES (
    NEW.id, NEW.user_id, next_version,
    NEW.problem, NEW.customer, NEW.value_proposition, NEW.digital_product,
    NEW.business_model, NEW.growth_strategy, NEW.final_pitch, NEW.industry
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_startup_version
  AFTER UPDATE ON public.startup_projects
  FOR EACH ROW
  WHEN (OLD.problem IS DISTINCT FROM NEW.problem
    OR OLD.customer IS DISTINCT FROM NEW.customer
    OR OLD.value_proposition IS DISTINCT FROM NEW.value_proposition
    OR OLD.digital_product IS DISTINCT FROM NEW.digital_product
    OR OLD.business_model IS DISTINCT FROM NEW.business_model
    OR OLD.growth_strategy IS DISTINCT FROM NEW.growth_strategy
    OR OLD.final_pitch IS DISTINCT FROM NEW.final_pitch)
  EXECUTE FUNCTION public.create_startup_version();

-- ============================================
-- COURSE PROGRESS TABLE
-- ============================================
CREATE TABLE public.course_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  module text NOT NULL, -- 'cases', 'simulator', 'startup', 'dictionary', 'assessment'
  module_id text, -- specific item id
  status text NOT NULL DEFAULT 'not_started', -- not_started, in_progress, completed
  score integer,
  metadata jsonb DEFAULT '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, module, module_id)
);

ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON public.course_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert own progress"
  ON public.course_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.course_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins manage all progress"
  ON public.course_progress FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Update trigger for course_progress
CREATE TRIGGER trg_course_progress_updated
  BEFORE UPDATE ON public.course_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- SIMULATOR PROGRESS TABLE
-- ============================================
CREATE TABLE public.simulator_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  current_week integer NOT NULL DEFAULT 1,
  kpis jsonb NOT NULL DEFAULT '{"users":0,"revenue":0,"satisfaction":50,"growthRate":0}'::jsonb,
  decisions jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_complete boolean NOT NULL DEFAULT false,
  grade text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.simulator_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sim progress"
  ON public.simulator_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert own sim progress"
  ON public.simulator_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sim progress"
  ON public.simulator_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins manage sim progress"
  ON public.simulator_progress FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_sim_progress_updated
  BEFORE UPDATE ON public.simulator_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- PERFORMANCE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_case_study_id ON public.submissions(case_study_id);
CREATE INDEX IF NOT EXISTS idx_responses_submission_id ON public.responses(submission_id);
CREATE INDEX IF NOT EXISTS idx_responses_question_id ON public.responses(question_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_cohort_members_user_id ON public.cohort_members(user_id);
CREATE INDEX IF NOT EXISTS idx_cohort_members_cohort_id ON public.cohort_members(cohort_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_startup_projects_user_id ON public.startup_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_case_steps_case_study_id ON public.case_steps(case_study_id);
CREATE INDEX IF NOT EXISTS idx_questions_case_step_id ON public.questions(case_step_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON public.course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_module ON public.course_progress(module);
CREATE INDEX IF NOT EXISTS idx_simulator_progress_user_id ON public.simulator_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_startup_versions_project ON public.startup_project_versions(project_id);
