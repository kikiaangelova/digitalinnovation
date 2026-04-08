import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'student' | 'teacher_pending' | 'teacher_verified' | 'admin';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: { full_name: string; display_name: string | null; avatar_url: string | null; avatar_style: string } | null;
  isAdmin: boolean;
  userRole: AppRole | null;
  loading: boolean;
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
  const initializedRef = useRef(false);

  const loading = authLoading || roleLoading;

  const fetchProfile = (userId: string) => {
    supabase
      .from('profiles')
      .select('full_name, display_name, avatar_url, avatar_style')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setProfile({ ...data, avatar_style: data.avatar_style || '' });
      });
  };

  const resolveRole = (data: { role: string }[] | null): AppRole => {
    if (!data || data.length === 0) return 'student';
    const roles = data.map(r => r.role as AppRole);
    const priority: AppRole[] = ['admin', 'teacher_verified', 'teacher_pending', 'student'];
    return priority.find(r => roles.includes(r)) || 'student';
  };

  const fetchRole = (userId: string) => {
    setRoleLoading(true);
    supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .then(({ data, error }) => {
        if (error) {
          console.error('[AuthContext] fetchRole error:', error);
        }
        const bestRole = resolveRole(data);
        console.log('[AuthContext] fetchRole done — role:', bestRole);
        setUserRole(bestRole);
        setIsAdmin(bestRole === 'admin');
        setRoleLoading(false);
      });
  };

  useEffect(() => {
    // 1. Listen for auth state changes — fires synchronously for existing sessions
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log('[AuthContext] onAuthStateChange:', _event);
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        // Use setTimeout to avoid blocking the auth callback
        setTimeout(() => {
          fetchProfile(newSession.user.id);
          fetchRole(newSession.user.id);
        }, 0);
      } else {
        setProfile(null);
        setIsAdmin(false);
        setUserRole(null);
        setRoleLoading(false);
      }
    });

    // 2. Restore session on mount
    supabase.auth.getSession().then(({ data: { session: restored } }) => {
      console.log('[AuthContext] getSession restored:', restored?.user?.id ?? 'none');
      if (!initializedRef.current) {
        initializedRef.current = true;
        setSession(restored);
        setUser(restored?.user ?? null);
        if (restored?.user) {
          fetchProfile(restored.user.id);
          fetchRole(restored.user.id);
        } else {
          setRoleLoading(false);
        }
        setAuthLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshRole = async () => {
    if (user) fetchRole(user.id);
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
