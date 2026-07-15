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
  assignment_type: string;
  journey_stage: number | null;
  case_id: string | null;
  module_slug: string | null;
  note: string | null;
  due_date: string | null;
  created_at: string;
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
        .select('id, assignment_type, journey_stage, case_id, module_slug, note, due_date, created_at')
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