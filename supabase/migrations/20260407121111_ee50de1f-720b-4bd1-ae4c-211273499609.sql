-- Protect total_xp from direct client updates
-- Only the service_role (via edge functions/RPCs) should modify total_xp
CREATE OR REPLACE FUNCTION public.protect_total_xp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Preserve the old total_xp value on every client-side UPDATE
  -- Service-role and SECURITY DEFINER functions bypass RLS but this trigger
  -- runs for all callers. We allow changes only from the recalculate_all_xp
  -- and add_user_xp functions (which run as SECURITY DEFINER with service context).
  -- For regular user updates, force total_xp to remain unchanged.
  IF current_setting('role', true) != 'service_role' 
     AND NOT has_role(auth.uid(), 'admin'::app_role) THEN
    NEW.total_xp := OLD.total_xp;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_total_xp_protection
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_total_xp();