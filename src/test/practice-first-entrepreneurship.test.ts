import { describe, it, expect } from 'vitest';
import {
  ENTREPRENEURSHIP_MODULES,
  PRACTICE_FIRST_MODULES,
} from '@/data/practice-first-content';

describe('Practice-first content seed V1A — Entrepreneurship', () => {
  it('has exactly 6 entrepreneurship modules', () => {
    expect(ENTREPRENEURSHIP_MODULES).toHaveLength(6);
    expect(
      ENTREPRENEURSHIP_MODULES.every((m) => m.themeId === 'entrepreneurship'),
    ).toBe(true);
  });

  it('every module is needs_review (none educator_approved)', () => {
    for (const m of ENTREPRENEURSHIP_MODULES) {
      expect(m.status).toBe('needs_review');
    }
    expect(
      PRACTICE_FIRST_MODULES.some((m) => m.status === 'educator_approved'),
    ).toBe(false);
  });

  it('every module has BG and EN theory', () => {
    for (const m of ENTREPRENEURSHIP_MODULES) {
      expect(m.theoryBlock_en.trim().length).toBeGreaterThan(40);
      expect(m.theoryBlock_bg.trim().length).toBeGreaterThan(40);
    }
  });

  it('every module has at least 2 practice tasks', () => {
    for (const m of ENTREPRENEURSHIP_MODULES) {
      expect(m.practiceTasks.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('every module has Kiki mentoring questions', () => {
    for (const m of ENTREPRENEURSHIP_MODULES) {
      expect(m.kikiQuestions.length).toBeGreaterThanOrEqual(4);
      for (const q of m.kikiQuestions) {
        expect(q.en.trim().length).toBeGreaterThan(0);
        expect(q.bg.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('every module has dictionary concepts', () => {
    for (const m of ENTREPRENEURSHIP_MODULES) {
      expect(m.dictionaryConcepts.length).toBeGreaterThan(0);
    }
  });

  it('does not forcibly translate standard English terms in BG copy', () => {
    const forbiddenBgTranslations = [
      'минимално жизнеспособен продукт',
      'постно стартиране',
      'постен canvas',
      'канава на бизнес модела',
      'изход към пазара',
      'продуктово-пазарно съответствие',
      'обръщане на курса',
    ];
    const allBg = ENTREPRENEURSHIP_MODULES.map(
      (m) =>
        m.theoryBlock_bg +
        ' ' +
        m.practiceTasks.map((t) => t.brief_bg + ' ' + t.title_bg).join(' '),
    )
      .join(' ')
      .toLowerCase();
    for (const phrase of forbiddenBgTranslations) {
      expect(allBg).not.toContain(phrase);
    }
  });

  it('avoids hype / childish phrases', () => {
    const forbidden = [
      'great idea',
      'this will work',
      'big potential',
      'ask me anything',
      'страхотна идея',
      'това ще проработи',
    ];
    const all = ENTREPRENEURSHIP_MODULES.map((m) =>
      [
        m.theoryBlock_en,
        m.theoryBlock_bg,
        ...m.kikiQuestions.flatMap((q) => [q.en, q.bg]),
      ].join(' '),
    )
      .join(' ')
      .toLowerCase();
    for (const phrase of forbidden) {
      expect(all).not.toContain(phrase);
    }
  });

  it('does not contain the polished-out awkward BG phrasings', () => {
    const forbiddenBg = [
      'малък залог',
      'на които им пука',
      'уловиш част от стойността',
      'уловиш част от нея обратно',
    ];
    const all = ENTREPRENEURSHIP_MODULES.map((m) =>
      [
        m.theoryBlock_bg,
        ...m.practiceTasks.flatMap((t) => [t.title_bg, t.brief_bg]),
        ...m.kikiQuestions.map((q) => q.bg),
        m.reflectionPrompt.bg,
        m.improvementPrompt.bg,
      ].join(' '),
    )
      .join(' ')
      .toLowerCase();
    for (const phrase of forbiddenBg) {
      expect(all).not.toContain(phrase);
    }
  });
});