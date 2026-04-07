import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { toast } from 'sonner';
import type { KPIs } from '@/types/simulator';
import { KPI_LABELS, KPI_LABELS_BG, KPI_FORMATS } from '@/types/simulator';

interface WeekSummary {
  weekNumber: number;
  decisions: { title: string; chosenOption: string }[];
  topPositiveKpi: string;
  topNegativeKpi: string;
}

interface Props {
  allWeekAnswers: WeekSummary[];
  startKpis: KPIs;
  finalKpis: KPIs;
  lang: 'en' | 'bg';
}

const KEY_RESULTS: (keyof KPIs)[] = ['users_total', 'revenue', 'brand_trust', 'nps'];

function formatVal(value: number, key: keyof KPIs): string {
  const format = KPI_FORMATS[key];
  switch (format) {
    case 'currency': return `€${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    case 'percent': return `${(value * 100).toFixed(1)}%`;
    default: return value.toFixed(1);
  }
}

export default function SimulatorJourneySummary({ allWeekAnswers, startKpis, finalKpis, lang }: Props) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const labels = lang === 'bg' ? KPI_LABELS_BG : KPI_LABELS;
  const [reflection, setReflection] = useState('');

  const buildPlainText = () => {
    let text = `${t('My Startup Journey', 'Моето стартъп пътешествие')}\n${'─'.repeat(30)}\n\n`;
    allWeekAnswers.forEach(w => {
      text += `${t('Week', 'Седмица')} ${w.weekNumber}\n`;
      w.decisions.forEach(d => { text += `  • ${d.title}: ${d.chosenOption}\n`; });
      text += `  ↑ ${labels[w.topPositiveKpi as keyof KPIs] || w.topPositiveKpi}  ↓ ${labels[w.topNegativeKpi as keyof KPIs] || w.topNegativeKpi}\n\n`;
    });
    text += `${t('Key Results', 'Ключови резултати')}\n`;
    KEY_RESULTS.forEach(k => {
      text += `  ${labels[k]}: ${formatVal(startKpis[k], k)} → ${formatVal(finalKpis[k], k)}\n`;
    });
    if (reflection.trim()) text += `\n${t('What I learned', 'Какво научих')}:\n${reflection}\n`;
    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildPlainText());
    toast.success(t('Copied to clipboard!', 'Копирано!'));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          🚀 {t('My Startup Journey', 'Моето стартъп пътешествие')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('A summary of every decision you made across all weeks.', 'Обобщение на всяко решение, което взехте през всички седмици.')}
        </p>
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="relative pl-6 space-y-6">
          {/* Vertical line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />

          {allWeekAnswers.map(w => (
            <div key={w.weekNumber} className="relative">
              {/* Dot */}
              <div className="absolute -left-6 top-0.5 h-[22px] w-[22px] rounded-full border-2 border-primary bg-card flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary">{w.weekNumber}</span>
              </div>

              <div className="space-y-1.5">
                <Badge variant="outline" className="text-xs font-semibold">
                  {t('Week', 'Седмица')} {w.weekNumber}
                </Badge>

                {w.decisions.map((d, i) => (
                  <p key={i} className="text-sm text-foreground">
                    <span className="font-medium">{d.title}:</span>{' '}
                    <span className="text-foreground/80">{d.chosenOption}</span>
                  </p>
                ))}

                <div className="flex gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-sim-success/10 px-2 py-0.5 text-xs font-medium text-[hsl(var(--sim-success))]">
                    <TrendingUp className="h-3 w-3" />
                    {labels[w.topPositiveKpi as keyof KPIs] || w.topPositiveKpi}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-sim-danger/10 px-2 py-0.5 text-xs font-medium text-[hsl(var(--sim-danger))]">
                    <TrendingDown className="h-3 w-3" />
                    {labels[w.topNegativeKpi as keyof KPIs] || w.topNegativeKpi}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Results */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h4 className="text-base font-semibold text-foreground mb-3">
          📊 {t('Key Results', 'Ключови резултати')}
        </h4>
        <div className="grid gap-2 sm:grid-cols-2">
          {KEY_RESULTS.map(k => {
            const start = startKpis[k];
            const end = finalKpis[k];
            const improved = end > start;
            const declined = end < start;
            return (
              <div key={k} className="flex items-center justify-between rounded-lg border border-border p-3 bg-sim-surface">
                <span className="text-sm font-medium text-foreground">{labels[k]}</span>
                <div className="flex items-center gap-1.5 text-sm font-mono font-medium">
                  <span className="text-muted-foreground">{formatVal(start, k)}</span>
                  {improved ? (
                    <TrendingUp className="h-3.5 w-3.5 text-[hsl(var(--sim-success))]" />
                  ) : declined ? (
                    <TrendingDown className="h-3.5 w-3.5 text-[hsl(var(--sim-danger))]" />
                  ) : (
                    <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span className={improved ? 'text-[hsl(var(--sim-success))]' : declined ? 'text-[hsl(var(--sim-danger))]' : 'text-foreground'}>
                    {formatVal(end, k)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reflection */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h4 className="text-base font-semibold text-foreground">
          ✍️ {t('What I Learned', 'Какво научих')}
        </h4>
        <Textarea
          value={reflection}
          onChange={e => setReflection(e.target.value)}
          placeholder={t(
            'What was your most important strategic decision? What would you do differently?',
            'Кое беше най-важното ви стратегическо решение? Какво бихте направили различно?',
          )}
          className="min-h-[100px] text-sm resize-y"
        />
      </div>

      {/* Copy button */}
      <Button variant="outline" className="w-full" onClick={handleCopy}>
        <Copy className="h-4 w-4 mr-2" />
        {t('Copy My Results', 'Копирай резултатите ми')}
      </Button>
    </div>
  );
}
