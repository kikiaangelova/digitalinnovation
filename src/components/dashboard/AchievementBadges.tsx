import { Award, Search, Lightbulb, TrendingUp, Brain, Shield, Check, LayoutGrid, Mic, MessageSquare, RotateCcw, Briefcase, Calendar, HelpCircle, BookOpen, Target, Repeat } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

interface BadgeDef {
  id: string;
  icon: LucideIcon;
  nameEn: string;
  nameBg: string;
  descEn: string;
  descBg: string;
}

const ALL_BADGES: BadgeDef[] = [
  { id: 'innovation_explorer', icon: Search, nameEn: 'Innovation Explorer', nameBg: 'Иновативен изследовател', descEn: 'Completed first case study', descBg: 'Завършен първи казус' },
  { id: 'case_solver', icon: Lightbulb, nameEn: 'Case Solver', nameBg: 'Решител на казуси', descEn: 'Completed 3 case studies', descBg: 'Завършени 3 казуса' },
  { id: 'sharp_analyst', icon: TrendingUp, nameEn: 'Sharp Analyst', nameBg: 'Остър Анализатор', descEn: 'Scored above 80% on a case', descBg: 'Резултат над 80% на казус' },
  { id: 'startup_builder', icon: Shield, nameEn: 'Startup Builder', nameBg: 'Стартъп строител', descEn: 'Submitted startup idea', descBg: 'Подадена стартъп идея' },
  { id: 'full_canvas', icon: LayoutGrid, nameEn: 'Canvas Master', nameBg: 'Майстор на Канваса', descEn: 'Completed all 9 BMC sections', descBg: 'Завършени всички 9 секции на BMC' },
  { id: 'pitch_master', icon: Mic, nameEn: 'Pitch Master', nameBg: 'Майстор на Представянето', descEn: 'Submitted final startup pitch', descBg: 'Подадено финално представяне' },
  { id: 'growth_hacker', icon: TrendingUp, nameEn: 'Growth Hacker', nameBg: 'Майстор на растежа', descEn: 'Completed simulator', descBg: 'Завършен симулатор' },
  { id: 'first_reviewer', icon: MessageSquare, nameEn: 'First Feedback', nameBg: 'Първа Рецензия', descEn: 'Completed a peer review', descBg: 'Завършена партньорска рецензия' },
  { id: 'ai_innovator', icon: Brain, nameEn: 'AI Innovator', nameBg: 'AI Иноватор', descEn: 'Used AI mentor feedback', descBg: 'Използвана AI обратна връзка' },
  { id: 'comeback_kid', icon: RotateCcw, nameEn: 'Comeback', nameBg: 'Завръщането', descEn: 'Returned after 3 days away', descBg: 'Върна се след 3 дни отсъствие' },
  { id: 'industry_expert', icon: Briefcase, nameEn: 'Industry Expert', nameBg: 'Индустриален Експерт', descEn: 'Completed cases in 3 different industries', descBg: 'Завършени казуси в 3 различни индустрии' },
  { id: 'perfect_week', icon: Calendar, nameEn: 'Perfect Week', nameBg: 'Перфектна Седмица', descEn: 'Logged in 5 days in a row', descBg: 'Влизал 5 дни подред' },
  // Test-related badges
  { id: 'quiz_starter', icon: HelpCircle, nameEn: 'Quiz Starter', nameBg: 'Начало на теста', descEn: 'Completed first quiz test', descBg: 'Завършен първи тест' },
  { id: 'knowledge_builder', icon: BookOpen, nameEn: 'Knowledge Builder', nameBg: 'Строител на знания', descEn: 'Completed 5 quiz tests', descBg: 'Завършени 5 тестa' },
  { id: 'test_explorer', icon: Target, nameEn: 'Test Explorer', nameBg: 'Изследовател на тестове', descEn: 'Tested in 3 different categories', descBg: 'Тестван в 3 различни категории' },
  { id: 'consistency_master', icon: Repeat, nameEn: 'Consistency Master', nameBg: 'Майстор на постоянството', descEn: 'Improved score 3 times in a row', descBg: 'Подобрен резултат 3 пъти подред' },
];

export interface AchievementBadgesProps {
  lang: 'en' | 'bg';
  casesCompleted: number;
  startupSubmitted: boolean;
  simulatorComplete: boolean;
  usedAIMentor: boolean;
  casesAbove80Percent?: number;
  bmcSectionsCompleted?: number;
  finalPitchSubmitted?: boolean;
  peerReviewsGiven?: number;
  returnedAfterAbsence?: boolean;
  industriesExplored?: number;
  loginStreakDays?: number;
  // Test badges
  quizTestsCompleted?: number;
  quizCategoriesTested?: number;
  quizConsecutiveImprovements?: number;
}

function getProgress(id: string, lang: 'en' | 'bg', props: AchievementBadgesProps): { label: string; current: number; max: number } | null {
  const bg = lang === 'bg';
  switch (id) {
    case 'innovation_explorer':
      return { label: bg ? `${props.casesCompleted} / 1 казус` : `${props.casesCompleted} / 1 case`, current: props.casesCompleted, max: 1 };
    case 'case_solver':
      return { label: bg ? `${Math.min(props.casesCompleted, 3)} / 3 завършени казуса` : `${Math.min(props.casesCompleted, 3)} / 3 cases completed`, current: Math.min(props.casesCompleted, 3), max: 3 };
    case 'sharp_analyst': {
      const v = props.casesAbove80Percent || 0;
      return { label: bg ? `${v} / 1 казус над 80%` : `${v} / 1 case above 80%`, current: v, max: 1 };
    }
    case 'startup_builder':
      return { label: bg ? 'Стартъпът не е подаден още' : 'Startup not submitted yet', current: 0, max: 1 };
    case 'full_canvas': {
      const v = props.bmcSectionsCompleted || 0;
      return { label: bg ? `${v} / 9 секции на BMC` : `${v} / 9 BMC sections`, current: v, max: 9 };
    }
    case 'pitch_master':
      return { label: bg ? 'Представянето не е подадено' : 'Pitch not submitted yet', current: 0, max: 1 };
    case 'growth_hacker':
      return { label: bg ? 'Симулаторът не е завършен' : 'Simulator not completed', current: 0, max: 1 };
    case 'first_reviewer': {
      const v = props.peerReviewsGiven || 0;
      return { label: bg ? `${v} / 1 рецензия` : `${v} / 1 review`, current: v, max: 1 };
    }
    case 'ai_innovator':
      return { label: bg ? 'AI менторът не е използван' : 'AI mentor not used yet', current: 0, max: 1 };
    case 'comeback_kid':
      return { label: bg ? 'Няма дълго отсъствие' : 'No long absence yet', current: 0, max: 1 };
    case 'industry_expert': {
      const v = props.industriesExplored || 0;
      return { label: bg ? `${Math.min(v, 3)} / 3 индустрии` : `${Math.min(v, 3)} / 3 industries`, current: Math.min(v, 3), max: 3 };
    }
    case 'perfect_week': {
      const v = props.loginStreakDays || 0;
      return { label: bg ? `${Math.min(v, 5)} / 5 дни подред` : `${Math.min(v, 5)} / 5 days in a row`, current: Math.min(v, 5), max: 5 };
    }
    // Test badges
    case 'quiz_starter': {
      const v = props.quizTestsCompleted || 0;
      return { label: bg ? `${Math.min(v, 1)} / 1 тест` : `${Math.min(v, 1)} / 1 test`, current: Math.min(v, 1), max: 1 };
    }
    case 'knowledge_builder': {
      const v = props.quizTestsCompleted || 0;
      return { label: bg ? `${Math.min(v, 5)} / 5 тестa` : `${Math.min(v, 5)} / 5 tests`, current: Math.min(v, 5), max: 5 };
    }
    case 'test_explorer': {
      const v = props.quizCategoriesTested || 0;
      return { label: bg ? `${Math.min(v, 3)} / 3 категории` : `${Math.min(v, 3)} / 3 categories`, current: Math.min(v, 3), max: 3 };
    }
    case 'consistency_master': {
      const v = props.quizConsecutiveImprovements || 0;
      return { label: bg ? `${Math.min(v, 3)} / 3 подобрения` : `${Math.min(v, 3)} / 3 improvements`, current: Math.min(v, 3), max: 3 };
    }
    default:
      return null;
  }
}

export default function AchievementBadges(props: AchievementBadgesProps) {
  const { lang } = props;
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const earned = new Set<string>();
  if (props.casesCompleted >= 1) earned.add('innovation_explorer');
  if (props.casesCompleted >= 3) earned.add('case_solver');
  if ((props.casesAbove80Percent || 0) >= 1) earned.add('sharp_analyst');
  if (props.startupSubmitted) earned.add('startup_builder');
  if ((props.bmcSectionsCompleted || 0) >= 9) earned.add('full_canvas');
  if (props.finalPitchSubmitted) earned.add('pitch_master');
  if (props.simulatorComplete) earned.add('growth_hacker');
  if ((props.peerReviewsGiven || 0) >= 1) earned.add('first_reviewer');
  if (props.usedAIMentor) earned.add('ai_innovator');
  if (props.returnedAfterAbsence) earned.add('comeback_kid');
  if ((props.industriesExplored || 0) >= 3) earned.add('industry_expert');
  if ((props.loginStreakDays || 0) >= 5) earned.add('perfect_week');
  // Test badges
  if ((props.quizTestsCompleted || 0) >= 1) earned.add('quiz_starter');
  if ((props.quizTestsCompleted || 0) >= 5) earned.add('knowledge_builder');
  if ((props.quizCategoriesTested || 0) >= 3) earned.add('test_explorer');
  if ((props.quizConsecutiveImprovements || 0) >= 3) earned.add('consistency_master');

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-5 w-5 text-xp-gold" />
        <h2 className="typo-h2 text-lg">{t('Achievement Badges', 'Постижения')}</h2>
        <span className="ml-auto text-xs text-muted-foreground">{earned.size} / {ALL_BADGES.length}</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {ALL_BADGES.map(b => {
          const isEarned = earned.has(b.id);
          const Icon = b.icon;
          const progress = !isEarned ? getProgress(b.id, lang, props) : null;
          const pct = progress ? (progress.current / progress.max) * 100 : 0;

          return (
            <div key={b.id} className={`flex flex-col items-center text-center p-3 rounded-lg transition-all ${isEarned ? 'bg-xp-gold/10 ring-1 ring-xp-gold/30' : 'bg-muted/30 opacity-40'}`}>
              <div className="relative">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full mb-2 ${isEarned ? 'bg-xp-gold shadow-[0_0_16px_hsl(var(--xp-gold)/0.4)]' : 'bg-muted'}`}>
                  <Icon className={`h-6 w-6 ${isEarned ? 'text-white' : 'text-muted-foreground'}`} />
                </div>
                {isEarned && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-sim-success flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <p className="text-xs font-semibold text-foreground">{lang === 'bg' ? b.nameBg : b.nameEn}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{lang === 'bg' ? b.descBg : b.descEn}</p>
              {progress && (
                <div className="w-full mt-1.5 space-y-0.5">
                  <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-xp-gold transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{progress.label}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
