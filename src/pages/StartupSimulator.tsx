import { useState, useCallback, useEffect } from 'react';
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
  ChevronRight, Play, RotateCcw, CheckCircle2,
  Lightbulb, TrendingUp, Layers, ShieldAlert, Rocket,
  Factory, Target, Swords, Wrench, DollarSign, Megaphone
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';
import {
  SIM_WEEKS, INITIAL_KPIS, applyDecisionEffects, combineEffects, getStartupGrade,
  type SimWeekKPIs
} from '@/data/startup-simulator-data';

type Phase = 'intro' | 'playing' | 'results';

interface StepRecord {
  step: number;
  choices: string[];
  kpis: SimWeekKPIs;
}

const STEP_ICONS = [Factory, Target, Swords, Wrench, DollarSign, Megaphone];

const KPI_META: { key: keyof SimWeekKPIs; en: string; bg: string; icon: React.ElementType; color: string; invertedLabel?: boolean }[] = [
  { key: 'innovation', en: 'Innovation', bg: 'Иновация', icon: Lightbulb, color: 'hsl(var(--chart-1))' },
  { key: 'marketPotential', en: 'Market Potential', bg: 'Пазарен потенциал', icon: TrendingUp, color: 'hsl(var(--chart-2))' },
  { key: 'scalability', en: 'Scalability', bg: 'Мащабируемост', icon: Layers, color: 'hsl(var(--chart-3))' },
  { key: 'riskLevel', en: 'Risk Level', bg: 'Ниво на риск', icon: ShieldAlert, color: 'hsl(var(--sim-danger))', invertedLabel: true },
  { key: 'growthPotential', en: 'Growth Potential', bg: 'Потенциал за растеж', icon: Rocket, color: 'hsl(var(--chart-4))' },
];

export default function StartupSimulator() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [currentDecision, setCurrentDecision] = useState(0);
  const [kpis, setKpis] = useState<SimWeekKPIs>({ ...INITIAL_KPIS });
  const [history, setHistory] = useState<StepRecord[]>([]);
  const [stepChoices, setStepChoices] = useState<string[]>([]);
  const [simId, setSimId] = useState<string | null>(null);
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
          const savedDecisions = data.decisions as any as StepRecord[];
          if (savedKpis && savedDecisions) {
            setKpis(savedKpis);
            setHistory(savedDecisions);
            setCurrentStep(Math.min(data.current_week - 1, SIM_WEEKS.length - 1));
            if (data.is_complete) {
              setPhase('results');
            } else if (savedDecisions.length > 0) {
              setPhase('playing');
            }
          }
        }
      });
  }, [user]);

  const saveProgress = useCallback(async (
    newKpis: SimWeekKPIs, newHistory: StepRecord[], stepNum: number, complete: boolean
  ) => {
    if (!user) return;
    const grade = complete ? getStartupGrade(newKpis).grade : null;
    const payload = {
      user_id: user.id,
      current_week: stepNum,
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
    setCurrentStep(0);
    setCurrentDecision(0);
    setKpis({ ...INITIAL_KPIS });
    setHistory([]);
    setStepChoices([]);
    setSimId(null);
    setMultiSelections([]);
  }, []);

  const advanceDecision = (newKpis: SimWeekKPIs, newChoices: string[]) => {
    setKpis(newKpis);
    setStepChoices(newChoices);
    setMultiSelections([]);

    const step = SIM_WEEKS[currentStep];
    if (currentDecision < step.decisions.length - 1) {
      setCurrentDecision(d => d + 1);
    } else {
      const record: StepRecord = { step: currentStep + 1, choices: newChoices, kpis: { ...newKpis } };
      const newHistory = [...history, record];
      setHistory(newHistory);
      setStepChoices([]);
      setCurrentDecision(0);

      if (currentStep < SIM_WEEKS.length - 1) {
        setCurrentStep(w => w + 1);
        saveProgress(newKpis, newHistory, currentStep + 2, false);
      } else {
        setPhase('results');
        saveProgress(newKpis, newHistory, currentStep + 1, true);
      }
    }
  };

  const handleSingleChoice = (optionId: string, effects: Partial<SimWeekKPIs>) => {
    const newKpis = applyDecisionEffects(kpis, effects);
    advanceDecision(newKpis, [...stepChoices, optionId]);
  };

  const handleMultiConfirm = () => {
    if (multiSelections.length === 0) return;
    const decision = SIM_WEEKS[currentStep].decisions[currentDecision];
    const selectedEffects = multiSelections.map(id => {
      const opt = decision.options.find(o => o.id === id);
      return opt?.effects || {};
    });
    const combined = combineEffects(selectedEffects);
    const newKpis = applyDecisionEffects(kpis, combined);
    advanceDecision(newKpis, [...stepChoices, ...multiSelections]);
  };

  const toggleMultiSelection = (optionId: string) => {
    setMultiSelections(prev =>
      prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]
    );
  };

  const performanceScore = Math.round(
    kpis.innovation * 0.25 + kpis.marketPotential * 0.2 + kpis.scalability * 0.2 +
    (100 - kpis.riskLevel) * 0.15 + kpis.growthPotential * 0.2
  );

  // ── INTRO ──
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto max-w-3xl px-4 py-8">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">{t('Dashboard', 'Табло')}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{t('Startup Simulator', 'Стартъп симулатор')}</span>
          </nav>

          <div className="text-center py-10">
            <span className="text-6xl mb-4 block">🚀</span>
            <h1 className="text-3xl font-display font-bold text-foreground mb-3">
              {t('Startup Simulator', 'Стартъп симулатор')}
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              {t(
                'Build a startup step by step. Every decision affects your innovation score, market potential, scalability, risk level, and growth potential. Think strategically — like a real founder.',
                'Изградете стартъп стъпка по стъпка. Всяко решение влияе на вашата иновация, пазарен потенциал, мащабируемост, ниво на риск и потенциал за растеж.'
              )}
            </p>

            <div className="grid gap-3 sm:grid-cols-3 max-w-md mx-auto mb-8 text-left">
              {[
                { icon: '🎯', en: '6 strategic decisions', bg: '6 стратегически решения' },
                { icon: '📊', en: 'Live performance dashboard', bg: 'Табло с показатели в реално време' },
                { icon: '🏆', en: 'Startup Performance Score', bg: 'Оценка на стартъп представянето' },
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
            {SIM_WEEKS.map((w, i) => {
              const Icon = STEP_ICONS[i] || Target;
              return (
                <div key={w.week} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-muted-foreground">{t(`Step ${w.week}`, `Стъпка ${w.week}`)}</span>
                    <h3 className="text-sm font-medium text-foreground">{lang === 'bg' ? w.titleBg : w.titleEn}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTS ──
  if (phase === 'results') {
    const grade = getStartupGrade(kpis);

    const radarData = KPI_META.map(m => ({
      metric: lang === 'bg' ? m.bg : m.en,
      value: m.key === 'riskLevel' ? 100 - kpis[m.key] : kpis[m.key],
      fullMark: 100,
    }));

    const barData = KPI_META.map(m => ({
      name: lang === 'bg' ? m.bg : m.en,
      value: kpis[m.key],
      color: m.color,
      isRisk: m.key === 'riskLevel',
    }));

    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">{t('Dashboard', 'Табло')}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{t('Simulation Results', 'Резултати от симулацията')}</span>
          </nav>

          {/* Grade */}
          <div className="text-center mb-8">
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-full border-4 mb-3" style={{ borderColor: grade.color }}>
              <span className="text-4xl font-display font-bold" style={{ color: grade.color }}>{grade.grade}</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {lang === 'bg' ? grade.labelBg : grade.labelEn}
            </h1>
            <p className="text-lg font-semibold text-primary mt-1">
              {t('Performance Score', 'Оценка на представянето')}: {performanceScore}/100
            </p>
          </div>

          {/* Feedback */}
          <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6 mb-8">
            <h3 className="text-base font-display font-bold text-foreground mb-2 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              {t('Strategic Feedback', 'Стратегическа обратна връзка')}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {lang === 'bg' ? grade.feedbackBg : grade.feedbackEn}
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
            {KPI_META.map(m => (
              <div key={m.key} className="rounded-xl border border-border bg-card p-4 text-center">
                <m.icon className="h-5 w-5 mx-auto mb-1" style={{ color: m.color }} />
                <div className="text-xl font-bold text-foreground">{kpis[m.key]}</div>
                <div className="text-xs text-muted-foreground">{lang === 'bg' ? m.bg : m.en}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                {t('Strategy Radar', 'Стратегически радар')}
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="Score" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                {t('Performance Metrics', 'Метрики на представянето')}
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={100} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {barData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Decision history */}
          <div className="rounded-xl border border-border bg-card p-5 mb-6">
            <h3 className="text-base font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              {t('Your Strategic Decisions', 'Вашите стратегически решения')}
            </h3>
            <div className="space-y-3">
              {history.map((h, i) => {
                const step = SIM_WEEKS[i];
                const Icon = STEP_ICONS[i] || Target;
                return (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground">{t(`Step ${step.week}`, `Стъпка ${step.week}`)}</div>
                      <div className="text-sm font-medium text-foreground">{lang === 'bg' ? step.titleBg : step.titleEn}</div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {h.choices.map(c => {
                          const opt = step.decisions.flatMap(d => d.options).find(o => o.id === c);
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
              <Link to="/my-startup">{t('Go to Startup Project →', 'Отиди към Стартъп проект →')}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── PLAYING ──
  const step = SIM_WEEKS[currentStep];
  const decision = step.decisions[currentDecision];
  const isMulti = !!decision.multiSelect;
  const totalSteps = SIM_WEEKS.length;
  const stepProgress = Math.round(((currentStep + (currentDecision / step.decisions.length)) / totalSteps) * 100);
  const StepIcon = STEP_ICONS[currentStep] || Target;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">{t('Dashboard', 'Табло')}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{t('Startup Simulator', 'Стартъп симулатор')}</span>
        </nav>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-6">
          <Progress value={stepProgress} className="h-2 flex-1" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            {t(`Step ${currentStep + 1}/${totalSteps}`, `Стъпка ${currentStep + 1}/${totalSteps}`)}
          </span>
        </div>

        {/* KPI Dashboard */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {KPI_META.map(m => (
            <div key={m.key} className="rounded-lg border border-border bg-card px-2 py-2 text-center">
              <m.icon className="h-3.5 w-3.5 mx-auto mb-0.5" style={{ color: m.color }} />
              <div className="text-sm font-bold text-foreground">{kpis[m.key]}</div>
              <div className="text-[10px] text-muted-foreground truncate">{lang === 'bg' ? m.bg : m.en}</div>
            </div>
          ))}
        </div>

        {/* Step header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
            <StepIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <Badge variant="outline" className="text-xs mb-1">
              {t(`Step ${step.week}`, `Стъпка ${step.week}`)}
            </Badge>
            <h2 className="text-xl font-display font-bold text-foreground">
              {lang === 'bg' ? step.titleBg : step.titleEn}
            </h2>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          {lang === 'bg' ? step.descBg : step.descEn}
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
                    <Checkbox checked={isSelected} className="mt-0.5 pointer-events-none" tabIndex={-1} />
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{lang === 'bg' ? opt.labelBg : opt.labelEn}</div>
                      <p className="text-sm text-muted-foreground mt-0.5">{lang === 'bg' ? opt.descBg : opt.descEn}</p>
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
                  <p className="text-sm text-muted-foreground mt-0.5">{lang === 'bg' ? opt.descBg : opt.descEn}</p>
                </button>
              );
            })}
          </div>

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
              <Button onClick={handleMultiConfirm} disabled={multiSelections.length === 0}>
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
