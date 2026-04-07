import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCurrentLevel, getNextLevel } from './LevelCard';
import {
  ArrowRight, BookOpen, Search, Lightbulb, Palette, TrendingUp, Presentation,
  CheckCircle2, Zap, Target, Award,
} from 'lucide-react';
import { deriveJourneyStatuses } from '@/lib/journey';

/* ── Stage definitions (matches JourneyProgress) ── */
const STAGES = [
  { id: 1, icon: BookOpen, en: 'Discover the Problem', bg: 'Открий проблема', path: '/learn/platform-business-models' },
  { id: 2, icon: Search, en: 'Analyze the Market', bg: 'Анализирай пазара', path: '/learn/digital-ecosystems' },
  { id: 3, icon: Lightbulb, en: 'Design the Solution', bg: 'Проектирай решението', path: '/learn/customer-acquisition-cost' },
  { id: 4, icon: Palette, en: 'Build the Startup', bg: 'Изгради стартъпа', path: '/learn/marketing-fundamentals' },
  { id: 5, icon: TrendingUp, en: 'Test in Simulator', bg: 'Тествай в симулатора', path: '/learn/operations-fundamentals' },
  { id: 6, icon: Presentation, en: 'Pitch the Startup', bg: 'Представи стартъпа', path: '/my-startup?section=final_pitch' },
];

const NEXT_STEP_HINTS: Record<number, { en: string; bg: string }> = {
  0: { en: 'Complete your first case study', bg: 'Завърши първия си казус' },
  1: { en: 'Analyze a second case study', bg: 'Анализирай втори казус' },
  2: { en: 'Define your problem & value proposition', bg: 'Дефинирай проблем и стойностно предложение' },
  3: { en: 'Build your product, model & growth plan', bg: 'Изгради продукт, модел и план за растеж' },
  4: { en: 'Test your strategy in the simulator', bg: 'Тествай стратегията в симулатора' },
  5: { en: 'Submit your final pitch', bg: 'Подай финалното си представяне' },
};

interface LearningNavigatorProps {
  lang: 'en' | 'bg';
  xp: number;
  casesCompleted: number;
  startupSections: Record<string, boolean>;
  startupSubmitted: boolean;
  simWeek: number;
  simComplete: boolean;
  outcomeScores: Record<string, number>;
}

export default function LearningNavigator(props: LearningNavigatorProps) {
  const { lang, xp, outcomeScores } = props;
  const navigate = useNavigate();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const statuses = deriveJourneyStatuses(props);
  const completedCount = statuses.filter(s => s === 'completed').length;
  const currentStageIdx = statuses.findIndex(s => s !== 'completed');
  const currentStage = currentStageIdx >= 0 ? STAGES[currentStageIdx] : null;
  const allDone = currentStageIdx === -1;
  const overallPct = Math.round((completedCount / 6) * 100);

  const level = getCurrentLevel(xp);
  const nextLevel = getNextLevel(xp);
  const LevelIcon = level.icon;

  const progressToNext = nextLevel
    ? ((xp - level.xpNeeded) / (nextLevel.xpNeeded - level.xpNeeded)) * 100
    : 100;

  // Average learning score
  const scoreValues = Object.values(outcomeScores);
  const avgLearning = scoreValues.length > 0
    ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
    : 0;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* ── Top: Level + XP + Stage indicator ── */}
      <div className="p-4 sm:p-5 pb-4 space-y-4">
        {/* Row 1: Level badge + XP */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${level.gradient} shadow-lg`}>
              <LevelIcon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t('Level', 'Ниво')} {level.level}
              </p>
              <h2 className="text-lg font-display font-bold text-foreground leading-tight">
                {level.name[lang]}
              </h2>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <Zap className="h-4 w-4 text-xp-gold" />
              <span className="text-xl font-bold text-xp-gold">{xp}</span>
              <span className="text-xs text-muted-foreground">XP</span>
            </div>
            {nextLevel && (
              <p className="text-xs text-muted-foreground">
                {nextLevel.xpNeeded - xp} {t('to next level', 'до следващо ниво')}
              </p>
            )}
          </div>
        </div>

        {/* XP progress bar */}
        {nextLevel && (
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>{level.name[lang]}</span>
              <span>{nextLevel.name[lang]}</span>
            </div>
            <Progress value={progressToNext} className="h-2" indicatorClassName="bg-xp-gold" />
          </div>
        )}
      </div>

      {/* ── Middle: Stage progress + 3 stats ── */}
      <div className="px-4 sm:px-5 pb-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-accent/60 p-3 text-center">
            <Target className="h-4 w-4 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold text-foreground">{completedCount}/6</p>
            <p className="text-xs text-muted-foreground">{t('Stages', 'Етапи')}</p>
          </div>
          <div className="rounded-xl bg-accent/60 p-3 text-center">
            <Award className="h-4 w-4 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold text-foreground">{overallPct}%</p>
            <p className="text-xs text-muted-foreground">{t('Journey', 'Път')}</p>
          </div>
          <div className="rounded-xl bg-accent/60 p-3 text-center">
            <BookOpen className="h-4 w-4 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold text-foreground">{avgLearning}%</p>
            <p className="text-xs text-muted-foreground">{t('Learning', 'Учене')}</p>
          </div>
        </div>
      </div>

      {/* ── Stage dots ── */}
      <div className="px-4 sm:px-5 pb-3">
        <div className="flex items-center gap-1">
          {STAGES.map((stage, idx) => {
            const status = statuses[idx];
            const isCurrent = idx === currentStageIdx;
            return (
              <div key={stage.id} className="flex items-center flex-1">
                <div
                  className={`h-2.5 w-full rounded-full transition-all ${
                    status === 'completed' ? 'bg-sim-success'
                    : isCurrent ? 'sim-gradient'
                    : status === 'in_progress' ? 'bg-primary/30'
                    : 'bg-muted'
                  }`}
                />
                {idx < STAGES.length - 1 && <div className="w-0.5" />}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-1.5">
          {STAGES.map((stage, idx) => {
            const status = statuses[idx];
            return (
              <span key={stage.id} className={`text-[10px] ${status === 'completed' ? 'text-sim-success' : idx === currentStageIdx ? 'text-primary font-semibold' : 'text-muted-foreground/60'}`}>
                {idx + 1}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── Bottom: Recommended Next Step CTA (prominent) ── */}
      <div className={`border-t-2 border-primary/20 p-4 ${allDone ? 'bg-sim-success/5' : 'bg-primary/5'}`}>
        {allDone ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sim-success/15 shrink-0">
              <CheckCircle2 className="h-6 w-6 text-sim-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-foreground">
                {t('Journey Complete! 🎉', 'Пътешествието е завършено! 🎉')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('Take the final exam to earn your certificate', 'Направи финалния изпит за сертификат')}
              </p>
            </div>
            <Button className="sim-gradient border-0 h-10 px-5 gap-2 w-full sm:w-auto" onClick={() => navigate('/final-exam')}>
              <Award className="h-4 w-4" /> {t('Final Exam', 'Финален изпит')}
            </Button>
          </div>
        ) : currentStage && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl sim-gradient shrink-0 shadow-md">
                <currentStage.icon className="h-6 w-6 text-primary-foreground" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-primary items-center justify-center">
                    <ArrowRight className="h-2.5 w-2.5 text-primary-foreground" />
                  </span>
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[11px] font-bold text-primary uppercase tracking-wider">
                    {t('Your Next Step', 'Следваща стъпка')}
                  </p>
                  <Badge className="bg-primary/15 text-primary border-0 text-[10px] px-1.5 py-0">
                    {t(`Stage ${currentStageIdx + 1}/6`, `Етап ${currentStageIdx + 1}/6`)}
                  </Badge>
                </div>
                <p className="text-sm font-bold text-foreground truncate">
                  {NEXT_STEP_HINTS[currentStageIdx]?.[lang] || (lang === 'bg' ? currentStage.bg : currentStage.en)}
                </p>
              </div>
            </div>
            <Button
              className="sim-gradient border-0 gap-1.5 h-10 px-5 shadow-md w-full sm:w-auto shrink-0"
              onClick={() => navigate(currentStage.path)}
            >
              {t('Continue', 'Продължи')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
