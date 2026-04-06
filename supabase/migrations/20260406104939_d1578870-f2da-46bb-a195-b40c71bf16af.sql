-- 1. Remove case_sessions from realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.case_sessions;

-- 2. Add explicit INSERT restriction on user_roles for non-admins
CREATE POLICY "Only admins can insert roles"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));