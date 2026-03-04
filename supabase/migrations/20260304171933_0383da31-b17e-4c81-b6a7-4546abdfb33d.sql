
CREATE TABLE public.ai_feedback_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  feedback_type text NOT NULL,
  input_hash text NOT NULL,
  lang text NOT NULL DEFAULT 'en',
  response jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, feedback_type, input_hash, lang)
);

ALTER TABLE public.ai_feedback_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cache" ON public.ai_feedback_cache
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cache" ON public.ai_feedback_cache
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage cache" ON public.ai_feedback_cache
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Rate limiting table
CREATE TABLE public.ai_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  feedback_type text NOT NULL,
  requested_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rate limits" ON public.ai_rate_limits
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rate limits" ON public.ai_rate_limits
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage rate limits" ON public.ai_rate_limits
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Index for fast lookups
CREATE INDEX idx_ai_cache_lookup ON public.ai_feedback_cache(user_id, feedback_type, input_hash, lang);
CREATE INDEX idx_ai_rate_limits_lookup ON public.ai_rate_limits(user_id, requested_at);
