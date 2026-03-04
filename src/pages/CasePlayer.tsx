import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  ArrowLeft, ArrowRight, ExternalLink, CheckCircle2, Save,
  BookOpen, FileText, AlertTriangle, ChevronUp, ChevronDown, Lock,
} from 'lucide-react';
import type { Json } from '@/integrations/supabase/types';

interface CaseStudy {
  id: string;
  title: string;
  description: string | null;
  topic: string | null;
  difficulty: string;
  reading_url: string | null;
  reading_button_label: string | null;
  reading_title: string | null;
}

interface CaseStep {
  id: string;
  step_order: number;
  title: string;
  narrative: string | null;
  exhibit_text: string | null;
}

interface Question {
  id: string;
  case_step_id: string;
  question_order: number;
  type: string;
  prompt: string;
  options: Json;
  points: number;
  correct_answer: string | null;
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function CasePlayer() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

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
    if (!id || !user) return;
    const fetchCase = async () => {
      const [caseRes, stepsRes] = await Promise.all([
        supabase.from('case_studies').select('id, title, description, topic, difficulty, reading_url, reading_button_label, reading_title').eq('id', id).single(),
        supabase.from('case_steps').select('id, step_order, title, narrative, exhibit_text').eq('case_study_id', id).order('step_order'),
      ]);

      if (caseRes.data) setCaseStudy(caseRes.data);
      if (stepsRes.data) {
        setSteps(stepsRes.data);
        const stepIds = stepsRes.data.map(s => s.id);
        const qRes = await supabase.from('questions').select('id, case_step_id, question_order, type, prompt, options, points, correct_answer').in('case_step_id', stepIds).order('question_order');
        if (qRes.data) setQuestions(qRes.data);
      }

      const subRes = await supabase.from('submissions').select('id, is_draft').eq('case_study_id', id).eq('user_id', user.id).maybeSingle();
      if (subRes.data) {
        setSubmissionId(subRes.data.id);
        setIsSubmitted(!subRes.data.is_draft);
        if (!subRes.data.is_draft) {
          navigate(`/case/${id}/results`);
          return;
        }
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
      const { data, error } = await supabase.from('submissions').insert({
        case_study_id: id,
        user_id: user.id,
        is_draft: true,
      }).select('id').single();
      if (data) { subId = data.id; setSubmissionId(data.id); }
      if (error) { setSaving(false); return; }
    }

    const upserts = Object.entries(answers).map(([questionId, answer]) => ({
      submission_id: subId!,
      question_id: questionId,
      answer: answer as Json,
    }));

    if (upserts.length > 0) {
      await supabase.from('responses').upsert(upserts, { onConflict: 'submission_id,question_id' });
    }
    setSaving(false);
  }, [user, id, submissionId, answers, isSubmitted]);

  // 30-second autosave
  useEffect(() => {
    if (isSubmitted || Object.keys(answers).length === 0) return;
    if (autosaveRef.current) clearInterval(autosaveRef.current);
    autosaveRef.current = setInterval(() => {
      saveDraft();
    }, 30000);
    return () => { if (autosaveRef.current) clearInterval(autosaveRef.current); };
  }, [saveDraft, isSubmitted, answers]);

  const handleSubmit = async () => {
    await saveDraft();
    if (!submissionId) return;

    let totalScore = 0;
    let maxScore = 0;

    for (const q of questions) {
      maxScore += q.points;
      if (q.type === 'multiple_choice' && q.correct_answer) {
        const userAnswer = answers[q.id];
        if (userAnswer === q.correct_answer) {
          totalScore += q.points;
          await supabase.from('responses').update({ score: q.points, feedback: 'Correct!', auto_graded: true }).eq('submission_id', submissionId).eq('question_id', q.id);
        } else {
          await supabase.from('responses').update({ score: 0, feedback: `Incorrect. The correct answer is: ${q.correct_answer}`, auto_graded: true }).eq('submission_id', submissionId).eq('question_id', q.id);
        }
      }
    }

    await supabase.from('submissions').update({
      is_draft: false,
      submitted_at: new Date().toISOString(),
      total_score: totalScore,
      max_score: maxScore,
    }).eq('id', submissionId);

    toast.success('Case submitted successfully!');
    navigate(`/case/${id}/results`);
  };

  const updateAnswer = (questionId: string, value: any) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // Reading gate: check 100-word minimum on step 0
  const isStep0 = currentStepData?.step_order === 0;
  const step0Questions = isStep0 ? stepQuestions : [];
  const step0NotesQuestion = step0Questions.find(q => q.type === 'long_answer' || q.type === 'short_answer');
  const step0WordCount = step0NotesQuestion ? wordCount(String(answers[step0NotesQuestion.id] || '')) : 0;
  const step0Gate = isStep0 && step0NotesQuestion ? step0WordCount >= 100 : true;

  // Progress calculation
  const totalQuestions = questions.length;
  const answeredQuestions = questions.filter(q => answers[q.id] && String(answers[q.id]).trim().length > 0).length;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20 text-muted-foreground">Loading case...</div>
      </div>
    );
  }

  if (!caseStudy || steps.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20 text-muted-foreground">Case not found</div>
      </div>
    );
  }

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Progress header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-display font-semibold text-foreground truncate">{caseStudy.title}</h2>
            <span className="text-xs text-muted-foreground shrink-0 ml-2">
              Step {currentStep + 1} of {steps.length} · {progressPercent}% complete
            </span>
          </div>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
          <div className="flex gap-1 mt-2">
            {steps.map((s, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`text-xs px-2 py-1 rounded-md transition-colors ${
                  i === currentStep
                    ? 'bg-primary text-primary-foreground font-medium'
                    : i < currentStep
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        {/* Step title */}
        <div>
          <Badge variant="outline" className="mb-2 text-xs font-sans">
            Step {currentStepData.step_order}
          </Badge>
          <h2 className="text-2xl font-display font-bold text-foreground">{currentStepData.title}</h2>
        </div>

        {/* Reading button for step 0 */}
        {isStep0 && caseStudy.reading_url && (
          <a
            href={caseStudy.reading_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-lg border-2 border-primary/30 bg-accent p-5 hover:border-primary/60 transition-all group"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-lg sim-gradient shrink-0">
              <ExternalLink className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-display font-semibold text-foreground text-lg">
                {caseStudy.reading_button_label || 'Open Required Reading'}
              </p>
              <p className="text-sm text-muted-foreground">Opens in a new tab — read before answering</p>
            </div>
            <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
          </a>
        )}

        {/* Narrative */}
        {currentStepData.narrative && (
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className="font-display font-semibold text-foreground">Context</h3>
            </div>
            <div className="text-sm text-foreground/85 whitespace-pre-line leading-relaxed">
              {currentStepData.narrative}
            </div>
          </div>
        )}

        {/* Exhibit */}
        {currentStepData.exhibit_text && (
          <div className="rounded-lg border border-primary/20 bg-accent p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-accent-foreground" />
              <h3 className="font-display font-semibold text-foreground">Exhibit</h3>
            </div>
            <div className="text-sm text-foreground/85 whitespace-pre-line leading-relaxed">
              {currentStepData.exhibit_text}
            </div>
          </div>
        )}

        {/* Questions */}
        {stepQuestions.length > 0 && (
          <div className="space-y-6">
            {stepQuestions.map((q, idx) => (
              <div key={q.id} className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary font-sans">
                      Q{idx + 1}
                    </span>
                    <Badge variant="outline" className="text-xs font-sans">{q.points} pts</Badge>
                    <Badge variant="outline" className="text-xs capitalize font-sans">{q.type.replace(/_/g, ' ')}</Badge>
                  </div>
                  {answers[q.id] && String(answers[q.id]).trim().length > 0 && (
                    <CheckCircle2 className="h-5 w-5 text-sim-success" />
                  )}
                </div>
                <p className="text-sm font-medium text-foreground mb-4 leading-relaxed">{q.prompt}</p>

                {/* Multiple choice */}
                {q.type === 'multiple_choice' && q.options && (
                  <div className="grid gap-2">
                    {(q.options as string[]).map((opt: string, optIdx: number) => (
                      <button
                        key={optIdx}
                        onClick={() => updateAnswer(q.id, opt)}
                        disabled={isSubmitted}
                        className={`rounded-lg border p-3 text-left text-sm transition-all ${
                          answers[q.id] === opt
                            ? 'border-primary bg-accent ring-2 ring-primary/20 font-medium'
                            : 'border-border hover:border-primary/40 hover:bg-accent/50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Short answer */}
                {q.type === 'short_answer' && (
                  <div>
                    <Textarea
                      value={answers[q.id] || ''}
                      onChange={e => updateAnswer(q.id, e.target.value)}
                      placeholder="Write your answer..."
                      disabled={isSubmitted}
                      className="min-h-[100px]"
                    />
                    {isStep0 && step0NotesQuestion?.id === q.id && (
                      <p className={`text-xs mt-2 font-sans ${step0WordCount >= 100 ? 'text-sim-success' : 'text-muted-foreground'}`}>
                        {step0WordCount}/100 words minimum
                      </p>
                    )}
                  </div>
                )}

                {/* Long answer */}
                {q.type === 'long_answer' && (
                  <div>
                    <Textarea
                      value={answers[q.id] || ''}
                      onChange={e => updateAnswer(q.id, e.target.value)}
                      placeholder="Write your detailed answer..."
                      disabled={isSubmitted}
                      className="min-h-[180px]"
                    />
                    {isStep0 && step0NotesQuestion?.id === q.id && (
                      <p className={`text-xs mt-2 font-sans ${step0WordCount >= 100 ? 'text-sim-success' : 'text-muted-foreground'}`}>
                        {step0WordCount}/100 words minimum
                      </p>
                    )}
                  </div>
                )}

                {/* Ranking */}
                {q.type === 'ranking' && q.options && (
                  <RankingInput
                    options={q.options as string[]}
                    value={answers[q.id]}
                    onChange={val => updateAnswer(q.id, val)}
                    disabled={isSubmitted}
                  />
                )}

                {/* Numeric allocation */}
                {q.type === 'numeric_allocation' && q.options && (
                  <NumericAllocationInput
                    categories={q.options as string[]}
                    value={answers[q.id]}
                    onChange={val => updateAnswer(q.id, val)}
                    disabled={isSubmitted}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Reading gate warning */}
        {isStep0 && !step0Gate && (
          <div className="flex items-center gap-2 rounded-lg border border-sim-warning/30 bg-sim-warning/5 p-4">
            <AlertTriangle className="h-5 w-5 text-sim-warning shrink-0" />
            <p className="text-sm text-foreground">
              Please write at least <strong>100 words</strong> in your research notes before proceeding. ({step0WordCount}/100)
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 pb-10 border-t border-border">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={isFirstStep}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Previous
          </Button>

          <div className="flex items-center gap-2">
            {saving && <span className="text-xs text-muted-foreground animate-pulse">Saving...</span>}
            <Button variant="outline" size="sm" onClick={saveDraft} disabled={saving}>
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>

          {isLastStep ? (
            <Button onClick={handleSubmit} className="sim-gradient border-0">
              <Lock className="h-4 w-4 mr-1" /> Submit Case
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={isStep0 && !step0Gate}
            >
              Next <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

/* ── Ranking Input ── */
function RankingInput({ options, value, onChange, disabled }: {
  options: string[];
  value: any;
  onChange: (val: any) => void;
  disabled: boolean;
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
      <p className="text-xs text-muted-foreground font-sans mb-2">Use arrows to reorder (highest priority first)</p>
      {ranked.map((item, i) => (
        <div
          key={item}
          className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary font-sans shrink-0">
            {i + 1}
          </span>
          <span className="flex-1 text-foreground">{item}</span>
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => moveItem(i, -1)}
              disabled={i === 0 || disabled}
              className="p-0.5 rounded hover:bg-muted disabled:opacity-30"
            >
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => moveItem(i, 1)}
              disabled={i === ranked.length - 1 || disabled}
              className="p-0.5 rounded hover:bg-muted disabled:opacity-30"
            >
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Numeric Allocation Input ── */
function NumericAllocationInput({ categories, value, onChange, disabled }: {
  categories: string[];
  value: any;
  onChange: (val: any) => void;
  disabled: boolean;
}) {
  const allocation: Record<string, number> = typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value
    : Object.fromEntries(categories.map(c => [c, 0]));

  const total = Object.values(allocation).reduce((s, v) => s + (v || 0), 0);
  const isValid = total === 100;

  const updateAllocation = (category: string, val: number) => {
    if (disabled) return;
    const updated = { ...allocation, [category]: Math.max(0, Math.min(100, val)) };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground font-sans">Allocate exactly 100 points across categories</p>
      {categories.map(cat => (
        <div key={cat} className="flex items-center gap-3">
          <span className="text-sm text-foreground w-40 shrink-0">{cat}</span>
          <Input
            type="number"
            min={0}
            max={100}
            value={allocation[cat] || 0}
            onChange={e => updateAllocation(cat, parseInt(e.target.value) || 0)}
            disabled={disabled}
            className="w-24 h-9 text-center font-sans"
          />
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${allocation[cat] || 0}%` }}
            />
          </div>
        </div>
      ))}
      <div className={`flex items-center justify-between text-sm font-sans font-medium pt-2 border-t border-border ${isValid ? 'text-sim-success' : 'text-sim-danger'}`}>
        <span>Total</span>
        <span>{total}/100 {isValid ? '✓' : '— must equal 100'}</span>
      </div>
    </div>
  );
}
