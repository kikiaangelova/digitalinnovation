import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen, Search, Lightbulb, Palette, TrendingUp, Presentation,
  CheckCircle2, ArrowRight, Play, ChevronRight,
} from 'lucide-react';

/* ── Journey step definitions ── */
const JOURNEY_STEPS = [
  {
    id: 1, icon: BookOpen,
    en: 'Discover the Problem', bg: 'Открий проблема',
    descEn: 'Digital Innovation Basics & Industry exploration',
    descBg: 'Основи на дигиталните иновации и проучване на индустрии',
    path: '/innovation-basics',
  },
  {
    id: 2, icon: Search,
    en: 'Analyze the Market', bg: 'Анализирай пазара',
    descEn: 'Case Studies & Competitor analysis',
    descBg: 'Казуси и анализ на конкуренцията',
    path: '/cases',
  },
  {
    id: 3, icon: Lightbulb,
    en: 'Design the Solution', bg: 'Проектирай решението',
    descEn: 'Problem definition & Value proposition',
    descBg: 'Дефиниране на проблема и стойностно предложение',
    path: '/my-startup?section=problem',
  },
  {
    id: 4, icon: Palette,
    en: 'Build the Startup', bg: 'Изгради стартъпа',
    descEn: 'Product design, Business model & Growth strategy',
    descBg: 'Продуктов дизайн, бизнес модел и стратегия за растеж',
    path: '/my-startup',
  },
  {
    id: 5, icon: TrendingUp,
    en: 'Test in Simulator', bg: 'Тествай в симулатора',
    descEn: 'Strategic decision scenarios & KPI impact',
    descBg: 'Сценарии за стратегически решения и въздействие върху KPI',
    path: '/simulator',
  },
  {
    id: 6, icon: Presentation,
    en: 'Pitch the Startup', bg: 'Представи стартъпа',
    descEn: 'Final startup presentation & Pitch summary',
    descBg: 'Финално представяне и обобщение на стартъпа',
    path: '/my-startup?section=final_pitch',
  },
];

type StepStatus = 'completed' | 'in_progress' | 'not_started';

interface JourneyProgressProps {
  lang: 'en' | 'bg';
  casesCompleted: number;
  startupSections: Record<string, boolean>;
  startupSubmitted: boolean;
  simWeek: number;
  simComplete: boolean;
}

function deriveStatuses(props: JourneyProgressProps): StepStatus[] {
  const { casesCompleted, startupSections, startupSubmitted, simWeek, simComplete } = props;
  const s = (key: string) => !!startupSections[key];

  return [
    // Step 1: Discover — completed if ≥1 case done
    casesCompleted >= 1 ? 'completed' : 'not_started',
    // Step 2: Analyze — completed if ≥2 cases done
    casesCompleted >= 2 ? 'completed' : casesCompleted >= 1 ? 'in_progress' : 'not_started',
    // Step 3: Design — problem + value proposition
    s('problem') && s('value_proposition') ? 'completed' : (s('problem') || s('customer') || s('value_proposition')) ? 'in_progress' : 'not_started',
    // Step 4: Build — product + business model + growth
    s('digital_product') && s('business_model') && s('growth_strategy') ? 'completed' : (s('digital_product') || s('business_model') || s('growth_strategy')) ? 'in_progress' : 'not_started',
    // Step 5: Simulator
    simComplete ? 'completed' : simWeek > 1 ? 'in_progress' : 'not_started',
    // Step 6: Pitch
    startupSubmitted ? 'completed' : s('final_pitch') ? 'in_progress' : 'not_started',
  ];
}

export default function JourneyProgress(props: JourneyProgressProps) {
  const { lang } = props;
  const navigate = useNavigate();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const statuses = deriveStatuses(props);
  const completedCount = statuses.filter(s => s === 'completed').length;
  const overallPct = Math.round((completedCount / JOURNEY_STEPS.length) * 100);
  const recommendedIdx = statuses.findIndex(s => s !== 'completed');

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-5">
      {/* Header + overall progress */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-display font-semibold text-foreground">
            {t('Your Innovation Journey', 'Твоето иновационно пътешествие')}
          </h2>
          <span className="text-sm font-bold text-primary">
            {t(`Step ${completedCount} of 6`, `Стъпка ${completedCount} от 6`)}
          </span>
        </div>
        <Progress value={overallPct} className="h-2.5" indicatorClassName={overallPct >= 100 ? 'bg-sim-success' : 'bg-primary'} />
        <p className="text-xs text-muted-foreground mt-1.5">{overallPct}% {t('complete', 'завършено')}</p>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {JOURNEY_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const status = statuses[idx];
          const isRecommended = idx === recommendedIdx;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all group
                ${isRecommended ? 'bg-accent border border-primary/25' : 'hover:bg-muted/50'}
              `}
              onClick={() => navigate(step.path)}
            >
              {/* Status icon */}
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-105
                ${status === 'completed' ? 'bg-sim-success text-white'
                  : isRecommended ? 'sim-gradient text-primary-foreground'
                  : status === 'in_progress' ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'bg-muted text-muted-foreground'}`}
              >
                {status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${status === 'completed' || isRecommended ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {lang === 'bg' ? step.bg : step.en}
                  </span>
                  {isRecommended && status !== 'completed' && (
                    <Badge className="bg-primary/15 text-primary border-0 text-xs px-1.5 py-0">
                      {t('Next', 'Следваща')}
                    </Badge>
                  )}
                  {status === 'in_progress' && !isRecommended && (
                    <Badge className="bg-primary/10 text-primary border-0 text-xs px-1.5 py-0">
                      <Play className="h-2.5 w-2.5 mr-0.5" />{t('Started', 'Започнато')}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {lang === 'bg' ? step.descBg : step.descEn}
                </p>
              </div>

              <ChevronRight className={`h-4 w-4 shrink-0 transition-colors ${isRecommended ? 'text-primary' : 'text-muted-foreground/40 group-hover:text-muted-foreground'}`} />
            </div>
          );
        })}
      </div>

      {/* CTA */}
      {recommendedIdx >= 0 && (
        <Button
          className="w-full sim-gradient border-0"
          onClick={() => navigate(JOURNEY_STEPS[recommendedIdx].path)}
        >
          {t('Continue Journey', 'Продължи пътешествието')}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </div>
  );
}
