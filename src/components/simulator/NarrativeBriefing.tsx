import { ShockEvent } from '@/types/simulator';
import { AlertTriangle, BookOpen } from 'lucide-react';

interface NarrativeBriefingProps {
  narrative: string;
  weekNumber: number;
  shockEvent?: ShockEvent;
  lang?: 'en' | 'bg';
}

export default function NarrativeBriefing({ narrative, weekNumber, shockEvent, lang = 'en' }: NarrativeBriefingProps) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

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

      {shockEvent && (
        <div className="rounded-xl border-2 border-sim-warning bg-sim-warning/5 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sim-warning/20">
              <AlertTriangle className="h-5 w-5 text-sim-warning" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                ⚡ {t('Shock Event', 'Шоково събитие')}: {shockEvent.title}
              </h4>
            </div>
          </div>
          <p className="text-sm text-foreground/80">{shockEvent.description}</p>
        </div>
      )}
    </div>
  );
}
