import { describe, it, expect } from 'vitest';
import { TERMS } from '@/data/dictionary-terms';
import { filterTerms, matchesLetter } from '@/lib/dictionary-filter';

const base = { search: '', category: 'all', letter: '', area: 'all' as const, review: 'all' as const };

describe('dictionary alphabet filter V1', () => {
  it('selecting K shows only terms whose English term starts with K', () => {
    const out = filterTerms(TERMS, { ...base, letter: 'K' });
    expect(out.length).toBeGreaterThan(0);
    for (const t of out) expect(t.term.charAt(0).toUpperCase()).toBe('K');
  });

  it('selecting A shows only A terms', () => {
    const out = filterTerms(TERMS, { ...base, letter: 'A' });
    expect(out.length).toBeGreaterThan(0);
    for (const t of out) expect(t.term.charAt(0).toUpperCase()).toBe('A');
  });

  it('empty letter (All / Всички) returns all terms', () => {
    const out = filterTerms(TERMS, base);
    expect(out.length).toBe(TERMS.length);
  });

  it('letter + category combine with AND', () => {
    const category = TERMS.find((t) => t.term.toUpperCase().startsWith('K'))!.category;
    const out = filterTerms(TERMS, { ...base, letter: 'K', category });
    expect(out.length).toBeGreaterThan(0);
    for (const t of out) {
      expect(t.term.charAt(0).toUpperCase()).toBe('K');
      expect(t.category).toBe(category);
    }
  });

  it('letter + search combine with AND (no random cross-letter matches)', () => {
    const out = filterTerms(TERMS, { ...base, letter: 'K', search: 'key' });
    expect(out.length).toBeGreaterThan(0);
    for (const t of out) {
      expect(t.term.charAt(0).toUpperCase()).toBe('K');
    }
  });

  it('returns empty array when no term matches selected letter (e.g. rare letter)', () => {
    // Pick a letter with no terms — search all 26 letters for one that yields none.
    const unused = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      .split('')
      .find((l) => !TERMS.some((t) => t.term.toUpperCase().startsWith(l)));
    if (!unused) return; // dataset covers all letters — skip empty-state test
    const out = filterTerms(TERMS, { ...base, letter: unused });
    expect(out).toEqual([]);
  });

  it('matchesLetter is case-insensitive', () => {
    const t = TERMS.find((x) => x.term.toUpperCase().startsWith('K'))!;
    expect(matchesLetter(t, 'k')).toBe(true);
    expect(matchesLetter(t, 'K')).toBe(true);
    expect(matchesLetter(t, '')).toBe(true);
    expect(matchesLetter(t, 'Z')).toBe(false);
  });
});