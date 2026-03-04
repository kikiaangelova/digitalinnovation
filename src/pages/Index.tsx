import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { Button } from '@/components/ui/button';
import AppHeader from '@/components/layout/AppHeader';
import SimulatorCard from '@/components/landing/SimulatorCard';
import { GraduationCap, BookOpen, ArrowRight, CheckCircle2, Lightbulb, Rocket, BarChart3, Award } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const handleCardClick = (path: string) => {
    if (user) navigate(path);
    else navigate(`/auth?redirect=${encodeURIComponent(path)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Hero */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="flex justify-center mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl sim-gradient shadow-lg">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-5 leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user ? (
              <Button size="lg" className="sim-gradient border-0 text-base px-8" onClick={() => navigate('/dashboard')}>
                {t.goToDashboard} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <>
                <Button size="lg" className="sim-gradient border-0 text-base px-8" onClick={() => navigate('/auth?mode=signup')}>
                  {t.getStarted} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-base px-8" onClick={() => navigate('/auth')}>
                  {t.signIn}
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Learning Journey */}
      <section className="py-16 px-4 border-t border-border">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">
              {t.learningJourney}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t.learningJourneyDesc}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: Lightbulb, title: t.level1Title, desc: t.level1Desc, color: 'bg-accent' },
              { icon: Rocket, title: t.level2Title, desc: t.level2Desc, color: 'bg-accent' },
              { icon: BarChart3, title: t.level3Title, desc: t.level3Desc, color: 'bg-accent' },
            ].map((level, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 sim-gradient" />
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${level.color} mb-4`}>
                  <level.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-base text-foreground mb-2">{level.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{level.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3 items-start">
            {/* Case Studies Card */}
            <button
              onClick={() => handleCardClick('/cases')}
              className="group rounded-xl border border-border bg-card p-6 text-center hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mb-2">{t.caseStudies}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t.caseStudiesDesc}</p>
              <span className="inline-flex items-center text-sm font-medium text-primary group-hover:underline">
                {t.browseCases} <ArrowRight className="ml-1 h-3 w-3" />
              </span>
            </button>

            {/* Business Simulator */}
            <SimulatorCard />

            {/* Gamification Card */}
            <button
              onClick={() => handleCardClick('/dashboard')}
              className="group rounded-xl border border-border bg-card p-6 text-center hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent mx-auto mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mb-2">{t.gamification}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t.earnXp}</p>
              <span className="inline-flex items-center text-sm font-medium text-primary group-hover:underline">
                {t.viewDashboard} <ArrowRight className="ml-1 h-3 w-3" />
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
