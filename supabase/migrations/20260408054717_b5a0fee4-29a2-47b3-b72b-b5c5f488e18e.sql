
-- 1. Role change audit log
CREATE TABLE public.role_change_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_user_id uuid NOT NULL,
  old_role text,
  new_role text,
  changed_by uuid,
  changed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.role_change_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view role change log"
  ON public.role_change_log FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert role change log"
  ON public.role_change_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 2. Trigger: prevent removing last admin & protect fallback admin
CREATE OR REPLACE FUNCTION public.protect_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  fallback_email text := 'kikiaangelova@gmail.com';
  fallback_uid uuid;
  admin_count integer;
BEGIN
  -- Get fallback user id
  SELECT id INTO fallback_uid FROM auth.users WHERE email = fallback_email LIMIT 1;

  -- ON DELETE: prevent deleting admin role if it's the last admin
  IF TG_OP = 'DELETE' THEN
    IF OLD.role = 'admin' THEN
      SELECT COUNT(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';
      IF admin_count <= 1 THEN
        RAISE EXCEPTION 'Cannot remove the last admin from the system';
      END IF;
      -- Protect fallback admin
      IF OLD.user_id = fallback_uid THEN
        RAISE EXCEPTION 'Cannot remove admin role from the fallback admin account';
      END IF;
    END IF;
    -- Log the deletion
    INSERT INTO public.role_change_log (target_user_id, old_role, new_role, changed_by)
    VALUES (OLD.user_id, OLD.role::text, NULL, auth.uid());
    RETURN OLD;
  END IF;

  -- ON UPDATE: prevent downgrading fallback admin or last admin
  IF TG_OP = 'UPDATE' THEN
    IF OLD.role = 'admin' AND NEW.role != 'admin' THEN
      IF OLD.user_id = fallback_uid THEN
        RAISE EXCEPTION 'Cannot downgrade the fallback admin account';
      END IF;
      SELECT COUNT(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';
      IF admin_count <= 1 THEN
        RAISE EXCEPTION 'Cannot downgrade the last admin in the system';
      END IF;
    END IF;
    -- Log the change
    INSERT INTO public.role_change_log (target_user_id, old_role, new_role, changed_by)
    VALUES (OLD.user_id, OLD.role::text, NEW.role::text, auth.uid());
    RETURN NEW;
  END IF;

  -- ON INSERT: log
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.role_change_log (target_user_id, old_role, new_role, changed_by)
    VALUES (NEW.user_id, NULL, NEW.role::text, auth.uid());
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_protect_admin_role
  BEFORE INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.protect_admin_role();
