
-- Fix 2: Add caller guard to add_user_xp to prevent XP inflation
CREATE OR REPLACE FUNCTION public.add_user_xp(_user_id uuid, _xp integer)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
  new_total integer;
BEGIN
  -- Only allow users to add XP to themselves, or admins to add to anyone
  IF _user_id != auth.uid() AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'permission denied';
  END IF;

  UPDATE public.profiles
  SET total_xp = total_xp + _xp, updated_at = now()
  WHERE user_id = _user_id
  RETURNING total_xp INTO new_total;
  RETURN COALESCE(new_total, 0);
END;
$$;
