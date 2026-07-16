import { describe, it, expect } from 'vitest';
import {
  ENTREPRENEURSHIP_MODULES,
  INNOVATION_MODULES,
  PRACTICE_FIRST_MODULES,
} from '@/data/practice-first-content';

describe('Practice-first content seed V1B — Innovation', () => {
  it('has exactly 6 innovation modules, all themed innovation', () => {
    expect(INNOVATION_MODULES).toHaveLength(6);
    expect(INNOVATION_MODULES.every((m) => m.themeId === 'innovation')).toBe(true);
  });

  it('every innovation module is needs_review', () => {
    for (const m of INNOVATION_MODULES) {
      expect(m.status).toBe('needs_review');
    }
    expect(PRACTICE_FIRST_MODULES.some((m) => m.status === 'educator_approved')).toBe(false);
  });

  it('every module has BG and EN theory of reasonable length (<= ~180 words)', () => {
    for (const m of INNOVATION_MODULES) {
      expect(m.theoryBlock_en.trim().length).toBeGreaterThan(60);
      expect(m.theoryBlock_bg.trim().length).toBeGreaterThan(60);
      expect(m.theoryBlock_en.split(/\s+/).length).toBeLessThanOrEqual(180);
      expect(m.theoryBlock_bg.split(/\s+/).length).toBeLessThanOrEqual(180);
    }
  });

  it('every module has at least 2 practice tasks', () => {
    for (const m of INNOVATION_MODULES) {
      expect(m.practiceTasks.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('every module has 4-6 Kiki mentoring questions', () => {
    for (const m of INNOVATION_MODULES) {
      expect(m.kikiQuestions.length).toBeGreaterThanOrEqual(4);
      expect(m.kikiQuestions.length).toBeLessThanOrEqual(6);
      for (const q of m.kikiQuestions) {
        expect(q.en.trim().length).toBeGreaterThan(0);
        expect(q.bg.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('every module has dictionary concepts', () => {
    for (const m of INNOVATION_MODULES) {
      expect(m.dictionaryConcepts.length).toBeGreaterThan(0);
    }
  });

  it('innovation modules are appended after entrepreneurship in PRACTICE_FIRST_MODULES', () => {
    const entCount = ENTREPRENEURSHIP_MODULES.length;
    expect(PRACTICE_FIRST_MODULES.slice(0, entCount)).toEqual(ENTREPRENEURSHIP_MODULES);
    expect(PRACTICE_FIRST_MODULES.slice(entCount, entCount + INNOVATION_MODULES.length)).toEqual(
      INNOVATION_MODULES,
    );
  });

  it('does not use banned hype/childish phrases', () => {
    const forbidden = [
      'disruptive',
      'game-changing',
      'game changing',
      'revolutionary',
      'unique',
      'great idea',
      'страхотна идея',
      'революционн',
      'уникал',
    ];
    const all = INNOVATION_MODULES.map((m) =>
      [
        m.theoryBlock_en,
        m.theoryBlock_bg,
        ...m.practiceTasks.flatMap((t) => [t.title_en, t.title_bg, t.brief_en, t.brief_bg]),
        ...m.kikiQuestions.flatMap((q) => [q.en, q.bg]),
        m.reflectionPrompt.en,
        m.reflectionPrompt.bg,
        m.improvementPrompt.en,
        m.improvementPrompt.bg,
      ].join(' '),
    )
      .join(' ')
      .toLowerCase();
    for (const phrase of forbidden) {
      expect(all).not.toContain(phrase);
    }
  });

  it('does not forcibly translate standard English terms in BG copy', () => {
    const forbiddenBg = [
      'мрежови ефекти',
      'мрежов ефект',
      'платформено съответствие',
      'дигитално иновиране',
      'бизнес модел иновация',
      'ключов показател за представяне',
    ];
    const allBg = INNOVATION_MODULES.map((m) =>
      [
        m.theoryBlock_bg,
        ...m.practiceTasks.flatMap((t) => [t.title_bg, t.brief_bg]),
      ].join(' '),
    )
      .join(' ')
      .toLowerCase();
    for (const phrase of forbiddenBg) {
      expect(allBg).not.toContain(phrase);
    }
  });

  it('does not modify entrepreneurship modules (still 6, still needs_review)', () => {
    expect(ENTREPRENEURSHIP_MODULES).toHaveLength(6);
    expect(ENTREPRENEURSHIP_MODULES.every((m) => m.themeId === 'entrepreneurship')).toBe(true);
    expect(ENTREPRENEURSHIP_MODULES.every((m) => m.status === 'needs_review')).toBe(true);
  });
});
