/**
 * StatsStrip — compact "who am I / how am I doing" row shown above TodayHero.
 * Read-only. No mutations. Keeps the calmer inner-app visual language:
 * cream card, 1px border, small chunky numbers, no gradients.
 */

import { Zap, Flame, Trophy, BookOpen } from 'lucide-react';

type Lang = 'en' | 'bg';

interface Props {
  lang: Lang;
  xp: number;
  streakDays: number;
  casesCompleted: number;
}

function xpToLevel(xp: number): { level: number; nextAt: number; pct: number } {
  // Simple ladder: 200 XP per level. Feels earned but not slow.
  const level = Math.floor(xp / 200) + 1;
  const nextAt = level * 200;
  const pct = Math.min(100, Math.round(((xp % 200) / 200) * 100));
  return { level, nextAt, pct };
}

export default function StatsStrip({ lang, xp, streakDays, casesCompleted }: Props) {
  const t = (en: string, bg: string) => (lang === 'bg' ? bg : en);
  const { level, nextAt, pct } = xpToLevel(xp);

  const stats = [
    {
      icon: Zap,
      value: xp.toLocaleString(),
      label: 'XP',
      tone: 'text-amber-600',
    },
    {
      icon: Trophy,
      value: `${t('Lv', 'Ниво')} ${level}`,
      label: `${nextAt - xp} ${t('to next', 'до следващо')}`,
      tone: 'text-primary',
    },
    {
      icon: Flame,
      value: streakDays > 0 ? `${streakDays}` : '—',
      label: streakDays === 1 ? t('day streak', 'ден серия') : t('day streak', 'дни серия'),
      tone: 'text-orange-600',
    },
    {
      icon: BookOpen,
      value: `${casesCompleted}`,
      label: t('cases done', 'решени казуса'),
      tone: 'text-emerald-600',
    },
  ];

  return (
    <section
      aria-label={t('Your stats', 'Твоята статистика')}
      className="rounded-2xl border border-border bg-card p-3 sm:p-4"
    >
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {stats.map((s, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center rounded-xl bg-muted/40 px-1 py-2 sm:py-2.5 text-center"
          >
            <s.icon className={`h-4 w-4 mb-1 ${s.tone}`} aria-hidden />
            <p className="text-sm sm:text-base font-bold text-foreground leading-none">{s.value}</p>
            <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground leading-tight">{s.label}</p>
          </div>
        ))}
      </div>
      {/* Level progress bar */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-[width] duration-500"
          style={{ width: `${pct}%` }}
          aria-label={t(`${pct}% to next level`, `${pct}% до следващо ниво`)}
        />
      </div>
    </section>
  );
}