/**
 * useModuleCatalog — shared module registry
 * -----------------------------------------
 * Single source used by TeacherClassroom (assignment picker),
 * LearningModules (My Subjects hub) and SubjectDetail. Merges the
 * static `LEARNING_MODULES` registry with the Supabase
 * `learning_modules` rows by stable slug, so a module added to the DB
 * for a subject shows up consistently everywhere.
 *
 * Canonical fields (from Supabase when present):
 *   - id            → module DB id (undefined for static-only)
 *   - slug          → stable slug
 *   - subject_key   → prefers DB value, falls back to static
 *   - display_order → prefers DB value, then static
 *
 * Rich content (theory, quiz, embedded case, sim decision) always
 * comes from the static registry — the DB row is treated as metadata,
 * not as a replacement for the rich player content.
 */

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  LEARNING_MODULES,
  LEGACY_MODULE_SUBJECT_KEY,
  type LearningModule,
} from '@/data/learning-modules';

export interface CatalogModule {
  slug: string;
  dbId: string | null;
  title_en: string;
  title_bg: string;
  subject_key: string;
  display_order: number;
  /** True when rich static content backs this module (theory, quiz, cases). */
  hasRichContent: boolean;
  /** True when a Supabase row exists. Draft = static only, not registered. */
  registered: boolean;
  /** Static definition, when available. */
  staticModule: LearningModule | null;
}

interface DbModuleRow {
  id: string;
  slug: string;
  title_en: string | null;
  title_bg: string | null;
  subject_key: string | null;
  display_order: number | null;
}

function mergeModules(
  staticMods: readonly LearningModule[],
  dbMods: readonly DbModuleRow[],
): CatalogModule[] {
  const bySlug = new Map<string, CatalogModule>();

  for (const s of staticMods) {
    bySlug.set(s.slug, {
      slug: s.slug,
      dbId: null,
      title_en: s.title_en,
      title_bg: s.title_bg,
      subject_key: s.subject_key || LEGACY_MODULE_SUBJECT_KEY,
      display_order: s.display_order ?? 999,
      hasRichContent: true,
      registered: false,
      staticModule: s,
    });
  }

  for (const d of dbMods) {
    const existing = bySlug.get(d.slug);
    if (existing) {
      // DB is canonical for id/subject_key/order; keep static rich content.
      bySlug.set(d.slug, {
        ...existing,
        dbId: d.id,
        registered: true,
        subject_key: d.subject_key || existing.subject_key,
        display_order: d.display_order ?? existing.display_order,
        title_en: d.title_en ?? existing.title_en,
        title_bg: d.title_bg ?? existing.title_bg,
      });
    } else {
      // DB-only module — no rich content yet. Show honestly.
      bySlug.set(d.slug, {
        slug: d.slug,
        dbId: d.id,
        title_en: d.title_en ?? d.slug,
        title_bg: d.title_bg ?? d.slug,
        subject_key: d.subject_key || LEGACY_MODULE_SUBJECT_KEY,
        display_order: d.display_order ?? 999,
        hasRichContent: false,
        registered: true,
        staticModule: null,
      });
    }
  }

  return Array.from(bySlug.values()).sort(
    (a, b) => a.display_order - b.display_order,
  );
}

/** Pure helper for tests & callers that already have both sources. */
export function buildCatalog(
  staticMods: readonly LearningModule[],
  dbMods: readonly DbModuleRow[],
): CatalogModule[] {
  return mergeModules(staticMods, dbMods);
}

export function useModuleCatalog() {
  const [dbRows, setDbRows] = useState<DbModuleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error: err } = await supabase
          .from('learning_modules')
          .select('id, slug, title_en, title_bg, subject_key, display_order' as any);
        if (cancelled) return;
        if (err) throw err;
        setDbRows(((data ?? []) as unknown) as DbModuleRow[]);
      } catch (e: any) {
        if (cancelled) return;
        // eslint-disable-next-line no-console
        console.error('[useModuleCatalog]', e);
        setError(e?.message ?? 'Failed to load module catalog');
        setDbRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const catalog = useMemo(
    () => mergeModules(LEARNING_MODULES, dbRows),
    [dbRows],
  );
  const bySlug = useMemo(() => {
    const m = new Map<string, CatalogModule>();
    for (const c of catalog) m.set(c.slug, c);
    return m;
  }, [catalog]);
  const forSubject = useMemo(
    () => (key: string) => catalog.filter((c) => c.subject_key === key),
    [catalog],
  );

  return { catalog, bySlug, forSubject, loading, error };
}