
-- XP Ledger table for tracking all XP awards with deduplication
CREATE TABLE public.xp_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action text NOT NULL,
  xp integer NOT NULL DEFAULT 0,
  context_id text,
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Index for deduplication checks
CREATE INDEX idx_xp_ledger_user_action_context ON public.xp_ledger (user_id, action, context_id);
-- Index for daily cap checks
CREATE INDEX idx_xp_ledger_user_action_date ON public.xp_ledger (user_id, action, created_at);

ALTER TABLE public.xp_ledger ENABLE ROW LEVEL SECURITY;

-- Users can view their own XP history
CREATE POLICY "Users view own xp_ledger"
  ON public.xp_ledger FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Only service_role can insert (via edge function)
-- No INSERT policy for authenticated means only service_role can insert
CREATE POLICY "Admins manage xp_ledger"
  ON public.xp_ledger FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Update config.toml
-- Add award-xp function config
