import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, ArrowLeft, Trophy, BookOpen } from 'lucide-react';
import type { Json } from '@/integrations/supabase/types';

interface QuestionResult {
  question_id: string;
  prompt: string;
  type: string;
  points: number;
  answer: Json;
  score: number | null;
  feedback: string | null;
  correct_answer: string | null;
  model_answer: string | null;
  step_title: string;
}

export default function CaseResults() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [caseTitle, setCaseTitle] = useState('');
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !user) return;
    const fetch = async () => {
      const caseRes = await supabase.from('case_studies').select('title').eq('id', id).single();
      if (caseRes.data) setCaseTitle(caseRes.data.title);

      const subRes = await supabase.from('submissions').select('id, total_score, max_score').eq('case_study_id', id).eq('user_id', user.id).eq('is_draft', false).single();
      if (!subRes.data) { setLoading(false); return; }

      setTotalScore(subRes.data.total_score || 0);
      setMaxScore(subRes.data.max_score || 0);

      const respRes = await supabase.from('responses').select('question_id, answer, score, feedback').eq('submission_id', subRes.data.id);
      const responses = respRes.data || [];

      // Fetch all questions with step info
      const stepsRes = await supabase.from('case_steps').select('id, title').eq('case_study_id', id);
      const stepMap: Record<string, string> = {};
      stepsRes.data?.forEach(s => { stepMap[s.id] = s.title; });

      const stepIds = Object.keys(stepMap);
      const qRes = await supabase.from('questions').select('id, case_step_id, prompt, type, points, correct_answer, model_answer').in('case_step_id', stepIds).order('question_order');

      const questionResults: QuestionResult[] = (qRes.data || []).map(q => {
        const resp = responses.find(r => r.question_id === q.id);
        return {
          question_id: q.id,
          prompt: q.prompt,
          type: q.type,
          points: q.points,
          answer: resp?.answer ?? null,
          score: resp?.score ?? null,
          feedback: resp?.feedback ?? null,
          correct_answer: q.correct_answer,
          model_answer: q.model_answer,
          step_title: stepMap[q.case_step_id] || 'Unknown Step',
        };
      });

      setResults(questionResults);
      setLoading(false);
    };
    fetch();
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20 text-muted-foreground">Loading results...</div>
      </div>
    );
  }

  const scorePercent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard</Link>
        </Button>

        {/* Score summary */}
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <Trophy className={`h-12 w-12 mx-auto mb-3 ${scorePercent >= 70 ? 'text-sim-success' : scorePercent >= 40 ? 'text-sim-warning' : 'text-sim-danger'}`} />
          <h1 className="text-2xl font-bold text-foreground mb-1">{caseTitle}</h1>
          <p className="text-4xl font-bold sim-gradient-text mb-1">{totalScore}/{maxScore}</p>
          <p className="text-muted-foreground">
            {scorePercent}% · {scorePercent >= 70 ? 'Great work!' : scorePercent >= 40 ? 'Good effort' : 'Keep practicing'}
          </p>
        </div>

        {/* Detailed results */}
        <div className="space-y-4">
          {results.map((r, idx) => (
            <div key={r.question_id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{r.step_title}</p>
                  <p className="text-sm font-medium text-foreground">{r.prompt}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {r.score !== null ? (
                    <>
                      {r.score === r.points ? (
                        <CheckCircle2 className="h-5 w-5 text-sim-success" />
                      ) : r.score > 0 ? (
                        <Badge className="bg-sim-warning/10 text-sim-warning border-0">{r.score}/{r.points}</Badge>
                      ) : (
                        <XCircle className="h-5 w-5 text-sim-danger" />
                      )}
                      <Badge variant="outline">{r.score}/{r.points}</Badge>
                    </>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">Pending · {r.points} pts</Badge>
                  )}
                </div>
              </div>

              {/* User's answer */}
              <div className="rounded-lg bg-muted/50 p-3 mb-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Your Answer</p>
                <p className="text-sm text-foreground">
                  {r.answer ? (typeof r.answer === 'string' ? r.answer : JSON.stringify(r.answer)) : 'No answer provided'}
                </p>
              </div>

              {/* Feedback */}
              {r.feedback && (
                <div className={`rounded-lg p-3 mb-3 ${r.score === r.points ? 'bg-sim-success/5 border border-sim-success/20' : 'bg-sim-danger/5 border border-sim-danger/20'}`}>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Feedback</p>
                  <p className="text-sm text-foreground">{r.feedback}</p>
                </div>
              )}

              {/* Model answer */}
              {r.model_answer && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                    <p className="text-xs font-medium text-primary">Model Answer</p>
                  </div>
                  <p className="text-sm text-foreground/80 whitespace-pre-line">{r.model_answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
