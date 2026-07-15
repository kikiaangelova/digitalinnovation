/**
 * Shared hook: fetches the current teacher's active classroom and the
 * roster of students in it.
 *
 * Security model
 * --------------
 * Row-level security on `classrooms`, `classroom_students` and `profiles`
 * is the real access boundary — see step 1 RLS audit. Even so, this hook
 * *explicitly* filters by the teacher's own classroom in the client
 * query so the security intent is visible in application code (fixes the
 * F-01 hygiene finding). Admins are teachers too for this hook's
 * purposes; if an admin needs a platform-wide roster they use the
 * dedicated `admin-data` edge function, not this hook.
 *
 * The hook returns `null` for `classroom` when the teacher has not yet
 * created one, so callers can render an onboarding empty state instead
 * of an error.
 */

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface ClassroomSummary {
  id: string;
  name: string;
  class_code: string;
  invite_link: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ClassroomStudent {
  membership_id: string;
  student_id: string;
  joined_at: string;
  display_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  total_xp: number;
  updated_at: string;
}

export interface UseClassroomStudentsResult {
  classroom: ClassroomSummary | null;
  students: ClassroomStudent[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useClassroomStudents(): UseClassroomStudentsResult {
  const { user } = useAuth();
  const [classroom, setClassroom] = useState<ClassroomSummary | null>(null);
  const [students, setStudents] = useState<ClassroomStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!user) {
      setClassroom(null);
      setStudents([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data: cls, error: clsErr } = await supabase
        .from('classrooms')
        .select('id, name, class_code, invite_link, is_active, created_at')
        .eq('teacher_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (clsErr) throw clsErr;

      if (!cls) {
        setClassroom(null);
        setStudents([]);
        return;
      }

      setClassroom(cls as ClassroomSummary);

      const { data: memberships, error: memErr } = await supabase
        .from('classroom_students')
        .select('id, student_id, joined_at')
        .eq('classroom_id', cls.id);

      if (memErr) throw memErr;
      if (!memberships || memberships.length === 0) {
        setStudents([]);
        return;
      }

      const studentIds = memberships.map((m) => m.student_id);
      const { data: profiles, error: profErr } = await supabase
        .from('profiles')
        .select('user_id, display_name, full_name, avatar_url, total_xp, updated_at')
        .in('user_id', studentIds);

      if (profErr) throw profErr;

      const profileMap = Object.fromEntries(
        (profiles ?? []).map((p) => [p.user_id, p]),
      );

      setStudents(
        memberships.map((m) => {
          const p = profileMap[m.student_id];
          return {
            membership_id: m.id,
            student_id: m.student_id,
            joined_at: m.joined_at,
            display_name: p?.display_name ?? null,
            full_name: p?.full_name ?? null,
            avatar_url: p?.avatar_url ?? null,
            total_xp: p?.total_xp ?? 0,
            updated_at: p?.updated_at ?? m.joined_at,
          };
        }),
      );
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error('[useClassroomStudents]', e);
      setError(e?.message ?? 'Failed to load classroom');
      setClassroom(null);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  return { classroom, students, loading, error, refresh: fetchAll };
}