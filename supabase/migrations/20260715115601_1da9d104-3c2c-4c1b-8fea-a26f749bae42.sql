GRANT SELECT ON public.classroom_assignments TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.classroom_assignments TO authenticated;
GRANT ALL ON public.classroom_assignments TO service_role;