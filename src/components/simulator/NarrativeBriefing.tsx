import { ShockEvent, TurbulenceState } from '@/types/simulator';
import { AlertTriangle, BookOpen, Lightbulb, Zap } from 'lucide-react';

interface NarrativeBriefingProps {
  narrative: string;
  weekNumber: number;
  shockEvent?: ShockEvent;
  dynamicShock?: ShockEvent;
  turbulence?: TurbulenceState;
  lang?: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  market_crash: '📉',
  competitor_entry: '🏁',
  regulation_change: '⚖️',
  tech_disruption: '🤖',
};

const CATEGORY_LABELS: Record<string, [string, string]> = {
  market_crash: ['Market Crash', 'Пазарен срив'],
  competitor_entry: ['Competitor Entry', 'Навлизане на конкурент'],
  regulation_change: ['Regulation Change', 'Промяна в регулации'],
  tech_disruption: ['Tech Disruption', 'Технологична промяна'],
};

export default function NarrativeBriefing({ narrative, weekNumber, shockEvent, dynamicShock, turbulence, lang = 'en' }: NarrativeBriefingProps) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const activeShock = shockEvent || dynamicShock;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg sim-gradient">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {t(`Week ${weekNumber} Briefing`, `Седмица ${weekNumber} — Брифинг`)}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('Market update & context', 'Пазарна актуализация и контекст')}
            </p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">{narrative}</p>
      </div>

      {activeShock && (
        <div className="rounded-xl border-2 border-sim-warning bg-sim-warning/5 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sim-warning/20">
              <AlertTriangle className="h-5 w-5 text-sim-warning" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">
                  ⚡ {dynamicShock ? t('Turbulence Event', 'Турбулентно събитие') : t('Shock Event', 'Шоково събитие')}: {activeShock.title}
                </h4>
              </div>
              {activeShock.category && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {CATEGORY_ICONS[activeShock.category] || '⚡'}{' '}
                    {lang === 'bg' ? CATEGORY_LABELS[activeShock.category]?.[1] : CATEGORY_LABELS[activeShock.category]?.[0]}
                  </span>
                  {activeShock.severity && (
                    <span className="text-xs text-muted-foreground">
                      • {t('Severity', 'Тежест')}: {'🔴'.repeat(Math.min(activeShock.severity, 5))}{'⚪'.repeat(5 - Math.min(activeShock.severity, 5))}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-foreground/80 mb-3">{activeShock.description}</p>

          {/* Impact preview */}
          {Object.entries(activeShock.kpi_effects).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {Object.entries(activeShock.kpi_effects).map(([key, val]) => (
                <span
                  key={key}
                  className={`text-xs font-mono px-2 py-0.5 rounded ${
                    (val as number) > 0 && !['churn_rate', 'burn_rate', 'tech_debt', 'compliance_risk', 'cac'].includes(key)
                      ? 'bg-sim-success/10 text-sim-success'
                      : 'bg-sim-danger/10 text-sim-danger'
                  }`}
                >
                  {key.replace(/_/g, ' ')}: {(val as number) > 0 ? '+' : ''}{val as number}
                </span>
              ))}
            </div>
          )}

          {/* Concept lesson */}
          {activeShock.concept_lesson && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 mt-2">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-foreground/80">
                  {lang === 'bg' ? activeShock.concept_lesson_bg || activeShock.concept_lesson : activeShock.concept_lesson}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
