
-- Add rubric criteria columns to peer_reviews
ALTER TABLE public.peer_reviews 
  ADD COLUMN IF NOT EXISTS clarity_score integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS problem_importance_score integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS innovation_score integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS feasibility_score integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS market_potential_score integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS target_type text NOT NULL DEFAULT 'case_submission',
  ADD COLUMN IF NOT EXISTS target_id text,
  ADD COLUMN IF NOT EXISTS average_score numeric(3,2) GENERATED ALWAYS AS (
    (COALESCE(clarity_score,0) + COALESCE(problem_importance_score,0) + COALESCE(innovation_score,0) + COALESCE(feasibility_score,0) + COALESCE(market_potential_score,0))::numeric / 5.0
  ) STORED,
  ADD COLUMN IF NOT EXISTS teacher_override_score numeric(3,2);

-- Create peer review assignments table
CREATE TABLE IF NOT EXISTS public.peer_review_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_user_id uuid NOT NULL,
  reviewee_user_id uuid NOT NULL,
  target_type text NOT NULL DEFAULT 'case_submission',
  target_id text NOT NULL,
  submission_id uuid REFERENCES public.submissions(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  assigned_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  UNIQUE(reviewer_user_id, target_type, target_id)
);

ALTER TABLE public.peer_review_assignments ENABLE ROW LEVEL SECURITY;

-- RLS: students see own assignments, admins see all
CREATE POLICY "Users view own assignments" ON public.peer_review_assignments
  FOR SELECT TO authenticated
  USING (auth.uid() = reviewer_user_id OR auth.uid() = reviewee_user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage assignments" ON public.peer_review_assignments
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users update own assignments" ON public.peer_review_assignments
  FOR UPDATE TO authenticated
  USING (auth.uid() = reviewer_user_id);
