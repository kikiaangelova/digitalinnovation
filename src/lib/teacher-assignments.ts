/**
 * Teacher MVP — pure assignment rules (Sprint 1).
 *
 * Kept free of React and Supabase so the rules that guard assignment
 * integrity and progress reporting can be unit-tested directly.
 */

import type { CatalogModule } from '@/hooks/useModuleCatalog';

export const PILOT_SUBJECT_KEY = 'digital-innovation';

export type AssignmentStatus = 'not_started' | 'in_progress' | 'completed';

/** Minimal shape of a `learning_module_responses` row we rely on. */
export interface ModuleResponseLike {
  id: string;
  user_id: string;
  module_id: string;
  completed_at: string | null;
  quiz_score?: number | null;
  quiz_max?: number | null;
  analytical_answer?: string | null;
  application_answer?: string | null;
}

/**
 * A module may only be assigned when it is registered in the database
 * (so progress can be persisted against a real `module_id`), has rich
 * static player content, and belongs to the classroom's subject.
 */
export function isAssignableModule(
  mod: CatalogModule,
  subjectKey: string,
): boolean {
  return (
    mod.registered === true &&
    mod.hasRichContent === true &&
    mod.staticModule != null &&
    !!mod.dbId &&
    mod.subject_key === subjectKey
  );
}

export function filterAssignableModules(
  catalog: readonly CatalogModule[],
  subjectKey: string,
): CatalogModule[] {
  return catalog.filter((m) => isAssignableModule(m, subjectKey));
}

export interface AssignmentDraft {
  assignmentType: 'module';
  moduleSlug: string | null;
}

export interface ValidationResult {
  valid: boolean;
  errorEn?: string;
  errorBg?: string;
}

export function validateAssignmentDraft(
  draft: AssignmentDraft,
  assignableSlugs: readonly string[],
): ValidationResult {
  if (!draft.moduleSlug) {
    return {
      valid: false,
      errorEn: 'Pick a module before assigning. An empty assignment cannot be created.',
      errorBg: 'Избери модул, преди да зададеш задача. Празна задача не може да се създаде.',
    };
  }
  if (!assignableSlugs.includes(draft.moduleSlug)) {
    return {
      valid: false,
      errorEn: 'This module is not playable for this classroom yet, so it cannot be assigned.',
      errorBg: 'Този модул още не е играем за този клас и не може да бъде зададен.',
    };
  }
  return { valid: true };
}

/** Status is derived from persisted evidence only — never from XP. */
export function deriveAssignmentStatus(
  response: Pick<ModuleResponseLike, 'completed_at'> | null | undefined,
): AssignmentStatus {
  if (!response) return 'not_started';
  return response.completed_at ? 'completed' : 'in_progress';
}

export function countCompleted(
  statuses: readonly AssignmentStatus[],
): number {
  return statuses.filter((s) => s === 'completed').length;
}

/** Index responses by `${user_id}:${module_id}` for O(1) lookups. */
export function indexResponses(
  responses: readonly ModuleResponseLike[],
): Map<string, ModuleResponseLike> {
  const m = new Map<string, ModuleResponseLike>();
  for (const r of responses) m.set(`${r.user_id}:${r.module_id}`, r);
  return m;
}

export function responseKey(userId: string, moduleId: string): string {
  return `${userId}:${moduleId}`;
}

export const STATUS_LABELS: Record<AssignmentStatus, { en: string; bg: string }> = {
  not_started: { en: 'Not started', bg: 'Не е започнато' },
  in_progress: { en: 'In progress', bg: 'В процес' },
  completed: { en: 'Completed', bg: 'Завършено' },
};

export const FEEDBACK_TARGET_TYPE = 'learning_module_response';
