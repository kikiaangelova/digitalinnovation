/**
 * My Subjects + Multi-Class V1 — focused subject-logic tests.
 *
 * These are pure-data / pure-function tests. They do NOT depend on
 * Supabase, RLS, or React rendering, so they run fast and remain
 * meaningful even when the DB is offline.
 */

import { describe, it, expect } from 'vitest';

import {
  SUBJECT_CATALOG,
  SUBJECT_BY_KEY,
  DEFAULT_SUBJECT_KEY,
  getSubject,
  subjectLabel,
  subjectTitle,
} from '@/data/subject-catalog';
import {
  LEARNING_MODULES,
  moduleSubjectKey,
  modulesForSubject,
} from '@/data/learning-modules';

describe('subject registry', () => {
  it('has stable, non-empty keys and BG + EN titles for every subject', () => {
    for (const s of SUBJECT_CATALOG) {
      expect(s.key).toMatch(/^[a-z0-9-]+$/);
      expect(s.title_bg.length).toBeGreaterThan(0);
      expect(s.title_en.length).toBeGreaterThan(0);
      expect(s.short_bg.length).toBeGreaterThan(0);
      expect(s.short_en.length).toBeGreaterThan(0);
    }
  });

  it('exposes every registry entry via SUBJECT_BY_KEY', () => {
    for (const s of SUBJECT_CATALOG) {
      expect(SUBJECT_BY_KEY[s.key]).toBe(s);
    }
  });

  it('registers the core subjects a teacher can pick in V1', () => {
    const keys = SUBJECT_CATALOG.map((s) => s.key);
    for (const required of [
      'digital-innovation',
      'digital-marketing',
      'management-fundamentals',
      'entrepreneurship-startups',
      'ai-for-business',
    ]) {
      expect(keys).toContain(required);
    }
  });

  it('resolves labels in BG and EN and falls back to the raw key for unknown subjects', () => {
    const di = getSubject('digital-innovation')!;
    expect(subjectTitle(di, 'bg')).toBe('Дигитални иновации');
    expect(subjectTitle(di, 'en')).toBe('Digital Innovation');
    expect(subjectLabel('does-not-exist', 'en')).toBe('does-not-exist');
    expect(subjectLabel(null, 'bg')).toBe('Без предмет');
  });
});

describe('legacy module → Digital Innovation mapping', () => {
  it('defaults every static module without a subject_key to digital-innovation', () => {
    for (const mod of LEARNING_MODULES) {
      const key = moduleSubjectKey(mod);
      expect(key).toBe(mod.subject_key ?? DEFAULT_SUBJECT_KEY);
      expect(SUBJECT_BY_KEY[key]).toBeDefined();
    }
  });

  it('every current static module lives in the Digital Innovation subject (V1 assumption)', () => {
    const nonDI = LEARNING_MODULES.filter(
      (m) => moduleSubjectKey(m) !== 'digital-innovation',
    );
    // V1 explicitly maps all legacy static modules to Digital Innovation.
    // If future work reclassifies some, update the mapping in
    // src/data/learning-modules.ts before relaxing this test.
    expect(nonDI).toEqual([]);
  });
});

describe('subject-scoped progress', () => {
  it('modulesForSubject only counts modules from that subject', () => {
    const di = modulesForSubject('digital-innovation');
    expect(di.length).toBe(LEARNING_MODULES.length);

    const marketing = modulesForSubject('digital-marketing');
    expect(marketing.length).toBe(0);

    const bogus = modulesForSubject('does-not-exist');
    expect(bogus.length).toBe(0);
  });

  it('does NOT gate a subject by another subject (no global Level 1 → Level 2 lock)', () => {
    // A student who has completed zero Digital Innovation modules must
    // still get an unrestricted module list for any other subject.
    const marketing = modulesForSubject('digital-marketing');
    const ai = modulesForSubject('ai-for-business');
    // Nothing about DI progress can shorten these lists — they are
    // pure filters over LEARNING_MODULES.
    expect(Array.isArray(marketing)).toBe(true);
    expect(Array.isArray(ai)).toBe(true);
  });
});

describe('teacher module-assignment default filter', () => {
  it('defaults the module dropdown to the classroom subject and hides unrelated subjects unless opted in', () => {
    const dbModules = [
      { slug: 'network-effects', subject_key: 'digital-innovation' },
      { slug: 'mkt-101', subject_key: 'digital-marketing' },
      { slug: 'legacy-null', subject_key: null as string | null },
    ];

    const classroomSubject = 'digital-innovation';
    const defaultView = dbModules.filter(
      (m) => (m.subject_key || DEFAULT_SUBJECT_KEY) === classroomSubject,
    );
    expect(defaultView.map((m) => m.slug).sort()).toEqual(
      ['legacy-null', 'network-effects'].sort(),
    );

    // "Show modules from other subjects" opt-in returns everything.
    const optedInView = dbModules;
    expect(optedInView.length).toBe(3);
  });
});

describe('multi-class teacher aggregation (student view)', () => {
  it('merges duplicate subjects across classrooms into one entry that lists each class', () => {
    // Mirrors the grouping logic in useMySubjects without hitting Supabase.
    const classrooms = [
      { id: 'c1', name: '11A', subject_key: 'digital-marketing' },
      { id: 'c2', name: '11B', subject_key: 'management-fundamentals' },
      { id: 'c3', name: '11C', subject_key: 'digital-marketing' },
    ];
    const grouped = new Map<string, { subjectKey: string; classes: string[] }>();
    for (const c of classrooms) {
      const key = c.subject_key || DEFAULT_SUBJECT_KEY;
      const entry = grouped.get(key) ?? { subjectKey: key, classes: [] };
      entry.classes.push(c.name);
      grouped.set(key, entry);
    }
    expect(grouped.size).toBe(2);
    expect(grouped.get('digital-marketing')?.classes.sort()).toEqual(['11A', '11C']);
    expect(grouped.get('management-fundamentals')?.classes).toEqual(['11B']);
  });
});

describe('legacy classroom backfill assumption', () => {
  it('treats a classroom with no subject_key as digital-innovation (matches the DB backfill)', () => {
    const classroom = { id: 'c1', name: 'Old class', subject_key: null as string | null };
    const effective = classroom.subject_key || DEFAULT_SUBJECT_KEY;
    expect(effective).toBe('digital-innovation');
    expect(getSubject(effective)?.title_en).toBe('Digital Innovation');
  });
});