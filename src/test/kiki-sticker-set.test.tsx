import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import KikiSticker, { KIKI_STICKERS, type KikiMood } from '@/components/mentor/KikiSticker';

describe('KikiSticker — Kiki AI mentor sticker set', () => {
  it('exposes a sticker for every mood with a resolvable url', () => {
    for (const [mood, def] of Object.entries(KIKI_STICKERS)) {
      expect(def.url, mood).toMatch(/kiki-[a-z-]+\.png$/);
      expect(def.alt.en.length).toBeGreaterThan(0);
      expect(def.alt.bg.length).toBeGreaterThan(0);
    }
  });

  it('renders a localized alt text so meaning never depends on the image alone', () => {
    render(<KikiSticker mood="approved" lang="bg" />);
    expect(screen.getByTestId('kiki-sticker')).toHaveAttribute('data-mood', 'approved');
    expect(screen.getByAltText(KIKI_STICKERS.approved.alt.bg)).toBeInTheDocument();
  });

  it('hides decorative stickers from assistive tech', () => {
    render(<KikiSticker mood="thinking" lang="en" decorative />);
    const img = screen.getByTestId('kiki-sticker');
    expect(img).toHaveAttribute('aria-hidden', 'true');
    expect(img).toHaveAttribute('alt', '');
  });

  it('falls back to the thinking sticker for an unknown mood', () => {
    render(<KikiSticker mood={'nope' as KikiMood} lang="en" />);
    expect(screen.getByAltText(KIKI_STICKERS.thinking.alt.en)).toBeInTheDocument();
  });
});
