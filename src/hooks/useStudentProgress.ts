/**
 * useStudentProgress
 * ------------------
 * Fetches the raw per-student activity signals needed by the canonical
 * `computeStudentMetrics` model (see `src/lib/teacherMetrics.ts`) for a
 * set of student ids. Returns a map keyed by student id plus a derived
 * `metricsById` map for convenience.
 *
 * Scope & security
 * ----------------
 * This hook does NOT decide which students the caller may see — pass in
 * an already-scoped list (in this workspace that comes from
 * `useClassroomStudents`, which only returns members of the calling
 * teacher's own classroom). RLS on the underlying tables is the ultimate
 * boundary; the queries here read only the columns needed for progress
 * math (no email, phone, notes, or other PII).
 *
 * Queries fired in parallel:
 *   • submissions            (non-draft count per student)
 *   • simulator_progress     (week, is_complete, grade)
 *   • startup_projects       (7 narrative + 9 BMC fields, submitted flag)
 *   • learning_module_responses (module count)
 *   • quiz_results           (average % + last 3 entries)
 *
 * When `studentIds` is empty the hook resolves instantly with empty maps.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  computeStudentMetrics,
  countFilledSections,
  STARTUP_BMC_KEYS,
  STARTUP_NARRATIVE_KEYS,
  type StudentMetrics,
} from '@/lib/teacherMetrics';

export interface QuizEntry {
  category: string;
  score: number;
  max_score: number;
  created_at: string;
}

export interface StudentProgressRow {
  student_id: string;
  cases_completed: number;
  sim_week: number;
  sim_complete: boolean;
  sim_grade: string | null;
  startup_narrative_filled: number;
  startup_bmc_filled: number;
  startup_submitted: boolean;
  modules_completed: number;
  quiz_avg: number;
  quiz_count: number;
  recent_quizzes: QuizEntry[];
}

export interface UseStudentProgressResult {
  progressById: Record<string, StudentProgressRow>;
  metricsById: Record<string, StudentMetrics>;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

function emptyRow(id: string): StudentProgressRow {
  return {
    student_id: id,
    cases_completed: 0,
    sim_week: 0,
    sim_complete: false,
    sim_grade: null,
    startup_narrative_filled: 0,
    startup_bmc_filled: 0,
    startup_submitted: false,
    modules_completed: 0,
    quiz_avg: 0,
    quiz_count: 0,
    recent_quizzes: [],
  };
}

export function useStudentProgress(
  studentIds: readonly string[],
  opts: {
    /** Extra inputs per student (last activity, xp, cases-assigned flag). */
    lastActivityById?: Record<string, string | Date | null>;
    totalXpById?: Record<string, number>;
    hasAssignedCases?: boolean;
  } = {},
): UseStudentProgressResult {
  const { lastActivityById, totalXpById, hasAssignedCases } = opts;
  const [progressById, setProgressById] = useState<Record<string, StudentProgressRow>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stable dep key so we don't refetch on array-identity changes.
  const idsKey = useMemo(
    () => [...studentIds].sort().join(','),
    [studentIds],
  );

  const fetchAll = useCallback(async () => {
    if (!idsKey) {
      setProgressById({});
      setLoading(false);
      return;
    }
    const ids = idsKey.split(',');
    setLoading(true);
    setError(null);
    try {
      const [subsRes, simRes, projRes, modRes, quizRes] = await Promise.all([
        supabase
          .from('submissions')
          .select('user_id')
          .eq('is_draft', false)
          .in('user_id', ids),
        supabase
          .from('simulator_progress')
          .select('user_id, current_week, is_complete, grade')
          .in('user_id', ids),
        supabase
          .from('startup_projects')
          .select(
            [
              'user_id',
              'is_submitted',
              ...STARTUP_NARRATIVE_KEYS,
              ...STARTUP_BMC_KEYS,
            ].join(', '),
          )
          .in('user_id', ids),
        supabase
          .from('learning_module_responses')
          .select('user_id')
          .in('user_id', ids),
        supabase
          .from('quiz_results')
          .select('user_id, score, max_score, category, created_at')
          .in('user_id', ids)
          .order('created_at', { ascending: false }),
      ]);

      const firstError =
        subsRes.error ?? simRes.error ?? projRes.error ?? modRes.error ?? quizRes.error;
      if (firstError) throw firstError;

      // Build per-student aggregates.
      const subsCount: Record<string, number> = {};
      (subsRes.data ?? []).forEach((r: any) => {
        subsCount[r.user_id] = (subsCount[r.user_id] ?? 0) + 1;
      });

      const simMap = new Map<string, any>();
      (simRes.data ?? []).forEach((r: any) => simMap.set(r.user_id, r));

      const projMap = new Map<string, any>();
      (projRes.data ?? []).forEach((r: any) => projMap.set(r.user_id, r));

      const modCount: Record<string, number> = {};
      (modRes.data ?? []).forEach((r: any) => {
        modCount[r.user_id] = (modCount[r.user_id] ?? 0) + 1;
      });

      const quizAgg: Record<string, { sum: number; count: number; recent: QuizEntry[] }> = {};
      (quizRes.data ?? []).forEach((q: any) => {
        const bucket = (quizAgg[q.user_id] ??= { sum: 0, count: 0, recent: [] });
        const pct = q.max_score > 0 ? (q.score / q.max_score) * 100 : 0;
        bucket.sum += pct;
        bucket.count += 1;
        if (bucket.recent.length < 3) {
          bucket.recent.push({
            category: q.category,
            score: q.score,
            max_score: q.max_score,
            created_at: q.created_at,
          });
        }
      });

      const next: Record<string, StudentProgressRow> = {};
      for (const sid of ids) {
        const proj = projMap.get(sid);
        const sim = simMap.get(sid);
        const q = quizAgg[sid];
        next[sid] = {
          ...emptyRow(sid),
          cases_completed: subsCount[sid] ?? 0,
          sim_week: sim?.current_week ?? 0,
          sim_complete: !!sim?.is_complete,
          sim_grade: sim?.grade ?? null,
          startup_narrative_filled: countFilledSections(proj, STARTUP_NARRATIVE_KEYS),
          startup_bmc_filled: countFilledSections(proj, STARTUP_BMC_KEYS),
          startup_submitted: !!proj?.is_submitted,
          modules_completed: modCount[sid] ?? 0,
          quiz_avg: q ? Math.round(q.sum / q.count) : 0,
          quiz_count: q?.count ?? 0,
          recent_quizzes: q?.recent ?? [],
        };
      }
      setProgressById(next);
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error('[useStudentProgress]', e);
      setError(e?.message ?? 'Failed to load student progress');
      setProgressById({});
    } finally {
      setLoading(false);
    }
  }, [idsKey]);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const metricsById = useMemo<Record<string, StudentMetrics>>(() => {
    const out: Record<string, StudentMetrics> = {};
    for (const [sid, row] of Object.entries(progressById)) {
      out[sid] = computeStudentMetrics({
        casesCompleted: row.cases_completed,
        simWeek: row.sim_week,
        simComplete: row.sim_complete,
        startupNarrativeFilled: row.startup_narrative_filled,
        startupBmcFilled: row.startup_bmc_filled,
        startupSubmitted: row.startup_submitted,
        modulesCompleted: row.modules_completed,
        quizAverage: row.quiz_avg,
        quizCount: row.quiz_count,
        lastActivityAt: lastActivityById?.[sid] ?? null,
        totalXp: totalXpById?.[sid] ?? 0,
        hasAssignedCases,
      });
    }
    return out;
  }, [progressById, lastActivityById, totalXpById, hasAssignedCases]);

  return { progressById, metricsById, loading, error, refresh: fetchAll };
}