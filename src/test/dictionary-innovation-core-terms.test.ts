/**
 * Dictionary Batch 2A — Innovation core terms.
 *
 * Content-quality checks for the 18 core Innovation terms that back
 * the practice-first Innovation modules.
 */

import { describe, it, expect } from 'vitest';

import { TERMS, type DictionaryTerm } from '@/data/dictionary-terms';

const CORE_TERMS = [
  'Innovation',
  'Idea',
  'Invention',
  'Adoption',
  'Value Creation',
  'Product Innovation',
  'Service Innovation',
  'Process Innovation',
  'Business Model Innovation',
  'Digital Innovation',
  'Continuous Improvement',
  'Implementation',
  'Change Management',
  'Platform',
  'Ecosystem',
  'Network Effects',
  'Baseline',
  'Impact Measurement',
] as const;

function get(name: string): DictionaryTerm {
  const t = TERMS.find((x) => x.term === name);
  if (!t) throw new Error(`missing term: ${name}`);
  return t;
}

function textOf(t: DictionaryTerm): string {
  return `${t.definition}\n${t.definitionBg}`.toLowerCase();
}

describe('dictionary batch 2A — Innovation core terms exist and are governed', () => {
  it.each(CORE_TERMS)('term "%s" exists exactly once', (name) => {
    const matches = TERMS.filter((t) => t.term === name);
    expect(matches).toHaveLength(1);
  });

  it.each(CORE_TERMS)('term "%s" has innovation learning area + needs_review + not_checked', (name) => {
    const t = get(name);
    expect(t.learningAreaId).toBe('innovation');
    expect(t.reviewStatus ?? 'needs_review').toBe('needs_review');
    expect(t.sourceStatus ?? 'not_checked').toBe('not_checked');
  });

  it.each(CORE_TERMS)('term "%s" is NOT educator_approved / educator_checked', (name) => {
    const t = get(name);
    expect(t.reviewStatus ?? 'needs_review').not.toBe('educator_approved');
    expect(t.sourceStatus ?? 'not_checked').not.toBe('educator_checked');
  });
});

describe('dictionary batch 2A — conceptual anchors', () => {
  it('Innovation is not reduced to a mere idea', () => {
    const t = get('Innovation');
    const text = textOf(t);
    // Explicitly rules out the reduction "innovation = idea".
    expect(text).toMatch(/idea alone is not innovation|само по себе си новата идея не е иновация/);
  });

  it('Innovation definition includes implementation / use / adoption / value', () => {
    const text = textOf(get('Innovation'));
    expect(text).toMatch(/implement|used|adopt|value|внедр|използв|прием|стойност/);
  });

  it('Idea definition distinguishes idea from innovation', () => {
    const text = textOf(get('Idea'));
    expect(text).toMatch(/not an innovation|не е иновация/);
  });

  it('Invention definition distinguishes invention from innovation / adoption', () => {
    const text = textOf(get('Invention'));
    expect(text).toMatch(/without becoming an innovation|не се превърне в иновация/);
    expect(text).toMatch(/adopt|used|възприет|използв/);
  });

  it('Adoption definition rules out interest / likes / comments as adoption', () => {
    const text = textOf(get('Adoption'));
    expect(text).toMatch(/likes|comments|interest|харесван|коментар|интерес/);
    expect(text).toMatch(/not adoption|не са приемане/);
  });

  it('Business Model Innovation is not reduced to new revenue only', () => {
    const text = textOf(get('Business Model Innovation'));
    expect(text).toMatch(/not reduced to|не се свежда/);
    expect(text).toMatch(/revenue|приход/);
  });

  it('Network Effects allow both positive and negative effects', () => {
    const text = textOf(get('Network Effects'));
    expect(text).toMatch(/positive/);
    expect(text).toMatch(/negative/);
    expect(text).toMatch(/not automatically good|не са автоматично добри/);
  });

  it('Baseline definition includes a starting-point / before-change framing', () => {
    const text = textOf(get('Baseline'));
    expect(text).toMatch(/starting point|before|изходна точка|преди/);
  });

  it('Impact Measurement includes before/after comparison and rejects vanity metrics', () => {
    const text = textOf(get('Impact Measurement'));
    expect(text).toMatch(/before and after|преди и след/);
    expect(text).toMatch(/vanity|likes|followers|downloads|суетни|харесван|последовател|сваляни/);
  });
});

describe('dictionary batch 2A — no duplicates for these 18 terms', () => {
  it.each(CORE_TERMS)('term "%s" is not duplicated in TERMS', (name) => {
    const count = TERMS.filter((t) => t.term === name).length;
    expect(count).toBe(1);
  });
});

describe('dictionary batch 2A — Entrepreneurship Batch 1 / 1B terms untouched', () => {
  const ENTREP_TERMS = [
    'Entrepreneurship',
    'Business Model',
    'Lean Startup',
    'Minimum Viable Product (MVP)',
    'Product-Market Fit',
    'Pivot',
    'Value Proposition',
    'Experiment',
    'Hypothesis',
  ];

  it.each(ENTREP_TERMS)('entrepreneurship term "%s" still exists and stays entrepreneurship', (name) => {
    const t = TERMS.find((x) => x.term === name);
    expect(t, `missing entrepreneurship term ${name}`).toBeTruthy();
    if (t?.learningAreaId) {
      expect(t.learningAreaId).toBe('entrepreneurship');
    }
  });
});