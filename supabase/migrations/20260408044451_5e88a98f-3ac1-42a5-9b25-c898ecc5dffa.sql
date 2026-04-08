
CREATE TABLE public.simulator_experiments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  simulation_id   UUID NOT NULL,
  user_id         UUID NOT NULL,
  experiment_type TEXT NOT NULL CHECK (experiment_type IN ('pricing','audience','landing_page','interviews')),
  cycle           INTEGER NOT NULL DEFAULT 1,
  cost_spent      INTEGER DEFAULT 0,
  result_type     TEXT CHECK (result_type IN ('signal','inconclusive','no_traction')),
  result_detail   JSONB DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sim_experiments_user ON public.simulator_experiments(user_id);
CREATE INDEX idx_sim_experiments_sim ON public.simulator_experiments(simulation_id);

ALTER TABLE public.simulator_experiments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert own experiments"
  ON public.simulator_experiments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own experiments"
  ON public.simulator_experiments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users update own experiments"
  ON public.simulator_experiments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins manage experiments"
  ON public.simulator_experiments FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
