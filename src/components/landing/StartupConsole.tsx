import { useEffect, useState } from "react";
import { Rocket, Zap, Trophy, ChevronRight, Sparkles, Target, TrendingUp } from "lucide-react";

/**
 * Animated hero widget: shows the Idea → Case → Decision → XP → Rank loop.
 * CSS/JS only. Respects prefers-reduced-motion (loop pauses).
 */
export default function StartupConsole({ lang }: { lang: "en" | "bg" }) {
  const [step, setStep] = useState(0);
  const total = 4;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(() => setStep((s) => (s + 1) % total), 2600);
    return () => clearInterval(id);
  }, []);

  const T = {
    en: {
      case: "CASE · FINTECH",
      title: "Should the founders pivot to B2B?",
      option1: "Pivot to B2B",
      option2: "Stay B2C",
      option3: "Run 4-week test",
      xpEarned: "+120 XP",
      level: "LEVEL 4 · STRATEGIST",
      rank: "You climbed to rank 12",
      liveNow: "LIVE MISSION",
      hint: "Solve real cases → earn XP → level up",
    },
    bg: {
      case: "КЕЙС · ФИНТЕХ",
      title: "Трябва ли основателите да преминат към B2B?",
      option1: "Премини към B2B",
      option2: "Остани B2C",
      option3: "4-седмичен тест",
      xpEarned: "+120 XP",
      level: "НИВО 4 · СТРАТЕГ",
      rank: "Изкачи се до 12-о място",
      liveNow: "АКТИВНА МИСИЯ",
      hint: "Реши реални кейси → печели XP → издигай нива",
    },
  }[lang];

  return (
    <div className="relative">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute -inset-8 rounded-[2rem] blur-3xl opacity-60 pointer-events-none"
        style={{ background: "radial-gradient(60% 60% at 50% 40%, hsl(var(--mint) / 0.35), transparent 70%)" }}
      />

      {/* Floating XP sticker (top-right) */}
      <div
        className={`absolute -top-4 -right-3 md:-right-6 z-20 select-none transition-all duration-500 ${
          step >= 2 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-90"
        }`}
      >
        <div className="flex items-center gap-1.5 rounded-full bg-xp-gradient text-white font-mono font-bold text-sm px-3 py-1.5 shadow-[0_8px_24px_-8px_hsl(43_96%_56%/0.6)]">
          <Zap className="h-3.5 w-3.5" />
          {T.xpEarned}
        </div>
      </div>

      {/* Floating rank chip (bottom-left) */}
      <div
        className={`absolute -bottom-4 -left-3 md:-left-6 z-20 transition-all duration-500 delay-100 ${
          step >= 3 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-90"
        }`}
      >
        <div className="flex items-center gap-2 rounded-full bg-white text-ink shadow-lift border border-mint/40 px-3 py-1.5">
          <Trophy className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold">{T.rank}</span>
        </div>
      </div>

      {/* Main console card */}
      <div className="relative bg-ink-gradient rounded-[1.75rem] p-5 md:p-6 shadow-lift border border-ink-3 overflow-hidden">
        {/* Grid paper background */}
        <div aria-hidden className="absolute inset-0 bg-grid-ink opacity-40 pointer-events-none" />
        {/* Corner glow */}
        <div
          aria-hidden
          className="absolute -top-16 -right-16 h-48 w-48 rounded-full blur-3xl pointer-events-none"
          style={{ background: "hsl(var(--mint) / 0.25)" }}
        />

        <div className="relative">
          {/* Console header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-mint opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
              </div>
              <span className="typo-eyebrow text-mint">{T.liveNow}</span>
            </div>
            <span className="font-mono text-[10px] text-ink-dim">DIL://startup-lab</span>
          </div>

          {/* Mission card */}
          <div className="rounded-2xl bg-ink-2/80 backdrop-blur border border-ink-3 p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-gradient shadow-[var(--glow-emerald)]">
                <Target className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-mint">
                {T.case}
              </span>
            </div>
            <p className="text-ink-fg font-display font-semibold text-[15px] leading-snug mb-3">
              {T.title}
            </p>

            {/* Decision buttons */}
            <div className="space-y-1.5">
              {[T.option1, T.option2, T.option3].map((opt, i) => {
                const active = step === 1 && i === 0;
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs transition-all duration-500 ${
                      active
                        ? "bg-primary-gradient border-mint text-white shadow-[0_0_20px_-4px_hsl(var(--mint)/0.6)] scale-[1.02]"
                        : "bg-ink-3/50 border-ink-3 text-ink-dim"
                    }`}
                  >
                    <span className="font-medium">{opt}</span>
                    <ChevronRight className={`h-3.5 w-3.5 ${active ? "text-white" : "text-ink-dim/60"}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* XP bar + level */}
          <div className="rounded-2xl bg-ink-2/80 backdrop-blur border border-ink-3 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-mint" />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-mint">
                  {T.level}
                </span>
              </div>
              <span className="font-mono text-[11px] font-bold text-ink-fg">
                <span className="text-primary">
                  {step >= 2 ? "1,240" : "1,120"}
                </span>{" "}
                / 1,500 XP
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-ink-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-[1200ms] ease-out relative overflow-hidden"
                style={{
                  width: step >= 2 ? "82%" : "62%",
                  background: "var(--gradient-xp)",
                }}
              >
                <div
                  aria-hidden
                  className="absolute inset-y-0 -inset-x-4"
                  style={{
                    background: "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.5), transparent)",
                    animation: "sheen 2s ease-in-out infinite",
                    width: "40%",
                  }}
                />
              </div>
            </div>

            {/* Step dots */}
            <div className="mt-3 flex items-center gap-1.5">
              {Array.from({ length: total }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === step ? "w-6 bg-mint" : "w-2 bg-ink-3"
                  }`}
                />
              ))}
              <span className="ml-auto flex items-center gap-1 font-mono text-[10px] text-ink-dim">
                <TrendingUp className="h-3 w-3 text-mint" />
                {T.hint}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Orbit sticker: Rocket (decorative) */}
      <div
        aria-hidden
        className="absolute -top-6 -left-4 md:-left-8 z-0 opacity-90 hidden md:block"
      >
        <div className="animate-float">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lift border border-border rotate-[-8deg]">
            <Rocket className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}