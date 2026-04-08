import { useState } from 'react';
import { DecisionTemplate, KPIs, TurbulenceState } from '@/types/simulator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, ShieldAlert, Zap, TrendingUp, TrendingDown, CheckCircle2, Siren } from 'lucide-react';

/** Crisis decisions that only appear when stability < 30 */
export const CRISIS_DECISIONS: DecisionTemplate[] = [
  {
    id: 'crisis-strategy',
    round_id: '',
    title: 'Crisis Recovery Strategy',
    description: 'Your market stability has dropped to critical levels. The board demands immediate action. Choose your recovery approach.',
    type: 'strategy',
    format: 'multiple_choice',
    options: [
      {
        id: 'crisis-aggressive',
        label: 'Aggressive Pivot',
        description: 'Radically change your product direction. High risk, high reward. Burn cash fast to capture emerging opportunity.',
      },
      {
        id: 'crisis-conservative',
        label: 'Conservative Stabilization',
        description: 'Cut costs, retain core customers, weather the storm. Slow but steady recovery with minimal additional risk.',
      },
      {
        id: 'crisis-partnership',
        label: 'Strategic Alliance',
        description: 'Partner with a larger company for protection. Gain stability but sacrifice some independence and future upside.',
      },
      {
        id: 'crisis-innovate',
        label: 'Counter-Cyclical Innovation',
        description: 'Double down on R&D while competitors retreat. Build future advantage at the cost of short-term pain.',
      },
    ],
    rubric: [
      { criterion: 'Crisis judgment', max_score: 10, description: 'Did they choose the right response to the crisis?' },
      { criterion: 'Resilience thinking', max_score: 10, description: 'Does the response build long-term resilience?' },
    ],
    rules: [
      {
        option_id: 'crisis-aggressive',
        deltas: { users_total: 80, revenue: 1000, burn_rate: 3000, tech_debt: 10, product_quality: -5, brand_trust: -5, compliance_risk: 5 },
      },
      {
        option_id: 'crisis-conservative',
        deltas: { burn_rate: -2000, churn_rate: -0.02, runway_months: 3, revenue: -300, users_total: -20 },
      },
      {
        option_id: 'crisis-partnership',
        deltas: { brand_trust: 10, runway_months: 4, burn_rate: -1000, users_total: 40, revenue: 500 },
      },
      {
        option_id: 'crisis-innovate',
        deltas: { product_quality: 15, tech_debt: -5, burn_rate: 1500, nps: 10, users_total: -10, revenue: -500 },
      },
    ],
  },
  {
    id: 'crisis-resource',
    round_id: '',
    title: 'Emergency Resource Allocation',
    description: 'With chaos levels critical, you must reallocate your remaining resources. Where do you focus?',
    type: 'ops_risk',
    format: 'multiple_choice',
    options: [
      {
        id: 'crisis-res-customers',
        label: 'Customer Retention',
        description: 'Focus all resources on keeping existing customers happy. Prevent the bleeding before growing.',
      },
      {
        id: 'crisis-res-product',
        label: 'Product Fortification',
        description: 'Fix critical bugs, reduce tech debt, and make the product unbreakable.',
      },
      {
        id: 'crisis-res-cash',
        label: 'Cash Preservation',
        description: 'Freeze all non-essential spending. Extend runway at all costs.',
      },
      {
        id: 'crisis-res-talent',
        label: 'Talent Investment',
        description: 'Hire crisis-experienced talent. Expensive now but brings expertise to navigate the storm.',
      },
    ],
    rubric: [
      { criterion: 'Resource wisdom', max_score: 10, description: 'Did they allocate resources wisely under pressure?' },
      { criterion: 'Prioritization under stress', max_score: 10, description: 'Can they prioritize when everything feels urgent?' },
    ],
    rules: [
      {
        option_id: 'crisis-res-customers',
        deltas: { churn_rate: -0.03, nps: 12, active_users: 30, brand_trust: 8, burn_rate: 500 },
      },
      {
        option_id: 'crisis-res-product',
        deltas: { product_quality: 12, tech_debt: -8, nps: 5, burn_rate: 300 },
      },
      {
        option_id: 'crisis-res-cash',
        deltas: { burn_rate: -3000, runway_months: 4, users_total: -30, active_users: -20, nps: -5 },
      },
      {
        option_id: 'crisis-res-talent',
        deltas: { product_quality: 8, brand_trust: 5, burn_rate: 2000, tech_debt: -3, compliance_risk: -5 },
      },
    ],
  },
];

interface CrisisResponsePanelProps {
  turbulence: TurbulenceState;
  onCrisisDecision: (decisionId: string, optionId: string) => void;
  crisisAnswers: Record<string, string>;
  isSubmitted: boolean;
  lang?: string;
}

const KPI_DIRS: Record<string, 'up' | 'down'> = {
  users_total: 'up', active_users: 'up', churn_rate: 'down', conversion_rate: 'up',
  cac: 'down', arpu: 'up', revenue: 'up', burn_rate: 'down', runway_months: 'up',
  nps: 'up', product_quality: 'up', tech_debt: 'down', brand_trust: 'up', compliance_risk: 'down',
};

export default function CrisisResponsePanel({
  turbulence, onCrisisDecision, crisisAnswers, isSubmitted, lang = 'en',
}: CrisisResponsePanelProps) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  if (turbulence.stability_score >= 30) return null;

  return (
    <div className="space-y-5">
      {/* Crisis alert banner */}
      <div className="rounded-xl border-2 border-sim-danger bg-sim-danger/5 p-5 animate-pulse-slow">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sim-danger/20">
            <Siren className="h-5 w-5 text-sim-danger" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-sim-danger">
              🚨 {t('CRISIS MODE ACTIVATED', 'КРИЗИСЕН РЕЖИМ АКТИВИРАН')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t(
                `Stability at ${turbulence.stability_score}% — immediate action required`,
                `Стабилност на ${turbulence.stability_score}% — необходимо е незабавно действие`
              )}
            </p>
          </div>
        </div>
        <p className="text-sm text-foreground/80">
          {t(
            'Your business is in the chaos zone. Market turbulence has pushed your stability below critical levels. You must make emergency decisions NOW. These choices will determine whether your startup survives or fails.',
            'Вашият бизнес е в зоната на хаоса. Пазарната турбулентност е свалила стабилността ви под критичните нива. Трябва да вземете спешни решения СЕГА.'
          )}
        </p>
        <div className="mt-3 rounded-lg bg-primary/5 border border-primary/20 p-3">
          <p className="text-xs text-foreground/70">
            📚 <span className="font-semibold">Kotler's Chaotics:</span>{' '}
            {t(
              '"In chaos, the worst response is paralysis. Companies that act decisively — even imperfectly — outperform those that freeze."',
              '"В хаоса най-лошият отговор е парализата. Компаниите, които действат решително — дори несъвършено — превъзхождат тези, които замръзват."'
            )}
          </p>
        </div>
      </div>

      {/* Crisis decisions */}
      {CRISIS_DECISIONS.map((decision) => {
        const chosen = crisisAnswers[decision.id];

        return (
          <div key={decision.id} className={`rounded-xl border-2 transition-all ${
            chosen ? 'border-sim-danger/30 bg-card' : 'border-sim-danger/50 bg-card shadow-lg shadow-sim-danger/5'
          }`}>
            <div className="p-5 border-b border-border">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sim-danger/10">
                  {chosen ? (
                    <CheckCircle2 className="h-5 w-5 text-sim-danger" />
                  ) : (
                    <ShieldAlert className="h-5 w-5 text-sim-danger" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="font-semibold text-foreground">{decision.title}</h4>
                    <Badge variant="outline" className="text-xs bg-sim-danger/10 text-sim-danger border-sim-danger/30">
                      <Flame className="h-3 w-3 mr-1" />
                      {t('Crisis', 'Криза')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{decision.description}</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-xs font-semibold text-sim-danger uppercase tracking-wider mb-2">
                {t('Choose your crisis response:', 'Избери кризисен отговор:')}
              </p>

              <div className="grid gap-3">
                {decision.options.map(option => {
                  const selected = chosen === option.id;
                  const rule = decision.rules.find(r => r.option_id === option.id);
                  const effects = rule
                    ? Object.entries(rule.deltas)
                        .filter(([, v]) => v !== undefined && Math.abs(v as number) > 0)
                        .sort((a, b) => Math.abs(b[1] as number) - Math.abs(a[1] as number))
                        .slice(0, 4)
                        .map(([key, val]) => {
                          const v = val as number;
                          const isGood = KPI_DIRS[key] === 'up' ? v > 0 : v < 0;
                          return { label: key.replace(/_/g, ' '), value: v, isGood };
                        })
                    : [];

                  return (
                    <button
                      key={option.id}
                      onClick={() => !isSubmitted && onCrisisDecision(decision.id, option.id)}
                      disabled={isSubmitted}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${
                        selected
                          ? 'border-sim-danger bg-sim-danger/5 ring-2 ring-sim-danger/20 shadow-sm'
                          : chosen && !selected
                          ? 'border-border/50 bg-muted/20 opacity-60'
                          : 'border-border hover:border-sim-danger/40 hover:bg-sim-danger/5 hover:shadow-sm'
                      } ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground mb-1">{option.label}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{option.description}</p>
                        </div>
                        {selected && <CheckCircle2 className="h-5 w-5 text-sim-danger shrink-0 mt-0.5" />}
                      </div>

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
                                {effect.isGood ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
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
          </div>
        );
      })}
    </div>
  );
}
