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
  Activity, ArrowLeft, Wifi,
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
  const [loading, setLoading] = useState(true);
  const [onlineCount, setOnlineCount] = useState(1);

  useEffect(() => {
    const fetchAll = async () => {
      const [p, s, c, st, sim, cp] = await Promise.all([
        supabase.from('profiles').select('user_id, full_name, created_at'),
        supabase.from('submissions').select('id, case_study_id, user_id, is_draft, total_score, max_score, submitted_at, created_at').eq('is_draft', false),
        supabase.from('case_studies').select('id, title, published'),
        supabase.from('startup_projects').select('id, user_id, created_at, is_submitted, submitted_at'),
        supabase.from('simulator_progress').select('id, user_id, is_complete, current_week, created_at, grade'),
        supabase.from('course_progress').select('id, user_id, module, status, completed_at, score, created_at'),
      ]);
      setProfiles(p.data || []);
      setSubmissions(s.data || []);
      setCases(c.data || []);
      setStartups(st.data || []);
      setSimProgress(sim.data || []);
      setCourseProgress(cp.data || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

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
      if (studentMap[p.user_id]) studentMap[p.user_id].name = p.full_name || 'Unknown';
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
                        <td className="px-3 py-2.5 text-sm font-medium text-foreground">{s.name || 'Unknown'}</td>
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
