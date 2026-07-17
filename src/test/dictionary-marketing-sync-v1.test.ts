/**
 * Dictionary Marketing Sync V1 — verifies that every concept referenced by
 * the Digital Marketing practice-first modules 1–6 exists in the shared
 * dictionary with correct governance metadata.
 */

import { describe, it, expect } from 'vitest';

import { TERMS, type DictionaryTerm } from '@/data/dictionary-terms';
import { MARKETING_MODULES } from '@/data/practice-first-content';

function get(name: string): DictionaryTerm | undefined {
  return TERMS.find((t) => t.term === name);
}

describe('Dictionary Marketing Sync V1 — modules 1–6', () => {
  const referenced = Array.from(
    new Set(MARKETING_MODULES.flatMap((m) => m.dictionaryConcepts)),
  );

  it('every referenced concept has a matching dictionary entry', () => {
    const missing = referenced.filter((c) => !get(c));
    expect(missing).toEqual([]);
  });

  it('no duplicate dictionary entries by English term', () => {
    const counts = new Map<string, number>();
    for (const t of TERMS) counts.set(t.term, (counts.get(t.term) ?? 0) + 1);
    const dupes = [...counts.entries()].filter(([, n]) => n > 1).map(([k]) => k);
    expect(dupes).toEqual([]);
  });

  it('newly added marketing terms carry correct governance metadata', () => {
    const newMarketingTerms = [
      'Brand',
      'Brand Promise',
      'Brand Identity',
      'Tone of Voice',
      'Slogan',
      'Key Message',
      'AI-assisted Content',
      'Human Oversight',
      'Marketing Content',
      'Content Strategy',
      'Content Pillar',
      'Hook',
      'Call to Action',
      'Proof',
      'Carousel',
      'Short-form Video',
      'Educational Post',
      'Platform Fit',
      'Content Calendar',
      'Marketing Channel',
      'Organic Channel',
      'Paid Channel',
      'Instagram Marketing',
      'TikTok Marketing',
      'LinkedIn Marketing',
      'Facebook Marketing',
      'Meta Ads',
      'Channel Strategy',
      'Audience Segment',
      'Campaign Objective',
      'Engagement',
      'Reach',
      'Marketing Plan',
      'Marketing Goal',
      'Segmentation',
      'Targeting',
      'Persona',
      'Resource Planning',
      'Timeline',
      'KPI',
      'Marketing Risk',
      'Marketing Budget',
      'Marketing Campaign',
      'Promo Code',
      'Referral Code',
      'Campaign Code',
      'Coupon Code',
      'UTM',
      'Tracking Link',
      'CTR',
      'CPA',
      'CLV',
      'ROI',
      'Lead',
      'Remarketing',
      'Optimization',
      'Search Query',
      'AIO',
      'AEO',
      'GEO',
      'AI Visibility',
      'AI Overview',
      'AI Mode',
      'Zero-click Search',
      'Structured Content',
      'Internal Linking',
      'Schema Markup',
      'Crawlability',
      'Indexability',
      'Helpful Content',
      'Cite-worthy Content',
      'Source Credibility',
    ];
    for (const name of newMarketingTerms) {
      const t = get(name);
      expect(t, `missing term ${name}`).toBeTruthy();
      expect(t!.learningAreaId).toBe('marketing');
      expect(t!.required).toBe(true);
      expect(t!.reviewStatus).toBe('needs_review');
      expect(t!.sourceStatus).toBe('not_checked');
      expect(t!.termBg.trim().length).toBeGreaterThan(0);
      expect(t!.definition.trim().length).toBeGreaterThan(20);
      expect(t!.definitionBg.trim().length).toBeGreaterThan(20);
      expect(t!.reviewStatus).not.toBe('educator_approved');
    }
  });

  it('AIO/AEO/GEO/AI Visibility/AI Overview/AI Mode do not promise guaranteed AI ranking', () => {
    const forbidden = [
      'guaranteed ranking',
      'guaranteed to appear',
      'guaranteed placement',
      'ai hack',
      'seo hack',
      'magic formula',
      'trick to rank',
      'hack the algorithm',
    ];
    for (const name of ['AIO', 'AEO', 'GEO', 'AI Visibility', 'AI Overview', 'AI Mode']) {
      const t = get(name)!;
      const blob = `${t.definition} ${t.definitionBg}`.toLowerCase();
      for (const f of forbidden) expect(blob).not.toContain(f);
    }
  });
});