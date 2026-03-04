import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen, Search, Lightbulb, Palette, TrendingUp, Presentation,
  CheckCircle2, ArrowRight, Lock, AlertCircle, Play, FileText, Rocket
} from 'lucide-react';
import { toast } from 'sonner';

/* ------------------------------------------------------------------ */
/* Stage definitions                                                   */
/* ------------------------------------------------------------------ */
interface Stage {
  id: number;
  icon: React.ElementType;
  en: string;
  bg: string;
  descEn: string;
  descBg: string;
  milestoneEn: string;
  milestoneBg: string;
  learnPath: string;
  casePath: string;
  simPath: string;
  /** Which startup-project section maps to this stage */
  startupKey?: string;
}

const STAGES: Stage[] = [
  {
    id: 1, icon: BookOpen,
    en: 'Digital Innovation Basics', bg: 'Основи на дигиталните иновации',
    descEn: 'Learn key concepts of digital transformation and innovation.',
    descBg: 'Научете ключовите концепции за дигитална трансформация и иновации.',
    milestoneEn: 'Complete introductory case study',
    milestoneBg: 'Завършете уводния казус',
    learnPath: '/about', casePath: '/cases', simPath: '/simulator',
  },
  {
    id: 2, icon: Search,
    en: 'Industry & Competitor Analysis', bg: 'Анализ на индустрията и конкуренцията',
    descEn: 'Analyze industries and identify digital opportunities.',
    descBg: 'Анализирайте индустрии и идентифицирайте дигитални възможности.',
    milestoneEn: 'Submit Opportunity Analysis',
    milestoneBg: 'Подайте анализ на възможностите',
    learnPath: '/industries', casePath: '/cases', simPath: '/simulator',
    startupKey: 'problem',
  },
  {
    id: 3, icon: Lightbulb,
    en: 'Startup Idea & Value Proposition', bg: 'Стартъп идея и стойностно предложение',
    descEn: 'Define your startup problem, customer, and value proposition.',
    descBg: 'Дефинирайте проблема, клиента и стойностното предложение.',
    milestoneEn: 'Submit Value Proposition',
    milestoneBg: 'Подайте стойностно предложение',
    learnPath: '/about', casePath: '/cases', simPath: '/simulator',
    startupKey: 'value_proposition',
  },
  {
    id: 4, icon: Palette,
    en: 'Product Design (MVP)', bg: 'Продуктов дизайн (MVP)',
    descEn: 'Design and describe your minimum viable product.',
    descBg: 'Проектирайте и опишете минималния жизнеспособен продукт.',
    milestoneEn: 'Submit MVP Design',
    milestoneBg: 'Подайте MVP дизайн',
    learnPath: '/about', casePath: '/cases', simPath: '/simulator',
    startupKey: 'digital_product',
  },
  {
    id: 5, icon: TrendingUp,
    en: 'Business Model & Marketing Strategy', bg: 'Бизнес модел и маркетинг стратегия',
    descEn: 'Build your business model and plan marketing channels.',
    descBg: 'Изградете бизнес модел и планирайте маркетинг канали.',
    milestoneEn: 'Submit Business Model & Marketing',
    milestoneBg: 'Подайте бизнес модел и маркетинг',
    learnPath: '/about', casePath: '/cases', simPath: '/simulator',
    startupKey: 'business_model',
  },
  {
    id: 6, icon: Presentation,
    en: 'Startup Pitch', bg: 'Стартъп представяне',
    descEn: 'Prepare and submit your final startup pitch.',
    descBg: 'Подгответе и подайте финалното стартъп представяне.',
    milestoneEn: 'Submit Final Startup Pitch',
    milestoneBg: 'Подайте финално стартъп представяне',
    learnPath: '/about', casePath: '/cases', simPath: '/simulator',
    startupKey: 'final_pitch',
  },
];

/* ------------------------------------------------------------------ */
/* Status types                                                        */
/* ------------------------------------------------------------------ */
type StageStatus = 'not_started' | 'in_progress' | 'completed';

function getStatusBadge(status: StageStatus, lang: 'en' | 'bg') {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  switch (status) {
    case 'completed':
      return <Badge className="bg-sim-success/15 text-sim-success border-0 text-xs"><CheckCircle2 className="h-3 w-3 mr-1" />{t('Completed', 'Завършено')}</Badge>;
    case 'in_progress':
      return <Badge className="bg-sim-warning/15 text-sim-warning border-0 text-xs"><Play className="h-3 w-3 mr-1" />{t('In Progress', 'В процес')}</Badge>;
    default:
      return <Badge variant="outline" className="text-xs text-muted-foreground">{t('Not Started', 'Незапочнато')}</Badge>;
  }
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */
export default function LearningJourney() {
  const { user, loading: authLoading } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const [casesCompleted, setCasesCompleted] = useState(0);
  const [casesTotal, setCasesTotal] = useState(0);
  const [startupProject, setStartupProject] = useState<any>(null);
  const [simProgress, setSimProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/auth?redirect=/journey'); return; }
    const fetch = async () => {
      const [casesRes, subsRes, projRes, simRes] = await Promise.all([
        supabase.from('case_studies').select('id').eq('published', true),
        supabase.from('submissions').select('case_study_id, is_draft').eq('user_id', user.id).eq('is_draft', false),
        supabase.from('startup_projects').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('simulator_progress').select('current_week, is_complete').eq('user_id', user.id).maybeSingle(),
      ]);
      setCasesTotal((casesRes.data || []).length);
      setCasesCompleted((subsRes.data || []).length);
      setStartupProject(projRes.data || null);
      setSimProgress(simRes.data || null);
      setLoading(false);
    };
    fetch();
  }, [user, authLoading, navigate]);

  /* ---- derive stage statuses ---- */
  const startupSections = ['problem', 'customer', 'value_proposition', 'digital_product', 'business_model', 'growth_strategy', 'final_pitch'];
  const sectionFilled = (key: string) => startupProject ? ((startupProject as any)[key] || '').trim().length > 20 : false;

  function stageStatus(stage: Stage): StageStatus {
    if (stage.id === 1) {
      if (casesCompleted >= 1) return 'completed';
      return casesTotal > 0 ? 'in_progress' : 'not_started';
    }
    if (stage.startupKey) {
      const filled = sectionFilled(stage.startupKey);
      if (stage.id === 5) {
        // business model + growth strategy
        if (sectionFilled('business_model') && sectionFilled('growth_strategy')) return 'completed';
        if (sectionFilled('business_model') || sectionFilled('growth_strategy')) return 'in_progress';
        return 'not_started';
      }
      if (stage.id === 6) {
        if (startupProject?.is_submitted) return 'completed';
        if (sectionFilled('final_pitch')) return 'in_progress';
        return 'not_started';
      }
      if (filled) return 'completed';
      // check if any earlier related section is filled → in_progress
      if (stage.id === 2 && (sectionFilled('problem') || sectionFilled('customer'))) return 'in_progress';
      if (stage.id === 3 && sectionFilled('customer')) return 'in_progress';
      if (stage.id === 4 && sectionFilled('digital_product')) return 'in_progress';
    }
    return 'not_started';
  }

  const statuses = STAGES.map(s => stageStatus(s));
  const completedCount = statuses.filter(s => s === 'completed').length;
  const overallPct = Math.round((completedCount / STAGES.length) * 100);

  // Recommended = first non-completed stage
  const recommendedIdx = statuses.findIndex(s => s !== 'completed');

  // Can submit milestone? Previous stage must be completed (stage 1 has no prereq)
  function canSubmit(stageIdx: number): boolean {
    if (stageIdx === 0) return true;
    return statuses[stageIdx - 1] === 'completed';
  }

  function handleSubmitAttempt(stageIdx: number) {
    if (!canSubmit(stageIdx)) {
      toast.error(t('Complete the previous step first.', 'Завършете предишната стъпка първо.'));
      return;
    }
    // Navigate to startup project for submission
    navigate('/my-startup');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-muted-foreground">{t('Loading...', 'Зареждане...')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            {t('Startup Journey', 'Стартъп пътешествие')}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t('Follow the guided path to build your digital startup — explore freely, submit when ready.',
               'Следвайте ръководения път за изграждане на вашия дигитален стартъп — разглеждайте свободно, подавайте когато сте готови.')}
          </p>
        </div>

        {/* Overall progress */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground">
              {t('Startup Journey Progress', 'Напредък по стартъп пътешествието')}
            </span>
            <span className="text-sm font-bold text-primary">
              {t(`Stage ${completedCount} of ${STAGES.length}`, `Етап ${completedCount} от ${STAGES.length}`)}
            </span>
          </div>
          <Progress value={overallPct} className="h-3" />
        </div>

        {/* Stages */}
        <div className="relative space-y-0">
          {/* Connecting line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border hidden md:block" />

          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const status = statuses[idx];
            const isRecommended = idx === recommendedIdx;
            const submittable = canSubmit(idx);

            return (
              <div
                key={stage.id}
                className={`relative flex gap-4 md:gap-6 p-4 md:p-5 rounded-xl transition-all mb-3
                  ${isRecommended ? 'bg-accent border border-primary/30 shadow-sm' : 'bg-card border border-border'}
                `}
              >
                {/* Icon circle */}
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full z-10
                  ${status === 'completed' ? 'bg-sim-success text-primary-foreground'
                    : isRecommended ? 'sim-gradient text-primary-foreground'
                    : 'bg-muted text-muted-foreground'}`}
                >
                  {status === 'completed' ? <CheckCircle2 className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      {t(`Stage ${stage.id}`, `Етап ${stage.id}`)}
                    </span>
                    {getStatusBadge(status, lang)}
                    {isRecommended && status !== 'completed' && (
                      <Badge className="bg-primary/15 text-primary border-0 text-xs">
                        <ArrowRight className="h-3 w-3 mr-1" />{t('Recommended', 'Препоръчано')}
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-base md:text-lg font-display font-semibold text-foreground mb-1">
                    {lang === 'bg' ? stage.bg : stage.en}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {lang === 'bg' ? stage.descBg : stage.descEn}
                  </p>

                  {/* Learn / Case / Simulator buttons */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Button variant="outline" size="sm" onClick={() => navigate(stage.learnPath)}>
                      <BookOpen className="h-3.5 w-3.5 mr-1" />{t('Learn', 'Учи')}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate(stage.casePath)}>
                      <FileText className="h-3.5 w-3.5 mr-1" />{t('Case Study', 'Казус')}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate(stage.simPath)}>
                      <Play className="h-3.5 w-3.5 mr-1" />{t('Simulator', 'Симулатор')}
                    </Button>
                  </div>

                  {/* Milestone submission */}
                  {idx > 0 && status !== 'completed' && (
                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                      {submittable ? (
                        <Button size="sm" onClick={() => handleSubmitAttempt(idx)}>
                          <Rocket className="h-3.5 w-3.5 mr-1" />
                          {lang === 'bg' ? stage.milestoneBg : stage.milestoneEn}
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" disabled className="opacity-60">
                            <Lock className="h-3.5 w-3.5 mr-1" />
                            {lang === 'bg' ? stage.milestoneBg : stage.milestoneEn}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-sim-warning"
                            onClick={() => {
                              // Navigate to previous stage's startup section
                              navigate('/my-startup');
                            }}
                          >
                            <AlertCircle className="h-3.5 w-3.5 mr-1" />
                            {t('Complete previous step', 'Завършете предишната стъпка')}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Stage 1 milestone = complete a case */}
                  {idx === 0 && status !== 'completed' && (
                    <div className="pt-2 border-t border-border">
                      <Button size="sm" onClick={() => navigate('/cases')}>
                        <BookOpen className="h-3.5 w-3.5 mr-1" />
                        {t('Complete a Case Study', 'Завършете казус')}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
