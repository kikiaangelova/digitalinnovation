import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ChevronRight, ChevronLeft, Play, BarChart3, Users, DollarSign,
  TrendingUp, Smile, Award, RotateCcw
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  SIM_WEEKS, INITIAL_KPIS, applyDecisionEffects, getStartupGrade,
  type SimWeekKPIs
} from '@/data/startup-simulator-data';

type Phase = 'intro' | 'playing' | 'results';

interface WeekRecord {
  week: number;
  choices: string[];
  kpis: SimWeekKPIs;
}

export default function StartupSimulator() {
  const { user } = useAuth();
  const { lang } = useLang();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentDecision, setCurrentDecision] = useState(0);
  const [kpis, setKpis] = useState<SimWeekKPIs>({ ...INITIAL_KPIS });
  const [history, setHistory] = useState<WeekRecord[]>([]);
  const [weekChoices, setWeekChoices] = useState<string[]>([]);

  const reset = useCallback(() => {
    setPhase('intro');
    setCurrentWeek(0);
    setCurrentDecision(0);
    setKpis({ ...INITIAL_KPIS });
    setHistory([]);
    setWeekChoices([]);
  }, []);

  const handleChoice = (optionId: string, effects: Partial<SimWeekKPIs>) => {
    const newKpis = applyDecisionEffects(kpis, effects);
    setKpis(newKpis);
    const newChoices = [...weekChoices, optionId];
    setWeekChoices(newChoices);

    const week = SIM_WEEKS[currentWeek];
    if (currentDecision < week.decisions.length - 1) {
      setCurrentDecision(d => d + 1);
    } else {
      // Week complete
      const record: WeekRecord = { week: currentWeek + 1, choices: newChoices, kpis: { ...newKpis } };
      setHistory(h => [...h, record]);
      setWeekChoices([]);
      setCurrentDecision(0);

      if (currentWeek < SIM_WEEKS.length - 1) {
        setCurrentWeek(w => w + 1);
      } else {
        setPhase('results');
      }
    }
  };

  // ── INTRO ──
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto max-w-3xl px-4 py-8">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              {lang === 'bg' ? 'Табло' : 'Dashboard'}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">
              {lang === 'bg' ? 'Стартъп симулатор' : 'Startup Simulator'}
            </span>
          </nav>

          <div className="text-center py-10">
            <span className="text-6xl mb-4 block">🚀</span>
            <h1 className="text-3xl font-display font-bold text-foreground mb-3">
              {lang === 'bg' ? 'Стартъп симулатор' : 'Startup Simulator'}
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              {lang === 'bg'
                ? 'Симулирайте процеса на изграждане на стартъп за 6 седмици. Вземайте стратегически решения и наблюдавайте как те влияят на резултатите на вашия стартъп.'
                : 'Simulate the process of building a startup over 6 weeks. Make strategic decisions and see how they affect your startup performance.'}
            </p>

            <div className="grid gap-3 sm:grid-cols-3 max-w-md mx-auto mb-8 text-left">
              {[
                { icon: '📋', en: '6 weekly challenges', bg: '6 седмични предизвикателства' },
                { icon: '📊', en: 'Live KPI tracking', bg: 'Проследяване на KPI в реално време' },
                { icon: '🏆', en: 'Final startup grade', bg: 'Финална оценка на стартъпа' },
              ].map((f, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-3 text-center">
                  <span className="text-2xl block mb-1">{f.icon}</span>
                  <span className="text-xs text-muted-foreground">{lang === 'bg' ? f.bg : f.en}</span>
                </div>
              ))}
            </div>

            <Button size="lg" onClick={() => setPhase('playing')}>
              <Play className="h-4 w-4 mr-2" />
              {lang === 'bg' ? 'Стартирай симулацията' : 'Start Simulation'}
            </Button>
          </div>

          {/* Week preview */}
          <div className="space-y-2 mt-4">
            {SIM_WEEKS.map(w => (
              <div key={w.week} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
                <span className="text-xl">{w.icon}</span>
                <div className="flex-1">
                  <span className="text-xs text-muted-foreground">
                    {lang === 'bg' ? `Седмица ${w.week}` : `Week ${w.week}`}
                  </span>
                  <h3 className="text-sm font-medium text-foreground">
                    {lang === 'bg' ? w.titleBg : w.titleEn}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTS ──
  if (phase === 'results') {
    const grade = getStartupGrade(kpis);
    const chartData = [
      { name: lang === 'bg' ? 'Старт' : 'Start', users: 0, revenue: 0, satisfaction: 50, growth: 0 },
      ...history.map(h => ({
        name: `${lang === 'bg' ? 'С' : 'W'}${h.week}`,
        users: h.kpis.users,
        revenue: h.kpis.revenue,
        satisfaction: h.kpis.satisfaction,
        growth: h.kpis.growthRate,
      })),
    ];

    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              {lang === 'bg' ? 'Табло' : 'Dashboard'}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">
              {lang === 'bg' ? 'Резултати от симулацията' : 'Simulation Results'}
            </span>
          </nav>

          {/* Grade */}
          <div className="text-center mb-8">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full border-4 mb-3" style={{ borderColor: grade.color }}>
              <span className="text-3xl font-display font-bold" style={{ color: grade.color }}>{grade.grade}</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {lang === 'bg' ? grade.labelBg : grade.labelEn}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {lang === 'bg' ? 'Вашата финална оценка на стартъпа' : 'Your final startup grade'}
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { labelEn: 'Users', labelBg: 'Потребители', value: kpis.users.toLocaleString(), icon: Users, color: 'hsl(var(--chart-1))' },
              { labelEn: 'Revenue', labelBg: 'Приходи', value: `$${kpis.revenue.toLocaleString()}`, icon: DollarSign, color: 'hsl(var(--chart-2))' },
              { labelEn: 'Satisfaction', labelBg: 'Удовлетвореност', value: `${kpis.satisfaction}%`, icon: Smile, color: 'hsl(var(--chart-3))' },
              { labelEn: 'Growth Rate', labelBg: 'Растеж', value: `${kpis.growthRate}%`, icon: TrendingUp, color: 'hsl(var(--chart-4))' },
            ].map(kpi => (
              <div key={kpi.labelEn} className="rounded-xl border border-border bg-card p-4 text-center">
                <kpi.icon className="h-5 w-5 mx-auto mb-1" style={{ color: kpi.color }} />
                <div className="text-xl font-bold text-foreground">{kpi.value}</div>
                <div className="text-xs text-muted-foreground">{lang === 'bg' ? kpi.labelBg : kpi.labelEn}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                {lang === 'bg' ? 'Растеж на потребителите' : 'User Growth'}
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[hsl(var(--chart-2))]" />
                {lang === 'bg' ? 'Приходи ($)' : 'Revenue ($)'}
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Decision history */}
          <div className="rounded-xl border border-border bg-card p-5 mb-6">
            <h3 className="text-base font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              {lang === 'bg' ? 'Вашите решения' : 'Your Decisions'}
            </h3>
            <div className="space-y-3">
              {history.map((h, i) => {
                const week = SIM_WEEKS[i];
                return (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                    <span className="text-lg">{week.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground">
                        {lang === 'bg' ? `Седмица ${week.week}` : `Week ${week.week}`}
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        {lang === 'bg' ? week.titleBg : week.titleEn}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {h.choices.map(c => {
                          const opt = week.decisions.flatMap(d => d.options).find(o => o.id === c);
                          return opt ? (
                            <Badge key={c} variant="secondary" className="text-xs">
                              {lang === 'bg' ? opt.labelBg : opt.labelEn}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-1.5" />
              {lang === 'bg' ? 'Играй отново' : 'Play Again'}
            </Button>
            <Button asChild>
              <Link to="/my-startup">
                {lang === 'bg' ? 'Отиди към Стартъп проект →' : 'Go to Startup Project →'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── PLAYING ──
  const week = SIM_WEEKS[currentWeek];
  const decision = week.decisions[currentDecision];
  const weekProgress = Math.round(((currentWeek * 2 + currentDecision) / (SIM_WEEKS.length * 2)) * 100);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">
            {lang === 'bg' ? 'Табло' : 'Dashboard'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">
            {lang === 'bg' ? 'Стартъп симулатор' : 'Startup Simulator'}
          </span>
        </nav>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-6">
          <Progress value={weekProgress} className="h-2 flex-1" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            {lang === 'bg' ? `Седмица ${currentWeek + 1}/6` : `Week ${currentWeek + 1}/6`}
          </span>
        </div>

        {/* KPI mini bar */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { label: lang === 'bg' ? 'Потребители' : 'Users', val: kpis.users, icon: Users },
            { label: lang === 'bg' ? 'Приходи' : 'Revenue', val: `$${kpis.revenue}`, icon: DollarSign },
            { label: lang === 'bg' ? 'Удовл.' : 'Satisf.', val: `${kpis.satisfaction}%`, icon: Smile },
            { label: lang === 'bg' ? 'Растеж' : 'Growth', val: `${kpis.growthRate}%`, icon: TrendingUp },
          ].map(k => (
            <div key={k.label} className="rounded-lg border border-border bg-card px-2 py-2 text-center">
              <k.icon className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-0.5" />
              <div className="text-sm font-bold text-foreground">{k.val}</div>
              <div className="text-[10px] text-muted-foreground truncate">{k.label}</div>
            </div>
          ))}
        </div>

        {/* Week header */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{week.icon}</span>
          <div>
            <Badge variant="outline" className="text-xs mb-1">
              {lang === 'bg' ? `Седмица ${week.week}` : `Week ${week.week}`}
            </Badge>
            <h2 className="text-xl font-display font-bold text-foreground">
              {lang === 'bg' ? week.titleBg : week.titleEn}
            </h2>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          {lang === 'bg' ? week.descBg : week.descEn}
        </p>

        {/* Decision */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold text-foreground mb-4">
            {lang === 'bg' ? decision.questionBg : decision.questionEn}
          </h3>
          <div className="space-y-3">
            {decision.options.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleChoice(opt.id, opt.effects)}
                className="w-full text-left rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-accent/50 transition-all group"
              >
                <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {lang === 'bg' ? opt.labelBg : opt.labelEn}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {lang === 'bg' ? opt.descBg : opt.descEn}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
