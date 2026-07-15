
-- 1) Remove direct student SELECT policies on classrooms.
--    Students must use SECURITY DEFINER RPCs that expose only safe fields.
DROP POLICY IF EXISTS "Students can read their joined classroom summary" ON public.classrooms;
DROP POLICY IF EXISTS "Students read joined classroom" ON public.classrooms;

-- 2) Extend get_my_classroom_summaries to include teacher display name so the
--    profile page never needs to touch classrooms directly.
DROP FUNCTION IF EXISTS public.get_my_classroom_summaries();
CREATE OR REPLACE FUNCTION public.get_my_classroom_summaries()
RETURNS TABLE(id uuid, name text, subject_key text, is_active boolean, teacher_display_name text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT c.id, c.name, c.subject_key, c.is_active,
         COALESCE(p.display_name, p.full_name) AS teacher_display_name
  FROM public.classrooms c
  JOIN public.classroom_students cs ON cs.classroom_id = c.id
  LEFT JOIN public.profiles p ON p.user_id = c.teacher_id
  WHERE cs.student_id = auth.uid()
    AND c.is_active = true;
$function$;

REVOKE ALL ON FUNCTION public.get_my_classroom_summaries() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_classroom_summaries() TO authenticated;

-- 3) Preview-by-code RPC: returns minimal safe fields when the code is valid.
CREATE OR REPLACE FUNCTION public.preview_classroom_by_code(_code text)
RETURNS TABLE(id uuid, name text, subject_key text, teacher_display_name text, already_member boolean)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT c.id, c.name, c.subject_key,
         COALESCE(p.display_name, p.full_name) AS teacher_display_name,
         EXISTS (
           SELECT 1 FROM public.classroom_students cs
           WHERE cs.classroom_id = c.id AND cs.student_id = auth.uid()
         ) AS already_member
  FROM public.classrooms c
  LEFT JOIN public.profiles p ON p.user_id = c.teacher_id
  WHERE c.class_code = upper(_code)
    AND c.is_active = true
  LIMIT 1;
$function$;

REVOKE ALL ON FUNCTION public.preview_classroom_by_code(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.preview_classroom_by_code(text) TO authenticated;

-- 4) Join RPC: validates the code and inserts membership atomically.
CREATE OR REPLACE FUNCTION public.join_classroom_with_code(_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  v_classroom_id uuid;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated' USING ERRCODE = '42501';
  END IF;

  SELECT id INTO v_classroom_id
  FROM public.classrooms
  WHERE class_code = upper(_code)
    AND is_active = true
  LIMIT 1;

  IF v_classroom_id IS NULL THEN
    RAISE EXCEPTION 'invalid or expired code' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.classroom_students (classroom_id, student_id)
  VALUES (v_classroom_id, v_uid)
  ON CONFLICT DO NOTHING;

  RETURN v_classroom_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.join_classroom_with_code(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.join_classroom_with_code(text) TO authenticated;
