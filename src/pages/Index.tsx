import { forwardRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/layout/AppHeader";
import StartupConsole from "@/components/landing/StartupConsole";
import { Reveal, CountUp } from "@/components/landing/Reveal";
import InnovationShowcase from "@/components/landing/InnovationShowcase";
import heroBg from "@/assets/hero-bg.mp4.asset.json";
import { PATHWAYS, TRACK_LABELS, type PathwayTrack } from "@/data/curriculum-2026";
import {
  GraduationCap,
  ArrowRight,
  Lightbulb,
  Search,
  Rocket,
  Presentation,
  Compass,
  Briefcase,
  Palette,
  Trophy,
  BookOpen,
  FlaskConical,
  TrendingUp,
  Mic,
  Zap,
  Calendar,
  Book,
  Cpu,
  Play,
  Brain,
  Award,
  Sparkles,
  Target,
  ChevronRight,
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const testimonials = [
    { quote: t.testimonial1, name: lang === "bg" ? "Ива М., 17" : "Iva M., 17" },
    { quote: t.testimonial2, name: lang === "bg" ? "Виктор С., 16" : "Viktor S., 16" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setTestimonialIdx((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handleNav = (path: string) => {
    if (user) navigate(path);
    else navigate(`/auth?redirect=${encodeURIComponent(path)}`);
  };

  const learnCards = [
    { icon: Lightbulb, title: t.learnDigitalInnovation, desc: t.learnDigitalInnovationDesc },
    { icon: Rocket, title: t.learnStartupThinking, desc: t.learnStartupThinkingDesc },
    { icon: Briefcase, title: t.learnBusinessModels, desc: t.learnBusinessModelsDesc },
    { icon: Palette, title: t.learnProductDesign, desc: t.learnProductDesignDesc },
    { icon: TrendingUp, title: t.learnGrowthStrategy, desc: t.learnGrowthStrategyDesc },
  ];

  const buildSteps = [
    { icon: Search, title: t.buildIdentifyProblem, step: 1 },
    { icon: Lightbulb, title: t.buildCreateIdea, step: 2 },
    { icon: Briefcase, title: t.buildBusinessModel, step: 3 },
    { icon: Presentation, title: t.buildPitchStartup, step: 4 },
  ];

  const journeyStages = [
    { icon: Compass, title: t.journeyExplore, desc: t.journeyExploreDesc },
    { icon: BookOpen, title: t.journeyAnalyze, desc: t.journeyAnalyzeDesc },
    { icon: Rocket, title: t.journeyBuild, desc: t.journeyBuildDesc },
    { icon: Palette, title: t.journeyDesign, desc: t.journeyDesignDesc },
    { icon: FlaskConical, title: t.journeyTest, desc: t.journeyTestDesc },
    { icon: Presentation, title: t.journeyPitch, desc: t.journeyPitchDesc },
  ];

  const courseWeeks = [
    { week: 1, title: t.courseWeek1, icon: Lightbulb, desc: t.courseWeek1Desc },
    { week: 2, title: t.courseWeek2, icon: Search, desc: t.courseWeek2Desc },
    { week: 3, title: t.courseWeek3, icon: Briefcase, desc: t.courseWeek3Desc },
    { week: 4, title: t.courseWeek4, icon: Palette, desc: t.courseWeek4Desc },
    { week: 5, title: t.courseWeek5, icon: TrendingUp, desc: t.courseWeek5Desc },
    { week: 6, title: t.courseWeek6, icon: Mic, desc: t.courseWeek6Desc },
  ];

  const stats = [
    { value: 6, suffix: "", label: t.statWeeks, icon: Calendar },
    { value: 10, suffix: "", label: t.statIndustries, icon: Cpu },
    { value: 5, suffix: "", label: t.statLevels, icon: Trophy },
    { value: 0, suffix: "∞", label: t.statIdeas, icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main>
        {/* ══════════ HERO — Playful Quest ══════════ */}
        <section className="relative overflow-hidden bg-[#FFF7E6]">
          {/* dotted paper backdrop */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(#0a0a0a 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          {/* floating stickers */}
          <div aria-hidden className="absolute top-10 right-6 h-14 w-14 rounded-2xl bg-[#FFD600] border-4 border-black quest-shadow-sm rotate-[8deg] hidden md:block" />
          <div aria-hidden className="absolute bottom-24 left-8 h-12 w-12 rounded-full bg-[#FF6B9D] border-4 border-black quest-shadow-sm rotate-[-12deg] hidden md:block" />
          <div aria-hidden className="absolute top-1/3 left-4 h-10 w-10 rounded-xl bg-[#58CC02] border-4 border-black quest-shadow-sm hidden lg:block" />

          <div className="relative container mx-auto px-4 pt-10 pb-16 md:pt-16 md:pb-24 max-w-6xl">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-10 items-center">
              {/* LEFT — Chunky purple hero card */}
              <Reveal>
                <div className="relative rounded-[32px] border-4 border-black bg-[#784EF8] p-6 md:p-9 quest-shadow-lg">
                  {/* Sticker eyebrow */}
                  <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-black text-white px-3 py-1.5 mb-6 rotate-[-1.5deg] quest-shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-[#58CC02] opacity-75 animate-ping" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#58CC02]" />
                    </span>
                    <span className="font-quest text-[11px] font-bold uppercase tracking-[0.14em]">
                      {t.gamifiedPlatform}
                    </span>
                  </div>

                  <h1 className="font-quest font-bold leading-[0.95] tracking-tight text-4xl sm:text-5xl lg:text-6xl text-white">
                    {t.heroLine1}
                    <br />
                    <span className="inline-block bg-[#FFD600] text-black px-3 py-1 rounded-2xl border-4 border-black mt-2 rotate-[-1deg] quest-shadow-sm">
                      {t.heroLine2}
                    </span>
                  </h1>

                  <p className="font-quest mt-6 text-[#EDE4FF] text-base sm:text-lg leading-relaxed max-w-lg">
                    {t.heroDescriptionLine}
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    {user ? (
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="font-quest font-bold text-lg bg-[#FFD600] text-black border-4 border-black rounded-2xl px-6 py-3.5 quest-btn-shadow quest-press inline-flex items-center justify-center gap-2"
                      >
                        {t.goToDashboard} <ArrowRight className="h-5 w-5" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => navigate("/auth?mode=signup")}
                          className="font-quest font-bold text-lg bg-[#FFD600] text-black border-4 border-black rounded-2xl px-6 py-3.5 quest-btn-shadow quest-press inline-flex items-center justify-center gap-2"
                        >
                          {t.startJourney} <ArrowRight className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => document.getElementById("subjects")?.scrollIntoView({ behavior: "smooth" })}
                          className="font-quest font-bold text-base bg-white text-black border-4 border-black rounded-2xl px-5 py-3.5 quest-btn-shadow quest-press inline-flex items-center justify-center gap-2"
                        >
                          <Play className="h-4 w-4" />
                          {t.explorePlatform}
                        </button>
                      </>
                    )}
                  </div>

                  {!user && (
                    <p className="font-quest mt-5 text-sm text-[#EDE4FF]">
                      {t.areYouTeacher}{" "}
                      <a href="mailto:contact@digiinnov.com" className="text-white underline font-bold">
                        → {t.requestDemo}
                      </a>
                    </p>
                  )}
                </div>
              </Reveal>

              {/* RIGHT — Console wrapped in chunky sticker frame */}
              <Reveal delay={160}>
                <div className="relative rounded-[32px] border-4 border-black bg-white p-4 quest-shadow-lg">
                  <div className="absolute -top-3 -left-3 bg-black text-white font-quest font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg quest-shadow-sm rotate-[-4deg]">
                    {lang === "bg" ? "МИСИЯ НА ЖИВО" : "LIVE MISSION"}
                  </div>
                  <StartupConsole lang={lang} />
                </div>
              </Reveal>
            </div>

            {/* Sticker stats row */}
            <Reveal delay={280}>
              <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
                {stats.map((s, i) => {
                  const bgs = ["bg-[#FFD600]", "bg-[#58CC02]", "bg-[#FF6B9D]", "bg-[#2B99FF]"];
                  const rot = ["rotate-[-1.5deg]", "rotate-[1deg]", "rotate-[-1deg]", "rotate-[2deg]"];
                  return (
                    <div key={i} className={`${bgs[i % 4]} ${rot[i % 4]} border-4 border-black rounded-2xl px-4 py-3 quest-shadow-sm flex items-center gap-3`}>
                      <div className="h-9 w-9 rounded-lg bg-white border-2 border-black flex items-center justify-center shrink-0">
                        <s.icon className="h-4 w-4 text-black" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-quest font-bold text-xl text-black leading-none">
                          {s.suffix === "∞" ? "∞" : <CountUp to={s.value} />}
                        </div>
                        <div className="font-quest text-[10px] font-bold uppercase tracking-wider text-black/70 mt-1 truncate">
                          {s.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>

          {/* Testimonial band */}
          <div className="relative border-t-4 border-black bg-white">
            <div className="container mx-auto px-4 py-4 flex items-center gap-4 max-w-6xl">
              <span className="font-quest text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2.5 py-1 rounded-md hidden sm:inline shrink-0">
                {lang === "bg" ? "УЧЕНИЦИ" : "STUDENTS"}
              </span>
              <div className="flex-1 min-w-0">
                <p key={testimonialIdx} className="font-quest text-sm md:text-base text-black leading-relaxed animate-fade-in">
                  &ldquo;{testimonials[testimonialIdx].quote}&rdquo;
                  <span className="ml-2 text-black/60 font-bold text-xs">
                    — {testimonials[testimonialIdx].name}
                  </span>
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIdx(i)}
                    aria-label={`Testimonial ${i + 1}`}
                    className="min-h-11 min-w-11 flex items-center justify-center group"
                  >
                    <span className={`block h-2 rounded-full border-2 border-black transition-all ${i === testimonialIdx ? "w-8 bg-[#784EF8]" : "w-3 bg-white"}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ HOW IT WORKS — light, mission style ══════════ */}
        {!user && (
          <>
          {/* ══════════ PICK YOUR SUBJECT — Playful Quest cards ══════════ */}
          <section id="subjects" className="relative py-16 md:py-24 px-4 bg-[#F0F7FF] border-t-4 border-black">
            <div className="container mx-auto max-w-6xl">
              <div className="max-w-2xl mb-10">
                <div className="inline-flex items-center gap-2 bg-black text-white font-quest text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md rotate-[-1deg] mb-4 quest-shadow-sm">
                  {lang === "bg" ? "00 · ИЗБЕРИ ПРЕДМЕТ" : "00 · PICK YOUR SUBJECT"}
                </div>
                <h2 className="font-quest font-bold text-4xl md:text-5xl leading-[0.95] tracking-tight text-black mb-4">
                  {lang === "bg" ? "Всеки предмет — " : "Every subject, "}
                  <span className="inline-block bg-[#FFD600] px-2 rounded-lg border-4 border-black quest-shadow-sm rotate-[-1deg]">
                    {lang === "bg" ? "отворен за всеки" : "open to anyone"}
                  </span>
                  .
                </h2>
                <p className="font-quest text-black/70 max-w-lg text-base md:text-lg">
                  {lang === "bg"
                    ? "Използвам платформата в моите часове, но ти не си длъжен да си от моето училище. Избери път и започни. Без плащане, без гейткийпинг."
                    : "I use this platform with my own students — but you don't have to be one. Pick a track and start. No paywall, no gatekeeping."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {PATHWAYS.slice(0, 9).map((p, i) => {
                  const trackColor: Record<PathwayTrack, { bg: string; icon: string; text: string }> = {
                    core: { bg: "bg-[#58CC02]", icon: "★", text: "text-white" },
                    business: { bg: "bg-[#2B99FF]", icon: "$", text: "text-white" },
                    marketing: { bg: "bg-[#FF9600]", icon: "▲", text: "text-white" },
                    data_ai: { bg: "bg-[#784EF8]", icon: "◆", text: "text-white" },
                    human: { bg: "bg-[#FF4B7D]", icon: "♥", text: "text-white" },
                  };
                  const tc = trackColor[p.track];
                  const progress = 20 + ((i * 17) % 70);
                  return (
                    <Reveal key={p.id} delay={i * 40}>
                      <button
                        type="button"
                        onClick={() => navigate("/pathways")}
                        className={`group relative w-full text-left rounded-3xl border-4 border-black ${tc.bg} ${tc.text} p-5 quest-shadow quest-press min-h-[200px] flex flex-col`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="h-11 w-11 rounded-xl bg-white/95 border-2 border-black flex items-center justify-center font-quest font-bold text-black text-xl">
                            {tc.icon}
                          </div>
                          <span className="font-quest text-[10px] font-bold uppercase tracking-widest bg-black/25 text-white px-2 py-1 rounded-md">
                            {lang === "bg" ? TRACK_LABELS[p.track].bg : TRACK_LABELS[p.track].en}
                          </span>
                        </div>
                        <h3 className="font-quest font-bold text-white text-xl leading-tight mb-2">
                          {lang === "bg" ? p.titleBg : p.titleEn}
                        </h3>
                        <p className="font-quest text-sm text-white/85 leading-snug line-clamp-2 flex-1">
                          {lang === "bg" ? p.descriptionBg : p.descriptionEn}
                        </p>
                        <div className="mt-4">
                          <div className="w-full bg-black/25 h-3 rounded-full overflow-hidden border-2 border-black">
                            <div className="bg-white h-full" style={{ width: `${progress}%` }} />
                          </div>
                          <div className="flex justify-between mt-1.5 text-[10px] font-quest font-bold text-white">
                            <span>{progress} XP</span>
                            <span className="inline-flex items-center gap-1">
                              {lang === "bg" ? "Отвори" : "Open"}
                              <ChevronRight className="h-3 w-3" />
                            </span>
                          </div>
                        </div>
                      </button>
                    </Reveal>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center">
                <button
                  onClick={() => navigate("/pathways")}
                  className="font-quest font-bold text-lg bg-[#784EF8] text-white border-4 border-black rounded-2xl px-6 py-3.5 quest-btn-shadow quest-press inline-flex items-center justify-center gap-2"
                >
                  {lang === "bg" ? "Виж всички 12 предмета" : "Browse all 12 subjects"}
                  <ArrowRight className="h-5 w-5" />
                </button>
                <span className="font-quest text-sm font-bold text-black/70">
                  {lang === "bg" ? "🎉 Не се изисква регистрация" : "🎉 No signup required"}
                </span>
              </div>
            </div>
          </section>

          <section id="how-it-works" className="relative py-16 md:py-24 px-4 bg-[#FFE9F4] border-t-4 border-black">
            <div className="container mx-auto max-w-5xl">
              <div className="max-w-2xl mb-10">
                <div className="inline-flex items-center gap-2 bg-black text-white font-quest text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md rotate-[-1deg] mb-4 quest-shadow-sm">
                  {lang === "bg" ? "01 · КАК РАБОТИ" : "01 · HOW IT WORKS"}
                </div>
                <h2 className="font-quest font-bold text-4xl md:text-5xl leading-[0.95] tracking-tight text-black mb-3">
                  {t.howItWorksTitle}
                </h2>
                <p className="font-quest text-black/70 max-w-lg text-base md:text-lg">{t.howItWorksDesc}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: BookOpen, text: t.howStep1, num: 1, tag: lang === "bg" ? "УЧИ" : "LEARN", bg: "bg-[#FFD600]", rot: "rotate-[-1deg]" },
                  { icon: Rocket, text: t.howStep2, num: 2, tag: lang === "bg" ? "ПРИЛОЖИ" : "APPLY", bg: "bg-[#58CC02]", rot: "rotate-[1deg]" },
                  { icon: Brain, text: t.howStep3, num: 3, tag: lang === "bg" ? "ИТЕРИРАЙ" : "ITERATE", bg: "bg-[#2B99FF]", rot: "rotate-[-1deg]" },
                  { icon: Award, text: t.howStep4, num: 4, tag: lang === "bg" ? "ПОБЕДИ" : "WIN", bg: "bg-[#784EF8]", rot: "rotate-[1deg]" },
                ].map((step, i) => (
                  <Reveal key={step.num} delay={i * 80}>
                    <div className={`relative rounded-3xl border-4 border-black ${step.bg} ${step.rot} p-5 quest-shadow h-full`}>
                      <div className="flex items-start gap-4">
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white border-4 border-black shrink-0">
                          <step.icon className="h-6 w-6 text-black" />
                          <span className="absolute -top-2.5 -right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black text-white font-quest text-xs font-bold border-2 border-black">
                            {step.num}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="font-quest text-[10px] font-bold uppercase tracking-widest text-black/70 mb-1">{step.tag}</div>
                          <p className="font-quest text-sm md:text-base text-black leading-snug font-medium">{step.text}</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={200}>
                <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center">
                  <button
                    onClick={() => navigate("/auth?mode=signup")}
                    className="font-quest font-bold text-lg bg-[#FFD600] text-black border-4 border-black rounded-2xl px-6 py-3.5 quest-btn-shadow quest-press inline-flex items-center justify-center gap-2"
                  >
                    {t.startJourney} <ArrowRight className="h-5 w-5" />
                  </button>
                  <span className="font-quest text-sm font-bold text-black/70">{t.howCta}</span>
                </div>
              </Reveal>
            </div>
          </section>
          </>
        )}

        {/* ══════════ WHAT YOU LEARN + BUILD ══════════ */}
        <section className="py-16 md:py-24 px-4 bg-[#EAFBE0] border-t-4 border-black">
          <div className="container mx-auto max-w-6xl">
            {/* Skills */}
            <div className="max-w-2xl mb-10">
              <div className="inline-flex items-center gap-2 bg-black text-white font-quest text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md rotate-[-1deg] mb-4 quest-shadow-sm">
                {lang === "bg" ? "02 · КАКВО ЩЕ НАУЧИШ" : "02 · WHAT YOU LEARN"}
              </div>
              <h2 className="font-quest font-bold text-4xl md:text-5xl leading-[0.95] tracking-tight text-black mb-3">{t.whatYouLearn}</h2>
              <p className="font-quest text-black/70 text-base md:text-lg">{t.whatYouLearnDesc}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-20">
              {learnCards.map((card, i) => {
                const bgs = ["bg-white", "bg-[#FFF7E6]", "bg-white", "bg-[#FFE9F4]", "bg-white", "bg-[#EAF3FF]"];
                return (
                  <Reveal key={i} delay={i * 60}>
                    <div className={`relative rounded-3xl border-4 border-black ${bgs[i % bgs.length]} p-5 quest-shadow h-full`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#58CC02] border-4 border-black">
                          <card.icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-quest text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-1 rounded-md">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="font-quest font-bold text-black text-lg mb-1.5">{card.title}</h3>
                      <p className="font-quest text-sm text-black/70 leading-snug">{card.desc}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* Build */}
            <div className="max-w-2xl mb-10">
              <div className="inline-flex items-center gap-2 bg-black text-white font-quest text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md rotate-[-1deg] mb-4 quest-shadow-sm">
                {lang === "bg" ? "03 · КАКВО ЩЕ ПОСТРОИШ" : "03 · WHAT YOU BUILD"}
              </div>
              <h2 className="font-quest font-bold text-4xl md:text-5xl leading-[0.95] tracking-tight text-black mb-3">{t.whatYouBuild}</h2>
              <p className="font-quest text-black/70 text-base md:text-lg">{t.whatYouBuildDesc}</p>
            </div>

            <div className="hidden md:flex items-stretch justify-between gap-3">
              {buildSteps.map((step, i) => {
                const bgs = ["bg-[#FFD600]", "bg-[#FF6B9D]", "bg-[#2B99FF]", "bg-[#58CC02]", "bg-[#784EF8]", "bg-[#FF9600]"];
                const rot = i % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]";
                return (
                  <div key={i} className="flex items-stretch flex-1">
                    <Reveal delay={i * 100} className="flex-1">
                      <div className={`h-full rounded-3xl border-4 border-black ${bgs[i % bgs.length]} ${rot} p-5 quest-shadow`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border-4 border-black">
                            <step.icon className="h-5 w-5 text-black" />
                          </div>
                          <span className="font-quest text-2xl font-bold text-black/40">
                            {String(step.step).padStart(2, "0")}
                          </span>
                        </div>
                        <p className="font-quest text-sm font-bold text-black leading-snug">{step.title}</p>
                      </div>
                    </Reveal>
                  </div>
                );
              })}
            </div>
            <div className="md:hidden space-y-3">
              {buildSteps.map((step, i) => {
                const bgs = ["bg-[#FFD600]", "bg-[#FF6B9D]", "bg-[#2B99FF]", "bg-[#58CC02]", "bg-[#784EF8]", "bg-[#FF9600]"];
                return (
                  <div key={step.step} className={`flex items-center gap-4 rounded-3xl border-4 border-black ${bgs[i % bgs.length]} p-4 quest-shadow-sm`}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border-4 border-black shrink-0">
                      <step.icon className="h-5 w-5 text-black" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-quest text-[10px] font-bold uppercase tracking-widest text-black/70">
                        {t.step} {step.step}
                      </div>
                      <p className="font-quest text-sm font-bold text-black">{step.title}</p>
                    </div>
                    <span className="font-quest text-2xl font-bold text-black/40">
                      {String(step.step).padStart(2, "0")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════ TIMELINE — Week × Stage ══════════ */}
        <section className="py-16 md:py-24 px-4 bg-[#EAF3FF] border-t-4 border-black">
          <div className="container mx-auto max-w-3xl">
            <div className="max-w-xl mb-10">
              <div className="inline-flex items-center gap-2 bg-black text-white font-quest text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md rotate-[-1deg] mb-4 quest-shadow-sm">
                {lang === "bg" ? "04 · 6 СЕДМИЦИ · 6 ЕТАПА" : "04 · 6 WEEKS · 6 STAGES"}
              </div>
              <h2 className="font-quest font-bold text-4xl md:text-5xl leading-[0.95] tracking-tight text-black mb-3">
                {lang === "bg" ? "Твоят път — седмица по седмица" : "Your path — week by week"}
              </h2>
              <p className="font-quest text-black/70 text-base md:text-lg">
                {lang === "bg"
                  ? "Всяка седмица е един етап. Един график, една цел: от идея до стартъп за 6 седмици."
                  : "Each week is one stage. One schedule, one goal: from idea to startup in 6 weeks."}
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-[31px] top-4 bottom-4 w-1 bg-black rounded-full" />
              <div className="space-y-4">
                {journeyStages.map((stage, i) => {
                  const week = courseWeeks[i];
                  const bgs = ["bg-[#FFD600]", "bg-[#58CC02]", "bg-[#FF6B9D]", "bg-[#2B99FF]", "bg-[#784EF8]", "bg-[#FF9600]"];
                  return (
                    <Reveal key={i} delay={i * 60}>
                      <div className="flex gap-4 items-start">
                        <div className={`relative z-10 flex h-16 w-16 flex-col items-center justify-center rounded-2xl ${bgs[i]} text-black border-4 border-black quest-shadow-sm shrink-0`}>
                          <span className="font-quest text-[10px] font-bold uppercase tracking-wider leading-none">
                            {lang === "bg" ? "СЕД" : "WK"}
                          </span>
                          <span className="text-2xl font-quest font-bold leading-none mt-0.5">{i + 1}</span>
                        </div>
                        <div className="flex-1 rounded-3xl border-4 border-black bg-white p-4 quest-shadow-sm">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className="font-quest text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-1 rounded-md">
                              {t.week} {i + 1} · {t.stage} {i + 1}
                            </span>
                            <span className={`inline-flex items-center gap-1 text-[10px] font-quest font-bold text-black ${bgs[i]} border-2 border-black px-2 py-0.5 rounded-md`}>
                              <stage.icon className="h-3 w-3" />
                              {stage.title}
                            </span>
                          </div>
                          <h3 className="font-quest font-bold text-black text-lg leading-tight">
                            {week?.title ?? stage.title}
                          </h3>
                          <p className="font-quest text-sm text-black/70 mt-1 leading-snug">
                            {week?.desc ?? stage.desc}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ DICTIONARY PREVIEW ══════════ */}
        <section className="py-16 md:py-24 px-4 bg-[#FFF7E6] border-t-4 border-black">
          <div className="container mx-auto max-w-4xl">
            <div className="max-w-xl mb-10">
              <div className="inline-flex items-center gap-2 bg-black text-white font-quest text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md rotate-[-1deg] mb-4 quest-shadow-sm">
                {lang === "bg" ? "05 · РЕЧНИК" : "05 · DICTIONARY"}
              </div>
              <h2 className="font-quest font-bold text-4xl md:text-5xl leading-[0.95] tracking-tight text-black mb-3">{t.dictTitle}</h2>
              <p className="font-quest text-black/70 text-base md:text-lg">{t.dictSubtitle}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { en: "Target Audience", bg: "Целева аудитория", cat: "Marketing", catBg: "Маркетинг", def: t.dictTermTargetAudience },
                { en: "Revenue Model", bg: "Модел на приходите", cat: "Pricing", catBg: "Ценообразуване", def: t.dictTermRevenueModel },
                { en: "Bottleneck", bg: "Тясно място", cat: "Operations", catBg: "Операции", def: t.dictTermBottleneck },
                { en: "Founding Team", bg: "Основателски екип", cat: "Team", catBg: "Екип", def: t.dictTermFoundingTeam },
              ].map((item, i) => {
                const catBgs = ["bg-[#FF9600]", "bg-[#58CC02]", "bg-[#2B99FF]", "bg-[#FF6B9D]"];
                return (
                  <Reveal key={i} delay={i * 60}>
                    <div className="rounded-3xl border-4 border-black bg-white p-4 quest-shadow h-full">
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <h3 className="font-quest font-bold text-black text-lg">{item.en}</h3>
                        <span className={`text-[10px] font-quest font-bold uppercase tracking-wider text-white ${catBgs[i]} border-2 border-black px-2 py-0.5 rounded-md shrink-0`}>
                          {lang === "bg" ? item.catBg : item.cat}
                        </span>
                      </div>
                      <p className="font-quest text-xs text-[#784EF8] font-bold mb-1.5">{item.bg}</p>
                      <p className="font-quest text-sm text-black/70 leading-snug">{item.def}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <div className="mt-8">
              <button
                onClick={() => navigate("/dictionary")}
                className="font-quest font-bold text-base bg-white text-black border-4 border-black rounded-2xl px-5 py-3 quest-btn-shadow quest-press inline-flex items-center justify-center gap-2"
              >
                <Book className="h-4 w-4" />
                {t.exploreDict}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <InnovationShowcase lang={lang} />

        {/* ══════════ CTA — Playful Quest ══════════ */}
        <section className="relative py-20 md:py-28 px-4 overflow-hidden bg-[#784EF8] border-t-4 border-black">
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1.5px, transparent 1.5px)",
              backgroundSize: "26px 26px",
            }}
          />
          <div aria-hidden className="absolute top-8 left-10 h-14 w-14 rounded-2xl bg-[#FFD600] border-4 border-black quest-shadow-sm rotate-[8deg] hidden md:block" />
          <div aria-hidden className="absolute bottom-10 right-14 h-16 w-16 rounded-full bg-[#FF6B9D] border-4 border-black quest-shadow-sm rotate-[-8deg] hidden md:block" />
          <div aria-hidden className="absolute top-1/2 right-8 h-10 w-10 rounded-xl bg-[#58CC02] border-4 border-black quest-shadow-sm hidden lg:block" />

          <div className="relative container mx-auto max-w-2xl text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 bg-black text-white font-quest text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md rotate-[-1.5deg] mb-6 quest-shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                {lang === "bg" ? "ГОТОВ ЛИ СИ?" : "READY?"}
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-quest font-bold text-white mb-5 text-4xl md:text-6xl leading-[0.95]">
                {t.readyToInnovate}
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="font-quest text-[#EDE4FF] mb-8 max-w-md mx-auto text-base md:text-lg">{t.readyToInnovateDesc}</p>
            </Reveal>
            <Reveal delay={240}>
              <button
                onClick={() => handleNav("/dashboard")}
                className="font-quest font-bold text-xl bg-[#FFD600] text-black border-4 border-black rounded-2xl px-8 py-4 quest-btn-shadow quest-press inline-flex items-center justify-center gap-2"
              >
                {t.startJourney} <ArrowRight className="h-5 w-5" />
              </button>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  );
};

const SectionBadge = forwardRef<HTMLDivElement, { label: string }>(({ label }, ref) => (
  <div
    ref={ref}
    className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-accent px-3 py-1"
  >
    <Zap className="h-3 w-3 text-primary" />
    <span className="typo-eyebrow text-primary">{label}</span>
  </div>
));
SectionBadge.displayName = "SectionBadge";

export default Index;