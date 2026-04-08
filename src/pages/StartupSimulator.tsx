import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { LearningPhaseBar, WhatYouWillLearn, SIMULATOR_OUTCOMES } from '@/components/learning/LearningStructure';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { useProgress } from '@/context/ProgressContext';
import { StatusBadge } from '@/components/ui/status-badge';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import BMLSummary from '@/components/simulator/BMLSummary';
import ExperimentLab from '@/components/simulator/ExperimentLab';
import {
  ChevronRight, Play, RotateCcw, CheckCircle2,
  Lightbulb, TrendingUp, Layers, ShieldAlert, Rocket,
  Factory, Target, Swords, Wrench, DollarSign, Megaphone,
  BarChart3, HelpCircle, BookOpen, Save, ArrowRight
} from 'lucide-react';
import PhaseBadge from '@/components/ui/phase-badge';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';
import {
  SIM_WEEKS, INITIAL_KPIS, applyDecisionEffects, combineEffects, getStartupGrade,
  MVP_CONSEQUENCES, getWeakestKPI, getCycleDecisions, deriveFinancialKPIs,
  type SimWeekKPIs, type CycleDecision,
} from '@/data/startup-simulator-data';

type Phase = 'intro' | 'playing' | 'bml_summary' | 'experiments' | 'cycle_playing' | 'results';

interface StepRecord {
  step: number;
  choices: string[];
  kpis: SimWeekKPIs;
  cycle?: number;
}

const STEP_ICONS = [Factory, Target, Swords, Wrench, DollarSign, Megaphone];

const KPI_META: { key: keyof SimWeekKPIs; en: string; bg: string; icon: React.ElementType; color: string; hexColor: string; descEn: string; descBg: string; invertedLabel?: boolean }[] = [
  { key: 'innovation', en: 'Innovation', bg: 'Иновация', icon: Lightbulb, color: 'hsl(var(--chart-1))', hexColor: '#8b5cf6', descEn: 'Measures originality and use of digital technology in your solution.', descBg: 'Измерва оригиналността и използването на дигитални технологии в решението ви.' },
  { key: 'marketPotential', en: 'Market Potential', bg: 'Пазарен потенциал', icon: TrendingUp, color: 'hsl(var(--chart-2))', hexColor: '#3b82f6', descEn: 'Evaluates size and demand of the target market.', descBg: 'Оценява размера и търсенето на целевия пазар.' },
  { key: 'scalability', en: 'Scalability', bg: 'Мащабируемост', icon: Layers, color: 'hsl(var(--chart-3))', hexColor: '#22c55e', descEn: 'How easily the solution can grow to serve more users and markets.', descBg: 'Колко лесно решението може да расте, за да обслужва повече потребители и пазари.' },
  { key: 'riskLevel', en: 'Risk Level', bg: 'Ниво на риск', icon: ShieldAlert, color: 'hsl(var(--sim-danger))', hexColor: '#ef4444', descEn: 'Business and execution risk. Lower is better.', descBg: 'Бизнес и оперативен риск. По-ниското е по-добро.', invertedLabel: true },
  { key: 'growthPotential', en: 'Growth Potential', bg: 'Потенциал за растеж', icon: Rocket, color: 'hsl(var(--chart-4))', hexColor: '#f97316', descEn: 'Long-term expansion potential and ability to capture market share.', descBg: 'Дългосрочен потенциал за разширяване и способност за завладяване на пазарен дял.' },
];

export default function StartupSimulator() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const { simComplete, simWeek } = useProgress();
  const [localSimStatus, setLocalSimStatus] = useState<'not_started' | 'in_progress' | 'completed'>('not_started');
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [currentDecision, setCurrentDecision] = useState(0);
  const [kpis, setKpis] = useState<SimWeekKPIs>({ ...INITIAL_KPIS });
  const [history, setHistory] = useState<StepRecord[]>([]);
  const [stepChoices, setStepChoices] = useState<string[]>([]);
  const [simId, setSimId] = useState<string | null>(null);
  const [multiSelections, setMultiSelections] = useState<string[]>([]);
  const [casesCompleted, setCasesCompleted] = useState<number | null>(null);
  const [hasInProgressSession, setHasInProgressSession] = useState(false);
  const [inProgressStep, setInProgressStep] = useState(0);
  const [lastCompletedScore, setLastCompletedScore] = useState<{ score: number; grade: string } | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);

  // BML cycle state
  const [currentCycle, setCurrentCycle] = useState(1);
  const [cycleDecisions, setCycleDecisions] = useState<CycleDecision[]>([]);
  const [cycleDecisionIndex, setCycleDecisionIndex] = useState(0);
  const [experiments, setExperiments] = useState<{ type: string; resultType: string; detail: string }[]>([]);
  const [mvpConsequence, setMvpConsequence] = useState<string | null>(null);

  const MAX_CYCLES = 3;

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth?redirect=/simulator');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from('submissions').select('id', { count: 'exact', head: true })
      .eq('user_id', user.id).eq('is_draft', false)
      .then(({ count }) => setCasesCompleted(count ?? 0));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const loadInProgress = supabase.from('simulator_progress')
      .select('*').eq('user_id', user.id).eq('is_complete', false)
      .order('created_at', { ascending: false }).limit(1).maybeSingle();
    const loadCompleted = supabase.from('simulator_progress')
      .select('grade, kpis').eq('user_id', user.id).eq('is_complete', true)
      .order('created_at', { ascending: false }).limit(1).maybeSingle();

    Promise.all([loadInProgress, loadCompleted]).then(([ipRes, compRes]) => {
      if (ipRes.data) {
        const data = ipRes.data;
        setSimId(data.id);
        const raw = data.kpis as any;
        const savedKpis: SimWeekKPIs = {
          innovation: Number(raw?.innovation) || 0, marketPotential: Number(raw?.marketPotential) || 0,
          scalability: Number(raw?.scalability) || 0, riskLevel: Number(raw?.riskLevel) || 0,
          growthPotential: Number(raw?.growthPotential) || 0,
        };
        const savedDecisions = data.decisions as any as StepRecord[];
        if (savedKpis && savedDecisions && savedDecisions.length > 0) {
          setKpis(savedKpis);
          setHistory(savedDecisions);
          setCurrentStep(Math.min(data.current_week - 1, SIM_WEEKS.length - 1));
          setHasInProgressSession(true);
          setInProgressStep(data.current_week);
          setLocalSimStatus('in_progress');
        }
      }
      if (compRes.data) {
        const raw = compRes.data.kpis as any;
        const score = Math.round(
          (Number(raw?.innovation) || 0) * 0.25 + (Number(raw?.marketPotential) || 0) * 0.2 +
          (Number(raw?.scalability) || 0) * 0.2 + (100 - (Number(raw?.riskLevel) || 0)) * 0.15 +
          (Number(raw?.growthPotential) || 0) * 0.2
        );
        setLastCompletedScore({ score, grade: compRes.data.grade || '' });
        if (!ipRes.data) setLocalSimStatus('completed');
      }
      setSessionLoaded(true);
    });
  }, [user]);

  const saveProgress = useCallback(async (
    newKpis: SimWeekKPIs, newHistory: StepRecord[], stepNum: number, complete: boolean
  ) => {
    if (!user) return;
    const grade = complete ? getStartupGrade(newKpis).grade : null;
    const payload = {
      user_id: user.id, current_week: stepNum,
      kpis: newKpis as any, decisions: newHistory as any,
      is_complete: complete, grade,
    };
    if (simId) {
      await supabase.from('simulator_progress').update(payload).eq('id', simId);
    } else {
      const { data } = await supabase.from('simulator_progress').insert(payload).select('id').single();
      if (data) setSimId(data.id);
    }
    if (complete) {
      const { awardXp } = await import('@/lib/xp');
      const result = await awardXp('sim_scenario_complete', simId || 'new');
      let totalXpMsg = result.xp_awarded;
      const score = Math.round(
        newKpis.innovation * 0.25 + newKpis.marketPotential * 0.2 + newKpis.scalability * 0.2 +
        (100 - newKpis.riskLevel) * 0.15 + newKpis.growthPotential * 0.2
      );
      if (score >= 75) {
        const bonus = await awardXp('sim_high_performance', simId || 'new');
        totalXpMsg += bonus.xp_awarded;
      }
      if (totalXpMsg > 0) {
        toast.success(`+${totalXpMsg} XP ${lang === 'bg' ? 'спечелени!' : 'earned!'}`);
      }
    }
  }, [user, simId, lang]);

  const reset = useCallback(async () => {
    setPhase('intro'); setCurrentStep(0); setCurrentDecision(0);
    setKpis({ ...INITIAL_KPIS }); setHistory([]); setStepChoices([]);
    setSimId(null); setMultiSelections([]); setCurrentCycle(1);
    setCycleDecisions([]); setCycleDecisionIndex(0); setExperiments([]);
    setMvpConsequence(null);
  }, []);

  const advanceDecision = (newKpis: SimWeekKPIs, newChoices: string[]) => {
    setKpis(newKpis); setStepChoices(newChoices); setMultiSelections([]);

    // Check for MVP consequence feedback
    const lastChoice = newChoices[newChoices.length - 1];
    if (MVP_CONSEQUENCES[lastChoice]) {
      setMvpConsequence(lastChoice);
    }

    const step = SIM_WEEKS[currentStep];
    if (currentDecision < step.decisions.length - 1) {
      setCurrentDecision(d => d + 1);
    } else {
      const record: StepRecord = { step: currentStep + 1, choices: newChoices, kpis: { ...newKpis }, cycle: currentCycle };
      const newHistory = [...history, record];
      setHistory(newHistory); setStepChoices([]); setCurrentDecision(0);
      setMvpConsequence(null);

      if (currentStep < SIM_WEEKS.length - 1) {
        setCurrentStep(w => w + 1);
        saveProgress(newKpis, newHistory, currentStep + 2, false);
      } else {
        // Cycle 1 complete → BML Summary instead of results
        setPhase('bml_summary');
        saveProgress(newKpis, newHistory, currentStep + 1, false);
      }
    }
  };

  const handleSingleChoice = (optionId: string, effects: Partial<SimWeekKPIs>) => {
    const newKpis = applyDecisionEffects(kpis, effects);
    advanceDecision(newKpis, [...stepChoices, optionId]);
  };

  const handleMultiConfirm = () => {
    if (multiSelections.length === 0) return;
    const step = SIM_WEEKS[currentStep];
    const decision = step.decisions[currentDecision];
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

  // Cycle 2/3 decision handling
  const handleCycleDecision = (optionId: string, effects: Partial<SimWeekKPIs>) => {
    const newKpis = applyDecisionEffects(kpis, effects);
    setKpis(newKpis);
    const record: StepRecord = {
      step: cycleDecisionIndex + 1, choices: [optionId], kpis: { ...newKpis }, cycle: currentCycle,
    };
    const newHistory = [...history, record];
    setHistory(newHistory);

    if (cycleDecisionIndex < cycleDecisions.length - 1) {
      setCycleDecisionIndex(i => i + 1);
    } else {
      // Cycle complete → BML Summary
      setPhase('bml_summary');
      saveProgress(newKpis, newHistory, SIM_WEEKS.length, false);
    }
  };

  const startNextCycle = () => {
    const nextCycle = currentCycle + 1;
    setCurrentCycle(nextCycle);
    const weakest = getWeakestKPI(kpis);
    const decisions = getCycleDecisions(weakest);
    setCycleDecisions(decisions);
    setCycleDecisionIndex(0);
    setPhase('cycle_playing');
  };

  const finishSimulation = () => {
    setPhase('results');
    setLocalSimStatus('completed');
    saveProgress(kpis, history, SIM_WEEKS.length, true);
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

          {casesCompleted === 0 && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-4 mb-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {t('Tip: Complete a case study first to get more from the simulator.', 'Съвет: Завърши казус първо, за да извлечеш повече от симулатора.')}
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate('/cases')} className="shrink-0">
                {t('Start a Case →', 'Започни казус →')}
              </Button>
            </div>
          )}

          <div className="space-y-4 py-6">
            <LearningPhaseBar currentPhase="learn" lang={lang as 'en' | 'bg'} />
            <WhatYouWillLearn outcomes={SIMULATOR_OUTCOMES} lang={lang as 'en' | 'bg'} activityType={{ en: 'Simulator', bg: 'Симулатор' }} />

            <div className="text-center pt-4">
              <span className="text-6xl mb-4 block">🚀</span>
              <h1 className="typo-h1 mb-3 flex items-center justify-center gap-3">
                {t('Startup Simulator', 'Стартъп симулатор')}
                <PhaseBadge phase="apply" lang={lang as 'en' | 'bg'} />
                <StatusBadge status={localSimStatus as any} lang={lang as 'en' | 'bg'} size="md" />
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                {t(
                  'Build a startup using the Build-Measure-Learn loop. Make decisions, measure results, learn from outcomes, and iterate up to 3 cycles.',
                  'Изгради стартъп чрез Build-Measure-Learn цикъла. Вземай решения, измервай резултати, учи се от резултатите и итерирай до 3 цикъла.'
                )}
              </p>

              <div className="grid gap-3 sm:grid-cols-4 max-w-lg mx-auto mb-8 text-left">
                {[
                  { icon: '🎯', en: '6 strategic decisions', bg: '6 стратегически решения' },
                  { icon: '🔄', en: 'Up to 3 BML cycles', bg: 'До 3 BML цикъла' },
                  { icon: '🧪', en: 'Run experiments', bg: 'Стартирай експерименти' },
                  { icon: '🏆', en: 'Full startup report', bg: 'Пълен стартъп отчет' },
                ].map((f, i) => (
                  <div key={i} className="rounded-lg border border-border bg-card p-3 text-center">
                    <span className="text-2xl block mb-1">{f.icon}</span>
                    <span className="text-xs text-muted-foreground">{lang === 'bg' ? f.bg : f.en}</span>
                  </div>
                ))}
              </div>

              {hasInProgressSession ? (
                <div className="space-y-3">
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 max-w-md mx-auto text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <BarChart3 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{t('Simulation in progress', 'Симулация в процес')}</p>
                        <p className="text-xs text-muted-foreground">{t(`Step ${inProgressStep} of ${SIM_WEEKS.length} completed`, `Стъпка ${inProgressStep} от ${SIM_WEEKS.length} завършена`)}</p>
                      </div>
                    </div>
                    <Progress value={(inProgressStep / SIM_WEEKS.length) * 100} className="h-1.5" />
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <Button size="lg" onClick={() => setPhase('playing')}>
                      <Play className="h-4 w-4 mr-2" />{t('Resume Simulation', 'Продължи симулацията')}
                    </Button>
                    <Button size="lg" variant="outline" onClick={reset}>
                      <RotateCcw className="h-4 w-4 mr-2" />{t('Start New', 'Започни нова')}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button size="lg" onClick={() => setPhase('playing')}>
                  <Play className="h-4 w-4 mr-2" />{t('Start Simulation', 'Стартирай симулацията')}
                </Button>
              )}

              {lastCompletedScore && !hasInProgressSession && (
                <div className="mt-4 rounded-xl border border-border bg-card p-4 max-w-sm mx-auto">
                  <p className="text-xs text-muted-foreground mb-1">{t('Last Result', 'Последен резултат')}</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl font-bold text-primary">{lastCompletedScore.score}</span>
                    <span className="text-sm text-muted-foreground">/100</span>
                    {lastCompletedScore.grade && <Badge variant="outline" className="text-sm">{lastCompletedScore.grade}</Badge>}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 mt-4">
              {SIM_WEEKS.map((w, i) => {
                const Icon = STEP_ICONS[i] || Target;
                const isCompleted = hasInProgressSession && i < inProgressStep;
                const isCurrent = hasInProgressSession && i === inProgressStep;
                return (
                  <div key={w.week} className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${isCompleted ? 'border-emerald-500/30 bg-emerald-500/5' : isCurrent ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'}`}>
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${isCompleted ? 'bg-emerald-500/15' : 'bg-primary/10'}`}>
                      {isCompleted ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Icon className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <span className="text-xs text-muted-foreground">{t(`Step ${w.week}`, `Стъпка ${w.week}`)}</span>
                      <h3 className="text-sm font-medium text-foreground">{lang === 'bg' ? w.titleBg : w.titleEn}</h3>
                    </div>
                    {isCurrent && <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">{t('Next', 'Следваща')}</Badge>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── BML SUMMARY ──
  if (phase === 'bml_summary') {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">{t('Dashboard', 'Табло')}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{t('BML Summary', 'BML Обобщение')}</span>
          </nav>
          <BMLSummary
            cycle={currentCycle}
            kpis={kpis}
            history={history}
            lang={lang as 'en' | 'bg'}
            onStartNextCycle={startNextCycle}
            onFinish={finishSimulation}
            onOpenExperiments={() => setPhase('experiments')}
            maxCycles={MAX_CYCLES}
          />
        </div>
      </div>
    );
  }

  // ── EXPERIMENTS ──
  if (phase === 'experiments') {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <ExperimentLab
            cycle={currentCycle}
            kpis={kpis}
            lang={lang as 'en' | 'bg'}
            onComplete={(newKpis, exp) => {
              setKpis(newKpis);
              setExperiments(prev => [...prev, exp]);
              // Save experiment to DB
              if (user && simId) {
                supabase.from('simulator_experiments').insert({
                  simulation_id: simId, user_id: user.id,
                  experiment_type: exp.type as any, cycle: currentCycle,
                  result_type: exp.resultType as any,
                  result_detail: { detail: exp.detail } as any,
                }).then(() => {});
              }
              startNextCycle();
            }}
            onSkip={() => startNextCycle()}
          />
        </div>
      </div>
    );
  }

  // ── CYCLE PLAYING (Cycles 2/3) ──
  if (phase === 'cycle_playing' && cycleDecisions.length > 0) {
    const cd = cycleDecisions[cycleDecisionIndex];
    const decision = cd.decision;
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto max-w-3xl px-4 py-8">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">{t('Dashboard', 'Табло')}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{t(`Cycle ${currentCycle}`, `Цикъл ${currentCycle}`)}</span>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <Progress value={((cycleDecisionIndex + 1) / cycleDecisions.length) * 100} className="h-2 flex-1" />
            <span className="text-xs font-medium text-muted-foreground shrink-0">
              {t(`Decision ${cycleDecisionIndex + 1}/${cycleDecisions.length}`, `Решение ${cycleDecisionIndex + 1}/${cycleDecisions.length}`)}
            </span>
          </div>

          {/* KPI Dashboard */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {KPI_META.map(m => (
              <div key={m.key} className="rounded-lg border border-border bg-card px-2 py-2 text-center">
                <m.icon className="h-3.5 w-3.5 mx-auto mb-0.5" style={{ color: m.color }} />
                <div className="text-sm font-bold text-foreground">{kpis[m.key]}</div>
                <div className="text-xs text-muted-foreground truncate">{lang === 'bg' ? m.bg : m.en}</div>
              </div>
            ))}
          </div>

          <Badge variant="outline" className="mb-2">{t(`Cycle ${currentCycle}`, `Цикъл ${currentCycle}`)}</Badge>
          <h2 className="text-xl font-display font-bold text-foreground mb-1">
            {lang === 'bg' ? cd.titleBg : cd.titleEn}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">{lang === 'bg' ? cd.descBg : cd.descEn}</p>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-base font-semibold text-foreground mb-4">
              {lang === 'bg' ? decision.questionBg : decision.questionEn}
            </h3>
            <div className="space-y-3">
              {decision.options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleCycleDecision(opt.id, opt.effects)}
                  className="w-full text-left rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-accent/50 transition-all group"
                >
                  <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {lang === 'bg' ? opt.labelBg : opt.labelEn}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{lang === 'bg' ? opt.descBg : opt.descEn}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTS (Full redesign) ──
  if (phase === 'results') {
    const grade = getStartupGrade(kpis);
    const safeKpis: SimWeekKPIs = {
      innovation: Number(kpis.innovation) || 0, marketPotential: Number(kpis.marketPotential) || 0,
      scalability: Number(kpis.scalability) || 0, riskLevel: Number(kpis.riskLevel) || 0,
      growthPotential: Number(kpis.growthPotential) || 0,
    };
    const safeScore = Math.round(
      safeKpis.innovation * 0.25 + safeKpis.marketPotential * 0.2 + safeKpis.scalability * 0.2 +
      (100 - safeKpis.riskLevel) * 0.15 + safeKpis.growthPotential * 0.2
    );
    const financial = deriveFinancialKPIs(safeKpis, history.flatMap(h => h.choices));
    const financialRating = financial.burnRate <= 0 ? 'A' : financial.breakEvenMonth <= 12 ? 'B' : financial.breakEvenMonth <= 24 ? 'C' : 'D';
    const gradeColor = safeScore >= 90 ? '#22c55e' : safeScore >= 75 ? '#3b82f6' : safeScore >= 60 ? '#eab308' : '#ef4444';

    const radarData = KPI_META.map(m => ({
      metric: lang === 'bg' ? m.bg : m.en,
      value: m.key === 'riskLevel' ? 100 - safeKpis[m.key] : safeKpis[m.key],
      fullMark: 100,
    }));

    // Group history by cycle
    const cycles = Array.from(new Set(history.map(h => h.cycle || 1)));

    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto max-w-4xl px-4 py-8 animate-fade-in">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">{t('Dashboard', 'Табло')}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{t('Final Report', 'Финален отчет')}</span>
          </nav>

          {/* Section 1: Startup Scorecard */}
          <div className="text-center mb-8 animate-scale-in">
            <div className="inline-flex h-28 w-28 items-center justify-center rounded-full border-4 mb-3" style={{ borderColor: gradeColor }}>
              <div className="text-center">
                <span className="text-4xl font-display font-bold block" style={{ color: gradeColor }}>{safeScore}</span>
                <span className="text-xs text-muted-foreground">/100</span>
              </div>
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">{lang === 'bg' ? grade.labelBg : grade.labelEn}</h1>
            <div className="flex items-center justify-center gap-3 mt-2">
              <Badge style={{ backgroundColor: gradeColor, color: '#fff' }}>{t('Strategic', 'Стратегически')}: {grade.grade}</Badge>
              <Badge variant="outline">{t('Financial', 'Финансов')}: {financialRating}</Badge>
            </div>
          </div>

          {/* Section 2: Lean Startup Journey */}
          <div className="rounded-xl border border-border bg-card p-6 mb-6">
            <h3 className="text-base font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              🔄 {t('Your Lean Startup Journey', 'Твоето Lean Startup пътешествие')}
            </h3>
            <div className="space-y-4">
              {cycles.map(cycleNum => {
                const cycleHistory = history.filter(h => (h.cycle || 1) === cycleNum);
                return (
                  <div key={cycleNum} className="rounded-lg border border-border/50 bg-accent/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{t(`Cycle ${cycleNum}`, `Цикъл ${cycleNum}`)}</Badge>
                    </div>
                    <div className="space-y-1">
                      {cycleHistory.map((h, i) => {
                        const stepData = cycleNum === 1 ? SIM_WEEKS[h.step - 1] : null;
                        return (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <span className="text-primary">→</span>
                            <span className="text-muted-foreground">
                              {h.choices.map(c => {
                                if (stepData) {
                                  const opt = stepData.decisions.flatMap(d => d.options).find(o => o.id === c);
                                  return opt ? (lang === 'bg' ? opt.labelBg : opt.labelEn) : c;
                                }
                                return c;
                              }).join(', ')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {experiments.length > 0 && (
                <div className="rounded-lg border border-border/50 bg-accent/20 p-4">
                  <Badge variant="outline" className="text-xs mb-2">🧪 {t('Experiments', 'Експерименти')}</Badge>
                  {experiments.map((exp, i) => (
                    <div key={i} className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <span>{exp.resultType === 'signal' ? '✅' : exp.resultType === 'inconclusive' ? '🟡' : '❌'}</span>
                      <span>{exp.detail.slice(0, 80)}...</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* KPI Cards + Radar */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {KPI_META.map(m => {
              const val = safeKpis[m.key];
              const cardColor = m.invertedLabel
                ? (val <= 30 ? '#22c55e' : val <= 60 ? '#eab308' : '#ef4444')
                : (val >= 70 ? '#22c55e' : val >= 40 ? '#eab308' : '#ef4444');
              return (
                <div key={m.key} className="rounded-xl border border-border bg-card p-4 text-center">
                  <m.icon className="h-5 w-5 mx-auto mb-1" style={{ color: m.hexColor }} />
                  <div className="text-2xl font-bold" style={{ color: cardColor }}>{val}</div>
                  <div className="text-xs text-muted-foreground">{lang === 'bg' ? m.bg : m.en}</div>
                </div>
              );
            })}
          </div>

          {/* Radar */}
          <div className="rounded-xl border border-border bg-card p-5 mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">{t('Strategy Radar', 'Стратегически радар')}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} tickCount={5} />
                  <Radar name="Score" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Feedback */}
          <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6 mb-6">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              {t('Strategic Feedback', 'Стратегическа обратна връзка')}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{lang === 'bg' ? grade.feedbackBg : grade.feedbackEn}</p>
          </div>

          {/* Section 4: What a real founder would have done */}
          <div className="rounded-xl border border-border bg-card p-6 mb-6">
            <h3 className="text-base font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              💭 {t('What a Real Founder Would Have Done Differently', 'Какво би направил истински основател по-различно')}
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              {safeKpis.riskLevel > 50 && (
                <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3">
                  <p>{t(
                    'If you had chosen MVP instead of a full product, break-even would have been 4 months earlier and you\'d have €12K more in the bank.',
                    'Ако беше избрал MVP вместо пълен продукт, break-even щеше да е с 4 месеца по-рано и щеше да имаш €12K повече в банката.'
                  )}</p>
                </div>
              )}
              {safeKpis.growthPotential < 60 && (
                <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3">
                  <p>{t(
                    'Adding a referral program early (like Dropbox) could have doubled your user growth rate with minimal cost.',
                    'Добавянето на реферална програма рано (като Dropbox) можеше да удвои темпа на растеж на потребителите при минимални разходи.'
                  )}</p>
                </div>
              )}
              {safeKpis.scalability < 60 && (
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                  <p>{t(
                    'Investing in microservices architecture from Cycle 1 would have given you 10x scalability headroom for international expansion.',
                    'Инвестирането в микросервизна архитектура от Цикъл 1 щеше да ти даде 10x резерв за мащабиране при международна експанзия.'
                  )}</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Save to My Startup */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-1.5" />{t('Play Again', 'Играй отново')}
            </Button>
            <Button
              className="sim-gradient border-0"
              onClick={async () => {
                if (!user) return;
                const step1Choice = history[0]?.choices?.[0] || '';
                const step2Choice = history[1]?.choices?.[0] || '';
                const industryOpt = SIM_WEEKS[0]?.decisions?.[0]?.options?.find(o => o.id === step1Choice);
                const problemOpt = SIM_WEEKS[1]?.decisions?.[0]?.options?.find(o => o.id === step2Choice);
                const industryText = industryOpt ? (lang === 'bg' ? industryOpt.labelBg : industryOpt.labelEn) : '';
                const problemText = problemOpt ? (lang === 'bg' ? problemOpt.descBg : problemOpt.descEn) : '';
                const { data: existing } = await supabase.from('startup_projects').select('id').eq('user_id', user.id).maybeSingle();
                if (existing) {
                  await supabase.from('startup_projects').update({ industry: industryText, problem: problemText }).eq('id', existing.id);
                } else {
                  await supabase.from('startup_projects').insert({ user_id: user.id, industry: industryText, problem: problemText });
                }
                toast.success(t('Simulator results saved!', 'Резултатите от симулатора са запазени!'));
                navigate('/my-startup');
              }}
            >
              <Rocket className="h-4 w-4 mr-1.5" />{t('Save Results to My Startup', 'Запази в Моя стартъп')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── PLAYING (Cycle 1) ──
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
              <div className="text-xs text-muted-foreground truncate">{lang === 'bg' ? m.bg : m.en}</div>
            </div>
          ))}
        </div>

        {/* MVP consequence feedback */}
        {mvpConsequence && MVP_CONSEQUENCES[mvpConsequence] && (
          <div className={`rounded-xl border-2 p-4 mb-4 ${mvpConsequence === 's4-fullproduct' ? 'border-destructive/30 bg-destructive/5' : 'border-emerald-500/30 bg-emerald-500/5'}`}>
            <p className="text-sm text-foreground/80">
              {lang === 'bg' ? MVP_CONSEQUENCES[mvpConsequence].bg : MVP_CONSEQUENCES[mvpConsequence].en}
            </p>
            <p className="text-xs text-muted-foreground mt-1 font-mono">{MVP_CONSEQUENCES[mvpConsequence].kpiLabel}</p>
          </div>
        )}

        {/* Step header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
            <StepIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <Badge variant="outline" className="text-xs mb-1">{t(`Step ${step.week}`, `Стъпка ${step.week}`)}</Badge>
            <h2 className="text-xl font-display font-bold text-foreground">{lang === 'bg' ? step.titleBg : step.titleEn}</h2>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">{lang === 'bg' ? step.descBg : step.descEn}</p>

        {step.theoryConceptEn && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 mb-3">
            <BookOpen className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium text-primary">
              {t('Related theory:', 'Свързана теория:')} {lang === 'bg' ? step.theoryConceptBg : step.theoryConceptEn}
            </span>
          </div>
        )}

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
                  <button key={opt.id} onClick={() => toggleMultiSelection(opt.id)}
                    className={`w-full text-left rounded-lg border p-4 transition-all flex items-start gap-3 ${isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary/40 hover:bg-accent/50'}`}>
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
                <button key={opt.id} onClick={() => handleSingleChoice(opt.id, opt.effects)}
                  className="w-full text-left rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-accent/50 transition-all group">
                  <div className="font-medium text-foreground group-hover:text-primary transition-colors">{lang === 'bg' ? opt.labelBg : opt.labelEn}</div>
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
              <span className="text-sm text-muted-foreground">{multiSelections.length} {t('selected', 'избрани')}</span>
              <Button onClick={handleMultiConfirm} disabled={multiSelections.length === 0}>
                {t('Confirm Choices', 'Потвърдете избора')}<ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
