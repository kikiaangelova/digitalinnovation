import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import {
  EXPERIMENTS, rollExperimentResult, applyDecisionEffects,
  type ExperimentDef, type SimWeekKPIs,
} from '@/data/startup-simulator-data';

interface Props {
  cycle: number;
  kpis: SimWeekKPIs;
  lang: 'en' | 'bg';
  onComplete: (newKpis: SimWeekKPIs, experiment: { type: string; resultType: string; detail: string }) => void;
  onSkip: () => void;
}

export default function ExperimentLab({ cycle, kpis, lang, onComplete, onSkip }: Props) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const [selected, setSelected] = useState<ExperimentDef | null>(null);
  const [result, setResult] = useState<{ type: 'signal' | 'inconclusive' | 'no_traction'; detail: string; newKpis: SimWeekKPIs } | null>(null);

  const runExperiment = (exp: ExperimentDef) => {
    setSelected(exp);
    const resultType = rollExperimentResult();
    const outcome = exp.outcomes[resultType];
    const detail = lang === 'bg'
      ? ('bg' in outcome ? outcome.bg : '')
      : ('en' in outcome ? outcome.en : '');
    const effects = 'effects' in outcome ? outcome.effects : {};
    const newKpis = applyDecisionEffects(kpis, effects);
    setResult({ type: resultType, detail, newKpis });
  };

  const resultIcon = result?.type === 'signal' ? CheckCircle2 : result?.type === 'inconclusive' ? AlertTriangle : XCircle;
  const resultColor = result?.type === 'signal' ? 'text-emerald-600' : result?.type === 'inconclusive' ? 'text-amber-500' : 'text-destructive';
  const resultLabel = result?.type === 'signal'
    ? t('Signal Detected', 'Сигнал открит')
    : result?.type === 'inconclusive'
    ? t('Inconclusive', 'Неубедителен')
    : t('No Traction', 'Без трекшън');

  // Show result
  if (selected && result) {
    const Icon = resultIcon;
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center">
          <span className="text-4xl mb-2 block">🧪</span>
          <h2 className="text-2xl font-display font-bold text-foreground">
            {t('Experiment Results', 'Резултати от експеримента')}
          </h2>
        </div>

        <div className="rounded-xl border-2 border-border bg-card p-6 max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Icon className={`h-8 w-8 ${resultColor}`} />
            <div>
              <h3 className="font-semibold text-foreground">{lang === 'bg' ? selected.titleBg : selected.titleEn}</h3>
              <Badge className={result.type === 'signal' ? 'bg-emerald-500' : result.type === 'inconclusive' ? 'bg-amber-500' : 'bg-destructive'}>
                {resultLabel}
              </Badge>
            </div>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed mb-4">{result.detail}</p>

          <div className="rounded-lg bg-accent/50 border border-border p-3 space-y-2 text-sm">
            <p className="font-medium text-foreground">
              📊 {t('What you learned:', 'Какво научи:')}
            </p>
            <p className="text-muted-foreground">{result.detail}</p>
            <p className="font-medium text-foreground mt-2">
              ❓ {t('What you still don\'t know:', 'Какво все още не знаеш:')}
            </p>
            <p className="text-muted-foreground">
              {result.type === 'signal'
                ? t('Whether this insight holds at scale with real users.', 'Дали тази находка ще се потвърди при мащаб с реални потребители.')
                : result.type === 'inconclusive'
                ? t('The data is insufficient. You need a larger test or different approach.', 'Данните са недостатъчни. Нуждаеш се от по-голям тест или различен подход.')
                : t('Whether a pivot would save the startup or just delay the inevitable.', 'Дали пивотът ще спаси стартъпа или само ще забави неизбежното.')
              }
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Button size="lg" onClick={() => onComplete(result.newKpis, { type: selected.type, resultType: result.type, detail: result.detail })}>
            {t('Continue to Next Cycle', 'Продължи към следващия цикъл')} →
          </Button>
        </div>
      </div>
    );
  }

  // Experiment selection
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <span className="text-4xl mb-2 block">🧪</span>
        <h2 className="text-2xl font-display font-bold text-foreground">
          {t('Experiment Lab', 'Лаборатория за експерименти')}
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
          {t(
            'Before your next decision, you can run 1 experiment. Each costs resources but reduces uncertainty.',
            'Преди да решиш следващото действие, можеш да стартираш 1 експеримент. Всеки струва ресурси, но намалява несигурността.'
          )}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {EXPERIMENTS.map(exp => (
          <div key={exp.type} className="rounded-xl border border-border bg-card p-5 hover:border-primary/50 transition-all">
            <h3 className="font-semibold text-foreground mb-1">{lang === 'bg' ? exp.titleBg : exp.titleEn}</h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <span>💰 €{exp.costEuros}</span>
              <span>⏱ {lang === 'bg' ? exp.timeBg : exp.timeEn}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{lang === 'bg' ? exp.descBg : exp.descEn}</p>

            <div className="rounded-lg bg-accent/50 p-2.5 mb-3 text-xs space-y-1">
              <p className="text-muted-foreground">{t('Possible outcomes:', 'Възможни резултати:')}</p>
              <p>🎲 {lang === 'bg' ? exp.outcomes.signal.bg.slice(0, 60) : exp.outcomes.signal.en.slice(0, 60)}...</p>
              <p>🎲 {lang === 'bg' ? exp.outcomes.inconclusive.bg.slice(0, 60) : exp.outcomes.inconclusive.en.slice(0, 60)}...</p>
              <p>🎲 {lang === 'bg' ? exp.outcomes.no_traction.bg.slice(0, 60) : exp.outcomes.no_traction.en.slice(0, 60)}...</p>
            </div>

            <Button onClick={() => runExperiment(exp)} className="w-full" variant="outline">
              {t('Run Experiment', 'Стартирай експеримента')}
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="ghost" onClick={onSkip}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('Skip — go straight to next cycle', 'Пропусни — директно към следващия цикъл')}
        </Button>
      </div>
    </div>
  );
}
