import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Clock, CheckCircle2, Lock, AlertTriangle } from 'lucide-react';
import type { Json } from '@/integrations/supabase/types';

interface AssessmentQ {
  id: string;
  type: string;
  prompt: string;
  options: Json;
  points: number;
  correct_answer: string | null;
  question_order: number;
  competency_id: string | null;
}

export default function AssessmentPlayer() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<any>(null);
  const [questions, setQuestions] = useState<AssessmentQ[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [startedAt, setStartedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !user) return;
    const fetch = async () => {
      const { data: a } = await supabase.from('assessments').select('*').eq('id', id).single();
      if (a) setAssessment(a);
      const { data: qs } = await supabase.from('assessment_questions').select('id, type, prompt, options, points, correct_answer, question_order, competency_id').eq('assessment_id', id).order('question_order');
      if (qs) setQuestions(qs);

      // Check existing submission
      const { data: sub } = await supabase.from('submissions').select('id, is_draft, started_at').eq('assessment_id', id).eq('user_id', user.id).maybeSingle();
      if (sub) {
        setSubmissionId(sub.id);
        setIsSubmitted(!sub.is_draft);
        setStartedAt(sub.started_at);
        if (!sub.is_draft) {
          navigate(`/assessment/${id}/results`);
          return;
        }
        const { data: resps } = await supabase.from('responses').select('question_id, answer').eq('submission_id', sub.id);
        if (resps) {
          const map: Record<string, any> = {};
          resps.forEach(r => { map[r.question_id] = r.answer; });
          setAnswers(map);
        }
      }
      setLoading(false);
    };
    fetch();
  }, [id, user, navigate]);

  // Timer
  useEffect(() => {
    if (!assessment || !startedAt) return;
    const settings = assessment.settings_json || {};
    if (!settings.timed) return;
    const limitMs = (settings.time_limit_minutes || 60) * 60 * 1000;
    const elapsed = Date.now() - new Date(startedAt).getTime();
    const remaining = Math.max(0, limitMs - elapsed);
    setTimeLeft(Math.floor(remaining / 1000));

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [assessment, startedAt]);

  const startAssessment = async () => {
    if (!user || !id) return;
    const { data } = await supabase.from('submissions').insert({
      assessment_id: id,
      user_id: user.id,
      is_draft: true,
      case_study_id: '00000000-0000-0000-0000-000000000000', // placeholder
      started_at: new Date().toISOString(),
    }).select('id, started_at').single();
    if (data) {
      setSubmissionId(data.id);
      setStartedAt(data.started_at);
    }
  };

  const saveDraft = useCallback(async () => {
    if (!submissionId || isSubmitted) return;
    setSaving(true);
    const upserts = Object.entries(answers).map(([qId, answer]) => ({
      submission_id: submissionId,
      question_id: qId,
      answer: answer as Json,
    }));
    if (upserts.length > 0) {
      await supabase.from('responses').upsert(upserts, { onConflict: 'submission_id,question_id' });
    }
    setSaving(false);
  }, [submissionId, answers, isSubmitted]);

  // Autosave every 30s
  useEffect(() => {
    if (!submissionId || isSubmitted) return;
    const interval = setInterval(saveDraft, 30000);
    return () => clearInterval(interval);
  }, [saveDraft, submissionId, isSubmitted]);

  const handleSubmit = async () => {
    await saveDraft();
    if (!submissionId) return;

    let totalScore = 0;
    let maxScore = 0;
    for (const q of questions) {
      maxScore += q.points;
      if (q.type === 'multiple_choice' && q.correct_answer) {
        const userAns = answers[q.id];
        const score = userAns === q.correct_answer ? q.points : 0;
        totalScore += score;
        await supabase.from('responses').update({
          score,
          feedback: score > 0 ? 'Correct!' : `Incorrect. Answer: ${q.correct_answer}`,
          auto_graded: true,
        }).eq('submission_id', submissionId).eq('question_id', q.id);
      }
    }
    await supabase.from('submissions').update({
      is_draft: false,
      submitted_at: new Date().toISOString(),
      total_score: totalScore,
      max_score: maxScore,
    }).eq('id', submissionId);

    toast.success('Assessment submitted!');
    navigate(`/assessment/${id}/results`);
  };

  const updateAnswer = (qId: string, val: any) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  if (loading) return <div className="min-h-screen bg-background"><AppHeader /><div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div></div>;
  if (!assessment) return <div className="min-h-screen bg-background"><AppHeader /><div className="flex items-center justify-center py-20 text-muted-foreground">Assessment not found</div></div>;

  const settings = assessment.settings_json || {};

  // Start screen
  if (!submissionId) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto px-4 py-12 max-w-xl text-center space-y-6">
          <h1 className="text-3xl font-display font-bold text-foreground">{assessment.title}</h1>
          <div className="flex justify-center gap-4">
            {settings.timed && <Badge variant="outline"><Clock className="h-3 w-3 mr-1" /> {settings.time_limit_minutes} min</Badge>}
            <Badge variant="outline">{questions.length} questions</Badge>
            <Badge variant="outline">{questions.reduce((s: number, q: AssessmentQ) => s + q.points, 0)} points</Badge>
          </div>
          {settings.timed && (
            <div className="flex items-center gap-2 justify-center text-sm text-sim-warning">
              <AlertTriangle className="h-4 w-4" /> This is a timed assessment. The timer starts when you begin.
            </div>
          )}
          <Button onClick={startAssessment} size="lg" className="sim-gradient border-0">Begin Assessment</Button>
          <Button variant="ghost" size="sm" asChild><Link to="/dashboard"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Link></Button>
        </main>
      </div>
    );
  }

  const q = questions[currentQ];
  const answeredCount = questions.filter(q => answers[q.id] && String(answers[q.id]).trim().length > 0).length;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-display font-semibold text-foreground truncate">{assessment.title}</h2>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>Q {currentQ + 1}/{questions.length}</span>
              <span>{answeredCount} answered</span>
              {timeLeft !== null && (
                <Badge className={timeLeft < 300 ? 'bg-sim-danger/10 text-sim-danger border-0' : 'bg-accent text-accent-foreground'}>
                  <Clock className="h-3 w-3 mr-1" /> {formatTime(timeLeft)}
                </Badge>
              )}
            </div>
          </div>
          <Progress value={((currentQ + 1) / questions.length) * 100} className="h-2" />
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        {q && (
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{currentQ + 1}</span>
              <Badge variant="outline" className="text-xs">{q.points} pts</Badge>
              <Badge variant="outline" className="text-xs capitalize">{q.type.replace(/_/g, ' ')}</Badge>
            </div>
            <p className="text-sm font-medium text-foreground mb-4 leading-relaxed">{q.prompt}</p>

            {q.type === 'multiple_choice' && q.options && (
              <div className="grid gap-2">
                {(q.options as string[]).map((opt, i) => (
                  <button key={i} onClick={() => updateAnswer(q.id, opt)} disabled={isSubmitted}
                    className={`rounded-lg border p-3 text-left text-sm transition-all ${
                      answers[q.id] === opt ? 'border-primary bg-accent ring-2 ring-primary/20 font-medium' : 'border-border hover:border-primary/40'
                    }`}>{opt}</button>
                ))}
              </div>
            )}

            {q.type === 'short_answer' && (
              <Textarea value={answers[q.id] || ''} onChange={e => updateAnswer(q.id, e.target.value)} placeholder="Write your answer..." disabled={isSubmitted} className="min-h-[120px]" />
            )}
          </div>
        )}

        {/* Question nav dots */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {questions.map((q, i) => (
            <button key={q.id} onClick={() => setCurrentQ(i)}
              className={`h-7 w-7 rounded-full text-xs font-medium transition-colors ${
                i === currentQ ? 'bg-primary text-primary-foreground'
                : answers[q.id] ? 'bg-sim-success/20 text-sim-success'
                : 'bg-muted text-muted-foreground'
              }`}>{i + 1}</button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button variant="outline" onClick={() => setCurrentQ(p => p - 1)} disabled={currentQ === 0}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <div className="flex items-center gap-2">
            {saving && <span className="text-xs text-muted-foreground animate-pulse">Saving...</span>}
          </div>
          {currentQ === questions.length - 1 ? (
            <Button onClick={handleSubmit} className="sim-gradient border-0"><Lock className="h-4 w-4 mr-1" /> Submit</Button>
          ) : (
            <Button onClick={() => setCurrentQ(p => p + 1)}>Next <ArrowRight className="h-4 w-4 ml-1" /></Button>
          )}
        </div>
      </main>
    </div>
  );
}
