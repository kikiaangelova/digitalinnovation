/**
 * Unified Teacher Workspace — step 1c.
 *
 * Route: `/teacher-new` (feature-flagged behind `teacher-workspace-v2`).
 * Legacy `/teacher`, `/teacher-dashboard`, `/admin/teacher` remain live
 * and unchanged. Step 1c wires up the Overview and Students tabs with
 * real progress data via `useStudentProgress`; other tabs still show
 * labelled placeholders naming the step that will port them.
 *
 * Layout
 * ------
 *   Header  ── classroom name, invite code, active-this-week count
 *   Tabs    ── horizontal, scrollable on narrow screens (min tap 44 px)
 *   Body    ── one panel per tab
 *
 * The Admin tab is only rendered for admin users; verified teachers do
 * not see it. All other tabs render for both roles.
 */

import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Rocket,
  LineChart,
  MessageSquare,
  FileText,
  Megaphone,
  Shield,
  AlertTriangle,
  Loader2,
  School,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { useClassroomStudents } from '@/hooks/useClassroomStudents';
import { useClassroomAssignments } from '@/hooks/useClassroomAssignments';
import { useStudentProgress } from '@/hooks/useStudentProgress';
import { useTeacherClassrooms } from '@/hooks/useTeacherClassrooms';
import { useModuleCatalog } from '@/hooks/useModuleCatalog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { PILOT_SUBJECT_KEY } from '@/lib/teacher-assignments';
import { isFeatureEnabled, enableFeatureFlag } from '@/lib/featureFlags';
import OverviewTab from '@/components/teacher-workspace/OverviewTab';
import StudentsTab from '@/components/teacher-workspace/StudentsTab';
import AssignmentsTab from '@/components/teacher-workspace/AssignmentsTab';

type TabId =
  | 'overview'
  | 'students'
  | 'assignments'
  | 'startups-simulator'
  | 'analytics'
  | 'feedback'
  | 'reports'
  | 'communication'
  | 'admin';

interface TabDef {
  id: TabId;
  labelEn: string;
  labelBg: string;
  Icon: typeof LayoutDashboard;
  /** Which follow-up step ports this tab from the legacy pages. */
  portsInStep: string;
  adminOnly?: boolean;
}

const TABS: readonly TabDef[] = [
  { id: 'overview',           labelEn: 'Overview',              labelBg: 'Общ преглед',         Icon: LayoutDashboard, portsInStep: '1c' },
  { id: 'students',           labelEn: 'Students',              labelBg: 'Ученици',             Icon: Users,           portsInStep: '1c' },
  { id: 'assignments',        labelEn: 'Assignments',           labelBg: 'Задачи',              Icon: ClipboardList,   portsInStep: '1d' },
  { id: 'startups-simulator', labelEn: 'Startups & Simulator',  labelBg: 'Стартъпи и симулатор', Icon: Rocket,          portsInStep: '1e' },
  { id: 'analytics',          labelEn: 'Analytics',             labelBg: 'Анализ',              Icon: LineChart,       portsInStep: '1f' },
  { id: 'feedback',           labelEn: 'Feedback',              labelBg: 'Обратна връзка',      Icon: MessageSquare,   portsInStep: '1g' },
  { id: 'reports',            labelEn: 'Reports',               labelBg: 'Отчети',              Icon: FileText,        portsInStep: '1g' },
  { id: 'communication',      labelEn: 'Communication',         labelBg: 'Комуникация',         Icon: Megaphone,       portsInStep: '1h' },
  { id: 'admin',              labelEn: 'Admin',                 labelBg: 'Администратор',       Icon: Shield,          portsInStep: '1h', adminOnly: true },
] as const;

/* ------------------------------------------------------------------ */

function useT() {
  const { lang } = useLang();
  return (en: string, bg: string) => (lang === 'bg' ? bg : en);
}

/* ------------------------------------------------------------------ */
/*  Feature-flag gate                                                  */
/* ------------------------------------------------------------------ */

function PreviewGate() {
  const t = useT();
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="mx-auto max-w-2xl px-4 py-16">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <h1 className="text-xl font-semibold">
              {t('Preview build', 'Предварителна версия')}
            </h1>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t(
              'The unified Teacher Workspace is under active development. Existing routes /teacher, /teacher-dashboard and /admin/teacher remain fully functional and are the supported way to work today. Enable the preview only if you are helping test the migration.',
              'Обединеното учителско пространство е в активна разработка. Съществуващите маршрути /teacher, /teacher-dashboard и /admin/teacher продължават да работят и са препоръчаният начин за работа днес. Активирайте прегледа само ако помагате за тестването на миграцията.',
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => {
                enableFeatureFlag('teacher-workspace-v2');
                window.location.reload();
              }}
            >
              {t('Enable preview', 'Активирай прегледа')}
            </Button>
            <Button variant="outline" asChild>
              <a href="/teacher">{t('Go to current workspace', 'Към текущото пространство')}</a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('You can turn the preview off any time by removing the ff:teacher-workspace-v2 key from browser storage.',
               'Можете да изключите прегледа по всяко време, като изтриете ключа ff:teacher-workspace-v2 от локалното хранилище.')}
          </p>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty / error / loading states                                     */
/* ------------------------------------------------------------------ */

function CenteredState({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="mx-auto max-w-3xl px-4 py-16">{children}</div>
    </div>
  );
}

function LoadingState() {
  const t = useT();
  return (
    <CenteredState>
      <div className="flex items-center justify-center gap-3 py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        {t('Loading workspace…', 'Зареждане на пространството…')}
      </div>
    </CenteredState>
  );
}

function ErrorState({ message }: { message: string }) {
  const t = useT();
  return (
    <CenteredState>
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t('Could not load workspace', 'Пространството не може да се зареди')}</AlertTitle>
        <AlertDescription className="mt-2 text-sm">{message}</AlertDescription>
      </Alert>
    </CenteredState>
  );
}

function NoClassroomState() {
  const t = useT();
  return (
    <CenteredState>
      <Card className="p-8 text-center space-y-4">
        <School className="mx-auto h-10 w-10 text-primary" />
        <h2 className="text-xl font-semibold">
          {t('You do not have an active classroom yet', 'Все още нямате активна класна стая')}
        </h2>
        <p className="text-muted-foreground text-sm">
          {t(
            'Create your classroom in the current teacher workspace, then return here. Feature parity is still being built — for now, classroom creation lives on the /teacher page.',
            'Създайте класната си стая в текущото учителско пространство и се върнете тук. Пълната функционалност все още се пренася — засега създаването става в /teacher.',
          )}
        </p>
        <Button asChild>
          <a href="/teacher">{t('Open /teacher to create one', 'Отвори /teacher за създаване')}</a>
        </Button>
      </Card>
    </CenteredState>
  );
}

/* ------------------------------------------------------------------ */
/*  Placeholder tab body                                               */
/* ------------------------------------------------------------------ */

function TabPlaceholder({ tab }: { tab: TabDef }) {
  const t = useT();
  const { Icon } = tab;
  return (
    <Card className="p-8 text-center space-y-3">
      <Icon className="mx-auto h-10 w-10 text-primary/80" />
      <h3 className="text-lg font-semibold">{t(tab.labelEn, tab.labelBg)}</h3>
      <p className="text-sm text-muted-foreground">
        {t(
          `This tab is scheduled for step ${tab.portsInStep} of the Teacher Workspace migration.`,
          `Този раздел е планиран за стъпка ${tab.portsInStep} от миграцията на учителското пространство.`,
        )}
      </p>
      <p className="text-xs text-muted-foreground">
        {t(
          'Nothing here yet — the existing dashboards remain the source of truth.',
          'Все още няма съдържание тук — съществуващите табла остават актуалният източник.',
        )}
      </p>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Header block                                                       */
/* ------------------------------------------------------------------ */

function WorkspaceHeader({
  classroomName,
  classCode,
  inviteLink,
  studentCount,
  classrooms,
  selectedId,
  onSelect,
}: {
  classroomName: string;
  classCode: string;
  inviteLink: string | null;
  studentCount: number;
  classrooms: { id: string; name: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const t = useT();
  const copy = (text: string, label: string) => {
    try {
      void navigator.clipboard.writeText(text);
      toast.success(`${label} ${t('copied', 'копирано')}`);
    } catch {
      toast.error(t('Copy failed', 'Копирането не успя'));
    }
  };
  return (
    <Card className="p-4 sm:p-6 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <School className="h-5 w-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-semibold">{classroomName}</h1>
            <Badge variant="secondary" className="uppercase tracking-wide">
              {t('Preview', 'Преглед')}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {studentCount} {t('students', 'ученици')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-mono text-sm min-h-[44px] px-3 flex items-center">
            {classCode}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            className="min-h-[44px]"
            onClick={() => copy(classCode, t('Code', 'Кодът'))}
          >
            <Copy className="h-4 w-4 mr-1" /> {t('Copy code', 'Копирай кода')}
          </Button>
          {inviteLink && (
            <Button
              size="sm"
              variant="outline"
              className="min-h-[44px]"
              onClick={() => copy(inviteLink, t('Link', 'Линкът'))}
            >
              <Copy className="h-4 w-4 mr-1" /> {t('Copy link', 'Копирай линка')}
            </Button>
          )}
        </div>
      </div>
      {classrooms.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {t('Classroom', 'Класна стая')}
          </span>
          <Select value={selectedId} onValueChange={onSelect}>
            <SelectTrigger className="min-h-[44px] w-full sm:w-72" aria-label={t('Select classroom', 'Избери класна стая')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {classrooms.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function TeacherWorkspace() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const t = useT();
  const { classroom, students, loading, error } = useClassroomStudents();
  const { assignments, loading: assignmentsLoading } = useClassroomAssignments(
    classroom?.id ?? null,
  );

  const studentIds = useMemo(() => students.map((s) => s.student_id), [students]);
  const lastActivityById = useMemo(
    () => Object.fromEntries(students.map((s) => [s.student_id, s.updated_at])),
    [students],
  );
  const totalXpById = useMemo(
    () => Object.fromEntries(students.map((s) => [s.student_id, s.total_xp])),
    [students],
  );
  const {
    progressById,
    metricsById,
    loading: progressLoading,
  } = useStudentProgress(studentIds, {
    lastActivityById,
    totalXpById,
    hasAssignedCases: assignments.some((a) => a.assignment_type === 'case'),
  });

  const visibleTabs = useMemo(
    () => TABS.filter((tab) => !tab.adminOnly || isAdmin),
    [isAdmin],
  );

  // Auth still resolving
  if (authLoading) return <LoadingState />;

  // Not authenticated at all
  if (!user) return <Navigate to="/auth" replace />;

  // Feature-flag gate — soft, reversible
  if (!isFeatureEnabled('teacher-workspace-v2')) return <PreviewGate />;

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!classroom) return <NoClassroomState />;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4">
        <WorkspaceHeader
          classroomName={classroom.name}
          classCode={classroom.class_code}
          inviteLink={classroom.invite_link}
          studentCount={students.length}
        />

        <Tabs defaultValue="overview" className="space-y-4">
          {/* Horizontally scrollable tab bar for narrow screens */}
          <div className="-mx-3 sm:mx-0 overflow-x-auto">
            <TabsList className="inline-flex w-max min-w-full h-auto p-1 gap-1">
              {visibleTabs.map((tab) => {
                const { Icon } = tab;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="min-h-[44px] px-3 gap-2 whitespace-nowrap"
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    <span className="text-sm">{t(tab.labelEn, tab.labelBg)}</span>
                    {tab.adminOnly && (
                      <Badge variant="secondary" className="ml-1 text-[10px] uppercase">
                        {t('Admin', 'Админ')}
                      </Badge>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {visibleTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              {tab.id === 'overview' ? (
                <OverviewTab
                  metricsById={metricsById}
                  studentCount={students.length}
                  assignments={assignments}
                  loading={progressLoading || assignmentsLoading}
                />
              ) : tab.id === 'students' ? (
                <StudentsTab
                  students={students}
                  metricsById={metricsById}
                  progressById={progressById}
                  loading={progressLoading}
                />
              ) : (
                <TabPlaceholder tab={tab} />
              )}
            </TabsContent>
          ))}
        </Tabs>

        <p className="text-xs text-muted-foreground text-center px-4">
          {t(
            'This is /teacher-new (preview). The current /teacher, /teacher-dashboard and /admin/teacher pages remain live and unchanged.',
            'Това е /teacher-new (преглед). Настоящите /teacher, /teacher-dashboard и /admin/teacher остават активни и непроменени.',
          )}
        </p>
      </div>
    </div>
  );
}