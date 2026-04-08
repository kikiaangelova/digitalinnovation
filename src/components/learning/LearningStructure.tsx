import { BookOpen, ClipboardList, MessageSquare, PenLine, ArrowRight, CheckCircle2 } from 'lucide-react';

/**
 * Consistent 6-phase learning structure bar shown across all activity types.
 * Phases: Learn → Practice → Feedback → Reflect → Next Step
 */

const PHASES = [
  { id: 'learn', icon: BookOpen, en: 'Learn', bg: 'Научи' },
  { id: 'practice', icon: ClipboardList, en: 'Practice', bg: 'Практика' },
  { id: 'feedback', icon: MessageSquare, en: 'Feedback', bg: 'Обратна връзка' },
  { id: 'reflect', icon: PenLine, en: 'Reflect', bg: 'Рефлексия' },
  { id: 'next', icon: ArrowRight, en: 'Next Step', bg: 'Следваща стъпка' },
] as const;

export type LearningPhase = typeof PHASES[number]['id'];

interface LearningPhaseBarProps {
  currentPhase: LearningPhase;
  lang: 'en' | 'bg';
  completedPhases?: LearningPhase[];
}

export function LearningPhaseBar({ currentPhase, lang, completedPhases = [] }: LearningPhaseBarProps) {
  const currentIdx = PHASES.findIndex(p => p.id === currentPhase);

  return (
    <div className="flex items-center gap-1 p-2 rounded-xl bg-accent/40 overflow-x-auto">
      {PHASES.map((phase, idx) => {
        const Icon = phase.icon;
        const isCompleted = completedPhases.includes(phase.id) || idx < currentIdx;
        const isCurrent = phase.id === currentPhase;

        return (
          <div key={phase.id} className="flex items-center gap-1 flex-1 min-w-0">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all flex-1 min-w-0 ${
                isCurrent ? 'bg-primary text-primary-foreground shadow-sm' :
                isCompleted ? 'bg-primary/10 text-primary' :
                'text-muted-foreground'
              }`}
            >
              {isCompleted && !isCurrent ? (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              ) : (
                <Icon className="h-3.5 w-3.5 shrink-0" />
              )}
              <span className="text-xs font-medium truncate hidden sm:inline">
                {lang === 'bg' ? phase.bg : phase.en}
              </span>
            </div>
            {idx < PHASES.length - 1 && (
              <div className={`w-3 h-px shrink-0 ${isCompleted ? 'bg-primary/30' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── "What You Will Learn" block ── */

interface LearningOutcome {
  en: string;
  bg: string;
}

interface WhatYouWillLearnProps {
  outcomes: LearningOutcome[];
  lang: 'en' | 'bg';
  /** Optional activity type label */
  activityType?: { en: string; bg: string };
}

export function WhatYouWillLearn({ outcomes, lang, activityType }: WhatYouWillLearnProps) {
  if (outcomes.length === 0) return null;

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-center gap-2 mb-2.5">
        <BookOpen className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">
          {lang === 'bg' ? 'Какво ще научиш:' : 'What you will learn:'}
        </h3>
        {activityType && (
          <span className="ml-auto text-xs text-muted-foreground bg-accent px-2 py-0.5 rounded-full">
            {lang === 'bg' ? activityType.bg : activityType.en}
          </span>
        )}
      </div>
      <ul className="space-y-1.5">
        {outcomes.map((o, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
            <span>{lang === 'bg' ? o.bg : o.en}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Reflection prompt block ── */

interface ReflectionPromptProps {
  lang: 'en' | 'bg';
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export function ReflectionPrompt({ lang, value, onChange, disabled }: ReflectionPromptProps) {
  const prompts = [
    { en: 'What did you learn?', bg: 'Какво научи?' },
    { en: 'What was difficult?', bg: 'Какво беше трудно?' },
    { en: 'What will you improve next time?', bg: 'Какво ще подобрите следващия път?' },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <PenLine className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">
          {lang === 'bg' ? 'Рефлексия' : 'Reflection'}
        </h3>
      </div>
      <div className="space-y-1">
        {prompts.map((p, i) => (
          <p key={i} className="text-xs text-muted-foreground">
            • {lang === 'bg' ? p.bg : p.en}
          </p>
        ))}
      </div>
      <textarea
        className="w-full min-h-[80px] rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
        placeholder={lang === 'bg' ? 'Напиши размислите си тук...' : 'Write your reflections here...'}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}

/* ── Activity-specific learning outcomes ── */

export const CASE_STUDY_OUTCOMES: LearningOutcome[] = [
  { en: 'Identify and analyze real business problems', bg: 'Идентифициране и анализиране на реални бизнес проблеми' },
  { en: 'Evaluate market data and strategic exhibits', bg: 'Оценяване на пазарни данни и стратегически приложения' },
  { en: 'Propose evidence-based strategic solutions', bg: 'Предлагане на стратегически решения, базирани на доказателства' },
  { en: 'Develop critical and analytical thinking', bg: 'Развиване на критично и аналитично мислене' },
];

export const SIMULATOR_OUTCOMES: LearningOutcome[] = [
  { en: 'Understand the impact of strategic decisions', bg: 'Разбиране на въздействието на стратегическите решения' },
  { en: 'Evaluate risk vs. growth tradeoffs', bg: 'Оценяване на компромисите между риск и растеж' },
  { en: 'Build a startup strategy step by step', bg: 'Изграждане на стартъп стратегия стъпка по стъпка' },
  { en: 'Analyze KPI outcomes from decisions', bg: 'Анализиране на KPI резултати от решения' },
];

export const STARTUP_BUILDER_OUTCOMES: LearningOutcome[] = [
  { en: 'Define a clear customer segment', bg: 'Дефиниране на ясен клиентски сегмент' },
  { en: 'Create a compelling value proposition', bg: 'Създаване на убедително стойностно предложение' },
  { en: 'Build a viable business model', bg: 'Изграждане на жизнеспособен бизнес модел' },
  { en: 'Design a digital product and growth strategy', bg: 'Проектиране на дигитален продукт и стратегия за растеж' },
];

export const THEORY_MODULE_OUTCOMES: LearningOutcome[] = [
  { en: 'Understand key innovation concepts', bg: 'Разбиране на ключови иновационни концепции' },
  { en: 'Apply theory to real-world scenarios', bg: 'Прилагане на теория в реални сценарии' },
  { en: 'Develop strategic thinking skills', bg: 'Развиване на стратегическо мислене' },
];

export const ASSESSMENT_OUTCOMES: LearningOutcome[] = [
  { en: 'Demonstrate understanding of core concepts', bg: 'Демонстриране на разбиране на основните концепции' },
  { en: 'Apply knowledge to analytical questions', bg: 'Прилагане на знания в аналитични въпроси' },
  { en: 'Validate your learning progress', bg: 'Валидиране на учебния напредък' },
];
