/**
 * KikiSticker — display-only Kiki AI mentor sticker.
 *
 * A small set of hand-illustrated Kiki stickers used as a visual reaction
 * next to mentor copy (greeting, thinking, approval, reminder, etc.).
 * Purely presentational: no chat, no AI call, no logic.
 *
 * Accessibility: the sticker never carries meaning on its own — every place
 * that uses it also states the same message in text. Decorative usage passes
 * `decorative` so screen readers skip it.
 */

import approved from '@/assets/kiki/kiki-approved.png.asset.json';
import confused from '@/assets/kiki/kiki-confused.png.asset.json';
import cool from '@/assets/kiki/kiki-cool.png.asset.json';
import goodMorning from '@/assets/kiki/kiki-good-morning.png.asset.json';
import goodNight from '@/assets/kiki/kiki-good-night.png.asset.json';
import heyYou from '@/assets/kiki/kiki-hey-you.png.asset.json';
import huh from '@/assets/kiki/kiki-huh.png.asset.json';
import nice from '@/assets/kiki/kiki-nice.png.asset.json';
import reminder from '@/assets/kiki/kiki-reminder.png.asset.json';
import sleepy from '@/assets/kiki/kiki-sleepy.png.asset.json';
import tooCute from '@/assets/kiki/kiki-too-cute.png.asset.json';
import what from '@/assets/kiki/kiki-what.png.asset.json';
import wow from '@/assets/kiki/kiki-wow.png.asset.json';

export type KikiMood =
  | 'greeting'
  | 'hello'
  | 'thinking'
  | 'unclear'
  | 'surprised'
  | 'impressed'
  | 'approved'
  | 'nice'
  | 'reminder'
  | 'paused'
  | 'goodnight'
  | 'confident'
  | 'warm';

interface StickerDef {
  url: string;
  alt: { en: string; bg: string };
}

export const KIKI_STICKERS: Record<KikiMood, StickerDef> = {
  greeting: { url: goodMorning.url, alt: { en: 'Kiki says good morning', bg: 'Kiki казва добро утро' } },
  hello: { url: heyYou.url, alt: { en: 'Kiki says hello', bg: 'Kiki те поздравява' } },
  thinking: { url: huh.url, alt: { en: 'Kiki is thinking', bg: 'Kiki мисли' } },
  unclear: { url: confused.url, alt: { en: 'Kiki is not sure yet', bg: 'Kiki още не е сигурна' } },
  surprised: { url: what.url, alt: { en: 'Kiki is surprised', bg: 'Kiki е изненадана' } },
  impressed: { url: wow.url, alt: { en: 'Kiki is impressed', bg: 'Kiki е впечатлена' } },
  approved: { url: approved.url, alt: { en: 'Kiki approves your work', bg: 'Kiki одобрява работата ти' } },
  nice: { url: nice.url, alt: { en: 'Kiki likes your answer', bg: 'Kiki харесва отговора ти' } },
  reminder: { url: reminder.url, alt: { en: 'Kiki has a reminder', bg: 'Kiki има напомняне' } },
  paused: { url: sleepy.url, alt: { en: 'Kiki is waiting for you', bg: 'Kiki те чака' } },
  goodnight: { url: goodNight.url, alt: { en: 'Kiki says good night', bg: 'Kiki казва лека нощ' } },
  confident: { url: cool.url, alt: { en: 'Kiki is confident', bg: 'Kiki е спокойна и уверена' } },
  warm: { url: tooCute.url, alt: { en: 'Kiki sends support', bg: 'Kiki ти изпраща подкрепа' } },
};

export interface KikiStickerProps {
  mood: KikiMood;
  lang: 'en' | 'bg';
  /** Rendered pixel size. Defaults to 64. */
  size?: number;
  /** When true, the sticker is hidden from assistive tech. */
  decorative?: boolean;
  className?: string;
}

export default function KikiSticker({
  mood,
  lang,
  size = 64,
  decorative = false,
  className,
}: KikiStickerProps) {
  const sticker = KIKI_STICKERS[mood] ?? KIKI_STICKERS.thinking;

  return (
    <img
      data-testid="kiki-sticker"
      data-mood={mood}
      src={sticker.url}
      alt={decorative ? '' : lang === 'bg' ? sticker.alt.bg : sticker.alt.en}
      aria-hidden={decorative || undefined}
      width={size}
      height={size}
      loading="lazy"
      className={'shrink-0 select-none object-contain ' + (className ?? '')}
      style={{ width: size, height: size }}
    />
  );
}
