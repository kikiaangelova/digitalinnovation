import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { Button } from '@/components/ui/button';
import AppHeader from '@/components/layout/AppHeader';
import SimulatorCard from '@/components/landing/SimulatorCard';
import { GraduationCap, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';

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

            {/* Business Simulator — expanded card */}
            <SimulatorCard />

            {/* Instant Feedback Card */}
            <button
              onClick={() => handleCardClick('/dashboard')}
              className="group rounded-xl border border-border bg-card p-6 text-center hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent mx-auto mb-4">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mb-2">{t.instantFeedback}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t.instantFeedbackDesc}</p>
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
