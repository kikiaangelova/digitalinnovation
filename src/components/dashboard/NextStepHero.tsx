import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Rocket, BarChart3, Target, Presentation, Award } from 'lucide-react';

interface NextStepHeroProps {
  lang: 'en' | 'bg';
  casesCompleted: number;
  startupSectionMap: Record<string, boolean>;
  startupSubmitted: boolean;
  simWeek: number;
  simComplete: boolean;
  finalPitchSubmitted: boolean;
  stagesCompleted: number;
}

/** Determines the single most important next action based on existing progress (read-only). */
function deriveNextStep(props: NextStepHeroProps) {
  const { casesCompleted, startupSectionMap, simComplete, simWeek, finalPitchSubmitted, startupSubmitted, stagesCompleted } = props;
  const t = (en: string, bg: string) => props.lang === 'bg' ? bg : en;

  if (casesCompleted === 0) {
    return { label: t('Complete Stage 1', 'Завърши Етап 1'), sub: t('Start your first case study', 'Започни първия си казус'), path: '/cases', icon: BookOpen };
  }

  // Check for in-progress case (stage 2)
  if (casesCompleted < 2) {
    return { label: t('Continue with cases', 'Продължи с казусите'), sub: t('Analyze a second case study', 'Анализирай втори казус'), path: '/cases', icon: BookOpen };
  }

  const startupFilled = Object.values(startupSectionMap).filter(Boolean).length;
  if (startupFilled < 3) {
    return { label: t('Build your startup project', 'Довърши стартъп проекта'), sub: t('Define your problem & solution', 'Дефинирай проблем и решение'), path: '/my-startup', icon: Rocket };
  }

  if (!simComplete && simWeek <= 1) {
    return { label: t('Run 1 simulation', 'Направи 1 симулация'), sub: t('Test your strategy', 'Тествай стратегията си'), path: '/simulator', icon: BarChart3 };
  }

  if (!simComplete) {
    return { label: t('Continue simulator', 'Продължи симулатора'), sub: t(`Week ${simWeek} of 6`, `Седмица ${simWeek} от 6`), path: '/simulator', icon: BarChart3 };
  }

  if (!finalPitchSubmitted) {
    return { label: t('Submit your final pitch', 'Подай финалното представяне'), sub: t('Complete your startup project', 'Завърши стартъп проекта'), path: '/my-startup?section=final_pitch', icon: Presentation };
  }

  return { label: t('Take the final exam', 'Направи финалния изпит'), sub: t('Earn your certificate', 'Спечели своя сертификат'), path: '/final-exam', icon: Award };
}

export default function NextStepHero(props: NextStepHeroProps) {
  const navigate = useNavigate();
  const t = (en: string, bg: string) => props.lang === 'bg' ? bg : en;
  const step = deriveNextStep(props);
  const Icon = step.icon;

  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-4 sm:p-5">
      <div className="flex items-center gap-1.5 mb-3">
        <Target className="h-4 w-4 text-primary" />
        <h2 className="text-xs font-bold text-primary uppercase tracking-wider">
          {t('Your Next Step', 'Твоята следваща стъпка')}
        </h2>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl sim-gradient shadow-md shrink-0">
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-foreground">{step.label}</p>
          <p className="text-sm text-muted-foreground">{step.sub}</p>
        </div>
        <Button
          className="sim-gradient border-0 gap-2 h-10 px-6 shadow-md w-full sm:w-auto shrink-0"
          onClick={() => navigate(step.path)}
        >
          {t('Continue', 'Продължи')}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
