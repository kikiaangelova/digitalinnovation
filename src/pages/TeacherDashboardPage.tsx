import { useEffect, useState, useCallback } from 'react';
import { deriveJourneyStatuses } from '@/lib/journey';
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
  BarChart3, CheckCircle2, Clock, Plus, Download, ChevronDown, ChevronUp,
  Search, Lightbulb, PenTool, Wrench, Gauge, Presentation,
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

interface QuizEntry {
  category: string | null;
  score: number;
  max_score: number;
  created_at: string;
}

interface ProgressSnapshot {
  student_id: string;
  cases_completed: number;
  sim_week: number;
  sim_complete: boolean;
  sim_grade: string | null;
  startup_sections: number;
  startup_keys: Record<string, boolean>;
  startup_submitted: boolean;
  bmc_keys: Record<string, boolean>;
  module_count: number;
  quiz_avg: number;
  recent_quizzes: QuizEntry[];
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
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;

    // 1. Try to get teacher's classroom (optional)
    const { data: cls } = await supabase
      .from('classrooms')
      .select('id, name, class_code, invite_link')
      .eq('teacher_id', user.id)
      .eq('is_active', true)
      .maybeSingle();

    setClassroom(cls as Classroom | null);

    // 2. Get ALL students (users with student role)
    const { data: studentRoles } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'student');

    const studentIds = (studentRoles || []).map((r) => r.user_id).filter((id) => id !== user.id);

    if (!studentIds.length) {
      setStudents([]);
      setProgress([]);
      setLoading(false);
      return;
    }

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
      joined_at: p.updated_at,
    }));
    setStudents(studentList);

    // 4. Get progress data in parallel
    const [subsRes, simRes, projRes, modRes, assignRes, quizRes] = await Promise.all([
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
        .select('user_id, problem, customer, value_proposition, digital_product, business_model, growth_strategy, final_pitch, is_submitted, bmc_customer_segments, bmc_value_proposition, bmc_channels, bmc_customer_relationships, bmc_revenue_streams, bmc_key_resources, bmc_key_activities, bmc_key_partners, bmc_cost_structure')
        .in('user_id', studentIds),
      supabase
        .from('learning_module_responses')
        .select('user_id')
        .in('user_id', studentIds),
      cls
        ? supabase.from('classroom_assignments').select('id').eq('classroom_id', cls.id)
        : Promise.resolve({ data: [] }),
      supabase
        .from('quiz_results')
        .select('user_id, score, max_score, category, created_at')
        .in('user_id', studentIds)
        .order('created_at', { ascending: false }),
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
    const BMC_KEYS = ['bmc_customer_segments', 'bmc_value_proposition', 'bmc_channels', 'bmc_customer_relationships', 'bmc_revenue_streams', 'bmc_key_resources', 'bmc_key_activities', 'bmc_key_partners', 'bmc_cost_structure'] as const;
    const projMap: Record<string, { count: number; keys: Record<string, boolean>; submitted: boolean; bmcKeys: Record<string, boolean> }> = {};
    (projRes.data || []).forEach((p: any) => {
      const keys: Record<string, boolean> = {};
      STARTUP_KEYS.forEach((k) => { keys[k] = (p[k] || '').trim().length > 10; });
      const bmcKeys: Record<string, boolean> = {};
      BMC_KEYS.forEach((k) => { bmcKeys[k] = (p[k] || '').trim().length > 10; });
      projMap[p.user_id] = {
        count: STARTUP_KEYS.filter((k) => keys[k]).length,
        keys,
        submitted: !!p.is_submitted,
        bmcKeys,
      };
    });

    const modCountMap: Record<string, number> = {};
    (modRes.data || []).forEach((m) => {
      modCountMap[m.user_id] = (modCountMap[m.user_id] || 0) + 1;
    });

    const quizScores: Record<string, { total: number; count: number }> = {};
    const recentQuizzes: Record<string, QuizEntry[]> = {};
    (quizRes.data || []).forEach((q: any) => {
      if (!quizScores[q.user_id]) quizScores[q.user_id] = { total: 0, count: 0 };
      const pct = q.max_score > 0 ? (q.score / q.max_score) * 100 : 0;
      quizScores[q.user_id].total += pct;
      quizScores[q.user_id].count += 1;
      if (!recentQuizzes[q.user_id]) recentQuizzes[q.user_id] = [];
      if (recentQuizzes[q.user_id].length < 3) {
        recentQuizzes[q.user_id].push({ category: q.category, score: q.score, max_score: q.max_score, created_at: q.created_at });
      }
    });

    const snapshots: ProgressSnapshot[] = studentIds.map((sid) => ({
      student_id: sid,
      cases_completed: subsCountMap[sid] || 0,
      sim_week: simMap[sid]?.current_week || 0,
      sim_complete: simMap[sid]?.is_complete || false,
      sim_grade: simMap[sid]?.grade || null,
      startup_sections: projMap[sid]?.count || 0,
      startup_keys: projMap[sid]?.keys || {},
      startup_submitted: projMap[sid]?.submitted || false,
      bmc_keys: projMap[sid]?.bmcKeys || {},
      module_count: modCountMap[sid] || 0,
      quiz_avg: quizScores[sid] ? Math.round(quizScores[sid].total / quizScores[sid].count) : 0,
      recent_quizzes: recentQuizzes[sid] || [],
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

  const STAGE_NAMES_EN = ['Discover', 'Analyze', 'Design', 'Build', 'Simulate', 'Pitch'];
  const STAGE_NAMES_BG = ['Откривай', 'Анализирай', 'Проектирай', 'Изгради', 'Симулирай', 'Представи'];

  const getStudentStage = (sid: string): { num: number; name: string } => {
    const p = progressMap[sid];
    if (!p) return { num: 0, name: t('Not started', 'Не е започнал') };
    const statuses = deriveJourneyStatuses({
      casesCompleted: p.cases_completed,
      startupSections: p.startup_keys,
      startupSubmitted: p.startup_submitted,
      simWeek: p.sim_week,
      simComplete: p.sim_complete,
    });
    const completedCount = statuses.filter((s) => s === 'completed').length;
    if (completedCount >= 6) return { num: 6, name: lang === 'bg' ? STAGE_NAMES_BG[5] : STAGE_NAMES_EN[5] };
    const idx = completedCount;
    return { num: idx + 1, name: lang === 'bg' ? STAGE_NAMES_BG[idx] : STAGE_NAMES_EN[idx] };
  };

  const getStudentStageStatuses = (sid: string) => {
    const p = progressMap[sid];
    if (!p) return Array(6).fill('not_started');
    return deriveJourneyStatuses({
      casesCompleted: p.cases_completed,
      startupSections: p.startup_keys,
      startupSubmitted: p.startup_submitted,
      simWeek: p.sim_week,
      simComplete: p.sim_complete,
    });
  };

  const STAGE_ICONS = [Search, Lightbulb, PenTool, Wrench, Gauge, Presentation];

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
    const quizAvg = p.quiz_avg || 0;
    return overall < 50 || daysSinceUpdate > 7 || (quizAvg > 0 && quizAvg < 50);
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

  // (No classroom gate — dashboard always shows all students)

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
              {classroom
                ? <>{classroom.name} · {t('Code:', 'Код:')} <span className="font-mono font-bold text-primary">{classroom.class_code}</span></>
                : t('All students overview', 'Преглед на всички ученици')
              }
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {classroom && (
              <>
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
              </>
            )}
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
                          <th className="text-left py-2 px-2 text-muted-foreground font-medium">{t('Stage', 'Етап')}</th>
                          <th className="text-center py-2 px-2 text-muted-foreground font-medium">XP</th>
                          <th className="text-center py-2 px-2 text-muted-foreground font-medium">{t('Cases', 'Казуси')}</th>
                          <th className="text-center py-2 px-2 text-muted-foreground font-medium">{t('Sim', 'Сим.')}</th>
                          <th className="text-center py-2 px-2 text-muted-foreground font-medium">{t('Quiz Avg', 'Средна тест')}</th>
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
                            const quizAvg = p?.quiz_avg || 0;
                            const status =
                              (quizAvg < 40 || daysSince > 7)
                                ? { label: t('Needs Help', 'Нужда от помощ'), cls: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }
                                : quizAvg < 60
                                ? { label: t('At Risk', 'В риск'), cls: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' }
                                : { label: t('On Track', 'На път'), cls: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' };

                            const stage = getStudentStage(s.student_id);
                            const isExpanded = expandedRow === s.student_id;
                            const stageStatuses = isExpanded ? getStudentStageStatuses(s.student_id) : [];
                            const stageNames = lang === 'bg' ? STAGE_NAMES_BG : STAGE_NAMES_EN;
                            return (
                              <>
                                <tr
                                  key={s.student_id}
                                  className="hover:bg-muted/30 cursor-pointer"
                                  onClick={() => setExpandedRow(isExpanded ? null : s.student_id)}
                                >
                                  <td className="py-2.5 px-3 font-medium text-foreground flex items-center gap-1.5">
                                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                                    {getName(s)}
                                  </td>
                                  <td className="py-2.5 px-2">
                                    <span className="text-xs font-semibold text-primary">{stage.num}/6</span>
                                    <span className="text-xs text-muted-foreground ml-1">{stage.name}</span>
                                  </td>
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
                                    <span className={`text-xs font-medium ${(p?.quiz_avg || 0) < 50 ? 'text-destructive' : 'text-muted-foreground'}`}>{p?.quiz_avg || 0}%</span>
                                  </td>
                                  <td className="text-center py-2.5 px-2">
                                    <span className="text-muted-foreground">{Math.round(((p?.startup_sections || 0) / 7) * 100)}%</span>
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
                                {isExpanded && (
                                  <tr key={`${s.student_id}-detail`} className="bg-muted/20">
                                    <td colSpan={9} className="px-6 py-4">
                                      <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                                        {t('Stage-by-Stage Breakdown', 'Разбивка по етапи')}
                                      </div>
                                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                                        {stageStatuses.map((st, i) => {
                                          const Icon = STAGE_ICONS[i];
                                          const done = st === 'completed';
                                          const inProg = st === 'in_progress';
                                          return (
                                            <div
                                              key={i}
                                              className={`rounded-lg border p-3 text-center space-y-1 ${
                                                done
                                                  ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/30'
                                                  : inProg
                                                  ? 'border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950/30'
                                                  : 'border-border bg-background'
                                              }`}
                                            >
                                              <Icon className={`h-4 w-4 mx-auto ${done ? 'text-green-600 dark:text-green-400' : inProg ? 'text-yellow-600 dark:text-yellow-400' : 'text-muted-foreground'}`} />
                                              <div className="text-xs font-medium text-foreground">{stageNames[i]}</div>
                                              <div className={`text-[10px] font-semibold ${done ? 'text-green-600 dark:text-green-400' : inProg ? 'text-yellow-600 dark:text-yellow-400' : 'text-muted-foreground'}`}>
                                                {done ? t('Done', 'Готово') : inProg ? t('In Progress', 'В ход') : t('Not Started', 'Не е започнат')}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                      {/* Recent quiz results */}
                                      {p && p.recent_quizzes.length > 0 && (
                                        <div className="mt-4">
                                          <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                                            {t('Last 3 Quiz Results', 'Последни 3 теста')}
                                          </div>
                                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            {p.recent_quizzes.map((q, qi) => {
                                              const pct = q.max_score > 0 ? Math.round((q.score / q.max_score) * 100) : 0;
                                              return (
                                                <div key={qi} className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
                                                  <div className="flex-1 min-w-0">
                                                    <div className="text-xs font-medium text-foreground truncate">{q.category || t('General', 'Общо')}</div>
                                                    <div className="text-[10px] text-muted-foreground">{new Date(q.created_at).toLocaleDateString(lang === 'bg' ? 'bg-BG' : 'en-US', { month: 'short', day: 'numeric' })}</div>
                                                  </div>
                                                  <span className={`text-xs font-bold ${pct >= 80 ? 'text-green-600 dark:text-green-400' : pct >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-destructive'}`}>
                                                    {pct}%
                                                  </span>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}
                                      {/* BMC completion per section */}
                                      {p && Object.keys(p.bmc_keys).length > 0 && (
                                        <div className="mt-4">
                                          <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                                            {t('Business Model Canvas', 'Бизнес модел канвас')}
                                          </div>
                                          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5">
                                            {[
                                              { key: 'bmc_customer_segments', en: 'Customers', bg: 'Клиенти' },
                                              { key: 'bmc_value_proposition', en: 'Value Prop', bg: 'Стойност' },
                                              { key: 'bmc_channels', en: 'Channels', bg: 'Канали' },
                                              { key: 'bmc_customer_relationships', en: 'Relations', bg: 'Връзки' },
                                              { key: 'bmc_revenue_streams', en: 'Revenue', bg: 'Приходи' },
                                              { key: 'bmc_key_resources', en: 'Resources', bg: 'Ресурси' },
                                              { key: 'bmc_key_activities', en: 'Activities', bg: 'Дейности' },
                                              { key: 'bmc_key_partners', en: 'Partners', bg: 'Партньори' },
                                              { key: 'bmc_cost_structure', en: 'Costs', bg: 'Разходи' },
                                            ].map((sec) => {
                                              const done = p.bmc_keys[sec.key];
                                              return (
                                                <div
                                                  key={sec.key}
                                                  className={`rounded border px-2 py-1.5 text-center text-[10px] font-medium ${
                                                    done
                                                      ? 'border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950/30 dark:text-green-400'
                                                      : 'border-border bg-muted/30 text-muted-foreground'
                                                  }`}
                                                >
                                                  {done ? '✓ ' : ''}{t(sec.en, sec.bg)}
                                                </div>
                                              );
                                            })}
                                          </div>
                                          <div className="mt-1.5 text-[10px] text-muted-foreground">
                                            {Object.values(p.bmc_keys).filter(Boolean).length}/9 {t('sections filled', 'секции попълнени')}
                                          </div>
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                )}
                              </>
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

            {/* Intervention Alerts */}
            <Card className={struggling.length > 0 ? 'border-red-500/30' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className={`h-4 w-4 ${struggling.length > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
                  {t('Intervention Alerts', 'Сигнали за намеса')}
                  {struggling.length > 0 && (
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0">{struggling.length}</Badge>
                  )}
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
                  <div className="space-y-3">
                    {struggling.slice(0, 6).map((s) => {
                      const p = progressMap[s.student_id];
                      const quizAvg = p?.quiz_avg || 0;
                      const daysSince = Math.round((Date.now() - new Date(s.updated_at).getTime()) / 86400000);
                      const isNeedsHelp = quizAvg < 40 || daysSince > 7;
                      const reasons: string[] = [];
                      if (daysSince > 7) reasons.push(t(`${daysSince}d inactive`, `${daysSince}д неактивен`));
                      if (quizAvg > 0 && quizAvg < 50) reasons.push(t(`Quiz avg below 50% (${quizAvg}%)`, `Тест под 50% (${quizAvg}%)`));
                      else if (quizAvg >= 50 && quizAvg < 60) reasons.push(t(`Quiz avg ${quizAvg}%`, `Тест ср. ${quizAvg}%`));
                      if ((p?.cases_completed || 0) === 0) reasons.push(t('No cases done', 'Няма казуси'));
                      if ((p?.startup_sections || 0) === 0) reasons.push(t('No startup work', 'Няма стартъп'));
                      return (
                        <div
                          key={s.student_id}
                          className={`rounded-lg border p-3 cursor-pointer transition-colors hover:ring-1 hover:ring-primary/30 ${isNeedsHelp ? 'border-red-300 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20' : 'border-yellow-300 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20'}`}
                          onClick={() => setExpandedRow(expandedRow === s.student_id ? null : s.student_id)}
                          title={t('Click to view detailed progress', 'Кликнете за подробен напредък')}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-foreground">{getName(s)}</p>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${isNeedsHelp ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'}`}>
                              {isNeedsHelp ? t('Needs Help', 'Нужда от помощ') : t('At Risk', 'В риск')}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {reasons.map((r, i) => (
                              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{r}</span>
                            ))}
                          </div>
                          <p className="text-[10px] text-primary mt-1.5">{t('→ View details', '→ Виж детайли')}</p>
                        </div>
                      );
                    })}
                    {struggling.length > 6 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{struggling.length - 6} {t('more', 'още')}
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
