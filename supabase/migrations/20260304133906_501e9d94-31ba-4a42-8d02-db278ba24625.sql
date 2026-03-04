
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

-- Create difficulty enum
CREATE TYPE public.case_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');

-- Create question type enum
CREATE TYPE public.question_type AS ENUM ('multiple_choice', 'ranking', 'numeric_allocation', 'short_answer', 'long_answer');

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Cohorts
CREATE TABLE public.cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cohorts viewable by authenticated" ON public.cohorts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage cohorts" ON public.cohorts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Cohort members
CREATE TABLE public.cohort_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID REFERENCES public.cohorts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (cohort_id, user_id)
);
ALTER TABLE public.cohort_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own memberships" ON public.cohort_members FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage memberships" ON public.cohort_members FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Case Studies
CREATE TABLE public.case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  topic TEXT,
  difficulty case_difficulty NOT NULL DEFAULT 'intermediate',
  est_minutes INTEGER DEFAULT 60,
  outcomes TEXT[],
  published BOOLEAN NOT NULL DEFAULT false,
  reading_title TEXT,
  reading_url TEXT,
  reading_button_label TEXT DEFAULT 'Open Required Reading',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published cases viewable by authenticated" ON public.case_studies FOR SELECT TO authenticated USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage cases" ON public.case_studies FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON public.case_studies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Case Steps
CREATE TABLE public.case_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_study_id UUID REFERENCES public.case_studies(id) ON DELETE CASCADE NOT NULL,
  step_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  narrative TEXT,
  exhibit_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.case_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Steps viewable by authenticated" ON public.case_steps FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage steps" ON public.case_steps FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Questions
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_step_id UUID REFERENCES public.case_steps(id) ON DELETE CASCADE NOT NULL,
  question_order INTEGER NOT NULL,
  type question_type NOT NULL,
  prompt TEXT NOT NULL,
  options JSONB,
  points INTEGER NOT NULL DEFAULT 5,
  rubric TEXT,
  correct_answer TEXT,
  model_answer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions viewable by authenticated" ON public.questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage questions" ON public.questions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Case assignments
CREATE TABLE public.case_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_study_id UUID REFERENCES public.case_studies(id) ON DELETE CASCADE NOT NULL,
  cohort_id UUID REFERENCES public.cohorts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  due_date TIMESTAMPTZ
);
ALTER TABLE public.case_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own assignments" ON public.case_assignments FOR SELECT TO authenticated USING (
  auth.uid() = user_id 
  OR EXISTS (SELECT 1 FROM public.cohort_members cm WHERE cm.cohort_id = case_assignments.cohort_id AND cm.user_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Admins can manage assignments" ON public.case_assignments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Submissions
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_study_id UUID REFERENCES public.case_studies(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_draft BOOLEAN NOT NULL DEFAULT true,
  total_score INTEGER,
  max_score INTEGER,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (case_study_id, user_id)
);
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own submissions" ON public.submissions FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own submissions" ON public.submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own drafts" ON public.submissions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage submissions" ON public.submissions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Responses
CREATE TABLE public.responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  answer JSONB,
  score INTEGER,
  feedback TEXT,
  auto_graded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (submission_id, question_id)
);
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own responses" ON public.responses FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = responses.submission_id AND (s.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Users can create own responses" ON public.responses FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = responses.submission_id AND s.user_id = auth.uid())
);
CREATE POLICY "Users can update own responses" ON public.responses FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = responses.submission_id AND s.user_id = auth.uid())
);
CREATE POLICY "Admins can manage responses" ON public.responses FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_responses_updated_at BEFORE UPDATE ON public.responses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_case_steps_case ON public.case_steps(case_study_id, step_order);
CREATE INDEX idx_questions_step ON public.questions(case_step_id, question_order);
CREATE INDEX idx_submissions_user ON public.submissions(user_id);
CREATE INDEX idx_submissions_case ON public.submissions(case_study_id);
CREATE INDEX idx_responses_submission ON public.responses(submission_id);
CREATE INDEX idx_case_assignments_user ON public.case_assignments(user_id);
CREATE INDEX idx_case_assignments_cohort ON public.case_assignments(cohort_id);
