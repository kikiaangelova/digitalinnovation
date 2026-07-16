/**
 * Content Structure V1 — theme registry, Kiki mentor copy,
 * and case tag hygiene tests.
 */
import { describe, it, expect } from 'vitest';

import {
  LEARNING_THEMES,
  THEME_ORDER,
  SKILL_OUTCOME_FAMILIES,
  themeById,
  type ThemeId,
} from '@/data/content-structure';
import { LEARNING_AREAS } from '@/data/learning-areas';
import { KIKI, KIKI_PERSONA_PROMPT } from '@/lib/kiki-persona';
import {
  CASE_THEME_TAGS,
  caseReviewStatus,
  casesForTheme,
} from '@/data/case-theme-tags';

describe('content structure — 5 learning themes', () => {
  it('exposes exactly the 5 approved themes in the approved order', () => {
    expect(LEARNING_THEMES).toHaveLength(5);
    expect(LEARNING_THEMES.map((t) => t.id)).toEqual([
      'entrepreneurship',
      'innovation',
      'marketing',
      'management',
      'ai',
    ]);
    expect(THEME_ORDER).toEqual(LEARNING_THEMES.map((t) => t.id));
  });

  it('does NOT expose Skills as a learning theme', () => {
    const ids: string[] = LEARNING_THEMES.map((t) => t.id);
    expect(ids).not.toContain('skills' as ThemeId);
    // Skills only surfaces as an outcome family, not as a theme card.
    expect(SKILL_OUTCOME_FAMILIES.length).toBeGreaterThan(0);
  });

  it('uses "критично мислене" (never "критическо мислене") for the Skills outcome family', () => {
    const bg = SKILL_OUTCOME_FAMILIES.map((f) => f.bg).join(' | ');
    expect(bg).toMatch(/критично мислене/i);
    expect(bg).not.toMatch(/критическо мислене/i);
  });

  it('links each theme to an existing learning area', () => {
    const areaIds = new Set(LEARNING_AREAS.map((a) => a.id));
    for (const theme of LEARNING_THEMES) {
      expect(areaIds.has(theme.learningAreaId), `theme ${theme.id} -> unknown area`).toBe(true);
    }
  });

  it('places Digital Marketing under the Marketing theme (not a separate theme)', () => {
    const marketing = themeById('marketing');
    expect(marketing).toBeTruthy();
    const bg = marketing!.topics.map((t) => t.bg).join(' | ').toLowerCase();
    const en = marketing!.topics.map((t) => t.en).join(' | ').toLowerCase();
    expect(bg + ' ' + en).toMatch(/digital|дигитал/);
  });

  it('places Agile under Project Management (Management theme)', () => {
    const mgmt = themeById('management');
    expect(mgmt).toBeTruthy();
    const en = mgmt!.topics.map((t) => t.en).join(' | ').toLowerCase();
    expect(en).toMatch(/project management/);
    expect(en).toMatch(/agile \(under project management\)/);
  });

  it('places Scrum under Agile / Project Management', () => {
    const mgmt = themeById('management');
    const en = mgmt!.topics.map((t) => t.en).join(' | ').toLowerCase();
    expect(en).toMatch(/scrum \(under agile\)/);
  });

  it('places Sports innovation under Innovation, not as a top-level theme', () => {
    const ids: string[] = LEARNING_THEMES.map((t) => t.id);
    expect(ids).not.toContain('sports' as ThemeId);
    const innovation = themeById('innovation');
    const en = innovation!.topics.map((t) => t.en).join(' | ').toLowerCase();
    expect(en).toMatch(/sports innovation/);
  });

  it('every theme declares practice-first modes (never just theory)', () => {
    for (const theme of LEARNING_THEMES) {
      expect(theme.practiceTypes.length, `theme ${theme.id} needs practice modes`).toBeGreaterThanOrEqual(3);
      // Must include at least one truly practice-oriented mode.
      expect(theme.practiceTypes.some((p) =>
        ['case_study', 'decision_task', 'experiment', 'mvp_build', 'project'].includes(p),
      )).toBe(true);
    }
  });
});

describe('Kiki mentor copy — not a generic chatbot', () => {
  it('greeting frames Kiki as a mentor, not an "ask anything" chatbot', () => {
    for (const greeting of [KIKI.greetingEn, KIKI.greetingBg]) {
      expect(greeting.toLowerCase()).not.toMatch(/ask (me )?anything|питаш всичко|питай всичко/);
    }
    // Positive framing must be present.
    expect(KIKI.greetingEn.toLowerCase()).toMatch(/mentor/);
    expect(KIKI.greetingBg.toLowerCase()).toMatch(/ментор/);
    expect(KIKI.greetingEn.toLowerCase()).toMatch(/will not do the work/);
    expect(KIKI.greetingBg).toMatch(/няма да върша работата/i);
  });

  it('persona prompt enforces mentor role, not chatbot', () => {
    expect(KIKI_PERSONA_PROMPT).toMatch(/mentor/i);
    expect(KIKI_PERSONA_PROMPT).toMatch(/not (a )?generic .*chatbot/i);
    expect(KIKI_PERSONA_PROMPT).toMatch(/final answers for graded work/i);
    expect(KIKI_PERSONA_PROMPT).toMatch(/assumption/i);
  });
});

describe('case theme tags', () => {
  it('every seeded case tag points at a known theme id', () => {
    const ids = new Set<string>(THEME_ORDER);
    for (const tag of CASE_THEME_TAGS) {
      expect(ids.has(tag.primaryTheme)).toBe(true);
      for (const s of tag.secondaryThemes ?? []) expect(ids.has(s)).toBe(true);
    }
  });

  it('no seeded case is marked educator_approved automatically', () => {
    for (const tag of CASE_THEME_TAGS) {
      expect(tag.reviewStatus ?? 'needs_content_review').not.toBe('educator_approved');
    }
  });

  it('unknown case ids default to needs_content_review', () => {
    expect(caseReviewStatus('does-not-exist-123')).toBe('needs_content_review');
    expect(caseReviewStatus(null)).toBe('needs_content_review');
  });

  it('every theme has at least one seeded case reference', () => {
    for (const theme of LEARNING_THEMES) {
      const cases = casesForTheme(theme.id);
      expect(cases.length, `theme ${theme.id} needs case tags`).toBeGreaterThan(0);
    }
  });
});
