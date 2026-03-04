import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

/** Redirects authenticated users to /profile if their profile is incomplete */
export default function ProfileGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [checked, setChecked] = useState(false);

  const EXEMPT_PREFIXES = ['/profile', '/auth', '/dictionary', '/about', '/cases', '/case/', '/simulator', '/industries', '/startup-simulator', '/my-startup', '/my-report', '/assessment', '/team/', '/admin'];

  useEffect(() => {
    if (loading || !user) { setChecked(true); return; }
    const isExempt = location.pathname === '/' || EXEMPT_PREFIXES.some(p => location.pathname.startsWith(p));
    if (isExempt) { setChecked(true); return; }

    const check = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, bio, skills_tags')
        .eq('user_id', user.id)
        .single();

      const isComplete = data?.full_name && data.full_name !== user.email &&
        ((data as any).skills_tags?.length > 0 || (data as any).bio);

      if (!isComplete) {
        navigate('/profile', { replace: true, state: { onboarding: true } });
      }
      setChecked(true);
    };
    check();
  }, [user, loading, location.pathname]);

  if (!checked) return null;
  return <>{children}</>;
}
