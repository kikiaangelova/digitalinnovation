import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import {
  Users, BookOpen, Rocket, Gamepad2, Trophy, TrendingUp,
  Activity, ArrowLeft, Wifi, Brain, HelpCircle, TrendingDown, AlertTriangle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, subDays, startOfDay, parseISO } from 'date-fns';

export default function AnalyticsDashboard() {
  const { isAdmin } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const [profiles, setProfiles] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [startups, setStartups] = useState<any[]>([]);
  const [simProgress, setSimProgress] = useState<any[]>([]);
  const [courseProgress, setCourseProgress] = useState<any[]>([]);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlineCount, setOnlineCount] = useState(1);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchAll = async () => {
      const [p, s, c, st, sim, cp, qr] = await Promise.all([
        supabase.from('profiles').select('user_id, full_name, created_at'),
        supabase.from('submissions').select('id, case_study_id, user_id, is_draft, total_score, max_score, submitted_at, created_at').eq('is_draft', false),
        supabase.from('case_studies').select('id, title, published'),
        supabase.from('startup_projects').select('id, user_id, created_at, is_submitted, submitted_at'),
        supabase.from('simulator_progress').select('id, user_id, is_complete, current_week, created_at, grade'),
        supabase.from('course_progress').select('id, user_id, module, status, completed_at, score, created_at'),
        supabase.from('quiz_results').select('id, user_id, score, category, xp_earned, created_at').eq('quiz_type', 'dictionary'),
      ]);
      setProfiles(p.data || []);
      setSubmissions(s.data || []);
      setCases(c.data || []);
      setStartups(st.data || []);
      setSimProgress(sim.data || []);
      setCourseProgress(cp.data || []);
      setQuizResults(qr.data || []);
      setLoading(false);
    };
    fetchAll();
  }, [isAdmin]);

  // Realtime presence for online count
  useEffect(() => {
    const channel = supabase.channel('online-users', {
      config: { presence: { key: 'analytics' } },
    });
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setOnlineCount(Object.keys(state).reduce((acc, k) => acc + (state[k] as any[]).length, 0));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Derived metrics
  const totalUsers = profiles.length;
  const activeStudents = new Set([
    ...submissions.map(s => s.user_id),
    ...startups.map(s => s.user_id),
    ...simProgress.map(s => s.user_id),
  ]).size;
  const casesCompleted = submissions.length;
  const startupsCreated = startups.length;
  const simulatorRuns = simProgress.length;

  // Daily activity (last 14 days)
  const dailyData = useMemo(() => {
    const days: Record<string, { date: string; users: Set<string>; cases: number; sims: number; startups: number }> = {};
    for (let i = 13; i >= 0; i--) {
      const d = format(subDays(new Date(), i), 'yyyy-MM-dd');
      days[d] = { date: d, users: new Set(), cases: 0, sims: 0, startups: 0 };
    }
    submissions.forEach(s => {
      const d = s.submitted_at ? format(startOfDay(parseISO(s.submitted_at)), 'yyyy-MM-dd') : null;
      if (d && days[d]) { days[d].cases++; days[d].users.add(s.user_id); }
    });
    simProgress.forEach(s => {
      const d = format(startOfDay(parseISO(s.created_at)), 'yyyy-MM-dd');
      if (days[d]) { days[d].sims++; days[d].users.add(s.user_id); }
    });
    startups.forEach(s => {
      const d = format(startOfDay(parseISO(s.created_at)), 'yyyy-MM-dd');
      if (days[d]) { days[d].startups++; days[d].users.add(s.user_id); }
    });
    return Object.values(days).map(d => ({
      date: format(parseISO(d.date), 'MMM dd'),
      activeUsers: d.users.size,
      cases: d.cases,
      sims: d.sims,
      startups: d.startups,
    }));
  }, [submissions, simProgress, startups]);

  // Top students
  const topStudents = useMemo(() => {
    const studentMap: Record<string, { name: string; cases: number; score: number; sims: number }> = {};
    submissions.forEach(s => {
      if (!studentMap[s.user_id]) studentMap[s.user_id] = { name: '', cases: 0, score: 0, sims: 0 };
      studentMap[s.user_id].cases++;
      studentMap[s.user_id].score += s.total_score || 0;
    });
    simProgress.forEach(s => {
      if (!studentMap[s.user_id]) studentMap[s.user_id] = { name: '', cases: 0, score: 0, sims: 0 };
      studentMap[s.user_id].sims++;
    });
    profiles.forEach(p => {
      if (studentMap[p.user_id]) studentMap[p.user_id].name = p.full_name || t('Unknown', 'Неизвестен');
    });
    return Object.entries(studentMap)
      .map(([id, d]) => ({ id, ...d, xp: d.score + d.cases * 10 + d.sims * 15 }))
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 10);
  }, [submissions, simProgress, profiles]);

  // Case scores
  const caseScores = useMemo(() => {
    return cases.filter(c => c.published).map(c => {
      const subs = submissions.filter(s => s.case_study_id === c.id);
      const avg = subs.length > 0
        ? Math.round(subs.reduce((a, s) => a + ((s.total_score || 0) / Math.max(s.max_score || 1, 1)) * 100, 0) / subs.length)
        : 0;
      return { name: (c.title || '').substring(0, 18), avg, count: subs.length };
    });
  }, [cases, submissions]);

  if (!isAdmin) return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        {t('Admin access required.', 'Необходим е администраторски достъп.')}
      </div>
    </div>
  );

  const COLORS = {
    primary: 'hsl(226, 70%, 55%)',
    secondary: 'hsl(173, 58%, 39%)',
    accent: 'hsl(38, 92%, 50%)',
    purple: 'hsl(280, 60%, 55%)',
  };

  const tooltipStyle = {
    contentStyle: { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 },
  };

  const metrics = [
    { icon: Users, label: t('Total Users', 'Общо потребители'), value: totalUsers, color: 'text-primary' },
    { icon: Activity, label: t('Active Students', 'Активни ученици'), value: activeStudents, color: 'text-primary' },
    { icon: BookOpen, label: t('Cases Completed', 'Завършени казуси'), value: casesCompleted, color: 'text-primary' },
    { icon: Rocket, label: t('Startup Projects', 'Стартъп проекти'), value: startupsCreated, color: 'text-primary' },
    { icon: Gamepad2, label: t('Simulator Runs', 'Симулации'), value: simulatorRuns, color: 'text-primary' },
    { icon: Wifi, label: t('Online Now', 'Онлайн сега'), value: onlineCount, color: 'text-green-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="mb-2 gap-1 -ml-2">
              <ArrowLeft className="h-4 w-4" /> {t('Back to Admin', 'Обратно към Админ')}
            </Button>
            <h1 className="text-2xl font-bold text-foreground">{t('Platform Analytics', 'Аналитика на платформата')}</h1>
            <p className="text-sm text-muted-foreground">{t('Monitor engagement and student activity', 'Следете ангажираността и активността')}</p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map((m, i) => (
            <Card key={i}>
              <CardContent className="pt-5 pb-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/50">
                    <m.icon className={`h-5 w-5 ${m.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{loading ? '—' : m.value}</p>
                    <p className="text-xs text-muted-foreground leading-tight">{m.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Daily Active Users */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t('Daily Active Users', 'Дневно активни потребители')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip {...tooltipStyle} />
                  <Area type="monotone" dataKey="activeUsers" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.15} name={t('Active Users', 'Активни')} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cases Completed per Day */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t('Cases Completed / Day', 'Завършени казуси / ден')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="cases" fill={COLORS.secondary} radius={[4, 4, 0, 0]} name={t('Cases', 'Казуси')} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Simulator Usage */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t('Simulator Usage', 'Използване на симулатора')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip {...tooltipStyle} />
                  <Line type="monotone" dataKey="sims" stroke={COLORS.purple} strokeWidth={2} dot={{ r: 3 }} name={t('Simulations', 'Симулации')} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Startup Submissions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t('Startup Project Submissions', 'Подадени стартъп проекти')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="startups" fill={COLORS.accent} radius={[4, 4, 0, 0]} name={t('Projects', 'Проекти')} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Average Scores by Case */}
        {caseScores.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t('Average Scores by Case', 'Среден резултат по казус')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={caseScores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v}%`, t('Avg Score', 'Ср. резултат')]} />
                  <Bar dataKey="avg" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Quiz Test Analytics */}
        {quizResults.length > 0 && (() => {
          // Average score by category
          const catStats: Record<string, { total: number; count: number }> = {};
          quizResults.forEach(r => {
            const cat = r.category || 'General';
            if (!catStats[cat]) catStats[cat] = { total: 0, count: 0 };
            catStats[cat].total += r.score;
            catStats[cat].count++;
          });
          const catChartData = Object.entries(catStats)
            .map(([name, { total, count }]) => ({ name: name.substring(0, 16), avg: Math.round(total / count), tests: count }))
            .sort((a, b) => b.tests - a.tests);

          // Weakest categories (avg < 60)
          const weakCats = catChartData.filter(c => c.avg < 60);

          // Top quiz performers
          const userQuizStats: Record<string, { scores: number[]; name: string }> = {};
          quizResults.forEach(r => {
            if (!userQuizStats[r.user_id]) userQuizStats[r.user_id] = { scores: [], name: '' };
            userQuizStats[r.user_id].scores.push(r.score);
          });
          profiles.forEach(p => {
            if (userQuizStats[p.user_id]) userQuizStats[p.user_id].name = p.full_name || t('Unknown', 'Неизвестен');
          });
          const topQuizStudents = Object.entries(userQuizStats)
            .map(([id, { scores, name }]) => ({
              id, name,
              tests: scores.length,
              avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
              best: Math.max(...scores),
            }))
            .sort((a, b) => b.avg - a.avg)
            .slice(0, 8);

          // Students needing support (avg < 50, at least 2 tests)
          const needSupport = Object.entries(userQuizStats)
            .map(([id, { scores, name }]) => ({
              id, name,
              tests: scores.length,
              avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
            }))
            .filter(s => s.avg < 50 && s.tests >= 2)
            .sort((a, b) => a.avg - b.avg);

          const totalTests = quizResults.length;
          const overallAvg = Math.round(quizResults.reduce((a, r) => a + r.score, 0) / totalTests);

          return (
            <>
              {/* Quiz summary metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-5 pb-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/50">
                        <HelpCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{totalTests}</p>
                        <p className="text-xs text-muted-foreground">{t('Total Tests Taken', 'Общо тестове')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5 pb-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/50">
                        <Brain className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{overallAvg}%</p>
                        <p className="text-xs text-muted-foreground">{t('Avg Quiz Score', 'Среден резултат')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5 pb-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/50">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{Object.keys(userQuizStats).length}</p>
                        <p className="text-xs text-muted-foreground">{t('Students Tested', 'Тествани ученици')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5 pb-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/50">
                        <AlertTriangle className={`h-5 w-5 ${needSupport.length > 0 ? 'text-amber-500' : 'text-primary'}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{needSupport.length}</p>
                        <p className="text-xs text-muted-foreground">{t('Need Support', 'Нуждаят се от помощ')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Avg Score by Category */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    {t('Quiz Scores by Category', 'Резултати по категория')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={catChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip {...tooltipStyle} formatter={(v: number, name: string) => [name === 'avg' ? `${v}%` : v, name === 'avg' ? t('Avg Score', 'Среден') : t('Tests', 'Тестове')]} />
                      <Bar dataKey="avg" fill={COLORS.primary} radius={[4, 4, 0, 0]} name="avg" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Quiz Performers */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      {t('Top Quiz Performers', 'Най-добри на тестове')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground">{t('Student', 'Ученик')}</th>
                            <th className="px-2 py-2 text-center text-xs font-medium text-muted-foreground">{t('Tests', 'Тестове')}</th>
                            <th className="px-2 py-2 text-center text-xs font-medium text-muted-foreground">{t('Avg', 'Ср.')}</th>
                            <th className="px-2 py-2 text-center text-xs font-medium text-muted-foreground">{t('Best', 'Най-добър')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topQuizStudents.map((s, i) => (
                            <tr key={s.id} className="border-b border-border/50 last:border-0">
                              <td className="px-2 py-2 text-sm font-medium text-foreground">{s.name}</td>
                              <td className="px-2 py-2 text-center text-sm text-muted-foreground">{s.tests}</td>
                              <td className="px-2 py-2 text-center">
                                <Badge variant={s.avg >= 70 ? 'default' : 'secondary'} className="text-xs">{s.avg}%</Badge>
                              </td>
                              <td className="px-2 py-2 text-center text-sm text-muted-foreground">{s.best}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Students Needing Support + Weak Areas */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-amber-500" />
                      {t('Weak Areas & At-Risk Students', 'Слаби области и ученици в риск')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {weakCats.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">{t('Common Weak Areas', 'Често срещани слаби области')}</p>
                        <div className="space-y-1.5">
                          {weakCats.map(c => (
                            <div key={c.name} className="flex items-center justify-between text-xs rounded-md bg-amber-500/5 border border-amber-500/10 p-2">
                              <span className="text-foreground font-medium">{c.name}</span>
                              <span className="text-amber-600 font-bold">{c.avg}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {needSupport.length > 0 ? (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">{t('Students Needing Support', 'Ученици, нуждаещи се от помощ')}</p>
                        <div className="space-y-1.5">
                          {needSupport.slice(0, 6).map(s => (
                            <div key={s.id} className="flex items-center justify-between text-xs rounded-md bg-destructive/5 border border-destructive/10 p-2">
                              <span className="text-foreground font-medium">{s.name}</span>
                              <span className="text-destructive font-bold">{s.avg}% ({s.tests} {t('tests', 'тестa')})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">{t('All students performing well!', 'Всички ученици се справят добре!')}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          );
        })()}

        {/* Top Students Leaderboard */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              {t('Top Students', 'Най-добри ученици')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">#</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">{t('Student', 'Ученик')}</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">XP</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">{t('Cases', 'Казуси')}</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">{t('Score', 'Точки')}</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">{t('Sims', 'Симулации')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topStudents.map((s, i) => (
                      <tr key={s.id} className="border-b border-border/50 last:border-0">
                        <td className="px-3 py-2.5">
                          {i < 3 ? (
                            <span className={`text-lg ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : 'text-amber-700'}`}>
                              {['🥇', '🥈', '🥉'][i]}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">{i + 1}</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-sm font-medium text-foreground">{s.name || t('Unknown', 'Неизвестен')}</td>
                        <td className="px-3 py-2.5 text-center">
                          <Badge variant="default" className="text-xs">{s.xp} XP</Badge>
                        </td>
                        <td className="px-3 py-2.5 text-center text-sm text-muted-foreground">{s.cases}</td>
                        <td className="px-3 py-2.5 text-center text-sm text-muted-foreground">{s.score}</td>
                        <td className="px-3 py-2.5 text-center text-sm text-muted-foreground">{s.sims}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">{t('No student activity yet', 'Все още няма активност')}</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
