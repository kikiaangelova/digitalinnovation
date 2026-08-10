/**
 * Pure helpers for the Content MVP feedback + revision loop.
 *
 * These are intentionally free of React, Supabase and i18n context so the
 * behaviour (no second XP, same response row, honest state labels) can be
 * unit-tested deterministically.
 */
import { FEEDBACK_TARGET_TYPE } from '@/lib/teacher-assignments';

/** Completion XP is paid once, on first completion. A revision never pays again. */
export function shouldAwardCompletionXp(isRevision: boolean): boolean {
  return !isRevision;
}

/** Payload that reopens an already-completed response for revision. */
export function buildRevisionReopenPayload(now: Date = new Date()): {
  completed_at: null;
  updated_at: string;
} {
  return { completed_at: null, updated_at: now.toISOString() };
}

/** Filters that scope a revision update to the learner's own single row. */
export function buildRevisionRowFilters(responseId: string, userId: string): {
  id: string;
  user_id: string;
} {
  return { id: responseId, user_id: userId };
}

/** Filters that scope the student's own teacher-feedback lookup. */
export function buildFeedbackQueryFilters(userId: string, responseId: string): {
  student_id: string;
  target_type: string;
  target_id: string;
} {
  return { student_id: userId, target_type: FEEDBACK_TARGET_TYPE, target_id: responseId };
}

/** A resubmission marks the same row completed again — it never inserts. */
export function buildResubmissionCompletion(now: Date = new Date()): {
  completed_at: string;
  updated_at: string;
} {
  const stamp = now.toISOString();
  return { completed_at: stamp, updated_at: stamp };
}

export type RevisionState =
  | 'resubmitted'
  | 'revision_in_progress'
  | 'feedback_received'
  | 'waiting';

export function deriveRevisionState(input: {
  resubmitted: boolean;
  isRevision: boolean;
  isCompleted: boolean;
  hasFeedback: boolean;
}): RevisionState {
  if (input.resubmitted) return 'resubmitted';
  if (input.isRevision && !input.isCompleted) return 'revision_in_progress';
  if (input.hasFeedback) return 'feedback_received';
  return 'waiting';
}

const REVISION_STATE_LABELS: Record<RevisionState, { en: string; bg: string }> = {
  resubmitted: { en: 'Resubmitted after feedback', bg: 'Изпратено отново след обратна връзка' },
  revision_in_progress: { en: 'Revision in progress', bg: 'Подобрение в процес' },
  feedback_received: { en: 'Feedback received', bg: 'Има обратна връзка' },
  waiting: {
    en: 'Submitted · waiting for teacher feedback',
    bg: 'Изпратено · чака обратна връзка от учителя',
  },
};

export function revisionStateLabel(state: RevisionState, lang: 'en' | 'bg'): string {
  return REVISION_STATE_LABELS[state][lang === 'bg' ? 'bg' : 'en'];
}

/** A learner may only revise once real teacher feedback exists on a completed row. */
export function canStartRevision(input: {
  isCompleted: boolean;
  hasFeedback: boolean;
  feedbackError: boolean;
}): boolean {
  return input.isCompleted && input.hasFeedback && !input.feedbackError;
}
