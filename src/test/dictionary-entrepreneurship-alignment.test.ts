/**
 * Dictionary Batch 1 — Entrepreneurship Alignment V1
 */

import { describe, it, expect } from 'vitest';

import { TERMS } from '@/data/dictionary-terms';
import {
  REQUIRED_CONCEPTS,
  findDuplicateEnglishTerms,
  findDuplicateBulgarianTerms,
  normalizeTerm,
  findExistingTerm,
} from '@/data/dictionary-required-concepts';
import { ENTREPRENEURSHIP_MODULES } from '@/data/practice-first-content';

// Explicit alias map for known plural / long-form variants used in
// practice-first content but stored canonically in TERMS.
const CONCEPT_ALIASES: Record<string, string> = {
  Assumptions: 'Assumption',
  'MVP (Minimum Viable Product)': 'Minimum Viable Product (MVP)',
  'Customer segments': 'Customer Segments',
  'Product-market fit': 'Product-Market Fit',
  'Go-to-market': 'Go-to-Market Strategy',
};

function resolveConcept(name: string): { term: string; found: boolean } {
  const resolved = CONCEPT_ALIASES[name] ?? name;
  const norm = normalizeTerm(resolved);
  const foundInTerms = TERMS.some(
    (t) => normalizeTerm(t.term) === norm || normalizeTerm(t.termBg) === norm,
  );
  if (foundInTerms) return { term: resolved, found: true };
  const concept = REQUIRED_CONCEPTS.find(
    (c) => normalizeTerm(c.term_en) === norm || normalizeTerm(c.term_bg) === norm,
  );
  if (concept && findExistingTerm(concept)) return { term: resolved, found: true };
  return { term: resolved, found: false };
}

const NEW_ENTREPRENEURSHIP_TERMS = [
  'Entrepreneurial Mindset',
  'Problem Discovery',
  'Customer Interview',
  'Root Cause',
  'Assumption',
  'Evidence',
  'Information Search',
  'Opportunity Recognition',
  'Learning Loop',
  'Persevere',
  'Decision',
  'Pitch',
];

const REMOVED_DUPLICATES = [
  { term: 'Lean Experimentation', category: 'Experimentation' },
  { term: 'Marketplace Model', category: 'Platform' },
];

describe('dictionary batch 1 — practice-first concept resolution', () => {
  it('every Entrepreneurship module dictionaryConcept resolves to a TERM', () => {
    const unresolved: string[] = [];
    for (const mod of ENTREPRENEURSHIP_MODULES) {
      for (const concept of mod.dictionaryConcepts) {
        if (!resolveConcept(concept).found) unresolved.push(`${mod.id}: ${concept}`);
      }
    }
    expect(unresolved).toEqual([]);
  });

  it('MVP long/short form resolves via alias to Minimum Viable Product (MVP)', () => {
    const r = resolveConcept('MVP (Minimum Viable Product)');
    expect(r.found).toBe(true);
    expect(TERMS.some((t) => t.term === 'Minimum Viable Product (MVP)')).toBe(true);
  });
});

describe('dictionary batch 1 — 12 aligned Entrepreneurship concepts exist', () => {
  it.each(NEW_ENTREPRENEURSHIP_TERMS)(
    'TERMS contains "%s" tagged for entrepreneurship, required, needs_review',
    (name) => {
      const t = TERMS.find((x) => x.term === name);
      expect(t, `missing term: ${name}`).toBeDefined();
      if (!t) return;
      expect(t.learningAreaId).toBe('entrepreneurship');
      expect(t.required).toBe(true);
      expect(t.reviewStatus ?? 'needs_review').toBe('needs_review');
      expect(t.sourceStatus ?? 'not_checked').toBe('not_checked');
      expect(t.definition.length).toBeGreaterThan(40);
      expect(t.definitionBg.length).toBeGreaterThan(40);
    },
  );
});

describe('dictionary batch 1 — duplicates removed', () => {
  it('has no hard English duplicates across TERMS', () => {
    expect(findDuplicateEnglishTerms()).toEqual({});
  });

  it('has no hard Bulgarian duplicates across TERMS', () => {
    expect(findDuplicateBulgarianTerms()).toEqual({});
  });

  it.each(REMOVED_DUPLICATES)(
    'removed merged legacy entry "$term" ($category)',
    ({ term, category }) => {
      const match = TERMS.find((t) => t.term === term && t.category === category);
      expect(match, `legacy entry "${term}" (${category}) must be removed / merged`).toBeUndefined();
    },
  );

  it('keeps a single canonical entry for each merged concept', () => {
    for (const name of [
      'Revenue Streams',
      'Content Marketing',
      'Supply Chain',
      'Scalability',
      'Unit Economics',
      'Marketplace',
    ]) {
      const matches = TERMS.filter((t) => t.term === name);
      expect(matches.length, `expected exactly one canonical "${name}"`).toBe(1);
    }
  });
});

describe('dictionary batch 1 — required-concepts registry alignment', () => {
  it.each(NEW_ENTREPRENEURSHIP_TERMS)(
    'registers "%s" as an Entrepreneurship required concept (directly or via alias)',
    (name) => {
      const alias = Object.entries(CONCEPT_ALIASES).find(([, v]) => v === name)?.[0];
      const candidates = [name, alias].filter(Boolean) as string[];
      const norms = candidates.map((n) => normalizeTerm(n));
      const hit = REQUIRED_CONCEPTS.some(
        (c) =>
          c.learningAreaId === 'entrepreneurship' && norms.includes(normalizeTerm(c.term_en)),
      );
      expect(hit, `no required-concept entry for entrepreneurship term "${name}"`).toBe(true);
    },
  );
});
