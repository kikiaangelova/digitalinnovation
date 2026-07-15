/**
 * useClassroomAssignments
 * -----------------------
 * Reads assignments for a single classroom id. Kept as its own hook so
 * every workspace tab that needs the assignment list (Overview,
 * Assignments, Analytics) shares one cache-friendly source.
 *
 * RLS on `classroom_assignments` limits reads to the classroom's owning
 * teacher; passing a `null` classroom id short-circuits the fetch.
 */

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ClassroomAssignment {
  id: string;
  title: string;
  description: string | null;
  case_study_id: string | null;
  due_date: string | null;
  created_at: string;
  is_active: boolean | null;
}

export interface UseClassroomAssignmentsResult {
  assignments: ClassroomAssignment[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useClassroomAssignments(
  classroomId: string | null | undefined,
): UseClassroomAssignmentsResult {
  const [assignments, setAssignments] = useState<ClassroomAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!classroomId) {
      setAssignments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('classroom_assignments')
        .select('id, title, description, case_study_id, due_date, created_at, is_active')
        .eq('classroom_id', classroomId)
        .order('due_date', { ascending: true, nullsFirst: false });
      if (err) throw err;
      setAssignments((data ?? []) as ClassroomAssignment[]);
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error('[useClassroomAssignments]', e);
      setError(e?.message ?? 'Failed to load assignments');
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }, [classroomId]);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  return { assignments, loading, error, refresh: fetchAll };
}