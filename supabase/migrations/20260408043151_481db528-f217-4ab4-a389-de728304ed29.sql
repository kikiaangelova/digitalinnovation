
-- Table for storing consequence data per case choice
CREATE TABLE public.case_consequences (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id         UUID NOT NULL REFERENCES public.case_studies(id) ON DELETE CASCADE,
  choice_key      TEXT NOT NULL,          -- 'A', 'B', 'C'
  choice_label    TEXT NOT NULL DEFAULT '',-- e.g. 'Блиц мащабиране'
  choice_label_bg TEXT,
  month_6_summary JSONB NOT NULL DEFAULT '{}'::jsonb,  -- {cash, users, status, event}
  month_12_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  tradeoff_scores JSONB NOT NULL DEFAULT '{}'::jsonb,  -- {growth:1-5, safety:1-5, moat:1-5, fundability:1-5}
  explanation     TEXT NOT NULL DEFAULT '',
  explanation_bg  TEXT,
  real_world_link TEXT,
  real_world_link_bg TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(case_id, choice_key)
);

-- RLS
ALTER TABLE public.case_consequences ENABLE ROW LEVEL SECURITY;

-- Everyone can read consequences for published cases
CREATE POLICY "Consequences viewable for published cases"
  ON public.case_consequences FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.case_studies cs
      WHERE cs.id = case_consequences.case_id AND cs.published = true
    )
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Admins manage consequences
CREATE POLICY "Admins manage consequences"
  ON public.case_consequences FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Index
CREATE INDEX idx_case_consequences_case ON public.case_consequences(case_id);

-- Add chosen_strategy and reflection columns to case_sessions
ALTER TABLE public.case_sessions
  ADD COLUMN chosen_strategy TEXT,
  ADD COLUMN consequence_reflection TEXT;
