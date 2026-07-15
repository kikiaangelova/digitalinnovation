/**
 * StudentsTab — /teacher-new "Students".
 *
 * A searchable, sortable table of the classroom roster with expandable
 * per-student detail (pillar breakdown, signals, last 3 quizzes). Uses
 * the same canonical `computeStudentMetrics` output as the Overview so
 * numbers never disagree between tabs.
 *
 * Names shown: `display_name` if set, else `full_name`, else a masked
 * placeholder. Email/phone are never fetched, never rendered — teachers
 * see only pedagogically relevant fields.
 */

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronDown, ChevronRight, Search, Users } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import type { ClassroomStudent } from '@/hooks/useClassroomStudents';
import type { StudentMetrics } from '@/lib/teacherMetrics';
import { describeActivityStatus } from '@/lib/teacherMetrics';
import type { StudentProgressRow } from '@/hooks/useStudentProgress';

type SortKey = 'name' | 'overall' | 'activity' | 'xp';

interface Props {
  students: ClassroomStudent[];
  metricsById: Record<string, StudentMetrics>;
  progressById: Record<string, StudentProgressRow>;
  loading: boolean;
}

function useT() {
  const { lang } = useLang();
  return (en: string, bg: string) => (lang === 'bg' ? bg : en);
}

function studentLabel(s: ClassroomStudent): string {
  return s.display_name?.trim() || s.full_name?.trim() || '••••';
}

function activityTone(status: StudentMetrics['activityStatus']): string {
  switch (status) {
    case 'active':
      return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300';
    case 'low_recent_activity':
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-300';
    case 'support_recommended':
      return 'bg-rose-500/15 text-rose-700 dark:text-rose-300';
    case 'not_yet_started':
      return 'bg-muted text-muted-foreground';
  }
}

export default function StudentsTab({
  students,
  metricsById,
  progressById,
  loading,
}: Props) {
  const t = useT();
  const { lang } = useLang();
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('overall');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expanded, setExpanded] = useState<string | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = students.filter((s) =>
      q ? studentLabel(s).toLowerCase().includes(q) : true,
    );
    const activityRank: Record<StudentMetrics['activityStatus'], number> = {
      support_recommended: 3,
      not_yet_started: 2,
      low_recent_activity: 1,
      active: 0,
    };
    const dir = sortDir === 'asc' ? 1 : -1;
    return filtered.sort((a, b) => {
      const ma = metricsById[a.student_id];
      const mb = metricsById[b.student_id];
      switch (sortKey) {
        case 'name':
          return studentLabel(a).localeCompare(studentLabel(b)) * dir;
        case 'xp':
          return (a.total_xp - b.total_xp) * dir;
        case 'activity':
          return (
            ((ma ? activityRank[ma.activityStatus] : -1) -
              (mb ? activityRank[mb.activityStatus] : -1)) *
            dir
          );
        case 'overall':
        default:
          return ((ma?.overall ?? -1) - (mb?.overall ?? -1)) * dir;
      }
    });
  }, [students, query, sortKey, sortDir, metricsById]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'name' ? 'asc' : 'desc');
    }
  };

  if (students.length === 0 && !loading) {
    return (
      <Card className="p-8 text-center space-y-3">
        <Users className="mx-auto h-10 w-10 text-primary/80" />
        <p className="text-sm text-muted-foreground">
          {t(
            'No students yet — share your class code from the header to invite them.',
            'Все още няма ученици — споделете кода от горния панел, за да ги поканите.',
          )}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Search + sort */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('Search students…', 'Търсене на ученици…')}
            className="pl-9 min-h-[44px]"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {(
            [
              ['overall', t('Progress', 'Прогрес')],
              ['activity', t('Activity', 'Активност')],
              ['xp', 'XP'],
              ['name', t('Name', 'Име')],
            ] as [SortKey, string][]
          ).map(([key, label]) => (
            <Button
              key={key}
              size="sm"
              variant={sortKey === key ? 'default' : 'outline'}
              className="min-h-[44px]"
              onClick={() => toggleSort(key)}
            >
              {label}
              {sortKey === key && (
                <span className="ml-1 text-xs">{sortDir === 'asc' ? '↑' : '↓'}</span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {rows.map((s) => {
          const m = metricsById[s.student_id];
          const p = progressById[s.student_id];
          const isOpen = expanded === s.student_id;
          const name = studentLabel(s);
          return (
            <Card key={s.student_id} className="p-0 overflow-hidden">
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : s.student_id)}
                className="w-full text-left p-3 sm:p-4 flex items-center gap-3 hover:bg-muted/40 transition-colors min-h-[64px]"
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium truncate">{name}</span>
                    {m && (
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full ${activityTone(
                          m.activityStatus,
                        )}`}
                      >
                        {describeActivityStatus(m.activityStatus, lang)}
                        {m.daysSinceActivity != null && (
                          <span className="ml-1 opacity-70">
                            · {Math.round(m.daysSinceActivity)}d
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Progress value={m?.overall ?? 0} className="h-1.5 flex-1" />
                    <span className="font-mono text-xs text-muted-foreground w-10 text-right">
                      {m?.overall ?? 0}%
                    </span>
                  </div>
                </div>
                <div className="hidden sm:block text-right shrink-0">
                  <p className="text-xs text-muted-foreground">XP</p>
                  <p className="font-mono text-sm">{s.total_xp.toLocaleString()}</p>
                </div>
              </button>

              {isOpen && m && p && (
                <div className="border-t p-3 sm:p-4 space-y-4 bg-muted/20">
                  {/* Pillar breakdown */}
                  <div className="grid gap-2 sm:grid-cols-2">
                    <PillarLine label={t('Cases', 'Казуси')} pct={m.breakdown.cases} sub={`${p.cases_completed} ${t('completed', 'завършени')}`} />
                    <PillarLine
                      label={t('Simulator', 'Симулатор')}
                      pct={m.breakdown.simulator}
                      sub={
                        p.sim_complete
                          ? t(`Complete${p.sim_grade ? ' · ' + p.sim_grade : ''}`, `Завършен${p.sim_grade ? ' · ' + p.sim_grade : ''}`)
                          : t(`Week ${p.sim_week}/6`, `Седмица ${p.sim_week}/6`)
                      }
                    />
                    <PillarLine
                      label={t('Startup', 'Стартъп')}
                      pct={m.breakdown.startup}
                      sub={t(
                        `${p.startup_narrative_filled}/7 narrative · ${p.startup_bmc_filled}/9 BMC${p.startup_submitted ? ' · submitted' : ''}`,
                        `${p.startup_narrative_filled}/7 текст · ${p.startup_bmc_filled}/9 BMC${p.startup_submitted ? ' · подаден' : ''}`,
                      )}
                    />
                    <PillarLine
                      label={t('Modules', 'Модули')}
                      pct={m.breakdown.modules}
                      sub={`${p.modules_completed} ${t('completed', 'завършени')}`}
                    />
                  </div>

                  {/* Signals */}
                  {m.signals.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                        {t('Support signals', 'Сигнали за подкрепа')}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {m.signals.map((sig) => (
                          <Badge
                            key={sig.id}
                            variant="outline"
                            className={
                              sig.severity === 'support'
                                ? 'border-rose-500/50'
                                : sig.severity === 'attention'
                                  ? 'border-amber-500/50'
                                  : ''
                            }
                          >
                            {sig.label(lang)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent quizzes */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                      {t('Recent quizzes', 'Скорошни тестове')}
                      {p.quiz_count > 0 && (
                        <span className="ml-2 font-mono">
                          {t('avg', 'средно')} {p.quiz_avg}%
                        </span>
                      )}
                    </p>
                    {p.recent_quizzes.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        {t('No quiz attempts yet.', 'Все още няма опити от тестове.')}
                      </p>
                    ) : (
                      <ul className="space-y-1 text-xs">
                        {p.recent_quizzes.map((q, i) => {
                          const pct = q.max_score > 0 ? Math.round((q.score / q.max_score) * 100) : 0;
                          return (
                            <li key={i} className="flex items-center justify-between gap-2">
                              <span className="truncate">{q.category}</span>
                              <span className="font-mono text-muted-foreground shrink-0">
                                {q.score}/{q.max_score} · {pct}%
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function PillarLine({ label, pct, sub }: { label: string; pct: number; sub?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="font-mono text-muted-foreground">{pct}%</span>
      </div>
      <Progress value={pct} className="h-1.5 mt-1" />
      {sub && <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}