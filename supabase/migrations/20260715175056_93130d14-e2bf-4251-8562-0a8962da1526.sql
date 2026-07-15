
-- Safe classroom summary read for students (My Subjects V1 hardening).
-- Returns ONLY the columns the learner UI needs, hiding teacher_id,
-- class_code, invite_link and timestamps from joined students.
CREATE OR REPLACE FUNCTION public.get_my_classroom_summaries()
RETURNS TABLE(id uuid, name text, subject_key text, is_active boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.id, c.name, c.subject_key, c.is_active
  FROM public.classrooms c
  JOIN public.classroom_students cs
    ON cs.classroom_id = c.id
  WHERE cs.student_id = auth.uid()
    AND c.is_active = true;
$$;

REVOKE ALL ON FUNCTION public.get_my_classroom_summaries() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_classroom_summaries() TO authenticated;

-- Safe classroom-scoped assignments read: returns only the fields the
-- learner UI needs (never assigned_by / classroom teacher metadata).
CREATE OR REPLACE FUNCTION public.get_my_classroom_assignments()
RETURNS TABLE(
  id uuid,
  classroom_id uuid,
  classroom_name text,
  subject_key text,
  assignment_type text,
  module_slug text,
  case_id uuid,
  journey_stage integer,
  note text,
  due_date timestamptz,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.id, c.id AS classroom_id, c.name AS classroom_name,
         c.subject_key, a.assignment_type, a.module_slug, a.case_id,
         a.journey_stage, a.note, a.due_date, a.created_at
  FROM public.classroom_assignments a
  JOIN public.classrooms c ON c.id = a.classroom_id
  JOIN public.classroom_students cs
    ON cs.classroom_id = c.id AND cs.student_id = auth.uid()
  WHERE c.is_active = true;
$$;

REVOKE ALL ON FUNCTION public.get_my_classroom_assignments() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_classroom_assignments() TO authenticated;
