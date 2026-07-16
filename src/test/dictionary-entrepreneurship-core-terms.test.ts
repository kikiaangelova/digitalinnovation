/**
 * Dictionary Batch 1B — Entrepreneurship core terms, source-grounded polish.
 *
 * Content-quality checks for the 9 core Entrepreneurship terms.
 */

import { describe, it, expect } from 'vitest';

import { TERMS, type DictionaryTerm } from '@/data/dictionary-terms';

const CORE_TERMS = [
  'Entrepreneurship',
  'Business Model',
  'Lean Startup',
  'Minimum Viable Product (MVP)',
  'Product-Market Fit',
  'Pivot',
  'Value Proposition',
  'Experiment',
  'Hypothesis',
] as const;

function get(name: string): DictionaryTerm {
  const t = TERMS.find((x) => x.term === name);
  if (!t) throw new Error(`missing term: ${name}`);
  return t;
}

function textOf(t: DictionaryTerm): string {
  return `${t.definition}\n${t.definitionBg}`.toLowerCase();
}

describe('dictionary batch 1B — core Entrepreneurship terms exist and are queued for review', () => {
  it.each(CORE_TERMS)('term "%s" still exists', (name) => {
    expect(TERMS.some((t) => t.term === name)).toBe(true);
  });

  it.each(CORE_TERMS)('term "%s" is NOT educator_approved / educator_checked', (name) => {
    const t = get(name);
    expect(t.reviewStatus ?? 'needs_review').not.toBe('educator_approved');
    expect(t.sourceStatus ?? 'not_checked').not.toBe('educator_checked');
  });

  it.each(CORE_TERMS)('term "%s" carries entrepreneurship metadata', (name) => {
    const t = get(name);
    expect(t.learningAreaId).toBe('entrepreneurship');
    expect(t.required).toBe(true);
    expect(Array.isArray(t.topicTags) && t.topicTags!.length).toBeGreaterThan(0);
  });
});

describe('dictionary batch 1B — concept anchors', () => {
  it('Entrepreneurship is not reduced to starting/running a company', () => {
    const t = get('Entrepreneurship');
    const en = t.definition.toLowerCase();
    const bg = t.definitionBg.toLowerCase();
    // Must not START by reducing to running a business.
    expect(en).not.toMatch(/^the process of creating, launching, and running a new business/);
    expect(bg).not.toMatch(/^процесът на създаване, стартиране и управление на нов бизнес/);
    // Must reference broader capability / uncertainty / value for others.
    expect(en).toMatch(/opportunit|uncertainty|value/);
    expect(bg).toMatch(/възможност|несигурност|стойност/);
  });

  it('Business Model covers value creation + delivery/sustaining, not only revenue', () => {
    const t = get('Business Model');
    const blob = textOf(t);
    expect(blob).toMatch(/create|creates|creating|създава/);
    expect(blob).toMatch(/deliver|delivers|доставя/);
    expect(blob).toMatch(/sustain|sustains|поддържа/);
    // must not be only "how a company makes money"
    expect(t.definition.toLowerCase()).not.toMatch(/^a plan that explains how a company makes money\.?$/);
  });

  it('Lean Startup includes assumptions, experiments, measurement/learning and pivot logic', () => {
    const t = get('Lean Startup');
    const blob = textOf(t);
    expect(blob).toMatch(/assumption|допускан/);
    expect(blob).toMatch(/experiment|експеримент/);
    expect(blob).toMatch(/measur|measurement|learning|учене|данни/);
    expect(blob).toMatch(/pivot|persever|промени/);
  });

  it('MVP is framed as learning/testing an assumption, not a small version of the final product', () => {
    const t = get('Minimum Viable Product (MVP)');
    const blob = textOf(t);
    expect(blob).toMatch(/learn|learning|test|assumption|учи|проверим|допускан/);
    expect(t.definition.toLowerCase()).not.toMatch(/small version of (your|the) product/);
    expect(t.definition.toLowerCase()).not.toMatch(/simplest version of your product/);
    // BG copy may use "умалена версия" only as a negated contrast; ensure it never
    // frames MVP AS a shrunk-down version of the final product.
    expect(t.definitionBg.toLowerCase()).not.toMatch(/^mvp е умалена версия/);
    expect(t.definitionBg.toLowerCase()).not.toMatch(/mvp е (просто|само)?\s*умалена версия/);
  });

  it('Product-Market Fit avoids "perfect match" and includes evidence of repeated value', () => {
    const t = get('Product-Market Fit');
    const en = t.definition.toLowerCase();
    const bg = t.definitionBg.toLowerCase();
    expect(en).not.toMatch(/perfectly matches|perfect match/);
    expect(bg).not.toMatch(/перфектно съвпада|перфектно съответствие/);
    expect(textOf(t)).toMatch(/retention|repeated|adopt|pay|recommend|задържан|повторн|плаща|препоръч/);
  });

  it('Pivot is framed as an evidence-based change in a key element', () => {
    const t = get('Pivot');
    const blob = textOf(t);
    expect(blob).toMatch(/evidence|learned|learning|доказателств|наученото/);
    expect(blob).toMatch(/change|промяна/);
    expect(blob).toMatch(/segment|value proposition|channel|revenue|business model|сегмент|канал|бизнес модел|приходн/);
  });

  it('Value Proposition includes customer segment, problem/need and alternative/differentiation', () => {
    const t = get('Value Proposition');
    const blob = textOf(t);
    expect(blob).toMatch(/customer segment|клиентски сегмент/);
    expect(blob).toMatch(/problem|need|job|проблем|нужд|job-to-be-done/);
    expect(blob).toMatch(/alternative|differenti|алтернатив/);
  });

  it('Experiment includes hypothesis/assumption, method, evidence and decision criteria', () => {
    const t = get('Experiment');
    const blob = textOf(t);
    expect(blob).toMatch(/hypothesis|assumption|хипотез|допускан/);
    expect(blob).toMatch(/method|метод/);
    expect(blob).toMatch(/evidence|data|доказателств|данни/);
    expect(blob).toMatch(/decision|criteria|success|failure|решени|критери|успех|неуспех/);
  });

  it('Hypothesis is defined as testable and connected to evidence', () => {
    const t = get('Hypothesis');
    const blob = textOf(t);
    expect(blob).toMatch(/testable|test|проверим/);
    expect(blob).toMatch(/evidence|support|reject|weaken|доказателств|подкреп|отхвърл|отслаб/);
  });
});

describe('dictionary batch 1B — Innovation terms untouched', () => {
  // Sentinel: Innovation-area terms exist and were not rewritten to
  // Entrepreneurship metadata by this batch.
  const INNOVATION_SENTINELS = ['Innovation Ecosystem', 'E-commerce'];
  it.each(INNOVATION_SENTINELS)('"%s" still categorised under Innovation', (name) => {
    const t = TERMS.find((x) => x.term === name);
    expect(t?.category).toBe('Innovation');
    expect(t?.learningAreaId).not.toBe('entrepreneurship');
  });
});