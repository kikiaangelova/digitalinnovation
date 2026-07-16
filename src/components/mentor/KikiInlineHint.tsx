/**
 * KikiInlineHint — display-only mentor prompt block.
 *
 * Shows 1–2 pre-written Kiki mentor questions inline in a lesson/module.
 * No chat, no API call, no AI generation, no usage limits — purely static
 * copy sourced from `module.kikiQuestions`.
 */

import { MessageCircle } from 'lucide-react';

export interface KikiInlineHintProps {
  questions: { en: string; bg: string }[];
  lang: 'bg' | 'en';
  /** How many questions to display. Defaults to 2. */
  max?: number;
  className?: string;
}

export default function KikiInlineHint({
  questions,
  lang,
  max = 2,
  className,
}: KikiInlineHintProps) {
  const picks = (questions ?? []).slice(0, Math.max(1, max));
  if (picks.length === 0) return null;
  const label = lang === 'bg' ? 'Kiki ще те попита' : 'Kiki would ask';

  return (
    <aside
      data-testid="kiki-inline-hint"
      className={
        'rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2 ' +
        (className ?? '')
      }
    >
      <h4 className="text-[11px] uppercase tracking-wide font-semibold text-primary flex items-center gap-1.5">
        <MessageCircle className="h-3 w-3" />
        {label}
      </h4>
      <ul className="space-y-1.5">
        {picks.map((q, i) => (
          <li
            key={i}
            className="text-sm text-foreground/90 leading-relaxed pl-3 border-l-2 border-primary/40"
          >
            {lang === 'bg' ? q.bg : q.en}
          </li>
        ))}
      </ul>
    </aside>
  );
}