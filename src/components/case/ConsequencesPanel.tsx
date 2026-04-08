import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { TrendingUp, AlertTriangle, CheckCircle2, Lightbulb, Star } from 'lucide-react';

interface ConsequenceData {
  choice_key: string;
  choice_label: string;
  choice_label_bg?: string | null;
  month_6_summary: {
    cash?: string;
    users?: string;
    status?: string;
    event?: string;
  };
  month_12_summary: {
    cash?: string;
    users?: string;
    profitable?: string;
    margin?: string;
    status?: string;
    event?: string;
  };
  tradeoff_scores: {
    growth?: number;
    safety?: number;
    moat?: number;
    fundability?: number;
  };
  explanation: string;
  explanation_bg?: string | null;
  real_world_link?: string | null;
  real_world_link_bg?: string | null;
}

interface ConsequencesPanelProps {
  consequences: ConsequenceData[];
  chosenStrategy: string | null;
  lang: string;
}

const RISK_COLORS: Record<string, { bg: string; text: string; label: string; labelBg: string }> = {
  high: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'HIGH 🔴', labelBg: 'ВИСОК 🔴' },
  medium: { bg: 'bg-sim-warning/10', text: 'text-sim-warning', label: 'MED 🟡', labelBg: 'СРЕДЕН 🟡' },
  low: { bg: 'bg-sim-success/10', text: 'text-sim-success', label: 'LOW 🟢', labelBg: 'НИСЪК 🟢' },
};

const TRADEOFF_LABELS = [
  { key: 'growth', en: 'Growth Speed', bg: 'Скорост на растеж' },
  { key: 'safety', en: 'Cash Safety', bg: 'Финансова сигурност' },
  { key: 'moat', en: 'Competitive Moat', bg: 'Конкурентен ров' },
  { key: 'fundability', en: 'Fundability', bg: 'Инвестиционна привлекателност' },
];

function StarRating({ score }: { score: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < score ? 'text-sim-warning fill-sim-warning' : 'text-muted-foreground/30'}`}
        />
      ))}
    </span>
  );
}

function getRiskLevel(m12: ConsequenceData['month_12_summary']): string {
  const status = (m12.status || '').toLowerCase();
  if (status.includes('high') || status.includes('висок')) return 'high';
  if (status.includes('med') || status.includes('среден')) return 'medium';
  return 'low';
}

export default function ConsequencesPanel({ consequences, chosenStrategy, lang }: ConsequencesPanelProps) {
  const tl = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const tx = (en: string | null | undefined, bg: string | null | undefined) =>
    lang === 'bg' ? (bg || en || '') : (en || '');

  const sorted = useMemo(() =>
    [...consequences].sort((a, b) => a.choice_key.localeCompare(b.choice_key)),
    [consequences]
  );

  if (sorted.length === 0) return null;

  // Find the real-world insight from first consequence that has one
  const insightSource = sorted.find(c => c.real_world_link || c.real_world_link_bg);
  const insightText = insightSource ? tx(insightSource.real_world_link, insightSource.real_world_link_bg) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sim-warning/10 shrink-0">
          <TrendingUp className="h-5 w-5 text-sim-warning" />
        </div>
        <div>
          <h3 className="font-display font-bold text-foreground text-lg">
            {tl('Decision Consequences', 'Последствия от решенията')}
          </h3>
          <p className="text-xs text-muted-foreground">
            {tl(
              'See what happened 6 and 12 months after each strategy was chosen.',
              'Вижте какво се случи 6 и 12 месеца след всяка стратегия.'
            )}
          </p>
        </div>
      </div>

      {/* Consequence Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {sorted.map((c) => {
          const isChosen = chosenStrategy === c.choice_key;
          const risk = getRiskLevel(c.month_12_summary);
          const riskStyle = RISK_COLORS[risk] || RISK_COLORS.medium;

          return (
            <Card
              key={c.choice_key}
              className={`relative p-5 space-y-4 transition-all ${
                isChosen
                  ? 'ring-2 ring-primary border-primary shadow-lg'
                  : 'border-border'
              }`}
            >
              {isChosen && (
                <Badge className="absolute -top-2.5 left-4 bg-primary text-primary-foreground text-xs">
                  {tl('Your Choice', 'Твоят избор')}
                </Badge>
              )}

              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  {tl('Strategy', 'Стратегия')} {c.choice_key}
                </p>
                <p className="text-sm font-display font-bold text-foreground">
                  {tx(c.choice_label, c.choice_label_bg)}
                </p>
              </div>

              {/* Month 6 */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">
                  {tl('Month 6:', 'Месец 6:')}
                </p>
                {c.month_6_summary.cash && (
                  <p className="text-xs text-foreground">💰 Cash: {c.month_6_summary.cash}</p>
                )}
                {c.month_6_summary.users && (
                  <p className="text-xs text-foreground">👥 Users: {c.month_6_summary.users}</p>
                )}
              </div>

              {/* Month 12 */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">
                  {tl('Month 12:', 'Месец 12:')}
                </p>
                {c.month_12_summary.cash && (
                  <p className="text-xs text-foreground">
                    💰 Cash: {c.month_12_summary.cash}
                    {c.month_12_summary.cash.includes('⚠') ? '' :
                      c.month_12_summary.cash.includes('✅') ? '' : ''}
                  </p>
                )}
                {c.month_12_summary.users && (
                  <p className="text-xs text-foreground">👥 Users: {c.month_12_summary.users}</p>
                )}
                {c.month_12_summary.profitable && (
                  <p className="text-xs text-foreground">📊 {c.month_12_summary.profitable}</p>
                )}
                {c.month_12_summary.margin && (
                  <p className="text-xs text-foreground">📈 Margin: {c.month_12_summary.margin}</p>
                )}
              </div>

              {/* What happened */}
              {c.month_12_summary.event && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">
                    {tl('What happened:', 'Какво се случи:')}
                  </p>
                  <p className="text-xs text-foreground leading-relaxed">{c.month_12_summary.event}</p>
                </div>
              )}

              {/* Risk badge */}
              <div className={`rounded-md px-3 py-1.5 text-center text-xs font-semibold ${riskStyle.bg} ${riskStyle.text}`}>
                {tl('Risk:', 'Риск:')} {lang === 'bg' ? riskStyle.labelBg : riskStyle.label}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Trade-off Summary Table */}
      {sorted.some(c => Object.keys(c.tradeoff_scores).length > 0) && (
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 font-semibold text-muted-foreground" />
                {TRADEOFF_LABELS.map((t) => (
                  <th key={t.key} className="text-center p-3 font-semibold text-muted-foreground">
                    {lang === 'bg' ? t.bg : t.en}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <tr
                  key={c.choice_key}
                  className={`border-b border-border/50 last:border-0 ${
                    chosenStrategy === c.choice_key ? 'bg-primary/5' : ''
                  }`}
                >
                  <td className="p-3 font-semibold text-foreground">
                    {tl('Strategy', 'Стратегия')} {c.choice_key}
                    {chosenStrategy === c.choice_key && (
                      <CheckCircle2 className="inline h-3.5 w-3.5 ml-1.5 text-primary" />
                    )}
                  </td>
                  {TRADEOFF_LABELS.map((t) => (
                    <td key={t.key} className="p-3 text-center">
                      <StarRating score={c.tradeoff_scores[t.key as keyof typeof c.tradeoff_scores] || 0} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Real-world insight */}
      {insightText && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground leading-relaxed">{insightText}</p>
        </div>
      )}
    </div>
  );
}
