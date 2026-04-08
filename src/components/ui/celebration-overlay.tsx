import { useEffect, useState, useCallback } from 'react';
import { Zap, X, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';

interface CelebrationData {
  xp: number;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCta?: () => void;
}

type Listener = (data: CelebrationData) => void;
const listeners: Listener[] = [];

export function fireCelebration(data: CelebrationData) {
  listeners.forEach(fn => fn(data));
}

function launchConfetti() {
  const end = Date.now() + 2200;
  const colors = ['#6C5CE7', '#818CF8', '#F97316', '#FBBF24', '#22C55E'];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export function CelebrationOverlay() {
  const [data, setData] = useState<CelebrationData | null>(null);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  const show = useCallback((d: CelebrationData) => {
    setData(d);
    setVisible(true);
    setExiting(false);
    setTimeout(() => launchConfetti(), 200);
  }, []);

  useEffect(() => {
    listeners.push(show);
    return () => {
      const idx = listeners.indexOf(show);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, [show]);

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      setExiting(false);
      setData(null);
    }, 350);
  }, []);

  const handleCta = useCallback(() => {
    data?.onCta?.();
    dismiss();
  }, [data, dismiss]);

  if (!visible || !data) return null;

  return (
    <div
      className={`fixed inset-0 z-[300] flex items-center justify-center p-4
        ${exiting ? 'animate-fade-out' : 'animate-fade-in'}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Card */}
      <div
        className={`relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl
          ${exiting ? 'animate-scale-out' : 'animate-scale-in'}`}
      >
        {/* Gradient header */}
        <div className="sim-gradient px-6 pt-10 pb-8 text-center relative">
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 text-primary-foreground/60 hover:text-primary-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Sparkle ring */}
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/10 animate-level-pop">
            <Zap className="h-10 w-10 text-primary-foreground drop-shadow-lg" />
          </div>

          <h2 className="text-2xl font-display font-bold text-primary-foreground mb-1">
            {data.title}
          </h2>
          {data.subtitle && (
            <p className="text-sm text-primary-foreground/80">{data.subtitle}</p>
          )}
        </div>

        {/* XP badge + CTA */}
        <div className="bg-card px-6 py-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-xp-gold/15 px-5 py-2.5 mx-auto">
            <Zap className="h-5 w-5 text-xp-gold" />
            <span className="text-lg font-bold text-xp-gold">+{data.xp} XP</span>
          </div>

          {data.ctaLabel && data.onCta ? (
            <Button
              size="lg"
              className="w-full sim-gradient border-0 text-base font-semibold"
              onClick={handleCta}
            >
              {data.ctaLabel} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={dismiss}
            >
              ✓
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
