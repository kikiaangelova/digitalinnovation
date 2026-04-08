
DROP POLICY "System can insert role change log" ON public.role_change_log;

CREATE POLICY "Admins can insert role change log"
  ON public.role_change_log FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
