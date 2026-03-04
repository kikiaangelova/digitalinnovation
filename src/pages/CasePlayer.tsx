import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ArrowLeft, ArrowRight, ExternalLink, CheckCircle2, Save,
  BookOpen, FileText, AlertTriangle,
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

  useEffect(() => {
    if (!id || !user) return;
    const fetchCase = async () => {
      const [caseRes, stepsRes, questionsRes] = await Promise.all([
        supabase.from('case_studies').select('id, title, description, topic, difficulty, reading_url, reading_button_label, reading_title').eq('id', id).single(),
        supabase.from('case_steps').select('id, step_order, title, narrative, exhibit_text').eq('case_study_id', id).order('step_order'),
        supabase.from('questions').select('id, case_step_id, question_order, type, prompt, options, points, correct_answer').eq('case_step_id', id), // will be overridden
      ]);

      if (caseRes.data) setCaseStudy(caseRes.data);
      if (stepsRes.data) {
        setSteps(stepsRes.data);
        // Fetch questions for all steps
        const stepIds = stepsRes.data.map(s => s.id);
        const qRes = await supabase.from('questions').select('id, case_step_id, question_order, type, prompt, options, points, correct_answer').in('case_step_id', stepIds).order('question_order');
        if (qRes.data) setQuestions(qRes.data);
      }

      // Check existing submission
      const subRes = await supabase.from('submissions').select('id, is_draft').eq('case_study_id', id).eq('user_id', user.id).maybeSingle();
      if (subRes.data) {
        setSubmissionId(subRes.data.id);
        setIsSubmitted(!subRes.data.is_draft);

        if (!subRes.data.is_draft) {
          navigate(`/case/${id}/results`);
          return;
        }

        // Load existing responses
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
      if (data) {
        subId = data.id;
        setSubmissionId(data.id);
      }
      if (error) {
        toast.error('Failed to save draft');
        setSaving(false);
        return;
      }
    }

    // Upsert responses
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

  // Autosave
  useEffect(() => {
    if (isSubmitted || Object.keys(answers).length === 0) return;
    const timer = setTimeout(saveDraft, 2000);
    return () => clearTimeout(timer);
  }, [answers, saveDraft, isSubmitted]);

  const handleSubmit = async () => {
    await saveDraft();
    if (!submissionId) return;

    // Auto-grade objective questions
    let totalScore = 0;
    let maxScore = 0;

    for (const q of questions) {
      maxScore += q.points;
      if (q.type === 'multiple_choice' && q.correct_answer) {
        const userAnswer = answers[q.id];
        if (userAnswer === q.correct_answer) {
          totalScore += q.points;
          await supabase.from('responses').update({
            score: q.points,
            feedback: 'Correct!',
            auto_graded: true,
          }).eq('submission_id', submissionId).eq('question_id', q.id);
        } else {
          await supabase.from('responses').update({
            score: 0,
            feedback: `Incorrect. The correct answer is: ${q.correct_answer}`,
            auto_graded: true,
          }).eq('submission_id', submissionId).eq('question_id', q.id);
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

      {/* Progress bar */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-foreground truncate">{caseStudy.title}</h2>
            <span className="text-xs text-muted-foreground shrink-0 ml-2">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i === currentStep ? 'sim-gradient' : i < currentStep ? 'bg-primary/40' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 max-w-3xl space-y-6">
        {/* Step title */}
        <div>
          <Badge variant="outline" className="mb-2 text-xs">
            Step {currentStepData.step_order}
          </Badge>
          <h2 className="text-xl font-bold text-foreground">{currentStepData.title}</h2>
        </div>

        {/* Reading button for step 0 */}
        {currentStepData.step_order === 0 && caseStudy.reading_url && (
          <a
            href={caseStudy.reading_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border-2 border-primary/30 bg-primary/5 p-5 hover:bg-primary/10 transition-colors"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl sim-gradient shrink-0">
              <ExternalLink className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">
                {caseStudy.reading_button_label || 'Open Required Reading'}
              </p>
              <p className="text-sm text-muted-foreground">Opens in a new tab</p>
            </div>
            <ArrowRight className="h-5 w-5 text-primary" />
          </a>
        )}

        {/* Narrative */}
        {currentStepData.narrative && (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Context</h3>
            </div>
            <div className="text-sm text-foreground/85 whitespace-pre-line leading-relaxed">
              {currentStepData.narrative}
            </div>
          </div>
        )}

        {/* Exhibit */}
        {currentStepData.exhibit_text && (
          <div className="rounded-xl border border-sim-info/30 bg-sim-info/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-sim-info" />
              <h3 className="font-semibold text-foreground text-sm">Exhibit</h3>
            </div>
            <div className="text-sm text-foreground/85 whitespace-pre-line leading-relaxed">
              {currentStepData.exhibit_text}
            </div>
          </div>
        )}

        {/* Questions */}
        {stepQuestions.length > 0 && (
          <div className="space-y-5">
            {stepQuestions.map((q, idx) => (
              <div key={q.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      Q{idx + 1}
                    </span>
                    <Badge variant="outline" className="text-xs">{q.points} pts</Badge>
                    <Badge variant="outline" className="text-xs capitalize">{q.type.replace('_', ' ')}</Badge>
                  </div>
                  {answers[q.id] && <CheckCircle2 className="h-4 w-4 text-sim-success" />}
                </div>
                <p className="text-sm font-medium text-foreground mb-3">{q.prompt}</p>

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
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'border-border hover:border-primary/40'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Short answer */}
                {q.type === 'short_answer' && (
                  <Textarea
                    value={answers[q.id] || ''}
                    onChange={e => updateAnswer(q.id, e.target.value)}
                    placeholder="Write your answer..."
                    disabled={isSubmitted}
                    className="min-h-[80px]"
                  />
                )}

                {/* Long answer */}
                {q.type === 'long_answer' && (
                  <Textarea
                    value={answers[q.id] || ''}
                    onChange={e => updateAnswer(q.id, e.target.value)}
                    placeholder="Write your detailed answer..."
                    disabled={isSubmitted}
                    className="min-h-[150px]"
                  />
                )}

                {/* Ranking */}
                {q.type === 'ranking' && (
                  <Textarea
                    value={answers[q.id] || ''}
                    onChange={e => updateAnswer(q.id, e.target.value)}
                    placeholder="Provide your ranking and justification..."
                    disabled={isSubmitted}
                    className="min-h-[120px]"
                  />
                )}

                {/* Numeric allocation */}
                {q.type === 'numeric_allocation' && (
                  <Textarea
                    value={answers[q.id] || ''}
                    onChange={e => updateAnswer(q.id, e.target.value)}
                    placeholder="Enter your allocation (e.g., Area1: 30, Area2: 20...) and explain your rationale..."
                    disabled={isSubmitted}
                    className="min-h-[120px]"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 pb-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={isFirstStep}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Previous
          </Button>

          <div className="flex items-center gap-2">
            {saving && <span className="text-xs text-muted-foreground">Saving...</span>}
            <Button variant="outline" size="sm" onClick={saveDraft} disabled={saving}>
              <Save className="h-4 w-4 mr-1" /> Save Draft
            </Button>
          </div>

          {isLastStep ? (
            <Button onClick={handleSubmit} className="sim-gradient border-0">
              Submit Case
            </Button>
          ) : (
            <Button onClick={() => setCurrentStep(prev => prev + 1)}>
              Next <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
