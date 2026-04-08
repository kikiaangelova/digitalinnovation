import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Lightbulb, TrendingUp, Layers, ShieldAlert, Rocket,
  Hammer, BarChart3, Brain, ArrowRight, Save,
} from 'lucide-react';
import {
  SimWeekKPIs, FinancialKPIs, deriveFinancialKPIs,
  generateCycleInsight, SIM_WEEKS, type SimDecisionOption,
} from '@/data/startup-simulator-data';

interface StepRecord {
  step: number;
  choices: string[];
  kpis: SimWeekKPIs;
}

interface Props {
  cycle: number;
  kpis: SimWeekKPIs;
  history: StepRecord[];
  lang: 'en' | 'bg';
  onStartNextCycle: () => void;
  onFinish: () => void;
  onOpenExperiments: () => void;
  maxCycles?: number;
}

const KPI_META = [
  { key: 'innovation' as keyof SimWeekKPIs, en: 'Innovation', bg: 'Иновация', icon: Lightbulb, color: '#8b5cf6' },
  { key: 'marketPotential' as keyof SimWeekKPIs, en: 'Market', bg: 'Пазар', icon: TrendingUp, color: '#3b82f6' },
  { key: 'scalability' as keyof SimWeekKPIs, en: 'Scale', bg: 'Мащаб', icon: Layers, color: '#22c55e' },
  { key: 'riskLevel' as keyof SimWeekKPIs, en: 'Risk', bg: 'Риск', icon: ShieldAlert, color: '#ef4444' },
  { key: 'growthPotential' as keyof SimWeekKPIs, en: 'Growth', bg: 'Растеж', icon: Rocket, color: '#f97316' },
];

export default function BMLSummary({
  cycle, kpis, history, lang, onStartNextCycle, onFinish, onOpenExperiments, maxCycles = 3,
}: Props) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const financial = deriveFinancialKPIs(kpis, history.flatMap(h => h.choices));
  const { insight, weakest } = generateCycleInsight(kpis, financial, lang);
  const canContinue = cycle < maxCycles;

  // Get labels for choices made
  const buildChoices = history.map(h => {
    const step = SIM_WEEKS[h.step - 1];
    if (!step) return [];
    return h.choices.map(choiceId => {
      const opt = step.decisions.flatMap(d => d.options).find(o => o.id === choiceId);
      return opt ? (lang === 'bg' ? opt.labelBg : opt.labelEn) : choiceId;
    });
  }).flat();

  const weakestLabel = KPI_META.find(m => m.key === weakest);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <span className="text-4xl mb-2 block">🔄</span>
        <h2 className="text-2xl font-display font-bold text-foreground">
          {t(`Cycle ${cycle} Complete — Build-Measure-Learn`, `Цикъл ${cycle} завършен — Build-Measure-Learn`)}
        </h2>
      </div>

      {/* BML Three columns */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* BUILD */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Hammer className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">🔨 BUILD</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{t('You chose:', 'Избра:')}</p>
          <div className="space-y-1">
            {buildChoices.slice(0, 6).map((c, i) => (
              <div key={i} className="text-sm text-foreground flex items-start gap-1.5">
                <span className="text-primary mt-0.5">·</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MEASURE */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">📊 MEASURE</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{t('Results:', 'Резултати:')}</p>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">{t('Revenue', 'Приходи')}:</span><span className="font-mono font-medium">€{financial.revenue.toLocaleString()}/м</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t('Users', 'Потребители')}:</span><span className="font-mono font-medium">{financial.totalUsers}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t('Engagement', 'Ангажираност')}:</span><span className="font-mono font-medium">{financial.engagement}%</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t('Retention', 'Задържане')}:</span><span className="font-mono font-medium">{financial.retention}%</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t('Rev/user', 'Прих./потр.')}:</span><span className="font-mono font-medium">€{financial.revenuePerUser}</span></div>
          </div>
        </div>

        {/* LEARN */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">💡 LEARN</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{t('Insight:', 'Прозрение:')}</p>
          <p className="text-sm text-foreground leading-relaxed">{insight}</p>
        </div>
      </div>

      {/* Strategic KPIs */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">{t('Strategic KPIs', 'Стратегически KPI-та')}</h3>
        <div className="grid grid-cols-5 gap-3">
          {KPI_META.map(m => {
            const val = kpis[m.key];
            const isWeak = m.key === weakest;
            return (
              <div key={m.key} className={`rounded-lg p-3 text-center ${isWeak ? 'border-2 border-destructive/50 bg-destructive/5' : 'border border-border'}`}>
                <m.icon className="h-4 w-4 mx-auto mb-1" style={{ color: m.color }} />
                <div className="text-xl font-bold" style={{ color: m.color }}>{val}</div>
                <div className="text-xs text-muted-foreground">{lang === 'bg' ? m.bg : m.en}</div>
                {isWeak && <Badge variant="destructive" className="text-[9px] mt-1">⚠️ {t('Weak', 'Слаб')}</Badge>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">{t('Financial KPIs', 'Финансови KPI-та')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg border border-border p-3 text-center">
            <p className="text-xs text-muted-foreground">{t('Revenue', 'Приходи')}</p>
            <p className="text-lg font-bold text-foreground">€{financial.revenue.toLocaleString()}/м</p>
          </div>
          <div className="rounded-lg border border-border p-3 text-center">
            <p className="text-xs text-muted-foreground">{t('Costs', 'Разходи')}</p>
            <p className="text-lg font-bold text-foreground">€{financial.costs.toLocaleString()}/м</p>
          </div>
          <div className="rounded-lg border border-border p-3 text-center">
            <p className="text-xs text-muted-foreground">{t('Burn Rate', 'Горене')}</p>
            <p className={`text-lg font-bold ${financial.burnRate > 0 ? 'text-destructive' : 'text-emerald-600'}`}>
              {financial.burnRate > 0 ? `-€${financial.burnRate.toLocaleString()}/м` : t('Profitable!', 'Печеливш!')}
            </p>
          </div>
          <div className="rounded-lg border border-border p-3 text-center">
            <p className="text-xs text-muted-foreground">{t('Break-even', 'Break-even')}</p>
            <p className="text-lg font-bold text-foreground">
              {financial.breakEvenMonth > 0 ? `${t('Month', 'Месец')} ${financial.breakEvenMonth}` : '✅'}
            </p>
          </div>
        </div>
      </div>

      {/* Key Insight */}
      <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5">
        <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          {t('KEY INSIGHT', 'КЛЮЧОВО ПРОЗРЕНИЕ')}
        </h3>
        <p className="text-sm text-foreground/80 leading-relaxed">{insight}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {canContinue && (
          <>
            <Button onClick={onOpenExperiments} variant="outline" size="lg">
              🧪 {t('Run an Experiment', 'Стартирай експеримент')}
            </Button>
            <Button onClick={onStartNextCycle} size="lg" className="sim-gradient border-0">
              🔄 {t(`Start Cycle ${cycle + 1} — improve ${lang === 'bg' ? weakestLabel?.bg : weakestLabel?.en}`, `Стартирай Цикъл ${cycle + 1} — подобри ${lang === 'bg' ? weakestLabel?.bg : weakestLabel?.en}`)}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </>
        )}
        <Button onClick={onFinish} variant={canContinue ? 'outline' : 'default'} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {t('Save & Finish', 'Запази и приключи')}
        </Button>
      </div>
    </div>
  );
}
