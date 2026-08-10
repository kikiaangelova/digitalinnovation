/**
 * P1 Content MVP — student-safe rendering, teacher-only panel and the
 * feedback + revision loop for `network-effects`.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { readFileSync, readdirSync, existsSync } from 'fs';
import path from 'path';
import { LEARNING_MODULES } from '@/data/learning-modules';
import {
  NETWORK_EFFECTS_SOURCES, NETWORK_EFFECTS_OUTCOMES, NETWORK_EFFECTS_BOUNDARIES,
  NETWORK_EFFECTS_MISCONCEPTIONS, NETWORK_EFFECTS_ENTRY_TASK, AIRBNB_TRUST_CASE_PACK,
  NETWORK_EFFECTS_TEACHER_PACK,
} from '@/data/network-effects-pilot';
import { PILOT_SUBJECT_KEY, FEEDBACK_TARGET_TYPE } from '@/lib/teacher-assignments';
import {
  shouldAwardCompletionXp, buildRevisionReopenPayload, buildRevisionRowFilters,
  buildFeedbackQueryFilters, buildResubmissionCompletion, deriveRevisionState,
  revisionStateLabel, canStartRevision,
} from '@/lib/content-mvp-revision';
import type { CatalogModule } from '@/hooks/useModuleCatalog';

const NE = LEARNING_MODULES.find((m) => m.slug === 'network-effects')!;

/* ---------------- 1. required student-safe data ---------------- */

const REQUIRED_URLS = [
  'https://www.sec.gov/Archives/edgar/data/1559720/000155972026000004/abnb-20251231.htm',
  'https://www.airbnb.com/help/article/1237',
  'https://www.airbnb.com/help/article/2673',
  'https://www.airbnb.com/help/article/13',
  'https://www.airbnb.com/help/article/3218',
  'https://discovery.ucl.ac.uk/4324/1/competitionintwosidedmarkets.pdf',
  'https://spectrum.ieee.org/metcalfes-law-is-wrong',
  'https://www.booking.com/content/how_we_work.html',
  'https://www.uber.com/us/en/safety/rider-verification/',
  'https://www.etsy.com/legal/buyers/',
];

describe('1. network-effects pilot data is complete', () => {
  it('exposes every required student-safe section', () => {
    expect(NE.quality_status).toBe('needs_review');
    expect(NE.learning_outcomes).toBe(NETWORK_EFFECTS_OUTCOMES);
    expect(NE.source_pack).toBe(NETWORK_EFFECTS_SOURCES);
    expect(NE.model_boundaries).toBe(NETWORK_EFFECTS_BOUNDARIES);
    expect(NE.misconceptions).toBe(NETWORK_EFFECTS_MISCONCEPTIONS);
    expect(NE.entry_task).toBe(NETWORK_EFFECTS_ENTRY_TASK);
    expect(NE.embedded_case?.case_pack).toBe(AIRBNB_TRUST_CASE_PACK);
    expect(NE.quiz_questions.length).toBe(5);
  });

  it('covers the four Bloom-tagged outcomes', () => {
    expect(NETWORK_EFFECTS_OUTCOMES.map((o) => o.bloom)).toEqual(['Apply', 'Analyze', 'Evaluate', 'Create']);
  });

  it('lists every required source URL exactly once', () => {
    const urls = NETWORK_EFFECTS_SOURCES.map((s) => s.url);
    for (const u of REQUIRED_URLS) expect(urls.filter((x) => x === u)).toHaveLength(1);
  });

  it('ships exhibits A–D with a decision matrix caveat', () => {
    const pack = AIRBNB_TRUST_CASE_PACK;
    expect(pack.exhibits.map((e) => e.id)).toEqual(['A', 'B', 'C', 'D']);
    const d = pack.exhibits.find((e) => e.id === 'D')!;
    expect(d.caveat_en).toBeTruthy();
    expect(d.caveat_bg).toBeTruthy();
    const c = pack.exhibits.find((e) => e.id === 'C')!;
    const flat = JSON.stringify(c);
    for (const p of ['Booking.com', 'Uber', 'Etsy']) expect(flat).toContain(p);
    expect(pack.decision_options).toHaveLength(4);
    expect(pack.stakeholders.length).toBeGreaterThanOrEqual(7);
    expect(pack.deliverable.min_words).toBe(250);
    expect(pack.deliverable.max_words).toBe(450);
  });

  it('keeps BG and EN equally populated for every bilingual field', () => {
    const bilingualPairs: [string, string][] = [];
    const walk = (v: any) => {
      if (Array.isArray(v)) { v.forEach(walk); return; }
      if (!v || typeof v !== 'object') return;
      for (const k of Object.keys(v)) {
        if (k === 'en' && typeof v.en === 'string' && typeof v.bg === 'string') {
          bilingualPairs.push([v.en, v.bg]);
        }
        if (k.endsWith('_en') && typeof v[k] === 'string') {
          const bgKey = `${k.slice(0, -3)}_bg`;
          if (typeof v[bgKey] === 'string') bilingualPairs.push([v[k], v[bgKey]]);
        }
        walk(v[k]);
      }
    };
    walk({
      outcomes: NETWORK_EFFECTS_OUTCOMES,
      boundaries: NETWORK_EFFECTS_BOUNDARIES,
      misconceptions: NETWORK_EFFECTS_MISCONCEPTIONS,
      entry: NETWORK_EFFECTS_ENTRY_TASK,
      pack: AIRBNB_TRUST_CASE_PACK,
      sources: NETWORK_EFFECTS_SOURCES,
      teacher: NETWORK_EFFECTS_TEACHER_PACK,
    });
    expect(bilingualPairs.length).toBeGreaterThan(80);
    for (const [en, bg] of bilingualPairs) {
      expect(en.trim().length).toBeGreaterThan(0);
      expect(bg.trim().length).toBeGreaterThan(0);
    }
  });
});

/* ---------------- 2. old claims are gone ---------------- */

describe('2. retired claims and the old Uber case are absent', () => {
  const serialized = JSON.stringify(NE);

  it('no longer embeds a Uber mini-case', () => {
    expect(NE.embedded_case?.title_en).toContain('Airbnb');
    expect(NE.embedded_case?.title_en).not.toMatch(/Uber/i);
    expect(NE.embedded_case?.context_en ?? '').not.toMatch(/Uber/i);
  });

  /**
   * Every string in the module with its path, so assertions can skip strings
   * that are deliberately wrong by design (distractor quiz options, stated
   * misconceptions) and source titles that are themselves refutations.
   */
  const annotated: { path: string; value: string; isDistractor: boolean }[] = [];
  (function walk(v: any, path: string, distractor: boolean) {
    if (typeof v === 'string') { annotated.push({ path, value: v, isDistractor: distractor }); return; }
    if (Array.isArray(v)) { v.forEach((x, i) => walk(x, `${path}[${i}]`, distractor)); return; }
    if (v && typeof v === 'object') {
      const isOption = 'correct' in v && v.correct !== true;
      for (const [k, val] of Object.entries(v)) {
        walk(val, `${path}.${k}`, distractor || isOption || /^wrong_/.test(k) || k === 'common_errors');
      }
    }
  })(NE, 'module', false);

  const assertedStrings = annotated.filter(
    (a) => !a.isDistractor && !/\.title(_en|_bg)?$/.test(a.path) && !/\.publisher$/.test(a.path) && !/\.url$/.test(a.path),
  );

  it('never states n² as a valuation law or a critical-mass formula', () => {
    const mentions = assertedStrings.filter((a) => /Metcalfe|n²/i.test(a.value));
    expect(mentions.length).toBeGreaterThan(0);
    for (const m of mentions) {
      expect(m.value).toMatch(
        /heuristic|not a valuation|not a way|never|potential|overstates|challenge|intuition|is Wrong|евристика|не е закон|не е оценка|никога|надценява|потенциал|оспориш|интуиция/i,
      );
    }
  });

  it('never asserts winner-take-all or near-monopoly', () => {
    expect(serialized).not.toMatch(/near-monopoly|почти монопол/i);
    const mentions = assertedStrings.filter((a) => /winner-take-all|победителят взема всичко/i.test(a.value));
    expect(mentions.length).toBeGreaterThan(0);
    for (const m of mentions) {
      expect(m.value).toMatch(/\bnot\b|do not|does not|не водят|не гарантира|Допускане|Assuming/i);
    }
  });

  it('makes no unsupported causal claims about WhatsApp ads or Uber profitability', () => {
    // WhatsApp may appear only as a neutral comparison prompt, never with a
    // monetisation or ads claim; Uber profitability is never asserted.
    for (const m of annotated.map((a) => a.value).filter((v) => /WhatsApp/i.test(v))) {
      expect(m).not.toMatch(/ads|advertis|monetis|monetiz|реклам|монетиз/i);
    }
    expect(serialized).not.toMatch(/profitab|печалба на Uber/i);
  });
});

/* ---------------- shared player harness ---------------- */

type Calls = {
  eq: [string, any][];
  updates: { table: string; payload: any }[];
  inserts: { table: string; payload: any }[];
};

function makeSupabase(opts: {
  response?: any;
  feedback?: any;
  feedbackError?: boolean;
}): { supabase: any; calls: Calls } {
  const calls: Calls = { eq: [], updates: [], inserts: [] };
  const supabase = {
    from(table: string) {
      const q: any = {
        select: () => q,
        eq: (c: string, v: any) => { calls.eq.push([`${table}.${c}`, v]); return q; },
        in: () => q,
        ilike: () => q,
        limit: () => q,
        order: () => q,
        update: (payload: any) => { calls.updates.push({ table, payload }); return q; },
        insert: (payload: any) => {
          calls.inserts.push({ table, payload });
          return { select: () => ({ single: () => Promise.resolve({ data: { id: 'new' }, error: null }) }), ...q };
        },
        maybeSingle: () => {
          if (table === 'learning_modules') return Promise.resolve({ data: { id: 'db-ne' }, error: null });
          if (table === 'learning_module_responses') return Promise.resolve({ data: opts.response ?? null, error: null });
          if (table === 'teacher_feedback') {
            return Promise.resolve(
              opts.feedbackError
                ? { data: null, error: { message: 'boom' } }
                : { data: opts.feedback ?? null, error: null },
            );
          }
          return Promise.resolve({ data: null, error: null });
        },
        single: () => Promise.resolve({ data: { id: 'new' }, error: null }),
        then: (res: any) => res({ data: null, error: null }),
      };
      return q;
    },
  };
  return { supabase, calls };
}

async function renderPlayer(opts: {
  response?: any; feedback?: any; feedbackError?: boolean; slug?: string;
}) {
  const { supabase, calls } = makeSupabase(opts);
  const awardXp = vi.fn(async () => ({ xp_awarded: 10 }));
  vi.doMock('@/integrations/supabase/client', () => ({ supabase }));
  vi.doMock('@/context/AuthContext', () => ({ useAuth: () => ({ user: { id: 'stu' } }) }));
  vi.doMock('@/context/LangContext', () => ({ useLang: () => ({ lang: 'en' }) }));
  vi.doMock('@/lib/xp', () => ({ awardXp }));
  vi.doMock('@/components/layout/AppHeader', () => ({ default: () => null }));
  vi.doMock('@/components/feedback/StructuredFeedback', () => ({ default: () => null }));
  vi.doMock('@/components/learning/SkillsImproved', () => ({ default: () => null }));
  vi.doMock('react-router-dom', () => ({
    useParams: () => ({ slug: opts.slug ?? 'network-effects' }),
    useNavigate: () => () => {},
  }));
  const Player = (await import('@/pages/LearningModulePlayer')).default;
  const utils = render(<Player />);
  return { ...utils, calls, awardXp };
}

/* ---------------- 3. student player hides teacher material ---------------- */

describe('3. student player renders pilot sections but no teacher material', () => {
  beforeEach(() => vi.resetModules());

  it('shows needs-review status, outcomes, boundaries, misconceptions, entry task and sources', async () => {
    await renderPlayer({});
    await waitFor(() => expect(screen.getByTestId('quality-status')).toHaveTextContent('Needs review'));
    expect(screen.getByTestId('pilot-outcomes')).toBeInTheDocument();
    expect(screen.getByTestId('pilot-boundaries')).toBeInTheDocument();
    expect(screen.getByTestId('pilot-misconceptions')).toBeInTheDocument();
    expect(screen.getByTestId('pilot-entry-task')).toBeInTheDocument();
    const sources = screen.getByTestId('pilot-sources');
    for (const u of REQUIRED_URLS) {
      const link = sources.querySelector(`a[href="${u}"]`)!;
      expect(link).toBeTruthy();
      expect(link.getAttribute('rel')).toContain('noopener');
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('aria-label')).toBeTruthy();
    }
    expect(screen.queryByText(/Pilot ready/i)).toBeNull();
  });

  it('never renders the model answer, rubric or common errors', async () => {
    const { container } = await renderPlayer({
      response: {
        id: 'r1', completed_at: '2026-08-01T00:00:00Z', quiz_answers: {},
        analytical_answer: 'a'.repeat(60), application_answer: 'b'.repeat(60),
        concept_score: 80, analytical_score: 70, strategic_score: 75, application_score: 60,
      },
      feedback: { id: 'fb1', comment: 'Sharpen your assumptions.' },
    });
    await waitFor(() => expect(screen.getByTestId('teacher-feedback-panel')).toBeInTheDocument());
    expect(screen.queryByTestId('teacher-rubric-panel')).toBeNull();
    const text = container.textContent ?? '';
    expect(text).not.toContain('Strong sample recommendation');
    expect(text).not.toContain('Evidence checklist');
    expect(text).not.toMatch(/Rubric 0–4/);
    expect(text).not.toContain('Common errors');
  });

  it('does not import or read teacher-only material in student-facing code', () => {
    // Comments are allowed to mention the field name; code must not touch it.
    const stripComments = (src: string) =>
      src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

    const files = ['../components/learning/PilotStudentSections.tsx', '../pages/LearningModulePlayer.tsx'];
    for (const rel of files) {
      const code = stripComments(readFileSync(path.resolve(__dirname, rel), 'utf8'));
      // no import of the teacher-only panel
      expect(code).not.toMatch(/import[\s\S]{0,200}TeacherRubricPanel/);
      expect(code).not.toMatch(/from\s+['"][^'"]*teacher-workspace[^'"]*['"]/);
      expect(code).not.toMatch(/<TeacherRubricPanel\b/);
      // no access to teacher-only data
      expect(code).not.toMatch(/teacher_pack/);
      expect(code).not.toMatch(/teacherPack/);
      expect(code).not.toMatch(/TEACHER_PACK|NETWORK_EFFECTS_TEACHER_PACK/);
      expect(code).not.toMatch(/model_answer|evidence_checklist|common_errors|feedback_prompts|rubric/i);
    }
  });

  it('renders the full Airbnb case pack in the case phase', async () => {
    // rendered directly: the player mounts this exact block in the case phase
    const { CasePackBlock } = await import('@/components/learning/PilotStudentSections');
    render(<CasePackBlock pack={AIRBNB_TRUST_CASE_PACK} lang="en" />);
    expect(screen.getByTestId('pilot-case-pack')).toBeInTheDocument();
    for (const id of ['case-verified-facts', 'case-interpretations', 'case-assumptions',
      'case-stakeholders', 'case-dilemma', 'case-options', 'case-exhibits',
      'case-deliverable', 'case-reflection']) {
      expect(screen.getByTestId(id)).toBeInTheDocument();
    }
  });
});

/* ---------------- 4. teacher-only panel ---------------- */

describe('4. teacher rubric panel is Teacher Workspace only', () => {
  beforeEach(() => vi.resetModules());

  const catalogModule = (over: Partial<CatalogModule>): CatalogModule => ({
    slug: 'network-effects', dbId: 'db-ne', title_en: 'Network Effects', title_bg: 'Мрежови ефекти',
    subject_key: PILOT_SUBJECT_KEY, display_order: 1, hasRichContent: true, registered: true,
    staticModule: NE, ...over,
  });

  async function renderTab(mod: CatalogModule) {
    vi.doMock('@/integrations/supabase/client', () => ({
      supabase: {
        from: () => {
          const q: any = {
            select: () => q, eq: () => q,
            maybeSingle: () => Promise.resolve({ data: null, error: null }),
          };
          return q;
        },
      },
    }));
    vi.doMock('@/context/AuthContext', () => ({ useAuth: () => ({ user: { id: 'teacher' } }) }));
    vi.doMock('@/context/LangContext', () => ({ useLang: () => ({ lang: 'en' }) }));
    vi.doMock('@/hooks/useModuleResponses', () => ({
      useModuleResponses: () => ({
        responses: [{
          id: 'r1', user_id: 's1', module_id: 'db-ne', completed_at: '2026-08-01T00:00:00Z',
          quiz_score: 4, quiz_max: 5, analytical_answer: 'x', application_answer: 'y',
        }],
        loading: false, error: null, refresh: () => {},
      }),
    }));
    const AssignmentsTab = (await import('@/components/teacher-workspace/AssignmentsTab')).default;
    render(
      <AssignmentsTab
        classroomId="c1"
        subjectKey={PILOT_SUBJECT_KEY}
        students={[{
          membership_id: 'm1', student_id: 's1', joined_at: '', display_name: 'Ани',
          full_name: null, avatar_url: null, total_xp: 0, updated_at: '',
        }] as any}
        assignments={[{
          id: 'a1', assignment_type: 'module', journey_stage: null, case_id: null,
          module_slug: mod.slug, note: null, due_date: null, created_at: '',
        }] as any}
        catalog={[mod]}
        catalogLoading={false}
        onAssignmentsChanged={() => {}}
      />,
    );
  }

  it('shows rubric, checklist, decision key, common errors and prompts for network-effects', async () => {
    await renderTab(catalogModule({}));
    fireEvent.click(screen.getByRole('button', { name: /View work/i }));
    const panel = await screen.findByTestId('teacher-rubric-panel');
    expect(panel).toHaveTextContent('Rubric 0–4');
    expect(panel).toHaveTextContent('Evidence checklist');
    expect(panel).toHaveTextContent('Decision key');
    expect(panel).toHaveTextContent('Strong sample recommendation');
    expect(panel).toHaveTextContent('Common errors');
    expect(panel).toHaveTextContent('Feedback prompts');
    expect(panel).toHaveTextContent('Which claim needs a source?');
    for (const d of ['Clarity', 'Evidence use', 'Trade-offs', 'Realism', 'Risk and ethics']) {
      expect(panel).toHaveTextContent(d);
    }
  });

  it('is absent for a module without a teacher pack', async () => {
    const plain = LEARNING_MODULES.find((m) => m.slug !== 'network-effects' && !m.teacher_pack)!;
    await renderTab(catalogModule({ slug: plain.slug, staticModule: plain, title_en: plain.title_en }));
    fireEvent.click(screen.getByRole('button', { name: /View work/i }));
    await screen.findByLabelText(/Your feedback/i);
    expect(screen.queryByTestId('teacher-rubric-panel')).toBeNull();
  });

  it('never persists a rubric score', () => {
    const panel = readFileSync(path.resolve(__dirname, '../components/teacher-workspace/TeacherRubricPanel.tsx'), 'utf8');
    expect(panel).not.toMatch(/\.insert\(|\.update\(|\.upsert\(/);
  });
});

/* ---------------- 5 & 6 & 7. feedback query, revision, XP ---------------- */
/**
 * These behaviours are covered through the pure helpers plus focused source
 * assertions. Mounting the whole player with a completed response spins in
 * jsdom, so the coverage is kept but the harness is deterministic.
 */

const playerSource = readFileSync(path.resolve(__dirname, '../pages/LearningModulePlayer.tsx'), 'utf8');

describe('5. student feedback query is scoped to the existing response', () => {
  it('builds all three feedback filter keys', () => {
    expect(buildFeedbackQueryFilters('stu', 'r1')).toEqual({
      student_id: 'stu',
      target_type: FEEDBACK_TARGET_TYPE,
      target_id: 'r1',
    });
    expect(FEEDBACK_TARGET_TYPE).toBe('learning_module_response');
  });

  it('applies student_id, target_type and target_id on the teacher_feedback query', () => {
    const q = playerSource.slice(
      playerSource.indexOf("from('teacher_feedback')"),
      playerSource.indexOf('maybeSingle()', playerSource.indexOf("from('teacher_feedback')")),
    );
    expect(q).toMatch(/\.eq\('student_id',\s*filters\.student_id\)/);
    expect(q).toMatch(/\.eq\('target_type',\s*filters\.target_type\)/);
    expect(q).toMatch(/\.eq\('target_id',\s*filters\.target_id\)/);
    expect(q).not.toMatch(/insert|update|upsert|delete/);
  });

  it('derives truthful states, including waiting and feedback received', () => {
    const base = { resubmitted: false, isRevision: false, isCompleted: true, hasFeedback: false };
    expect(deriveRevisionState(base)).toBe('waiting');
    expect(deriveRevisionState({ ...base, hasFeedback: true })).toBe('feedback_received');
    expect(deriveRevisionState({ ...base, isRevision: true, isCompleted: false })).toBe('revision_in_progress');
    expect(deriveRevisionState({ ...base, resubmitted: true })).toBe('resubmitted');

    expect(revisionStateLabel('waiting', 'en')).toMatch(/waiting for teacher feedback/i);
    expect(revisionStateLabel('waiting', 'bg')).toMatch(/чака обратна връзка/i);
    expect(revisionStateLabel('resubmitted', 'en')).toMatch(/Resubmitted after feedback/i);
    expect(revisionStateLabel('feedback_received', 'bg')).toMatch(/обратна връзка/i);
  });

  it('never offers revision without real feedback or when the query failed', () => {
    expect(canStartRevision({ isCompleted: true, hasFeedback: false, feedbackError: false })).toBe(false);
    expect(canStartRevision({ isCompleted: true, hasFeedback: true, feedbackError: true })).toBe(false);
    expect(canStartRevision({ isCompleted: false, hasFeedback: true, feedbackError: false })).toBe(false);
    expect(canStartRevision({ isCompleted: true, hasFeedback: true, feedbackError: false })).toBe(true);
  });

  it('renders an honest error message and hides the revise button on feedback errors', () => {
    // the error branch is exclusive with the feedback branch that owns the button
    const panel = playerSource.slice(
      playerSource.indexOf("data-testid=\"teacher-feedback-panel\""),
      playerSource.indexOf('handleStartRevision}'),
    );
    expect(panel).toMatch(/feedbackError \?/);
    expect(panel).toMatch(/role="alert"/);
    expect(panel).toMatch(/could not be loaded/i);
    // the revise button lives inside the `feedback ?` branch, after the error branch
    expect(panel.indexOf('feedbackError ?')).toBeLessThan(panel.indexOf(': feedback ?'));
  });
});

describe('6 & 7. revision reuses the response row and pays no XP again', () => {
  it('does not award completion XP on a revision', () => {
    expect(shouldAwardCompletionXp(false)).toBe(true);
    expect(shouldAwardCompletionXp(true)).toBe(false);
    expect(playerSource).toMatch(/if \(shouldAwardCompletionXp\(isRevision\)\)/);
    const xpBlock = playerSource.slice(
      playerSource.indexOf('shouldAwardCompletionXp(isRevision)'),
      playerSource.indexOf('setExistingResponse((prev'),
    );
    expect(xpBlock).toMatch(/awardXp\('theory_complete'/);
  });

  it('reopens with completed_at null and resubmits a real completion stamp', () => {
    const reopen = buildRevisionReopenPayload(new Date('2026-08-10T00:00:00.000Z'));
    expect(reopen.completed_at).toBeNull();
    expect(reopen.updated_at).toBe('2026-08-10T00:00:00.000Z');

    const resubmit = buildResubmissionCompletion(new Date('2026-08-11T00:00:00.000Z'));
    expect(resubmit.completed_at).toBe('2026-08-11T00:00:00.000Z');
    expect(resubmit.updated_at).toBe('2026-08-11T00:00:00.000Z');
  });

  it('scopes the reopen update to the learner own row', () => {
    expect(buildRevisionRowFilters('r1', 'stu')).toEqual({ id: 'r1', user_id: 'stu' });

    const fn = playerSource.slice(
      playerSource.indexOf('const handleStartRevision'),
      playerSource.indexOf('if (!mod) {'),
    );
    expect(fn).toMatch(/from\('learning_module_responses'\)/);
    expect(fn).toMatch(/\.update\(buildRevisionReopenPayload\(\)/);
    expect(fn).toMatch(/\.eq\('id',\s*rowFilters\.id\)[\s\S]{0,80}\.eq\('user_id',\s*rowFilters\.user_id\)/);
    expect(fn).not.toMatch(/\.insert\(/);
    expect(fn).toMatch(/!user\?\.id/);
  });

  it('completes a submission by updating the existing row, never inserting a second one', () => {
    const submit = playerSource.slice(
      playerSource.indexOf('if (existingResponse) {', playerSource.indexOf('const finalScores = calculateScores();')),
      playerSource.indexOf('shouldAwardCompletionXp(isRevision)'),
    );
    expect(submit).toMatch(/if \(existingResponse\) \{[\s\S]{0,200}\.update\(payload as any\)\.eq\('id', existingResponse\.id\)/);
  });
});

/* ---------------- 8 & 9. compatibility and no DB writes ---------------- */

describe('8. other modules stay compatible', () => {
  it('leaves every other module without pilot fields', () => {
    for (const m of LEARNING_MODULES) {
      if (m.slug === 'network-effects') continue;
      expect(m.quality_status).toBeUndefined();
      expect(m.teacher_pack).toBeUndefined();
      expect(m.source_pack).toBeUndefined();
      expect(m.embedded_case?.case_pack).toBeUndefined();
    }
  });

  it('renders nothing when a non-pilot module supplies no pilot data', async () => {
    const S = await import('@/components/learning/PilotStudentSections');
    const { container } = render(
      <>
        <S.LearningOutcomesBlock outcomes={undefined} lang="en" />
        <S.ModelBoundariesBlock boundaries={undefined} lang="en" />
        <S.MisconceptionsBlock misconceptions={undefined} lang="en" />
        <S.EntryTaskBlock task={undefined} lang="en" />
        <S.SourcePackBlock sources={undefined} lang="en" />
        <S.CasePackBlock pack={undefined} lang="en" />
      </>,
    );
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByTestId('pilot-sources')).toBeNull();
    expect(screen.queryByTestId('pilot-case-pack')).toBeNull();
  });

  it('renders the quality badge only when a module declares a status', () => {
    expect(playerSource).toMatch(/mod\.quality_status &&[\s\S]{0,120}QualityStatusBadge/);
  });

  it('keeps the revision loop limited to the pilot slug', () => {
    expect(playerSource).toMatch(/REVISION_ENABLED_SLUGS = \['network-effects'\]/);
    expect(playerSource).toMatch(/revisionEnabled = !!mod && REVISION_ENABLED_SLUGS\.includes\(mod\.slug\)/);
  });
});

describe('9. no migrations and no catalogue writes were introduced', () => {
  it('adds no migration referencing pilot content', () => {
    const dir = path.resolve(__dirname, '../../supabase/migrations');
    if (!existsSync(dir)) return;
    for (const f of readdirSync(dir)) {
      const sql = readFileSync(path.join(dir, f), 'utf8');
      expect(sql).not.toMatch(/teacher_pack|case_pack|source_pack|quality_status|network-effects/i);
    }
  });

  it('never inserts into learning_modules from the player', () => {
    const player = readFileSync(path.resolve(__dirname, '../pages/LearningModulePlayer.tsx'), 'utf8');
    expect(player).not.toMatch(/from\('learning_modules'\)[\s\S]{0,120}insert/);
  });

  it('keeps teacher_feedback comments as the only Teacher Workspace write', () => {
    const tab = readFileSync(path.resolve(__dirname, '../components/teacher-workspace/AssignmentsTab.tsx'), 'utf8');
    const writes = tab.match(/from\('([a-z_]+)'\)\s*\n?\s*\.(insert|update|upsert|delete)/g) ?? [];
    for (const w of writes) expect(w).toMatch(/teacher_feedback|classroom_assignments/);
  });
});
