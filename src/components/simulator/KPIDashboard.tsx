import { KPIs, KPI_LABELS, KPI_LABELS_BG, KPI_FORMATS, KPI_DIRECTIONS } from '@/types/simulator';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPIDashboardProps {
  kpis: KPIs;
  previousKpis?: KPIs;
  compact?: boolean;
  lang?: 'en' | 'bg';
}

function formatValue(value: number, format: string): string {
  switch (format) {
    case 'currency': return `€${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    case 'percent': return `${(value * 100).toFixed(1)}%`;
    case 'score': return value.toFixed(0);
    default: return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }
}

export default function KPIDashboard({ kpis, previousKpis, compact, lang = 'en' }: KPIDashboardProps) {
  const kpiKeys = Object.keys(kpis) as (keyof KPIs)[];
  const labels = lang === 'bg' ? KPI_LABELS_BG : KPI_LABELS;
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  return (
    <div className={`grid gap-3 ${compact ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'}`}>
      {kpiKeys.map(key => {
        const value = kpis[key];
        const prev = previousKpis?.[key];
        const delta = prev !== undefined ? value - prev : undefined;
        const goodDirection = KPI_DIRECTIONS[key];
        const isGood = delta !== undefined
          ? (goodDirection === 'up' ? delta > 0 : delta < 0)
          : undefined;

        return (
          <div key={key} className="rounded-lg border border-border bg-sim-kpi-bg p-3 transition-all hover:shadow-md">
            <p className="text-xs font-medium text-muted-foreground truncate">{labels[key]}</p>
            <p className="mt-1 text-lg font-bold text-foreground font-mono">
              {formatValue(value, KPI_FORMATS[key])}
            </p>
            {delta !== undefined && Math.abs(delta) > 0.001 && (
              <div className={`mt-1 flex items-center gap-1 text-xs font-medium ${isGood ? 'text-sim-success' : 'text-sim-danger'}`}>
                {delta > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{delta > 0 ? '+' : ''}{formatValue(delta, KPI_FORMATS[key])}</span>
              </div>
            )}
            {(delta === undefined || Math.abs(delta) <= 0.001) && previousKpis && (
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Minus className="h-3 w-3" />
                <span>{t('No change', 'Без промяна')}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
