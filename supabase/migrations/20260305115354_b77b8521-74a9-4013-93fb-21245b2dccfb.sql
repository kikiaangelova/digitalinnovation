-- Central case session state for stable per-user case progress
CREATE TABLE IF NOT EXISTS public.case_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  case_id UUID NOT NULL,
  current_step INTEGER NOT NULL DEFAULT 0,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  completion_status TEXT NOT NULL DEFAULT 'in_progress',
  last_saved TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT case_sessions_user_case_unique UNIQUE (user_id, case_id)
);

CREATE INDEX IF NOT EXISTS idx_case_sessions_user_case ON public.case_sessions (user_id, case_id);
CREATE INDEX IF NOT EXISTS idx_case_sessions_case ON public.case_sessions (case_id);

ALTER TABLE public.case_sessions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'case_sessions' AND policyname = 'Users can view own case sessions'
  ) THEN
    CREATE POLICY "Users can view own case sessions"
      ON public.case_sessions
      FOR SELECT
      USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'case_sessions' AND policyname = 'Users can insert own case sessions'
  ) THEN
    CREATE POLICY "Users can insert own case sessions"
      ON public.case_sessions
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'case_sessions' AND policyname = 'Users can update own case sessions'
  ) THEN
    CREATE POLICY "Users can update own case sessions"
      ON public.case_sessions
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'case_sessions' AND policyname = 'Admins can manage case sessions'
  ) THEN
    CREATE POLICY "Admins can manage case sessions"
      ON public.case_sessions
      FOR ALL
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END
$$;

DROP TRIGGER IF EXISTS set_case_sessions_updated_at ON public.case_sessions;
CREATE TRIGGER set_case_sessions_updated_at
BEFORE UPDATE ON public.case_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Immutable answer version history
CREATE TABLE IF NOT EXISTS public.answer_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  case_id UUID NOT NULL,
  question_id TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  answer_text TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_answer_history_user_case_question ON public.answer_history (user_id, case_id, question_id);
CREATE INDEX IF NOT EXISTS idx_answer_history_case ON public.answer_history (case_id);

ALTER TABLE public.answer_history ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'answer_history' AND policyname = 'Users can view own answer history'
  ) THEN
    CREATE POLICY "Users can view own answer history"
      ON public.answer_history
      FOR SELECT
      USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'answer_history' AND policyname = 'Users can insert own answer history'
  ) THEN
    CREATE POLICY "Users can insert own answer history"
      ON public.answer_history
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'answer_history' AND policyname = 'Admins can manage answer history'
  ) THEN
    CREATE POLICY "Admins can manage answer history"
      ON public.answer_history
      FOR ALL
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION public.set_answer_history_version_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.version_number IS NULL OR NEW.version_number <= 0 THEN
    SELECT COALESCE(MAX(ah.version_number), 0) + 1
    INTO NEW.version_number
    FROM public.answer_history ah
    WHERE ah.user_id = NEW.user_id
      AND ah.case_id = NEW.case_id
      AND ah.question_id = NEW.question_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_answer_history_version_number_trigger ON public.answer_history;
CREATE TRIGGER set_answer_history_version_number_trigger
BEFORE INSERT ON public.answer_history
FOR EACH ROW
EXECUTE FUNCTION public.set_answer_history_version_number();