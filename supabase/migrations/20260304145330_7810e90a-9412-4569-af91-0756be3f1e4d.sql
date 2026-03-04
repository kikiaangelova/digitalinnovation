CREATE TABLE public.startup_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem text NOT NULL DEFAULT '',
  customer text NOT NULL DEFAULT '',
  value_proposition text NOT NULL DEFAULT '',
  digital_product text NOT NULL DEFAULT '',
  business_model text NOT NULL DEFAULT '',
  growth_strategy text NOT NULL DEFAULT '',
  final_pitch text NOT NULL DEFAULT '',
  is_submitted boolean NOT NULL DEFAULT false,
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.startup_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own project"
ON public.startup_projects FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert own project"
ON public.startup_projects FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own project"
ON public.startup_projects FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins manage all projects"
ON public.startup_projects FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_startup_projects_updated_at
  BEFORE UPDATE ON public.startup_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();