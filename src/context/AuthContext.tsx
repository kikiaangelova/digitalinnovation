import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'student' | 'teacher_pending' | 'teacher_verified' | 'admin';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: { full_name: string; display_name: string | null; avatar_url: string | null; avatar_style: string } | null;
  isAdmin: boolean;
  userRole: AppRole | null;
  loading: boolean;       // combined: true until BOTH auth and role are resolved
  authLoading: boolean;
  roleLoading: boolean;
  signUp: (email: string, password: string, fullName: string, displayName?: string, meta?: Record<string, string>) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<{ full_name: string; display_name: string | null; avatar_url: string | null; avatar_style: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);

  // Combined loading: true until both auth AND role are resolved
  const loading = authLoading || roleLoading;

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, display_name, avatar_url, avatar_style')
      .eq('user_id', userId)
      .maybeSingle();
    if (data) setProfile({ ...data, avatar_style: data.avatar_style || '' });
  };

  const resolveRole = (data: { role: string }[] | null): AppRole => {
    if (!data || data.length === 0) return 'student';
    const roles = data.map(r => r.role as AppRole);
    const priority: AppRole[] = ['admin', 'teacher_verified', 'teacher_pending', 'student'];
    return priority.find(r => roles.includes(r)) || 'student';
  };

  const fetchRole = async (userId: string) => {
    console.log('[AuthContext] fetchRole START for', userId);
    setRoleLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('[AuthContext] fetchRole error:', error);
      }

      const bestRole = resolveRole(data);
      console.log('[AuthContext] fetchRole DONE — bestRole:', bestRole, 'raw:', data);
      setUserRole(bestRole);
      setIsAdmin(bestRole === 'admin');
    } catch (err) {
      console.error('[AuthContext] fetchRole exception:', err);
      setUserRole('student');
      setIsAdmin(false);
    } finally {
      setRoleLoading(false);
    }
  };

  const handleUserSession = async (currentSession: Session | null) => {
    setSession(currentSession);
    setUser(currentSession?.user ?? null);

    if (currentSession?.user) {
      // Kick off profile fetch (non-blocking for loading)
      fetchProfile(currentSession.user.id);
      // Role fetch IS blocking — roleLoading stays true until done
      await fetchRole(currentSession.user.id);
    } else {
      setProfile(null);
      setIsAdmin(false);
      setUserRole(null);
      setRoleLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    // 1. Restore session on mount
    const initSession = async () => {
      console.log('[AuthContext] initSession START');
      const { data: { session: restoredSession } } = await supabase.auth.getSession();
      if (!mounted) return;
      console.log('[AuthContext] initSession — session user:', restoredSession?.user?.id ?? 'none');
      await handleUserSession(restoredSession);
      if (mounted) {
        setAuthLoading(false);
        console.log('[AuthContext] initSession COMPLETE — authLoading=false, roleLoading=false');
      }
    };

    initSession();

    // 2. Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      console.log('[AuthContext] onAuthStateChange event:', _event, 'user:', newSession?.user?.id ?? 'none');
      await handleUserSession(newSession);
      if (mounted) setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshRole = async () => {
    if (user) await fetchRole(user.id);
  };

  const signUp = async (email: string, password: string, fullName: string, displayName?: string, meta?: Record<string, string>) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          display_name: displayName || fullName,
          ...(meta || {}),
        },
        emailRedirectTo: window.location.origin,
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, isAdmin, userRole, loading, authLoading, roleLoading, signUp, signIn, signOut, refreshRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
