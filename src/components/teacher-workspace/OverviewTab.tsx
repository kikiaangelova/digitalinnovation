/**
 * OverviewTab — /teacher-new "Overview".
 *
 * Shows the classroom pulse using canonical metrics:
 *   • roster totals (students, active this week, low-activity, support)
 *   • pillar averages (Cases, Simulator, Startup, Modules) — the same
 *     four pillars used everywhere in the workspace so numbers agree
 *   • overdue + next-due summary from `summarizeAssignments`
 *   • signal roll-up (how many students carry each support signal)
 *
 * Uses developmental phrasing throughout (no "at risk", no red X).
 */

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CalendarClock, Info } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import {
  METRIC_TARGETS,
  summarizeAssignments,
  type StudentMetrics,
  type SupportSignalId,
} from '@/lib/teacherMetrics';
import type { ClassroomAssignment } from '@/hooks/useClassroomAssignments';

interface Props {
  metricsById: Record<string, StudentMetrics>;
  studentCount: number;
  assignments: ClassroomAssignment[];
  loading: boolean;
}

function useT() {
  const { lang } = useLang();
  return (en: string, bg: string) => (lang === 'bg' ? bg : en);
}

function StatCard({
  label,
  value,
  tone = 'default',
  hint,
}: {
  label: string;
  value: number | string;
  tone?: 'default' | 'attention';
  hint?: string;
}) {
  return (
    <Card className="p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`mt-1 text-2xl font-semibold ${
          tone === 'attention' && Number(value) > 0
            ? 'text-amber-600 dark:text-amber-400'
            : ''
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}

function PillarRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="font-mono text-xs text-muted-foreground">{value}%</span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );
}

export default function OverviewTab({
  metricsById,
  studentCount,
  assignments,
  loading,
}: Props) {
  const t = useT();
  const { lang } = useLang();

  const summary = useMemo(() => {
    const list = Object.values(metricsById);
    const active = list.filter((m) => m.activityStatus === 'active').length;
    const low = list.filter((m) => m.activityStatus === 'low_recent_activity').length;
    const support = list.filter((m) => m.activityStatus === 'support_recommended').length;
    const notStarted = list.filter((m) => m.activityStatus === 'not_yet_started').length;

    const avg = (pick: (m: StudentMetrics) => number) =>
      list.length ? Math.round(list.reduce((s, m) => s + pick(m), 0) / list.length) : 0;

    const pillars = {
      cases: avg((m) => m.breakdown.cases),
      simulator: avg((m) => m.breakdown.simulator),
      startup: avg((m) => m.breakdown.startup),
      modules: avg((m) => m.breakdown.modules),
    };
    const overall = avg((m) => m.overall);

    // Signal roll-up
    const signalCounts: Record<SupportSignalId, number> = {
      low_recent_activity: 0,
      support_recommended_inactive: 0,
      progress_has_slowed: 0,
      needs_attention_cases: 0,
      needs_attention_quiz: 0,
      not_yet_started: 0,
    };
    for (const m of list) {
      for (const s of m.signals) signalCounts[s.id] += 1;
    }

    return { active, low, support, notStarted, pillars, overall, signalCounts };
  }, [metricsById]);

  const overdue = useMemo(() => summarizeAssignments(assignments), [assignments]);

  const skeleton = loading && studentCount === 0;

  return (
    <div className="space-y-4">
      {/* Roster pulse */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatCard label={t('Students', 'Ученици')} value={studentCount} />
        <StatCard
          label={t('Active this week', 'Активни тази седмица')}
          value={summary.active}
          hint={t(
            `≤ ${METRIC_TARGETS.activeWindowDays} days`,
            `≤ ${METRIC_TARGETS.activeWindowDays} дни`,
          )}
        />
        <StatCard
          label={t('Low recent activity', 'Малка активност')}
          value={summary.low}
          hint={t(
            `${METRIC_TARGETS.activeWindowDays + 1}–${METRIC_TARGETS.lowActivityWindowDays} days`,
            `${METRIC_TARGETS.activeWindowDays + 1}–${METRIC_TARGETS.lowActivityWindowDays} дни`,
          )}
        />
        <StatCard
          label={t('Support recommended', 'Препоръчва се подкрепа')}
          value={summary.support + summary.notStarted}
          tone="attention"
          hint={t(
            `Includes ${summary.notStarted} not yet started`,
            `Включително ${summary.notStarted} още не са започнали`,
          )}
        />
      </div>

      {/* Pillars */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">
            {t('Classroom progress', 'Прогрес на класа')}
          </h3>
          <Badge variant="secondary" className="font-mono">
            {summary.overall}% {t('overall', 'общо')}
          </Badge>
        </div>
        {skeleton ? (
          <p className="text-sm text-muted-foreground">
            {t('Loading progress…', 'Зареждане на прогреса…')}
          </p>
        ) : studentCount === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t(
              'No students in this classroom yet — share the class code to invite them.',
              'Все още няма ученици в тази класна стая — споделете кода, за да ги поканите.',
            )}
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <PillarRow label={t('Cases', 'Казуси')} value={summary.pillars.cases} />
            <PillarRow label={t('Simulator', 'Симулатор')} value={summary.pillars.simulator} />
            <PillarRow label={t('Startup project', 'Стартъп проект')} value={summary.pillars.startup} />
            <PillarRow label={t('Learning modules', 'Учебни модули')} value={summary.pillars.modules} />
          </div>
        )}
        <p className="text-xs text-muted-foreground flex items-start gap-1">
          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          {t(
            `Targets: ${METRIC_TARGETS.targetCases} cases · ${METRIC_TARGETS.simulatorWeeks} simulator weeks · 7 narrative + 9 BMC startup sections · ${METRIC_TARGETS.targetModules} modules. Startup pillar blends narrative (60%) and BMC (40%).`,
            `Цели: ${METRIC_TARGETS.targetCases} казуса · ${METRIC_TARGETS.simulatorWeeks} седмици симулатор · 7 текстови + 9 BMC секции · ${METRIC_TARGETS.targetModules} модула. Стартъп стълбът смесва текстови (60%) и BMC (40%).`,
          )}
        </p>
      </Card>

      {/* Overdue + upcoming */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">
            {t('Assignment dates', 'Срокове на задачи')}
          </h3>
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">
              {t('With a due date', 'С краен срок')}
            </p>
            <p className="text-lg font-semibold">{overdue.totalWithDueDate}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t('Past due', 'Просрочени')}
            </p>
            <p
              className={`text-lg font-semibold ${
                overdue.overdueCount > 0 ? 'text-amber-600 dark:text-amber-400' : ''
              }`}
            >
              {overdue.overdueCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t('Next due', 'Следващ срок')}
            </p>
            <p className="text-sm font-medium">
              {overdue.nextDueAt
                ? overdue.nextDueAt.toLocaleDateString(lang === 'bg' ? 'bg-BG' : 'en-GB')
                : '—'}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {t(
            'Per-student completion tracking will land in a later step; today this is a classroom-wide summary.',
            'Проследяване по ученик ще бъде добавено в по-късна стъпка; днес това е обобщение за целия клас.',
          )}
        </p>
      </Card>

      {/* Signal roll-up */}
      {studentCount > 0 && (
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-semibold">
              {t('Support signals in this classroom', 'Сигнали за подкрепа в класа')}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ['not_yet_started', t('Not yet started', 'Още не са започнали')],
                ['support_recommended_inactive', t('Support recommended', 'Препоръчва се подкрепа')],
                ['low_recent_activity', t('Low recent activity', 'Малка активност')],
                ['progress_has_slowed', t('Progress has slowed', 'Прогресът се забави')],
                ['needs_attention_cases', t('Needs attention: cases', 'Внимание: казуси')],
                ['needs_attention_quiz', t('Needs attention: quiz', 'Внимание: тестове')],
              ] as [SupportSignalId, string][]
            ).map(([id, label]) => {
              const n = summary.signalCounts[id];
              return (
                <Badge
                  key={id}
                  variant={n > 0 ? 'outline' : 'secondary'}
                  className={`min-h-[32px] px-3 ${n === 0 ? 'opacity-60' : ''}`}
                >
                  {label}: <span className="ml-1 font-mono">{n}</span>
                </Badge>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            {t(
              'Signals are developmental hints, not permanent labels. A student may carry more than one.',
              'Сигналите са развойни насоки, а не постоянни етикети. Един ученик може да носи повече от един.',
            )}
          </p>
        </Card>
      )}
    </div>
  );
}