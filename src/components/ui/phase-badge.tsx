import { Badge } from '@/components/ui/badge';

type Phase = 'learn' | 'apply' | 'fun';

const PHASE_CONFIG: Record<Phase, { en: string; bg: string; className: string }> = {
  learn: { en: '📖 LEARN', bg: '📖 УЧИ', className: 'bg-blue-500/15 text-blue-600 border-blue-500/30' },
  apply: { en: '⚡ APPLY', bg: '⚡ ПРИЛОЖИ', className: 'bg-green-500/15 text-green-600 border-green-500/30' },
  fun: { en: '🎮 HAVE FUN', bg: '🎮 ЗАБАВЛЯВАЙ СЕ', className: 'bg-orange-500/15 text-orange-600 border-orange-500/30' },
};

interface PhaseBadgeProps {
  phase: Phase;
  lang: 'en' | 'bg';
  className?: string;
}

export default function PhaseBadge({ phase, lang, className = '' }: PhaseBadgeProps) {
  const cfg = PHASE_CONFIG[phase];
  return (
    <Badge className={`text-[10px] font-bold uppercase tracking-wider border ${cfg.className} ${className}`}>
      {lang === 'bg' ? cfg.bg : cfg.en}
    </Badge>
  );
}
