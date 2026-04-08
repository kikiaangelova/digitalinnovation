CREATE POLICY "Teacher reads own classroom student quiz results"
ON public.quiz_results
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM classroom_students cs
    JOIN classrooms c ON c.id = cs.classroom_id
    WHERE cs.student_id = quiz_results.user_id
      AND c.teacher_id = auth.uid()
      AND c.is_active = true
  )
);