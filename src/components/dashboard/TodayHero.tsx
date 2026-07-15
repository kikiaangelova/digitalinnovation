/**
 * TodayHero — the single primary "what next" surface for Student Dashboard V2.
 *
 * Replaces the previous parallel CTAs (header primary, NextStepHero,
 * LearningNavigator hero, QuickResumeCards, DailyGoalCard) with ONE
 * decisive block driven by `resolveNextAction()`.
 *
 * Read-only: does not mutate progress, XP, or drafts.
 */

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight, BookOpen, Rocket, BarChart3, Presentation,
  Award, ClipboardList, Target, Clock, Zap,
} from 'lucide-react';
import type { NextAction, NextActionIcon, Lang } from '@/lib/nextAction';

const ICONS: Record<NextActionIcon, typeof BookOpen> = {
  book: BookOpen,
  rocket: Rocket,
  chart: BarChart3,
  pitch: Presentation,
  award: Award,
  assignment: ClipboardList,
};

interface Props {
  lang: Lang;
  action: NextAction;
}

export default function TodayHero({ lang, action }: Props) {
  const navigate = useNavigate();
  const t = (en: string, bg: string) => (lang === 'bg' ? bg : en);
  const Icon = ICONS[action.iconKey] ?? BookOpen;

  return (
    <section
      aria-label={t('Today', 'Днес')}
      className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 sm:p-6 shadow-sm"
    >
      {/* Mission anchor */}
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        <Target className="h-3.5 w-3.5" aria-hidden />
        <span>{t(action.missionEn, action.missionBg)}</span>
      </div>

      {/* Continue Learning label */}
      <p className="mt-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {action.isResume
          ? t('Continue learning', 'Продължи да учиш')
          : t('Recommended next', 'Препоръчано следващо')}
      </p>

      {/* Title + icon */}
      <div className="mt-1 flex items-start gap-3">
        <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
          {t(action.titleEn, action.titleBg)}
        </h2>
      </div>

      {/* Purpose line */}
      <p className="mt-3 text-sm text-foreground/80 leading-relaxed">
        {t(action.purposeEn, action.purposeBg)}
      </p>

      {/* Meta chips */}
      {(action.estMinutes || action.xp) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {action.estMinutes ? (
            <Badge variant="secondary" className="gap-1 min-h-[28px]">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {t(`≈ ${action.estMinutes} min`, `≈ ${action.estMinutes} мин`)}
            </Badge>
          ) : null}
          {action.xp ? (
            <Badge variant="secondary" className="gap-1 min-h-[28px]">
              <Zap className="h-3.5 w-3.5" aria-hidden />
              +{action.xp} XP
            </Badge>
          ) : null}
        </div>
      )}

      {/* Single primary CTA */}
      <div className="mt-4">
        <Button
          size="lg"
          className="w-full sm:w-auto min-h-[48px] gap-2 sim-gradient border-0 shadow-md"
          onClick={() => navigate(action.path)}
          aria-label={t(action.titleEn, action.titleBg)}
        >
          {t('Continue', 'Продължи')}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}