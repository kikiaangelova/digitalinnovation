
-- Case reflections table for post-case learning reflections
CREATE TABLE public.case_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  case_id uuid NOT NULL REFERENCES public.case_studies(id) ON DELETE CASCADE,
  reflection_text text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, case_id)
);

ALTER TABLE public.case_reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert own reflections" ON public.case_reflections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own reflections" ON public.case_reflections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users view own reflections" ON public.case_reflections
  FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage reflections" ON public.case_reflections
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
