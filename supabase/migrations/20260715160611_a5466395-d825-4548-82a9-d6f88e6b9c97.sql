-- Secure RPC to preserve signup role intent through OAuth (Google) signup.
-- Only allows the approved first-signup transition: student -> teacher_pending.
-- Never creates admin or teacher_verified. Never modifies other users.
-- Idempotent: safe to call multiple times; no-op after transition completed.

CREATE OR REPLACE FUNCTION public.apply_signup_role_intent(
  _intent text,
  _institution text DEFAULT NULL,
  _class_name text DEFAULT NULL
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_current_role app_role;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated' USING ERRCODE = '42501';
  END IF;

  -- Whitelist: only 'teacher_pending' intent is applicable via this RPC.
  -- 'student' is a no-op (default assignment already covers it).
  IF _intent IS NULL OR _intent NOT IN ('student', 'teacher_pending') THEN
    RAISE EXCEPTION 'invalid intent' USING ERRCODE = '22023';
  END IF;

  IF _intent = 'student' THEN
    RETURN 'noop';
  END IF;

  -- Guard: never touch users who already have a privileged or pending-teacher role.
  IF EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = v_uid
      AND role IN ('admin'::app_role, 'teacher_verified'::app_role, 'teacher_pending'::app_role)
  ) THEN
    RETURN 'already_privileged';
  END IF;

  -- Only allow the transition when the user currently has ONLY the 'student' role.
  SELECT role INTO v_current_role
  FROM public.user_roles
  WHERE user_id = v_uid
  LIMIT 1;

  IF v_current_role IS DISTINCT FROM 'student'::app_role THEN
    RETURN 'not_eligible';
  END IF;

  -- Apply the transition: replace 'student' with 'teacher_pending'.
  DELETE FROM public.user_roles WHERE user_id = v_uid AND role = 'student'::app_role;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_uid, 'teacher_pending'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Preserve teacher application data on the profile (only if not already set).
  UPDATE public.profiles
  SET
    institution = COALESCE(NULLIF(trim(_institution), ''), institution),
    class_name  = COALESCE(NULLIF(trim(_class_name),  ''), class_name),
    applied_at  = COALESCE(applied_at, now()),
    updated_at  = now()
  WHERE user_id = v_uid;

  RETURN 'applied';
END;
$$;

REVOKE EXECUTE ON FUNCTION public.apply_signup_role_intent(text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.apply_signup_role_intent(text, text, text) TO authenticated;