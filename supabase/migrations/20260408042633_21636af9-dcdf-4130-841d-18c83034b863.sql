
-- Table: classrooms
CREATE TABLE public.classrooms (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id    UUID NOT NULL,
  name          TEXT NOT NULL,
  class_code    TEXT NOT NULL UNIQUE,
  invite_link   TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_classrooms_teacher_id ON public.classrooms(teacher_id);
CREATE INDEX idx_classrooms_code ON public.classrooms(class_code);

-- Table: classroom_students
CREATE TABLE public.classroom_students (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id  UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  student_id    UUID NOT NULL,
  joined_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(classroom_id, student_id)
);

CREATE INDEX idx_cs_classroom ON public.classroom_students(classroom_id);
CREATE INDEX idx_cs_student   ON public.classroom_students(student_id);

-- Table: classroom_assignments
CREATE TABLE public.classroom_assignments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id    UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  assigned_by     UUID NOT NULL,
  assignment_type TEXT NOT NULL CHECK (
                    assignment_type IN ('journey_stage', 'case_study', 'learn_module')
                  ),
  journey_stage   INTEGER CHECK (journey_stage BETWEEN 1 AND 6),
  case_id         UUID,
  module_slug     TEXT,
  due_date        TIMESTAMPTZ,
  note            TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assignments_classroom ON public.classroom_assignments(classroom_id);

-- RLS
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_assignments ENABLE ROW LEVEL SECURITY;

-- Admins manage all
CREATE POLICY "Admins manage classrooms" ON public.classrooms FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage classroom_students" ON public.classroom_students FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage classroom_assignments" ON public.classroom_assignments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Teacher manages own classrooms
CREATE POLICY "Teacher manages own classrooms" ON public.classrooms FOR ALL TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

-- Students read classrooms they belong to
CREATE POLICY "Students read joined classroom" ON public.classrooms FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.classroom_students
    WHERE classroom_id = classrooms.id AND student_id = auth.uid()
  ));

-- Teacher reads own classroom students
CREATE POLICY "Teacher reads own classroom students" ON public.classroom_students FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.classrooms
    WHERE id = classroom_students.classroom_id AND teacher_id = auth.uid()
  ));

-- Teacher can delete students from classroom
CREATE POLICY "Teacher removes classroom students" ON public.classroom_students FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.classrooms
    WHERE id = classroom_students.classroom_id AND teacher_id = auth.uid()
  ));

-- Student reads own membership
CREATE POLICY "Student reads own membership" ON public.classroom_students FOR SELECT TO authenticated
  USING (student_id = auth.uid());

-- Student can join classroom
CREATE POLICY "Student can join classroom" ON public.classroom_students FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

-- Student can leave classroom
CREATE POLICY "Student can leave classroom" ON public.classroom_students FOR DELETE TO authenticated
  USING (student_id = auth.uid());

-- Teacher manages assignments
CREATE POLICY "Teacher manages assignments" ON public.classroom_assignments FOR ALL TO authenticated
  USING (assigned_by = auth.uid())
  WITH CHECK (assigned_by = auth.uid());

-- Students read assignments for their classroom
CREATE POLICY "Students read classroom assignments" ON public.classroom_assignments FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.classroom_students
    WHERE classroom_id = classroom_assignments.classroom_id
      AND student_id = auth.uid()
  ));

-- Class code generator
CREATE OR REPLACE FUNCTION public.generate_class_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code TEXT := '';
  i INT;
BEGIN
  FOR i IN 1..6 LOOP
    code := code || substr(chars, floor(random() * length(chars))::int + 1, 1);
  END LOOP;
  IF EXISTS (SELECT 1 FROM public.classrooms WHERE class_code = code) THEN
    RETURN public.generate_class_code();
  END IF;
  RETURN code;
END;
$$;

-- Updated_at trigger for classrooms
CREATE TRIGGER update_classrooms_updated_at
  BEFORE UPDATE ON public.classrooms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
