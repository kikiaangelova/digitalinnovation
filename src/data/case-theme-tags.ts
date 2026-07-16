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

export type CaseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type EntrepreneurshipModuleId =
  | 'entr-01-thinking-and-action'
  | 'entr-02-curiosity-and-problem-discovery'
  | 'entr-03-fact-opinion-assumption'
  | 'entr-04-opportunity-value-business-model'
  | 'entr-05-mvp-experiments-learning'
  | 'entr-06-decision-pivot-pitch';

export interface CaseThemeTag {
  /** Stable case identifier — production DB UUID for active tags, slug for legacy placeholders. */
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
  /** Difficulty as configured on the production case row. */
  difficulty?: CaseDifficulty;
  /**
   * Recommended Entrepreneurship pathway level. May differ from raw case
   * difficulty when a case is intermediate overall but usable as a beginner
   * entrepreneurship reflection (or vice versa).
   */
  entrepreneurshipLevel?: CaseDifficulty;
  /** Entrepreneurship modules this case is a good fit for. */
  moduleFit?: EntrepreneurshipModuleId[];
  /** Short editorial note on how to use the case in a lesson. */
  caseUseNotes?: string;
}

/**
 * Registry of production case UUIDs mapped to learning themes and, where
 * relevant, the Entrepreneurship module ladder.
 *
 * UUIDs are taken from the production `case_studies` inventory (published = true).
 * Nothing here is `educator_approved`; every entry still defaults to
 * `needs_content_review` unless explicitly bumped to `ready_for_educator_review`.
 */
export const CASE_THEME_TAGS: CaseThemeTag[] = [
  // ── Entrepreneurship — Beginner ────────────────────────────────────────────
  {
    caseId: 'd1000001-0000-0000-0000-000000000003',
    primaryTheme: 'entrepreneurship',
    secondaryThemes: ['marketing'],
    topicTags: ['marketplace', 'niche', 'small-business'],
    difficulty: 'beginner',
    entrepreneurshipLevel: 'beginner',
    moduleFit: ['entr-01-thinking-and-action', 'entr-02-curiosity-and-problem-discovery'],
    caseUseNotes: 'Etsy vs Amazon — accessible founder framing, clear two-sided customer.',
  },
  {
    caseId: 'a1000001-0001-0001-0003-000000000001',
    primaryTheme: 'entrepreneurship',
    secondaryThemes: ['management'],
    topicTags: ['edtech', 'bulgaria', 'crisis-decision'],
    difficulty: 'beginner',
    entrepreneurshipLevel: 'beginner',
    moduleFit: [
      'entr-02-curiosity-and-problem-discovery',
      'entr-03-fact-opinion-assumption',
    ],
    caseUseNotes: 'Shkolo — Bulgarian classroom relevance, real user pressure under COVID.',
  },
  {
    caseId: 'a1000001-0000-0000-0000-000000000004',
    primaryTheme: 'entrepreneurship',
    secondaryThemes: ['innovation'],
    topicTags: ['edtech', 'youth', 'learning'],
    difficulty: 'beginner',
    entrepreneurshipLevel: 'beginner',
    moduleFit: ['entr-01-thinking-and-action'],
    caseUseNotes: 'Reinventing Learning — familiar student context, 8 narrative steps.',
  },

  // ── Entrepreneurship — Intermediate ────────────────────────────────────────
  {
    caseId: '4aa02c24-ea2c-41f8-a2ac-98c3aeeb07a8',
    primaryTheme: 'entrepreneurship',
    secondaryThemes: ['innovation', 'management'],
    topicTags: ['business-model', 'digital-strategy'],
    difficulty: 'intermediate',
    entrepreneurshipLevel: 'intermediate',
    moduleFit: ['entr-04-opportunity-value-business-model'],
    caseUseNotes: 'Most explicit business-model coverage — 12 questions across 7 steps.',
  },
  {
    caseId: 'd1000002-0000-0000-0000-000000000003',
    primaryTheme: 'entrepreneurship',
    secondaryThemes: ['marketing', 'innovation'],
    topicTags: ['mvp', 'consumer-app', 'value-proposition'],
    difficulty: 'intermediate',
    entrepreneurshipLevel: 'intermediate',
    moduleFit: ['entr-05-mvp-experiments-learning'],
    caseUseNotes: 'Calm vs Headspace — clean MVP-vs-full-product tradeoff on a consumer app.',
  },
  {
    caseId: 'a1000001-0001-0001-0001-000000000001',
    primaryTheme: 'entrepreneurship',
    secondaryThemes: ['innovation', 'ai'],
    topicTags: ['fintech', 'bulgaria', 'ai', 'scaleup'],
    difficulty: 'intermediate',
    entrepreneurshipLevel: 'intermediate',
    moduleFit: [
      'entr-04-opportunity-value-business-model',
      'entr-05-mvp-experiments-learning',
    ],
    caseUseNotes: 'Payhawk — Bulgarian founder story with clear risky assumption. Not beginner.',
  },

  // ── Entrepreneurship — Advanced ────────────────────────────────────────────
  {
    caseId: 'c1000002-0000-0000-0000-000000000001',
    primaryTheme: 'entrepreneurship',
    secondaryThemes: ['innovation', 'management'],
    topicTags: ['fintech', 'm-and-a', 'decision-under-uncertainty'],
    difficulty: 'advanced',
    entrepreneurshipLevel: 'advanced',
    moduleFit: ['entr-06-decision-pivot-pitch'],
    caseUseNotes: 'NeoBank acquisition — explicit tradeoffs, decision under uncertainty.',
  },
  {
    caseId: 'a1000001-0001-0001-0002-000000000001',
    primaryTheme: 'entrepreneurship',
    secondaryThemes: ['innovation', 'ai'],
    topicTags: ['healthtech', 'ai', 'bulgaria', 'regulation'],
    difficulty: 'advanced',
    entrepreneurshipLevel: 'advanced',
    moduleFit: ['entr-06-decision-pivot-pitch'],
    caseUseNotes: 'Kelvin Health — regulated scale-up requiring evidence-based decisions.',
  },
  {
    caseId: 'c1000003-0000-0000-0000-000000000001',
    primaryTheme: 'entrepreneurship',
    secondaryThemes: ['innovation', 'management'],
    topicTags: ['platform', 'network-effects', 'scaling'],
    difficulty: 'advanced',
    entrepreneurshipLevel: 'advanced',
    moduleFit: ['entr-06-decision-pivot-pitch'],
    caseUseNotes: 'Platform network effects — scaling and go-to-market focus.',
  },

  // ── Innovation (primary) ───────────────────────────────────────────────────
  {
    caseId: 'c1000001-0000-0000-0000-000000000001',
    primaryTheme: 'innovation',
    secondaryThemes: ['management', 'ai'],
    topicTags: ['smart-city', 'digital-twin'],
    difficulty: 'advanced',
  },
  {
    caseId: 'c1000007-0000-0000-0000-000000000001',
    primaryTheme: 'innovation',
    secondaryThemes: ['entrepreneurship'],
    topicTags: ['climatetech', 'energy'],
    difficulty: 'advanced',
  },
  {
    caseId: 'd1000003-0000-0000-0000-000000000001',
    primaryTheme: 'innovation',
    secondaryThemes: ['management'],
    topicTags: ['agtech', 'data-platform'],
    difficulty: 'advanced',
  },
  {
    caseId: 'a1000001-0001-0001-0005-000000000001',
    primaryTheme: 'innovation',
    secondaryThemes: ['management', 'ai'],
    topicTags: ['smart-city', 'bulgaria', 'data'],
    difficulty: 'advanced',
  },
  {
    caseId: 'd1000003-0000-0000-0000-000000000002',
    primaryTheme: 'innovation',
    secondaryThemes: ['entrepreneurship'],
    topicTags: ['agtech', 'vertical-farming'],
    difficulty: 'intermediate',
  },
  {
    caseId: 'd1000002-0000-0000-0000-000000000002',
    primaryTheme: 'innovation',
    secondaryThemes: ['entrepreneurship'],
    topicTags: ['wearables', 'health-data', 'privacy'],
    difficulty: 'beginner',
  },
  {
    caseId: 'c1000008-0000-0000-0000-000000000001',
    primaryTheme: 'innovation',
    secondaryThemes: ['ai', 'entrepreneurship'],
    topicTags: ['edtech', 'ai', 'personalization'],
    difficulty: 'intermediate',
  },

  // ── Marketing (primary) ────────────────────────────────────────────────────
  {
    caseId: 'd1000005-0000-0000-0000-000000000002',
    primaryTheme: 'marketing',
    secondaryThemes: ['entrepreneurship'],
    topicTags: ['social-commerce', 'tiktok'],
    difficulty: 'beginner',
  },
  {
    caseId: 'd1000004-0000-0000-0000-000000000002',
    primaryTheme: 'marketing',
    secondaryThemes: ['entrepreneurship'],
    topicTags: ['experience-economy', 'tourism'],
    difficulty: 'beginner',
  },
  {
    caseId: 'd1000004-0000-0000-0000-000000000001',
    primaryTheme: 'marketing',
    secondaryThemes: ['management'],
    topicTags: ['pricing', 'revenue-management', 'tourism'],
    difficulty: 'intermediate',
  },

  // ── Management (primary) ───────────────────────────────────────────────────
  {
    caseId: 'd1000005-0000-0000-0000-000000000001',
    primaryTheme: 'management',
    secondaryThemes: ['innovation'],
    topicTags: ['supply-chain', 'fast-fashion', 'operations'],
    difficulty: 'intermediate',
    caseUseNotes: 'Zara — operations and supply chain, not core entrepreneurship.',
  },
  {
    caseId: 'a1000001-0001-0001-0004-000000000001',
    primaryTheme: 'management',
    secondaryThemes: ['innovation'],
    topicTags: ['industry-4', 'smart-factory'],
    difficulty: 'intermediate',
  },
  {
    caseId: 'c1000005-0000-0000-0000-000000000001',
    primaryTheme: 'management',
    secondaryThemes: ['innovation'],
    topicTags: ['manufacturing', 'tesla'],
    difficulty: 'advanced',
  },
  {
    caseId: 'a1000001-0000-0000-0000-000000000001',
    primaryTheme: 'management',
    secondaryThemes: ['marketing', 'innovation'],
    topicTags: ['retail', 'transformation'],
    difficulty: 'intermediate',
  },
  {
    caseId: 'd1000001-0000-0000-0000-000000000001',
    primaryTheme: 'management',
    secondaryThemes: ['entrepreneurship', 'marketing'],
    topicTags: ['marketplace', 'trust', 'two-sided'],
    difficulty: 'intermediate',
  },
  {
    caseId: 'd1000001-0000-0000-0000-000000000002',
    primaryTheme: 'management',
    secondaryThemes: ['marketing'],
    topicTags: ['delivery', 'platform-competition'],
    difficulty: 'advanced',
  },
  {
    caseId: 'a1000001-0000-0000-0000-000000000002',
    primaryTheme: 'management',
    secondaryThemes: ['innovation'],
    topicTags: ['healthcare', 'digital-hospital'],
    difficulty: 'intermediate',
  },
  {
    caseId: 'd1000002-0000-0000-0000-000000000001',
    primaryTheme: 'management',
    secondaryThemes: ['innovation'],
    topicTags: ['telemedicine', 'scaling'],
    difficulty: 'intermediate',
  },
  {
    caseId: 'd1000004-0000-0000-0000-000000000003',
    primaryTheme: 'management',
    secondaryThemes: ['innovation'],
    topicTags: ['tourism', 'sustainability'],
    difficulty: 'advanced',
  },

  // ── AI (primary) ───────────────────────────────────────────────────────────
  {
    caseId: 'c1000004-0000-0000-0000-000000000001',
    primaryTheme: 'ai',
    secondaryThemes: ['entrepreneurship', 'management'],
    topicTags: ['ai-ethics', 'bias', 'startup'],
    difficulty: 'advanced',
  },
  {
    caseId: 'c1000006-0000-0000-0000-000000000001',
    primaryTheme: 'ai',
    secondaryThemes: ['innovation'],
    topicTags: ['algorithm', 'recommendation', 'spotify'],
    difficulty: 'intermediate',
  },
  {
    caseId: 'a1000001-0000-0000-0000-000000000003',
    primaryTheme: 'ai',
    secondaryThemes: ['innovation', 'entrepreneurship'],
    topicTags: ['fintech', 'ai'],
    difficulty: 'intermediate',
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

/** UUID v4-ish shape check — the production `case_studies.id` format. */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isProductionCaseId(caseId: string): boolean {
  return UUID_RE.test(caseId);
}

/** All tags for the Entrepreneurship ladder at a given level. */
export function entrepreneurshipCasesAtLevel(
  level: CaseDifficulty,
): CaseThemeTag[] {
  return CASE_THEME_TAGS.filter(
    (t) =>
      t.primaryTheme === 'entrepreneurship' &&
      t.entrepreneurshipLevel === level,
  );
}

/** All Entrepreneurship tags that cover a given module. */
export function casesForEntrepreneurshipModule(
  moduleId: EntrepreneurshipModuleId,
): CaseThemeTag[] {
  return CASE_THEME_TAGS.filter((t) => (t.moduleFit ?? []).includes(moduleId));
}
