/**
 * useModuleResponses — persisted evidence for a set of students and
 * modules. Reads `learning_module_responses`; RLS restricts a verified
 * teacher to students inside their own classrooms, and we additionally
 * pass only the selected classroom's student ids so the scoping intent
 * is explicit in application code.
 */

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ModuleResponseLike } from '@/lib/teacher-assignments';

export function useModuleResponses(
  studentIds: readonly string[],
  moduleIds: readonly string[],
) {
  const [responses, setResponses] = useState<ModuleResponseLike[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const key = `${[...studentIds].sort().join(',')}|${[...moduleIds].sort().join(',')}`;

  const fetchAll = useCallback(async () => {
    const students = key.split('|')[0] ? key.split('|')[0].split(',') : [];
    const modules = key.split('|')[1] ? key.split('|')[1].split(',') : [];
    if (students.length === 0 || modules.length === 0) {
      setResponses([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('learning_module_responses')
        .select('id, user_id, module_id, completed_at, quiz_score, quiz_max, analytical_answer, application_answer')
        .in('user_id', students)
        .in('module_id', modules);
      if (err) throw err;
      setResponses((data ?? []) as ModuleResponseLike[]);
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error('[useModuleResponses]', e);
      setError(e?.message ?? 'Failed to load student evidence');
      setResponses([]);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  return { responses, loading, error, refresh: fetchAll };
}
