/**
 * Canonical, documented teacher-facing metrics for DigiInnov Case Lab.
 *
 * ---------------------------------------------------------------------------
 *  FORMULA RECONCILIATION — why we needed one shared model
 * ---------------------------------------------------------------------------
 *  Prior state (see step 1a inventory):
 *
 *  1) `TeacherClassroom.tsx` (route: /teacher) — no overall-progress
 *     calculation; per-student status was:
 *       xp === 0                             → "Not started"
 *       daysSinceUpdate <= 7                 → "Active"
 *       daysSinceUpdate  > 14                → "Inactive"
 *       7 < daysSinceUpdate <= 14            → "Inactive" (implicit, likely bug)
 *
 *  2) `TeacherDashboardPage.tsx` (route: /teacher-dashboard) —
 *       overall = (casePct + simPct + startupPct + modPct) / 4
 *         casePct    = min(casesCompleted * 20, 100)          // implicit target = 5
 *         simPct     = min((simWeek / 6) * 100, 100)
 *         startupPct = min((narrativeSections / 7) * 100, 100) // BMC fields ignored
 *         modPct     = min(moduleCount * 20, 100)              // implicit target = 5
 *       struggling  = overall < 50
 *                   OR daysSinceUpdate > 7
 *                   OR (quizAvg > 0 && quizAvg < 50)
 *
 *  3) `TeacherDashboard.tsx` (route: /admin/teacher) —
 *       overall = (caseProgress + simProg + projProg) / 3
 *         caseProgress = (subs / totalPublishedCases) * 100     // divisor varies
 *         simProg      = (simWeek / 6) * 100
 *         projProg     = (narrativeSections / 7) * 100          // BMC fields ignored
 *                                                                // modules ignored
 *       needsSupport = overall < 20
 *                   OR (cases exist AND 0 completed)
 *                   OR simWeek <= 1
 *                   OR daysSinceLatestActivity > 7 days
 *
 *  Why the results differed:
 *    * Different pillar counts (3 vs 4).
 *    * `TeacherDashboardPage` counted modules; `TeacherDashboard` did not.
 *    * Neither counted Business Model Canvas fields even though students
 *      earn XP for them and they are the primary artifact in Stage 4.
 *    * `TeacherDashboard`'s case pillar depends on the live count of
 *      published cases, so a student with 3/3 completed drops to 3/5 when
 *      an admin publishes 2 new cases — same behavior, different %.
 *    * "At risk / struggling / needs support" used three different
 *      predicates with three different thresholds (<50%, <20%, mixed).
 *
 *  Recommendation (adopted below):
 *    * Fixed, stable targets so a student's progress % does not change
 *      when the catalog changes.
 *    * Four equal pillars: Cases, Simulator, Startup, Modules.
 *    * Startup pillar counts BOTH the 7 narrative sections and the 9 BMC
 *      sections (60/40 weighted so BMC contributes but doesn't dominate).
 *    * A student's status is reported as a set of DEVELOPMENTAL SIGNALS,
 *      never a permanent "at risk" label. Language is deliberately soft:
 *      "Needs attention", "Low recent activity", "Support recommended",
 *      "Progress has slowed".
 *
 *  All thresholds are named constants (see `METRIC_TARGETS`) so future
 *  changes are explicit and reviewable — no magic numbers scattered
 *  through components.
 * ---------------------------------------------------------------------------
 */

export type Lang = 'en' | 'bg';

/** All tunable thresholds in one place. Changing a number here is the
 *  only supported way to shift teacher-dashboard behavior. */
export const METRIC_TARGETS = {
  /** Cases a student is expected to complete during the programme. */
  targetCases: 5,
  /** Learning modules expected. */
  targetModules: 5,
  /** Number of simulator weeks in a full season. */
  simulatorWeeks: 6,
  /** Narrative sections in the startup project (Problem, Customer, …). */
  startupNarrativeSections: 7,
  /** Business Model Canvas sections. */
  startupBmcSections: 9,
  /** Weight of narrative vs BMC inside the Startup pillar (must sum to 1). */
  startupNarrativeWeight: 0.6,
  startupBmcWeight: 0.4,
  /** Min character length before a section counts as "filled". */
  minSectionCharLength: 10,
  /** Activity windows, in days. */
  activeWindowDays: 7,
  lowActivityWindowDays: 14,
  /** Quiz thresholds. */
  quizMinCountForSignal: 2,
  quizLowScorePct: 50,
  /** "Progress has slowed" — overall below this after 14 days of activity. */
  progressSlowedThresholdPct: 25,
} as const;

export type ActivityStatus =
  | 'active'                // acted within `activeWindowDays`
  | 'low_recent_activity'   // between active and low-activity window
  | 'support_recommended'   // silent longer than `lowActivityWindowDays`
  | 'not_yet_started';      // no XP, no activity signal at all

export type SupportSignalId =
  | 'low_recent_activity'
  | 'support_recommended_inactive'
  | 'progress_has_slowed'
  | 'needs_attention_cases'
  | 'needs_attention_quiz'
  | 'not_yet_started';

export interface SupportSignal {
  id: SupportSignalId;
  /** UI label — pass current lang. Developmental phrasing only. */
  label: (lang: Lang) => string;
  /** Rough visual weight. `support` is the highest, `info` the lowest. */
  severity: 'info' | 'attention' | 'support';
}

export interface StudentActivityInput {
  casesCompleted: number;
  simWeek: number;                     // 0..6
  simComplete?: boolean;
  startupNarrativeFilled: number;      // 0..7
  startupBmcFilled: number;            // 0..9
  startupSubmitted?: boolean;
  modulesCompleted: number;
  quizAverage?: number | null;         // 0..100
  quizCount?: number;
  lastActivityAt?: string | Date | null;
  totalXp?: number;
  /** Whether the teacher has assigned any case work yet. Used to
   *  suppress "no completed cases" signal when nothing was assigned. */
  hasAssignedCases?: boolean;
}

export interface StudentMetrics {
  /** 0..100. Rounded to nearest integer. */
  overall: number;
  breakdown: {
    cases: number;
    simulator: number;
    startup: number;
    modules: number;
  };
  activityStatus: ActivityStatus;
  daysSinceActivity: number | null;
  signals: SupportSignal[];
}

/* ------------------------------------------------------------------ */
/*  Small pure helpers                                                */
/* ------------------------------------------------------------------ */

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

function daysBetween(a: Date, b: Date): number {
  return (a.getTime() - b.getTime()) / 86_400_000;
}

function toDateOrNull(v: string | Date | null | undefined): Date | null {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Count how many of the given string fields pass the "filled" bar. */
export function countFilledSections(
  row: Record<string, unknown> | null | undefined,
  keys: readonly string[],
  minLength: number = METRIC_TARGETS.minSectionCharLength,
): number {
  if (!row) return 0;
  let n = 0;
  for (const k of keys) {
    const v = row[k];
    if (typeof v === 'string' && v.trim().length > minLength) n += 1;
  }
  return n;
}

/* ------------------------------------------------------------------ */
/*  Pillars                                                           */
/* ------------------------------------------------------------------ */

export function casesPillarPct(casesCompleted: number): number {
  const pct = (casesCompleted / METRIC_TARGETS.targetCases) * 100;
  return Math.round(clamp(pct));
}

export function simulatorPillarPct(simWeek: number, simComplete?: boolean): number {
  if (simComplete) return 100;
  const pct = (simWeek / METRIC_TARGETS.simulatorWeeks) * 100;
  return Math.round(clamp(pct));
}

export function startupPillarPct(
  narrativeFilled: number,
  bmcFilled: number,
  submitted?: boolean,
): number {
  if (submitted) return 100;
  const narrativePct =
    (narrativeFilled / METRIC_TARGETS.startupNarrativeSections) * 100;
  const bmcPct = (bmcFilled / METRIC_TARGETS.startupBmcSections) * 100;
  const blended =
    narrativePct * METRIC_TARGETS.startupNarrativeWeight +
    bmcPct * METRIC_TARGETS.startupBmcWeight;
  return Math.round(clamp(blended));
}

export function modulesPillarPct(modulesCompleted: number): number {
  const pct = (modulesCompleted / METRIC_TARGETS.targetModules) * 100;
  return Math.round(clamp(pct));
}

/* ------------------------------------------------------------------ */
/*  Activity status                                                   */
/* ------------------------------------------------------------------ */

export function classifyActivity(
  lastActivityAt: Date | null,
  totalXp: number,
  now: Date = new Date(),
): { status: ActivityStatus; daysSince: number | null } {
  if (!lastActivityAt) {
    return { status: totalXp > 0 ? 'support_recommended' : 'not_yet_started', daysSince: null };
  }
  const days = daysBetween(now, lastActivityAt);
  if (totalXp === 0 && days > METRIC_TARGETS.lowActivityWindowDays) {
    return { status: 'not_yet_started', daysSince: days };
  }
  if (days <= METRIC_TARGETS.activeWindowDays) return { status: 'active', daysSince: days };
  if (days <= METRIC_TARGETS.lowActivityWindowDays) {
    return { status: 'low_recent_activity', daysSince: days };
  }
  return { status: 'support_recommended', daysSince: days };
}

export function describeActivityStatus(status: ActivityStatus, lang: Lang): string {
  const dict: Record<ActivityStatus, [string, string]> = {
    active:                ['Active this week',    'Активен тази седмица'],
    low_recent_activity:   ['Low recent activity', 'Малка активност напоследък'],
    support_recommended:   ['Support recommended', 'Препоръчва се подкрепа'],
    not_yet_started:       ['Not yet started',     'Още не е започнал'],
  };
  return dict[status][lang === 'bg' ? 1 : 0];
}

/* ------------------------------------------------------------------ */
/*  Developmental support signals                                     */
/* ------------------------------------------------------------------ */

function makeSignal(
  id: SupportSignalId,
  labelEn: string,
  labelBg: string,
  severity: SupportSignal['severity'],
): SupportSignal {
  return {
    id,
    severity,
    label: (lang) => (lang === 'bg' ? labelBg : labelEn),
  };
}

function collectSignals(
  input: StudentActivityInput,
  activityStatus: ActivityStatus,
  overall: number,
): SupportSignal[] {
  const signals: SupportSignal[] = [];

  if (activityStatus === 'not_yet_started') {
    signals.push(
      makeSignal('not_yet_started', 'Not yet started', 'Още не е започнал', 'attention'),
    );
    return signals; // don't pile on other signals for brand-new accounts
  }

  if (activityStatus === 'low_recent_activity') {
    signals.push(
      makeSignal(
        'low_recent_activity',
        'Low recent activity',
        'Малка активност напоследък',
        'info',
      ),
    );
  }

  if (activityStatus === 'support_recommended') {
    signals.push(
      makeSignal(
        'support_recommended_inactive',
        'Support recommended',
        'Препоръчва се подкрепа',
        'support',
      ),
    );
  }

  if (overall < METRIC_TARGETS.progressSlowedThresholdPct) {
    // "not_yet_started" returned early above, so we know we're past that state here
    signals.push(
      makeSignal(
        'progress_has_slowed',
        'Progress has slowed',
        'Прогресът се забави',
        'attention',
      ),
    );
  }

  if (input.hasAssignedCases && input.casesCompleted === 0) {
    signals.push(
      makeSignal(
        'needs_attention_cases',
        'Needs attention: cases',
        'Нуждае се от внимание: казуси',
        'attention',
      ),
    );
  }

  if (
    (input.quizCount ?? 0) >= METRIC_TARGETS.quizMinCountForSignal &&
    (input.quizAverage ?? 0) > 0 &&
    (input.quizAverage ?? 0) < METRIC_TARGETS.quizLowScorePct
  ) {
    signals.push(
      makeSignal(
        'needs_attention_quiz',
        'Needs attention: quiz results',
        'Нуждае се от внимание: резултати от тестове',
        'attention',
      ),
    );
  }

  return signals;
}

/* ------------------------------------------------------------------ */
/*  Public composition                                                */
/* ------------------------------------------------------------------ */

export function computeStudentMetrics(
  input: StudentActivityInput,
  now: Date = new Date(),
): StudentMetrics {
  const breakdown = {
    cases: casesPillarPct(input.casesCompleted),
    simulator: simulatorPillarPct(input.simWeek, input.simComplete),
    startup: startupPillarPct(
      input.startupNarrativeFilled,
      input.startupBmcFilled,
      input.startupSubmitted,
    ),
    modules: modulesPillarPct(input.modulesCompleted),
  };

  const overall = Math.round(
    (breakdown.cases + breakdown.simulator + breakdown.startup + breakdown.modules) / 4,
  );

  const { status, daysSince } = classifyActivity(
    toDateOrNull(input.lastActivityAt),
    input.totalXp ?? 0,
    now,
  );

  const signals = collectSignals(input, status, overall);

  return {
    overall,
    breakdown,
    activityStatus: status,
    daysSinceActivity: daysSince,
    signals,
  };
}

/* ------------------------------------------------------------------ */
/*  Overdue work — computed at classroom level                        */
/* ------------------------------------------------------------------ */

export interface AssignmentLike {
  id: string;
  due_date: string | null;
}

export interface OverdueSummary {
  overdueCount: number;
  nextDueAt: Date | null;
  totalWithDueDate: number;
}

/**
 * Summarize overdue and upcoming assignments for a classroom.
 * Per-student completion linkage is not modelled in `classroom_assignments`
 * yet — this is intentionally a classroom-wide summary until per-student
 * completion tracking is added.
 */
export function summarizeAssignments(
  assignments: readonly AssignmentLike[],
  now: Date = new Date(),
): OverdueSummary {
  let overdue = 0;
  let nextDue: Date | null = null;
  let withDueDate = 0;
  for (const a of assignments) {
    if (!a.due_date) continue;
    withDueDate += 1;
    const d = new Date(a.due_date);
    if (Number.isNaN(d.getTime())) continue;
    if (d.getTime() < now.getTime()) {
      overdue += 1;
    } else if (!nextDue || d < nextDue) {
      nextDue = d;
    }
  }
  return { overdueCount: overdue, nextDueAt: nextDue, totalWithDueDate: withDueDate };
}

/* ------------------------------------------------------------------ */
/*  Constants exported for legacy files that want to align            */
/* ------------------------------------------------------------------ */

export const STARTUP_NARRATIVE_KEYS = [
  'problem',
  'customer',
  'value_proposition',
  'digital_product',
  'business_model',
  'growth_strategy',
  'final_pitch',
] as const;

export const STARTUP_BMC_KEYS = [
  'bmc_customer_segments',
  'bmc_value_proposition',
  'bmc_channels',
  'bmc_customer_relationships',
  'bmc_revenue_streams',
  'bmc_key_resources',
  'bmc_key_activities',
  'bmc_key_partners',
  'bmc_cost_structure',
] as const;