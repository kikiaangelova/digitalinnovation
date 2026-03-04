import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Bot, Sparkles, Target, Zap, DollarSign, Lightbulb, Loader2, AlertCircle } from 'lucide-react';
import type { BMCData } from './BusinessModelCanvas';

interface BMCFeedback {
  overall_score: number;
  market_clarity: number;
  value_strength: number;
  revenue_feasibility: number;
  innovation_potential: number;
  overall_assessment: string;
  block_feedback: Record<string, string>;
  suggestions: string[];
}

interface Props {
  data: BMCData;
  lang: 'en' | 'bg';
}

const SCORE_CATEGORIES = [
  { key: 'market_clarity', icon: Target, en: 'Market Clarity', bg: 'Яснота на пазара' },
  { key: 'value_strength', icon: Zap, en: 'Value Proposition', bg: 'Стойностно предложение' },
  { key: 'revenue_feasibility', icon: DollarSign, en: 'Revenue Feasibility', bg: 'Реалистичност на приходите' },
  { key: 'innovation_potential', icon: Lightbulb, en: 'Innovation Potential', bg: 'Иновационен потенциал' },
];

export default function AIMentorPanel({ data, lang }: Props) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const [feedback, setFeedback] = useState<BMCFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filledCount = Object.values(data).filter(v => (v || '').trim().length > 10).length;

  const requestFeedback = async () => {
    if (filledCount < 3) {
      toast.warning(t(
        'Please fill in at least 3 canvas blocks before requesting feedback.',
        'Моля, попълнете поне 3 блока от канваса, преди да поискате обратна връзка.'
      ));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data: result, error: fnError } = await supabase.functions.invoke('bmc-mentor', {
        body: { bmc: data, lang },
      });

      if (fnError) throw fnError;
      if (result?.error) throw new Error(result.error);
      setFeedback(result as BMCFeedback);
    } catch (e: any) {
      const msg = e?.message || 'Failed to get AI feedback';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number, max: number) => {
    const pct = (score / max) * 100;
    if (pct >= 70) return 'text-[hsl(var(--sim-success))]';
    if (pct >= 40) return 'text-[hsl(var(--sim-warning))]';
    return 'text-destructive';
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-foreground">
            {t('AI Startup Mentor', 'AI Стартъп Ментор')}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t('Get intelligent feedback on your Business Model Canvas', 'Получете интелигентна обратна връзка за вашия Business Model Canvas')}
          </p>
        </div>
        <Button
          onClick={requestFeedback}
          disabled={loading || filledCount < 3}
          size="sm"
          className="gap-1.5"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? t('Analyzing...', 'Анализиране...') : t('Get Feedback', 'Поискай обратна връзка')}
        </Button>
      </div>

      {filledCount < 3 && !feedback && (
        <p className="text-xs text-muted-foreground bg-accent/50 rounded-lg p-3">
          {t(
            `Fill in at least 3 blocks to unlock AI feedback. Currently ${filledCount}/9 filled.`,
            `Попълнете поне 3 блока, за да отключите AI обратна връзка. Попълнени: ${filledCount}/9.`
          )}
        </p>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Feedback results */}
      {feedback && (
        <div className="space-y-5">
          {/* Innovation Score */}
          <div className="text-center p-4 rounded-lg bg-accent/30 border border-border">
            <p className="text-xs text-muted-foreground mb-1">
              {t('Innovation Score', 'Иновационен резултат')}
            </p>
            <p className={`text-4xl font-bold ${scoreColor(feedback.overall_score, 100)}`}>
              {feedback.overall_score} <span className="text-lg text-muted-foreground font-normal">/ 100</span>
            </p>
          </div>

          {/* Score breakdown */}
          <div className="grid grid-cols-2 gap-3">
            {SCORE_CATEGORIES.map(cat => {
              const score = (feedback as any)[cat.key] as number;
              const Icon = cat.icon;
              return (
                <div key={cat.key} className="rounded-lg border border-border p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium text-foreground">{t(cat.en, cat.bg)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={(score / 25) * 100} className="h-1.5 flex-1" />
                    <span className={`text-xs font-bold ${scoreColor(score, 25)}`}>{score}/25</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Overall assessment */}
          <div className="rounded-lg bg-accent/50 border border-border p-4">
            <p className="text-xs font-semibold text-foreground mb-1">
              {t('Assessment', 'Оценка')}
            </p>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {feedback.overall_assessment}
            </p>
          </div>

          {/* Suggestions */}
          {feedback.suggestions?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-primary" />
                {t('Improvement Suggestions', 'Предложения за подобрение')}
              </p>
              <ul className="space-y-1.5">
                {feedback.suggestions.map((s, i) => (
                  <li key={i} className="text-sm text-foreground/80 flex items-start gap-2 bg-accent/30 rounded-lg px-3 py-2">
                    <span className="text-primary font-bold text-xs mt-0.5">{i + 1}.</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Separator />

          {/* Per-block feedback */}
          {Object.entries(feedback.block_feedback || {}).some(([, v]) => v) && (
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">
                {t('Block-by-Block Feedback', 'Обратна връзка по блокове')}
              </p>
              <div className="space-y-2">
                {Object.entries(feedback.block_feedback).map(([key, val]) => {
                  if (!val) return null;
                  const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                  return (
                    <div key={key} className="rounded-lg border border-border p-3">
                      <p className="text-xs font-semibold text-primary mb-1">{label}</p>
                      <p className="text-xs text-foreground/80 leading-relaxed">{val}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
