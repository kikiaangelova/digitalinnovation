/**
 * Educator-approved taxonomy tests for /learn.
 *
 * Verifies the learner-facing hierarchy in `learning-areas.ts` matches
 * the educator's approved structure: 6 areas in a fixed order, Agile /
 * Scrum / Sales are not top-level cards, and the copy uses the
 * approved Bulgarian phrasing.
 */

import { describe, it, expect } from 'vitest';

import {
  LEARNING_AREAS,
  AREA_BY_SUBJECT_KEY,
  areaOfSubject,
} from '@/data/learning-areas';

describe('learning areas — educator-approved taxonomy', () => {
  it('renders the 6 learning areas in the approved order', () => {
    expect(LEARNING_AREAS.map((a) => a.id)).toEqual([
      'management',
      'marketing',
      'entrepreneurship',
      'innovation',
      'ai',
      'skills',
    ]);
  });

  it('places Project Management inside the Management area', () => {
    const mgmt = LEARNING_AREAS.find((a) => a.id === 'management')!;
    expect(mgmt.subjectKeys).toContain('project-management');
    expect(areaOfSubject('project-management')).toBe('management');
  });

  it('does not render Agile or Scrum as prominent standalone learner-facing cards', () => {
    for (const area of LEARNING_AREAS) {
      expect(area.subjectKeys).not.toContain('agile');
      expect(area.subjectKeys).not.toContain('scrum');
    }
    // But they still classify under Management for reverse lookup.
    expect(AREA_BY_SUBJECT_KEY['agile']).toBe('management');
    expect(AREA_BY_SUBJECT_KEY['scrum']).toBe('management');
  });

  it('places Digital Marketing inside Marketing (not as a separate universe)', () => {
    const marketing = LEARNING_AREAS.find((a) => a.id === 'marketing')!;
    expect(marketing.subjectKeys).toContain('marketing-foundations');
    expect(marketing.subjectKeys).toContain('digital-marketing');
    expect(areaOfSubject('digital-marketing')).toBe('marketing');
  });

  it('does not render Sales as a standalone major subject card', () => {
    for (const area of LEARNING_AREAS) {
      expect(area.subjectKeys).not.toContain('sales-customer-relationships');
    }
  });

  it('labels Skills as outcomes/evidence — no subjects, and mentions tasks/reflection (not clicks)', () => {
    const skills = LEARNING_AREAS.find((a) => a.id === 'skills')!;
    expect(skills.subjectKeys).toEqual([]);
    expect(skills.short_bg).toMatch(/задачи|казуси|проекти|рефлексия/);
    expect(skills.short_bg).toMatch(/не чрез кликове|не с кликове/);
    expect(skills.short_en.toLowerCase()).toMatch(/not clicks/);
    // Sales skill appears in the Skills topic list.
    const bgTopics = skills.topics.map((t) => t.bg);
    expect(bgTopics).toContain('Продажбени умения');
  });

  it('uses "критично мислене" (never "критическо мислене") in the Skills BG topics', () => {
    const skills = LEARNING_AREAS.find((a) => a.id === 'skills')!;
    const bg = skills.topics.map((t) => t.bg).join(' | ');
    expect(bg).toMatch(/критично мислене/);
    expect(bg).not.toMatch(/критическо мислене/);
  });

  it('Management BG description reflects processes/resources/results, not only people leadership', () => {
    const mgmt = LEARNING_AREAS.find((a) => a.id === 'management')!;
    expect(mgmt.short_bg).toMatch(/процеси/);
    expect(mgmt.short_bg).toMatch(/ресурси/);
    expect(mgmt.short_bg).toMatch(/резултати/);
  });
});