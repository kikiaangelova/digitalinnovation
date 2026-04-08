import { useEffect, useState, useCallback, useRef } from 'react';
import { Zap, X, ArrowRight, Sparkles } from 'lucide-react';
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
  const colors = ['#6C5CE7', '#818CF8', '#F97316', '#FBBF24', '#22C55E', '#A78BFA'];

  // Initial big burst from center
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { x: 0.5, y: 0.45 },
    colors,
    startVelocity: 35,
    gravity: 0.8,
    ticks: 120,
    scalar: 1.1,
  });

  // Staggered side cannons
  setTimeout(() => {
    confetti({ particleCount: 40, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, colors, startVelocity: 45 });
    confetti({ particleCount: 40, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors, startVelocity: 45 });
  }, 300);

  // Second wave — slower, floatier
  setTimeout(() => {
    confetti({ particleCount: 30, angle: 80, spread: 80, origin: { x: 0.25, y: 0.5 }, colors, startVelocity: 20, gravity: 0.5, scalar: 1.3, ticks: 180 });
    confetti({ particleCount: 30, angle: 100, spread: 80, origin: { x: 0.75, y: 0.5 }, colors, startVelocity: 20, gravity: 0.5, scalar: 1.3, ticks: 180 });
  }, 800);

  // Final sparkle shower
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 160,
      origin: { x: 0.5, y: 0.3 },
      colors,
      startVelocity: 15,
      gravity: 0.4,
      ticks: 200,
      scalar: 0.8,
      shapes: ['circle'],
    });
  }, 1400);
}

export function CelebrationOverlay() {
  const [data, setData] = useState<CelebrationData | null>(null);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [phase, setPhase] = useState<'enter' | 'xp' | 'ready'>('enter');
  const xpRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  const show = useCallback((d: CelebrationData) => {
    setData(d);
    setVisible(true);
    setExiting(false);
    setPhase('enter');

    // Stagger: confetti → XP counter → ready
    setTimeout(() => launchConfetti(), 250);
    setTimeout(() => setPhase('xp'), 600);
    setTimeout(() => setPhase('ready'), 1800);
  }, []);

  // Animate XP count-up
  useEffect(() => {
    if (phase !== 'xp' || !data || !countRef.current) return;
    const target = data.xp;
    const duration = 900;
    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      if (countRef.current) {
        countRef.current.textContent = `+${Math.round(eased * target)}`;
      }
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, data]);

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
      setPhase('enter');
    }, 400);
  }, []);

  const handleCta = useCallback(() => {
    data?.onCta?.();
    dismiss();
  }, [data, dismiss]);

  if (!visible || !data) return null;

  return (
    <div
      className={`fixed inset-0 z-[300] flex items-center justify-center p-4
        ${exiting ? 'celebration-exit' : 'celebration-enter'}`}
    >
      {/* Backdrop with dramatic blur */}
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-md"
        onClick={dismiss}
      />

      {/* Radial glow behind card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full celebration-glow" />
      </div>

      {/* Card */}
      <div
        className={`relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl
          ${exiting ? 'celebration-card-exit' : 'celebration-card-enter'}`}
        style={{ boxShadow: '0 0 60px hsl(255 74% 64% / 0.35), 0 25px 50px -12px rgba(0,0,0,0.25)' }}
      >
        {/* Gradient header with particle shimmer */}
        <div className="relative px-6 pt-12 pb-10 text-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, hsl(255 74% 58%), hsl(220 70% 48%), hsl(255 74% 64%))' }}
        >
          {/* Animated shimmer stripe */}
          <div className="absolute inset-0 celebration-shimmer" />

          {/* Floating sparkles */}
          <Sparkles className="absolute top-4 left-6 h-4 w-4 text-primary-foreground/30 celebration-float-1" />
          <Sparkles className="absolute top-8 right-8 h-3 w-3 text-primary-foreground/20 celebration-float-2" />
          <Sparkles className="absolute bottom-6 left-10 h-3.5 w-3.5 text-primary-foreground/25 celebration-float-3" />

          <button
            onClick={dismiss}
            className="absolute top-3 right-3 text-primary-foreground/40 hover:text-primary-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Icon with pulse ring */}
          <div className="mx-auto mb-5 relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-white/10 celebration-pulse-ring" />
            <div className="absolute inset-2 rounded-full bg-white/15 celebration-pulse-ring-delay" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/25 celebration-icon-pop">
              <Zap className="h-9 w-9 text-primary-foreground drop-shadow-lg" />
            </div>
          </div>

          <h2 className="text-2xl font-display font-bold text-primary-foreground mb-1.5 celebration-title-reveal">
            {data.title}
          </h2>
          {data.subtitle && (
            <p className="text-sm text-primary-foreground/75 celebration-subtitle-reveal">{data.subtitle}</p>
          )}
        </div>

        {/* XP section with count-up */}
        <div className="bg-card px-6 py-7 text-center space-y-5">
          <div
            ref={xpRef}
            className={`inline-flex items-center gap-2.5 rounded-full px-6 py-3 mx-auto transition-all duration-500
              ${phase === 'enter' ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}
              ${phase === 'xp' ? 'celebration-xp-glow' : ''}`}
            style={{ background: 'linear-gradient(135deg, hsl(38 92% 50% / 0.15), hsl(28 90% 45% / 0.1))' }}
          >
            <Zap className={`h-6 w-6 text-xp-gold transition-transform duration-300 ${phase !== 'enter' ? 'celebration-zap-spin' : ''}`} />
            <span className="text-xl font-bold text-xp-gold tracking-tight">
              <span ref={countRef}>+0</span> XP
            </span>
          </div>

          <div className={`transition-all duration-500 delay-200 ${phase === 'ready' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            {data.ctaLabel && data.onCta ? (
              <Button
                size="lg"
                className="w-full sim-gradient border-0 text-base font-semibold glow-primary"
                onClick={handleCta}
              >
                {data.ctaLabel} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                className="w-full text-base"
                onClick={dismiss}
              >
                ✓
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
