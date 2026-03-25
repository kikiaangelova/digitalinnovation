import { useEffect, useRef, useState } from 'react';
import { Zap, Star, Shield, Rocket, Crown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const LEVELS = [
  { level: 1, name: { en: 'Digital Explorer', bg: 'Дигитален Изследовател' }, xpNeeded: 0, icon: Zap, gradient: 'gradient-explorer' },
  { level: 2, name: { en: 'Problem Solver', bg: 'Решавач на проблеми' }, xpNeeded: 200, icon: Star, gradient: 'gradient-strategist' },
  { level: 3, name: { en: 'Startup Builder', bg: 'Стартъп строител' }, xpNeeded: 500, icon: Shield, gradient: 'gradient-builder' },
  { level: 4, name: { en: 'Innovation Strategist', bg: 'Иновационен стратег' }, xpNeeded: 1000, icon: Rocket, gradient: 'gradient-designer' },
  { level: 5, name: { en: 'Startup Founder', bg: 'Стартъп основател' }, xpNeeded: 1800, icon: Crown, gradient: 'gradient-founder' },
];

interface LevelCardProps {
  xp: number;
  lang: 'en' | 'bg';
}

export function getCurrentLevel(xp: number) {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.xpNeeded) current = l;
  }
  return current;
}

export function getNextLevel(xp: number) {
  for (const l of LEVELS) {
    if (xp < l.xpNeeded) return l;
  }
  return null;
}

export default function LevelCard({ xp, lang }: LevelCardProps) {
  const current = getCurrentLevel(xp);
  const next = getNextLevel(xp);
  const Icon = current.icon;
  const prevXp = useRef(xp);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (xp !== prevXp.current && prevXp.current !== undefined) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 800);
      prevXp.current = xp;
      return () => clearTimeout(timer);
    }
    prevXp.current = xp;
  }, [xp]);

  const progressToNext = next
    ? ((xp - current.xpNeeded) / (next.xpNeeded - current.xpNeeded)) * 100
    : 100;

  return (
    <div className="rounded-xl border border-border bg-card p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <Icon className="w-full h-full" />
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${current.gradient} shadow-lg`}>
          <Icon className="h-7 w-7 text-primary-foreground" />
        </div>
        <div>
          <p className="typo-stage-label">
            {lang === 'bg' ? 'Ниво' : 'Level'} {current.level}
          </p>
          <h2 className="text-xl font-display font-bold sim-gradient-text">
            {current.name[lang]}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <Zap className="h-4 w-4 text-xp-gold" />
        <span className={`text-2xl font-bold text-xp-gold transition-transform ${pulse ? 'xp-pulse' : ''}`}>{xp}</span>
        <span className="text-sm text-muted-foreground">XP</span>
      </div>

      {next ? (
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>{lang === 'bg' ? 'Следващо ниво' : 'Next level'}: {next.name[lang]}</span>
            <span>{next.xpNeeded - xp} XP {lang === 'bg' ? 'оставащи' : 'remaining'}</span>
          </div>
          <Progress value={progressToNext} className="h-2.5" indicatorClassName="bg-xp-gold" />
        </div>
      ) : (
        <p className="text-sm font-medium text-sim-success">
          {lang === 'bg' ? '🎉 Максимално ниво достигнато!' : '🎉 Max level reached!'}
        </p>
      )}
    </div>
  );
}
