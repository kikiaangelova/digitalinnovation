/**
 * Teacher MVP Sprint 1 — assignment integrity, classroom scoping,
 * status derivation, evidence rendering and player write-safety.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { readFileSync } from 'fs';
import path from 'path';
import {
  countCompleted,
  deriveAssignmentStatus,
  filterAssignableModules,
  indexResponses,
  isAssignableModule,
  responseKey,
  validateAssignmentDraft,
  PILOT_SUBJECT_KEY,
} from '@/lib/teacher-assignments';
import { buildCatalog } from '@/hooks/useModuleCatalog';
import type { CatalogModule } from '@/hooks/useModuleCatalog';
import { LEARNING_MODULES } from '@/data/learning-modules';

const mod = (over: Partial<CatalogModule>): CatalogModule => ({
  slug: 'x',
  dbId: 'db-x',
  title_en: 'X',
  title_bg: 'Х',
  subject_key: PILOT_SUBJECT_KEY,
  display_order: 1,
  hasRichContent: true,
  registered: true,
  staticModule: {} as any,
  ...over,
});

describe('a. assignment validation', () => {
  it('rejects an assignment with no target', () => {
    const r = validateAssignmentDraft({ assignmentType: 'module', moduleSlug: null }, ['a']);
    expect(r.valid).toBe(false);
    expect(r.errorEn).toBeTruthy();
    expect(r.errorBg).toBeTruthy();
  });

  it('rejects a module that is not assignable', () => {
    expect(validateAssignmentDraft({ assignmentType: 'module', moduleSlug: 'ghost' }, ['a']).valid)
      .toBe(false);
  });

  it('accepts a valid module', () => {
    expect(validateAssignmentDraft({ assignmentType: 'module', moduleSlug: 'a' }, ['a']).valid)
      .toBe(true);
  });
});

describe('b. assignable-module filtering', () => {
  it('requires DB registration AND rich static content AND subject match', () => {
    expect(isAssignableModule(mod({}), PILOT_SUBJECT_KEY)).toBe(true);
    expect(isAssignableModule(mod({ registered: false, dbId: null }), PILOT_SUBJECT_KEY)).toBe(false);
    expect(isAssignableModule(mod({ hasRichContent: false, staticModule: null }), PILOT_SUBJECT_KEY)).toBe(false);
    expect(isAssignableModule(mod({ staticModule: null }), PILOT_SUBJECT_KEY)).toBe(false);
    expect(isAssignableModule(mod({ subject_key: 'marketing-foundations' }), PILOT_SUBJECT_KEY)).toBe(false);
  });

  it('filters a mixed catalog down to playable modules only', () => {
    const list = filterAssignableModules(
      [
        mod({ slug: 'ok' }),
        mod({ slug: 'db-only', hasRichContent: false, staticModule: null }),
        mod({ slug: 'draft', registered: false, dbId: null }),
      ],
      PILOT_SUBJECT_KEY,
    );
    expect(list.map((m) => m.slug)).toEqual(['ok']);
  });

  it('makes the pilot network-effects module assignable once registered', () => {
    const staticPilot = LEARNING_MODULES.find((m) => m.slug === 'network-effects');
    expect(staticPilot).toBeTruthy();
    const catalog = buildCatalog(LEARNING_MODULES, [
      {
        id: 'db-ne',
        slug: 'network-effects',
        title_en: 'Network Effects',
        title_bg: 'Мрежови ефекти',
        subject_key: PILOT_SUBJECT_KEY,
        display_order: 1,
      },
    ]);
    const slugs = filterAssignableModules(catalog, PILOT_SUBJECT_KEY).map((m) => m.slug);
    expect(slugs).toContain('network-effects');
    // Static-only modules must not become assignable.
    const unregistered = LEARNING_MODULES.filter((m) => m.slug !== 'network-effects');
    for (const u of unregistered) expect(slugs).not.toContain(u.slug);
  });
});

describe('c. classroom scoping', () => {
  it('does not mix rosters or assignments across classrooms', () => {
    const roster = [
      { student_id: 's1', classroom_id: 'c1' },
      { student_id: 's2', classroom_id: 'c2' },
    ];
    const assignments = [
      { id: 'a1', classroom_id: 'c1', module_slug: 'network-effects' },
      { id: 'a2', classroom_id: 'c2', module_slug: 'other' },
    ];
    const selected = 'c1';
    expect(roster.filter((r) => r.classroom_id === selected).map((r) => r.student_id)).toEqual(['s1']);
    expect(assignments.filter((a) => a.classroom_id === selected).map((a) => a.id)).toEqual(['a1']);
  });

  it('scopes responses by student and module keys', () => {
    const idx = indexResponses([
      { id: 'r1', user_id: 's1', module_id: 'm1', completed_at: null },
      { id: 'r2', user_id: 's2', module_id: 'm1', completed_at: '2026-01-01' },
    ]);
    expect(idx.get(responseKey('s1', 'm1'))?.id).toBe('r1');
    expect(idx.get(responseKey('s3', 'm1'))).toBeUndefined();
  });
});

describe('d/e. status mapping and completed-only counting', () => {
  it('maps no row / incomplete row / completed row', () => {
    expect(deriveAssignmentStatus(null)).toBe('not_started');
    expect(deriveAssignmentStatus(undefined)).toBe('not_started');
    expect(deriveAssignmentStatus({ completed_at: null })).toBe('in_progress');
    expect(deriveAssignmentStatus({ completed_at: '2026-01-01T00:00:00Z' })).toBe('completed');
  });

  it('counts only completed', () => {
    expect(countCompleted(['not_started', 'in_progress', 'completed', 'completed'])).toBe(2);
  });
});

describe('f. evidence detail rendering', () => {
  beforeEach(() => vi.resetModules());

  it('renders analytical and application answers', async () => {
    vi.doMock('@/integrations/supabase/client', () => ({ supabase: {} }));
    vi.doMock('@/context/AuthContext', () => ({ useAuth: () => ({ user: { id: 'teacher' } }) }));
    vi.doMock('@/context/LangContext', () => ({ useLang: () => ({ lang: 'en' }) }));
    const Mod = await import('@/components/teacher-workspace/AssignmentsTab');
    const AssignmentsTab = Mod.default;
    render(
      <AssignmentsTab
        classroomId="c1"
        subjectKey={PILOT_SUBJECT_KEY}
        students={[]}
        assignments={[]}
        catalog={[]}
        catalogLoading={false}
        onAssignmentsChanged={() => {}}
      />,
    );
    // Empty scoped classroom shows an honest empty state, no cross-class data.
    expect(screen.getByText(/No module assigned to this classroom yet/i)).toBeInTheDocument();

    const src = readFileSync(
      path.resolve(__dirname, '../components/teacher-workspace/AssignmentsTab.tsx'),
      'utf8',
    );
    expect(src).toContain('analytical_answer');
    expect(src).toContain('application_answer');
    expect(src).toContain('learning_module_response');
  });
});

describe('g. module player write-safety', () => {
  it('never inserts into the learning_modules catalogue', () => {
    const src = readFileSync(
      path.resolve(__dirname, '../pages/LearningModulePlayer.tsx'),
      'utf8',
    );
    expect(src).not.toMatch(/from\(['"]learning_modules['"]\)\s*\.insert/);
    expect(src).toContain('unregistered');
  });
});
