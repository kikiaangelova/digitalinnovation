import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  ArrowLeft, ArrowRight, ExternalLink, CheckCircle2, Save,
  BookOpen, FileText, AlertTriangle, ChevronUp, ChevronDown, Lock,
  Building2, TrendingUp, BarChart3, Brain, PenTool, Rocket, Award,
} from 'lucide-react';
import type { Json } from '@/integrations/supabase/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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

const SECTION_ICONS: Record<number, React.ElementType> = {
  0: BookOpen, 1: Building2, 2: TrendingUp, 3: BarChart3,
  4: Brain, 5: PenTool, 6: Rocket, 7: Award,
};

const SECTION_LABELS_EN: Record<number, string> = {
  0: 'Research & Reading', 1: 'Business Context', 2: 'Industry Disruption',
  3: 'Data & Exhibits', 4: 'Strategic Analysis', 5: 'Innovation Proposal',
  6: 'Final Recommendation', 7: 'Conclusion',
};
const SECTION_LABELS_BG: Record<number, string> = {
  0: 'Проучване', 1: 'Бизнес контекст', 2: 'Индустриална трансформация',
  3: 'Данни и експонати', 4: 'Стратегически анализ', 5: 'Иновационно предложение',
  6: 'Финална препоръка', 7: 'Заключение',
};

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
  const autosaveRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!id) return;
    if (!user) { navigate(`/auth?redirect=${encodeURIComponent(`/case/${id}`)}`); return; }
    const fetchCase = async () => {
      const [caseRes, stepsRes] = await Promise.all([
        supabase.from('case_studies').select('id, title, title_bg, description, description_bg, topic, topic_bg, difficulty, reading_url, reading_button_label, reading_title').eq('id', id).single(),
        supabase.from('case_steps').select('id, step_order, title, title_bg, narrative, narrative_bg, exhibit_text, exhibit_text_bg').eq('case_study_id', id).order('step_order'),
      ]);
      if (caseRes.data) setCaseStudy(caseRes.data as CaseStudy);
      if (stepsRes.data) {
        setSteps(stepsRes.data as CaseStep[]);
        const stepIds = (stepsRes.data as CaseStep[]).map(s => s.id);
        const qRes = await supabase.from('questions').select('id, case_step_id, question_order, type, prompt, prompt_bg, options, points').in('case_step_id', stepIds).order('question_order');
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
      setLoading(false);
    };
    fetchCase();
  }, [id, user, navigate]);

  const currentStepData = steps[currentStep];
  const stepQuestions = currentStepData
    ? questions.filter(q => q.case_step_id === currentStepData.id).sort((a, b) => a.question_order - b.question_order)
    : [];

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
    setSaving(false);
  }, [user, id, submissionId, answers, isSubmitted]);

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
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
            <SectionIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-sans uppercase tracking-wider">{sectionLabel}</p>
            <h2 className="text-2xl font-display font-bold text-foreground">{tx(currentStepData.title, currentStepData.title_bg)}</h2>
          </div>
        </div>

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

        {(currentStepData.narrative || currentStepData.narrative_bg) && (
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className="font-display font-semibold text-foreground">{tl('Context', 'Контекст')}</h3>
            </div>
            <div className="text-sm text-foreground/85 whitespace-pre-line leading-relaxed">
              {tx(currentStepData.narrative, currentStepData.narrative_bg)}
            </div>
          </div>
        )}

        {(currentStepData.exhibit_text || currentStepData.exhibit_text_bg) && (
          <div className="rounded-lg border border-primary/20 bg-accent p-6">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-4 w-4 text-accent-foreground" />
              <h3 className="font-display font-semibold text-foreground">{tl('Data & Exhibit', 'Данни и експонат')}</h3>
            </div>
            <div className="text-sm text-foreground/85 whitespace-pre-line leading-relaxed font-sans">
              {tx(currentStepData.exhibit_text, currentStepData.exhibit_text_bg)}
            </div>
          </div>
        )}

        {stepQuestions.length > 0 && (
          <div className="space-y-6">
            {stepQuestions.map((q, idx) => (
              <QuestionCard key={q.id} question={q} index={idx} answer={answers[q.id]}
                isSubmitted={isSubmitted} isStep0={isStep0} step0NotesId={step0NotesQuestion?.id}
                step0WordCount={step0WordCount} onAnswer={updateAnswer} tx={tx} tl={tl} lang={lang} />
            ))}
          </div>
        )}

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
            <Button onClick={handleSubmit} className="sim-gradient border-0">
              <Lock className="h-4 w-4 mr-1" /> {tl('Submit Case', 'Изпрати казуса')}
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
