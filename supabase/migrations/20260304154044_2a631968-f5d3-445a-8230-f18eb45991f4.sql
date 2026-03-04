
-- Teacher feedback table for comments on student work
CREATE TABLE public.teacher_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  student_id uuid NOT NULL,
  target_type text NOT NULL, -- 'startup_project', 'case_submission', 'simulator'
  target_id text NOT NULL,
  comment text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.teacher_feedback ENABLE ROW LEVEL SECURITY;

-- Only admins can insert/update/delete feedback
CREATE POLICY "Admins manage feedback" ON public.teacher_feedback
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Students can view feedback addressed to them
CREATE POLICY "Students view own feedback" ON public.teacher_feedback
  FOR SELECT TO authenticated
  USING (auth.uid() = student_id OR public.has_role(auth.uid(), 'admin'));

-- Index for fast lookups
CREATE INDEX idx_teacher_feedback_student ON public.teacher_feedback(student_id);
CREATE INDEX idx_teacher_feedback_target ON public.teacher_feedback(target_type, target_id);
