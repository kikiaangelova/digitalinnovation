-- Allow verified teachers to insert their own feedback
CREATE POLICY "Teachers can insert own feedback"
ON public.teacher_feedback
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = teacher_id
  AND has_role(auth.uid(), 'teacher_verified'::app_role)
);

-- Allow verified teachers to update their own feedback
CREATE POLICY "Teachers can update own feedback"
ON public.teacher_feedback
FOR UPDATE
TO authenticated
USING (
  auth.uid() = teacher_id
  AND has_role(auth.uid(), 'teacher_verified'::app_role)
)
WITH CHECK (
  auth.uid() = teacher_id
  AND has_role(auth.uid(), 'teacher_verified'::app_role)
);

-- Allow teachers to read feedback they created
CREATE POLICY "Teachers can view own feedback"
ON public.teacher_feedback
FOR SELECT
TO authenticated
USING (
  auth.uid() = teacher_id
  OR auth.uid() = student_id
  OR has_role(auth.uid(), 'admin'::app_role)
);