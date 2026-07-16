/**
 * Case metadata tags — sidecar registry so cases can be linked to the
 * 5 learning themes and to topic tags without editing DB rows.
 *
 * A case appears in this registry by its stable case identifier
 * (slug or DB id). Any case NOT listed here is treated as
 * `needs_content_review` at read time.
 *
 * This file does NOT rewrite case bodies. It only tags them.
 */
import type { ThemeId } from './content-structure';

export type CaseReviewStatus =
  | 'needs_content_review'
  | 'ready_for_educator_review'
  | 'educator_approved';

export interface CaseThemeTag {
  /** Stable case identifier — slug or DB id. */
  caseId: string;
  /** Primary theme this case belongs to. */
  primaryTheme: ThemeId;
  /** Secondary themes this case touches (optional). */
  secondaryThemes?: ThemeId[];
  /** Topic tags — free-form, matches `content-structure.relatedCaseTags`. */
  topicTags: string[];
  /** Editorial review status. Defaults to `needs_content_review` at read time. */
  reviewStatus?: CaseReviewStatus;
  notes?: string;
}

/**
 * Seed tags for the example case scenarios called out by the educator.
 * All entries default to `needs_content_review` — no case body has been
 * reviewed by an educator in this structure pass.
 */
export const CASE_THEME_TAGS: CaseThemeTag[] = [
  {
    caseId: 'chatgpt-ai-business-model',
    primaryTheme: 'ai',
    secondaryThemes: ['innovation', 'entrepreneurship'],
    topicTags: ['chatgpt-ai-business-model', 'digital-platform', 'startup'],
    reviewStatus: 'needs_content_review',
  },
  {
    caseId: 'revolut-fintech',
    primaryTheme: 'innovation',
    secondaryThemes: ['entrepreneurship', 'marketing'],
    topicTags: ['digital-platform', 'startup'],
    reviewStatus: 'needs_content_review',
  },
  {
    caseId: 'sports-innovation',
    primaryTheme: 'innovation',
    secondaryThemes: ['management'],
    topicTags: ['sports-innovation'],
    reviewStatus: 'needs_content_review',
  },
  {
    caseId: 'fashion-business',
    primaryTheme: 'entrepreneurship',
    secondaryThemes: ['marketing'],
    topicTags: ['fashion-business', 'small-business'],
    reviewStatus: 'needs_content_review',
  },
  {
    caseId: 'food-waste-sustainability',
    primaryTheme: 'entrepreneurship',
    secondaryThemes: ['innovation'],
    topicTags: ['food-waste', 'sustainability'],
    reviewStatus: 'needs_content_review',
  },
  {
    caseId: 'school-youth-environment',
    primaryTheme: 'entrepreneurship',
    secondaryThemes: ['marketing', 'management'],
    topicTags: ['youth-environment', 'school-environment'],
    reviewStatus: 'needs_content_review',
  },
  {
    caseId: 'small-business',
    primaryTheme: 'management',
    secondaryThemes: ['marketing', 'entrepreneurship'],
    topicTags: ['small-business'],
    reviewStatus: 'needs_content_review',
  },
  {
    caseId: 'digital-marketing-campaign',
    primaryTheme: 'marketing',
    secondaryThemes: ['ai'],
    topicTags: ['digital-marketing-campaign'],
    reviewStatus: 'needs_content_review',
  },
];

const BY_ID: Record<string, CaseThemeTag> = CASE_THEME_TAGS.reduce(
  (acc, t) => {
    acc[t.caseId] = t;
    return acc;
  },
  {} as Record<string, CaseThemeTag>,
);

export function tagForCase(caseId: string | null | undefined): CaseThemeTag | null {
  if (!caseId) return null;
  return BY_ID[caseId] ?? null;
}

export function caseReviewStatus(caseId: string | null | undefined): CaseReviewStatus {
  const tag = tagForCase(caseId);
  return tag?.reviewStatus ?? 'needs_content_review';
}

export function casesForTheme(theme: ThemeId): CaseThemeTag[] {
  return CASE_THEME_TAGS.filter(
    (t) => t.primaryTheme === theme || (t.secondaryThemes ?? []).includes(theme),
  );
}
