import { useState } from 'react';
import { Target, Zap, PenLine, ArrowUpRight, CheckCircle2 } from 'lucide-react';

/**
 * TEACR loop scaffold — Decision → Consequence → Reflection → Improvement.
 *
 * Drop-in block for any module, stage, or case that wants to close the
 * "apply → learn from outcome → iterate" loop the 2026–27 audit flagged as
 * the platform's biggest gap.
 *
 * Purely presentational: parent owns persistence, XP awards, and validation.
 */

export interface DecisionOption {
  id: string;
  labelEn: string;
  labelBg: string;
  /** Short outcome shown after the learner picks this option. */
  consequenceEn: string;
  consequenceBg: string;
  /** Optional signal for visual tone. */
  outcome?: 'positive' | 'neutral' | 'negative';
}

export interface TEACRProps {
  lang: 'en' | 'bg';
  promptEn: string;
  promptBg: string;
  options: DecisionOption[];
  /** Called when the learner submits reflection + improvement. */
  onComplete?: (payload: {
    decisionId: string;
    reflection: string;
    improvement: string;
  }) => void;
  disabled?: boolean;
}

const t = (lang: 'en' | 'bg', en: string, bg: string) => (lang === 'bg' ? bg : en);

export function DecisionConsequenceReflection({
  lang,
  promptEn,
  promptBg,
  options,
  onComplete,
  disabled,
}: TEACRProps) {
  const [decisionId, setDecisionId] = useState<string | null>(null);
  const [reflection, setReflection] = useState('');
  const [improvement, setImprovement] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const chosen = options.find(o => o.id === decisionId) ?? null;
  const canSubmit =
    !!chosen && reflection.trim().length >= 20 && improvement.trim().length >= 10;

  const submit = () => {
    if (!canSubmit || !chosen) return;
    setSubmitted(true);
    onComplete?.({ decisionId: chosen.id, reflection, improvement });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
      {/* Decision */}
      <section className="space-y-2">
        <header className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            {t(lang, '1. Decide', '1. Реши')}
          </h3>
        </header>
        <p className="text-sm text-muted-foreground">{t(lang, promptEn, promptBg)}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {options.map(o => {
            const selected = decisionId === o.id;
            return (
              <button
                key={o.id}
                type="button"
                disabled={disabled || submitted}
                onClick={() => setDecisionId(o.id)}
                className={`text-left rounded-xl border p-3 min-h-[44px] transition-all ${
                  selected
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                <span className="text-sm font-medium text-foreground">
                  {t(lang, o.labelEn, o.labelBg)}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Consequence */}
      {chosen && (
        <section className="space-y-2">
          <header className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              {t(lang, '2. See the consequence', '2. Виж последствието')}
            </h3>
          </header>
          <div
            className={`rounded-xl p-3 text-sm ${
              chosen.outcome === 'positive'
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                : chosen.outcome === 'negative'
                  ? 'bg-red-500/10 text-red-700 dark:text-red-300'
                  : 'bg-accent text-foreground'
            }`}
          >
            {t(lang, chosen.consequenceEn, chosen.consequenceBg)}
          </div>
        </section>
      )}

      {/* Reflection */}
      {chosen && (
        <section className="space-y-2">
          <header className="flex items-center gap-2">
            <PenLine className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              {t(lang, '3. Reflect', '3. Рефлектирай')}
            </h3>
          </header>
          <textarea
            className="w-full min-h-[80px] rounded-lg border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
            placeholder={t(
              lang,
              'Why did you pick this? What surprised you about the outcome?',
              'Защо избра това? Какво те изненада в резултата?',
            )}
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            disabled={disabled || submitted}
          />
        </section>
      )}

      {/* Improvement */}
      {chosen && (
        <section className="space-y-2">
          <header className="flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              {t(lang, '4. Improve', '4. Подобри')}
            </h3>
          </header>
          <textarea
            className="w-full min-h-[60px] rounded-lg border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
            placeholder={t(
              lang,
              'One concrete thing you would do differently next time.',
              'Едно конкретно нещо, което ще направиш различно следващия път.',
            )}
            value={improvement}
            onChange={e => setImprovement(e.target.value)}
            disabled={disabled || submitted}
          />
        </section>
      )}

      {chosen && (
        <div className="flex items-center justify-end gap-3 pt-1">
          {submitted && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t(lang, 'Loop closed', 'Цикълът е затворен')}
            </span>
          )}
          <button
            type="button"
            disabled={!canSubmit || submitted || disabled}
            onClick={submit}
            className="min-h-[44px] px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition"
          >
            {submitted
              ? t(lang, 'Saved', 'Записано')
              : t(lang, 'Complete the loop', 'Затвори цикъла')}
          </button>
        </div>
      )}
    </div>
  );
}

export default DecisionConsequenceReflection;