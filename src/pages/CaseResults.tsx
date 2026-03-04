import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, ArrowLeft, Trophy, BookOpen, Award, Rocket, Star } from 'lucide-react';
import type { Json } from '@/integrations/supabase/types';

interface QuestionResult {
  question_id: string; prompt: string; type: string; points: number;
  answer: Json; score: number | null; feedback: string | null;
  correct_answer: string | null; model_answer: string | null;
  rubric: string | null; step_title: string;
}

export default function CaseResults() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { lang } = useLang();
  const tx = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const [caseTitle, setCaseTitle] = useState('');
  const [caseTopic, setCaseTopic] = useState('');
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !user) return;
    const fetchResults = async () => {
      const caseRes = await supabase.from('case_studies').select('title, topic').eq('id', id).single();
      if (caseRes.data) { setCaseTitle(caseRes.data.title); setCaseTopic(caseRes.data.topic || ''); }

      const subRes = await supabase.from('submissions').select('id, total_score, max_score').eq('case_study_id', id).eq('user_id', user.id).eq('is_draft', false).single();
      if (!subRes.data) { setLoading(false); return; }
      setTotalScore(subRes.data.total_score || 0);
      setMaxScore(subRes.data.max_score || 0);

      const respRes = await supabase.from('responses').select('question_id, answer, score, feedback').eq('submission_id', subRes.data.id);
      const responses = respRes.data || [];
      const stepsRes = await supabase.from('case_steps').select('id, title').eq('case_study_id', id);
      const stepMap: Record<string, string> = {};
      stepsRes.data?.forEach(s => { stepMap[s.id] = s.title; });
      const stepIds = Object.keys(stepMap);
      const qRes = await supabase.rpc('get_case_results_questions', { _case_study_id: id });

      setResults((qRes.data || []).map(q => {
        const resp = responses.find(r => r.question_id === q.id);
        return {
          question_id: q.id, prompt: q.prompt, type: q.type, points: q.points,
          answer: resp?.answer ?? null, score: resp?.score ?? null,
          feedback: resp?.feedback ?? null, correct_answer: q.correct_answer,
          model_answer: q.model_answer, rubric: q.rubric,
          step_title: stepMap[q.case_step_id] || 'Unknown',
        };
      }));
      setLoading(false);
    };
    fetchResults();
  }, [id, user]);

  if (loading) return (
    <div className="min-h-screen bg-background"><AppHeader />
      <div className="flex items-center justify-center py-20 text-muted-foreground">{tx('Loading results...', 'Зареждане...')}</div>
    </div>
  );

  const scorePercent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const gradeLabel = scorePercent >= 80 ? tx('Excellent', 'Отлично') : scorePercent >= 60 ? tx('Good', 'Добро') : scorePercent >= 40 ? tx('Developing', 'В развитие') : tx('Needs Work', 'Нуждае се от работа');
  const gradeColor = scorePercent >= 80 ? 'text-sim-success' : scorePercent >= 60 ? 'text-primary' : scorePercent >= 40 ? 'text-sim-warning' : 'text-sim-danger';
  const xpEarned = 50; // base XP for case completion
  const autoGraded = results.filter(r => r.score !== null).length;
  const pendingGrade = results.length - autoGraded;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard"><ArrowLeft className="h-4 w-4 mr-1" /> {tx('Back to Dashboard', 'Към таблото')}</Link>
        </Button>

        {/* Score hero */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="sim-gradient px-8 py-10 text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-primary-foreground/80" />
            <h1 className="text-3xl font-display font-bold text-primary-foreground mb-1">{caseTitle}</h1>
            {caseTopic && <p className="text-sm text-primary-foreground/70 mb-4">{caseTopic}</p>}
            <p className="text-5xl font-display font-bold text-primary-foreground">{totalScore}/{maxScore}</p>
            <p className="text-lg text-primary-foreground/80 mt-1">{scorePercent}% · {gradeLabel}</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 divide-x divide-border">
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Star className="h-4 w-4" />
                <span className="text-lg font-bold font-sans">+{xpEarned}</span>
              </div>
              <p className="text-xs text-muted-foreground">{tx('XP Earned', 'XP спечелени')}</p>
            </div>
            <div className="p-4 text-center">
              <p className={`text-lg font-bold font-sans ${gradeColor}`}>{gradeLabel}</p>
              <p className="text-xs text-muted-foreground">{tx('Grade', 'Оценка')}</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-lg font-bold font-sans text-foreground">{autoGraded}/{results.length}</p>
              <p className="text-xs text-muted-foreground">{tx('Auto-graded', 'Автоматично оценени')}</p>
            </div>
          </div>
        </div>

        {/* Pending notice */}
        {pendingGrade > 0 && (
          <div className="flex items-center gap-3 rounded-lg border border-sim-warning/30 bg-sim-warning/5 p-4">
            <Award className="h-5 w-5 text-sim-warning shrink-0" />
            <p className="text-sm text-foreground">
              {tx(
                `${pendingGrade} question(s) require instructor grading. Your score may change.`,
                `${pendingGrade} въпрос(а) изискват оценка от преподавател. Резултатът ви може да се промени.`
              )}
            </p>
          </div>
        )}

        {/* Startup connection CTA */}
        <div className="rounded-lg border border-primary/20 bg-accent p-5 flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg sim-gradient shrink-0">
            <Rocket className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-semibold text-foreground mb-1">
              {tx('Apply to Your Startup', 'Приложете към вашия стартъп')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {tx(
                'Use your case analysis to refine your startup project — update your problem, value proposition, or business model.',
                'Използвайте анализа от казуса, за да подобрите стартъп проекта си.'
              )}
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="shrink-0 self-center">
            <Link to="/startup">{tx('Go to Startup', 'Към стартъпа')}</Link>
          </Button>
        </div>

        {/* Detailed results */}
        <div className="space-y-6">
          <h2 className="text-xl font-display font-semibold text-foreground">
            {tx('Question Breakdown', 'Разбивка по въпроси')}
          </h2>
          {results.map((r, idx) => (
            <div key={r.question_id} className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-muted/30 border-b border-border">
                <div>
                  <p className="text-xs text-muted-foreground font-sans">{r.step_title}</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{r.prompt}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  {r.score !== null ? (
                    <>
                      {r.score === r.points ? <CheckCircle2 className="h-5 w-5 text-sim-success" />
                        : r.score > 0 ? <Award className="h-5 w-5 text-sim-warning" />
                        : <XCircle className="h-5 w-5 text-sim-danger" />}
                      <Badge variant="outline" className="font-sans">{r.score}/{r.points}</Badge>
                    </>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground font-sans">
                      {tx('Pending', 'Очаква оценка')} · {r.points} pts
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                <div className="p-6">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-sans">
                    {tx('Your Answer', 'Вашият отговор')}
                  </p>
                  <div className="text-sm text-foreground leading-relaxed">
                    {r.answer
                      ? typeof r.answer === 'string' ? r.answer
                      : typeof r.answer === 'object' && !Array.isArray(r.answer)
                        ? Object.entries(r.answer as Record<string, any>).map(([k, v]) => (
                          <div key={k} className="flex justify-between py-1 border-b border-border last:border-0">
                            <span>{k}</span><span className="font-medium font-sans">{String(v)}</span>
                          </div>
                        ))
                      : Array.isArray(r.answer)
                        ? (r.answer as string[]).map((item, i) => (
                          <div key={i} className="flex items-center gap-2 py-1">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary font-sans">{i + 1}</span>
                            <span>{item}</span>
                          </div>
                        ))
                      : JSON.stringify(r.answer)
                    : <span className="text-muted-foreground italic">{tx('No answer provided', 'Няма отговор')}</span>}
                  </div>
                  {r.feedback && (
                    <div className={`rounded-md p-3 mt-4 text-sm ${
                      r.score === r.points
                        ? 'bg-sim-success/5 border border-sim-success/20 text-sim-success'
                        : 'bg-sim-danger/5 border border-sim-danger/20 text-sim-danger'
                    }`}>{r.feedback}</div>
                  )}
                </div>
                <div className="p-6 bg-accent/30">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 font-sans flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" /> {tx('Model Answer', 'Моделен отговор')}
                  </p>
                  <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                    {r.model_answer || <span className="text-muted-foreground italic">{tx('Instructor graded — no model answer available', 'Оценено от преподавател — няма моделен отговор')}</span>}
                  </div>
                  {r.rubric && (
                    <div className="mt-4 rounded-md border border-border bg-card p-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 font-sans">{tx('Rubric', 'Критерии')}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{r.rubric}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
