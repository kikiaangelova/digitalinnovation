/**
 * Dictionary Governance V1 — coverage, duplicates, review status
 * and copy-quality tests.
 */

import { describe, it, expect } from 'vitest';

import { LEARNING_AREAS } from '@/data/learning-areas';
import { TERMS, getReviewStatus, getSourceStatus, type DictionaryTerm } from '@/data/dictionary-terms';
import {
  REQUIRED_CONCEPTS,
  getRequiredConceptCoverage,
  findDuplicateRequiredConcepts,
  normalizeTerm,
  isRequiredConcept,
  FORBIDDEN_TONE_PHRASES,
} from '@/data/dictionary-required-concepts';

describe('dictionary governance — required concepts', () => {
  it('has required dictionary concepts for every learning area', () => {
    for (const area of LEARNING_AREAS) {
      const inArea = REQUIRED_CONCEPTS.filter((c) => c.learningAreaId === area.id);
      expect(inArea.length, `area ${area.id} needs required concepts`).toBeGreaterThan(0);
    }
  });

  it('does not duplicate required concepts by English or Bulgarian term within an area', () => {
    const dupes = findDuplicateRequiredConcepts();
    expect(dupes.en).toEqual({});
    expect(dupes.bg).toEqual({});
  });

  it('does not mark any required concept as educator_approved by default', () => {
    for (const c of REQUIRED_CONCEPTS) {
      expect(c.reviewStatus).not.toBe('educator_approved');
      expect(c.sourceStatus).not.toBe('educator_checked');
    }
  });

  it('every learning-area topic maps to at least one dictionary term or required concept', () => {
    const knownEn = new Set<string>([
      ...TERMS.map((t) => normalizeTerm(t.term)),
      ...REQUIRED_CONCEPTS.map((c) => normalizeTerm(c.term_en)),
    ]);
    const knownBg = new Set<string>([
      ...TERMS.map((t) => normalizeTerm(t.termBg)),
      ...REQUIRED_CONCEPTS.map((c) => normalizeTerm(c.term_bg)),
    ]);
    for (const area of LEARNING_AREAS) {
      for (const t of area.topics) {
        const en = normalizeTerm(t.en);
        const bg = normalizeTerm(t.bg);
        const hit =
          [...knownEn].some((k) => k && (k === en || en.includes(k) || k.includes(en))) ||
          [...knownBg].some((k) => k && (k === bg || bg.includes(k) || k.includes(bg)));
        expect(hit, `topic not covered: ${area.id} / ${t.en} — ${t.bg}`).toBe(true);
      }
    }
  });

  it('enriches existing terms instead of forcing duplicates (matched concepts point at real terms)', () => {
    const coverage = getRequiredConceptCoverage();
    // At least a few high-signal concepts must match existing TERMS today.
    const matches = coverage.filter((e) => e.existing).map((e) => e.concept.term_en);
    expect(matches).toEqual(expect.arrayContaining(['Value proposition', 'MVP (Minimum Viable Product)']));
  });
});

describe('dictionary governance — defaults and status', () => {
  it('defaults review status to needs_review when omitted', () => {
    const stub: DictionaryTerm = {
      term: 'x', termBg: 'x', definition: 'x', definitionBg: 'x', category: 'AI',
    };
    expect(getReviewStatus(stub)).toBe('needs_review');
    expect(getSourceStatus(stub)).toBe('not_checked');
  });

  it('marks approved terms only when explicitly set', () => {
    const stub: DictionaryTerm = {
      term: 'x', termBg: 'x', definition: 'x', definitionBg: 'x', category: 'AI',
      reviewStatus: 'educator_approved',
    };
    expect(getReviewStatus(stub)).toBe('educator_approved');
  });
});

describe('dictionary governance — Bulgarian spelling & tone', () => {
  it('contains "критично мислене" and never "критическо мислене"', () => {
    const bg = REQUIRED_CONCEPTS.map((c) => c.term_bg).join(' | ');
    expect(bg).toMatch(/критично мислене/i);
    expect(bg).not.toMatch(/критическо мислене/i);
  });

  it('does not introduce casual/generative phrases in required-concept notes', () => {
    const blob = REQUIRED_CONCEPTS.map((c) => `${c.term_en} ${c.term_bg} ${c.notes ?? ''}`).join(' \n ').toLowerCase();
    for (const phrase of FORBIDDEN_TONE_PHRASES) {
      expect(blob.includes(phrase.toLowerCase()), `forbidden phrase: ${phrase}`).toBe(false);
    }
  });
});

describe('dictionary governance — isRequiredConcept', () => {
  it('recognises canonical existing terms as required concepts', () => {
    const vp = TERMS.find((t) => t.term === 'Value Proposition');
    expect(vp && isRequiredConcept(vp)).toBe(true);
  });
});