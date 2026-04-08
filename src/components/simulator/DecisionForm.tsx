import { useState, useEffect, useMemo } from 'react';
import { DecisionTemplate, DecisionAnswer, KPIs, KPI_LABELS, KPI_LABELS_BG, KPI_DIRECTIONS } from '@/types/simulator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2, Lightbulb, Target, TrendingUp, TrendingDown,
  Database, Shield, AlertTriangle, ArrowRight, Zap, ChevronDown, ChevronUp,
} from 'lucide-react';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  strategy: <Target className="h-4 w-4" />,
  product: <Lightbulb className="h-4 w-4" />,
  growth: <TrendingUp className="h-4 w-4" />,
  data_ai: <Database className="h-4 w-4" />,
  ops_risk: <Shield className="h-4 w-4" />,
};

const TYPE_COLORS: Record<string, string> = {
  strategy: 'bg-sim-info/10 text-sim-info border-sim-info/30',
  product: 'bg-primary/10 text-primary border-primary/30',
  growth: 'bg-sim-success/10 text-sim-success border-sim-success/30',
  data_ai: 'bg-accent/10 text-accent border-accent/30',
  ops_risk: 'bg-sim-danger/10 text-sim-danger border-sim-danger/30',
};

const TYPE_LABELS: Record<string, { en: string; bg: string }> = {
  strategy: { en: 'Strategy', bg: 'Стратегия' },
  product: { en: 'Product', bg: 'Продукт' },
  growth: { en: 'Growth', bg: 'Растеж' },
  data_ai: { en: 'Data/AI', bg: 'Данни/AI' },
  ops_risk: { en: 'Ops/Risk', bg: 'Операции/Риск' },
};

/** Top KPIs to highlight as trade-off indicators */
const TRADEOFF_KPIS: (keyof KPIs)[] = [
  'users_total', 'revenue', 'product_quality', 'burn_rate', 'brand_trust', 'nps', 'tech_debt', 'churn_rate',
];

function getTopEffects(deltas: Partial<KPIs>, lang: string): { label: string; value: number; isGood: boolean }[] {
  const labels = lang === 'bg' ? KPI_LABELS_BG : KPI_LABELS;
  return Object.entries(deltas)
    .filter(([, v]) => v !== undefined && Math.abs(v as number) > 0)
    .sort((a, b) => Math.abs(b[1] as number) - Math.abs(a[1] as number))
    .slice(0, 4)
    .map(([key, val]) => {
      const v = val as number;
      const goodDir = KPI_DIRECTIONS[key as keyof KPIs];
      const isGood = goodDir === 'up' ? v > 0 : v < 0;
      return { label: labels[key as keyof KPIs] || key, value: v, isGood };
    });
}

/** Generate contextual feedback for a decision based on what was chosen */
function getDecisionFeedback(decision: DecisionTemplate, chosenId: string, lang: string): string {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const option = decision.options.find(o => o.id === chosenId);
  if (!option) return '';
  const rule = decision.rules.find(r => r.option_id === chosenId);
  if (!rule) return '';

  const effects = getTopEffects(rule.deltas, lang);
  const positives = effects.filter(e => e.isGood);
  const negatives = effects.filter(e => !e.isGood);

  let feedback = '';
  if (positives.length > 0) {
    feedback += t(
      `✅ Good impact: ${positives.map(p => `${p.label} ${p.value > 0 ? '+' : ''}${formatDelta(p.value)}`).join(', ')}. `,
      `✅ Положително: ${positives.map(p => `${p.label} ${p.value > 0 ? '+' : ''}${formatDelta(p.value)}`).join(', ')}. `
    );
  }
  if (negatives.length > 0) {
    feedback += t(
      `⚠️ Trade-off: ${negatives.map(n => `${n.label} ${n.value > 0 ? '+' : ''}${formatDelta(n.value)}`).join(', ')}. `,
      `⚠️ Компромис: ${negatives.map(n => `${n.label} ${n.value > 0 ? '+' : ''}${formatDelta(n.value)}`).join(', ')}. `
    );
  }
  if (positives.length > 0 && negatives.length === 0) {
    feedback += t('Strong choice with no immediate downsides.', 'Силен избор без непосредствени недостатъци.');
  } else if (negatives.length > 0 && positives.length === 0) {
    feedback += t('This choice carries significant risks. Consider whether the trade-offs are worth it.', 'Този избор крие значителни рискове.');
  } else if (negatives.length > 0 && positives.length > 0) {
    feedback += t('Every strategic choice involves trade-offs. Monitor the negative impacts closely.', 'Всеки стратегически избор включва компромиси. Наблюдавайте негативните ефекти.');
  }
  return feedback;
}

function formatDelta(v: number): string {
  if (Math.abs(v) < 0.1) return v.toFixed(2);
  return Math.abs(v) >= 100 ? `${Math.round(v)}` : `${v.toFixed(1)}`;
}

interface DecisionFormProps {
  decisions: DecisionTemplate[];
  initialAnswers?: DecisionAnswer[];
  rationale?: string;
  reflection?: string;
  onSaveDraft: (answers: DecisionAnswer[], rationale: string, reflection: string) => void;
  onSubmit: () => void;
  isSubmitted: boolean;
  lang?: 'en' | 'bg';
}

export default function DecisionForm({
  decisions, initialAnswers, rationale: initRationale, reflection: initReflection,
  onSaveDraft, onSubmit, isSubmitted, lang = 'en',
}: DecisionFormProps) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [rationale, setRationale] = useState(initRationale || '');
  const [reflection, setReflection] = useState(initReflection || '');
  const [expandedTradeoffs, setExpandedTradeoffs] = useState<Record<string, boolean>>({});
  const [activeDecision, setActiveDecision] = useState(0);

  useEffect(() => {
    if (initialAnswers) {
      const map: Record<string, string> = {};
      initialAnswers.forEach(a => { map[a.decision_template_id] = a.answer; });
      setAnswers(map);
    }
  }, [initialAnswers]);

  useEffect(() => {
    if (isSubmitted) return;
    const timer = setTimeout(() => {
      const answerList = Object.entries(answers).map(([templateId, answer]) => ({
        decision_template_id: templateId,
        answer,
      }));
      onSaveDraft(answerList, rationale, reflection);
    }, 1000);
    return () => clearTimeout(timer);
  }, [answers, rationale, reflection, isSubmitted, onSaveDraft]);

  const selectOption = (templateId: string, optionId: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [templateId]: optionId }));
  };

  const allAnswered = decisions.every(d => answers[d.id]);
  const answeredCount = decisions.filter(d => answers[d.id]).length;

  const handleSubmit = () => {
    if (!allAnswered || isSubmitted) return;
    onSubmit();
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/40">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-foreground">
              {t('Decisions', 'Решения')}: {answeredCount}/{decisions.length}
            </span>
            <span className="text-xs text-muted-foreground">
              {Math.round((answeredCount / decisions.length) * 100)}%
            </span>
          </div>
          <Progress value={(answeredCount / decisions.length) * 100} className="h-1.5" />
        </div>
      </div>

      {decisions.map((decision, idx) => {
        const isAnswered = !!answers[decision.id];
        const chosenOption = decision.options.find(o => o.id === answers[decision.id]);
        const feedbackText = isAnswered ? getDecisionFeedback(decision, answers[decision.id], lang) : '';

        return (
          <div key={decision.id} className={`rounded-xl border-2 transition-all ${
            isAnswered
              ? 'border-primary/30 bg-card'
              : 'border-border bg-card'
          }`}>
            {/* Decision header – scenario */}
            <div className="p-5 border-b border-border">
              <div className="flex items-start gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  isAnswered ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  {isAnswered ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">{idx + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="font-semibold text-foreground">{decision.title}</h4>
                    <Badge variant="outline" className={`text-xs ${TYPE_COLORS[decision.type]}`}>
                      <span className="mr-1">{TYPE_ICONS[decision.type]}</span>
                      {TYPE_LABELS[decision.type]?.[lang] || decision.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{decision.description}</p>
                </div>
              </div>
            </div>

            {/* Strategic options with trade-off indicators */}
            <div className="p-5 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {t('Choose your strategy:', 'Избери стратегия:')}
              </p>

              <div className="grid gap-3">
                {decision.options.map(option => {
                  const selected = answers[decision.id] === option.id;
                  const rule = decision.rules.find(r => r.option_id === option.id);
                  const effects = rule ? getTopEffects(rule.deltas, lang) : [];
                  const showTradeoffs = expandedTradeoffs[option.id] || selected;

                  return (
                    <button
                      key={option.id}
                      onClick={() => selectOption(decision.id, option.id)}
                      disabled={isSubmitted}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${
                        selected
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm'
                          : isAnswered && !selected
                          ? 'border-border/50 bg-muted/20 opacity-60'
                          : 'border-border hover:border-primary/40 hover:bg-accent/50 hover:shadow-sm'
                      } ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground mb-1">{option.label}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{option.description}</p>
                        </div>
                        {selected && <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />}
                      </div>

                      {/* Trade-off indicators – always visible */}
                      {effects.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <div className="flex items-center gap-1 mb-2">
                            <Zap className="h-3 w-3 text-muted-foreground" />
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                              {t('Impact', 'Въздействие')}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {effects.map((effect, i) => (
                              <span
                                key={i}
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                  effect.isGood
                                    ? 'bg-sim-success/10 text-sim-success'
                                    : 'bg-sim-danger/10 text-sim-danger'
                                }`}
                              >
                                {effect.isGood ? (
                                  <TrendingUp className="h-2.5 w-2.5" />
                                ) : (
                                  <TrendingDown className="h-2.5 w-2.5" />
                                )}
                                {effect.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Post-decision feedback */}
            {isAnswered && feedbackText && (
              <div className="px-5 pb-5">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {t('Decision Feedback', 'Обратна връзка')}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{feedbackText}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Rationale */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h4 className="font-semibold text-foreground mb-3">
          📝 {t('Decision Rationale', 'Обосновка на решението')}
        </h4>
        <p className="text-sm text-muted-foreground mb-2">
          {t('Explain your reasoning. Why did you make these trade-offs?', 'Обяснете мотивите си. Защо направихте тези компромиси?')}
        </p>
        <Textarea
          value={rationale}
          onChange={e => setRationale(e.target.value)}
          placeholder={t('I chose this strategy because the trade-off between... is worth it given...', 'Избрах тази стратегия, защото компромисът между... е оправдан предвид...')}
          disabled={isSubmitted}
          className="min-h-[100px]"
        />
      </div>

      {/* Reflection */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h4 className="font-semibold text-foreground mb-3">
          🔍 {t('Reflection', 'Рефлексия')}
        </h4>
        <p className="text-sm text-muted-foreground mb-2">
          {t('What consequences do you anticipate? What would you do differently?', 'Какви последствия очаквате? Какво бихте направили различно?')}
        </p>
        <Textarea
          value={reflection}
          onChange={e => setReflection(e.target.value)}
          placeholder={t('I expect these decisions will lead to... The biggest risk is...', 'Очаквам тези решения да доведат до... Най-големият риск е...')}
          disabled={isSubmitted}
          className="min-h-[100px]"
        />
      </div>

      {/* Submit */}
      {!isSubmitted && (
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-accent/30">
          <div>
            <p className="text-sm font-medium text-foreground">
              {answeredCount}/{decisions.length} {t('decisions made', 'взети решения')}
            </p>
            {!allAnswered && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('Complete all decisions to submit', 'Завърши всички решения, за да изпратиш')}
              </p>
            )}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="sim-gradient border-0"
            size="lg"
          >
            <Zap className="h-4 w-4 mr-1.5" />
            {t('Submit & See Consequences', 'Изпрати и виж последствията')}
          </Button>
        </div>
      )}
    </div>
  );
}
