/**
 * Sprint 1 QA regressions:
 *  1. useClassroomStudents refetches when the selected classroom changes
 *  2. duplicate assignment rows render one progress card
 *  3. the unavailable module player links back to /learn
 *  4. existing teacher feedback is loaded and saved as an update
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, renderHook } from '@testing-library/react';
import { readFileSync } from 'fs';
import path from 'path';
import { dedupeModulesByIdentity, PILOT_SUBJECT_KEY } from '@/lib/teacher-assignments';
import type { CatalogModule } from '@/hooks/useModuleCatalog';

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

const student = (id: string, name: string) => ({
  membership_id: `m-${id}`,
  student_id: id,
  joined_at: '',
  display_name: name,
  full_name: null,
  avatar_url: null,
  total_xp: 0,
  updated_at: '',
});

/* ---------------- 1. classroom refetch ---------------- */

describe('1. useClassroomStudents reacts to classroom changes', () => {
  beforeEach(() => vi.resetModules());

  it('queries the new classroom id and swaps the roster', async () => {
    const classroomIdsQueried: string[] = [];
    const DATA: Record<string, { name: string; students: { id: string; name: string }[] }> = {
      c1: { name: 'Class One', students: [{ id: 's1', name: 'Ани' }] },
      c2: { name: 'Class Two', students: [{ id: 's2', name: 'Боян' }] },
    };
    let current = 'c1';

    const supabase = {
      from(table: string) {
        if (table === 'classrooms') {
          const q: any = {
            select: () => q,
            eq: (col: string, val: string) => {
              if (col === 'id') {
                classroomIdsQueried.push(val);
                current = val;
              }
              return q;
            },
            order: () => q,
            limit: () =>
              Promise.resolve({
                data: [{ id: current, name: DATA[current].name, class_code: 'X', invite_link: null, is_active: true, created_at: '', subject_key: PILOT_SUBJECT_KEY }],
                error: null,
              }),
          };
          return q;
        }
        if (table === 'classroom_students') {
          const q: any = {
            select: () => q,
            eq: (_c: string, val: string) =>
              Promise.resolve({
                data: DATA[val].students.map((s) => ({ id: `m-${s.id}`, student_id: s.id, joined_at: '' })),
                error: null,
              }),
          };
          return q;
        }
        const q: any = {
          select: () => q,
          in: (_c: string, ids: string[]) =>
            Promise.resolve({
              data: ids.map((id) => ({
                user_id: id,
                display_name: DATA[current].students.find((s) => s.id === id)?.name ?? id,
                full_name: null,
                avatar_url: null,
                total_xp: 0,
                updated_at: '',
              })),
              error: null,
            }),
        };
        return q;
      },
    };

    vi.doMock('@/integrations/supabase/client', () => ({ supabase }));
    vi.doMock('@/context/AuthContext', () => ({ useAuth: () => ({ user: { id: 'teacher' } }) }));

    const { useClassroomStudents } = await import('@/hooks/useClassroomStudents');
    const { result, rerender } = renderHook(
      ({ id }: { id: string }) => useClassroomStudents(id),
      { initialProps: { id: 'c1' } },
    );

    await waitFor(() => expect(result.current.students.map((s) => s.student_id)).toEqual(['s1']));
    expect(classroomIdsQueried).toContain('c1');

    rerender({ id: 'c2' });
    await waitFor(() => expect(result.current.students.map((s) => s.student_id)).toEqual(['s2']));
    expect(classroomIdsQueried).toContain('c2');
    expect(result.current.classroom?.name).toBe('Class Two');
  });
});

/* ---------------- 2. duplicate assignments ---------------- */

describe('2. duplicate assignments collapse into one progress card', () => {
  beforeEach(() => vi.resetModules());

  it('dedupes by stable module identity', () => {
    const list = [mod({ slug: 'a', dbId: 'db-a' }), mod({ slug: 'a', dbId: 'db-a' }), mod({ slug: 'b', dbId: 'db-b' })];
    expect(dedupeModulesByIdentity(list).map((m) => m.slug)).toEqual(['a', 'b']);
  });

  it('renders a single card for two identical assignment rows', async () => {
    vi.doMock('@/integrations/supabase/client', () => ({ supabase: {} }));
    vi.doMock('@/context/AuthContext', () => ({ useAuth: () => ({ user: { id: 'teacher' } }) }));
    vi.doMock('@/context/LangContext', () => ({ useLang: () => ({ lang: 'en' }) }));
    vi.doMock('@/hooks/useModuleResponses', () => ({
      useModuleResponses: () => ({ responses: [], loading: false, error: null, refresh: () => {} }),
    }));
    const AssignmentsTab = (await import('@/components/teacher-workspace/AssignmentsTab')).default;
    const row = (id: string) => ({
      id, assignment_type: 'module', journey_stage: null, case_id: null,
      module_slug: 'network-effects', note: null, due_date: null, created_at: '',
    });
    render(
      <AssignmentsTab
        classroomId="c1"
        subjectKey={PILOT_SUBJECT_KEY}
        students={[student('s1', 'Ани')]}
        assignments={[row('a1'), row('a2')] as any}
        catalog={[mod({ slug: 'network-effects', dbId: 'db-ne', title_en: 'Network Effects' })]}
        catalogLoading={false}
        onAssignmentsChanged={() => {}}
      />,
    );
    expect(screen.getAllByRole('heading', { name: 'Network Effects' })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: /View work/i })).toHaveLength(1);
  });
});

/* ---------------- 3. player back route ---------------- */

describe('3. unavailable module player back link', () => {
  it('navigates to /learn, not /learning-modules', () => {
    const src = readFileSync(path.resolve(__dirname, '../pages/LearningModulePlayer.tsx'), 'utf8');
    expect(src).not.toContain("navigate('/learning-modules')");
    expect(src).toContain("navigate('/learn')");
  });
});

/* ---------------- 4. feedback loading + update ---------------- */

describe('4. existing feedback is loaded and updated', () => {
  beforeEach(() => vi.resetModules());

  it('prefills the textarea and updates instead of inserting', async () => {
    const inserts: any[] = [];
    const updates: any[] = [];
    const supabase = {
      from: (table: string) => {
        expect(table).toBe('teacher_feedback');
        const q: any = {
          select: () => q,
          eq: (col: string, val: string) => {
            if (col === 'id') { updates[updates.length - 1].id = val; return Promise.resolve({ error: null }); }
            return q;
          },
          maybeSingle: () => Promise.resolve({ data: { id: 'fb1', comment: 'Earlier note' }, error: null }),
          update: (payload: any) => { updates.push({ payload }); return q; },
          insert: (payload: any) => { inserts.push(payload); return Promise.resolve({ error: null }); },
        };
        return q;
      },
    };
    vi.doMock('@/integrations/supabase/client', () => ({ supabase }));
    vi.doMock('@/context/AuthContext', () => ({ useAuth: () => ({ user: { id: 'teacher' } }) }));
    vi.doMock('@/context/LangContext', () => ({ useLang: () => ({ lang: 'en' }) }));
    vi.doMock('@/hooks/useModuleResponses', () => ({
      useModuleResponses: () => ({
        responses: [{
          id: 'r1', user_id: 's1', module_id: 'db-ne', completed_at: '2026-01-01T00:00:00Z',
          quiz_score: 4, quiz_max: 5, analytical_answer: 'A', application_answer: 'B',
        }],
        loading: false, error: null, refresh: () => {},
      }),
    }));
    const AssignmentsTab = (await import('@/components/teacher-workspace/AssignmentsTab')).default;
    render(
      <AssignmentsTab
        classroomId="c1"
        subjectKey={PILOT_SUBJECT_KEY}
        students={[student('s1', 'Ани')]}
        assignments={[{ id: 'a1', assignment_type: 'module', journey_stage: null, case_id: null, module_slug: 'network-effects', note: null, due_date: null, created_at: '' }] as any}
        catalog={[mod({ slug: 'network-effects', dbId: 'db-ne', title_en: 'Network Effects' })]}
        catalogLoading={false}
        onAssignmentsChanged={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /View work/i }));
    const box = await screen.findByLabelText('Your feedback');
    await waitFor(() => expect((box as HTMLTextAreaElement).value).toBe('Earlier note'));

    fireEvent.change(box, { target: { value: 'Updated note' } });
    fireEvent.click(screen.getByRole('button', { name: /Save feedback/i }));
    await waitFor(() => expect(JSON.stringify({u:updates,i:inserts})).toContain('Updated note'));
    expect(updates[0].payload).toEqual({ comment: 'Updated note' });
    expect(updates[0].id).toBe('fb1');
    expect(inserts).toHaveLength(0);
  });
});
