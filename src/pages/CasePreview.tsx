import { useEffect, useState } from 'react';
import { LearningPhaseBar, WhatYouWillLearn, CASE_STUDY_OUTCOMES } from '@/components/learning/LearningStructure';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { CASE_TOPIC_TO_MODULE, LEARNING_MODULES } from '@/data/learning-modules';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  BookOpen, Clock, Target, Users, FileText, CheckSquare,
  ArrowRight, ChevronRight, Lightbulb, ListChecks, BarChart3,
  Building2, Brain, TrendingUp, Rocket, PenTool, Award,
  CheckCircle2, Lock, GraduationCap,
} from 'lucide-react';

interface CaseStudy {
  id: string;
  title: string; title_bg: string | null;
  description: string | null; description_bg: string | null;
  topic: string | null; topic_bg: string | null;
  difficulty: string;
  est_minutes: number | null;
  outcomes: string[] | null; outcomes_bg: string[] | null;
}

interface CaseStep {
  id: string;
  title: string; title_bg: string | null;
  step_order: number;
}

const SECTION_ICONS: Record<number, React.ElementType> = {
  0: BookOpen, 1: Building2, 2: TrendingUp, 3: BarChart3,
  4: Brain, 5: PenTool, 6: Rocket, 7: Award,
};

export default function CasePreview() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const tx = (en: string | null | undefined, bg: string | null | undefined) => lang === 'bg' ? (bg || en || '') : (en || '');
  const tl = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const [cs, setCs] = useState<CaseStudy | null>(null);
  const [steps, setSteps] = useState<CaseStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [completionStatus, setCompletionStatus] = useState<'not_started' | 'in_progress' | 'completed'>('not_started');
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [score, setScore] = useState<{ total: number; max: number } | null>(null);
  const [theoryBanner, setTheoryBanner] = useState<{ slug: string; titleEn: string; titleBg: string } | null>(null);
  const [theoryCompleted, setTheoryCompleted] = useState<{ slug: string; titleEn: string; titleBg: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const [{ data: caseData }, { data: stepsData }] = await Promise.all([
        supabase.from('case_studies').select('id, title, title_bg, description, description_bg, topic, topic_bg, difficulty, est_minutes, outcomes, outcomes_bg').eq('id', id).maybeSingle(),
        supabase.from('case_steps').select('id, title, title_bg, step_order').eq('case_study_id', id).order('step_order'),
      ]);
      setCs(caseData as CaseStudy | null);
      setSteps((stepsData as CaseStep[]) || []);

      // Check completion status
      if (user) {
        const [sessionRes, submissionRes] = await Promise.all([
          supabase.from('case_sessions').select('completion_status, updated_at').eq('case_id', id).eq('user_id', user.id).maybeSingle(),
          supabase.from('submissions').select('total_score, max_score, submitted_at').eq('case_study_id', id).eq('user_id', user.id).eq('is_draft', false).maybeSingle(),
        ]);
        if (sessionRes.data?.completion_status === 'completed') {
          setCompletionStatus('completed');
          setCompletedAt(sessionRes.data.updated_at);
        } else if (sessionRes.data) {
          setCompletionStatus('in_progress');
        }
        if (submissionRes.data) {
          setScore({ total: submissionRes.data.total_score || 0, max: submissionRes.data.max_score || 0 });
          if (submissionRes.data.submitted_at) {
            setCompletionStatus('completed');
            setCompletedAt(submissionRes.data.submitted_at);
          }
        }
      }

      // Check for recommended theory module
      if (caseData?.topic && user) {
        const moduleSlug = Object.entries(CASE_TOPIC_TO_MODULE).find(
          ([key]) => caseData.topic?.toLowerCase().includes(key.toLowerCase())
        )?.[1];

        if (moduleSlug) {
          const mod = LEARNING_MODULES.find(m => m.slug === moduleSlug);
          if (mod) {
            // Check if module DB entry exists + user completed it
            const { data: dbMod } = await supabase.from('learning_modules')
              .select('id').eq('slug', moduleSlug).maybeSingle();
            if (dbMod) {
              const { data: response } = await supabase.from('learning_module_responses')
                .select('completed_at').eq('module_id', dbMod.id).eq('user_id', user.id).maybeSingle();
              if (!response?.completed_at) {
                setTheoryBanner({ slug: moduleSlug, titleEn: mod.title_en, titleBg: mod.title_bg });
              }
            } else {
              // Module not in DB yet = not completed
              setTheoryBanner({ slug: moduleSlug, titleEn: mod.title_en, titleBg: mod.title_bg });
            }
          }
        }
      }

      setLoading(false);
    };
    load();
  }, [id, user]);

  // Check if retake is allowed (48h cooldown)
  const canRetake = (() => {
    if (completionStatus !== 'completed' || !completedAt) return true;
    const completedTime = new Date(completedAt).getTime();
    const hoursSince = (Date.now() - completedTime) / (1000 * 60 * 60);
    return hoursSince >= 48;
  })();

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
    <div className="min-h-screen bg-background"><AppHeader />
      <div className="flex items-center justify-center py-24 text-muted-foreground">{t.loadingCases}</div>
    </div>
  );
  if (!cs) return (
    <div className="min-h-screen bg-background"><AppHeader />
      <div className="flex items-center justify-center py-24 text-muted-foreground">{t.noCasesFound}</div>
    </div>
  );

  const handleStart = () => {
    if (user) navigate(`/case/${id}`);
    else navigate(`/auth?redirect=${encodeURIComponent(`/case/${id}`)}`);
  };

  const outcomes = lang === 'bg' ? (cs.outcomes_bg || cs.outcomes) : cs.outcomes;
  const scorePercent = score && score.max > 0 ? Math.round((score.total / score.max) * 100) : null;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">{t.appName}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/cases" className="hover:text-foreground transition-colors">{t.caseLibrary}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium truncate max-w-[200px]">{tx(cs.title, cs.title_bg)}</span>
        </nav>

        {/* Completion banner */}
        {completionStatus === 'completed' && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 mb-6 flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                {tl('Case Completed', 'Казусът е завършен')}
                {scorePercent !== null && <span className="ml-2 text-muted-foreground font-normal">· {scorePercent}%</span>}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {tl(
                  'Review your analysis or explore another case.',
                  'Прегледай анализа си или разгледай друг казус.'
                )}
              </p>
            </div>
            <Button variant="outline" size="sm" asChild className="shrink-0">
              <Link to={`/case/${id}/results`}>{tl('View Results', 'Виж резултатите')}</Link>
            </Button>
          </div>
        )}

        {/* Recommended Theory Banner */}
        {theoryBanner && completionStatus !== 'completed' && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 mb-6 flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-amber-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                {tl('Prepare for this case', 'Подгответе се за този казус')}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {tl(
                  `Study "${theoryBanner.titleEn}" first for better analysis.`,
                  `Научете „${theoryBanner.titleBg}" първо за по-добър анализ.`
                )}
              </p>
            </div>
            <Button variant="outline" size="sm" asChild className="shrink-0">
              <Link to={`/learn/${theoryBanner.slug}`}>
                <BookOpen className="h-3.5 w-3.5 mr-1" />
                {tl('Study Theory', 'Учи теория')}
              </Link>
            </Button>
          </div>
        )}

        <div className="rounded-xl border border-border bg-card overflow-hidden mb-8">
          <div className="sim-gradient px-6 py-8 sm:px-8 sm:py-10">
            <Badge className="mb-3 bg-white/20 text-primary-foreground border-white/30 text-xs font-sans uppercase tracking-wider">
              {tl('Case Study', 'Бизнес казус')}
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary-foreground mb-3">{tx(cs.title, cs.title_bg)}</h1>
            {(cs.description || cs.description_bg) && (
              <p className="text-sm text-primary-foreground/80 leading-relaxed max-w-xl">{tx(cs.description, cs.description_bg)}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 px-6 py-4 sm:px-8 border-t border-border bg-muted/30">
            <div className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className={diffColor(cs.difficulty)}>{diffLabel(cs.difficulty)}</Badge>
            </div>
            {(cs.topic || cs.topic_bg) && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground font-medium">{tx(cs.topic, cs.topic_bg)}</span>
              </div>
            )}
            {cs.est_minutes && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" /><span>{cs.est_minutes} {t.min}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" /><span>{t.prevWorkType}</span>
            </div>
          </div>
        </div>

        {/* Learning Structure: What You Will Learn */}
        <section className="mb-8 space-y-4">
          <LearningPhaseBar currentPhase="learn" lang={lang as 'en' | 'bg'} />
          {outcomes && outcomes.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-display font-semibold text-foreground">{t.prevObjectives}</h2>
              </div>
              <Card className="p-5 border-border">
                <p className="text-sm font-medium text-foreground/80 mb-3">{t.prevObjectivesIntro}</p>
                <ul className="space-y-2">
                  {outcomes.map((o, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckSquare className="h-4 w-4 text-primary shrink-0 mt-0.5" /><span>{o}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </>
          )}
          {(!outcomes || outcomes.length === 0) && (
            <WhatYouWillLearn outcomes={CASE_STUDY_OUTCOMES} lang={lang as 'en' | 'bg'} activityType={{ en: 'Case Study', bg: 'Казус' }} />
          )}
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-display font-semibold text-foreground">{tl('Case Methodology', 'Методология на казуса')}</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {tl(
              'Each case follows a 5-part structure designed for real business learning:',
              'Всеки казус следва 5-етапна структура за реално бизнес обучение:'
            )}
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: Building2, en: '1. Context — Company, industry & situation', bg: '1. Контекст — Компания, индустрия и ситуация' },
              { icon: Target, en: '2. Strategic Problem — Key decision to make', bg: '2. Стратегически проблем — Ключово решение' },
              { icon: Brain, en: '3. Analysis — Competitors, strengths, risks & opportunities', bg: '3. Анализ — Конкуренти, силни страни, рискове и възможности' },
              { icon: PenTool, en: '4. Decision — Your strategic choice', bg: '4. Решение — Вашият стратегически избор' },
              { icon: Lightbulb, en: '5. Case Insight — Key lesson & learning outcome', bg: '5. Извод — Ключов урок и учебен резултат' },
            ].map((item, i) => (
              <Card key={i} className="flex items-center gap-3 p-4 border-border hover:border-primary/30 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-foreground">{tl(item.en, item.bg)}</span>
              </Card>
            ))}
          </div>
        </section>

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
                      <div className="flex flex-col items-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/30 shrink-0">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        {!isLast && <div className="w-px flex-1 bg-border my-1" />}
                      </div>
                      <div className="pb-5">
                        <p className="text-xs text-muted-foreground font-sans uppercase tracking-wider mb-0.5">
                          {tl('Section', 'Секция')} {i + 1}
                        </p>
                        <p className="text-sm font-medium text-foreground">{tx(step.title, step.title_bg)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </section>
        )}

        <section className="mb-8">
          <Card className="p-5 border-primary/20 bg-accent">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg sim-gradient shrink-0">
                <Rocket className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">
                  {tl('Connect to Your Startup', 'Свържи с твоя стартъп')}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tl(
                    'After completing this case, you can apply your analysis to improve your startup project — refining your problem definition, value proposition, and business model.',
                    'След приключване на казуса можеш да приложиш анализа си, за да подобриш стартъп проекта си — дефиниция на проблема, стойностно предложение и бизнес модел.'
                  )}
                </p>
              </div>
            </div>
          </Card>
        </section>

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
                  <CheckSquare className="h-4 w-4 text-primary shrink-0 mt-0.5" /><span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <section className="mb-10">
          <Card className="p-5 border-border">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="font-display font-semibold text-foreground">{tl('Scoring & XP', 'Оценяване и XP')}</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: tl('Analysis Quality', 'Качество на анализа'), desc: tl('Depth of strategic thinking', 'Дълбочина на стратегическото мислене') },
                { label: tl('Innovation Idea', 'Иновативна идея'), desc: tl('Creativity of digital solution', 'Креативност на дигиталното решение') },
                { label: tl('XP Reward', 'XP Награда'), desc: tl('Up to 130 XP based on grade', 'До 130 XP спрямо оценката') },
              ].map((item, i) => (
                <div key={i} className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* CTA Button with completion lock */}
        {completionStatus === 'completed' && !canRetake ? (
          <div className="space-y-3">
            <Button size="lg" className="w-full text-base font-semibold py-6" disabled>
              <Lock className="mr-2 h-5 w-5" />
              {tl('Case completed — retake available in 48h', 'Казусът е завършен — повторно след 48ч')}
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" asChild>
                <Link to={`/case/${id}/results`}>{tl('Review Your Analysis', 'Преглед на анализа')}</Link>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link to="/cases">{tl('Explore Other Cases', 'Разгледай други казуси')}</Link>
              </Button>
            </div>
          </div>
        ) : (
          <Button size="lg" className="w-full sim-gradient border-0 text-base font-semibold py-6"
            onClick={handleStart} disabled={steps.length === 0}>
            {steps.length === 0
              ? tl('Coming Soon', 'Очаквайте скоро')
              : completionStatus === 'completed'
                ? <>{tl('Retake Case', 'Повтори казуса')} <ArrowRight className="ml-2 h-5 w-5" /></>
                : completionStatus === 'in_progress'
                  ? <>{tl('Continue Case', 'Продължи казуса')} <ArrowRight className="ml-2 h-5 w-5" /></>
                  : <>{t.prevStartCase} <ArrowRight className="ml-2 h-5 w-5" /></>}
          </Button>
        )}
      </div>
    </div>
  );
}
