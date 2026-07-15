import kikiAvatar from '@/assets/kiki-avatar.png';
import { KIKI } from '@/lib/kiki-persona';

interface Props {
  lang: 'en' | 'bg';
  compact?: boolean;
}

/**
 * Small identity card for Kiki — the platform's AI mentor persona
 * (channeling Kirilka Angelova). Use above chat/feedback surfaces.
 */
export default function KikiBioCard({ lang, compact = false }: Props) {
  const t = (en: string, bg: string) => (lang === 'bg' ? bg : en);
  return (
    <div className={`flex items-center gap-3 rounded-2xl border-2 border-foreground bg-card p-3 ${compact ? '' : 'quest-shadow'}`}>
      <img
        src={kikiAvatar}
        alt={t('Kiki, your AI mentor', 'Kiki, твоят AI ментор')}
        width={compact ? 44 : 64}
        height={compact ? 44 : 64}
        loading="lazy"
        className="rounded-xl border-2 border-foreground bg-cream shrink-0"
      />
      <div className="min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-display font-bold text-base leading-tight">{KIKI.name}</span>
          <span className="text-xs text-muted-foreground">
            {t(KIKI.roleEn, KIKI.roleBg)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-snug mt-0.5">
          {t(KIKI.taglineEn, KIKI.taglineBg)}
        </p>
      </div>
    </div>
  );
}
