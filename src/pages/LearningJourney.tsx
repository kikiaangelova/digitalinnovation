import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { useProgress } from '@/context/ProgressContext';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  BookOpen, Search, Lightbulb, Palette, TrendingUp, Presentation,
  CheckCircle2, ArrowRight, Lock, Play, FileText, Rocket,
  ChevronDown, ChevronUp, GraduationCap, Target, Clock, Zap, Circle,
} from 'lucide-react';
import { toast } from 'sonner';

/* ------------------------------------------------------------------ */
/* Learning outcomes per stage                                         */
/* ------------------------------------------------------------------ */
interface StageOutcomes {
  knowEn: string[];
  knowBg: string[];
  doEn: string[];
  doBg: string[];
  estMinutes: number;
  xpAvailable: number;
}

const STAGE_OUTCOMES: StageOutcomes[] = [
  {
    knowEn: [
      'What digital innovation is and why it matters',
      '3 types of digital disruption (sustaining, low-end, new-market)',
      'How to identify innovation opportunities in any industry',
    ],
    knowBg: [
      'Какво е дигитална иновация и защо е важна',
      '3 вида дигитална дисрупция (поддържаща, нискобюджетна, нов пазар)',
      'Как да идентифицираш иновационни възможности във всяка индустрия',
    ],
    doEn: ['Analyze an industry for digital opportunities', 'Complete your first case study'],
    doBg: ['Анализирай индустрия за дигитални възможности', 'Завърши първия си казус'],
    estMinutes: 45, xpAvailable: 130,
  },
  {
    knowEn: ['How to map a competitive landscape', 'What makes a digital business model defensible'],
    knowBg: ['Как да картографираш конкурентната среда', 'Какво прави дигиталния бизнес модел защитим'],
    doEn: ['Identify 3 competitors and analyze their strengths and weaknesses', 'Apply an analytical framework to a real industry'],
    doBg: ['Идентифицирай 3 конкурента и анализирай силните и слабите им страни', 'Приложи аналитична рамка към реална индустрия'],
    estMinutes: 60, xpAvailable: 140,
  },
  {
    knowEn: ['What a value proposition is and how to craft one', 'How to define customer segments precisely'],
    knowBg: ['Какво е стойностно предложение и как да го създадеш', 'Как да дефинираш клиентски сегменти прецизно'],
    doEn: ['Write a clear problem statement', 'Define your target customer with specific demographics and needs'],
    doBg: ['Напиши ясна формулировка на проблема', 'Дефинирай целевия клиент с конкретни демографски данни и нужди'],
    estMinutes: 50, xpAvailable: 120,
  },
  {
    knowEn: ['The 9 blocks of the Business Model Canvas', 'How to design a revenue model for a digital product'],
    knowBg: ['Деветте блока на Business Model Canvas', 'Как да проектирате модел за приходи за дигитален продукт'],
    doEn: ['Complete a full BMC for your startup idea', 'Define your MVP concept with key features'],
    doBg: ['Попълни пълен BMC за твоята стартъп идея', 'Дефинирай MVP концепцията с ключови функции'],
    estMinutes: 90, xpAvailable: 200,
  },
  {
    knowEn: ['What KPIs matter for a startup (users, revenue, satisfaction)', 'How strategic decisions affect growth vs risk'],
    knowBg: ['Кои KPI-та са важни за стартъп (потребители, приходи, удовлетвореност)', 'Как стратегическите решения влияят на растежа спрямо риска'],
    doEn: ['Run a complete simulator scenario', 'Interpret your startup performance score'],
    doBg: ['Проведи пълен симулаторен сценарий', 'Интерпретирай резултата от представянето на стартъпа'],
    estMinutes: 40, xpAvailable: 100,
  },
  {
    knowEn: ['What investors look for in a startup pitch', 'How to structure a compelling 3-minute presentation'],
    knowBg: ['Какво търсят инвеститорите в стартъп представяне', 'Как да структурирате убедителна 3-минутна презентация'],
    doEn: ['Deliver a complete startup pitch', 'Receive and give constructive peer feedback'],
    doBg: ['Представи пълно стартъп представяне', 'Получи и дай конструктивна партньорска обратна връзка'],
    estMinutes: 60, xpAvailable: 170,
  },
];

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
  startupKey?: string;
}

const STAGES: Stage[] = [
  {
    id: 1, icon: BookOpen,
    en: 'Digital Innovation Basics', bg: 'Основи на дигиталните иновации',
    descEn: 'Learn key concepts of digital transformation and innovation.',
    descBg: 'Научи ключовите концепции за дигитална трансформация и иновации.',
    milestoneEn: 'Complete introductory case study',
    milestoneBg: 'Завърши уводния казус',
    learnPath: '/journey/learn/1', casePath: '/cases', simPath: '/simulator',
  },
  {
    id: 2, icon: Search,
    en: 'Industry & Competitor Analysis', bg: 'Анализ на индустрията и конкуренцията',
    descEn: 'Analyze industries and identify digital opportunities.',
    descBg: 'Анализирай индустрии и идентифицирай дигитални възможности.',
    milestoneEn: 'Submit Opportunity Analysis',
    milestoneBg: 'Подай анализ на възможностите',
    learnPath: '/journey/learn/2', casePath: '/cases', simPath: '/simulator',
    startupKey: 'problem',
  },
  {
    id: 3, icon: Lightbulb,
    en: 'Startup Idea & Value Proposition', bg: 'Стартъп идея и стойностно предложение',
    descEn: 'Define your startup problem, customer, and value proposition.',
    descBg: 'Дефинирай проблема, клиента и стойностното предложение.',
    milestoneEn: 'Submit Value Proposition',
    milestoneBg: 'Подай стойностно предложение',
    learnPath: '/journey/learn/3', casePath: '/cases', simPath: '/simulator',
    startupKey: 'value_proposition',
  },
  {
    id: 4, icon: Palette,
    en: 'Product Design (MVP)', bg: 'Продуктов дизайн (MVP)',
    descEn: 'Design and describe your minimum viable product.',
    descBg: 'Проектирай и опиши минималния жизнеспособен продукт.',
    milestoneEn: 'Submit MVP Design',
    milestoneBg: 'Подай MVP дизайн',
    learnPath: '/journey/learn/4', casePath: '/cases', simPath: '/simulator',
    startupKey: 'digital_product',
  },
  {
    id: 5, icon: TrendingUp,
    en: 'Business Model & Marketing Strategy', bg: 'Бизнес модел и маркетинг стратегия',
    descEn: 'Build your business model and plan marketing channels.',
    descBg: 'Изгради бизнес модел и планирай маркетинг канали.',
    milestoneEn: 'Submit Business Model & Marketing',
    milestoneBg: 'Подай бизнес модел и маркетинг',
    learnPath: '/journey/learn/5', casePath: '/cases', simPath: '/simulator',
    startupKey: 'business_model',
  },
  {
    id: 6, icon: Presentation,
    en: 'Startup Pitch', bg: 'Стартъп представяне',
    descEn: 'Prepare and submit your final startup pitch.',
    descBg: 'Подготви и подай финалното стартъп представяне.',
    milestoneEn: 'Submit Final Startup Pitch',
    milestoneBg: 'Подай финално стартъп представяне',
    learnPath: '/journey/learn/6', casePath: '/cases', simPath: '/simulator',
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
      return <Badge className="bg-success/15 text-success border-0 text-xs"><CheckCircle2 className="h-3 w-3 mr-1" />{t('Completed', 'Завършено')}</Badge>;
    case 'in_progress':
      return <Badge className="bg-warning/15 text-warning border-0 text-xs"><Play className="h-3 w-3 mr-1" />{t('In Progress', 'В процес')}</Badge>;
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
  const isMobile = useIsMobile();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const progress = useProgress();

  const casesCompleted = progress.casesCompleted;
  const casesTotal = progress.casesTotal;
  const loading = progress.loading;

  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [initializedExpanded, setInitializedExpanded] = useState(false);

  useEffect(() => {
    if (!initializedExpanded) {
      if (!isMobile) {
        setExpanded(new Set(STAGES.map(s => s.id)));
      }
      setInitializedExpanded(true);
    }
  }, [isMobile, initializedExpanded]);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth?redirect=/journey');
  }, [user, authLoading, navigate]);

  const toggleExpand = (id: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const sectionFilled = (key: string) => progress.startupSectionMap[key] || false;

  /* ---- per-stage checklist items ---- */
  interface ChecklistItem {
    labelEn: string;
    labelBg: string;
    done: boolean;
  }

  function getStageChecklist(stage: Stage, idx: number): ChecklistItem[] {
    const learnDone = progress.stageLearnCompleted.has(stage.id);
    const items: ChecklistItem[] = [
      { labelEn: 'Learn', labelBg: 'Учи', done: learnDone },
    ];

    // Case study: Stage 1 requires ≥1 completed, Stage 2 requires ≥2
    if (stage.id === 1) {
      items.push({ labelEn: 'Case Study', labelBg: 'Казус', done: casesCompleted >= 1 });
    } else if (stage.id === 2) {
      items.push({ labelEn: 'Case Study', labelBg: 'Казус', done: casesCompleted >= 2 });
    } else {
      // Stages 3-6: case study not required but shown if they have cases
      items.push({ labelEn: 'Case Study', labelBg: 'Казус', done: casesCompleted >= idx + 1 });
    }

    // Startup section (stages 2-6)
    if (stage.startupKey) {
      if (stage.id === 5) {
        items.push({ labelEn: 'Startup Task', labelBg: 'Стартъп задача', done: sectionFilled('business_model') && sectionFilled('growth_strategy') });
      } else if (stage.id === 6) {
        items.push({ labelEn: 'Startup Task', labelBg: 'Стартъп задача', done: progress.startupSubmitted });
      } else {
        items.push({ labelEn: 'Startup Task', labelBg: 'Стартъп задача', done: sectionFilled(stage.startupKey) });
      }
    }

    // Simulator (stage 5)
    if (stage.id === 5) {
      items.push({ labelEn: 'Simulator', labelBg: 'Симулатор', done: progress.simComplete });
    }

    return items;
  }

  /* ---- derive stage statuses from checklist ---- */
  function stageStatus(stage: Stage, idx: number): StageStatus {
    const checklist = getStageChecklist(stage, idx);
    const doneCount = checklist.filter(c => c.done).length;
    if (doneCount === checklist.length) return 'completed';
    if (doneCount > 0) return 'in_progress';
    return 'not_started';
  }

  const statuses = STAGES.map((s, i) => stageStatus(s, i));
  const completedCount = statuses.filter(s => s === 'completed').length;
  const overallPct = Math.round((completedCount / STAGES.length) * 100);

  /* ---- Locking logic: Stage N is unlocked only if Stage N-1 is completed ---- */
  function isStageUnlocked(idx: number): boolean {
    if (idx === 0) return true;
    return statuses[idx - 1] === 'completed';
  }

  const recommendedIdx = statuses.findIndex((s, i) => s !== 'completed' && isStageUnlocked(i));

  function handleLockedClick() {
    toast.error(t('Complete the previous stage first.', 'Завърши предишния етап първо.'));
  }

  function handleSubmitAttempt(stageIdx: number) {
    if (!isStageUnlocked(stageIdx)) {
      handleLockedClick();
      return;
    }
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
          <h1 className="typo-h1">
            {t('Startup Journey', 'Стартъп пътешествие')}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t('Build your startup step by step. Complete each stage to unlock the next one.',
               'Изгради стартъпа си стъпка по стъпка. Завърши всеки етап, за да отключиш следващия.')}
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
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border hidden md:block" />

          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const status = statuses[idx];
            const unlocked = isStageUnlocked(idx);
            const isRecommended = idx === recommendedIdx;
            const isLocked = !unlocked;
            const outcomes = STAGE_OUTCOMES[idx];
            const isExpanded = expanded.has(stage.id) && unlocked;
            const checklist = getStageChecklist(stage, idx);
            const checkDone = checklist.filter(c => c.done).length;
            const checkPct = Math.round((checkDone / checklist.length) * 100);

            return (
              <div
                key={stage.id}
                className={`relative flex gap-4 md:gap-6 p-4 md:p-5 rounded-xl transition-all mb-3
                  ${isLocked
                    ? 'bg-muted/30 border border-border/50 opacity-60'
                    : isRecommended
                      ? 'bg-accent border-2 border-primary/40 shadow-md ring-1 ring-primary/10'
                      : status === 'completed'
                        ? 'bg-card border border-success/30'
                        : 'bg-card border border-border'}
                `}
              >
                {/* Icon circle */}
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full z-10
                  ${isLocked
                    ? 'bg-muted text-muted-foreground'
                    : status === 'completed'
                      ? 'bg-success text-primary-foreground'
                      : isRecommended
                        ? 'sim-gradient text-primary-foreground'
                        : 'bg-muted text-muted-foreground'}`}
                >
                  {isLocked
                    ? <Lock className="h-5 w-5" />
                    : status === 'completed'
                      ? <CheckCircle2 className="h-6 w-6" />
                      : <Icon className="h-6 w-6" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="typo-stage">
                      {t(`Stage ${stage.id}`, `Етап ${stage.id}`)}
                    </span>
                    {isLocked ? (
                      <Badge variant="outline" className="text-xs text-muted-foreground border-muted-foreground/30">
                        <Lock className="h-3 w-3 mr-1" />
                        {t('Locked', 'Заключено')}
                      </Badge>
                    ) : (
                      <>
                        {getStatusBadge(status, lang)}
                        {isRecommended && status !== 'completed' && (
                          <Badge className="bg-primary/15 text-primary border-0 text-xs font-semibold">
                            <ArrowRight className="h-3 w-3 mr-1" />{t('Recommended', 'Препоръчано')}
                          </Badge>
                        )}
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <button
                    onClick={() => {
                      if (isLocked) {
                        handleLockedClick();
                        return;
                      }
                      toggleExpand(stage.id);
                    }}
                    className={`flex items-center gap-2 w-full text-left group ${isLocked ? 'cursor-not-allowed' : ''}`}
                  >
                    <h3 className={`typo-card-title text-base md:text-lg transition-colors
                      ${isLocked ? 'text-muted-foreground' : 'text-foreground group-hover:text-primary'}`}>
                      {lang === 'bg' ? stage.bg : stage.en}
                    </h3>
                    {!isLocked && (
                      isExpanded
                        ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                        : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  <p className={`typo-helper mb-2 ${isLocked ? 'text-muted-foreground/60' : ''}`}>
                    {lang === 'bg' ? stage.descBg : stage.descEn}
                  </p>

                  {/* Locked message */}
                  {isLocked && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Lock className="h-3.5 w-3.5" />
                      {t(
                        `Complete Stage ${stage.id - 1} to unlock`,
                        `Завърши Етап ${stage.id - 1}, за да отключиш`
                      )}
                    </div>
                  )}

                  {/* ═══ Expandable learning outcomes (only for unlocked) ═══ */}
                  {isExpanded && !isLocked && (
                    <div className="rounded-lg bg-muted/40 border border-border/50 p-4 mb-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="flex flex-wrap gap-4 text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          ~{outcomes.estMinutes} {t('minutes', 'минути')}
                        </span>
                        <span className="flex items-center gap-1 text-xp-gold font-bold">
                          <Zap className="h-3.5 w-3.5" />
                          {outcomes.xpAvailable} XP {t('available', 'налични')}
                        </span>
                      </div>

                      <div>
                        <h4 className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
                          <GraduationCap className="h-3.5 w-3.5 text-primary" />
                          {t('What you will KNOW', 'Какво ще ЗНАЕШ')}
                        </h4>
                        <ul className="space-y-1 pl-5">
                          {(lang === 'bg' ? outcomes.knowBg : outcomes.knowEn).map((item, i) => (
                            <li key={i} className="typo-helper list-disc">{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
                          <Target className="h-3.5 w-3.5 text-success" />
                          {t('What you will BE ABLE TO DO', 'Какво ще МОЖЕШ да правиш')}
                        </h4>
                        <ul className="space-y-1 pl-5">
                          {(lang === 'bg' ? outcomes.doBg : outcomes.doEn).map((item, i) => (
                            <li key={i} className="typo-helper list-disc">{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* ═══ Completion checklist ═══ */}
                  {!isLocked && (
                    <div className="rounded-lg bg-muted/30 border border-border/50 p-3 mb-3 space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-foreground">
                          {t('Completion Checklist', 'Чеклист за завършване')}
                        </span>
                        <span className="text-xs font-bold text-primary">
                          {checkDone}/{checklist.length}
                        </span>
                      </div>
                      <Progress value={checkPct} className="h-1.5" />
                      <div className="space-y-1 mt-2">
                        {checklist.map((item, ci) => (
                          <div key={ci} className="flex items-center gap-2 text-xs">
                            {item.done ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                            ) : (
                              <Circle className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                            )}
                            <span className={item.done ? 'text-success font-medium line-through' : 'text-foreground'}>
                              {lang === 'bg' ? item.labelBg : item.labelEn}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action buttons — only for unlocked stages */}
                  {!isLocked && (
                    <>
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
                        <div className="pt-2 border-t border-border">
                          <Button size="sm" onClick={() => handleSubmitAttempt(idx)}>
                            <Rocket className="h-3.5 w-3.5 mr-1" />
                            {lang === 'bg' ? stage.milestoneBg : stage.milestoneEn}
                          </Button>
                        </div>
                      )}

                      {idx === 0 && status !== 'completed' && (
                        <div className="pt-2 border-t border-border">
                          <Button size="sm" onClick={() => navigate('/cases')}>
                            <BookOpen className="h-3.5 w-3.5 mr-1" />
                            {t('Complete a Case Study', 'Завърши казус')}
                          </Button>
                        </div>
                      )}
                    </>
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
