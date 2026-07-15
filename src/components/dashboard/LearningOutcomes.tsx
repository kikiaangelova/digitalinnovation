import { Lightbulb, Search, Rocket, Briefcase, Palette, TrendingUp } from 'lucide-react';

// Learning outcomes and their mapping to activities
export const LEARNING_OUTCOMES = [
  { id: 'digital_innovation', icon: Lightbulb, en: 'Digital Innovation Knowledge', bg: 'Знания за дигитални иновации' },
  { id: 'industry_analysis', icon: Search, en: 'Industry Analysis Skills', bg: 'Умения за анализ на индустрия' },
  { id: 'startup_thinking', icon: Rocket, en: 'Startup Thinking', bg: 'Стартъп мислене' },
  { id: 'business_model', icon: Briefcase, en: 'Business Model Design', bg: 'Дизайн на бизнес модел' },
  { id: 'product_dev', icon: Palette, en: 'Product Development', bg: 'Развитие на продукт' },
  { id: 'growth_strategy', icon: TrendingUp, en: 'Growth Strategy', bg: 'Стратегия за растеж' },
];

// Maps activities to learning outcomes they contribute to (weights 0-1)
export const OUTCOME_WEIGHTS: Record<string, Record<string, number>> = {
  case_study: { digital_innovation: 0.3, industry_analysis: 0.5, startup_thinking: 0.2, business_model: 0.3, product_dev: 0.1, growth_strategy: 0.1 },
  startup_problem: { digital_innovation: 0.2, startup_thinking: 0.5, industry_analysis: 0.3 },
  startup_customer: { industry_analysis: 0.3, startup_thinking: 0.4, business_model: 0.2 },
  startup_value_proposition: { startup_thinking: 0.4, business_model: 0.3, product_dev: 0.3 },
  startup_digital_product: { product_dev: 0.6, digital_innovation: 0.3, startup_thinking: 0.2 },
  startup_business_model: { business_model: 0.6, startup_thinking: 0.2, growth_strategy: 0.2 },
  startup_growth_strategy: { growth_strategy: 0.6, business_model: 0.2, startup_thinking: 0.2 },
  startup_final_pitch: { startup_thinking: 0.3, business_model: 0.2, growth_strategy: 0.2, product_dev: 0.1, digital_innovation: 0.1 },
  simulator: { startup_thinking: 0.3, business_model: 0.3, growth_strategy: 0.4, digital_innovation: 0.2, industry_analysis: 0.1 },
};

// Calculate learning outcome scores based on student progress
export function calcOutcomeScores(opts: {
  casesCompleted: number;
  casesTotal: number;
  startupSections: Record<string, boolean>; // which sections are filled
  simWeek: number;
  simComplete: boolean;
}): Record<string, number> {
  const scores: Record<string, number> = {};
  LEARNING_OUTCOMES.forEach(lo => { scores[lo.id] = 0; });

  // Case studies contribution (max ~30 pts per outcome)
  const caseRatio = opts.casesTotal > 0 ? opts.casesCompleted / opts.casesTotal : 0;
  for (const [outId, weight] of Object.entries(OUTCOME_WEIGHTS.case_study)) {
    scores[outId] += caseRatio * weight * 100;
  }

  // Startup sections contribution
  const sectionKeys = ['problem', 'customer', 'value_proposition', 'digital_product', 'business_model', 'growth_strategy', 'final_pitch'];
  for (const key of sectionKeys) {
    if (opts.startupSections[key]) {
      const weights = OUTCOME_WEIGHTS[`startup_${key}`] || {};
      for (const [outId, weight] of Object.entries(weights)) {
        scores[outId] += weight * (100 / sectionKeys.length);
      }
    }
  }

  // Simulator contribution
  const simRatio = opts.simComplete ? 1 : (opts.simWeek - 1) / 6;
  for (const [outId, weight] of Object.entries(OUTCOME_WEIGHTS.simulator)) {
    scores[outId] += simRatio * weight * 100;
  }

  // Normalize to 0-100
  for (const id of Object.keys(scores)) {
    scores[id] = Math.min(100, Math.round(scores[id]));
  }

  return scores;
}

interface LearningOutcomesProps {
  lang: 'en' | 'bg';
  scores: Record<string, number>;
  compact?: boolean;
}

export default function LearningOutcomes({ lang, scores, compact }: LearningOutcomesProps) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const avgScore = Math.round(
    LEARNING_OUTCOMES.reduce((sum, lo) => sum + (scores[lo.id] || 0), 0) / LEARNING_OUTCOMES.length
  );

  return (
    <div className={`rounded-3xl border-2 border-foreground bg-card quest-shadow-sm ${compact ? 'p-4' : 'p-5'}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`${compact ? 'text-sm' : 'text-lg'} font-quest font-bold text-foreground`}>
          {t('Learning Progress', 'Учебен напредък')}
        </h2>
        <span className="font-quest text-sm font-bold px-2.5 py-0.5 rounded-full border-2 border-foreground bg-[hsl(43_96%_75%)] text-foreground">
          {avgScore}%
        </span>
      </div>
      <div className="space-y-3">
        {LEARNING_OUTCOMES.map((lo, i) => {
          const Icon = lo.icon;
          const score = scores[lo.id] || 0;
          const barColors = [
            'bg-[hsl(43_96%_56%)]',   // amber
            'bg-[hsl(160_84%_45%)]',  // emerald
            'bg-[hsl(28_92%_55%)]',   // orange
            'bg-[hsl(270_70%_60%)]',  // violet
            'bg-[hsl(200_90%_50%)]',  // sky
            'bg-[hsl(340_82%_60%)]',  // pink
          ];
          const barColor = barColors[i % barColors.length];
          return (
            <div key={lo.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-foreground" />
                  <span className={`${compact ? 'text-xs' : 'text-xs'} font-medium text-foreground`}>
                    {lang === 'bg' ? lo.bg : lo.en}
                  </span>
                </div>
                <span className={`font-quest text-xs font-bold ${score >= 70 ? 'text-sim-success' : score >= 40 ? 'text-sim-warning' : 'text-foreground/60'}`}>
                  {score}%
                </span>
              </div>
              <div className="h-2.5 rounded-full border border-foreground/80 bg-muted overflow-hidden">
                <div className={`h-full ${barColor} transition-all`} style={{ width: `${score}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
