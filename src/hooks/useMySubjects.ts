/**
 * useMySubjects
 * -------------
 * Aggregates the classrooms a student has joined into a subject-first
 * view. One card per unique subject; classrooms studying the same
 * subject are merged so learners see the material once, not repeated.
 *
 * Reads go through the `get_my_classroom_summaries` RPC (SECURITY
 * DEFINER, EXECUTE granted only to `authenticated`) which returns
 * exactly the four fields the learner UI needs — id, name,
 * subject_key, is_active — so teacher_id / class_code / invite_link
 * are never exposed to joined students. Assignments come from the
 * matching `get_my_classroom_assignments` RPC.
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

export interface AssignedTaskLite {
  id: string;
  classroom_id: string;
  classroom_name: string;
  subject_key: string;
  assignment_type: string;
  module_slug: string | null;
  case_id: string | null;
  journey_stage: number | null;
  note: string | null;
  due_date: string | null;
}

export interface MySubjectEntry {
  subject: Subject | null;
  subjectKey: string;
  classrooms: JoinedClassroomLite[];
  assignments: AssignedTaskLite[];
  nextDueDate: string | null;
}

export interface UseMySubjectsResult {
  entries: MySubjectEntry[];
  allAssignments: AssignedTaskLite[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useMySubjects(): UseMySubjectsResult {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MySubjectEntry[]>([]);
  const [allAssignments, setAllAssignments] = useState<AssignedTaskLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!user) {
      setEntries([]);
      setAllAssignments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [{ data: rows, error: cErr }, { data: aRows, error: aErr }] =
        await Promise.all([
          supabase.rpc('get_my_classroom_summaries' as any),
          supabase.rpc('get_my_classroom_assignments' as any),
        ]);
      if (cErr) throw cErr;
      if (aErr) throw aErr;

      const assignments: AssignedTaskLite[] = ((aRows ?? []) as any[]).map(
        (a) => ({
          id: a.id,
          classroom_id: a.classroom_id,
          classroom_name: a.classroom_name,
          subject_key: a.subject_key || DEFAULT_SUBJECT_KEY,
          assignment_type: a.assignment_type,
          module_slug: a.module_slug ?? null,
          case_id: a.case_id ?? null,
          journey_stage: a.journey_stage ?? null,
          note: a.note ?? null,
          due_date: a.due_date ?? null,
        }),
      );
      setAllAssignments(assignments);

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
          if (!existing.classrooms.some((c) => c.id === cls.id)) {
            existing.classrooms.push(cls);
          }
        } else {
          grouped.set(key, {
            subject: getSubject(key),
            subjectKey: key,
            classrooms: [cls],
            assignments: [],
            nextDueDate: null,
          });
        }
      }

      // Attach assignments matching the entry's classrooms (and subject).
      for (const entry of grouped.values()) {
        const clsIds = new Set(entry.classrooms.map((c) => c.id));
        entry.assignments = assignments.filter((a) => clsIds.has(a.classroom_id));
        const dues = entry.assignments
          .map((a) => a.due_date)
          .filter((d): d is string => !!d)
          .sort();
        entry.nextDueDate = dues[0] ?? null;
      }

      setEntries(Array.from(grouped.values()));
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error('[useMySubjects]', e);
      setError(e?.message ?? 'Failed to load subjects');
      setEntries([]);
      setAllAssignments([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  return { entries, allAssignments, loading, error, refresh: fetchAll };
}