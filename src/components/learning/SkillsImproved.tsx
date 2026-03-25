import { CheckCircle2, TrendingUp, Brain, Search, Target, Lightbulb, BarChart3 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

/**
 * Skill categories that map across all learning activities.
 * Each activity type contributes to a subset of these skills.
 */
export const SKILL_CATEGORIES = [
  { id: 'problem_solving', icon: Brain, en: 'Problem Solving', bg: 'Решаване на проблеми' },
  { id: 'market_analysis', icon: Search, en: 'Market Analysis', bg: 'Пазарен анализ' },
  { id: 'strategic_thinking', icon: Target, en: 'Strategic Thinking', bg: 'Стратегическо мислене' },
  { id: 'business_modeling', icon: BarChart3, en: 'Business Modeling', bg: 'Бизнес моделиране' },
  { id: 'decision_making', icon: Lightbulb, en: 'Decision Making', bg: 'Вземане на решения' },
] as const;

export type SkillId = typeof SKILL_CATEGORIES[number]['id'];

/** Which skills each activity type develops, with relative strength 1-3 */
export const ACTIVITY_SKILL_MAP: Record<string, Partial<Record<SkillId, number>>> = {
  case_study:      { problem_solving: 3, market_analysis: 3, strategic_thinking: 2, business_modeling: 1, decision_making: 2 },
  theory_module:   { problem_solving: 1, market_analysis: 2, strategic_thinking: 3, business_modeling: 1, decision_making: 1 },
  simulator:       { strategic_thinking: 3, decision_making: 3, business_modeling: 2, market_analysis: 1, problem_solving: 2 },
  startup_builder: { problem_solving: 2, market_analysis: 2, business_modeling: 3, strategic_thinking: 1, decision_making: 2 },
  assessment:      { problem_solving: 2, strategic_thinking: 2, market_analysis: 1, business_modeling: 1, decision_making: 1 },
};

interface SkillsImprovedProps {
  activityType: keyof typeof ACTIVITY_SKILL_MAP;
  /** Optional score 0-100 to modulate the display */
  scorePercent?: number;
  lang: 'en' | 'bg';
  compact?: boolean;
}

/**
 * Post-completion "You improved" block showing which skills
 * a student developed through a learning activity.
 */
export default function SkillsImproved({ activityType, scorePercent = 75, lang, compact = false }: SkillsImprovedProps) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const skillMap = ACTIVITY_SKILL_MAP[activityType] || {};
  
  // Only show skills that this activity develops
  const relevantSkills = SKILL_CATEGORIES
    .filter(s => (skillMap[s.id] || 0) > 0)
    .map(s => ({
      ...s,
      strength: skillMap[s.id] || 0,
      // Scale the display value based on strength and score
      displayValue: Math.min(100, Math.round(((skillMap[s.id] || 0) / 3) * scorePercent)),
    }))
    .sort((a, b) => b.strength - a.strength);

  if (relevantSkills.length === 0) return null;

  return (
    <div className={`rounded-xl border border-primary/20 bg-primary/5 ${compact ? 'p-4' : 'p-5'}`}>
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-4 w-4 text-primary" />
        <h3 className={`${compact ? 'text-sm' : 'text-base'} font-semibold text-foreground`}>
          {t('You improved:', 'Подобрихте:')}
        </h3>
      </div>
      <div className={`grid ${compact ? 'gap-2' : 'gap-3'} ${!compact && relevantSkills.length > 3 ? 'sm:grid-cols-2' : ''}`}>
        {relevantSkills.map(skill => {
          const Icon = skill.icon;
          const strengthLabel = skill.strength >= 3 
            ? t('Strong', 'Силно') 
            : skill.strength >= 2 
            ? t('Moderate', 'Умерено') 
            : t('Light', 'Леко');
          
          return (
            <div key={skill.id} className="flex items-center gap-3 rounded-lg bg-card/80 p-2.5 border border-border/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-medium text-foreground truncate">
                    {lang === 'bg' ? skill.bg : skill.en}
                  </span>
                  <span className={`text-[10px] font-semibold ml-2 shrink-0 ${
                    skill.strength >= 3 ? 'text-primary' : skill.strength >= 2 ? 'text-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {strengthLabel}
                  </span>
                </div>
                <Progress value={skill.displayValue} className="h-1.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
