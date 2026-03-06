import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, ArrowLeft, Trophy, BookOpen, Award, Rocket, Star, Brain, TrendingUp, Lightbulb, Target, MessageSquare } from 'lucide-react';
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
  const [reflection, setReflection] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const [savingReflection, setSavingReflection] = useState(false);
  const [actualXpEarned, setActualXpEarned] = useState<number | null>(null);

  useEffect(() => {
    if (!id || !user) return;
    const fetchResults = async () => {
      const [caseRes, subRes, reflRes] = await Promise.all([
        supabase.from('case_studies').select('title, topic').eq('id', id).maybeSingle(),
        supabase.from('submissions').select('id, total_score, max_score').eq('case_study_id', id).eq('user_id', user.id).eq('is_draft', false).maybeSingle(),
        supabase.from('case_reflections').select('reflection_text').eq('case_id', id).eq('user_id', user.id).maybeSingle(),
      ]);
      if (caseRes.data) { setCaseTitle(caseRes.data.title); setCaseTopic(caseRes.data.topic || ''); }
      if (reflRes.data) { setReflection(reflRes.data.reflection_text); setReflectionSaved(true); }

      // Fetch actual XP earned for this case from xp_ledger
      const xpRes = await supabase.from('xp_ledger').select('xp').eq('user_id', user.id).eq('context_id', id).in('action', ['case_complete', 'case_high_quality']);
      if (xpRes.data && xpRes.data.length > 0) {
        setActualXpEarned(xpRes.data.reduce((sum, r) => sum + (r.xp || 0), 0));
      }

      if (!subRes.data) { setLoading(false); return; }
      setTotalScore(subRes.data.total_score || 0);
      setMaxScore(subRes.data.max_score || 0);

      const respRes = await supabase.from('responses').select('question_id, answer, score, feedback').eq('submission_id', subRes.data.id);
      const responses = respRes.data || [];
      const stepsRes = await supabase.from('case_steps').select('id, title').eq('case_study_id', id);
      const stepMap: Record<string, string> = {};
      stepsRes.data?.forEach(s => { stepMap[s.id] = s.title; });
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

  const saveReflection = async () => {
    if (!user || !id || !reflection.trim()) return;
    setSavingReflection(true);
    const { error } = await supabase.from('case_reflections').upsert({
      user_id: user.id,
      case_id: id,
      reflection_text: reflection.trim(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,case_id' });
    setSavingReflection(false);
    if (error) {
      toast.error(tx('Failed to save reflection', 'Грешка при запазване'));
    } else {
      setReflectionSaved(true);
      toast.success(tx('Reflection saved!', 'Рефлексията е запазена!'));
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background"><AppHeader />
      <div className="flex items-center justify-center py-20 text-muted-foreground">{tx('Loading results...', 'Зареждане...')}</div>
    </div>
  );

  const scorePercent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const gradeLabel = scorePercent >= 80 ? tx('Excellent', 'Отлично') : scorePercent >= 60 ? tx('Good', 'Добро') : scorePercent >= 40 ? tx('Developing', 'В развитие') : tx('Needs Work', 'Нуждае се от работа');
  const gradeColor = scorePercent >= 80 ? 'text-emerald-600' : scorePercent >= 60 ? 'text-primary' : scorePercent >= 40 ? 'text-amber-600' : 'text-red-600';
  const xpEarned = scorePercent >= 80 ? 100 : scorePercent >= 60 ? 70 : scorePercent >= 40 ? 40 : 10;
  const autoGraded = results.filter(r => r.score !== null).length;
  const pendingGrade = results.length - autoGraded;

  // Derive category scores from question results
  const categoryScores = (() => {
    const gradedResults = results.filter(r => r.score !== null && r.points > 0);
    if (gradedResults.length === 0) return null;
    // Distribute questions across categories based on step
    const categories = [
      { key: 'strategic', label: tx('Strategic Thinking', 'Стратегическо мислене'), icon: Brain, results: [] as typeof gradedResults },
      { key: 'innovation', label: tx('Innovation', 'Иновация'), icon: Lightbulb, results: [] as typeof gradedResults },
      { key: 'market', label: tx('Market Understanding', 'Разбиране на пазара'), icon: TrendingUp, results: [] as typeof gradedResults },
      { key: 'feasibility', label: tx('Feasibility', 'Осъществимост'), icon: Target, results: [] as typeof gradedResults },
    ];
    gradedResults.forEach((r, i) => {
      categories[i % categories.length].results.push(r);
    });
    return categories.map(c => ({
      ...c,
      score: c.results.length > 0
        ? Math.round(c.results.reduce((sum, r) => sum + ((r.score || 0) / r.points) * 100, 0) / c.results.length)
        : scorePercent,
    }));
  })();

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
            <div className="flex items-center justify-center gap-2 mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary-foreground/80" />
              <span className="text-lg font-semibold text-primary-foreground/80">{tx('Case Completed', 'Казусът е завършен')}</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-primary-foreground mb-1">{caseTitle}</h1>
            {caseTopic && <p className="text-sm text-primary-foreground/70 mb-4">{caseTopic}</p>}
            <p className="text-5xl font-display font-bold text-primary-foreground">{scorePercent}%</p>
            <p className="text-lg text-primary-foreground/80 mt-1">{totalScore}/{maxScore} · {gradeLabel}</p>
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

        {/* Category scores */}
        {categoryScores && (
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-display font-semibold text-foreground mb-4">
              {tx('Learning Outcome Scores', 'Резултати по учебни области')}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {categoryScores.map(cat => (
                <div key={cat.key} className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <cat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{cat.label}</span>
                      <span className={`text-sm font-bold font-sans ${cat.score >= 70 ? 'text-emerald-600' : cat.score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                        {cat.score}%
                      </span>
                    </div>
                    <Progress value={cat.score} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teacher review notice */}
        {pendingGrade > 0 && (
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
            <Award className="h-5 w-5 text-muted-foreground shrink-0" />
            <p className="text-sm text-muted-foreground">
              {tx(
                `${pendingGrade} question(s) may be reviewed by an instructor later. Your score and XP have already been awarded.`,
                `${pendingGrade} въпрос(а) могат да бъдат прегледани от преподавател по-късно. Вашият резултат и XP вече са присъдени.`
              )}
            </p>
          </div>
        )}

        {/* Learning reflection */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-display font-semibold text-foreground">
              {tx('What did you learn from this case?', 'Какво научихте от този казус?')}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {tx(
              'Reflect on the key insights and how they apply to your thinking. This helps develop deeper learning.',
              'Помислете за ключовите прозрения и как те се прилагат в мисленето ви. Това помага за по-дълбоко учене.'
            )}
          </p>
          <Textarea
            value={reflection}
            onChange={e => { setReflection(e.target.value); setReflectionSaved(false); }}
            placeholder={tx('Write your reflection here...', 'Напишете рефлексията си тук...')}
            className="min-h-[100px] mb-3"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {reflectionSaved ? tx('✓ Saved', '✓ Запазено') : tx('Not saved yet', 'Все още не е запазено')}
            </span>
            <Button size="sm" onClick={saveReflection} disabled={savingReflection || !reflection.trim()}>
              {savingReflection ? tx('Saving...', 'Запазване...') : tx('Save Reflection', 'Запази рефлексия')}
            </Button>
          </div>
        </div>

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
            <Link to="/my-startup">{tx('Go to Startup', 'Към стартъпа')}</Link>
          </Button>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" asChild>
            <Link to={`/case/${id}/preview`}>{tx('Review Case', 'Преглед на казуса')}</Link>
          </Button>
          <Button className="flex-1" asChild>
            <Link to="/cases">{tx('Explore Next Case', 'Към следващ казус')}</Link>
          </Button>
        </div>

        {/* Detailed results */}
        <div className="space-y-6">
          <h2 className="text-xl font-display font-semibold text-foreground">
            {tx('Question Breakdown', 'Разбивка по въпроси')}
          </h2>
          {results.map((r) => (
            <div key={r.question_id} className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-muted/30 border-b border-border">
                <div>
                  <p className="text-xs text-muted-foreground font-sans">{r.step_title}</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{r.prompt}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  {r.score !== null ? (
                    <>
                      {r.score === r.points ? <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        : r.score > 0 ? <Award className="h-5 w-5 text-amber-600" />
                        : <XCircle className="h-5 w-5 text-red-600" />}
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
                      r.score !== null && r.score === r.points
                        ? 'bg-emerald-500/5 border border-emerald-500/20 text-emerald-700'
                        : r.score !== null && r.score > 0
                        ? 'bg-primary/5 border border-primary/20 text-foreground'
                        : 'bg-red-500/5 border border-red-500/20 text-red-700'
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
