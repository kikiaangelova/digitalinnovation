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
    { icon: Zap,      value: xp.toLocaleString(),                label: 'XP',
      bg: 'bg-amber-100',   ring: 'border-amber-950',   tone: 'text-amber-700',   tilt: '-rotate-2' },
    { icon: Trophy,   value: `${level}`,                          label: `${t('Lv', 'Ниво')} • ${nextAt - xp} ${t('to go', 'до нов')}`,
      bg: 'bg-emerald-100', ring: 'border-emerald-950', tone: 'text-emerald-700', tilt: 'rotate-1' },
    { icon: Flame,    value: streakDays > 0 ? `${streakDays}` : '0', label: t('day streak', 'дни серия'),
      bg: 'bg-orange-100',  ring: 'border-orange-950',  tone: 'text-orange-700',  tilt: '-rotate-1' },
    { icon: BookOpen, value: `${casesCompleted}`,                 label: t('cases', 'казуса'),
      bg: 'bg-violet-100',  ring: 'border-violet-950',  tone: 'text-violet-700',  tilt: 'rotate-2' },
  ];

  return (
    <section aria-label={t('Your stats', 'Твоята статистика')} className="space-y-3">
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`relative ${s.tilt} hover:rotate-0 transition-transform duration-200 flex flex-col items-center justify-center rounded-2xl border-2 ${s.ring} ${s.bg} px-1 py-2.5 text-center quest-shadow-sm`}
          >
            <s.icon className={`h-4 w-4 mb-1 ${s.tone}`} strokeWidth={2.5} aria-hidden />
            <p className="font-quest text-xl sm:text-2xl font-bold text-foreground leading-none">{s.value}</p>
            <p className="mt-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-foreground/70 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>
      {/* Level progress bar — chunky */}
      <div className="relative">
        <div className="h-3 w-full overflow-hidden rounded-full border-2 border-foreground bg-background">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 transition-[width] duration-500"
            style={{ width: `${pct}%` }}
            aria-label={t(`${pct}% to next level`, `${pct}% до следващо ниво`)}
          />
        </div>
        <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {pct}% → {t('Level', 'Ниво')} {level + 1}
        </p>
      </div>
    </section>
  );
}