import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { Button } from '@/components/ui/button';
import AppHeader from '@/components/layout/AppHeader';
import InnovationShowcase from '@/components/landing/InnovationShowcase';
import CommunityStats from '@/components/landing/CommunityStats';
import {
  GraduationCap, ArrowRight, Lightbulb, Search, Rocket, Brain,
  Sparkles, Presentation, Compass, Briefcase, Hammer, Palette, Crown,
  Trophy, BookOpen, FlaskConical, Target, TrendingUp, Mic,
  Award, Zap, Star, Shield, BarChart3, Calendar, ChevronRight,
  Cpu, LineChart, Package, Users, Eye,
} from 'lucide-react';

const Index = () => {
  const { user, isAdmin } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const handleNav = (path: string) => {
    if (user) navigate(path);
    else navigate(`/auth?redirect=${encodeURIComponent(path)}`);
  };

  // SECTION 2 – WHAT YOU WILL LEARN
  const learnCards = [
    {
      icon: Lightbulb,
      title: t('Digital Innovation', 'Дигитални иновации'),
      desc: t('Understand how technology transforms industries.', 'Разбери как технологиите трансформират индустриите.'),
      gradient: 'gradient-explorer',
    },
    {
      icon: Rocket,
      title: t('Startup Thinking', 'Стартиращо предприемачество'),
      desc: t('Learn to identify problems and create solutions.', 'Научи се да откривш проблеми и да създаваш решения.'),
      gradient: 'gradient-strategist',
    },
    {
      icon: Briefcase,
      title: t('Business Models', 'Бизнес модели'),
      desc: t('Design how your startup generates revenue.', 'Проектирай как стартъпът ти генерира приходи.'),
      gradient: 'gradient-builder',
    },
    {
      icon: Palette,
      title: t('Product Design', 'Дизайн на дигитален продукт'),
      desc: t('Create a minimum viable product concept.', 'Създай концепция за минимално жизнеспособен продукт.'),
      gradient: 'gradient-designer',
    },
    {
      icon: TrendingUp,
      title: t('Growth Strategy', 'Стратегии за растеж'),
      desc: t('Choose marketing and scaling strategies.', 'Избери маркетинг и стратегии за мащабиране.'),
      gradient: 'gradient-founder',
    },
  ];

  // SECTION 3 – WHAT YOU WILL BUILD
  const buildSteps = [
    { icon: Search, title: t('Identify a Problem', 'Открий проблем'), step: 1 },
    { icon: Lightbulb, title: t('Create a Startup Idea', 'Създай стартъп идея'), step: 2 },
    { icon: Briefcase, title: t('Build a Business Model', 'Изгради бизнес модел'), step: 3 },
    { icon: Presentation, title: t('Pitch Your Startup', 'Представи своя стартъп'), step: 4 },
  ];

  // SECTION 4 – INNOVATION JOURNEY
  const journeyStages = [
    { icon: Compass, title: t('Explore Digital Innovation', 'Открий дигиталните иновации'), desc: t('Learn core concepts and frameworks', 'Научи основни концепции и рамки') },
    { icon: BookOpen, title: t('Analyze Business Cases', 'Анализирай бизнес казуси'), desc: t('Study real-world digital transformations', 'Изучи реални дигитални трансформации') },
    { icon: Rocket, title: t('Build Your Startup Idea', 'Изгради стартъп идея'), desc: t('Define your problem, customer, and solution', 'Определи проблем, клиент и решение') },
    { icon: Palette, title: t('Design Your Product', 'Създай своя продукт'), desc: t('Create your MVP and value proposition', 'Създай MVP и стойностно предложение') },
    { icon: FlaskConical, title: t('Test Strategy in the Simulator', 'Тествай стратегията в симулатора'), desc: t('Make decisions that affect your KPIs', 'Вземи решения, които влияят на KPI') },
    { icon: Presentation, title: t('Pitch Your Startup', 'Представи своя стартъп'), desc: t('Present your startup to virtual investors', 'Представи стартъпа си пред инвеститори') },
  ];

  // SECTION 5 – GAMIFICATION
  const xpActions = [
    { action: t('Complete case study', 'Завършване на казус'), xp: 50, icon: BookOpen },
    { action: t('Finish simulator step', 'Завършване на стъпка от симулатора'), xp: 100, icon: BarChart3 },
    { action: t('Submit startup idea', 'Предаване на стартъп идея'), xp: 200, icon: Rocket },
  ];

  const badges = [
    { name: t('Innovation Explorer', 'Иноватор изследовател'), icon: Compass, color: 'from-blue-500 to-cyan-400' },
    { name: t('Startup Builder', 'Стартъп строител'), icon: Hammer, color: 'from-emerald-500 to-teal-400' },
    { name: t('Digital Strategist', 'Дигитален стратег'), icon: Target, color: 'from-amber-500 to-orange-400' },
    { name: t('AI Innovator', 'AI Иноватор'), icon: Sparkles, color: 'from-purple-500 to-pink-400' },
  ];

  // SECTION 6 – COURSE TIMELINE
  const courseWeeks = [
    { week: 1, title: t('Digital Innovation Basics', 'Основи на дигиталната иновация'), icon: Lightbulb, desc: t('Core concepts, digital disruption, and technology trends', 'Основни концепции, дигитално прекъсване и технологични тенденции') },
    { week: 2, title: t('Industry Analysis', 'Анализ на индустрията'), icon: Search, desc: t('Explore 10 industries and identify innovation opportunities', 'Проучи 10 индустрии и открий иновационни възможности') },
    { week: 3, title: t('Business Model', 'Бизнес модел'), icon: Briefcase, desc: t('Design revenue models and value propositions', 'Проектирай модели на приходи и стойностни предложения') },
    { week: 4, title: t('Product Design', 'Дизайн на продукт'), icon: Palette, desc: t('Build your minimum viable product concept', 'Създай концепция за минимално жизнеспособен продукт') },
    { week: 5, title: t('Growth Strategy', 'Стратегия за растеж'), icon: TrendingUp, desc: t('Choose marketing channels and growth tactics', 'Избери маркетинг канали и тактики за растеж') },
    { week: 6, title: t('Startup Pitch', 'Стартъп представяне'), icon: Mic, desc: t('Present your startup and review final results', 'Представи стартъпа си и прегледай финалните резултати') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* ═══════════════════ SECTION 1: HERO ═══════════════════ */}
      <section className="relative py-24 sm:py-32 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full bg-primary/[0.04] blur-3xl" />
          <div className="absolute -bottom-48 -left-48 w-[500px] h-[500px] rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-primary/[0.02] blur-3xl" />
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl sim-gradient glow-primary shadow-2xl">
                <GraduationCap className="h-10 w-10 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(var(--sim-warning))] shadow-md">
                <Zap className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1.5 mb-6 animate-fade-in">
            <Star className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">
              {t('Gamified Learning Platform', 'Геймифицирана учебна платформа')}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-[1.1]">
            {t('Build Your Startup While', 'Създай собствен стартъп и')}
            <br />
            <span className="sim-gradient-text">
              {t('Learning Digital Innovation', 'научи дигитални иновации')}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            {t(
              'Analyze real business cases, build your startup idea, and test your strategy in a startup simulator.',
              'Анализирай реални бизнес казуси, създай своя стартъп идея и тествай стратегията си в симулатор.'
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user ? (
              <Button size="lg" className="sim-gradient border-0 text-base px-8 glow-primary" onClick={() => navigate('/dashboard')}>
                {t('Go to Dashboard', 'Към таблото')} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <>
                <Button size="lg" className="sim-gradient border-0 text-base px-8 glow-primary" onClick={() => navigate('/auth?mode=signup')}>
                  {t('Start Your Innovation Journey', 'Започни своето иновационно пътешествие')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-base px-8" onClick={() => navigate('/about')}>
                  <Eye className="mr-2 h-4 w-4" />
                  {t('Explore the Platform', 'Разгледай платформата')}
                </Button>
              </>
            )}
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-center">
            {[
              { value: '6', label: t('Weeks', 'Седмици'), icon: Calendar },
              { value: '10', label: t('Industries', 'Индустрии'), icon: Cpu },
              { value: '5', label: t('Levels', 'Нива'), icon: Trophy },
              { value: '∞', label: t('Ideas', 'Идеи'), icon: Lightbulb },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2">
                <stat.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-foreground">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ COMMUNITY STATS ═══════════════════ */}
      <CommunityStats lang={lang} isAdmin={isAdmin} />

      {/* ═══════════════════ SECTION 2: WHAT YOU WILL LEARN ═══════════════════ */}
      <section className="py-20 px-4 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <SectionBadge label={t('5 Skills', '5 Умения')} />
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-4 mb-3">
              {t('What You Will Learn', 'Какво ще научиш')}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t('Master the skills every digital innovator needs.', 'Овладей уменията, от които всеки дигитален иноватор се нуждае.')}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {learnCards.map((card, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-border bg-card p-5 text-center hover:border-primary/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.gradient} mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-sm text-foreground mb-1.5">{card.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 3: WHAT YOU WILL BUILD ═══════════════════ */}
      <section className="py-20 px-4 border-t border-border bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <SectionBadge label={t('4 Steps', '4 Стъпки')} />
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-4 mb-3">
              {t('What You Will Build', 'Какво ще създадеш')}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t('From problem discovery to pitching a real startup concept.', 'От откриването на проблем до представянето на реална стартъп концепция.')}
            </p>
          </div>

          {/* Desktop: horizontal with arrows */}
          <div className="hidden md:flex items-center justify-between relative">
            {buildSteps.map((step, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center text-center w-36 group">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-card border-2 border-primary/20 shadow-md mb-3 group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full sim-gradient text-[11px] font-bold text-primary-foreground mb-2 shadow-sm">
                    {step.step}
                  </div>
                  <p className="text-xs font-semibold text-foreground leading-snug">{step.title}</p>
                </div>
                {i < buildSteps.length - 1 && (
                  <ChevronRight className="h-5 w-5 text-primary/40 mx-2 shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Mobile: vertical */}
          <div className="md:hidden space-y-3">
            {buildSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl sim-gradient shrink-0 shadow-md">
                  <step.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    {t('Step', 'Стъпка')} {step.step}
                  </span>
                  <p className="text-sm font-medium text-foreground">{step.title}</p>
                </div>
                {i < buildSteps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 4: INNOVATION JOURNEY ═══════════════════ */}
      <section className="py-20 px-4 border-t border-border">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <SectionBadge label={t('6 Stages', '6 Етапа')} />
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-4 mb-3">
              {t('Your Innovation Journey', 'Твоето иновационно пътешествие')}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t('A gamified roadmap from beginner to startup founder.', 'Геймифицирана пътна карта от начинаещ до стартъп основател.')}
            </p>
          </div>

          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-[23px] sm:left-[27px] top-0 bottom-0 w-0.5 bg-border">
              <div className="absolute inset-0 sim-gradient opacity-20 rounded-full" />
            </div>

            <div className="space-y-4">
              {journeyStages.map((stage, i) => {
                const progressPct = ((i + 1) / journeyStages.length) * 100;
                return (
                  <div key={i} className="flex gap-4 sm:gap-5 group">
                    <div className="relative z-10 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl sim-gradient text-primary-foreground shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <stage.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="flex-1 rounded-2xl border border-border bg-card p-4 sm:p-5 group-hover:border-primary/30 group-hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-wider">
                          {t('Stage', 'Етап')} {i + 1}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-foreground text-sm mb-1">{stage.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{stage.desc}</p>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full sim-gradient transition-all duration-700"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 5: GAMIFICATION ═══════════════════ */}
      <section className="py-20 px-4 border-t border-border bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <SectionBadge label={t('Gamification', 'Геймификация')} />
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-4 mb-3">
              {t('Level Up, Earn XP, Collect Badges', 'Качи ниво, спечели XP, събери значки')}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t('Every action earns experience points. Progress through 5 levels and unlock achievements.', 'Всяко действие носи точки опит. Напредни през 5 нива и отключи постижения.')}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* XP Actions */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <Zap className="h-5 w-5 text-[hsl(var(--sim-warning))]" />
                <h3 className="font-display font-bold text-foreground">{t('Earn XP Points', 'Печели XP точки')}</h3>
              </div>
              <div className="space-y-3">
                {xpActions.map((action, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-border p-3 hover:border-primary/20 transition-colors">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent shrink-0">
                      <action.icon className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-foreground flex-1">{action.action}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <Zap className="h-3 w-3 text-[hsl(var(--sim-warning))]" />
                      <span className="text-sm font-bold font-mono text-[hsl(var(--sim-warning))]">+{action.xp}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* XP Progress */}
              <div className="mt-5 rounded-xl border border-primary/20 bg-accent/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">{t('Level 3', 'Ниво 3')}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-primary">750 / 1000 XP</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full sim-gradient" style={{ width: '75%' }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  {t('250 XP to Level 4 — Innovation Strategist', '250 XP до Ниво 4 — Стратег на иновациите')}
                </p>
              </div>
            </div>

            {/* Badges */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <Award className="h-5 w-5 text-primary" />
                <h3 className="font-display font-bold text-foreground">{t('Achievement Badges', 'Значки за постижения')}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge, i) => (
                  <div key={i} className="group flex flex-col items-center rounded-xl border border-border p-4 hover:border-primary/20 transition-all hover:shadow-md">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${badge.color} shadow-lg mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <badge.icon className="h-7 w-7 text-white" />
                    </div>
                    <p className="text-xs font-semibold text-foreground text-center">{badge.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 6: COURSE TIMELINE ═══════════════════ */}
      <section className="py-20 px-4 border-t border-border">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <SectionBadge label={t('6 Weeks', '6 Седмици')} />
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-4 mb-3">
              {t('Your 6-Week Learning Path', 'Вашият 6-седмичен учебен път')}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t('A structured curriculum from basics to pitching your startup.', 'Структурирана програма от основите до представянето на стартъп.')}
            </p>
          </div>

          {/* Desktop: 2-column grid */}
          <div className="hidden sm:grid grid-cols-2 gap-4">
            {courseWeeks.map((week, i) => (
              <div key={i} className="group flex gap-4 rounded-2xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl sim-gradient text-primary-foreground shadow-md shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <week.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-3 w-3 text-primary" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                      {t('Week', 'Седмица')} {week.week}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-foreground text-sm">{week.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{week.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: stacked */}
          <div className="sm:hidden space-y-3">
            {courseWeeks.map((week, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl sim-gradient text-primary-foreground shrink-0 shadow-md">
                  <week.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    {t('Week', 'Седмица')} {week.week}
                  </span>
                  <p className="text-sm font-semibold text-foreground">{week.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ INNOVATION SHOWCASE ═══════════════════ */}
      {isAdmin && <InnovationShowcase lang={lang} />}

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative py-24 px-4 border-t border-border overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/[0.03] blur-3xl" />
        </div>

        <div className="container mx-auto max-w-2xl text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="flex h-18 w-18 items-center justify-center rounded-2xl sim-gradient glow-primary shadow-2xl p-4">
                <Rocket className="h-9 w-9 text-primary-foreground" />
              </div>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            {t('Ready to Innovate?', 'Готови ли сте да иновирате?')}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {t(
              'Join the Digital Innovation Lab and start building your future today.',
              'Присъединете се към лабораторията за дигитални иновации и започнете да строите бъдещето си днес.'
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="sim-gradient border-0 text-base px-10 glow-primary" onClick={() => handleNav('/dashboard')}>
              {t('Start Your Innovation Journey', 'Започни своето иновационно пътешествие')} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Reusable section badge
function SectionBadge({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-accent px-3 py-1">
      <Zap className="h-3 w-3 text-primary" />
      <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default Index;
