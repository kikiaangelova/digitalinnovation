import { describe, it, expect } from 'vitest';
import {
  CASE_THEME_TAGS,
  isProductionCaseId,
  entrepreneurshipCasesAtLevel,
  casesForEntrepreneurshipModule,
  type EntrepreneurshipModuleId,
} from '@/data/case-theme-tags';

describe('case-theme-tags production UUID registry', () => {
  it('every seeded caseId is a real UUID (no legacy slug placeholders)', () => {
    for (const tag of CASE_THEME_TAGS) {
      expect(isProductionCaseId(tag.caseId), `bad caseId: ${tag.caseId}`).toBe(true);
    }
  });

  it('no entry is marked educator_approved', () => {
    for (const tag of CASE_THEME_TAGS) {
      expect(tag.reviewStatus ?? 'needs_content_review').not.toBe('educator_approved');
    }
  });

  it('all caseIds are unique', () => {
    const ids = CASE_THEME_TAGS.map((t) => t.caseId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('moduleFit only appears on entries with entrepreneurshipLevel set', () => {
    for (const tag of CASE_THEME_TAGS) {
      if (tag.moduleFit && tag.moduleFit.length > 0) {
        expect(tag.entrepreneurshipLevel, `${tag.caseId} has moduleFit without entrepreneurshipLevel`).toBeDefined();
      }
    }
  });

  it('entrepreneurship ladder covers all three levels', () => {
    expect(entrepreneurshipCasesAtLevel('beginner').length).toBeGreaterThanOrEqual(2);
    expect(entrepreneurshipCasesAtLevel('intermediate').length).toBeGreaterThanOrEqual(2);
    expect(entrepreneurshipCasesAtLevel('advanced').length).toBeGreaterThanOrEqual(2);
  });

  it('every Entrepreneurship module 01-06 has at least one mapped case', () => {
    const modules: EntrepreneurshipModuleId[] = [
      'entr-01-thinking-and-action',
      'entr-02-curiosity-and-problem-discovery',
      'entr-03-fact-opinion-assumption',
      'entr-04-opportunity-value-business-model',
      'entr-05-mvp-experiments-learning',
      'entr-06-decision-pivot-pitch',
    ];
    for (const m of modules) {
      expect(casesForEntrepreneurshipModule(m).length, `module ${m} has no cases`).toBeGreaterThan(0);
    }
  });
});