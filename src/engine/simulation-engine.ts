import { KPIs, DecisionRule, DecisionAnswer, DecisionTemplate, ShockEvent, OutcomeReport, CompanyState, TurbulenceState } from '@/types/simulator';
import { rollTurbulenceEvent, calculateStability } from '@/data/turbulence-events';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function applyVolatility(value: number, volatility: number): number {
  const noise = (Math.random() - 0.5) * 2 * volatility;
  return value * (1 + noise);
}

const KPI_CONSTRAINTS: Record<keyof KPIs, { min: number; max: number }> = {
  users_total: { min: 0, max: 1000000 },
  active_users: { min: 0, max: 1000000 },
  churn_rate: { min: 0, max: 0.5 },
  conversion_rate: { min: 0, max: 0.5 },
  cac: { min: 0, max: 500 },
  arpu: { min: 0, max: 500 },
  revenue: { min: 0, max: 10000000 },
  burn_rate: { min: 0, max: 1000000 },
  runway_months: { min: 0, max: 60 },
  nps: { min: -100, max: 100 },
  product_quality: { min: 0, max: 100 },
  tech_debt: { min: 0, max: 100 },
  brand_trust: { min: 0, max: 100 },
  compliance_risk: { min: 0, max: 100 },
};

export function applyDeltas(kpis: KPIs, deltas: Partial<KPIs>, volatility: number = 0.1): KPIs {
  const newKPIs = { ...kpis };

  for (const [key, delta] of Object.entries(deltas) as [keyof KPIs, number][]) {
    if (delta === undefined) continue;
    const adjustedDelta = applyVolatility(delta, volatility);
    newKPIs[key] = newKPIs[key] + adjustedDelta;
    const constraints = KPI_CONSTRAINTS[key];
    newKPIs[key] = clamp(newKPIs[key], constraints.min, constraints.max);
  }

  // active users can't exceed total
  newKPIs.active_users = Math.min(newKPIs.active_users, newKPIs.users_total);

  // recalculate runway
  if (newKPIs.burn_rate > 0 && !('runway_months' in deltas)) {
    const cash = newKPIs.runway_months * kpis.burn_rate;
    newKPIs.runway_months = clamp(Math.round((cash + newKPIs.revenue) / newKPIs.burn_rate), 0, 60);
  }

  return newKPIs;
}

export function processRound(
  currentKPIs: KPIs,
  answers: DecisionAnswer[],
  decisions: DecisionTemplate[],
  shockEvent?: ShockEvent,
  volatility: number = 0.1
): { newKPIs: KPIs; report: Omit<OutcomeReport, 'id' | 'team_id' | 'round_id' | 'week_number'> } {
  let kpis = { ...currentKPIs };

  // Apply shock event first
  if (shockEvent) {
    kpis = applyDeltas(kpis, shockEvent.kpi_effects, volatility * 0.5);
  }

  // Apply each decision
  const allDeltas: Partial<KPIs> = {};

  for (const answer of answers) {
    const template = decisions.find(d => d.id === answer.decision_template_id);
    if (!template) continue;

    const rule = template.rules.find(r => r.option_id === answer.answer);
    if (!rule) continue;

    // Apply base deltas
    for (const [key, val] of Object.entries(rule.deltas) as [keyof KPIs, number][]) {
      allDeltas[key] = (allDeltas[key] || 0) + val;
    }

    // Check conditional deltas
    if (rule.conditions && rule.conditional_deltas) {
      const conditionsMet = rule.conditions.every(c => {
        const kpiVal = kpis[c.kpi];
        switch (c.operator) {
          case '>': return kpiVal > c.value;
          case '<': return kpiVal < c.value;
          case '>=': return kpiVal >= c.value;
          case '<=': return kpiVal <= c.value;
        }
      });
      if (conditionsMet) {
        for (const [key, val] of Object.entries(rule.conditional_deltas) as [keyof KPIs, number][]) {
          allDeltas[key] = (allDeltas[key] || 0) + val;
        }
      }
    }
  }

  const newKPIs = applyDeltas(kpis, allDeltas, volatility);

  // Generate report
  const kpiChanges: OutcomeReport['kpi_changes'] = {};
  for (const key of Object.keys(currentKPIs) as (keyof KPIs)[]) {
    if (Math.abs(newKPIs[key] - currentKPIs[key]) > 0.001) {
      kpiChanges[key] = {
        before: Math.round(currentKPIs[key] * 100) / 100,
        after: Math.round(newKPIs[key] * 100) / 100,
        delta: Math.round((newKPIs[key] - currentKPIs[key]) * 100) / 100,
      };
    }
  }

  const risks: string[] = [];
  if (newKPIs.runway_months < 3) risks.push('⚠️ Runway critically low — less than 3 months of cash remaining.');
  if (newKPIs.churn_rate > 0.15) risks.push('⚠️ Churn rate dangerously high — user retention needs immediate attention.');
  if (newKPIs.compliance_risk > 30) risks.push('⚠️ Compliance risk elevated — regulatory issues could impact operations.');
  if (newKPIs.tech_debt > 50) risks.push('⚠️ Tech debt is accumulating — development velocity may slow significantly.');
  if (newKPIs.nps < 10) risks.push('⚠️ NPS is low — user satisfaction needs improvement.');
  if (newKPIs.burn_rate > newKPIs.revenue * 5) risks.push('⚠️ Burn rate far exceeds revenue — path to sustainability unclear.');

  let explanation = shockEvent
    ? `This week saw a major event: ${shockEvent.title}. ${shockEvent.description}\n\n`
    : '';

  explanation += 'Your decisions this week led to the following changes:\n';
  for (const [key, change] of Object.entries(kpiChanges)) {
    const label = key.replace(/_/g, ' ');
    const direction = change!.delta > 0 ? '↑' : '↓';
    explanation += `• ${label}: ${direction} ${Math.abs(change!.delta).toFixed(1)}\n`;
  }

  return {
    newKPIs,
    report: { kpi_changes: kpiChanges, explanation, risks },
  };
}
