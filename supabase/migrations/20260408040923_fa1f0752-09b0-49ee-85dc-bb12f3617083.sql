
-- Add new role values to the enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'teacher_pending';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'teacher_verified';

-- Add teacher metadata columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS institution TEXT,
  ADD COLUMN IF NOT EXISTS applied_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by UUID;

-- Update handle_new_user to support teacher signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  user_count integer;
  assigned_role app_role;
  v_display_name text;
  v_full_name text;
  v_signup_role text;
  v_institution text;
  v_class_name text;
BEGIN
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email);
  v_display_name := COALESCE(
    NULLIF(trim(NEW.raw_user_meta_data->>'display_name'), ''),
    UPPER(LEFT(split_part(trim(v_full_name), ' ', 1), 1)) ||
    UPPER(LEFT(COALESCE(NULLIF(split_part(trim(v_full_name), ' ', 2), ''), split_part(trim(v_full_name), ' ', 1)), 1)) ||
    '_' || LPAD((floor(random() * 900 + 100))::text, 3, '0')
  );

  v_signup_role := COALESCE(NEW.raw_user_meta_data->>'signup_role', 'student');
  v_institution := NEW.raw_user_meta_data->>'institution';
  v_class_name := NEW.raw_user_meta_data->>'class_name';

  INSERT INTO public.profiles (user_id, full_name, display_name, institution, class_name, school_name, applied_at)
  VALUES (
    NEW.id,
    v_full_name,
    v_display_name,
    CASE WHEN v_signup_role = 'teacher_pending' THEN v_institution ELSE NULL END,
    CASE WHEN v_signup_role = 'teacher_pending' THEN v_class_name ELSE COALESCE(NEW.raw_user_meta_data->>'class_name', NULL) END,
    CASE WHEN v_signup_role = 'student' THEN COALESCE(NEW.raw_user_meta_data->>'school_name', NULL) ELSE NULL END,
    CASE WHEN v_signup_role = 'teacher_pending' THEN now() ELSE NULL END
  );

  SELECT COUNT(*) INTO user_count FROM public.user_roles;
  IF user_count = 0 THEN
    assigned_role := 'admin';
  ELSIF v_signup_role = 'teacher_pending' THEN
    assigned_role := 'teacher_pending';
  ELSE
    assigned_role := 'student';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$function$;

-- Ensure users can read their own role (policy may already exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Users can view own roles'
  ) THEN
    CREATE POLICY "Users can view own roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;
END $$;
