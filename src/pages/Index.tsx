import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { Button } from '@/components/ui/button';
import AppHeader from '@/components/layout/AppHeader';
import {
  GraduationCap, ArrowRight, Lightbulb, Search, Rocket, Brain,
  Sparkles, Presentation, Compass, Briefcase, Hammer, Palette, Crown,
  Trophy, BookOpen, FlaskConical, Target, TrendingUp, Mic,
  Award, Zap, Star, Shield, BarChart3, Calendar,
} from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const handleNav = (path: string) => {
    if (user) navigate(path);
    else navigate(`/auth?redirect=${encodeURIComponent(path)}`);
  };

  // JOURNEY STEPS
  const journeySteps = [
    { icon: Lightbulb, label: t('Discover Digital Innovation', 'Открий дигиталната иновация'), step: 1 },
    { icon: Search, label: t('Analyze Real Business Cases', 'Анализирай реални бизнес казуси'), step: 2 },
    { icon: Rocket, label: t('Build Your Startup Idea', 'Създай стартъп идея'), step: 3 },
    { icon: FlaskConical, label: t('Test Your Strategy', 'Тествай стратегията си'), step: 4 },
    { icon: Brain, label: t('Improve with AI Mentor', 'Подобри с AI ментор'), step: 5 },
    { icon: Presentation, label: t('Pitch Your Startup', 'Представи стартъпа си'), step: 6 },
  ];

  // ROLES
  const roles = [
    { icon: Compass, title: t('Digital Explorer', 'Дигитален изследовател'), desc: t('Learn key innovation concepts', 'Научи ключови концепции за иновации'), gradient: 'gradient-explorer' },
    { icon: Briefcase, title: t('Business Strategist', 'Бизнес стратег'), desc: t('Analyze real business cases', 'Анализирай реални бизнес казуси'), gradient: 'gradient-strategist' },
    { icon: Hammer, title: t('Startup Builder', 'Стартъп строител'), desc: t('Create a startup idea', 'Създай стартъп идея'), gradient: 'gradient-builder' },
    { icon: Palette, title: t('Product Designer', 'Продуктов дизайнер'), desc: t('Design your digital product', 'Проектирай дигитален продукт'), gradient: 'gradient-designer' },
    { icon: Crown, title: t('Startup Founder', 'Стартъп основател'), desc: t('Build and pitch your startup', 'Изгради и представи стартъпа си'), gradient: 'gradient-founder' },
  ];

  // LEVELS
  const levels = [
    { level: 1, title: t('Digital Explorer', 'Дигитален изследовател'), xp: '0', unlocks: t('Case studies access', 'Достъп до казуси') },
    { level: 2, title: t('Problem Solver', 'Решаващ проблеми'), xp: '200', unlocks: t('Industry map', 'Карта на индустрии') },
    { level: 3, title: t('Startup Builder', 'Стартъп строител'), xp: '500', unlocks: t('Startup idea builder', 'Създай стартъп идея') },
    { level: 4, title: t('Innovation Strategist', 'Стратег на иновациите'), xp: '1000', unlocks: t('Business simulator', 'Бизнес симулатор') },
    { level: 5, title: t('Startup Founder', 'Стартъп основател'), xp: '2000', unlocks: t('AI mentor & pitch', 'AI ментор и представяне') },
  ];

  // XP ACTIONS
  const xpActions = [
    { action: t('Complete a case study', 'Завършване на казус'), xp: 50, icon: BookOpen },
    { action: t('Finish simulator week', 'Завършване на седмица от симулатора'), xp: 100, icon: BarChart3 },
    { action: t('Submit startup idea', 'Предаване на стартъп идея'), xp: 200, icon: Rocket },
    { action: t('Earn a badge', 'Спечелване на значка'), xp: 75, icon: Award },
    { action: t('Complete all 6 weeks', 'Завършване на 6-те седмици'), xp: 500, icon: Trophy },
  ];

  // BADGES
  const badges = [
    { name: t('Innovation Explorer', 'Иноватор изследовател'), icon: Compass, color: 'from-blue-500 to-cyan-400' },
    { name: t('Startup Builder', 'Стартъп строител'), icon: Hammer, color: 'from-emerald-500 to-teal-400' },
    { name: t('Growth Hacker', 'Растеж хакер'), icon: TrendingUp, color: 'from-amber-500 to-orange-400' },
    { name: t('AI Innovator', 'AI Иноватор'), icon: Sparkles, color: 'from-purple-500 to-pink-400' },
    { name: t('Digital Strategist', 'Дигитален стратег'), icon: Target, color: 'from-rose-500 to-red-400' },
  ];

  // COURSE TIMELINE
  const courseWeeks = [
    { week: 1, title: t('Digital Innovation Basics', 'Основи на дигиталната иновация'), icon: Lightbulb },
    { week: 2, title: t('Industry Analysis', 'Анализ на индустрията'), icon: Search },
    { week: 3, title: t('Business Model', 'Бизнес модел'), icon: Briefcase },
    { week: 4, title: t('Product Design', 'Продуктов дизайн'), icon: Palette },
    { week: 5, title: t('Growth Strategy', 'Стратегия за растеж'), icon: TrendingUp },
    { week: 6, title: t('Startup Pitch', 'Стартъп представяне'), icon: Mic },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative py-28 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-accent/40 blur-3xl" />
        </div>

        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <div className="flex justify-center mb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl sim-gradient glow-primary shadow-2xl">
              <GraduationCap className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1.5 mb-6">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">
              {t('Gamified Learning Experience', 'Геймифицирано учебно изживяване')}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-5 leading-[1.1]">
            {t('Your Digital Innovation', 'Твоето дигитално')}
            <br />
            <span className="sim-gradient-text">{t('Lab Awaits', 'иновационно приключение')}</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            {t(
              'Master digital innovation through real case studies, build your startup idea, and test it in a business simulator — all gamified.',
              'Овладейте дигиталните иновации чрез реални казуси, създайте стартъп идея и я тествайте в бизнес симулатор — всичко геймифицирано.'
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
                  {t('Start Your Journey', 'Започни пътешествието')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-base px-8" onClick={() => navigate('/auth')}>
                  {t('Sign In', 'Вход')}
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 1: INNOVATION JOURNEY ═══════════════════ */}
      <section className="py-20 px-4 border-t border-border bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <Badge label={t('6 Steps', '6 Стъпки')} />
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-4 mb-3">
              {t('Digital Innovation Journey', 'Пътешествие в дигиталната иновация')}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t('Follow a clear path from discovery to pitching your own startup.', 'Следвайте ясен път от откриване до представяне на вашия стартъп.')}
            </p>
          </div>

          {/* Timeline - horizontal on desktop, vertical on mobile */}
          <div className="hidden md:flex items-start justify-between relative">
            {/* Connector line */}
            <div className="absolute top-7 left-[8%] right-[8%] h-0.5 bg-border z-0">
              <div className="absolute inset-0 sim-gradient rounded-full opacity-30" />
            </div>
            {journeySteps.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center w-[16%]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card border-2 border-primary/30 shadow-md mb-3 transition-transform hover:scale-110 hover:border-primary">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="inline-flex items-center justify-center h-5 w-5 rounded-full sim-gradient text-[10px] font-bold text-primary-foreground mb-2">
                  {step.step}
                </div>
                <p className="text-xs font-medium text-foreground leading-snug">{step.label}</p>
              </div>
            ))}
          </div>

          {/* Mobile timeline */}
          <div className="md:hidden space-y-4">
            {journeySteps.map((step, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl sim-gradient shrink-0">
                  <step.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    {t('Step', 'Стъпка')} {step.step}
                  </span>
                  <p className="text-sm font-medium text-foreground">{step.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 2: PLAYER ROLES ═══════════════════ */}
      <section className="py-20 px-4 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <Badge label={t('5 Roles', '5 Роли')} />
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-4 mb-3">
              {t('Your Role in the Innovation Lab', 'Вашата роля в иновационната лаборатория')}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t('Progress through roles as you develop real innovation skills.', 'Напредвайте през роли докато развивате реални умения за иновации.')}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {roles.map((role, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-border bg-card p-5 text-center hover:border-primary/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${role.gradient} mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <role.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-sm text-foreground mb-1">{role.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 3: LEVEL SYSTEM ═══════════════════ */}
      <section className="py-20 px-4 border-t border-border bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <Badge label={t('Progression', 'Прогресия')} />
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-4 mb-3">
              {t('Level Up Your Skills', 'Повишете нивото си')}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t('Each level unlocks new features and challenges.', 'Всяко ниво отключва нови функции и предизвикателства.')}
            </p>
          </div>

          <div className="space-y-3">
            {levels.map((lvl, i) => {
              const widthPct = ((i + 1) / levels.length) * 100;
              return (
                <div key={i} className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl sim-gradient text-sm font-bold text-primary-foreground shadow-md shrink-0">
                      {lvl.level}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-bold text-foreground text-sm">{lvl.title}</h3>
                        <span className="text-xs font-mono font-medium text-primary">{lvl.xp} XP</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <Shield className="inline h-3 w-3 mr-1 -mt-0.5" />
                        {t('Unlocks:', 'Отключва:')} {lvl.unlocks}
                      </p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full sim-gradient transition-all duration-700"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 4: XP POINT SYSTEM ═══════════════════ */}
      <section className="py-20 px-4 border-t border-border">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <Badge label="XP" />
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-4 mb-3">
              {t('Earn XP Points', 'Печелете XP точки')}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t('Every action earns experience points. Track your progress and compete.', 'Всяко действие носи точки опит. Проследявайте напредъка си.')}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {xpActions.map((action, i) => (
              <div key={i} className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-primary/30 transition-all hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent shrink-0 group-hover:bg-primary/10 transition-colors">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{action.action}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Zap className="h-3.5 w-3.5 text-[hsl(var(--sim-warning))]" />
                  <span className="text-sm font-bold font-mono text-[hsl(var(--sim-warning))]">+{action.xp}</span>
                </div>
              </div>
            ))}
          </div>

          {/* XP Progress Example */}
          <div className="mt-8 rounded-2xl border border-primary/20 bg-accent/50 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <span className="font-display font-bold text-foreground">{t('Example Progress', 'Примерен прогрес')}</span>
              </div>
              <span className="text-sm font-mono font-bold text-primary">750 / 1000 XP</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full sim-gradient transition-all duration-1000" style={{ width: '75%' }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {t('250 XP to Level 4 — Innovation Strategist', '250 XP до Ниво 4 — Стратег на иновациите')}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 5: BADGES ═══════════════════ */}
      <section className="py-20 px-4 border-t border-border bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <Badge label={t('Achievements', 'Постижения')} />
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-4 mb-3">
              {t('Earn Achievement Badges', 'Спечелете значки за постижения')}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t('Complete challenges to unlock badges and showcase your skills.', 'Завършете предизвикателства, за да отключите значки.')}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {badges.map((badge, i) => (
              <div key={i} className="group flex flex-col items-center w-28">
                <div className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${badge.color} shadow-lg mb-3 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                  <badge.icon className="h-8 w-8 text-white" />
                </div>
                <p className="text-xs font-semibold text-foreground text-center leading-snug">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 6: COURSE TIMELINE ═══════════════════ */}
      <section className="py-20 px-4 border-t border-border">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <Badge label={t('6 Weeks', '6 Седмици')} />
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-4 mb-3">
              {t('Your 6-Week Learning Path', 'Вашият 6-седмичен път')}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t('A structured curriculum from basics to pitching your startup.', 'Структурирана програма от основите до представянето на стартъп.')}
            </p>
          </div>

          <div className="relative">
            {/* Vertical connector */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden sm:block">
              <div className="absolute inset-0 sim-gradient opacity-20 rounded-full" />
            </div>

            <div className="space-y-4">
              {courseWeeks.map((week, i) => (
                <div key={i} className="flex items-center gap-5 group">
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl sim-gradient text-primary-foreground shadow-md shrink-0 group-hover:scale-110 transition-transform">
                    <week.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 rounded-2xl border border-border bg-card p-4 group-hover:border-primary/30 group-hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                        <Calendar className="h-3 w-3" />
                        {t('Week', 'Седмица')} {week.week}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-foreground text-sm mt-1">{week.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="py-24 px-4 border-t border-border bg-muted/30">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl sim-gradient glow-primary">
              <Rocket className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            {t('Ready to Innovate?', 'Готови ли сте да иновирате?')}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {t(
              'Join the Digital Innovation Lab and start building your future today.',
              'Присъединете се към лабораторията за дигитални иновации и започнете да строите бъдещето си.'
            )}
          </p>
          <Button size="lg" className="sim-gradient border-0 text-base px-10 glow-primary" onClick={() => handleNav('/dashboard')}>
            {t('Enter the Lab', 'Влез в лабораторията')} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

// Small reusable badge component for section labels
function Badge({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-accent px-3 py-1">
      <Zap className="h-3 w-3 text-primary" />
      <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default Index;
