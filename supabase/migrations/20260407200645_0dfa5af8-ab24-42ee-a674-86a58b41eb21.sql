
-- Challenges table
CREATE TABLE public.challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL DEFAULT 'daily',
  title text NOT NULL DEFAULT '',
  title_bg text,
  scenario text NOT NULL DEFAULT '',
  scenario_bg text,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_reasoning text NOT NULL DEFAULT '',
  correct_reasoning_bg text,
  difficulty text NOT NULL DEFAULT 'medium',
  xp_reward integer NOT NULL DEFAULT 10,
  time_limit_seconds integer,
  active_from timestamp with time zone NOT NULL DEFAULT now(),
  active_until timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Challenges viewable by authenticated"
  ON public.challenges FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins manage challenges"
  ON public.challenges FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Challenge responses table
CREATE TABLE public.challenge_responses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  challenge_id uuid NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  selected_option integer NOT NULL DEFAULT 0,
  ai_feedback text NOT NULL DEFAULT '',
  ai_feedback_bg text,
  xp_earned integer NOT NULL DEFAULT 0,
  time_taken_seconds integer,
  responded_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

ALTER TABLE public.challenge_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own responses"
  ON public.challenge_responses FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users insert own responses"
  ON public.challenge_responses FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage responses"
  ON public.challenge_responses FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Index for quick lookups
CREATE INDEX idx_challenges_type_active ON public.challenges(type, active_from, active_until);
CREATE INDEX idx_challenge_responses_user ON public.challenge_responses(user_id, challenge_id);
