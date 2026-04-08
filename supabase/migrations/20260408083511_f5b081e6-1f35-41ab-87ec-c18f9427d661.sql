
-- Teacher can read profiles of students in their classroom
CREATE POLICY "Teacher reads own classroom student profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM classroom_students cs
      JOIN classrooms c ON c.id = cs.classroom_id
      WHERE cs.student_id = profiles.user_id
        AND c.teacher_id = auth.uid()
        AND c.is_active = true
    )
  );

-- Teacher can read submissions from their students
CREATE POLICY "Teacher reads own classroom student submissions"
  ON public.submissions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM classroom_students cs
      JOIN classrooms c ON c.id = cs.classroom_id
      WHERE cs.student_id = submissions.user_id
        AND c.teacher_id = auth.uid()
        AND c.is_active = true
    )
  );

-- Teacher can read simulator progress of their students
CREATE POLICY "Teacher reads own classroom student sim progress"
  ON public.simulator_progress FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM classroom_students cs
      JOIN classrooms c ON c.id = cs.classroom_id
      WHERE cs.student_id = simulator_progress.user_id
        AND c.teacher_id = auth.uid()
        AND c.is_active = true
    )
  );

-- Teacher can read startup projects of their students
CREATE POLICY "Teacher reads own classroom student startup projects"
  ON public.startup_projects FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM classroom_students cs
      JOIN classrooms c ON c.id = cs.classroom_id
      WHERE cs.student_id = startup_projects.user_id
        AND c.teacher_id = auth.uid()
        AND c.is_active = true
    )
  );

-- Teacher can read learning module responses of their students
CREATE POLICY "Teacher reads own classroom student module responses"
  ON public.learning_module_responses FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM classroom_students cs
      JOIN classrooms c ON c.id = cs.classroom_id
      WHERE cs.student_id = learning_module_responses.user_id
        AND c.teacher_id = auth.uid()
        AND c.is_active = true
    )
  );
