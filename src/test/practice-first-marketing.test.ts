import { describe, it, expect } from 'vitest';
import {
  MARKETING_MODULES,
  PRACTICE_FIRST_MODULES,
} from '@/data/practice-first-content';

describe('Practice-first content seed V1A-V1D — Digital Marketing (Modules 1-8)', () => {
  it('exposes exactly the 8 Marketing modules in order', () => {
    expect(MARKETING_MODULES).toHaveLength(8);
    expect(MARKETING_MODULES.map((m) => m.id)).toEqual([
      'mkt-01-brand-foundations-2026',
      'mkt-02-content-strategy-and-creation',
      'mkt-03-channels-and-platform-logic',
      'mkt-04-marketing-planning',
      'mkt-05-campaigns-codes-and-kpi',
      'mkt-06-seo-search-and-aio-visibility',
      'mkt-07-case-lab-2026',
      'mkt-08-final-project-digital-marketing-plan-2026',
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

  it('Module 5 covers campaign codes, UTM and KPI decision content', () => {
    const m5 = MARKETING_MODULES.find((m) => m.id === 'mkt-05-campaigns-codes-and-kpi')!;
    expect(m5.practiceTasks.map((t) => t.id)).toEqual(['mkt-05-t1', 'mkt-05-t2']);
    expect(m5.dictionaryConcepts).toEqual(
      expect.arrayContaining([
        'Marketing Campaign',
        'Campaign Objective',
        'Promo Code',
        'Referral Code',
        'Campaign Code',
        'UTM',
        'Tracking Link',
        'CTR',
        'CPA',
        'Conversion Rate',
        'ROI',
        'Vanity Metric',
      ]),
    );
    const blob = [
      m5.theoryBlock_en,
      m5.theoryBlock_bg,
      ...m5.practiceTasks.flatMap((t) => [t.brief_en, t.brief_bg]),
    ].join(' ').toLowerCase();
    expect(blob).toContain('promo');
    expect(blob).toContain('referral');
    expect(blob).toContain('kpi');
    expect(blob).toContain('vanity');
  });

  it('Module 6 covers SEO, search intent and responsible AIO framing', () => {
    const m6 = MARKETING_MODULES.find((m) => m.id === 'mkt-06-seo-search-and-aio-visibility')!;
    expect(m6.practiceTasks.map((t) => t.id)).toEqual(['mkt-06-t1', 'mkt-06-t2']);
    expect(m6.dictionaryConcepts).toEqual(
      expect.arrayContaining([
        'SEO',
        'Keyword',
        'Search Intent',
        'AIO',
        'AEO',
        'GEO',
        'AI Visibility',
        'AI Overview',
        'AI Mode',
        'Structured Content',
        'Schema Markup',
        'Helpful Content',
        'Cite-worthy Content',
      ]),
    );
    const blob = [
      m6.theoryBlock_en,
      m6.theoryBlock_bg,
      ...m6.practiceTasks.flatMap((t) => [t.brief_en, t.brief_bg]),
    ].join(' ').toLowerCase();
    expect(blob).toContain('search intent');
    expect(blob).toContain('aio');
    // Responsible framing: no magic tricks / hacks / guarantees
    for (const banned of ['ai search hack', 'magic formula', 'hack the algorithm', 'seo hack']) {
      expect(blob).not.toContain(banned);
    }
  });

  it('Module 7 covers Case Lab 2026 with all five case directions and no absolutism', () => {
    const m7 = MARKETING_MODULES.find((m) => m.id === 'mkt-07-case-lab-2026')!;
    expect(m7.practiceTasks.map((t) => t.id)).toEqual(['mkt-07-t1', 'mkt-07-t2']);
    const blob = [
      m7.theoryBlock_en,
      m7.theoryBlock_bg,
      ...m7.practiceTasks.flatMap((t) => [t.brief_en, t.brief_bg]),
    ].join(' ');
    for (const direction of ['Lovable', 'LinkedIn', 'TikTok', 'Meta', 'Google']) {
      expect(blob).toContain(direction);
    }
    const lower = blob.toLowerCase();
    for (const banned of ['perfect campaign', 'universally correct', 'guaranteed campaign', 'best campaign ever']) {
      expect(lower).not.toContain(banned);
    }
    expect(m7.dictionaryConcepts).toEqual(
      expect.arrayContaining([
        'Case Analysis',
        'Campaign Analysis',
        'Platform Claim',
        'Current Source Check',
        'Case Redesign',
        'AI Content Optimization',
        'Search Visibility Audit',
      ]),
    );
  });

  it('Module 8 is the Digital Marketing Plan 2026 final project with safe scope', () => {
    const m8 = MARKETING_MODULES.find(
      (m) => m.id === 'mkt-08-final-project-digital-marketing-plan-2026',
    )!;
    expect(m8.practiceTasks.map((t) => t.id)).toEqual(['mkt-08-t1', 'mkt-08-t2']);
    expect(m8.dictionaryConcepts).toEqual(
      expect.arrayContaining([
        'Digital Marketing Plan',
        'AI-use Log',
        'Self-Assessment',
        'Feedback-based Revision',
        'Presentation Evidence',
        'Risk and Constraint',
        'Strategy Fit',
        'Final Project',
      ]),
    );
    const blob = [
      m8.theoryBlock_en,
      m8.theoryBlock_bg,
      ...m8.practiceTasks.flatMap((t) => [t.brief_en, t.brief_bg]),
    ].join(' ').toLowerCase();
    // Explicit safety scope
    for (const req of ['no public posting', 'no personal account', 'no paid ads', 'no real customer data', 'no real tracking pixels']) {
      expect(blob).toContain(req);
    }
    // Required deliverables mentioned
    for (const section of ['brand promise', 'positioning', 'content pillars', 'campaign', 'kpi', 'seo']) {
      expect(blob).toContain(section);
    }
  });

  it('Modules 7-8 never require ad spend, personal accounts, real customer data or tracking pixels', () => {
    const later = MARKETING_MODULES.filter((m) =>
      ['mkt-07-case-lab-2026', 'mkt-08-final-project-digital-marketing-plan-2026'].includes(m.id),
    );
    for (const m of later) {
      const blob = [
        m.theoryBlock_en,
        m.theoryBlock_bg,
        ...m.practiceTasks.flatMap((t) => [
          t.brief_en,
          t.brief_bg,
          t.cefe?.action_en ?? '',
          t.cefe?.action_bg ?? '',
          t.cefe?.teacherCheck_en ?? '',
          t.cefe?.teacherCheck_bg ?? '',
        ]),
      ].join(' ').toLowerCase();
      for (const forbidden of [
        'install a tracking pixel',
        'install tracking pixel',
        'buy real ads',
        'collect personal data from real',
        'ad spend required',
        'publish this publicly',
      ]) {
        expect(blob).not.toContain(forbidden);
      }
    }
  });
});