import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import AppHeader from '@/components/layout/AppHeader';
import { GraduationCap, BookOpen, Play, ArrowRight, CheckCircle2 } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

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
            DigiInnov Case Lab
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            Master digital innovation through hands-on case studies and real-time business simulation. Analyze, decide, learn.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user ? (
              <Button asChild size="lg" className="sim-gradient border-0 text-base px-8">
                <Link to="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="sim-gradient border-0 text-base px-8">
                  <Link to="/auth?mode=signup">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base px-8">
                  <Link to="/auth">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3">
            <Link to={user ? '/cases' : '/auth?redirect=/cases'} className="group rounded-lg border border-border bg-card p-6 text-center hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">Case Studies</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Work through multi-step business cases with real-world scenarios, exhibits, and rubric-graded questions.
              </p>
              <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                Browse Cases <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
            <Link to={user ? '/simulator' : '/auth?redirect=/simulator'} className="group rounded-lg border border-border bg-card p-6 text-center hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent mx-auto mb-4">
                <Play className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">Business Simulator</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Run a virtual startup over 8 weeks. Make strategic decisions that affect KPIs in real-time.
              </p>
              <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                Launch Simulator <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
            <Link to={user ? '/dashboard' : '/auth?redirect=/dashboard'} className="group rounded-lg border border-border bg-card p-6 text-center hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent mx-auto mb-4">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">Instant Feedback</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get auto-graded results, model answers, and instructor feedback to accelerate your learning.
              </p>
              <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                View Dashboard <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
