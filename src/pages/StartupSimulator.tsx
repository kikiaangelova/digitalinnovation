import { useState, useCallback, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ChevronRight, ChevronLeft, Play, BarChart3, Users, DollarSign,
  TrendingUp, Smile, Award, RotateCcw, CheckCircle2, Layers, Target, Megaphone, Briefcase
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  SIM_WEEKS, INITIAL_KPIS, applyDecisionEffects, combineEffects, getStartupGrade,
  type SimWeekKPIs
} from '@/data/startup-simulator-data';

type Phase = 'intro' | 'playing' | 'results';

interface WeekRecord {
  week: number;
  choices: string[];
  kpis: SimWeekKPIs;
}

// Helpers to extract strategy summary from history choices
function extractStrategyFromHistory(history: WeekRecord[]) {
  const allChoices = history.flatMap(h => h.choices);

  const productMap: Record<string, { en: string; bg: string }> = {
    'w3-mobile': { en: 'Mobile App', bg: 'Мобилно приложение' },
    'w3-web': { en: 'Web Platform', bg: 'Уеб платформа' },
    'w3-ai': { en: 'AI-Powered Tool', bg: 'AI инструмент' },
    'w3-data': { en: 'Data Platform', bg: 'Платформа за данни' },
    'w3-marketplace': { en: 'Marketplace Platform', bg: 'Маркетплейс платформа' },
  };

  const revenueMap: Record<string, { en: string; bg: string }> = {
    'w4-subscription': { en: 'Subscription', bg: 'Абонамент' },
    'w4-freemium': { en: 'Freemium', bg: 'Freemium' },
    'w4-payperuse': { en: 'Pay-per-use', bg: 'Плащане при ползване' },
    'w4-iap': { en: 'In-app purchases', bg: 'Покупки в приложението' },
    'w4-commission': { en: 'Marketplace commission', bg: 'Комисиона' },
    'w4-ads': { en: 'Advertising', bg: 'Реклами' },
    'w4-enterprise': { en: 'Enterprise licensing', bg: 'Корпоративен лиценз' },
    'w4-onetime': { en: 'One-time purchase', bg: 'Еднократна покупка' },
  };

  const marketMap: Record<string, { en: string; bg: string }> = {
    'w4-mass': { en: 'Mass Market', bg: 'Масов пазар' },
    'w4-nichemarket': { en: 'Niche Market', bg: 'Нишов пазар' },
    'w4-b2b-target': { en: 'B2B', bg: 'B2B' },
    'w4-b2c-target': { en: 'B2C', bg: 'B2C' },
    'w4-enterprise-target': { en: 'Enterprise', bg: 'Корпоративен' },
  };

  const marketingMap: Record<string, { en: string; bg: string }> = {
    'w5-social': { en: 'Social Media', bg: 'Социални медии' },
    'w5-influencer': { en: 'Influencer Marketing', bg: 'Инфлуенсър маркетинг' },
    'w5-seo': { en: 'SEO / Content', bg: 'SEO / Съдържание' },
    'w5-paid': { en: 'Paid Ads', bg: 'Платени реклами' },
    'w5-community': { en: 'Community', bg: 'Общност' },
    'w5-partnerships': { en: 'Partnerships', bg: 'Партньорства' },
    'w5-plg': { en: 'Product-Led Growth', bg: 'Растеж чрез продукта' },
    'w5-referral': { en: 'Referral Programs', bg: 'Реферални програми' },
    'w5-email': { en: 'Email Marketing', bg: 'Имейл маркетинг' },
    'w5-events': { en: 'Events / Webinars', bg: 'Събития / Уебинари' },
  };

  return {
    product: allChoices.filter(c => productMap[c]).map(c => productMap[c]),
    revenue: allChoices.filter(c => revenueMap[c]).map(c => revenueMap[c]),
    market: allChoices.filter(c => marketMap[c]).map(c => marketMap[c]),
    marketing: allChoices.filter(c => marketingMap[c]).map(c => marketingMap[c]),
  };
}

export default function StartupSimulator() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentDecision, setCurrentDecision] = useState(0);
  const [kpis, setKpis] = useState<SimWeekKPIs>({ ...INITIAL_KPIS });
  const [history, setHistory] = useState<WeekRecord[]>([]);
  const [weekChoices, setWeekChoices] = useState<string[]>([]);
  const [simId, setSimId] = useState<string | null>(null);
  // Multi-select state
  const [multiSelections, setMultiSelections] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth?redirect=/simulator');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from('simulator_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_complete', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setSimId(data.id);
          const savedKpis = data.kpis as any as SimWeekKPIs;
          const savedDecisions = data.decisions as any as WeekRecord[];
          setKpis(savedKpis);
          setHistory(savedDecisions);
          setCurrentWeek(Math.min(data.current_week - 1, SIM_WEEKS.length - 1));
          if (data.is_complete) {
            setPhase('results');
          } else if (savedDecisions.length > 0) {
            setPhase('playing');
          }
        }
      });
  }, [user]);

  const saveProgress = useCallback(async (
    newKpis: SimWeekKPIs, newHistory: WeekRecord[], weekNum: number, complete: boolean
  ) => {
    if (!user) return;
    const grade = complete ? getStartupGrade(newKpis).grade : null;
    const payload = {
      user_id: user.id,
      current_week: weekNum,
      kpis: newKpis as any,
      decisions: newHistory as any,
      is_complete: complete,
      grade,
    };
    if (simId) {
      await supabase.from('simulator_progress').update(payload).eq('id', simId);
    } else {
      const { data } = await supabase.from('simulator_progress').insert(payload).select('id').single();
      if (data) setSimId(data.id);
    }
  }, [user, simId]);

  const reset = useCallback(async () => {
    setPhase('intro');
    setCurrentWeek(0);
    setCurrentDecision(0);
    setKpis({ ...INITIAL_KPIS });
    setHistory([]);
    setWeekChoices([]);
    setSimId(null);
    setMultiSelections([]);
  }, []);

  const advanceDecision = (newKpis: SimWeekKPIs, newChoices: string[]) => {
    setKpis(newKpis);
    setWeekChoices(newChoices);
    setMultiSelections([]);

    const week = SIM_WEEKS[currentWeek];
    if (currentDecision < week.decisions.length - 1) {
      setCurrentDecision(d => d + 1);
    } else {
      const record: WeekRecord = { week: currentWeek + 1, choices: newChoices, kpis: { ...newKpis } };
      const newHistory = [...history, record];
      setHistory(newHistory);
      setWeekChoices([]);
      setCurrentDecision(0);

      if (currentWeek < SIM_WEEKS.length - 1) {
        setCurrentWeek(w => w + 1);
        saveProgress(newKpis, newHistory, currentWeek + 2, false);
      } else {
        setPhase('results');
        saveProgress(newKpis, newHistory, currentWeek + 1, true);
      }
    }
  };

  const handleSingleChoice = (optionId: string, effects: Partial<SimWeekKPIs>) => {
    const newKpis = applyDecisionEffects(kpis, effects);
    const newChoices = [...weekChoices, optionId];
    advanceDecision(newKpis, newChoices);
  };

  const handleMultiConfirm = () => {
    if (multiSelections.length === 0) return;
    const week = SIM_WEEKS[currentWeek];
    const decision = week.decisions[currentDecision];
    const selectedEffects = multiSelections.map(id => {
      const opt = decision.options.find(o => o.id === id);
      return opt?.effects || {};
    });
    const combined = combineEffects(selectedEffects);
    const newKpis = applyDecisionEffects(kpis, combined);
    const newChoices = [...weekChoices, ...multiSelections];
    advanceDecision(newKpis, newChoices);
  };

  const toggleMultiSelection = (optionId: string) => {
    setMultiSelections(prev =>
      prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]
    );
  };

  // ── INTRO ──
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto max-w-3xl px-4 py-8">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              {t('Dashboard', 'Табло')}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">
              {t('Startup Simulator', 'Стартъп симулатор')}
            </span>
          </nav>

          <div className="text-center py-10">
            <span className="text-6xl mb-4 block">🚀</span>
            <h1 className="text-3xl font-display font-bold text-foreground mb-3">
              {t('Startup Simulator', 'Стартъп симулатор')}
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              {t(
                'Simulate the process of building a startup over 6 weeks. Make strategic decisions about technology, business models, and marketing — just like real founders at MIT and Harvard case studies.',
                'Симулирайте процеса на изграждане на стартъп за 6 седмици. Вземайте стратегически решения за технологии, бизнес модели и маркетинг — точно като в казуси от MIT и Harvard.'
              )}
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
              {t('Start Simulation', 'Стартирай симулацията')}
            </Button>
          </div>

          <div className="space-y-2 mt-4">
            {SIM_WEEKS.map(w => (
              <div key={w.week} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
                <span className="text-xl">{w.icon}</span>
                <div className="flex-1">
                  <span className="text-xs text-muted-foreground">
                    {t(`Week ${w.week}`, `Седмица ${w.week}`)}
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
      { name: t('Start', 'Старт'), users: 0, revenue: 0, satisfaction: 50, growth: 0 },
      ...history.map(h => ({
        name: `${t('W', 'С')}${h.week}`,
        users: h.kpis.users,
        revenue: h.kpis.revenue,
        satisfaction: h.kpis.satisfaction,
        growth: h.kpis.growthRate,
      })),
    ];

    const strategy = extractStrategyFromHistory(history);

    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              {t('Dashboard', 'Табло')}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">
              {t('Simulation Results', 'Резултати от симулацията')}
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
              {t('Your final startup grade', 'Вашата финална оценка на стартъпа')}
            </p>
          </div>

          {/* Strategy Summary Card */}
          <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6 mb-8">
            <h3 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              {t('Startup Architecture', 'Архитектура на стартъпа')}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Product */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  {t('Product', 'Продукт')}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {strategy.product.length > 0 ? strategy.product.map((p, i) => (
                    <Badge key={i} variant="secondary">{lang === 'bg' ? p.bg : p.en}</Badge>
                  )) : <span className="text-xs text-muted-foreground">—</span>}
                </div>
              </div>
              {/* Revenue */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  {t('Revenue Model', 'Приходен модел')}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {strategy.revenue.length > 0 ? strategy.revenue.map((r, i) => (
                    <Badge key={i} variant="secondary">{lang === 'bg' ? r.bg : r.en}</Badge>
                  )) : <span className="text-xs text-muted-foreground">—</span>}
                </div>
              </div>
              {/* Market */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Target className="h-4 w-4" />
                  {t('Market', 'Пазар')}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {strategy.market.length > 0 ? strategy.market.map((m, i) => (
                    <Badge key={i} variant="secondary">{lang === 'bg' ? m.bg : m.en}</Badge>
                  )) : <span className="text-xs text-muted-foreground">—</span>}
                </div>
              </div>
              {/* Marketing */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Megaphone className="h-4 w-4" />
                  {t('Marketing Strategy', 'Маркетингова стратегия')}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {strategy.marketing.length > 0 ? strategy.marketing.map((m, i) => (
                    <Badge key={i} variant="secondary">{lang === 'bg' ? m.bg : m.en}</Badge>
                  )) : <span className="text-xs text-muted-foreground">—</span>}
                </div>
              </div>
            </div>
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
                {t('User Growth', 'Растеж на потребителите')}
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
                {t('Revenue ($)', 'Приходи ($)')}
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
              {t('Your Decisions', 'Вашите решения')}
            </h3>
            <div className="space-y-3">
              {history.map((h, i) => {
                const week = SIM_WEEKS[i];
                return (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                    <span className="text-lg">{week.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground">
                        {t(`Week ${week.week}`, `Седмица ${week.week}`)}
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
              {t('Play Again', 'Играй отново')}
            </Button>
            <Button asChild>
              <Link to="/my-startup">
                {t('Go to Startup Project →', 'Отиди към Стартъп проект →')}
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
  const isMulti = !!decision.multiSelect;
  const totalDecisions = SIM_WEEKS.reduce((sum, w) => sum + w.decisions.length, 0);
  const completedDecisions = history.reduce((sum, _, i) => sum + SIM_WEEKS[i].decisions.length, 0) + currentDecision;
  const weekProgress = Math.round((completedDecisions / totalDecisions) * 100);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">
            {t('Dashboard', 'Табло')}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">
            {t('Startup Simulator', 'Стартъп симулатор')}
          </span>
        </nav>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-6">
          <Progress value={weekProgress} className="h-2 flex-1" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            {t(`Week ${currentWeek + 1}/6`, `Седмица ${currentWeek + 1}/6`)}
          </span>
        </div>

        {/* KPI mini bar */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { label: t('Users', 'Потребители'), val: kpis.users, icon: Users },
            { label: t('Revenue', 'Приходи'), val: `$${kpis.revenue}`, icon: DollarSign },
            { label: t('Satisf.', 'Удовл.'), val: `${kpis.satisfaction}%`, icon: Smile },
            { label: t('Growth', 'Растеж'), val: `${kpis.growthRate}%`, icon: TrendingUp },
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
              {t(`Week ${week.week}`, `Седмица ${week.week}`)}
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
          <h3 className="text-base font-semibold text-foreground mb-1">
            {lang === 'bg' ? decision.questionBg : decision.questionEn}
          </h3>

          {isMulti && (
            <p className="text-xs text-muted-foreground mb-4">
              {t('Select one or more options, then confirm your choices.', 'Изберете една или повече опции, след което потвърдете избора си.')}
            </p>
          )}

          <div className="space-y-3 mt-3">
            {decision.options.map(opt => {
              if (isMulti) {
                const isSelected = multiSelections.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleMultiSelection(opt.id)}
                    className={`w-full text-left rounded-lg border p-4 transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/40 hover:bg-accent/50'
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      className="mt-0.5 pointer-events-none"
                      tabIndex={-1}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-foreground">
                        {lang === 'bg' ? opt.labelBg : opt.labelEn}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {lang === 'bg' ? opt.descBg : opt.descEn}
                      </p>
                    </div>
                    {isSelected && <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />}
                  </button>
                );
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSingleChoice(opt.id, opt.effects)}
                  className="w-full text-left rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-accent/50 transition-all group"
                >
                  <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {lang === 'bg' ? opt.labelBg : opt.labelEn}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {lang === 'bg' ? opt.descBg : opt.descEn}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Multi-select hint & confirm */}
          {isMulti && multiSelections.length > 1 && decision.multiSelectHintEn && (
            <div className="mt-4 rounded-lg bg-primary/10 border border-primary/20 p-3 text-sm text-primary">
              💡 {lang === 'bg' ? decision.multiSelectHintBg : decision.multiSelectHintEn}
            </div>
          )}

          {isMulti && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {multiSelections.length} {t('selected', 'избрани')}
              </span>
              <Button
                onClick={handleMultiConfirm}
                disabled={multiSelections.length === 0}
              >
                {t('Confirm Choices', 'Потвърдете избора')}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
