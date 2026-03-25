import { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { Button } from '@/components/ui/button';
import AppHeader from '@/components/layout/AppHeader';
import InnovationShowcase from '@/components/landing/InnovationShowcase';
import {
  GraduationCap, ArrowRight, Lightbulb, Search, Rocket,
  Presentation, Compass, Briefcase, Palette,
  Trophy, BookOpen, FlaskConical, TrendingUp, Mic,
  Zap, Star, Calendar, ChevronRight, Book,
  Cpu, Eye, Users, Mail,
} from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const { lang, t } = useLang();
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    if (user) navigate(path);
    else navigate(`/auth?redirect=${encodeURIComponent(path)}`);
  };

  const learnCards = [
    { icon: Lightbulb, title: t.learnDigitalInnovation, desc: t.learnDigitalInnovationDesc, gradient: 'gradient-explorer' },
    { icon: Rocket, title: t.learnStartupThinking, desc: t.learnStartupThinkingDesc, gradient: 'gradient-strategist' },
    { icon: Briefcase, title: t.learnBusinessModels, desc: t.learnBusinessModelsDesc, gradient: 'gradient-builder' },
    { icon: Palette, title: t.learnProductDesign, desc: t.learnProductDesignDesc, gradient: 'gradient-designer' },
    { icon: TrendingUp, title: t.learnGrowthStrategy, desc: t.learnGrowthStrategyDesc, gradient: 'gradient-founder' },
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

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative py-20 sm:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full bg-primary/[0.06] blur-3xl" />
          <div className="absolute -bottom-48 -left-48 w-[500px] h-[500px] rounded-full bg-accent/40 blur-3xl" />
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl sim-gradient glow-primary shadow-2xl">
                <GraduationCap className="h-10 w-10 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(var(--sim-warning))] shadow-md">
                <Zap className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1.5 mb-5">
            <Star className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">{t.gamifiedPlatform}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 leading-[1.1]">
            {lang === 'en' ? 'Build Your Startup While' : 'Създай собствен стартъп и'}
            <br />
            <span className="sim-gradient-text">
              {lang === 'en' ? 'Learning Digital Innovation' : 'научи дигитални иновации'}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground mb-2 max-w-2xl mx-auto leading-relaxed">
            {t.heroAudience}
          </p>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            {lang === 'en'
              ? 'Analyze real business cases, build your startup idea, and test your strategy in a startup simulator.'
              : 'Анализирай реални бизнес казуси, създай своя стартъп идея и тествай стратегията си в симулатор.'}
          </p>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">{t.socialProof}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user ? (
              <Button size="lg" className="sim-gradient border-0 text-base px-8 glow-primary" onClick={() => navigate('/dashboard')}>
                {t.goToDashboard} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <>
                <Button size="lg" className="sim-gradient border-0 text-base px-8 glow-primary" onClick={() => navigate('/auth?mode=signup')}>
                  {t.startJourney} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-base px-8" onClick={() => navigate('/about')}>
                  <Eye className="mr-2 h-4 w-4" />
                  {t.explorePlatform}
                </Button>
              </>
            )}
          </div>

          {!user && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <Button variant="secondary" size="lg" className="text-base px-8" onClick={() => handleNav('/dashboard')}>
                <BookOpen className="mr-2 h-4 w-4" />
                {t.useInClassroom}
              </Button>
              <Button variant="ghost" size="lg" className="text-base px-8" onClick={() => window.location.href = 'mailto:contact@digiinnov.com'}>
                <Mail className="mr-2 h-4 w-4" />
                {t.requestDemo}
              </Button>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-6">{t.accessClarity}</p>

          {/* Quick stats — more prominent */}
          <div className="flex flex-wrap justify-center gap-5 mt-10">
            {[
              { value: '6', label: t.statWeeks, icon: Calendar },
              { value: '10', label: t.statIndustries, icon: Cpu },
              { value: '5', label: t.statLevels, icon: Trophy },
              { value: '∞', label: t.statIdeas, icon: Lightbulb },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 shadow-sm">
                <stat.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-foreground">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ WHAT YOU LEARN + BUILD (combined) ═══════════════════ */}
      <section className="py-16 px-4 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          {/* Skills */}
          <div className="text-center mb-10">
            <SectionBadge label={t.skillsCount} />
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-4 mb-3">{t.whatYouLearn}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">{t.whatYouLearnDesc}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 mb-16">
            {learnCards.map((card, i) => (
              <div key={i} className="group rounded-2xl border border-border bg-card p-5 text-center hover:border-primary/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.gradient} mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-display font-bold text-sm text-foreground mb-1">{card.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Build Steps — inline */}
          <div className="text-center mb-10">
            <SectionBadge label={t.stepsCount} />
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-4 mb-3">{t.whatYouBuild}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">{t.whatYouBuildDesc}</p>
          </div>
          <div className="hidden md:flex items-center justify-between max-w-3xl mx-auto">
            {buildSteps.map((step, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center text-center w-36 group">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card border-2 border-primary/20 shadow-md mb-3 group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full sim-gradient text-xs font-bold text-primary-foreground mb-2 shadow-sm">{step.step}</div>
                  <p className="text-xs font-semibold text-foreground leading-snug">{step.title}</p>
                </div>
                {i < buildSteps.length - 1 && <ChevronRight className="h-5 w-5 text-primary/40 mx-2 shrink-0" />}
              </div>
            ))}
          </div>
          <div className="md:hidden space-y-3">
            {buildSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl sim-gradient shrink-0 shadow-md">
                  <step.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <span className="typo-stage-label">{t.step} {step.step}</span>
                  <p className="text-sm font-medium text-foreground">{step.title}</p>
                </div>
                {i < buildSteps.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ JOURNEY + COURSE TIMELINE (combined) ═══════════════════ */}
      <section className="py-16 px-4 border-t border-border bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left: Journey stages */}
            <div>
              <SectionBadge label={t.stagesCount} />
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-4 mb-6">{t.yourJourney}</h2>
              <div className="relative">
                <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border">
                  <div className="absolute inset-0 sim-gradient opacity-20 rounded-full" />
                </div>
                <div className="space-y-3">
                  {journeyStages.map((stage, i) => (
                    <div key={i} className="flex gap-3 group">
                      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl sim-gradient text-primary-foreground shadow-md shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <stage.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 rounded-xl border border-border bg-card p-3 group-hover:border-primary/30 transition-all duration-300">
                        <span className="typo-stage-label text-[10px]">{t.stage} {i + 1}</span>
                        <h3 className="font-display font-bold text-foreground text-sm">{stage.title}</h3>
                        <p className="text-xs text-muted-foreground">{stage.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Course weeks */}
            <div>
              <SectionBadge label={t.weeksCount} />
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-4 mb-6">{t.learningPath}</h2>
              <div className="space-y-3">
                {courseWeeks.map((week, i) => (
                  <div key={i} className="group flex gap-3 rounded-xl border border-border bg-card p-3 hover:border-primary/30 transition-all duration-300">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl sim-gradient text-primary-foreground shadow-md shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <week.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Calendar className="h-3 w-3 text-primary" />
                        <span className="typo-stage-label text-[10px]">{t.week} {week.week}</span>
                      </div>
                      <h3 className="font-display font-bold text-foreground text-sm">{week.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{week.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ INNOVATION SHOWCASE ═══════════════════ */}
      <InnovationShowcase lang={lang} />

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative py-20 px-4 border-t border-border overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/[0.05] blur-3xl" />
        </div>
        <div className="container mx-auto max-w-2xl text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl sim-gradient glow-primary shadow-2xl">
              <Rocket className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">{t.readyToInnovate}</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">{t.readyToInnovateDesc}</p>
          <Button size="lg" className="sim-gradient border-0 text-base px-10 glow-primary" onClick={() => handleNav('/dashboard')}>
            {t.startJourney} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

const SectionBadge = forwardRef<HTMLDivElement, { label: string }>(({ label }, ref) => (
  <div ref={ref} className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-accent px-3 py-1">
    <Zap className="h-3 w-3 text-primary" />
    <span className="text-xs font-semibold text-primary uppercase tracking-wider">{label}</span>
  </div>
));
SectionBadge.displayName = 'SectionBadge';

export default Index;
