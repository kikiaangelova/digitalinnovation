/**
 * useTeacherClassrooms — every active classroom owned by the signed-in
 * teacher. Replaces the previous single-classroom assumption so the
 * workspace can scope everything to one explicitly selected classroom.
 */

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface TeacherClassroom {
  id: string;
  name: string;
  class_code: string;
  invite_link: string | null;
  is_active: boolean;
  created_at: string;
  subject_key: string | null;
}

export function useTeacherClassrooms() {
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState<TeacherClassroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!user) {
      setClassrooms([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('classrooms')
        .select('id, name, class_code, invite_link, is_active, created_at, subject_key')
        .eq('teacher_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: true });
      if (err) throw err;
      setClassrooms((data ?? []) as TeacherClassroom[]);
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error('[useTeacherClassrooms]', e);
      setError(e?.message ?? 'Failed to load classrooms');
      setClassrooms([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  return { classrooms, loading, error, refresh: fetchAll };
}
