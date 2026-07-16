import { describe, it, expect } from 'vitest';
import {
  ENTREPRENEURSHIP_MODULES,
  INNOVATION_MODULES,
  PRACTICE_FIRST_MODULES,
} from '@/data/practice-first-content';

/**
 * CEFE upgrade V1 — verifies that every Entrepreneurship practice task
 * has a structured action-based experiential learning block, without
 * touching Innovation content, dictionary data, XP, auth, RLS, routes,
 * submissions or UI.
 */
describe('Entrepreneurship CEFE practice tasks V1', () => {
  const allTasks = ENTREPRENEURSHIP_MODULES.flatMap((m) => m.practiceTasks);

  it('has 6 modules × 2 tasks = 12 upgraded Entrepreneurship tasks', () => {
    expect(ENTREPRENEURSHIP_MODULES).toHaveLength(6);
    expect(allTasks).toHaveLength(12);
  });

  it('every Entrepreneurship task has a cefe block with all required EN/BG fields', () => {
    const required = [
      'action_en',
      'action_bg',
      'visibleResult_en',
      'visibleResult_bg',
      'generalizing_en',
      'generalizing_bg',
      'applying_en',
      'applying_bg',
      'teacherCheck_en',
      'teacherCheck_bg',
      'evidence_en',
      'evidence_bg',
    ] as const;
    for (const t of allTasks) {
      expect(t.cefe, `task ${t.id} missing cefe`).toBeDefined();
      for (const key of required) {
        expect(
          (t.cefe as Record<string, unknown>)[key],
          `task ${t.id} missing cefe.${key}`,
        ).toBeTruthy();
        expect(
          String(
            (t.cefe as unknown as Record<string, string>)[key],
          ).trim().length,
        ).toBeGreaterThan(3);
      }
    }
  });

  it('every task has at least 2 processing questions in EN and BG', () => {
    for (const t of allTasks) {
      expect(t.cefe!.processingQuestions_en.length).toBeGreaterThanOrEqual(2);
      expect(t.cefe!.processingQuestions_bg.length).toBeGreaterThanOrEqual(2);
      expect(t.cefe!.processingQuestions_en.length).toBe(
        t.cefe!.processingQuestions_bg.length,
      );
      for (const q of [
        ...t.cefe!.processingQuestions_en,
        ...t.cefe!.processingQuestions_bg,
      ]) {
        expect(q.trim().length).toBeGreaterThan(5);
      }
    }
  });

  it('every task produces a named visible result and evidence artifact', () => {
    for (const t of allTasks) {
      expect(t.cefe!.visibleResult_en.length).toBeGreaterThan(10);
      expect(t.cefe!.visibleResult_bg.length).toBeGreaterThan(10);
      expect(t.cefe!.evidence_en.length).toBeGreaterThan(3);
      expect(t.cefe!.evidence_bg.length).toBeGreaterThan(3);
    }
  });

  it('no Entrepreneurship module is educator_approved', () => {
    for (const m of ENTREPRENEURSHIP_MODULES) {
      expect(m.status).not.toBe('educator_approved');
    }
    expect(
      PRACTICE_FIRST_MODULES.some((m) => m.status === 'educator_approved'),
    ).toBe(false);
  });

  it('does not modify Innovation modules with cefe blocks', () => {
    for (const m of INNOVATION_MODULES) {
      for (const t of m.practiceTasks) {
        expect(t.cefe).toBeUndefined();
      }
    }
  });

  it('no task requires public posting, personal social accounts, paid ads, or unsafe outreach', () => {
    const forbidden = [
      'post it publicly',
      'publish on instagram',
      'publish on tiktok',
      'personal instagram account',
      'buy ads',
      'facebook ads',
      'contact strangers',
      'публикувай публично',
      'публикувай в instagram',
      'публикувай в tiktok',
      'купи реклама',
      'непознати хора',
    ];
    const blob = allTasks
      .map((t) =>
        [
          t.cefe!.action_en,
          t.cefe!.action_bg,
          t.cefe!.visibleResult_en,
          t.cefe!.visibleResult_bg,
          t.cefe!.teacherCheck_en,
          t.cefe!.teacherCheck_bg,
        ].join(' '),
      )
      .join(' ')
      .toLowerCase();
    for (const phrase of forbidden) {
      expect(blob).not.toContain(phrase);
    }
  });

  it('Module 5 tasks explicitly treat MVP as a learning tool, not a small final product', () => {
    const mvpModule = ENTREPRENEURSHIP_MODULES.find(
      (m) => m.id === 'entr-05-mvp-experiments-learning',
    );
    expect(mvpModule).toBeDefined();
    const blob = mvpModule!.practiceTasks
      .map((t) => [t.cefe!.action_en, t.cefe!.generalizing_en, t.cefe!.action_bg, t.cefe!.generalizing_bg].join(' '))
      .join(' ')
      .toLowerCase();
    expect(blob).toContain('learning');
    expect(blob).toContain('учене');
  });

  it('Module 6 tasks include pivot / persevere / stop or evidence-based decision language', () => {
    const decisionModule = ENTREPRENEURSHIP_MODULES.find(
      (m) => m.id === 'entr-06-decision-pivot-pitch',
    );
    expect(decisionModule).toBeDefined();
    const blob = decisionModule!.practiceTasks
      .map((t) =>
        [
          t.cefe!.action_en,
          t.cefe!.action_bg,
          t.cefe!.generalizing_en,
          t.cefe!.generalizing_bg,
        ].join(' '),
      )
      .join(' ')
      .toLowerCase();
    expect(blob).toMatch(/pivot|persevere|stop|evidence-based/);
    expect(blob).toMatch(/pivot|persevere|прекратяване|аргументирано/);
  });

  it('Bulgarian CEFE copy avoids childish hype phrases', () => {
    const banned = [
      'забавлявай се',
      'страхотна идея',
      'промени света',
      'магия',
      'супер яко',
    ];
    const blob = allTasks
      .map((t) =>
        [
          t.cefe!.action_bg,
          t.cefe!.visibleResult_bg,
          ...t.cefe!.processingQuestions_bg,
          t.cefe!.generalizing_bg,
          t.cefe!.applying_bg,
          t.cefe!.teacherCheck_bg,
          t.cefe!.evidence_bg,
        ].join(' '),
      )
      .join(' ')
      .toLowerCase();
    for (const phrase of banned) {
      expect(blob).not.toContain(phrase);
    }
  });
});