
CREATE TABLE public.final_exam_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  case_analysis_answer text NOT NULL DEFAULT '',
  startup_concept_answer text NOT NULL DEFAULT '',
  strategic_decision_answer text NOT NULL DEFAULT '',
  reflection_answer text NOT NULL DEFAULT '',
  case_analysis_score integer NOT NULL DEFAULT 0,
  startup_concept_score integer NOT NULL DEFAULT 0,
  strategic_decision_score integer NOT NULL DEFAULT 0,
  reflection_score integer NOT NULL DEFAULT 0,
  total_score integer NOT NULL DEFAULT 0,
  max_score integer NOT NULL DEFAULT 100,
  ai_feedback jsonb DEFAULT '{}'::jsonb,
  passed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.final_exam_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own exam results" ON public.final_exam_results
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own exam results" ON public.final_exam_results
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exam results" ON public.final_exam_results
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins manage exam results" ON public.final_exam_results
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
