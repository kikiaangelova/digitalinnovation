CREATE OR REPLACE FUNCTION public.generate_class_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code TEXT := '';
  i INT;
BEGIN
  IF auth.uid() IS NULL
     OR NOT (public.has_role(auth.uid(), 'admin'::app_role)
             OR public.has_role(auth.uid(), 'teacher_verified'::app_role)) THEN
    RAISE EXCEPTION 'permission denied: only admins or verified teachers can generate class codes'
      USING ERRCODE = '42501';
  END IF;

  FOR i IN 1..6 LOOP
    code := code || substr(chars, floor(random() * length(chars))::int + 1, 1);
  END LOOP;
  IF EXISTS (SELECT 1 FROM public.classrooms WHERE class_code = code) THEN
    RETURN public.generate_class_code();
  END IF;
  RETURN code;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.generate_class_code() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.generate_class_code() TO authenticated;