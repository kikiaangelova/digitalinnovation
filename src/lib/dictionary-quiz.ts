import type { DictionaryTerm } from '@/data/dictionary-terms';
import { getTermDifficulty } from '@/data/dictionary-terms';

/**
 * Dictionary Quiz option generation (V1).
 *
 * Pure helpers used by `QuickTest` to build 4-option multiple-choice
 * questions. Distractors are chosen from *related* terms first so wrong
 * answers stay educational instead of pulling random long definitions
 * from unrelated areas.
 *
 * Priority for distractor selection:
 *   1. Same `learningAreaId`, different term
 *   2. Same `category`, different term
 *   3. Same difficulty, different term
 *   4. Any other term (fallback, only to reach 3 wrongs)
 *
 * Never uses the current term as a distractor. Option text is
 * display-shortened for readability — the underlying dictionary
 * definitions in `dictionary-terms.ts` are never mutated.
 */

export interface QuizOptionResult {
  options: string[];
  correctIndex: number;
}

const TARGET_MAX = 220;
const TARGET_MIN = 140;

/**
 * Shorten a definition for quiz display without changing its meaning.
 * - Prefers a sentence boundary between ~140 and ~220 chars
 * - Falls back to a word boundary near ~220 chars
 * - Adds an ellipsis only when text was actually shortened
 */
export function shortenForQuiz(text: string, maxLen: number = TARGET_MAX): string {
  const clean = (text ?? '').trim();
  if (clean.length <= maxLen) return clean;

  // Try a sentence boundary in [TARGET_MIN, maxLen]
  const sentenceMatch = clean.slice(0, maxLen + 1).match(/[.!?…](?=\s|$)/g);
  if (sentenceMatch) {
    let idx = -1;
    let running = 0;
    for (const m of sentenceMatch) {
      running = clean.indexOf(m, running) + 1;
      if (running >= TARGET_MIN && running <= maxLen) idx = running;
    }
    if (idx > 0) return clean.slice(0, idx).trim();
  }

  // Word boundary fallback
  const slice = clean.slice(0, maxLen);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > TARGET_MIN ? slice.slice(0, lastSpace) : slice;
  return cut.replace(/[\s,;:—-]+$/, '') + '…';
}

function pickDefinition(term: DictionaryTerm, lang: 'bg' | 'en'): string {
  return lang === 'bg' ? term.definitionBg : term.definition;
}

/**
 * Rank candidate terms by relatedness to `term` (higher = more related).
 * Ties are broken by a caller-provided random shuffle so repeated calls
 * still feel varied.
 */
function relatedness(a: DictionaryTerm, b: DictionaryTerm): number {
  let score = 0;
  if (a.learningAreaId && b.learningAreaId && a.learningAreaId === b.learningAreaId) score += 8;
  if (a.category && b.category && a.category === b.category) score += 4;
  if (getTermDifficulty(a) === getTermDifficulty(b)) score += 2;
  const at = new Set(a.topicTags ?? []);
  const shared = (b.topicTags ?? []).filter(t => at.has(t)).length;
  score += Math.min(shared, 3);
  return score;
}

function shuffle<T>(arr: T[], rand: () => number = Math.random): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Build the 4 quiz options for `term` from `allTerms`, in `lang`.
 * Guarantees:
 *  - Correct definition appears exactly once
 *  - Current term is never used as a distractor
 *  - Options are unique (deduped by shortened display text)
 *  - Returns up to 4 options; fewer only if the corpus is too small
 *  - `correctIndex` points to the correct option after shuffle
 */
export function generateQuizOptions(
  term: DictionaryTerm,
  allTerms: DictionaryTerm[],
  lang: 'bg' | 'en',
  rand: () => number = Math.random,
): QuizOptionResult {
  const correct = shortenForQuiz(pickDefinition(term, lang));

  const candidates = allTerms.filter(t => t.term !== term.term);
  // Rank + light shuffle within same rank tier
  const scored = shuffle(candidates, rand)
    .map(t => ({ t, score: relatedness(term, t) }))
    .sort((a, b) => b.score - a.score);

  const wrongTexts: string[] = [];
  const used = new Set<string>([correct]);
  for (const { t } of scored) {
    if (wrongTexts.length >= 3) break;
    const raw = pickDefinition(t, lang);
    if (!raw) continue;
    const disp = shortenForQuiz(raw);
    if (!disp || used.has(disp)) continue;
    used.add(disp);
    wrongTexts.push(disp);
  }

  const finalCount = Math.min(4, 1 + wrongTexts.length);
  const correctIndex = Math.floor(rand() * finalCount);
  const options = wrongTexts.slice(0, finalCount - 1);
  options.splice(correctIndex, 0, correct);
  return { options, correctIndex };
}
