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
        {/* ══════════ HERO — Innovation Lab Console (dark navy) ══════════ */}
        <section className="relative bg-ink-gradient text-ink-fg overflow-hidden">
          <video
            aria-hidden
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster=""
            className="absolute inset-0 h-full w-full object-cover opacity-40 pointer-events-none mix-blend-screen"
          >
            <source src={heroBg.url} type="video/mp4" />
          </video>
          <div aria-hidden className="absolute inset-0 bg-ink-gradient/60 pointer-events-none" style={{ background: "linear-gradient(160deg, hsl(216 60% 10% / 0.75) 0%, hsl(217 54% 14% / 0.55) 60%, hsl(217 45% 20% / 0.7) 100%)" }} />
          <div aria-hidden className="absolute inset-0 bg-grid-ink opacity-40 pointer-events-none" />
          <div
            aria-hidden
            className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full blur-3xl pointer-events-none"
            style={{ background: "hsl(var(--mint) / 0.18)" }}
          />
          <div
            aria-hidden
            className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full blur-3xl pointer-events-none"
            style={{ background: "hsl(var(--emerald) / 0.22)" }}
          />

          <div className="relative container mx-auto px-4 pt-14 pb-20 md:pt-20 md:pb-28">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center max-w-6xl mx-auto">
              {/* LEFT — headline + CTAs */}
              <div className="text-center lg:text-left">
                <Reveal>
                  <div className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-ink-2/60 backdrop-blur px-3 py-1.5 mb-5">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-mint opacity-75 animate-ping" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
                    </span>
                    <span className="typo-eyebrow text-mint">{t.gamifiedPlatform}</span>
                  </div>
                </Reveal>

                <Reveal delay={80}>
                  <h1 className="font-display font-bold leading-[1.02] tracking-tight text-4xl sm:text-5xl lg:text-[64px] text-ink-fg">
                    {t.heroLine1}
                    <br />
                    <span
                      className="bg-clip-text text-transparent"
                      style={{ backgroundImage: "var(--gradient-primary)" }}
                    >
                      {t.heroLine2}
                    </span>
                  </h1>
                </Reveal>

                <Reveal delay={160}>
                  <p className="mt-5 text-ink-dim text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                    {t.heroDescriptionLine}
                  </p>
                </Reveal>

                <Reveal delay={240}>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    {user ? (
                      <Button size="lg" variant="hero" onClick={() => navigate("/dashboard")}>
                        {t.goToDashboard} <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <>
                        <Button size="lg" variant="hero" onClick={() => navigate("/auth?mode=signup")}>
                          {t.startJourney} <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button
                          size="lg"
                          variant="console"
                          onClick={() =>
                            document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
                          }
                        >
                          <Play className="h-4 w-4" />
                          {t.explorePlatform}
                        </Button>
                      </>
                    )}
                  </div>
                </Reveal>

                {/* Trust chips (sticker style) */}
                <Reveal delay={320}>
                  <div className="mt-8 flex flex-wrap gap-2 justify-center lg:justify-start">
                    {stats.map((s, i) => (
                      <div
                        key={i}
                        className="inline-flex items-center gap-2 rounded-full bg-white/95 text-ink shadow-sticker border border-white/10 px-3 py-1.5"
                      >
                        <s.icon className="h-3.5 w-3.5 text-primary" />
                        <span className="font-mono text-sm font-bold text-ink">
                          {s.suffix === "∞" ? "∞" : <CountUp to={s.value} />}
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </Reveal>

                {!user && (
                  <Reveal delay={380}>
                    <p className="mt-6 text-sm text-ink-dim">
                      {t.areYouTeacher}{" "}
                      <a href="mailto:contact@digiinnov.com" className="text-mint hover:underline font-medium">
                        → {t.requestDemo}
                      </a>
                    </p>
                  </Reveal>
                )}
              </div>

              {/* RIGHT — animated console */}
              <Reveal delay={200} className="w-full max-w-md mx-auto lg:max-w-none">
                <StartupConsole lang={lang} />
              </Reveal>
            </div>
          </div>

          {/* Testimonial marquee on the ink section */}
          <div className="relative border-t border-ink-3/60 bg-ink/40 backdrop-blur">
            <div className="container mx-auto px-4 py-5 flex items-center gap-4 max-w-6xl">
              <span className="typo-eyebrow text-mint hidden sm:inline shrink-0">
                {lang === "bg" ? "СТУДЕНТИ" : "STUDENTS"}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  key={testimonialIdx}
                  className="text-sm md:text-base text-ink-fg italic leading-relaxed animate-fade-in"
                >
                  &ldquo;{testimonials[testimonialIdx].quote}&rdquo;
                  <span className="ml-2 text-ink-dim not-italic font-mono text-xs">
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
                    <span
                      className={`block h-1.5 rounded-full transition-all ${
                        i === testimonialIdx ? "w-6 bg-mint" : "w-2 bg-ink-3 group-hover:bg-ink-dim"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ HOW IT WORKS — light, mission style ══════════ */}
        {!user && (
          <section id="how-it-works" className="relative py-20 md:py-24 px-4 border-t border-border">
            <div className="container mx-auto max-w-5xl">
              <div className="max-w-2xl mb-12">
                <div className="typo-eyebrow text-primary mb-3">
                  01 / {lang === "bg" ? "КАК РАБОТИ" : "HOW IT WORKS"}
                </div>
                <h2 className="typo-h1 mb-3">{t.howItWorksTitle}</h2>
                <p className="text-muted-foreground max-w-lg">{t.howItWorksDesc}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: BookOpen, text: t.howStep1, num: 1, tag: lang === "bg" ? "УЧИ" : "LEARN" },
                  { icon: Rocket, text: t.howStep2, num: 2, tag: lang === "bg" ? "ПРИЛОЖИ" : "APPLY" },
                  { icon: Brain, text: t.howStep3, num: 3, tag: lang === "bg" ? "ИТЕРИРАЙ" : "ITERATE" },
                  { icon: Award, text: t.howStep4, num: 4, tag: lang === "bg" ? "ПОБЕДИ" : "WIN" },
                ].map((step, i) => (
                  <Reveal key={step.num} delay={i * 80}>
                    <div className="group relative rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-lift transition-all duration-300 h-full">
                      <div className="flex items-start gap-4">
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient shrink-0 shadow-[var(--glow-emerald)] group-hover:scale-105 transition-transform">
                          <step.icon className="h-5 w-5 text-white" />
                          <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-border font-mono text-[11px] font-bold text-ink shadow-sticker">
                            {step.num}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="typo-eyebrow text-primary mb-1">{step.tag}</div>
                          <p className="text-sm text-foreground leading-relaxed">{step.text}</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={200}>
                <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center">
                  <Button size="lg" variant="hero" onClick={() => navigate("/auth?mode=signup")}>
                    {t.startJourney} <ArrowRight className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">{t.howCta}</span>
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* ══════════ WHAT YOU LEARN + BUILD ══════════ */}
        <section className="py-20 md:py-24 px-4 border-t border-border bg-secondary/60">
          <div className="container mx-auto max-w-6xl">
            {/* Skills */}
            <div className="max-w-2xl mb-12">
              <div className="typo-eyebrow text-primary mb-3">
                02 / {lang === "bg" ? "КАКВО ЩЕ НАУЧИШ" : "WHAT YOU LEARN"}
              </div>
              <h2 className="typo-h1 mb-3">{t.whatYouLearn}</h2>
              <p className="text-muted-foreground">{t.whatYouLearnDesc}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-20">
              {learnCards.map((card, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className="group relative rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-lift transition-all duration-300 h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-gradient shadow-[var(--glow-emerald)] group-hover:scale-110 transition-transform">
                        <card.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-foreground mb-1.5">{card.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Build */}
            <div className="max-w-2xl mb-10">
              <div className="typo-eyebrow text-primary mb-3">
                03 / {lang === "bg" ? "КАКВО ЩЕ ПОСТРОИШ" : "WHAT YOU BUILD"}
              </div>
              <h2 className="typo-h1 mb-3">{t.whatYouBuild}</h2>
              <p className="text-muted-foreground">{t.whatYouBuildDesc}</p>
            </div>

            <div className="hidden md:flex items-stretch justify-between gap-2">
              {buildSteps.map((step, i) => (
                <div key={i} className="flex items-stretch flex-1">
                  <Reveal delay={i * 100} className="flex-1">
                    <div className="h-full rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-lift transition-all duration-300 group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient shadow-[var(--glow-emerald)] group-hover:scale-105 transition-transform">
                          <step.icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-mono text-2xl font-bold text-primary/30">
                          {String(step.step).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-foreground leading-snug">{step.title}</p>
                    </div>
                  </Reveal>
                  {i < buildSteps.length - 1 && (
                    <div className="flex items-center justify-center px-1">
                      <ChevronRight className="h-4 w-4 text-primary/40" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="md:hidden space-y-3">
              {buildSteps.map((step) => (
                <div key={step.step} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-gradient shrink-0 shadow-[var(--glow-emerald)]">
                    <step.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="typo-eyebrow text-primary">
                      {t.step} {step.step}
                    </div>
                    <p className="text-sm font-semibold text-foreground">{step.title}</p>
                  </div>
                  <span className="font-mono text-xl font-bold text-primary/30">
                    {String(step.step).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ TIMELINE — Week × Stage ══════════ */}
        <section className="py-20 md:py-24 px-4 border-t border-border">
          <div className="container mx-auto max-w-3xl">
            <div className="max-w-xl mb-12">
              <div className="typo-eyebrow text-primary mb-3">
                04 / {lang === "bg" ? "6 СЕДМИЦИ · 6 ЕТАПА" : "6 WEEKS · 6 STAGES"}
              </div>
              <h2 className="typo-h1 mb-3">
                {lang === "bg"
                  ? "Твоят иновационен път — седмица по седмица"
                  : "Your innovation path — week by week"}
              </h2>
              <p className="text-muted-foreground">
                {lang === "bg"
                  ? "Всяка седмица е един етап. Един график, една цел: от идея до стартъп за 6 седмици."
                  : "Each week is one stage. One schedule, one goal: from idea to startup in 6 weeks."}
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-border">
                <div className="absolute inset-0 bg-primary-gradient opacity-40 rounded-full" />
              </div>
              <div className="space-y-3">
                {journeyStages.map((stage, i) => {
                  const week = courseWeeks[i];
                  return (
                    <Reveal key={i} delay={i * 60}>
                      <div className="flex gap-4 group">
                        <div className="relative z-10 flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-primary-gradient text-white shadow-[var(--glow-emerald)] shrink-0 group-hover:scale-105 transition-transform">
                          <span className="font-mono text-[9px] font-bold uppercase tracking-wider opacity-90 leading-none">
                            {lang === "bg" ? "СЕД" : "WK"}
                          </span>
                          <span className="text-lg font-display font-bold leading-none mt-0.5">{i + 1}</span>
                        </div>
                        <div className="flex-1 rounded-2xl border border-border bg-card p-4 group-hover:border-primary/30 group-hover:shadow-sticker transition-all duration-300">
                          <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            <span className="typo-eyebrow text-primary">
                              {t.week} {i + 1} · {t.stage} {i + 1}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-accent-foreground bg-accent px-2 py-0.5 rounded-full">
                              <stage.icon className="h-2.5 w-2.5" />
                              {stage.title}
                            </span>
                          </div>
                          <h3 className="font-display font-bold text-foreground text-base">
                            {week?.title ?? stage.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
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

        {/* ══════════ DICTIONARY PREVIEW (light) ══════════ */}
        <section className="py-20 md:py-24 px-4 border-t border-border bg-secondary/60">
          <div className="container mx-auto max-w-4xl">
            <div className="max-w-xl mb-10">
              <div className="typo-eyebrow text-primary mb-3">
                05 / {lang === "bg" ? "РЕЧНИК" : "DICTIONARY"}
              </div>
              <h2 className="typo-h1 mb-3">{t.dictTitle}</h2>
              <p className="text-muted-foreground">{t.dictSubtitle}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { en: "Target Audience", bg: "Целева аудитория", cat: "Marketing", catBg: "Маркетинг", def: t.dictTermTargetAudience },
                { en: "Revenue Model", bg: "Модел на приходите", cat: "Pricing", catBg: "Ценообразуване", def: t.dictTermRevenueModel },
                { en: "Bottleneck", bg: "Тясно място", cat: "Operations", catBg: "Операции", def: t.dictTermBottleneck },
                { en: "Founding Team", bg: "Основателски екип", cat: "Team", catBg: "Екип", def: t.dictTermFoundingTeam },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className="group rounded-2xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-lift transition-all h-full">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display font-bold text-foreground">{item.en}</h3>
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-accent-foreground bg-accent px-2 py-0.5 rounded-full">
                        {lang === "bg" ? item.catBg : item.cat}
                      </span>
                    </div>
                    <p className="text-xs text-primary/80 font-medium mb-1.5">{item.bg}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.def}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-8">
              <Button variant="outline" size="lg" onClick={() => navigate("/dictionary")} className="gap-2">
                <Book className="h-4 w-4" />
                {t.exploreDict}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <InnovationShowcase lang={lang} />

        {/* ══════════ CTA — dark navy band ══════════ */}
        <section className="relative py-20 md:py-24 px-4 overflow-hidden bg-ink-gradient text-ink-fg">
          <div aria-hidden className="absolute inset-0 bg-grid-ink opacity-30 pointer-events-none" />
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-3xl pointer-events-none"
            style={{ background: "hsl(var(--mint) / 0.2)" }}
          />
          <div className="relative container mx-auto max-w-2xl text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-ink-2/60 backdrop-blur px-3 py-1.5 mb-6">
                <Sparkles className="h-3.5 w-3.5 text-mint" />
                <span className="typo-eyebrow text-mint">
                  {lang === "bg" ? "ГОТОВ ЛИ СИ?" : "READY?"}
                </span>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="typo-h1 text-ink-fg mb-4 text-4xl md:text-5xl">{t.readyToInnovate}</h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="text-ink-dim mb-8 max-w-md mx-auto">{t.readyToInnovateDesc}</p>
            </Reveal>
            <Reveal delay={240}>
              <Button size="xl" variant="hero" onClick={() => handleNav("/dashboard")}>
                {t.startJourney} <ArrowRight className="h-5 w-5" />
              </Button>
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