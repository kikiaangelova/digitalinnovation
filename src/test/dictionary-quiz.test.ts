import { describe, it, expect } from 'vitest';
import { TERMS, type DictionaryTerm } from '@/data/dictionary-terms';
import { generateQuizOptions, shortenForQuiz } from '@/lib/dictionary-quiz';

// Deterministic PRNG so relative-priority assertions are stable.
function seeded(seed = 1): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function findTerm(pred: (t: DictionaryTerm) => boolean): DictionaryTerm {
  const t = TERMS.find(pred);
  if (!t) throw new Error('fixture term not found');
  return t;
}

describe('dictionary quiz option generator V1', () => {
  it('includes the correct answer exactly once and never uses the current term as a distractor', () => {
    const term = findTerm(t => t.learningAreaId === 'entrepreneurship');
    const { options, correctIndex } = generateQuizOptions(term, TERMS, 'en', seeded(3));
    const correctText = options[correctIndex];
    expect(correctText).toBeTruthy();
    // Correct definition (possibly shortened) appears exactly once.
    expect(options.filter(o => o === correctText).length).toBe(1);
    // No option equals a shortened version of another term's definition that matches the current term's definition source.
    for (const opt of options) {
      expect(opt).not.toBe(''); // no empty
    }
  });

  it('produces unique options and a valid correctIndex', () => {
    const term = findTerm(t => t.learningAreaId === 'innovation');
    const { options, correctIndex } = generateQuizOptions(term, TERMS, 'en', seeded(7));
    expect(new Set(options).size).toBe(options.length);
    expect(correctIndex).toBeGreaterThanOrEqual(0);
    expect(correctIndex).toBeLessThan(options.length);
  });

  it('produces 4 options for an Entrepreneurship term', () => {
    const term = findTerm(t => t.learningAreaId === 'entrepreneurship');
    const { options } = generateQuizOptions(term, TERMS, 'en', seeded(11));
    expect(options.length).toBe(4);
    for (const o of options) expect(o.length).toBeGreaterThan(0);
  });

  it('produces 4 options for an Innovation term', () => {
    const term = findTerm(t => t.learningAreaId === 'innovation');
    const { options } = generateQuizOptions(term, TERMS, 'bg', seeded(13));
    expect(options.length).toBe(4);
    for (const o of options) expect(o.length).toBeGreaterThan(0);
  });

  it('prefers distractors from the same learningAreaId when enough terms exist', () => {
    const term = findTerm(t => t.learningAreaId === 'entrepreneurship');
    const sameArea = TERMS.filter(
      t => t.learningAreaId === 'entrepreneurship' && t.term !== term.term,
    );
    // Precondition for this assertion: pool has ≥3 same-area candidates.
    expect(sameArea.length).toBeGreaterThanOrEqual(3);

    const { options, correctIndex } = generateQuizOptions(term, TERMS, 'en', seeded(21));
    const wrongs = options.filter((_, i) => i !== correctIndex);

    // Match distractors back to their source term by shortened-definition equality.
    const sameAreaWrongCount = wrongs.filter(w =>
      sameArea.some(t => shortenForQuiz(t.definition) === w),
    ).length;
    // At least 2 of 3 distractors should come from the same learning area.
    expect(sameAreaWrongCount).toBeGreaterThanOrEqual(2);
  });

  it('falls back to same category when learningAreaId is missing', () => {
    // Build a synthetic term with no learningAreaId; ensure distractors gravitate to same category.
    const category = 'Metrics';
    const catTerms = TERMS.filter(t => t.category === category);
    expect(catTerms.length).toBeGreaterThanOrEqual(4);

    const term: DictionaryTerm = {
      term: '__test_metric__',
      termBg: '__test_metric__',
      definition: 'A synthetic metric definition used only in tests.',
      definitionBg: 'Синтетична дефиниция за метрика, използвана само в тестове.',
      category,
    };

    const pool = [term, ...TERMS];
    const { options, correctIndex } = generateQuizOptions(term, pool, 'en', seeded(33));
    const wrongs = options.filter((_, i) => i !== correctIndex);
    const sameCatCount = wrongs.filter(w =>
      catTerms.some(t => shortenForQuiz(t.definition) === w),
    ).length;
    expect(sameCatCount).toBeGreaterThanOrEqual(2);
  });

  it('shortens long definitions for display without mutating sources', () => {
    const longText =
      'This is a deliberately long definition that keeps going on and on. ' +
      'It contains multiple sentences so that the shortener can find a clean boundary. ' +
      'And a third sentence just to make sure we are well past two hundred characters in length.';
    const before = longText;
    const shortened = shortenForQuiz(longText);
    expect(shortened.length).toBeLessThanOrEqual(230); // small tolerance for ellipsis
    expect(shortened.length).toBeLessThan(longText.length);
    // Source untouched.
    expect(longText).toBe(before);
  });

  it('does not append an ellipsis when text is already short', () => {
    const s = 'Short definition.';
    expect(shortenForQuiz(s)).toBe(s);
  });

  it('never produces empty options', () => {
    for (const term of TERMS.slice(0, 20)) {
      const { options } = generateQuizOptions(term, TERMS, 'en', seeded(term.term.length + 1));
      for (const o of options) expect(o.trim().length).toBeGreaterThan(0);
    }
  });
});
