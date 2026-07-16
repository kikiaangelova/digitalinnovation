import { describe, it, expect } from 'vitest';
import {
  CASE_THEME_TAGS,
  isProductionCaseId,
  entrepreneurshipCasesAtLevel,
  casesForEntrepreneurshipModule,
  caseReviewStatus,
  tagForCase,
  type EntrepreneurshipModuleId,
} from '@/data/case-theme-tags';

const PAYHAWK = 'a1000001-0001-0001-0001-000000000001';
const CALM = 'd1000002-0000-0000-0000-000000000003';
const ZARA = 'd1000005-0000-0000-0000-000000000001';

const LEGACY_SLUGS = [
  'fashion-business',
  'food-waste-sustainability',
  'school-youth-environment',
  'small-business',
  'revolut-fintech',
  'chatgpt-ai-business-model',
  'sports-innovation',
  'digital-marketing-campaign',
];

describe('case-theme-tags production UUID registry', () => {
  it('no active caseId uses a legacy fake slug', () => {
    const ids = new Set(CASE_THEME_TAGS.map((t) => t.caseId));
    for (const slug of LEGACY_SLUGS) {
      expect(ids.has(slug), `legacy slug should not appear: ${slug}`).toBe(false);
    }
  });

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

  it('Payhawk is advanced Entrepreneurship, mapped to Module 6, not Module 5', () => {
    const p = tagForCase(PAYHAWK);
    expect(p).not.toBeNull();
    expect(p!.primaryTheme).toBe('entrepreneurship');
    expect(p!.entrepreneurshipLevel).toBe('advanced');
    expect(p!.moduleFit ?? []).toContain('entr-06-decision-pivot-pitch');
    expect(p!.moduleFit ?? []).not.toContain('entr-05-mvp-experiments-learning');
    expect(p!.reviewStatus ?? 'needs_content_review').not.toBe('educator_approved');
  });

  it('Calm vs Headspace is the MVP/experiment candidate', () => {
    const c = tagForCase(CALM);
    expect(c).not.toBeNull();
    expect(c!.primaryTheme).toBe('entrepreneurship');
    expect(c!.entrepreneurshipLevel).toBe('intermediate');
    expect(c!.moduleFit ?? []).toContain('entr-05-mvp-experiments-learning');
    expect(c!.caseUseNotes ?? '').toMatch(/MVP|full[- ]product|experiment/i);
  });

  it('Zara is secondary Entrepreneurship, not primary', () => {
    const z = tagForCase(ZARA);
    expect(z).not.toBeNull();
    expect(z!.primaryTheme).not.toBe('entrepreneurship');
    expect(z!.secondaryThemes ?? []).toContain('entrepreneurship');
    expect(z!.reviewStatus ?? 'needs_content_review').not.toBe('educator_approved');
  });

  it('Module 05 mapping includes Calm but not Payhawk', () => {
    const ids = casesForEntrepreneurshipModule('entr-05-mvp-experiments-learning').map((t) => t.caseId);
    expect(ids).toContain(CALM);
    expect(ids).not.toContain(PAYHAWK);
  });

  it('Module 06 mapping includes Payhawk', () => {
    const ids = casesForEntrepreneurshipModule('entr-06-decision-pivot-pitch').map((t) => t.caseId);
    expect(ids).toContain(PAYHAWK);
  });

  it('caseReviewStatus defaults to needs_content_review for unknown ids', () => {
    expect(caseReviewStatus('does-not-exist-xyz')).toBe('needs_content_review');
    expect(caseReviewStatus(null)).toBe('needs_content_review');
  });
});