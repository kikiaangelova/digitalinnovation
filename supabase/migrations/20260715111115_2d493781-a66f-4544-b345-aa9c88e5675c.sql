-- Harden teacher_feedback INSERT and UPDATE policies to require that the target student
-- belongs to one of the teacher's own active classrooms. Existing valid workflows continue
-- to work; admins remain unaffected via the separate "Admins manage feedback" policy.

DROP POLICY IF EXISTS "Teachers can insert own feedback" ON public.teacher_feedback;
DROP POLICY IF EXISTS "Teachers can update own feedback" ON public.teacher_feedback;

CREATE POLICY "Teachers insert feedback for own classroom students"
ON public.teacher_feedback
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = teacher_id
  AND public.has_role(auth.uid(), 'teacher_verified'::app_role)
  AND EXISTS (
    SELECT 1
    FROM public.classroom_students cs
    JOIN public.classrooms c ON c.id = cs.classroom_id
    WHERE cs.student_id = teacher_feedback.student_id
      AND c.teacher_id = auth.uid()
      AND c.is_active = true
  )
);

CREATE POLICY "Teachers update feedback for own classroom students"
ON public.teacher_feedback
FOR UPDATE
TO authenticated
USING (
  auth.uid() = teacher_id
  AND public.has_role(auth.uid(), 'teacher_verified'::app_role)
  AND EXISTS (
    SELECT 1
    FROM public.classroom_students cs
    JOIN public.classrooms c ON c.id = cs.classroom_id
    WHERE cs.student_id = teacher_feedback.student_id
      AND c.teacher_id = auth.uid()
      AND c.is_active = true
  )
)
WITH CHECK (
  auth.uid() = teacher_id
  AND public.has_role(auth.uid(), 'teacher_verified'::app_role)
  AND EXISTS (
    SELECT 1
    FROM public.classroom_students cs
    JOIN public.classrooms c ON c.id = cs.classroom_id
    WHERE cs.student_id = teacher_feedback.student_id
      AND c.teacher_id = auth.uid()
      AND c.is_active = true
  )
);