import { Award, Search, Lightbulb, TrendingUp, Brain, Shield } from 'lucide-react';

const ALL_BADGES = [
  { id: 'innovation_explorer', icon: Search, nameEn: 'Innovation Explorer', nameBg: 'Иновативен изследовател', descEn: 'Completed first case study', descBg: 'Завършен първи казус', gradient: 'gradient-explorer' },
  { id: 'case_solver', icon: Lightbulb, nameEn: 'Case Solver', nameBg: 'Решител на казуси', descEn: 'Completed 3 case studies', descBg: 'Завършени 3 казуса', gradient: 'gradient-strategist' },
  { id: 'startup_builder', icon: Shield, nameEn: 'Startup Builder', nameBg: 'Стартъп строител', descEn: 'Submitted startup idea', descBg: 'Подадена стартъп идея', gradient: 'gradient-builder' },
  { id: 'growth_hacker', icon: TrendingUp, nameEn: 'Growth Hacker', nameBg: 'Growth Hacker', descEn: 'Completed simulator', descBg: 'Завършен симулатор', gradient: 'gradient-designer' },
  { id: 'ai_innovator', icon: Brain, nameEn: 'AI Innovator', nameBg: 'AI Иноватор', descEn: 'Used AI mentor feedback', descBg: 'Използвана AI обратна връзка', gradient: 'gradient-founder' },
];

interface AchievementBadgesProps {
  lang: 'en' | 'bg';
  casesCompleted: number;
  startupSubmitted: boolean;
  simulatorComplete: boolean;
  usedAIMentor: boolean;
}

export default function AchievementBadges({ lang, casesCompleted, startupSubmitted, simulatorComplete, usedAIMentor }: AchievementBadgesProps) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const earned = new Set<string>();
  if (casesCompleted >= 1) earned.add('innovation_explorer');
  if (casesCompleted >= 3) earned.add('case_solver');
  if (startupSubmitted) earned.add('startup_builder');
  if (simulatorComplete) earned.add('growth_hacker');
  if (usedAIMentor) earned.add('ai_innovator');

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-5 w-5 text-sim-warning" />
        <h2 className="text-lg font-display font-semibold text-foreground">{t('Achievement Badges', 'Постижения')}</h2>
        <span className="ml-auto text-xs text-muted-foreground">{earned.size} / {ALL_BADGES.length}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {ALL_BADGES.map(b => {
          const isEarned = earned.has(b.id);
          const Icon = b.icon;
          return (
            <div key={b.id} className={`flex flex-col items-center text-center p-3 rounded-lg transition-all ${isEarned ? 'bg-accent' : 'bg-muted/50 opacity-40'}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full mb-2 ${isEarned ? b.gradient : 'bg-muted'}`}>
                <Icon className={`h-6 w-6 ${isEarned ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
              </div>
              <p className="text-xs font-semibold text-foreground">{lang === 'bg' ? b.nameBg : b.nameEn}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{lang === 'bg' ? b.descBg : b.descEn}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
