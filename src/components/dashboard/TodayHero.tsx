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
      className="relative rounded-3xl border-2 border-foreground bg-amber-50 p-4 sm:p-6 quest-shadow"
    >
      {/* Corner sticker */}
      <div className="absolute -top-3 -right-3 rotate-6 rounded-full border-2 border-foreground bg-rose-300 px-3 py-1 quest-shadow-sm">
        <span className="font-quest text-xs font-bold text-foreground uppercase tracking-wider">
          {t('Today', 'Днес')}
        </span>
      </div>

      {/* Mission anchor */}
      <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-white px-2.5 py-1">
        <Target className="h-3.5 w-3.5 text-foreground" strokeWidth={2.5} aria-hidden />
        <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">
          {t(action.missionEn, action.missionBg)}
        </span>
      </div>

      {/* Label */}
      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-foreground/60">
        {action.isResume
          ? t('Pick it back up', 'Продължи от там')
          : t('Your next move', 'Твоят следващ ход')}
      </p>

      {/* Title + icon sticker */}
      <div className="mt-2 flex items-start gap-3">
        <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-foreground bg-emerald-300 quest-shadow-sm -rotate-3">
          <Icon className="h-5 w-5 text-foreground" strokeWidth={2.5} aria-hidden />
        </div>
        <h2 className="font-quest text-xl sm:text-2xl font-bold text-foreground leading-tight">
          {t(action.titleEn, action.titleBg)}
        </h2>
      </div>

      {/* Purpose */}
      <p className="mt-3 text-sm text-foreground/80 leading-relaxed">
        {t(action.purposeEn, action.purposeBg)}
      </p>

      {/* Meta chips — chunky */}
      {(action.estMinutes || action.xp) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {action.estMinutes ? (
            <span className="inline-flex items-center gap-1 rounded-full border-2 border-foreground bg-white px-2.5 py-1 text-xs font-bold">
              <Clock className="h-3 w-3" strokeWidth={2.5} aria-hidden />
              {action.estMinutes} {t('min', 'мин')}
            </span>
          ) : null}
          {action.xp ? (
            <span className="inline-flex items-center gap-1 rounded-full border-2 border-foreground bg-amber-300 px-2.5 py-1 text-xs font-bold">
              <Zap className="h-3 w-3" strokeWidth={2.5} aria-hidden />
              +{action.xp} XP
            </span>
          ) : null}
        </div>
      )}

      {/* Chunky CTA */}
      <button
        onClick={() => navigate(action.path)}
        aria-label={t(action.titleEn, action.titleBg)}
        className="mt-5 group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-foreground bg-foreground px-6 py-3 text-base font-bold text-background quest-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
      >
        {t('Let\u2019s go', 'Хайде')}
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
      </button>
    </section>
  );
}