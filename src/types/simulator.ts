export interface KPIs {
  users_total: number;
  active_users: number;
  churn_rate: number;
  conversion_rate: number;
  cac: number;
  arpu: number;
  revenue: number;
  burn_rate: number;
  runway_months: number;
  nps: number;
  product_quality: number;
  tech_debt: number;
  brand_trust: number;
  compliance_risk: number;
}

export type DecisionType = 'strategy' | 'product' | 'growth' | 'data_ai' | 'ops_risk';
export type QuestionFormat = 'multiple_choice' | 'ranking' | 'budget_allocation' | 'short_answer';
export type TeamRole = 'lead' | 'member';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
}

export interface DecisionRule {
  option_id: string;
  deltas: Partial<KPIs>;
  conditions?: { kpi: keyof KPIs; operator: '>' | '<' | '>=' | '<='; value: number }[];
  conditional_deltas?: Partial<KPIs>;
}

export interface RubricCriteria {
  criterion: string;
  max_score: number;
  description: string;
}

export interface DecisionTemplate {
  id: string;
  round_id: string;
  title: string;
  description: string;
  type: DecisionType;
  format: QuestionFormat;
  options: DecisionOption[];
  rubric: RubricCriteria[];
  rules: DecisionRule[];
}

export type TurbulenceCategory = 'market_crash' | 'competitor_entry' | 'regulation_change' | 'tech_disruption';

export interface ShockEvent {
  title: string;
  description: string;
  kpi_effects: Partial<KPIs>;
  category?: TurbulenceCategory;
  severity?: number; // 1-5
  concept_lesson?: string; // Kotler concept taught
  concept_lesson_bg?: string;
}

export interface TurbulenceState {
  stability_score: number; // 0-100 (100 = fully stable)
  events_triggered: number;
  resilience_bonus: number; // XP bonus for adapting well
}

export interface SimulationRound {
  id: string;
  season_id: string;
  week_number: number;
  narrative: string;
  shock_event?: ShockEvent;
  decisions: DecisionTemplate[];
  baseline_kpis?: KPIs;
}

export interface SimulationSeason {
  id: string;
  theme: string;
  description: string;
  start_date: string;
  weeks: number;
  difficulty: Difficulty;
  volatility: number;
  scoring_weights: ScoringWeights;
  rounds: SimulationRound[];
  created_by: string;
}

export interface ScoringWeights {
  decision_quality: number;
  evidence_use: number;
  experiment_discipline: number;
  strategic_coherence: number;
  reflection_quality: number;
}

export interface Team {
  id: string;
  season_id: string;
  name: string;
  join_code: string;
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_name: string;
  role: TeamRole;
}

export interface CompanyState {
  id: string;
  team_id: string;
  round_id: string;
  week_number: number;
  kpis: KPIs;
}

export interface DecisionAnswer {
  decision_template_id: string;
  answer: string;
  score?: number;
  feedback?: string;
}

export interface DecisionSubmission {
  id: string;
  team_id: string;
  round_id: string;
  submitted_by: string;
  submitted_at: string;
  rationale: string;
  reflection: string;
  answers: DecisionAnswer[];
  is_draft: boolean;
}

export interface OutcomeReport {
  id: string;
  team_id: string;
  round_id: string;
  week_number: number;
  kpi_changes: Partial<Record<keyof KPIs, { before: number; after: number; delta: number }>>;
  explanation: string;
  risks: string[];
  instructor_comment?: string;
}

export interface SeasonScoreboard {
  team_id: string;
  team_name: string;
  total_score: number;
  scores_by_round: { round: number; score: number }[];
}

export const KPI_LABELS: Record<keyof KPIs, string> = {
  users_total: 'Total Users',
  active_users: 'Active Users',
  churn_rate: 'Churn Rate',
  conversion_rate: 'Conversion Rate',
  cac: 'CAC',
  arpu: 'ARPU',
  revenue: 'Revenue',
  burn_rate: 'Burn Rate',
  runway_months: 'Runway (mo)',
  nps: 'NPS',
  product_quality: 'Product Quality',
  tech_debt: 'Tech Debt',
  brand_trust: 'Brand Trust',
  compliance_risk: 'Compliance Risk',
};

export const KPI_LABELS_BG: Record<keyof KPIs, string> = {
  users_total: 'Общо потребители',
  active_users: 'Активни потребители',
  churn_rate: 'Отток',
  conversion_rate: 'Конверсия',
  cac: 'CAC',
  arpu: 'ARPU',
  revenue: 'Приходи',
  burn_rate: 'Разходи',
  runway_months: 'Резерв (мес)',
  nps: 'NPS',
  product_quality: 'Качество на продукта',
  tech_debt: 'Техн. дълг',
  brand_trust: 'Доверие в марката',
  compliance_risk: 'Риск от съответствие',
};

export const KPI_FORMATS: Record<keyof KPIs, 'number' | 'percent' | 'currency' | 'score'> = {
  users_total: 'number',
  active_users: 'number',
  churn_rate: 'percent',
  conversion_rate: 'percent',
  cac: 'currency',
  arpu: 'currency',
  revenue: 'currency',
  burn_rate: 'currency',
  runway_months: 'number',
  nps: 'score',
  product_quality: 'score',
  tech_debt: 'score',
  brand_trust: 'score',
  compliance_risk: 'score',
};

export const KPI_DIRECTIONS: Record<keyof KPIs, 'up' | 'down'> = {
  users_total: 'up',
  active_users: 'up',
  churn_rate: 'down',
  conversion_rate: 'up',
  cac: 'down',
  arpu: 'up',
  revenue: 'up',
  burn_rate: 'down',
  runway_months: 'up',
  nps: 'up',
  product_quality: 'up',
  tech_debt: 'down',
  brand_trust: 'up',
  compliance_risk: 'down',
};
