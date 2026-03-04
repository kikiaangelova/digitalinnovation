
-- Extend profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bio text DEFAULT '',
  ADD COLUMN IF NOT EXISTS skills_tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS interests text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS links_json jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS profile_visible boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS cohort_id uuid REFERENCES public.cohorts(id) ON DELETE SET NULL;

-- Competencies
CREATE TABLE public.competencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.competencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Competencies viewable" ON public.competencies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage competencies" ON public.competencies FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Add competency_id to questions
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS competency_id uuid REFERENCES public.competencies(id);

-- Teams
CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id uuid REFERENCES public.cohorts(id) ON DELETE CASCADE,
  name text NOT NULL,
  join_code text UNIQUE DEFAULT substr(md5(random()::text), 1, 8),
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teams viewable" ON public.teams FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage teams" ON public.teams FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Team members
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member',
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team members viewable" ON public.team_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users join teams" ON public.team_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users leave teams" ON public.team_members FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage team members" ON public.team_members FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Team update policy
CREATE POLICY "Members update team" ON public.teams FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.team_members tm WHERE tm.team_id = teams.id AND tm.user_id = auth.uid())
);

-- Assessments
CREATE TABLE public.assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL DEFAULT 'midterm',
  published boolean NOT NULL DEFAULT false,
  settings_json jsonb DEFAULT '{"timed": false, "time_limit_minutes": 60, "multiple_attempts": false, "unlock_after_cases": 0}',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published assessments viewable" ON public.assessments FOR SELECT TO authenticated USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage assessments" ON public.assessments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Assessment questions
CREATE TABLE public.assessment_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES public.assessments(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL DEFAULT 'multiple_choice',
  prompt text NOT NULL,
  options jsonb,
  correct_answer text,
  model_answer text,
  rubric text,
  competency_id uuid REFERENCES public.competencies(id),
  points integer NOT NULL DEFAULT 5,
  question_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Assessment questions viewable" ON public.assessment_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage assessment questions" ON public.assessment_questions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Assignments
CREATE TABLE public.assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id uuid REFERENCES public.cohorts(id) ON DELETE CASCADE NOT NULL,
  case_study_id uuid REFERENCES public.case_studies(id) ON DELETE CASCADE,
  assessment_id uuid REFERENCES public.assessments(id) ON DELETE CASCADE,
  assignment_type text NOT NULL DEFAULT 'individual',
  due_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Assignments viewable" ON public.assignments FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.cohort_members cm WHERE cm.cohort_id = assignments.cohort_id AND cm.user_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Admins manage assignments" ON public.assignments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Extend submissions
ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS team_id uuid REFERENCES public.teams(id),
  ADD COLUMN IF NOT EXISTS assessment_id uuid REFERENCES public.assessments(id),
  ADD COLUMN IF NOT EXISTS started_at timestamptz DEFAULT now();

-- Peer reviews
CREATE TABLE public.peer_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
  reviewer_user_id uuid NOT NULL,
  reviewee_user_id uuid NOT NULL,
  participation_score integer DEFAULT 0,
  collaboration_score integer DEFAULT 0,
  quality_score integer DEFAULT 0,
  comments text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(submission_id, reviewer_user_id, reviewee_user_id)
);
ALTER TABLE public.peer_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users create reviews" ON public.peer_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = reviewer_user_id);
CREATE POLICY "Users view own reviews" ON public.peer_reviews FOR SELECT TO authenticated USING (auth.uid() = reviewer_user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage reviews" ON public.peer_reviews FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Badges
CREATE TABLE public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text DEFAULT 'award',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges viewable" ON public.badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage badges" ON public.badges FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- User badges
CREATE TABLE public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge_id uuid REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User badges viewable" ON public.user_badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage user badges" ON public.user_badges FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
