
-- Create hypotheses table
CREATE TABLE public.hypotheses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL,
  context_type    TEXT NOT NULL CHECK (context_type IN ('simulator','case','startup')),
  context_id      TEXT NOT NULL,
  hypothesis_text TEXT NOT NULL,
  was_validated   BOOLEAN,
  validation_note TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hypotheses_user ON public.hypotheses(user_id);
CREATE INDEX idx_hypotheses_context ON public.hypotheses(context_type, context_id);

ALTER TABLE public.hypotheses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert own hypotheses"
  ON public.hypotheses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own hypotheses"
  ON public.hypotheses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users update own hypotheses"
  ON public.hypotheses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins manage hypotheses"
  ON public.hypotheses FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add hypothesis counters to profiles
ALTER TABLE public.profiles
  ADD COLUMN hypotheses_validated INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN hypotheses_failed INTEGER NOT NULL DEFAULT 0;
