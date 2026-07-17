import { describe, it, expect } from 'vitest';
import {
  MARKETING_MODULES,
  PRACTICE_FIRST_MODULES,
} from '@/data/practice-first-content';

describe('Practice-first content seed V1A — Digital Marketing (Modules 1-2)', () => {
  it('exposes exactly the first 2 Marketing modules in order', () => {
    expect(MARKETING_MODULES).toHaveLength(2);
    expect(MARKETING_MODULES.map((m) => m.id)).toEqual([
      'mkt-01-brand-foundations-2026',
      'mkt-02-content-strategy-and-creation',
    ]);
    expect(MARKETING_MODULES.every((m) => m.themeId === 'marketing')).toBe(true);
  });

  it('every marketing module is a draft (needs_review)', () => {
    for (const m of MARKETING_MODULES) {
      expect(m.status).toBe('needs_review');
    }
  });

  it('every module has BG and EN theory within a reasonable size', () => {
    for (const m of MARKETING_MODULES) {
      expect(m.theoryBlock_en.trim().length).toBeGreaterThan(60);
      expect(m.theoryBlock_bg.trim().length).toBeGreaterThan(60);
      expect(m.theoryBlock_en.split(/\s+/).length).toBeLessThanOrEqual(140);
      expect(m.theoryBlock_bg.split(/\s+/).length).toBeLessThanOrEqual(140);
    }
  });

  it('every module has at least 2 practice tasks with CEFE blocks', () => {
    for (const m of MARKETING_MODULES) {
      expect(m.practiceTasks.length).toBeGreaterThanOrEqual(2);
      for (const task of m.practiceTasks) {
        expect(task.cefe).toBeTruthy();
        expect(task.cefe!.processingQuestions_en.length).toBeGreaterThanOrEqual(2);
        expect(task.cefe!.processingQuestions_bg.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('every module has Kiki mentoring questions and dictionary concepts', () => {
    for (const m of MARKETING_MODULES) {
      expect(m.kikiQuestions.length).toBeGreaterThanOrEqual(4);
      expect(m.dictionaryConcepts.length).toBeGreaterThan(0);
    }
  });

  it('is included in the aggregated PRACTICE_FIRST_MODULES export', () => {
    const marketing = PRACTICE_FIRST_MODULES.filter((m) => m.themeId === 'marketing');
    expect(marketing).toEqual(MARKETING_MODULES);
  });

  it('avoids hype phrases and childish tone', () => {
    const banned = [
      'ask me anything',
      'game-changing',
      'revolutionary',
      'this will work',
      'страхотна идея',
      'това ще проработи',
      'питай ме всичко',
    ];
    const all = MARKETING_MODULES.map((m) =>
      [
        m.theoryBlock_en,
        m.theoryBlock_bg,
        ...m.practiceTasks.flatMap((t) => [t.title_en, t.title_bg, t.brief_en, t.brief_bg]),
        ...m.kikiQuestions.flatMap((q) => [q.en, q.bg]),
      ].join(' '),
    )
      .join(' ')
      .toLowerCase();
    for (const phrase of banned) {
      expect(all).not.toContain(phrase);
    }
  });
});