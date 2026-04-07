import { Shield, Zap, AlertTriangle, Flame } from 'lucide-react';
import { TurbulenceState } from '@/types/simulator';

interface TurbulenceMeterProps {
  turbulence: TurbulenceState;
  lang?: string;
}

function getStabilityLevel(score: number) {
  if (score >= 80) return { label: 'Stable', labelBg: 'Стабилен', color: 'text-sim-success', bg: 'bg-sim-success', icon: Shield };
  if (score >= 55) return { label: 'Moderate', labelBg: 'Умерен', color: 'text-yellow-500', bg: 'bg-yellow-500', icon: Zap };
  if (score >= 30) return { label: 'Turbulent', labelBg: 'Турбулентен', color: 'text-orange-500', bg: 'bg-orange-500', icon: AlertTriangle };
  return { label: 'Chaotic', labelBg: 'Хаотичен', color: 'text-sim-danger', bg: 'bg-sim-danger', icon: Flame };
}

export default function TurbulenceMeter({ turbulence, lang = 'en' }: TurbulenceMeterProps) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const level = getStabilityLevel(turbulence.stability_score);
  const Icon = level.icon;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${level.color}`} />
          <h3 className="text-sm font-semibold text-foreground">
            {t('Market Stability', 'Пазарна стабилност')}
          </h3>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${level.bg}/15 ${level.color}`}>
          {lang === 'bg' ? level.labelBg : level.label}
        </span>
      </div>

      {/* Stability bar */}
      <div className="relative h-3 rounded-full bg-muted overflow-hidden mb-3">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${level.bg}`}
          style={{ width: `${turbulence.stability_score}%` }}
        />
        {/* Chaos zone marker */}
        <div className="absolute inset-y-0 left-0 w-[30%] bg-sim-danger/10 rounded-l-full" />
      </div>

      <div className="flex justify-between text-[10px] text-muted-foreground font-medium mb-4">
        <span>🔥 {t('Chaos', 'Хаос')}</span>
        <span>{turbulence.stability_score}/100</span>
        <span>🛡️ {t('Stability', 'Стабилност')}</span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted/50 p-2.5 text-center">
          <p className="text-lg font-bold text-foreground">{turbulence.events_triggered}</p>
          <p className="text-[10px] text-muted-foreground">{t('Disruptions Faced', 'Срещнати сътресения')}</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-2.5 text-center">
          <p className="text-lg font-bold text-foreground">
            {turbulence.resilience_bonus > 0 ? `+${turbulence.resilience_bonus}` : '0'}
          </p>
          <p className="text-[10px] text-muted-foreground">{t('Resilience XP', 'XP за устойчивост')}</p>
        </div>
      </div>

      {/* Kotler concept hint */}
      <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
        <p className="text-xs text-foreground/80">
          📚 <span className="font-semibold">Kotler's Chaotics:</span>{' '}
          {t(
            'In turbulent economies, the worst strategy is to do nothing. Adapt your strategy to each disruption — resilience is a competitive advantage.',
            'В турбулентни икономики най-лошата стратегия е да не правиш нищо. Адаптирай стратегията си към всяко сътресение — устойчивостта е конкурентно предимство.'
          )}
        </p>
      </div>
    </div>
  );
}
