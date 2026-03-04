
ALTER TABLE public.startup_projects
  ADD COLUMN IF NOT EXISTS bmc_customer_segments text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS bmc_value_proposition text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS bmc_channels text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS bmc_customer_relationships text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS bmc_revenue_streams text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS bmc_key_resources text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS bmc_key_activities text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS bmc_key_partners text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS bmc_cost_structure text NOT NULL DEFAULT '';
