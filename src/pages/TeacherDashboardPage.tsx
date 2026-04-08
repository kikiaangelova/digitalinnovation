import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Users, BookOpen, Rocket, Activity, GraduationCap, AlertTriangle,
  ArrowRight, Copy, Link2, ClipboardList, TrendingUp, Target,
  BarChart3, CheckCircle2, Clock, Plus, Download,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

interface Classroom {
  id: string;
  name: string;
  class_code: string;
  invite_link: string | null;
}

interface StudentData {
  student_id: string;
  display_name: string | null;
  full_name: string | null;
  total_xp: number;
  updated_at: string;
  joined_at: string;
}

interface ProgressSnapshot {
  student_id: string;
  cases_completed: number;
  sim_week: number;
  sim_complete: boolean;
  sim_grade: string | null;
  startup_sections: number;
  module_count: number;
}

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(173 58% 39%)',
  'hsl(38 92% 50%)',
  'hsl(280 60% 55%)',
  'hsl(0 72% 51%)',
];

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const t = (en: string, bg: string) => (lang === 'bg' ? bg : en);

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [progress, setProgress] = useState<ProgressSnapshot[]>([]);
  const [assignmentCount, setAssignmentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;

    // 1. Get teacher's classroom
    const { data: cls } = await supabase
      .from('classrooms')
      .select('id, name, class_code, invite_link')
      .eq('teacher_id', user.id)
      .eq('is_active', true)
      .maybeSingle();

    if (!cls) {
      setClassroom(null);
      setLoading(false);
      return;
    }
    setClassroom(cls as Classroom);

    // 2. Get students
    const { data: enrollments } = await supabase
      .from('classroom_students')
      .select('student_id, joined_at')
      .eq('classroom_id', cls.id);

    if (!enrollments?.length) {
      setStudents([]);
      setProgress([]);
      setLoading(false);
      return;
    }

    const studentIds = enrollments.map((e) => e.student_id);
    const joinMap = Object.fromEntries(enrollments.map((e) => [e.student_id, e.joined_at]));

    // 3. Get profiles
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, display_name, full_name, total_xp, updated_at')
      .in('user_id', studentIds);

    const studentList: StudentData[] = (profiles || []).map((p) => ({
      student_id: p.user_id,
      display_name: p.display_name,
      full_name: p.full_name,
      total_xp: p.total_xp,
      updated_at: p.updated_at,
      joined_at: joinMap[p.user_id] || '',
    }));
    setStudents(studentList);

    // 4. Get progress data in parallel
    const [subsRes, simRes, projRes, modRes, assignRes] = await Promise.all([
      supabase
        .from('submissions')
        .select('user_id')
        .eq('is_draft', false)
        .in('user_id', studentIds),
      supabase
        .from('simulator_progress')
        .select('user_id, current_week, is_complete, grade')
        .in('user_id', studentIds),
      supabase
        .from('startup_projects')
        .select('user_id, problem, customer, value_proposition, digital_product, business_model, growth_strategy, final_pitch')
        .in('user_id', studentIds),
      supabase
        .from('learning_module_responses')
        .select('user_id')
        .in('user_id', studentIds),
      supabase
        .from('classroom_assignments')
        .select('id')
        .eq('classroom_id', cls.id),
    ]);

    setAssignmentCount(assignRes.data?.length || 0);

    // Build per-student snapshots
    const subsCountMap: Record<string, number> = {};
    (subsRes.data || []).forEach((s) => {
      subsCountMap[s.user_id] = (subsCountMap[s.user_id] || 0) + 1;
    });

    const simMap = Object.fromEntries(
      (simRes.data || []).map((s) => [s.user_id, s])
    );

    const STARTUP_KEYS = ['problem', 'customer', 'value_proposition', 'digital_product', 'business_model', 'growth_strategy', 'final_pitch'] as const;
    const projMap: Record<string, number> = {};
    (projRes.data || []).forEach((p: any) => {
      projMap[p.user_id] = STARTUP_KEYS.filter((k) => (p[k] || '').trim().length > 10).length;
    });

    const modCountMap: Record<string, number> = {};
    (modRes.data || []).forEach((m) => {
      modCountMap[m.user_id] = (modCountMap[m.user_id] || 0) + 1;
    });

    const snapshots: ProgressSnapshot[] = studentIds.map((sid) => ({
      student_id: sid,
      cases_completed: subsCountMap[sid] || 0,
      sim_week: simMap[sid]?.current_week || 0,
      sim_complete: simMap[sid]?.is_complete || false,
      sim_grade: simMap[sid]?.grade || null,
      startup_sections: projMap[sid] || 0,
      module_count: modCountMap[sid] || 0,
    }));
    setProgress(snapshots);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const siteUrl = window.location.origin;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} ${t('copied!', 'копиран!')}`);
  };

  // ── Derived stats ──
  const progressMap = Object.fromEntries(progress.map((p) => [p.student_id, p]));

  const getOverall = (sid: string) => {
    const p = progressMap[sid];
    if (!p) return 0;
    const casePct = Math.min(p.cases_completed * 20, 100); // cap at 5 cases
    const simPct = Math.min((p.sim_week / 6) * 100, 100);
    const startupPct = Math.min((p.startup_sections / 7) * 100, 100);
    const modPct = Math.min(p.module_count * 20, 100);
    return Math.round((casePct + simPct + startupPct + modPct) / 4);
  };

  const getName = (s: StudentData) => s.display_name || s.full_name || '—';

  const activeThisWeek = students.filter((s) => {
    const d = (Date.now() - new Date(s.updated_at).getTime()) / 86400000;
    return d <= 7;
  }).length;

  const struggling = students.filter((s) => {
    const p = progressMap[s.student_id];
    if (!p) return true;
    const overall = getOverall(s.student_id);
    const daysSinceUpdate = (Date.now() - new Date(s.updated_at).getTime()) / 86400000;
    // Intervention criteria: score below 50% OR stuck (no activity for 7+ days)
    return overall < 50 || daysSinceUpdate > 7;
  });

  const avgXp = students.length
    ? Math.round(students.reduce((a, s) => a + s.total_xp, 0) / students.length)
    : 0;

  // Chart: activity distribution
  const activityData = [
    { name: t('Cases', 'Казуси'), value: progress.filter((p) => p.cases_completed > 0).length },
    { name: t('Simulator', 'Симулатор'), value: progress.filter((p) => p.sim_week > 0).length },
    { name: t('Startup', 'Стартъп'), value: progress.filter((p) => p.startup_sections > 0).length },
    { name: t('Modules', 'Модули'), value: progress.filter((p) => p.module_count > 0).length },
  ];

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          {t('Loading...', 'Зареждане...')}
        </div>
      </div>
    );
  }

  // ── No classroom yet ──
  if (!classroom) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto px-4 py-16 max-w-lg text-center space-y-6">
          <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">
            {t('Welcome, Teacher!', 'Добре дошли, учителю!')}
          </h1>
          <p className="text-muted-foreground">
            {t(
              'Create your first classroom to start managing students and tracking their progress.',
              'Създайте първата си класна стая, за да управлявате учениците и проследявате техния напредък.'
            )}
          </p>
          <Button onClick={() => navigate('/teacher')} size="lg" className="sim-gradient border-0 gap-2">
            <Plus className="h-5 w-5" />
            {t('Create Classroom', 'Създай класна стая')}
          </Button>
        </main>
      </div>
    );
  }

  // ── Main Dashboard ──
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              {t('Teacher Dashboard', 'Учителско табло')}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {classroom.name} · {t('Code:', 'Код:')} <span className="font-mono font-bold text-primary">{classroom.class_code}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(classroom.class_code, t('Code', 'Кодът'))}
            >
              <Copy className="h-3.5 w-3.5 mr-1" />
              {t('Copy code', 'Копирай код')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                copyToClipboard(
                  classroom.invite_link || `${siteUrl}/join/${classroom.class_code}`,
                  t('Link', 'Линкът')
                )
              }
            >
              <Link2 className="h-3.5 w-3.5 mr-1" />
              {t('Copy invite', 'Копирай покана')}
            </Button>
            <Button size="sm" onClick={() => navigate('/teacher')} className="gap-1">
              {t('Manage Class', 'Управлявай класа')} <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard icon={Users} label={t('Students', 'Ученици')} value={students.length} />
          <StatCard
            icon={Activity}
            label={t('Active this week', 'Активни тази седмица')}
            value={activeThisWeek}
            accent={activeThisWeek > 0 ? 'text-green-600 dark:text-green-400' : undefined}
          />
          <StatCard
            icon={AlertTriangle}
            label={t('Need attention', 'Нуждаят се от внимание')}
            value={struggling.length}
            accent={struggling.length > 0 ? 'text-amber-600 dark:text-amber-400' : undefined}
          />
          <StatCard icon={Target} label={t('Avg XP', 'Ср. XP')} value={avgXp} />
          <StatCard icon={ClipboardList} label={t('Assignments', 'Задачи')} value={assignmentCount} />
        </div>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Student engagement chart + struggling students */}
          <div className="md:col-span-2 space-y-6">
            {/* Activity chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  {t('Student Engagement by Area', 'Ангажираност на учениците по области')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {t('No students enrolled yet.', 'Все още няма записани ученици.')}
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={activityData} barSize={36}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(v: number) => [`${v} ${t('students', 'ученици')}`, '']} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {activityData.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Student progress table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  {t('Student Progress', 'Напредък на учениците')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <EmptyState message={t('Share your class code to invite students.', 'Сподели кода на класа, за да поканиш ученици.')} />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">{t('Student', 'Ученик')}</th>
                          <th className="text-center py-2 px-2 text-muted-foreground font-medium">XP</th>
                          <th className="text-center py-2 px-2 text-muted-foreground font-medium">{t('Cases', 'Казуси')}</th>
                          <th className="text-center py-2 px-2 text-muted-foreground font-medium">{t('Sim', 'Сим.')}</th>
                          <th className="text-center py-2 px-2 text-muted-foreground font-medium">{t('Startup', 'Стартъп')}</th>
                          <th className="py-2 px-2 text-muted-foreground font-medium">{t('Overall', 'Общо')}</th>
                          <th className="py-2 px-2 text-muted-foreground font-medium">{t('Status', 'Статус')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {students
                          .sort((a, b) => getOverall(b.student_id) - getOverall(a.student_id))
                          .map((s) => {
                            const p = progressMap[s.student_id];
                            const overall = getOverall(s.student_id);
                            const daysSince = (Date.now() - new Date(s.updated_at).getTime()) / 86400000;
                            const status =
                              daysSince <= 7
                                ? { label: t('Active', 'Активен'), cls: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' }
                                : daysSince <= 14
                                ? { label: t('Idle', 'Неактивен'), cls: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' }
                                : { label: t('Inactive', 'Спрял'), cls: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };

                            return (
                              <tr key={s.student_id} className="hover:bg-muted/30">
                                <td className="py-2.5 px-3 font-medium text-foreground">{getName(s)}</td>
                                <td className="text-center py-2.5 px-2 text-muted-foreground">{s.total_xp}</td>
                                <td className="text-center py-2.5 px-2">{p?.cases_completed || 0}</td>
                                <td className="text-center py-2.5 px-2">
                                  {p?.sim_complete ? (
                                    <Badge variant="outline" className="text-xs">{p.sim_grade || '✓'}</Badge>
                                  ) : (
                                    <span className="text-muted-foreground">{p?.sim_week || 0}/6</span>
                                  )}
                                </td>
                                <td className="text-center py-2.5 px-2">
                                  <span className="text-muted-foreground">{p?.startup_sections || 0}/7</span>
                                </td>
                                <td className="py-2.5 px-2">
                                  <div className="flex items-center gap-2">
                                    <Progress value={overall} className="h-2 flex-1 max-w-[80px]" />
                                    <span className="text-xs text-muted-foreground w-8">{overall}%</span>
                                  </div>
                                </td>
                                <td className="py-2.5 px-2">
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${status.cls}`}>{status.label}</span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Quick actions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('Quick Actions', 'Бързи действия')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => navigate('/teacher')}>
                  <Users className="h-4 w-4" /> {t('Manage Students', 'Управлявай ученици')}
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => navigate('/teacher')}>
                  <ClipboardList className="h-4 w-4" /> {t('Assign Task', 'Назначи задача')}
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => navigate('/cases')}>
                  <BookOpen className="h-4 w-4" /> {t('Browse Cases', 'Разгледай казуси')}
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => navigate('/learn')}>
                  <GraduationCap className="h-4 w-4" /> {t('Learning Modules', 'Учебни модули')}
                </Button>
              </CardContent>
            </Card>

            {/* Students needing attention */}
            <Card className={struggling.length > 0 ? 'border-amber-500/30' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className={`h-4 w-4 ${struggling.length > 0 ? 'text-amber-500' : 'text-muted-foreground'}`} />
                  {t('Need Attention', 'Нуждаят се от внимание')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {struggling.length === 0 ? (
                  <div className="text-center py-4">
                    <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {t('All students are on track!', 'Всички ученици вървят по план!')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {struggling.slice(0, 5).map((s) => {
                      const overall = getOverall(s.student_id);
                      const daysSince = Math.round((Date.now() - new Date(s.updated_at).getTime()) / 86400000);
                      return (
                        <div key={s.student_id} className="flex items-center justify-between text-sm">
                          <div>
                            <p className="font-medium text-foreground">{getName(s)}</p>
                            <p className="text-xs text-muted-foreground">
                              {overall}% · {daysSince > 14 ? t(`${daysSince}d inactive`, `${daysSince}д неактивен`) : t('low progress', 'нисък напредък')}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                            {overall}%
                          </Badge>
                        </div>
                      );
                    })}
                    {struggling.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{struggling.length - 5} {t('more', 'още')}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Class insights */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-primary" />
                  {t('Class Insights', 'Обзор на класа')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <InsightRow
                  label={t('Avg stage completion', 'Ср. завършени етапи')}
                  value={
                    progress.length
                      ? `${(progress.reduce((a, p) => {
                          let stages = 0;
                          if (p.cases_completed >= 1) stages++;
                          if (p.cases_completed >= 2) stages++;
                          if (p.startup_sections >= 3) stages++;
                          if (p.startup_sections >= 5) stages++;
                          if (p.sim_week >= 3) stages++;
                          if (p.sim_complete) stages++;
                          return a + stages;
                        }, 0) / progress.length).toFixed(1)} / 6 ${t('stages', 'етапа')}`
                      : '0 / 6'
                  }
                />
                <InsightRow
                  label={t('Completed simulations', 'Завършени симулации')}
                  value={`${progress.filter((p) => p.sim_complete).length}/${students.length}`}
                />
                <InsightRow
                  label={t('Started startup projects', 'Започнати стартъп проекти')}
                  value={`${progress.filter((p) => p.startup_sections > 0).length}/${students.length}`}
                />
                <InsightRow
                  label={t('Avg cases completed', 'Ср. завършени казуси')}
                  value={
                    progress.length
                      ? (progress.reduce((a, p) => a + p.cases_completed, 0) / progress.length).toFixed(1)
                      : '0'
                  }
                />
                <InsightRow
                  label={t('Avg modules done', 'Ср. модули')}
                  value={
                    progress.length
                      ? (progress.reduce((a, p) => a + p.module_count, 0) / progress.length).toFixed(1)
                      : '0'
                  }
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Sub-components ──

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  accent?: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className={`text-xl font-bold ${accent || 'text-foreground'}`}>{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function InsightRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-8">
      <Users className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
