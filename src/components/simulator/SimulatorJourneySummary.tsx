import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trophy, Copy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { toast } from 'sonner';
import type { KPIs } from '@/types/simulator';
import { KPI_LABELS, KPI_LABELS_BG, KPI_FORMATS } from '@/types/simulator';

interface WeekSummary {
  weekNumber: number;
  decisionTitle: string;
  chosenOptionLabel: string;
  topPositiveKpi: string;
  topNegativeKpi: string;
}

interface Props {
  weekSummaries: WeekSummary[];
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
    case 'score': return value.toFixed(0);
    default: return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }
}

export default function SimulatorJourneySummary({ weekSummaries, startKpis, finalKpis, lang }: Props) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const labels = lang === 'bg' ? KPI_LABELS_BG : KPI_LABELS;
  const [reflection, setReflection] = useState('');

  const buildPlainText = () => {
    let text = `My Digital Innovation Startup Journey\n${'─'.repeat(40)}\n\n`;
    weekSummaries.forEach(w => {
      text += `Week ${w.weekNumber}: ${w.decisionTitle} → Chose: ${w.chosenOptionLabel}\n`;
    });
    text += `\nFinal Results: Users: ${formatVal(finalKpis.users_total, 'users_total')} | Revenue: ${formatVal(finalKpis.revenue, 'revenue')} | Brand Trust: ${formatVal(finalKpis.brand_trust, 'brand_trust')}\n`;
    if (reflection.trim()) text += `\nReflection:\n${reflection}\n`;
    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildPlainText());
    toast.success(t('Copied to clipboard!', 'Копирано!'));
  };

  return (
    <div className="space-y-5">
      {/* 1. Header */}
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="h-6 w-6 text-xp-gold" />
        <h2 className="text-xl font-display font-bold text-foreground">
          {t('My Startup Journey', 'Моето стартъп пътешествие')}
        </h2>
      </div>

      {/* 2. Week Timeline */}
      <div className="rounded-xl border border-border bg-card p-5">
        {weekSummaries.map((w, i) => (
          <div
            key={w.weekNumber}
            className={`relative pl-8 pb-4 border-l-2 ${i === weekSummaries.length - 1 ? 'border-transparent' : 'border-border'}`}
          >
            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full sim-gradient flex items-center justify-center">
              <span className="text-[9px] font-bold text-white">{w.weekNumber}</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{w.decisionTitle}</p>
            <p className="text-xs text-muted-foreground mb-2">{w.chosenOptionLabel}</p>
            <div className="flex gap-2">
              <span className="text-[10px] bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                ↑ {labels[w.topPositiveKpi as keyof KPIs] || w.topPositiveKpi}
              </span>
              <span className="text-[10px] bg-red-500/10 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full">
                ↓ {labels[w.topNegativeKpi as keyof KPIs] || w.topNegativeKpi}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Key Results Comparison */}
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
              <div key={k} className="flex items-center justify-between rounded-lg border border-border p-3 bg-accent/30">
                <span className="text-sm font-medium text-foreground">{labels[k]}</span>
                <div className="flex items-center gap-1.5 text-sm font-mono font-medium">
                  <span className="text-muted-foreground">{formatVal(start, k)}</span>
                  {improved ? (
                    <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                  ) : declined ? (
                    <TrendingDown className="h-3.5 w-3.5 text-red-600" />
                  ) : (
                    <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span className={improved ? 'text-green-600' : declined ? 'text-red-600' : 'text-foreground'}>
                    {formatVal(end, k)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Reflection */}
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

      {/* 5. Copy button */}
      <Button variant="outline" className="w-full" onClick={handleCopy}>
        <Copy className="h-4 w-4 mr-2" />
        {t('Copy My Results', 'Копирай резултатите ми')}
      </Button>
    </div>
  );
}
