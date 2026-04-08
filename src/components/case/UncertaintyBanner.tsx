import { AlertTriangle, HelpCircle, Shuffle, Eye, EyeOff, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface UncertaintyIndicator {
  type: 'missing_data' | 'conflicting_signals' | 'multiple_valid' | 'risk_reward';
  labelEn: string;
  labelBg: string;
  hintEn: string;
  hintBg: string;
}

const UNCERTAINTY_ICONS: Record<string, React.ElementType> = {
  missing_data: EyeOff,
  conflicting_signals: Shuffle,
  multiple_valid: Scale,
  risk_reward: TrendingUp,
};

const UNCERTAINTY_COLORS: Record<string, string> = {
  missing_data: 'bg-sim-warning/10 text-sim-warning border-sim-warning/30',
  conflicting_signals: 'bg-sim-danger/10 text-sim-danger border-sim-danger/30',
  multiple_valid: 'bg-primary/10 text-primary border-primary/30',
  risk_reward: 'bg-sim-info/10 text-sim-info border-sim-info/30',
};

/** Maps a case step index to the uncertainty indicators relevant for that step */
export function getStepUncertaintyIndicators(stepIndex: number): UncertaintyIndicator[] {
  const indicators: UncertaintyIndicator[] = [];

  // Steps 1-2: Industry context & digital disruption — incomplete market data
  if (stepIndex === 1 || stepIndex === 2) {
    indicators.push({
      type: 'missing_data',
      labelEn: 'Incomplete Data',
      labelBg: 'Непълни данни',
      hintEn: 'Some market data is estimated or unavailable. You must make assumptions — state them clearly.',
      hintBg: 'Някои пазарни данни са приблизителни или липсват. Трябва да направите допускания — формулирайте ги ясно.',
    });
  }

  // Step 2: Digital disruption — conflicting signals about technology impact
  if (stepIndex === 2) {
    indicators.push({
      type: 'conflicting_signals',
      labelEn: 'Conflicting Signals',
      labelBg: 'Противоречиви сигнали',
      hintEn: 'Different sources suggest different technology trends. Evaluate which signals are strongest.',
      hintBg: 'Различни източници предлагат различни технологични тенденции. Оценете кои сигнали са най-силни.',
    });
  }

  // Steps 3-4: Strategic problem & question — multiple valid approaches
  if (stepIndex === 3 || stepIndex === 4) {
    indicators.push({
      type: 'multiple_valid',
      labelEn: 'Multiple Valid Approaches',
      labelBg: 'Множество валидни подходи',
      hintEn: 'There is no single correct answer. Your reasoning and trade-off analysis matter more than the specific choice.',
      hintBg: 'Няма единствен правилен отговор. Твоята аргументация и анализ на компромисите са по-важни от конкретния избор.',
    });
  }

  // Steps 5-7: Analysis, proposal, recommendation — risk vs reward
  if (stepIndex >= 5) {
    indicators.push({
      type: 'risk_reward',
      labelEn: 'Risk vs. Reward',
      labelBg: 'Риск срещу награда',
      hintEn: 'Every strategic recommendation involves trade-offs. Acknowledge risks and explain why the reward justifies them.',
      hintBg: 'Всяка стратегическа препоръка включва компромиси. Признайте рисковете и обяснете защо ползите ги оправдават.',
    });
    indicators.push({
      type: 'multiple_valid',
      labelEn: 'No Perfect Answer',
      labelBg: 'Няма перфектен отговор',
      hintEn: 'Real-world strategy has no "right" answer. Focus on the quality of your reasoning, not finding the one correct solution.',
      hintBg: 'Реалната стратегия няма "правилен" отговор. Фокусирайте се върху качеството на аргументацията, а не върху единствено вярно решение.',
    });
  }

  return indicators;
}

interface Props {
  stepIndex: number;
  lang: 'en' | 'bg';
}

export default function UncertaintyBanner({ stepIndex, lang }: Props) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const indicators = getStepUncertaintyIndicators(stepIndex);
  const [expanded, setExpanded] = useState(false);

  if (indicators.length === 0 || stepIndex === 0) return null;

  return (
    <div className="rounded-xl border-2 border-sim-warning/20 bg-sim-warning/5 p-4 space-y-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sim-warning/10 shrink-0">
          <AlertTriangle className="h-4 w-4 text-sim-warning" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {t('⚡ Decision Under Uncertainty', '⚡ Решение при неопределеност')}
          </p>
          <p className="text-xs text-muted-foreground">
            {t(
              'This section involves incomplete information — just like real business.',
              'Тази секция включва непълна информация — точно както в реалния бизнес.'
            )}
          </p>
        </div>
        <div className="flex gap-1.5 shrink-0">
          {indicators.map((ind, i) => {
            const Icon = UNCERTAINTY_ICONS[ind.type];
            return (
              <Badge key={i} variant="outline" className={`text-[10px] px-1.5 py-0.5 ${UNCERTAINTY_COLORS[ind.type]}`}>
                <Icon className="h-3 w-3 mr-0.5" />
                {lang === 'bg' ? ind.labelBg : ind.labelEn}
              </Badge>
            );
          })}
        </div>
      </button>

      {expanded && (
        <div className="grid gap-2 pl-10">
          {indicators.map((ind, i) => {
            const Icon = UNCERTAINTY_ICONS[ind.type];
            return (
              <div key={i} className="flex items-start gap-2 text-xs">
                <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground">{lang === 'bg' ? ind.labelBg : ind.labelEn}: </span>
                  <span className="text-muted-foreground">{lang === 'bg' ? ind.hintBg : ind.hintEn}</span>
                </div>
              </div>
            );
          })}
          <div className="flex items-start gap-2 text-xs mt-1 p-2 rounded-lg bg-primary/5 border border-primary/10">
            <HelpCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
            <p className="text-foreground/80">
              {t(
                'Tip: State your assumptions, explain trade-offs, and acknowledge what you don\'t know. This is how strategic thinking works.',
                'Съвет: Посочете допусканията си, обяснете компромисите и признайте какво не знаете. Така работи стратегическото мислене.'
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
