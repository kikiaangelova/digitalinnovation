import { describe, it, expect } from 'vitest';
import {
  ENTREPRENEURSHIP_MODULES,
  PRACTICE_FIRST_MODULES,
} from '@/data/practice-first-content';

/**
 * V1A surfacing guarantees for the /learn/practice/:themeId page.
 * Data-level only — verifies what the page will render, not the DOM.
 */
describe('Practice-first surfacing V1 — Entrepreneurship only', () => {
  const forEntrepreneurship = PRACTICE_FIRST_MODULES.filter(
    (m) => m.themeId === 'entrepreneurship',
  );

  it('exposes exactly the 6 Entrepreneurship modules through PRACTICE_FIRST_MODULES', () => {
    expect(forEntrepreneurship).toHaveLength(6);
    expect(forEntrepreneurship).toEqual(ENTREPRENEURSHIP_MODULES);
  });

  it('preserves the required module order and IDs', () => {
    expect(forEntrepreneurship.map((m) => m.id)).toEqual([
      'entr-01-thinking-and-action',
      'entr-02-curiosity-and-problem-discovery',
      'entr-03-fact-opinion-assumption',
      'entr-04-opportunity-value-business-model',
      'entr-05-mvp-experiments-learning',
      'entr-06-decision-pivot-pitch',
    ]);
  });

  it('keeps every surfaced module at needs_review (nothing educator_approved)', () => {
    for (const m of forEntrepreneurship) {
      expect(m.status).toBe('needs_review');
    }
    expect(
      PRACTICE_FIRST_MODULES.some((m) => m.status === 'educator_approved'),
    ).toBe(false);
  });

  it('every surfaced module has practice tasks and Kiki questions to render', () => {
    for (const m of forEntrepreneurship) {
      expect(m.practiceTasks.length).toBeGreaterThanOrEqual(2);
      expect(m.kikiQuestions.length).toBeGreaterThanOrEqual(4);
      expect(m.reflectionPrompt.en.length).toBeGreaterThan(0);
      expect(m.improvementPrompt.bg.length).toBeGreaterThan(0);
    }
  });

  it('only surfaces approved themes (entrepreneurship, innovation) in this pass', () => {
    const allowed = new Set(['entrepreneurship', 'innovation']);
    for (const m of PRACTICE_FIRST_MODULES) {
      expect(allowed.has(m.themeId)).toBe(true);
    }
  });
});