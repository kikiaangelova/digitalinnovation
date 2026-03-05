import { OutcomeReport, KPI_LABELS, KPI_LABELS_BG, KPI_FORMATS } from '@/types/simulator';
import { TrendingUp, TrendingDown, AlertTriangle, MessageSquare } from 'lucide-react';

interface OutcomeReportViewProps {
  report: OutcomeReport;
  lang?: 'en' | 'bg';
}

function formatVal(value: number, key: string): string {
  const format = KPI_FORMATS[key as keyof typeof KPI_FORMATS] || 'number';
  switch (format) {
    case 'currency': return `€${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    case 'percent': return `${(value * 100).toFixed(1)}%`;
    default: return value.toFixed(1);
  }
}

export default function OutcomeReportView({ report, lang = 'en' }: OutcomeReportViewProps) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const labels = lang === 'bg' ? KPI_LABELS_BG : KPI_LABELS;
  const changes = Object.entries(report.kpi_changes).filter(([, v]) => v && Math.abs(v.delta) > 0.001);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          📊 {t(`Week ${report.week_number} Outcome Report`, `Седмица ${report.week_number} — Доклад за резултатите`)}
        </h3>
        <p className="text-sm text-foreground/80 whitespace-pre-line mb-4">{report.explanation}</p>

        <div className="grid gap-2 sm:grid-cols-2">
          {changes.map(([key, change]) => {
            if (!change) return null;
            const isPositive = change.delta > 0;
            return (
              <div key={key} className="flex items-center justify-between rounded-lg border border-border p-3 bg-sim-surface">
                <span className="text-sm font-medium text-foreground">
                  {labels[key as keyof typeof labels] || key}
                </span>
                <div className={`flex items-center gap-1 text-sm font-mono font-medium ${isPositive ? 'text-sim-success' : 'text-sim-danger'}`}>
                  {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {isPositive ? '+' : ''}{formatVal(change.delta, key)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {report.risks.length > 0 && (
        <div className="rounded-xl border border-sim-warning/30 bg-sim-warning/5 p-5">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-sim-warning" />
            {t('Risks & Warnings', 'Рискове и предупреждения')}
          </h4>
          <ul className="space-y-2">
            {report.risks.map((risk, i) => (
              <li key={i} className="text-sm text-foreground/80">{risk}</li>
            ))}
          </ul>
        </div>
      )}

      {report.instructor_comment && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            {t('Instructor Feedback', 'Обратна връзка от преподавателя')}
          </h4>
          <p className="text-sm text-foreground/80">{report.instructor_comment}</p>
        </div>
      )}
    </div>
  );
}
