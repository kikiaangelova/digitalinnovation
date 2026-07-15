/**
 * Canonical next-action resolver for the Student Dashboard V2.
 *
 * ONE source of truth. Replaces the parallel logic previously scattered
 * across the header CTA, `NextStepHero.deriveNextStep`, `LearningNavigator`,
 * `QuickResumeCards`, `DailyGoalCard` and `StudentDashboard.getNextAction`.
 *
 * Feed the resolver a snapshot of the student's progress; it returns a
 * single, fully-labelled action to render in `TodayHero`.
 *
 * Priority (highest → lowest):
 *   1. Teacher assignment with soonest upcoming due date
 *   2. In-progress case (draft submission)
 *   3. In-progress theory module (started but not completed) — resume
 *   4. Startup section actively drafted
 *   5. Simulator continuation (started but not complete)
 *   6. Recommended-next when nothing is in progress:
 *        a. First uncompleted theory module           (Learn)
 *        b. First uncompleted case study               (Apply)
 *        c. Fill next startup section                  (Build)
 *        d. Run / continue simulator                    (Decide)
 *        e. Submit final pitch                          (Finalise)
 *        f. Take the final exam                         (Level Up)
 *
 * The resolver is pure and framework-free so it can be unit-tested.
 */

export type Lang = 'en' | 'bg';

export type NextActionKind =
  | 'assignment'
  | 'resume_case'
  | 'resume_module'
  | 'resume_startup'
  | 'resume_simulator'
  | 'learn_module'
  | 'start_case'
  | 'build_startup'
  | 'run_simulator'
  | 'final_pitch'
  | 'final_exam';

export type NextActionIcon =
  | 'book'
  | 'rocket'
  | 'chart'
  | 'pitch'
  | 'award'
  | 'assignment';

export interface AssignmentInput {
  id: string;
  due_date: string | null;
  assignment_type: string; // 'case' | 'module' | ...
  target_id?: string | null;
  title_en?: string | null;
  title_bg?: string | null;
}

export interface ModuleInput {
  slug: string;
  title_en: string;
  title_bg: string;
  /** free-text learning outcome, if the module declares one */
  outcome_en?: string;
  outcome_bg?: string;
}

export interface CaseInput {
  id: string;
  title: string;
  est_minutes?: number | null;
  topic?: string | null;
}

export interface NextActionSnapshot {
  /** Ordered list of upcoming teacher assignments (soonest first). */
  assignments?: AssignmentInput[];
  /** Modules in curriculum order. */
  modules: ModuleInput[];
  /** Slugs of modules the student has completed. */
  completedModuleSlugs: Set<string>;
  /** All published cases visible to the student. */
  cases: CaseInput[];
  /** Case ids the student has submitted (not draft). */
  completedCaseIds: Set<string>;
  /** Case ids with a draft submission (started, not submitted). */
  draftCaseIds: Set<string>;
  /** Filled? map for the 7 narrative startup sections. */
  startupSectionMap: Record<string, boolean>;
  startupSubmitted: boolean;
  finalPitchSubmitted: boolean;
  simWeek: number; // 1..6
  simComplete: boolean;
  /** Convenience: has the student done ANY activity yet? */
  hasAnyActivity: boolean;
}

export interface NextAction {
  kind: NextActionKind;
  /** i18n title of the action, e.g. "Continue: Value Proposition". */
  titleEn: string;
  titleBg: string;
  /** One-line "why this matters" / "this develops X". */
  purposeEn: string;
  purposeBg: string;
  /** Mission anchor, e.g. "Week 3 · Stage 3 · Explore". */
  missionEn: string;
  missionBg: string;
  /** Estimated minutes if known. */
  estMinutes?: number;
  /** XP available for this activity if known. */
  xp?: number;
  path: string;
  iconKey: NextActionIcon;
  /** Whether this is a resume of prior work or a fresh start. */
  isResume: boolean;
}

/* ------------------------------------------------------------------ */
/*  Stage / week derivation                                           */
/* ------------------------------------------------------------------ */

/**
 * Derives the student's current stage number (1..6) from progress state.
 * Mirrors the phase progression used by LearningNavigator without importing
 * it, so the resolver stays a pure module.
 */
export function deriveStage(s: NextActionSnapshot): number {
  const startupFilled = Object.values(s.startupSectionMap).filter(Boolean).length;
  const casesDone = s.completedCaseIds.size;
  if (!s.hasAnyActivity) return 1;
  if (casesDone === 0) return 1;                 // Discover
  if (s.completedModuleSlugs.size < 2) return 2; // Learn
  if (casesDone < 2) return 3;                    // Explore / Apply cases
  if (startupFilled < 3) return 4;                // Build startup
  if (!s.simComplete) return 5;                   // Decide
  if (!s.finalPitchSubmitted) return 5;
  return 6;                                       // Level Up
}

const STAGE_LABELS: Record<number, { en: string; bg: string; phaseEn: string; phaseBg: string }> = {
  1: { en: 'Stage 1', bg: 'Етап 1', phaseEn: 'Discover', phaseBg: 'Открий' },
  2: { en: 'Stage 2', bg: 'Етап 2', phaseEn: 'Learn',    phaseBg: 'Учи' },
  3: { en: 'Stage 3', bg: 'Етап 3', phaseEn: 'Explore',  phaseBg: 'Изследвай' },
  4: { en: 'Stage 4', bg: 'Етап 4', phaseEn: 'Build',    phaseBg: 'Изгради' },
  5: { en: 'Stage 5', bg: 'Етап 5', phaseEn: 'Decide',   phaseBg: 'Реши' },
  6: { en: 'Stage 6', bg: 'Етап 6', phaseEn: 'Level Up', phaseBg: 'Ниво нагоре' },
};

function missionLine(stage: number): { en: string; bg: string } {
  const s = STAGE_LABELS[stage];
  return {
    en: `Week ${stage} · ${s.en} · ${s.phaseEn}`,
    bg: `Седмица ${stage} · ${s.bg} · ${s.phaseBg}`,
  };
}

/* ------------------------------------------------------------------ */
/*  Startup section metadata                                          */
/* ------------------------------------------------------------------ */

const STARTUP_SECTION_META: Record<
  string,
  { en: string; bg: string; skillEn: string; skillBg: string; xp: number }
> = {
  problem:            { en: 'Problem',           bg: 'Проблем',           skillEn: 'Problem framing',      skillBg: 'Дефиниране на проблем', xp: 40 },
  customer:           { en: 'Customer',          bg: 'Клиент',            skillEn: 'Customer discovery',   skillBg: 'Откриване на клиента',   xp: 40 },
  value_proposition:  { en: 'Value Proposition', bg: 'Стойностно предложение', skillEn: 'Value design',    skillBg: 'Дизайн на стойността',   xp: 40 },
  digital_product:    { en: 'Digital Product',   bg: 'Дигитален продукт', skillEn: 'Product thinking',     skillBg: 'Продуктово мислене',     xp: 50 },
  business_model:     { en: 'Business Model',    bg: 'Бизнес модел',      skillEn: 'Business modelling',   skillBg: 'Бизнес моделиране',      xp: 50 },
  growth_strategy:    { en: 'Growth Strategy',   bg: 'Стратегия за растеж', skillEn: 'Growth strategy',    skillBg: 'Стратегия за растеж',    xp: 50 },
  final_pitch:        { en: 'Final Pitch',       bg: 'Финално представяне', skillEn: 'Founder storytelling', skillBg: 'Разказ на основателя', xp: 120 },
};

const STARTUP_ORDER = [
  'problem', 'customer', 'value_proposition', 'digital_product',
  'business_model', 'growth_strategy', 'final_pitch',
] as const;

/* ------------------------------------------------------------------ */
/*  Main resolver                                                     */
/* ------------------------------------------------------------------ */

export function resolveNextAction(s: NextActionSnapshot): NextAction {
  const stage = deriveStage(s);
  const mission = missionLine(stage);

  // 1. Teacher assignment with soonest upcoming due date
  const upcoming = (s.assignments ?? [])
    .filter((a) => a.due_date && new Date(a.due_date).getTime() >= Date.now())
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime());
  if (upcoming.length > 0) {
    const a = upcoming[0];
    const titleEn = a.title_en ?? 'Assignment from your teacher';
    const titleBg = a.title_bg ?? 'Задача от учителя';
    return {
      kind: 'assignment',
      titleEn,
      titleBg,
      purposeEn: 'Why this matters: your teacher set this as your current mission.',
      purposeBg: 'Защо е важно: учителят ти го зададе като текуща мисия.',
      missionEn: mission.en,
      missionBg: mission.bg,
      path: a.assignment_type === 'case' && a.target_id ? `/case/${a.target_id}` : '/dashboard',
      iconKey: 'assignment',
      isResume: false,
    };
  }

  // 2. In-progress case (draft submission)
  if (s.draftCaseIds.size > 0) {
    const draftId = Array.from(s.draftCaseIds)[0];
    const c = s.cases.find((x) => x.id === draftId);
    if (c) {
      return {
        kind: 'resume_case',
        titleEn: `Continue: ${c.title}`,
        titleBg: `Продължи: ${c.title}`,
        purposeEn: 'This develops: real-world case analysis and decision-making.',
        purposeBg: 'Това развива: анализ на казуси и вземане на решения.',
        missionEn: mission.en,
        missionBg: mission.bg,
        estMinutes: c.est_minutes ?? undefined,
        xp: 100,
        path: `/case/${c.id}`,
        iconKey: 'book',
        isResume: true,
      };
    }
  }

  // 3. First uncompleted module — treated as "resume" if some modules done,
  //    "learn" (fresh) otherwise.
  const nextModule = s.modules.find((m) => !s.completedModuleSlugs.has(m.slug));
  const modulesStarted = s.completedModuleSlugs.size > 0;

  // 4. Startup section in progress (some filled, but not all narrative & not submitted)
  const startupFilled = STARTUP_ORDER.filter((k) => s.startupSectionMap[k]).length;
  const nextStartupKey = STARTUP_ORDER.find((k) => !s.startupSectionMap[k]);
  if (startupFilled > 0 && startupFilled < STARTUP_ORDER.length && nextStartupKey && !s.startupSubmitted) {
    const meta = STARTUP_SECTION_META[nextStartupKey];
    return {
      kind: 'resume_startup',
      titleEn: `Continue your startup: ${meta.en}`,
      titleBg: `Продължи стартъпа си: ${meta.bg}`,
      purposeEn: `This develops: ${meta.skillEn}.`,
      purposeBg: `Това развива: ${meta.skillBg}.`,
      missionEn: mission.en,
      missionBg: mission.bg,
      estMinutes: 15,
      xp: meta.xp,
      path: `/my-startup?section=${nextStartupKey}`,
      iconKey: nextStartupKey === 'final_pitch' ? 'pitch' : 'rocket',
      isResume: true,
    };
  }

  // 5. Simulator continuation
  if (!s.simComplete && s.simWeek > 1) {
    return {
      kind: 'resume_simulator',
      titleEn: `Continue the simulator — Week ${s.simWeek} of 6`,
      titleBg: `Продължи симулатора — Седмица ${s.simWeek} от 6`,
      purposeEn: 'This develops: strategic thinking under uncertainty.',
      purposeBg: 'Това развива: стратегическо мислене в условия на несигурност.',
      missionEn: mission.en,
      missionBg: mission.bg,
      estMinutes: 12,
      xp: 50,
      path: '/simulator',
      iconKey: 'chart',
      isResume: true,
    };
  }

  // ---- Recommended-next when nothing is in progress ----

  // 6a. Uncompleted theory module → Learn
  if (nextModule) {
    return {
      kind: modulesStarted ? 'resume_module' : 'learn_module',
      titleEn: modulesStarted
        ? `Next module: ${nextModule.title_en}`
        : `Start learning: ${nextModule.title_en}`,
      titleBg: modulesStarted
        ? `Следващ модул: ${nextModule.title_bg}`
        : `Започни да учиш: ${nextModule.title_bg}`,
      purposeEn: nextModule.outcome_en
        ? `This develops: ${nextModule.outcome_en}.`
        : 'This develops: the foundations of digital innovation thinking.',
      purposeBg: nextModule.outcome_bg
        ? `Това развива: ${nextModule.outcome_bg}.`
        : 'Това развива: основите на дигиталното иновационно мислене.',
      missionEn: mission.en,
      missionBg: mission.bg,
      estMinutes: 10,
      xp: 25,
      path: `/learn/${nextModule.slug}`,
      iconKey: 'book',
      isResume: modulesStarted,
    };
  }

  // 6b. First uncompleted case → Apply
  const nextCase = s.cases.find((c) => !s.completedCaseIds.has(c.id));
  if (nextCase && s.completedCaseIds.size < 2) {
    return {
      kind: 'start_case',
      titleEn: `Analyse a case: ${nextCase.title}`,
      titleBg: `Анализирай казус: ${nextCase.title}`,
      purposeEn: 'This develops: real-world case analysis and decision-making.',
      purposeBg: 'Това развива: анализ на казуси и вземане на решения.',
      missionEn: mission.en,
      missionBg: mission.bg,
      estMinutes: nextCase.est_minutes ?? 20,
      xp: 100,
      path: `/case/${nextCase.id}`,
      iconKey: 'book',
      isResume: false,
    };
  }

  // 6c. Build startup (fewer than 3 sections filled)
  if (startupFilled < 3 && nextStartupKey) {
    const meta = STARTUP_SECTION_META[nextStartupKey];
    return {
      kind: 'build_startup',
      titleEn: `Build your startup: ${meta.en}`,
      titleBg: `Изгради стартъпа си: ${meta.bg}`,
      purposeEn: `This develops: ${meta.skillEn}.`,
      purposeBg: `Това развива: ${meta.skillBg}.`,
      missionEn: mission.en,
      missionBg: mission.bg,
      estMinutes: 15,
      xp: meta.xp,
      path: `/my-startup?section=${nextStartupKey}`,
      iconKey: 'rocket',
      isResume: false,
    };
  }

  // 6d. Run simulator (not started or week 1)
  if (!s.simComplete) {
    return {
      kind: 'run_simulator',
      titleEn: 'Test your strategy in the simulator',
      titleBg: 'Тествай стратегията си в симулатора',
      purposeEn: 'This develops: strategic thinking under uncertainty.',
      purposeBg: 'Това развива: стратегическо мислене в условия на несигурност.',
      missionEn: mission.en,
      missionBg: mission.bg,
      estMinutes: 15,
      xp: 50,
      path: '/simulator',
      iconKey: 'chart',
      isResume: false,
    };
  }

  // 6e. Submit final pitch
  if (!s.finalPitchSubmitted) {
    return {
      kind: 'final_pitch',
      titleEn: 'Submit your final pitch',
      titleBg: 'Подай финалното си представяне',
      purposeEn: 'This develops: founder storytelling and persuasion.',
      purposeBg: 'Това развива: разказ на основателя и убеждаване.',
      missionEn: mission.en,
      missionBg: mission.bg,
      estMinutes: 20,
      xp: 120,
      path: '/my-startup?section=final_pitch',
      iconKey: 'pitch',
      isResume: false,
    };
  }

  // 6f. Level up
  return {
    kind: 'final_exam',
    titleEn: 'Take the final exam',
    titleBg: 'Направи финалния изпит',
    purposeEn: 'Why this matters: earn your certificate and prove your skills.',
    purposeBg: 'Защо е важно: спечели сертификата и докажи уменията си.',
    missionEn: mission.en,
    missionBg: mission.bg,
    estMinutes: 45,
    path: '/final-exam',
    iconKey: 'award',
    isResume: false,
  };
}