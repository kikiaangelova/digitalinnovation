import { KPIs, DecisionRule, DecisionAnswer, DecisionTemplate, ShockEvent, OutcomeReport, CompanyState, TurbulenceState, Resources, GameStatus, ResourceDelta } from '@/types/simulator';
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

  newKPIs.active_users = Math.min(newKPIs.active_users, newKPIs.users_total);

  if (newKPIs.burn_rate > 0 && !('runway_months' in deltas)) {
    const cash = newKPIs.runway_months * kpis.burn_rate;
    newKPIs.runway_months = clamp(Math.round((cash + newKPIs.revenue) / newKPIs.burn_rate), 0, 60);
  }

  return newKPIs;
}

function applyResourceDelta(resources: Resources, delta: ResourceDelta): Resources {
  return {
    money: Math.max(0, resources.money + (delta.money || 0)),
    team: Math.max(0, resources.team + (delta.team || 0)),
    runway: Math.max(0, resources.runway + (delta.runway || 0)),
  };
}

function checkGameStatus(resources: Resources, weekNumber: number, totalWeeks: number): GameStatus {
  if (resources.money <= 0) return 'lost_money';
  if (resources.runway <= 0) return 'lost_time';
  // Win condition: survived all weeks with money > 0 and positive revenue trajectory
  if (weekNumber >= totalWeeks && resources.money > 0) return 'won';
  return 'playing';
}

/** Auto-generate resource costs from decision rules (when no explicit resource_deltas) */
function inferResourceCost(rule: DecisionRule): ResourceDelta {
  if (rule.resource_deltas) return rule.resource_deltas;
  const d: ResourceDelta = {};
  // Burn rate increases imply money cost
  if (rule.deltas.burn_rate && rule.deltas.burn_rate > 0) {
    d.money = -Math.round(rule.deltas.burn_rate * 0.5);
  }
  return d;
}

export function processRound(
  currentKPIs: KPIs,
  answers: DecisionAnswer[],
  decisions: DecisionTemplate[],
  shockEvent?: ShockEvent,
  volatility: number = 0.1,
  previousTurbulence?: TurbulenceState,
  weekNumber: number = 1,
  currentResources?: Resources,
): {
  newKPIs: KPIs;
  report: Omit<OutcomeReport, 'id' | 'team_id' | 'round_id' | 'week_number'>;
  turbulence: TurbulenceState;
  dynamicShock?: ShockEvent;
  newResources: Resources;
  gameStatus: GameStatus;
} {
  const prevTurbulence: TurbulenceState = previousTurbulence || { stability_score: 85, events_triggered: 0, resilience_bonus: 0 };
  let resources: Resources = currentResources ? { ...currentResources } : { money: 10000, team: 2, runway: 6 };

  // Deduct 1 month runway per round
  resources.runway = Math.max(0, resources.runway - 1);

  // Roll for a dynamic turbulence event if no pre-set shock event
  let activeShock = shockEvent;
  let dynamicShock: ShockEvent | undefined;
  if (!activeShock) {
    dynamicShock = rollTurbulenceEvent(weekNumber, prevTurbulence.stability_score);
    activeShock = dynamicShock;
  }
  let kpis = { ...currentKPIs };

  // Apply shock event first
  if (activeShock) {
    kpis = applyDeltas(kpis, activeShock.kpi_effects, volatility * 0.5);
    // Apply shock resource effects
    if (activeShock.resource_effects) {
      resources = applyResourceDelta(resources, activeShock.resource_effects);
    }
  }

  // Apply each decision
  const allDeltas: Partial<KPIs> = {};
  const resourceChanges: ResourceDelta[] = [];

  for (const answer of answers) {
    const template = decisions.find(d => d.id === answer.decision_template_id);
    if (!template) continue;

    const rule = template.rules.find(r => r.option_id === answer.answer);
    if (!rule) continue;

    for (const [key, val] of Object.entries(rule.deltas) as [keyof KPIs, number][]) {
      allDeltas[key] = (allDeltas[key] || 0) + val;
    }

    // Resource deltas from decisions
    const resDelta = inferResourceCost(rule);
    if (resDelta.money || resDelta.team || resDelta.runway) {
      resourceChanges.push(resDelta);
      resources = applyResourceDelta(resources, resDelta);
    }

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

  // Revenue adds to money each round
  resources.money = Math.max(0, resources.money + Math.round(newKPIs.revenue * 0.3));

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
  if (resources.money < 2000) risks.push('💰 Budget critically low — less than €2,000 remaining!');
  if (resources.runway <= 1) risks.push('⏳ Runway critically low — only 1 month left!');
  if (resources.team <= 1) risks.push('👥 Team too small — you need at least 2 people to operate.');
  if (newKPIs.runway_months < 3) risks.push('⚠️ KPI runway critically low — less than 3 months of cash remaining.');
  if (newKPIs.churn_rate > 0.15) risks.push('⚠️ Churn rate dangerously high — user retention needs immediate attention.');
  if (newKPIs.compliance_risk > 30) risks.push('⚠️ Compliance risk elevated — regulatory issues could impact operations.');
  if (newKPIs.tech_debt > 50) risks.push('⚠️ Tech debt is accumulating — development velocity may slow significantly.');
  if (newKPIs.nps < 10) risks.push('⚠️ NPS is low — user satisfaction needs improvement.');
  if (newKPIs.burn_rate > newKPIs.revenue * 5) risks.push('⚠️ Burn rate far exceeds revenue — path to sustainability unclear.');

  // Calculate turbulence
  const hadShock = !!activeShock;
  const newStability = calculateStability(prevTurbulence.stability_score, hadShock, activeShock?.severity || 0);
  
  let resilienceBonus = prevTurbulence.resilience_bonus;
  if (hadShock && newKPIs.runway_months >= 3 && newKPIs.nps > 0 && newKPIs.brand_trust > 20) {
    resilienceBonus += 5;
  }

  const newTurbulence: TurbulenceState = {
    stability_score: newStability,
    events_triggered: prevTurbulence.events_triggered + (hadShock ? 1 : 0),
    resilience_bonus: resilienceBonus,
  };

  // Check win/lose
  const gameStatus = checkGameStatus(resources, weekNumber, 6);

  let explanation = activeShock
    ? `⚡ TURBULENCE EVENT: ${activeShock.title}\n${activeShock.description}\n\n`
    : '';

  if (activeShock?.concept_lesson) {
    explanation += `${activeShock.concept_lesson}\n\n`;
  }

  // Resource summary
  explanation += `📊 RESOURCE STATUS:\n`;
  explanation += `• Budget: €${resources.money.toLocaleString()}\n`;
  explanation += `• Team: ${resources.team} people\n`;
  explanation += `• Runway: ${resources.runway} months\n\n`;

  explanation += 'Your decisions this week led to the following changes:\n';
  for (const [key, change] of Object.entries(kpiChanges)) {
    const label = key.replace(/_/g, ' ');
    const direction = change!.delta > 0 ? '↑' : '↓';
    explanation += `• ${label}: ${direction} ${Math.abs(change!.delta).toFixed(1)}\n`;
  }

  if (newStability < 30) {
    explanation += `\n🔥 MARKET STATUS: Chaotic — your business is under extreme pressure.\n`;
  } else if (newStability < 55) {
    explanation += `\n⚠️ MARKET STATUS: Turbulent — adapt your strategy to survive.\n`;
  }

  if (gameStatus === 'lost_money') {
    explanation += `\n💀 GAME OVER: You ran out of money! Your startup couldn't survive.\n`;
  } else if (gameStatus === 'lost_time') {
    explanation += `\n💀 GAME OVER: You ran out of time! Your runway expired.\n`;
  } else if (gameStatus === 'won') {
    explanation += `\n🏆 CONGRATULATIONS: Your startup survived and reached profitability!\n`;
  }

  return {
    newKPIs,
    report: { kpi_changes: kpiChanges, explanation, risks },
    turbulence: newTurbulence,
    dynamicShock,
    newResources: resources,
    gameStatus,
  };
}