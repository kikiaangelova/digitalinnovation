import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen, Clock, Target, Users, FileText, CheckSquare,
  ArrowRight, ChevronRight, Lightbulb, ListChecks, BarChart3
} from 'lucide-react';

interface CaseStudy {
  id: string;
  title: string;
  description: string | null;
  topic: string | null;
  difficulty: string;
  est_minutes: number | null;
  outcomes: string[] | null;
}

interface CaseStep {
  id: string;
  title: string;
  step_order: number;
}

export default function CasePreview() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [cs, setCs] = useState<CaseStudy | null>(null);
  const [steps, setSteps] = useState<CaseStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const [{ data: caseData }, { data: stepsData }] = await Promise.all([
        supabase.from('case_studies').select('id, title, description, topic, difficulty, est_minutes, outcomes').eq('id', id).single(),
        supabase.from('case_steps').select('id, title, step_order').eq('case_study_id', id).order('step_order'),
      ]);
      setCs(caseData);
      setSteps(stepsData || []);
      setLoading(false);
    };
    load();
  }, [id]);

  const diffColor = (d: string) => {
    if (d === 'beginner') return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    if (d === 'intermediate') return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    return 'bg-red-500/10 text-red-600 border-red-500/20';
  };

  const diffLabel = (d: string) => {
    if (d === 'beginner') return t.beginner;
    if (d === 'intermediate') return t.intermediate;
    return t.advanced;
  };

  if (loading) return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex items-center justify-center py-24 text-muted-foreground">{t.loadingCases}</div>
    </div>
  );

  if (!cs) return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex items-center justify-center py-24 text-muted-foreground">{t.noCasesFound}</div>
    </div>
  );

  const handleStart = () => {
    if (user) navigate(`/case/${id}`);
    else navigate(`/auth?redirect=${encodeURIComponent(`/case/${id}`)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto max-w-3xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">{t.appName}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/cases" className="hover:text-foreground transition-colors">{t.caseLibrary}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium truncate max-w-[200px]">{cs.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <Badge variant="outline" className="text-xs">{t.prevTypeCaseStudy}</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">{cs.title}</h1>
          {cs.description && <p className="text-base text-muted-foreground leading-relaxed">{cs.description}</p>}
        </div>

        {/* Info badges */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Badge variant="outline" className={`text-sm px-3 py-1 ${diffColor(cs.difficulty)}`}>
            <BarChart3 className="h-3.5 w-3.5 mr-1.5" /> {diffLabel(cs.difficulty)}
          </Badge>
          {cs.est_minutes && (
            <Badge variant="outline" className="text-sm px-3 py-1">
              <Clock className="h-3.5 w-3.5 mr-1.5" /> {cs.est_minutes} {t.min}
            </Badge>
          )}
          <Badge variant="outline" className="text-sm px-3 py-1">
            <Users className="h-3.5 w-3.5 mr-1.5" /> {t.prevWorkType}
          </Badge>
        </div>

        <Separator className="mb-8" />

        {/* Learning Objectives */}
        {cs.outcomes && cs.outcomes.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-display font-semibold text-foreground">{t.prevObjectives}</h2>
            </div>
            <Card className="p-5 border-border">
              <p className="text-sm font-medium text-foreground/80 mb-3">{t.prevObjectivesIntro}</p>
              <ul className="space-y-2">
                {cs.outcomes.map((o, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckSquare className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        )}

        {/* What you will do */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-display font-semibold text-foreground">{t.prevWhatYouDo}</h2>
          </div>
          <Card className="p-5 border-border">
            <ul className="space-y-2">
              {[t.prevDo1, t.prevDo2, t.prevDo3, t.prevDo4, t.prevDo5].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* Case Structure */}
        {steps.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <ListChecks className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-display font-semibold text-foreground">{t.prevStructure}</h2>
            </div>
            <Card className="p-5 border-border">
              <div className="space-y-2.5">
                {steps.map((step, i) => (
                  <div key={step.id} className="flex items-center gap-3 text-sm">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 shrink-0 text-xs font-bold text-primary">
                      {i + 1}
                    </div>
                    <span className="text-muted-foreground">{step.title}</span>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Deliverables */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-display font-semibold text-foreground">{t.prevDeliverables}</h2>
          </div>
          <Card className="p-5 border-border">
            <p className="text-sm font-medium text-foreground/80 mb-3">{t.prevDeliverablesIntro}</p>
            <ul className="space-y-2">
              {[t.prevDeliv1, t.prevDeliv2].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckSquare className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* Start Button */}
        <Button size="lg" className="w-full sim-gradient border-0 text-base font-semibold py-6" onClick={handleStart}>
          {t.prevStartCase} <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
