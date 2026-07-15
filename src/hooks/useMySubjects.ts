/**
 * useMySubjects
 * -------------
 * Aggregates the classrooms a student has joined into a subject-first
 * view. One card per unique subject; classrooms studying the same
 * subject are merged so learners see the material once, not repeated.
 *
 * DB reads only. RLS scopes classrooms to memberships (see the
 * "Students can read their joined classroom summary" policy added in
 * the My Subjects V1 migration).
 */

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import {
  DEFAULT_SUBJECT_KEY,
  getSubject,
  type Subject,
} from '@/data/subject-catalog';

export interface JoinedClassroomLite {
  id: string;
  name: string;
  subject_key: string;
}

export interface MySubjectEntry {
  subject: Subject | null;
  subjectKey: string;
  classrooms: JoinedClassroomLite[];
}

export interface UseMySubjectsResult {
  entries: MySubjectEntry[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useMySubjects(): UseMySubjectsResult {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MySubjectEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data: memberships, error: memErr } = await supabase
        .from('classroom_students')
        .select('classroom_id')
        .eq('student_id', user.id);
      if (memErr) throw memErr;

      const ids = (memberships ?? []).map((m) => m.classroom_id);
      if (ids.length === 0) {
        setEntries([]);
        return;
      }

      const { data: rows, error: cErr } = await supabase
        .from('classrooms')
        // subject_key is added by the My Subjects V1 migration; cast
        // via `any` until generated types refresh after approval.
        .select('id, name, is_active, subject_key' as any)
        .in('id', ids)
        .eq('is_active', true);
      if (cErr) throw cErr;

      const grouped = new Map<string, MySubjectEntry>();
      for (const raw of (rows ?? []) as any[]) {
        const key: string = raw.subject_key || DEFAULT_SUBJECT_KEY;
        const existing = grouped.get(key);
        const cls: JoinedClassroomLite = {
          id: raw.id,
          name: raw.name,
          subject_key: key,
        };
        if (existing) {
          existing.classrooms.push(cls);
        } else {
          grouped.set(key, {
            subject: getSubject(key),
            subjectKey: key,
            classrooms: [cls],
          });
        }
      }
      setEntries(Array.from(grouped.values()));
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error('[useMySubjects]', e);
      setError(e?.message ?? 'Failed to load subjects');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  return { entries, loading, error, refresh: fetchAll };
}