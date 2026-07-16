import type { DictionaryTerm, ReviewStatus, LearningAreaId } from '@/data/dictionary-terms';
import { getReviewStatus } from '@/data/dictionary-terms';

export interface DictionaryFilterState {
  search: string;
  category: string; // 'all' or category name
  letter: string; // '' or single A-Z uppercase
  area: 'all' | LearningAreaId;
  review: 'all' | ReviewStatus;
}

/**
 * Alphabet filter (V1): compares the FIRST character of the main English term
 * (`term.term`) to the selected letter, case-insensitively.
 *
 * Bulgarian alphabet filtering is intentionally NOT implemented in V1 —
 * A–Z buttons always filter the English term regardless of the UI language.
 */
export function matchesLetter(term: DictionaryTerm, letter: string): boolean {
  if (!letter) return true;
  const first = term.term.trim().charAt(0).toUpperCase();
  return first === letter.toUpperCase();
}

export function matchesSearch(term: DictionaryTerm, search: string): boolean {
  const q = search.trim().toLowerCase();
  if (!q) return true;
  return (
    term.term.toLowerCase().includes(q) ||
    term.termBg.toLowerCase().includes(q) ||
    term.definition.toLowerCase().includes(q) ||
    term.definitionBg.toLowerCase().includes(q)
  );
}

/**
 * Single combined predicate — every active filter must be satisfied.
 * Letter, search and category compose with AND semantics.
 */
export function filterTerms(
  terms: readonly DictionaryTerm[],
  state: DictionaryFilterState,
): DictionaryTerm[] {
  return terms
    .filter((t) => {
      if (state.category !== 'all' && t.category !== state.category) return false;
      if (state.area !== 'all' && t.learningAreaId !== state.area) return false;
      if (state.review !== 'all' && getReviewStatus(t) !== state.review) return false;
      if (!matchesLetter(t, state.letter)) return false;
      if (!matchesSearch(t, state.search)) return false;
      return true;
    })
    .sort((a, b) => a.term.localeCompare(b.term));
}