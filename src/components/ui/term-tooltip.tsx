import { useMemo } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TERMS, type DictionaryTerm } from '@/data/dictionary-terms';
import { useLang } from '@/context/LangContext';

// Build a lookup map once
const termMap = new Map<string, DictionaryTerm>();
TERMS.forEach(t => {
  termMap.set(t.term.toLowerCase(), t);
  termMap.set(t.termBg.toLowerCase(), t);
});

interface TermTooltipProps {
  /** The term text to look up — matched case-insensitively against EN or BG term names */
  term: string;
  children?: React.ReactNode;
}

/**
 * Wraps a business term in a tooltip that shows its definition.
 * If the term is not found in the dictionary, renders children as-is.
 */
export function TermTooltip({ term, children }: TermTooltipProps) {
  const { lang } = useLang();
  const entry = useMemo(() => termMap.get(term.toLowerCase()), [term]);

  if (!entry) {
    return <>{children ?? term}</>;
  }

  const isBg = lang === 'bg';

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="underline decoration-dotted decoration-primary/40 underline-offset-2 cursor-help">
            {children ?? term}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-left">
          <p className="font-semibold text-sm text-foreground">
            {isBg ? entry.termBg : entry.term}
          </p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {isBg ? entry.definitionBg : entry.definition}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Scans text for known dictionary terms and wraps them in TermTooltip.
 * Use for rendering narrative/theory text with auto-linked terms.
 */
export function AutoTermTooltips({ text }: { text: string }) {
  const parts = useMemo(() => {
    // Sort terms by length (longest first) to avoid partial matches
    const sortedTerms = Array.from(termMap.entries())
      .sort((a, b) => b[0].length - a[0].length);

    // Build regex from all term names
    const escaped = sortedTerms.map(([key]) =>
      key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    if (escaped.length === 0) return [{ text, isTerm: false }];

    const regex = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');
    const result: { text: string; isTerm: boolean }[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        result.push({ text: text.slice(lastIndex, match.index), isTerm: false });
      }
      result.push({ text: match[0], isTerm: true });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      result.push({ text: text.slice(lastIndex), isTerm: false });
    }
    return result;
  }, [text]);

  return (
    <>
      {parts.map((part, i) =>
        part.isTerm ? (
          <TermTooltip key={i} term={part.text}>
            {part.text}
          </TermTooltip>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </>
  );
}
