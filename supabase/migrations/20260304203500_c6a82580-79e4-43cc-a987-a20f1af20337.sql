ALTER TABLE public.startup_projects
  ADD COLUMN IF NOT EXISTS industry_analysis text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS competitor_analysis text NOT NULL DEFAULT '';

ALTER TABLE public.startup_project_versions
  ADD COLUMN IF NOT EXISTS industry_analysis text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS competitor_analysis text NOT NULL DEFAULT '';