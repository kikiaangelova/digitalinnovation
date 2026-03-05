
-- Learning modules table
CREATE TABLE public.learning_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_en text NOT NULL,
  title_bg text NOT NULL,
  theory_en text NOT NULL DEFAULT '',
  theory_bg text NOT NULL DEFAULT '',
  quiz_questions jsonb NOT NULL DEFAULT '[]',
  analytical_question_en text NOT NULL DEFAULT '',
  analytical_question_bg text NOT NULL DEFAULT '',
  application_question_en text NOT NULL DEFAULT '',
  application_question_bg text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Student responses
CREATE TABLE public.learning_module_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  module_id uuid NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  quiz_answers jsonb NOT NULL DEFAULT '{}',
  quiz_score integer NOT NULL DEFAULT 0,
  quiz_max integer NOT NULL DEFAULT 0,
  analytical_answer text NOT NULL DEFAULT '',
  application_answer text NOT NULL DEFAULT '',
  concept_score integer NOT NULL DEFAULT 0,
  analytical_score integer NOT NULL DEFAULT 0,
  strategic_score integer NOT NULL DEFAULT 0,
  application_score integer NOT NULL DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- RLS
ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_module_responses ENABLE ROW LEVEL SECURITY;

-- Modules: viewable by all authenticated
CREATE POLICY "Modules viewable by authenticated" ON public.learning_modules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage modules" ON public.learning_modules FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Responses
CREATE POLICY "Users insert own responses" ON public.learning_module_responses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own responses" ON public.learning_module_responses FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users view own responses" ON public.learning_module_responses FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage responses" ON public.learning_module_responses FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
