import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  ArrowLeft, ArrowRight, ExternalLink, CheckCircle2, Save,
  BookOpen, FileText, AlertTriangle, ChevronUp, ChevronDown, Lock,
  Building2, TrendingUp, BarChart3, Brain, PenTool, Rocket, Award,
  Lightbulb, Target, Zap, HelpCircle,
} from 'lucide-react';
import type { Json } from '@/integrations/supabase/types';

/* ── Types ── */
interface CaseStudy {
  id: string; title: string; title_bg: string | null;
  description: string | null; description_bg: string | null;
  topic: string | null; topic_bg: string | null;
  difficulty: string; reading_url: string | null;
  reading_button_label: string | null; reading_title: string | null;
}
interface CaseStep {
  id: string; step_order: number;
  title: string; title_bg: string | null;
  narrative: string | null; narrative_bg: string | null;
  exhibit_text: string | null; exhibit_text_bg: string | null;
}
interface Question {
  id: string; case_step_id: string; question_order: number; type: string;
  prompt: string; prompt_bg: string | null;
  options: Json; points: number;
}

/* ── Section meta – 8-part MIT case structure ── */
const SECTION_ICONS: Record<number, React.ElementType> = {
  0: BookOpen, 1: Building2, 2: TrendingUp, 3: BarChart3,
  4: Brain, 5: PenTool, 6: Rocket, 7: Award,
};
const SECTION_LABELS_EN: Record<number, string> = {
  0: 'Research & Reading', 1: 'Industry Context', 2: 'Digital Disruption & Data',
  3: 'Strategic Problem & Exhibits', 4: 'Strategic Question',
  5: 'Student Analysis', 6: 'Innovation Proposal', 7: 'Final Recommendation',
};
const SECTION_LABELS_BG: Record<number, string> = {
  0: 'Проучване', 1: 'Индустриален контекст', 2: 'Дигитална трансформация и данни',
  3: 'Стратегически проблем и приложения', 4: 'Стратегически въпрос',
  5: 'Студентски анализ', 6: 'Иновационно предложение', 7: 'Финална препоръка',
};

/* ── Section descriptions for students ── */
const SECTION_HINTS_EN: Record<number, string> = {
  0: 'Read the required material and take research notes.',
  1: 'Understand the industry landscape, market data, and key trends.',
  2: 'Analyze how digital technologies are disrupting this industry.',
  3: 'Study the strategic scenario, exhibits, and data tables provided.',
  4: 'Identify the key strategic decision and answer analytical questions.',
  5: 'Apply critical thinking to analyze the situation using the data.',
  6: 'Design your strategic recommendation with supporting evidence.',
  7: 'Write your final recommendation as a professional brief.',
};
const SECTION_HINTS_BG: Record<number, string> = {
  0: 'Прочетете задължителния материал и направете бележки.',
  1: 'Разберете индустриалния пейзаж, пазарни данни и ключови тенденции.',
  2: 'Анализирайте как дигиталните технологии трансформират тази индустрия.',
  3: 'Изучете стратегическия сценарий, приложенията и таблиците с данни.',
  4: 'Идентифицирайте ключовото стратегическо решение и отговорете на аналитичните въпроси.',
  5: 'Приложете критично мислене за анализ на ситуацията чрез данните.',
  6: 'Проектирайте стратегическата си препоръка с подкрепящи доказателства.',
  7: 'Напишете финалната си препоръка като професионален бриф.',
};

/* ── Structured startup analysis fields ── */
const STARTUP_FIELDS = [
  {
    key: 'competitor_analysis',
    icon: Target,
    xp: 10,
    labelEn: 'Competitor Analysis',
    labelBg: 'Анализ на конкуренцията',
    promptEn: 'Who are the main competitors in your market? List at least two and briefly describe what they do.',
    promptBg: 'Кои са основните конкуренти на вашия пазар? Посочете поне двама и опишете накратко какво правят.',
    placeholderEn: 'List at least 2 competitors and describe their products/services...',
    placeholderBg: 'Посочете поне 2 конкуренти и опишете техните продукти/услуги...',
  },
  {
    key: 'market_gap',
    icon: Lightbulb,
    xp: 20,
    labelEn: 'Market Gap',
    labelBg: 'Пазарна празнина',
    promptEn: 'What gap in the market do these competitors leave open?',
    promptBg: 'Каква празнина на пазара оставят тези конкуренти?',
    placeholderEn: 'Describe the unmet need or underserved segment...',
    placeholderBg: 'Опишете незадоволената нужда или неподдържания сегмент...',
  },
  {
    key: 'unique_advantage',
    icon: Zap,
    xp: 20,
    labelEn: 'Unique Advantage',
    labelBg: 'Уникално предимство',
    promptEn: 'What is your startup\'s unique advantage compared to these competitors?',
    promptBg: 'Какво е уникалното предимство на вашия стартъп в сравнение с тези конкуренти?',
    placeholderEn: 'Explain what makes your solution different and better...',
    placeholderBg: 'Обяснете какво прави вашето решение различно и по-добро...',
  },
] as const;
const MIN_FIELD_LENGTH = 30;
const MAX_FIELD_LENGTH = 500;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function CasePlayer() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const tx = (en: string | null | undefined, bg: string | null | undefined) => lang === 'bg' ? (bg || en || '') : (en || '');
  const tl = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [steps, setSteps] = useState<CaseStep[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [startupNotes, setStartupNotes] = useState<Record<string, string>>({});
  const [startupTouched, setStartupTouched] = useState<Record<string, boolean>>({});
  const [showInsight, setShowInsight] = useState<Record<number, boolean>>({});
  const autosaveRef = useRef<NodeJS.Timeout | null>(null);

  const prevXpRef = useRef<Record<string, boolean>>({});

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  useEffect(() => {
    if (!id) return;
    if (!user) { navigate(`/auth?redirect=${encodeURIComponent(`/case/${id}`)}`); return; }
    const fetchCase = async () => {
      const [caseRes, stepsRes] = await Promise.all([
        supabase.from('case_studies').select('id, title, title_bg, description, description_bg, topic, topic_bg, difficulty, reading_url, reading_button_label, reading_title').eq('id', id).maybeSingle(),
        supabase.from('case_steps').select('id, step_order, title, title_bg, narrative, narrative_bg, exhibit_text, exhibit_text_bg').eq('case_study_id', id).order('step_order'),
      ]);
      if (caseRes.data) setCaseStudy(caseRes.data as CaseStudy);
      if (stepsRes.data) {
        setSteps(stepsRes.data as CaseStep[]);
        const qRes = await supabase.rpc('get_player_questions', { _case_study_id: id });
        if (qRes.data) setQuestions(qRes.data as Question[]);
      }
      const subRes = await supabase.from('submissions').select('id, is_draft').eq('case_study_id', id).eq('user_id', user.id).maybeSingle();
      if (subRes.data) {
        setSubmissionId(subRes.data.id);
        setIsSubmitted(!subRes.data.is_draft);
        if (!subRes.data.is_draft) { navigate(`/case/${id}/results`); return; }
        const respRes = await supabase.from('responses').select('question_id, answer').eq('submission_id', subRes.data.id);
        if (respRes.data) {
          const map: Record<string, any> = {};
          respRes.data.forEach(r => { map[r.question_id] = r.answer; });
          setAnswers(map);
        }
      }
      // Load saved startup notes from course_progress metadata
      const progressRes = await supabase.from('course_progress')
        .select('metadata')
        .eq('user_id', user.id)
        .eq('module', 'case_startup_notes')
        .eq('module_id', id)
        .maybeSingle();
      if (progressRes.data?.metadata) {
        const meta = progressRes.data.metadata as Record<string, any>;
        const loaded: Record<string, string> = {};
        STARTUP_FIELDS.forEach(f => { if (meta[f.key]) loaded[f.key] = String(meta[f.key]); });
        setStartupNotes(loaded);
        // Initialize previous XP state so we don't toast on load
        const initXp: Record<string, boolean> = {};
        STARTUP_FIELDS.forEach(f => { initXp[f.key] = (loaded[f.key] || '').length >= MIN_FIELD_LENGTH; });
        prevXpRef.current = initXp;
      }
      setLoading(false);
    };
    fetchCase();
  }, [id, user, navigate]);

  const currentStepData = steps[currentStep];
  const stepQuestions = currentStepData
    ? questions.filter(q => q.case_step_id === currentStepData.id).sort((a, b) => a.question_order - b.question_order)
    : [];

  /* ── Check if all questions in current step are answered ── */
  const allStepQuestionsAnswered = stepQuestions.length > 0 && stepQuestions.every(q => {
    const a = answers[q.id];
    return a && String(a).trim().length > 0;
  });

  const saveStartupNotes = useCallback(async () => {
    if (!user || !id) return;
    const notesData: Record<string, any> = {};
    STARTUP_FIELDS.forEach(f => { notesData[f.key] = startupNotes[f.key] || ''; });
    await supabase.from('course_progress').upsert({
      user_id: user.id,
      module: 'case_startup_notes',
      module_id: id,
      status: 'in_progress',
      metadata: notesData as Json,
    }, { onConflict: 'user_id,module,module_id' });
  }, [user, id, startupNotes]);

  const saveDraft = useCallback(async () => {
    if (!user || !id || isSubmitted) return;
    setSaving(true);
    let subId = submissionId;
    if (!subId) {
      const { data, error } = await supabase.from('submissions').insert({ case_study_id: id, user_id: user.id, is_draft: true }).select('id').single();
      if (data) { subId = data.id; setSubmissionId(data.id); }
      if (error) { setSaving(false); return; }
    }
    const upserts = Object.entries(answers).map(([questionId, answer]) => ({
      submission_id: subId!, question_id: questionId, answer: answer as Json,
    }));
    if (upserts.length > 0) await supabase.from('responses').upsert(upserts, { onConflict: 'submission_id,question_id' });
    await saveStartupNotes();
    setSaving(false);
  }, [user, id, submissionId, answers, isSubmitted, saveStartupNotes]);

  useEffect(() => {
    if (isSubmitted || Object.keys(answers).length === 0) return;
    if (autosaveRef.current) clearInterval(autosaveRef.current);
    autosaveRef.current = setInterval(() => saveDraft(), 30000);
    return () => { if (autosaveRef.current) clearInterval(autosaveRef.current); };
  }, [saveDraft, isSubmitted, answers]);

  const handleSubmit = async () => {
    await saveDraft();
    if (!submissionId) return;
    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('grade-submission', {
        body: { submission_id: submissionId, source: 'case', lang },
      });
      if (error) throw error;
      toast.success(tl('Case submitted successfully!', 'Казусът е изпратен успешно!'));
      navigate(`/case/${id}/results`);
    } catch (err) {
      toast.error(tl('Failed to submit', 'Грешка при изпращане'));
    } finally {
      setSaving(false);
    }
  };

  const updateAnswer = (questionId: string, value: any) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const isStep0 = currentStepData?.step_order === 0;
  const step0Questions = isStep0 ? stepQuestions : [];
  const step0NotesQuestion = step0Questions.find(q => q.type === 'long_answer' || q.type === 'short_answer');
  const step0WordCount = step0NotesQuestion ? wordCount(String(answers[step0NotesQuestion.id] || '')) : 0;
  const step0Gate = isStep0 && step0NotesQuestion ? step0WordCount >= 100 : true;

  const totalQuestions = questions.length;
  const answeredQuestions = questions.filter(q => answers[q.id] && String(answers[q.id]).trim().length > 0).length;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

  if (loading) return (
    <div className="min-h-screen bg-background"><AppHeader />
      <div className="flex items-center justify-center py-20 text-muted-foreground">{tl('Loading case...', 'Зареждане...')}</div>
    </div>
  );
  if (!caseStudy || steps.length === 0) return (
    <div className="min-h-screen bg-background"><AppHeader />
      <div className="flex items-center justify-center py-20 text-muted-foreground">{tl('Case not found', 'Казусът не е намерен')}</div>
    </div>
  );

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const SectionIcon = SECTION_ICONS[currentStep] || FileText;
  const sectionLabel = lang === 'bg'
    ? SECTION_LABELS_BG[currentStep] || `Секция ${currentStep + 1}`
    : SECTION_LABELS_EN[currentStep] || `Section ${currentStep + 1}`;
  const sectionHint = lang === 'bg'
    ? SECTION_HINTS_BG[currentStep] || ''
    : SECTION_HINTS_EN[currentStep] || '';

  /* Should we show the "Apply to Startup" panel on this step? Show on steps 3+ (after analysis) */
  const showStartupPanel = currentStep >= 3 && !isStep0;
  /* Should we show "Key Insight" reveal? Show on steps with questions, after all answered */
  const showInsightPanel = stepQuestions.length > 0 && currentStep >= 1;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Progress header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-display font-semibold text-foreground truncate">{tx(caseStudy.title, caseStudy.title_bg)}</h2>
            <span className="text-xs text-muted-foreground shrink-0 ml-2 font-sans">
              {tl('Section', 'Секция')} {currentStep + 1} / {steps.length} · {progressPercent}%
            </span>
          </div>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
          <div className="flex gap-1 mt-2 overflow-x-auto pb-1">
            {steps.map((s, i) => {
              const StepIcon = SECTION_ICONS[i] || FileText;
              return (
                <button key={i} onClick={() => setCurrentStep(i)}
                  title={lang === 'bg' ? SECTION_LABELS_BG[i] : SECTION_LABELS_EN[i]}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    i === currentStep ? 'bg-primary text-primary-foreground font-medium'
                      : i < currentStep ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                  <StepIcon className="h-3 w-3" />
                  <span className="hidden sm:inline">{(lang === 'bg' ? SECTION_LABELS_BG[i] : SECTION_LABELS_EN[i]) || `${i + 1}`}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        {/* Section header with hint */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
            <SectionIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-sans uppercase tracking-wider">{sectionLabel}</p>
            <h2 className="text-2xl font-display font-bold text-foreground">{tx(currentStepData.title, currentStepData.title_bg)}</h2>
            {sectionHint && (
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 shrink-0" /> {sectionHint}
              </p>
            )}
          </div>
        </div>

        {/* Required reading (step 0 only) */}
        {isStep0 && caseStudy.reading_url && (
          <a href={caseStudy.reading_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-lg border-2 border-primary/30 bg-accent p-5 hover:border-primary/60 transition-all group">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg sim-gradient shrink-0">
              <ExternalLink className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-display font-semibold text-foreground text-lg">
                {caseStudy.reading_button_label || tl('Open Required Reading', 'Отворете задължителното четиво')}
              </p>
              <p className="text-sm text-muted-foreground">{tl('Opens in a new tab — read before answering', 'Отваря се в нов таб — прочетете преди да отговаряте')}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
          </a>
        )}

        {/* ── 1. NARRATIVE / CONTEXT ── */}
        {(currentStepData.narrative || currentStepData.narrative_bg) && (
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-primary" />
              <h3 className="font-display font-semibold text-foreground">
                {currentStep === 1
                  ? tl('Industry Context', 'Индустриален контекст')
                  : currentStep === 2
                  ? tl('Digital Disruption Analysis', 'Анализ на дигиталната трансформация')
                  : currentStep === 3
                  ? tl('Strategic Scenario', 'Стратегически сценарий')
                  : currentStep === 4
                  ? tl('Strategic Question', 'Стратегически въпрос')
                  : currentStep === 5
                  ? tl('Analysis Framework', 'Рамка за анализ')
                  : currentStep === 6
                  ? tl('Your Proposal', 'Вашето предложение')
                  : currentStep === 7
                  ? tl('Final Recommendation', 'Финална препоръка')
                  : tl('Context', 'Контекст')}
              </h3>
            </div>
            <div className="text-sm text-foreground/85 whitespace-pre-line leading-relaxed">
              {tx(currentStepData.narrative, currentStepData.narrative_bg)}
            </div>
          </div>
        )}

        {/* ── 2. EXHIBITS / INDUSTRY DATA / STRATEGIC PROBLEM ── */}
        {(currentStepData.exhibit_text || currentStepData.exhibit_text_bg) && (
          <div className="rounded-lg border-2 border-sim-warning/30 bg-sim-warning/5 p-6">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-4 w-4 text-sim-warning" />
              <h3 className="font-display font-semibold text-foreground">
                {currentStep === 1
                  ? tl('Industry Data & Statistics', 'Индустриални данни и статистика')
                  : currentStep === 2
                  ? tl('Exhibits & Evidence', 'Приложения и доказателства')
                  : currentStep === 3
                  ? tl('Strategic Data & Exhibits', 'Стратегически данни и приложения')
                  : tl('Data & Evidence', 'Данни и доказателства')}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {tl('Analyze the data below carefully — you will need it to answer the strategic questions.',
                 'Анализирайте данните внимателно — ще ви трябват за отговорите на стратегическите въпроси.')}
            </p>
            <div className="text-sm text-foreground/85 whitespace-pre-line leading-relaxed font-mono bg-background/50 rounded-md p-4 border border-border/50 overflow-x-auto">
              {tx(currentStepData.exhibit_text, currentStepData.exhibit_text_bg)}
            </div>
          </div>
        )}

        {/* ── 3. ANALYSIS QUESTIONS ── */}
        {stepQuestions.length > 0 && (
          <div className="space-y-6">
            {stepQuestions.length > 1 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Brain className="h-4 w-4" />
                <span>{tl(`Answer ${stepQuestions.length} analysis questions`, `Отговорете на ${stepQuestions.length} въпроса за анализ`)}</span>
              </div>
            )}
            {stepQuestions.map((q, idx) => (
              <QuestionCard key={q.id} question={q} index={idx} answer={answers[q.id]}
                isSubmitted={isSubmitted} isStep0={isStep0} step0NotesId={step0NotesQuestion?.id}
                step0WordCount={step0WordCount} onAnswer={updateAnswer} tx={tx} tl={tl} lang={lang} />
            ))}
          </div>
        )}

        {/* ── Reading gate (step 0) ── */}
        {isStep0 && !step0Gate && (
          <div className="flex items-center gap-2 rounded-lg border border-sim-warning/30 bg-sim-warning/5 p-4">
            <AlertTriangle className="h-5 w-5 text-sim-warning shrink-0" />
            <p className="text-sm text-foreground">
              {tl(
                `Please write at least 100 words in your research notes before proceeding. (${step0WordCount}/100)`,
                `Моля, напишете поне 100 думи в бележките си. (${step0WordCount}/100)`
              )}
            </p>
          </div>
        )}

        {/* ── 5. CASE INSIGHT + LEARNING OUTCOME (revealed after all questions answered) ── */}
        {showInsightPanel && (
          <div className={`rounded-lg border p-6 transition-all ${
            allStepQuestionsAnswered
              ? 'border-sim-success/40 bg-sim-success/5'
              : 'border-border bg-muted/30 opacity-60'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className={`h-5 w-5 ${allStepQuestionsAnswered ? 'text-sim-success' : 'text-muted-foreground'}`} />
              <h3 className="font-display font-semibold text-foreground">
                {tl('Case Insight & Learning Outcome', 'Извод от казуса и учебен резултат')}
              </h3>
              {!allStepQuestionsAnswered && (
                <Badge variant="outline" className="text-xs ml-auto">
                  <Lock className="h-3 w-3 mr-1" />
                  {tl('Answer all questions to reveal', 'Отговорете на всички въпроси')}
                </Badge>
              )}
            </div>
            {allStepQuestionsAnswered ? (
              showInsight[currentStep] ? (
                (() => {
                  // Find the insight step (step_order 5) to get case-specific insight text
                  const insightStep = steps.find(s => s.step_order === 5);
                  const insightText = insightStep ? tx(insightStep.exhibit_text, insightStep.exhibit_text_bg) : '';
                  // Parse KEY INSIGHT and LEARNING OUTCOME sections
                  const keyInsightMatch = insightText.match(/KEY INSIGHT:\n?([\s\S]*?)(?:\n\nLEARNING OUTCOME:|$)/i);
                  const outcomeMatch = insightText.match(/LEARNING OUTCOME:\n?([\s\S]*?)$/i);
                  const keyInsight = keyInsightMatch?.[1]?.trim() || tl(
                    'Strategic decision-making requires analyzing competitors, assessing risks, and identifying unique opportunities.',
                    'Стратегическото вземане на решения изисква анализ на конкурентите, оценка на рисковете и идентифициране на уникални възможности.'
                  );
                  const outcome = outcomeMatch?.[1]?.trim() || tl(
                    'Analytical thinking & strategic decision-making',
                    'Аналитично мислене и стратегическо вземане на решения'
                  );
                  return (
                    <div className="space-y-4">
                      <div className="rounded-lg bg-sim-success/10 border border-sim-success/20 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-4 w-4 text-sim-success" />
                          <span className="text-xs font-semibold text-sim-success uppercase tracking-wider">
                            {tl('Key Insight', 'Ключов извод')}
                          </span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{keyInsight}</p>
                      </div>
                      <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="h-4 w-4 text-primary" />
                          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                            {tl('Learning Outcome', 'Учебен резултат')}
                          </span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{outcome}</p>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInsight(prev => ({ ...prev, [currentStep]: true }))}
                  className="text-sim-success border-sim-success/30 hover:bg-sim-success/10"
                >
                  <Zap className="h-3.5 w-3.5 mr-1" />
                  {tl('Reveal Case Insight', 'Покажи извода от казуса')}
                </Button>
              )
            ) : (
              <p className="text-sm text-muted-foreground">
                {tl(
                  'Complete all analysis questions above to unlock the case insight and learning outcome.',
                  'Завършете всички въпроси за анализ, за да отключите извода и учебния резултат.'
                )}
              </p>
            )}
          </div>
        )}

        {/* ── 5. APPLY THIS CASE TO YOUR STARTUP ── */}
        {showStartupPanel && (
          <div className="rounded-lg border-2 border-primary/20 bg-accent p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg sim-gradient shrink-0">
                <Rocket className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">
                  {tl('Apply This Case to Your Startup', 'Приложи казуса към стартъпа си')}
                </h3>
                <Badge variant="outline" className="text-[10px] px-2 py-0.5 font-semibold text-muted-foreground border-border mt-1 w-fit">
                  {tl('Optional', 'По избор')}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {tl(
                    'Optional – connect this case to your startup idea if relevant. Complete fields (30+ characters each) to earn bonus XP.',
                    'По избор – свържете този казус със стартъп идеята си, ако е уместно. Попълнете полетата (30+ символа всяко), за да спечелите бонус XP.'
                  )}
                </p>
              </div>
            </div>

            {STARTUP_FIELDS.map((field) => {
              const val = startupNotes[field.key] || '';
              const charCount = val.length;
              const isValid = charCount >= MIN_FIELD_LENGTH;
              const showError = false;
              const FieldIcon = field.icon;
              return (
                <div key={field.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FieldIcon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">
                        {lang === 'bg' ? field.labelBg : field.labelEn}
                      </span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-bold text-sim-warning border-sim-warning/30">
                        +{field.xp} XP
                      </Badge>
                    </div>
                    {isValid && <CheckCircle2 className="h-4 w-4 text-sim-success" />}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {lang === 'bg' ? field.promptBg : field.promptEn}
                  </p>
                  <Textarea
                    value={val}
                    maxLength={MAX_FIELD_LENGTH}
                    onChange={e => {
                      const newVal = e.target.value;
                      setStartupNotes(prev => ({ ...prev, [field.key]: newVal }));
                      // Check if XP threshold just crossed
                      const wasValid = prevXpRef.current[field.key];
                      const nowValid = newVal.length >= MIN_FIELD_LENGTH;
                      if (nowValid && !wasValid) {
                        prevXpRef.current = { ...prevXpRef.current, [field.key]: true };
                        toast.success(`+${field.xp} XP ${lang === 'bg' ? 'за' : 'earned for'} ${lang === 'bg' ? field.labelBg : field.labelEn}`);
                        // Persist XP to database
                        if (user) {
                          supabase.rpc('add_user_xp', { _user_id: user.id, _xp: field.xp });
                        }
                      } else if (!nowValid && wasValid) {
                        prevXpRef.current = { ...prevXpRef.current, [field.key]: false };
                      }
                    }}
                    onBlur={() => {
                      setStartupTouched(prev => ({ ...prev, [field.key]: true }));
                      saveStartupNotes();
                    }}
                    placeholder={lang === 'bg' ? field.placeholderBg : field.placeholderEn}
                    className={`min-h-[120px] bg-background`}
                    disabled={isSubmitted}
                  />
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${isValid ? 'text-sim-success' : 'text-muted-foreground'}`}>
                      {charCount}/{MIN_FIELD_LENGTH} {tl('characters min', 'символа мин.')}
                      {charCount > 0 && charCount < MIN_FIELD_LENGTH && (
                        <span className="text-muted-foreground"> · {MIN_FIELD_LENGTH - charCount} {tl('more needed', 'още')}</span>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">{charCount}/{MAX_FIELD_LENGTH}</span>
                  </div>
                </div>
              );
            })}

            {/* XP Summary */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-sim-warning" />
                <span className="text-sm font-semibold text-foreground">
                  {tl('XP Earned', 'Спечелени XP')}: {STARTUP_FIELDS.reduce((sum, f) => sum + ((startupNotes[f.key] || '').length >= MIN_FIELD_LENGTH ? f.xp : 0), 0)}/50
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/my-startup')}>
                <Rocket className="h-3.5 w-3.5 mr-1" />
                {tl('Go to My Startup', 'Отиди на Моят стартъп')}
              </Button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 pb-10 border-t border-border">
          <Button variant="outline" onClick={() => setCurrentStep(prev => prev - 1)} disabled={isFirstStep}>
            <ArrowLeft className="h-4 w-4 mr-1" /> {tl('Previous', 'Назад')}
          </Button>
          <div className="flex items-center gap-2">
            {saving && <span className="text-xs text-muted-foreground animate-pulse font-sans">{tl('Saving...', 'Запазване...')}</span>}
            <Button variant="outline" size="sm" onClick={saveDraft} disabled={saving}>
              <Save className="h-4 w-4 mr-1" /> {tl('Save', 'Запази')}
            </Button>
          </div>
          {isLastStep ? (
            <Button onClick={handleSubmit} disabled={saving} className="sim-gradient border-0">
              <Lock className="h-4 w-4 mr-1" /> {saving ? tl('Submitting...', 'Изпращане...') : tl('Submit Case', 'Изпрати казуса')}
            </Button>
          ) : (
            <Button onClick={() => setCurrentStep(prev => prev + 1)} disabled={isStep0 && !step0Gate}>
              {tl('Next', 'Напред')} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

/* ── Question Card ── */
function QuestionCard({ question: q, index: idx, answer, isSubmitted, isStep0, step0NotesId, step0WordCount, onAnswer, tx, tl, lang }: {
  question: Question; index: number; answer: any; isSubmitted: boolean;
  isStep0: boolean; step0NotesId?: string; step0WordCount: number;
  onAnswer: (id: string, val: any) => void;
  tx: (en: string | null | undefined, bg: string | null | undefined) => string;
  tl: (en: string, bg: string) => string;
  lang: string;
}) {
  const promptText = tx(q.prompt, q.prompt_bg);
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary font-sans">
            Q{idx + 1}
          </span>
          <Badge variant="outline" className="text-xs font-sans">{q.points} {tl('pts', 'т.')}</Badge>
          <Badge variant="outline" className="text-xs capitalize font-sans">{q.type.replace(/_/g, ' ')}</Badge>
        </div>
        {answer && String(answer).trim().length > 0 && <CheckCircle2 className="h-5 w-5 text-sim-success" />}
      </div>
      <p className="text-sm font-medium text-foreground mb-4 leading-relaxed">{promptText}</p>

      {q.type === 'multiple_choice' && q.options && (
        <div className="grid gap-2">
          {(q.options as string[]).map((opt: string, optIdx: number) => (
            <button key={optIdx} onClick={() => onAnswer(q.id, opt)} disabled={isSubmitted}
              className={`rounded-lg border p-3 text-left text-sm transition-all ${
                answer === opt ? 'border-primary bg-accent ring-2 ring-primary/20 font-medium' : 'border-border hover:border-primary/40 hover:bg-accent/50'
              }`}>
              {opt}
            </button>
          ))}
        </div>
      )}

      {(q.type === 'short_answer' || q.type === 'long_answer') && (
        <div>
          <Textarea value={answer || ''} onChange={e => onAnswer(q.id, e.target.value)}
            placeholder={tl('Write your answer...', 'Напишете отговора си...')}
            disabled={isSubmitted}
            className={q.type === 'long_answer' ? 'min-h-[180px]' : 'min-h-[100px]'} />
          {isStep0 && step0NotesId === q.id && (
            <p className={`text-xs mt-2 font-sans ${step0WordCount >= 100 ? 'text-sim-success' : 'text-muted-foreground'}`}>
              {step0WordCount}/100 {tl('words minimum', 'думи минимум')}
            </p>
          )}
        </div>
      )}

      {q.type === 'ranking' && q.options && (
        <RankingInput options={q.options as string[]} value={answer} onChange={val => onAnswer(q.id, val)} disabled={isSubmitted} tl={tl} />
      )}

      {q.type === 'numeric_allocation' && q.options && (
        <NumericAllocationInput categories={q.options as string[]} value={answer} onChange={val => onAnswer(q.id, val)} disabled={isSubmitted} tl={tl} />
      )}
    </div>
  );
}

/* ── Ranking Input ── */
function RankingInput({ options, value, onChange, disabled, tl }: {
  options: string[]; value: any; onChange: (val: any) => void; disabled: boolean;
  tl: (en: string, bg: string) => string;
}) {
  const ranked: string[] = Array.isArray(value) ? value : [...options];
  const moveItem = (index: number, direction: -1 | 1) => {
    if (disabled) return;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= ranked.length) return;
    const updated = [...ranked];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
  };
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground font-sans mb-2">{tl('Use arrows to reorder (highest priority first)', 'Използвайте стрелките за пренареждане (най-висок приоритет отгоре)')}</p>
      {ranked.map((item, i) => (
        <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary font-sans shrink-0">{i + 1}</span>
          <span className="flex-1 text-foreground">{item}</span>
          <div className="flex flex-col gap-0.5">
            <button onClick={() => moveItem(i, -1)} disabled={i === 0 || disabled} className="p-0.5 rounded hover:bg-muted disabled:opacity-30">
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            </button>
            <button onClick={() => moveItem(i, 1)} disabled={i === ranked.length - 1 || disabled} className="p-0.5 rounded hover:bg-muted disabled:opacity-30">
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Numeric Allocation Input ── */
function NumericAllocationInput({ categories, value, onChange, disabled, tl }: {
  categories: string[]; value: any; onChange: (val: any) => void; disabled: boolean;
  tl: (en: string, bg: string) => string;
}) {
  const allocation: Record<string, number> = typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value : Object.fromEntries(categories.map(c => [c, 0]));
  const total = Object.values(allocation).reduce((s, v) => s + (v || 0), 0);
  const isValid = total === 100;
  const updateAllocation = (category: string, val: number) => {
    if (disabled) return;
    onChange({ ...allocation, [category]: Math.max(0, Math.min(100, val)) });
  };
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground font-sans">{tl('Allocate exactly 100 points across categories', 'Разпределете точно 100 точки между категориите')}</p>
      {categories.map(cat => (
        <div key={cat} className="flex items-center gap-3">
          <span className="text-sm text-foreground w-40 shrink-0">{cat}</span>
          <Input type="number" min={0} max={100} value={allocation[cat] || 0}
            onChange={e => updateAllocation(cat, parseInt(e.target.value) || 0)}
            disabled={disabled} className="w-24 h-9 text-center font-sans" />
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${allocation[cat] || 0}%` }} />
          </div>
        </div>
      ))}
      <div className={`flex items-center justify-between text-sm font-sans font-medium pt-2 border-t border-border ${isValid ? 'text-sim-success' : 'text-sim-danger'}`}>
        <span>{tl('Total', 'Общо')}</span>
        <span>{total}/100 {isValid ? '✓' : tl('— must equal 100', '— трябва да е 100')}</span>
      </div>
    </div>
  );
}
