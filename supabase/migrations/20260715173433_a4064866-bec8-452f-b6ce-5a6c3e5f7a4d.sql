
-- 1. Additive columns (nullable; safe re-run)
ALTER TABLE public.classrooms
  ADD COLUMN IF NOT EXISTS subject_key text;

ALTER TABLE public.learning_modules
  ADD COLUMN IF NOT EXISTS subject_key text;

-- 2. Backfill legacy rows to Digital Innovation (current foundation experience)
UPDATE public.classrooms
  SET subject_key = 'digital-innovation'
  WHERE subject_key IS NULL;

UPDATE public.learning_modules
  SET subject_key = 'digital-innovation'
  WHERE subject_key IS NULL;

-- 3. Helpful indexes for subject-scoped queries
CREATE INDEX IF NOT EXISTS classrooms_subject_key_idx
  ON public.classrooms (subject_key);

CREATE INDEX IF NOT EXISTS learning_modules_subject_key_idx
  ON public.learning_modules (subject_key);

-- 4. Allow students to read the classroom summary (name / subject / active)
--    for classrooms they are a member of. This does not expose teacher_id
--    edits, notes, or other classrooms — it is a SELECT policy scoped by
--    membership. Existing teacher/admin policies remain in place.
DROP POLICY IF EXISTS "Students can read their joined classroom summary" ON public.classrooms;
CREATE POLICY "Students can read their joined classroom summary"
  ON public.classrooms
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.classroom_students cs
      WHERE cs.classroom_id = classrooms.id
        AND cs.student_id = auth.uid()
    )
  );
