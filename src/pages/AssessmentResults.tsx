import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, CheckCircle2, XCircle, BookOpen, Target } from 'lucide-react';

interface CompetencyScore {
  name: string;
  earned: number;
  total: number;
  percent: number;
}

export default function AssessmentResults() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [competencyScores, setCompetencyScores] = useState<CompetencyScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !user) return;
    const fetch = async () => {
      const { data: a } = await supabase.from('assessments').select('title').eq('id', id).single();
      if (a) setTitle(a.title);

      const { data: sub } = await supabase.from('submissions').select('id, total_score, max_score').eq('assessment_id', id).eq('user_id', user.id).eq('is_draft', false).maybeSingle();
      if (!sub) { setLoading(false); return; }
      setTotalScore(sub.total_score || 0);
      setMaxScore(sub.max_score || 0);

      const { data: resps } = await supabase.from('responses').select('question_id, answer, score, feedback').eq('submission_id', sub.id);
      const { data: qs } = await supabase.from('assessment_questions').select('id, prompt, type, points, correct_answer, model_answer, competency_id').eq('assessment_id', id).order('question_order');
      const { data: comps } = await supabase.from('competencies').select('id, name');

      const compMap: Record<string, string> = {};
      comps?.forEach(c => { compMap[c.id] = c.name; });

      const compScores: Record<string, { name: string; earned: number; total: number }> = {};
      const qResults = (qs || []).map(q => {
        const r = resps?.find(r => r.question_id === q.id);
        const compName = q.competency_id ? compMap[q.competency_id] || 'General' : 'General';
        if (!compScores[compName]) compScores[compName] = { name: compName, earned: 0, total: 0 };
        compScores[compName].total += q.points;
        compScores[compName].earned += r?.score || 0;
        return { ...q, answer: r?.answer, score: r?.score, feedback: r?.feedback, compName };
      });
      setResults(qResults);
      setCompetencyScores(Object.values(compScores).map(c => ({ ...c, percent: Math.round((c.earned / c.total) * 100) })));
      setLoading(false);
    };
    fetch();
  }, [id, user]);

  if (loading) return <div className="min-h-screen bg-background"><AppHeader /><div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div></div>;

  const scorePercent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const weakest = [...competencyScores].sort((a, b) => a.percent - b.percent).slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <Button variant="ghost" size="sm" asChild><Link to="/dashboard"><ArrowLeft className="h-4 w-4 mr-1" /> Dashboard</Link></Button>

        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <Trophy className={`h-14 w-14 mx-auto mb-4 ${scorePercent >= 60 ? 'text-sim-success' : 'text-sim-warning'}`} />
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">{title}</h1>
          <p className="text-5xl font-display font-bold sim-gradient-text mb-2">{totalScore}/{maxScore}</p>
          <p className="text-lg text-muted-foreground">{scorePercent}%</p>
        </div>

        {/* Competency breakdown */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Competency Breakdown</h2>
          <div className="space-y-3">
            {competencyScores.map(c => (
              <div key={c.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground font-medium">{c.name}</span>
                  <span className={c.percent >= 60 ? 'text-sim-success' : 'text-sim-danger'}>{c.percent}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${c.percent >= 60 ? 'bg-sim-success' : 'bg-sim-danger'}`} style={{ width: `${c.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended practice */}
        {weakest.length > 0 && weakest[0].percent < 80 && (
          <div className="rounded-lg border border-sim-warning/30 bg-sim-warning/5 p-5">
            <h3 className="font-display font-semibold text-foreground mb-2">Recommended Practice</h3>
            <p className="text-sm text-muted-foreground">Focus on strengthening: {weakest.map(w => w.name).join(', ')}. Look for case studies tagged with these competencies.</p>
          </div>
        )}

        {/* Question details */}
        <div className="space-y-4">
          <h2 className="font-display font-semibold text-foreground">Question Details</h2>
          {results.map((r, i) => (
            <div key={r.id} className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-muted/30 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Q{i + 1}</span>
                  <Badge variant="outline" className="text-xs">{r.compName}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  {r.score !== null && r.score !== undefined ? (
                    r.score === r.points ? <CheckCircle2 className="h-4 w-4 text-sim-success" /> : <XCircle className="h-4 w-4 text-sim-danger" />
                  ) : null}
                  <Badge variant="outline">{r.score ?? '?'}/{r.points}</Badge>
                </div>
              </div>
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                <div className="p-5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Your Answer</p>
                  <p className="text-sm text-foreground">{r.answer ? (typeof r.answer === 'string' ? r.answer : JSON.stringify(r.answer)) : 'No answer'}</p>
                  {r.feedback && <p className="text-xs text-muted-foreground mt-2 italic">{r.feedback}</p>}
                </div>
                <div className="p-5 bg-accent/30">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 flex items-center gap-1"><BookOpen className="h-3 w-3" /> Model Answer</p>
                  <p className="text-sm text-foreground/80 whitespace-pre-line">{r.model_answer || (r.correct_answer ? `Correct: ${r.correct_answer}` : 'Instructor graded')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
