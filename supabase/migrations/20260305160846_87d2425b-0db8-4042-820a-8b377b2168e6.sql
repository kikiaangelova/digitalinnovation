REVOKE EXECUTE ON FUNCTION public.add_user_xp(uuid, integer) FROM authenticated, anon;
GRANT EXECUTE ON FUNCTION public.add_user_xp(uuid, integer) TO service_role;