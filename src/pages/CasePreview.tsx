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
  ArrowRight, ChevronRight, Lightbulb, ListChecks, BarChart3,
  Building2, Brain, TrendingUp, Rocket, PenTool, Award,
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

const SECTION_ICONS: Record<number, React.ElementType> = {
  0: BookOpen,
  1: Building2,
  2: TrendingUp,
  3: BarChart3,
  4: Brain,
  5: PenTool,
  6: Rocket,
  7: Award,
};

export default function CasePreview() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const [cs, setCs] = useState<CaseStudy | null>(null);
  const [steps, setSteps] = useState<CaseStep[]>([]);
  const [loading, setLoading] = useState(true);

  const tx = (en: string, bg: string) => lang === 'bg' ? bg : en;

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

        {/* Hero header — MIT/HBS style */}
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-8">
          <div className="sim-gradient px-6 py-8 sm:px-8 sm:py-10">
            <Badge className="mb-3 bg-white/20 text-primary-foreground border-white/30 text-xs font-sans uppercase tracking-wider">
              {tx('Case Study', 'Бизнес казус')}
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary-foreground mb-3">{cs.title}</h1>
            {cs.description && (
              <p className="text-sm text-primary-foreground/80 leading-relaxed max-w-xl">{cs.description}</p>
            )}
          </div>

          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-4 px-6 py-4 sm:px-8 border-t border-border bg-muted/30">
            <div className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className={diffColor(cs.difficulty)}>{diffLabel(cs.difficulty)}</Badge>
            </div>
            {cs.topic && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground font-medium">{cs.topic}</span>
              </div>
            )}
            {cs.est_minutes && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{cs.est_minutes} {t.min}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{t.prevWorkType}</span>
            </div>
          </div>
        </div>

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

        {/* Case methodology */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-display font-semibold text-foreground">
              {tx('Case Methodology', 'Методология на казуса')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: BookOpen, en: 'Read & research the business context', bg: 'Прочетете и проучете бизнес контекста' },
              { icon: BarChart3, en: 'Analyze industry data & exhibits', bg: 'Анализирайте данни и експонати' },
              { icon: Brain, en: 'Answer strategic analysis questions', bg: 'Отговорете на стратегически въпроси' },
              { icon: Rocket, en: 'Propose your innovation solution', bg: 'Предложете иновативно решение' },
            ].map((item, i) => (
              <Card key={i} className="flex items-center gap-3 p-4 border-border hover:border-primary/30 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-foreground">{tx(item.en, item.bg)}</span>
              </Card>
            ))}
          </div>
        </section>

        {/* Case Structure — timeline style */}
        {steps.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <ListChecks className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-display font-semibold text-foreground">{t.prevStructure}</h2>
            </div>
            <Card className="p-5 border-border">
              <div className="space-y-0">
                {steps.map((step, i) => {
                  const Icon = SECTION_ICONS[i] || FileText;
                  const isLast = i === steps.length - 1;
                  return (
                    <div key={step.id} className="flex gap-4">
                      {/* Timeline line */}
                      <div className="flex flex-col items-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/30 shrink-0">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        {!isLast && <div className="w-px flex-1 bg-border my-1" />}
                      </div>
                      <div className={`pb-5 ${isLast ? '' : ''}`}>
                        <p className="text-xs text-muted-foreground font-sans uppercase tracking-wider mb-0.5">
                          {tx('Section', 'Секция')} {i + 1}
                        </p>
                        <p className="text-sm font-medium text-foreground">{step.title}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </section>
        )}

        {/* Startup connection callout */}
        <section className="mb-8">
          <Card className="p-5 border-primary/20 bg-accent">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg sim-gradient shrink-0">
                <Rocket className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">
                  {tx('Connect to Your Startup', 'Свържете с вашия стартъп')}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tx(
                    'After completing this case, you\'ll apply your analysis to improve your own startup project — refining your problem definition, value proposition, and business model.',
                    'След приключване на казуса ще приложите анализа си, за да подобрите собствения си стартъп проект — дефиниция на проблема, стойностно предложение и бизнес модел.'
                  )}
                </p>
              </div>
            </div>
          </Card>
        </section>

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

        {/* Scoring info */}
        <section className="mb-10">
          <Card className="p-5 border-border">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="font-display font-semibold text-foreground">
                {tx('Scoring & XP', 'Оценяване и XP')}
              </h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: tx('Analysis Quality', 'Качество на анализа'), desc: tx('Depth of strategic thinking', 'Дълбочина на стратегическото мислене') },
                { label: tx('Innovation Idea', 'Иновативна идея'), desc: tx('Creativity of digital solution', 'Креативност на дигиталното решение') },
                { label: tx('XP Reward', 'XP Награда'), desc: tx('+50 XP on completion', '+50 XP при завършване') },
              ].map((item, i) => (
                <div key={i} className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
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
