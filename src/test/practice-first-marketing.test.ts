import { describe, it, expect } from 'vitest';
import {
  MARKETING_MODULES,
  PRACTICE_FIRST_MODULES,
} from '@/data/practice-first-content';

describe('Practice-first content seed V1A+V1B — Digital Marketing (Modules 1-4)', () => {
  it('exposes exactly the 4 Marketing modules in order', () => {
    expect(MARKETING_MODULES).toHaveLength(4);
    expect(MARKETING_MODULES.map((m) => m.id)).toEqual([
      'mkt-01-brand-foundations-2026',
      'mkt-02-content-strategy-and-creation',
      'mkt-03-channels-and-platform-logic',
      'mkt-04-marketing-planning',
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
      expect(m.theoryBlock_en.split(/\s+/).length).toBeLessThanOrEqual(220);
      expect(m.theoryBlock_bg.split(/\s+/).length).toBeLessThanOrEqual(220);
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
      'dove',
      'adobe',
      'spotify',
      'slack',
      'unlock your potential',
      'boost your brand',
      'take it to the next level',
      'пусаш',
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

  it('Module 3 covers Instagram, TikTok, LinkedIn and Facebook / Meta', () => {
    const m3 = MARKETING_MODULES.find((m) => m.id === 'mkt-03-channels-and-platform-logic')!;
    const blob = [
      m3.theoryBlock_en,
      m3.theoryBlock_bg,
      ...m3.practiceTasks.flatMap((t) => [t.brief_en, t.brief_bg]),
    ].join(' ');
    for (const platform of ['Instagram', 'TikTok', 'LinkedIn', 'Facebook']) {
      expect(blob).toContain(platform);
    }
    expect(m3.dictionaryConcepts).toEqual(
      expect.arrayContaining([
        'Instagram Marketing',
        'TikTok Marketing',
        'LinkedIn Marketing',
        'Facebook Marketing',
      ]),
    );
  });

  it('Module 4 has audience segment and one-page marketing plan tasks', () => {
    const m4 = MARKETING_MODULES.find((m) => m.id === 'mkt-04-marketing-planning')!;
    expect(m4.practiceTasks.map((t) => t.id)).toEqual(['mkt-04-t1', 'mkt-04-t2']);
    expect(m4.dictionaryConcepts).toEqual(
      expect.arrayContaining(['Marketing Plan', 'Segmentation', 'Targeting', 'Positioning', 'KPI']),
    );
    expect(m4.evidenceOfSkill.length).toBeGreaterThan(0);
  });

  it('every module has evidenceOfSkill and reflection/improvement prompts', () => {
    for (const m of MARKETING_MODULES) {
      expect(m.evidenceOfSkill.length).toBeGreaterThan(0);
      expect(m.reflectionPrompt.en.length).toBeGreaterThan(0);
      expect(m.reflectionPrompt.bg.length).toBeGreaterThan(0);
      expect(m.improvementPrompt.en.length).toBeGreaterThan(0);
      expect(m.improvementPrompt.bg.length).toBeGreaterThan(0);
    }
  });

  it('fixes the V1A typo пусаш → пускаш in Module 2 BG theory', () => {
    const m2 = MARKETING_MODULES.find((m) => m.id === 'mkt-02-content-strategy-and-creation')!;
    expect(m2.theoryBlock_bg).not.toContain('пусаш');
    expect(m2.theoryBlock_bg).toContain('пускаш');
  });
});