import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Star, Send, CheckCircle2, Clock, Eye, EyeOff, AlertTriangle } from 'lucide-react';

const RUBRIC_CRITERIA = [
  { key: 'clarity_score', en: 'Clarity of Idea', bg: 'Яснота на идеята', desc_en: 'How clearly is the idea communicated?', desc_bg: 'Колко ясно е комуникирана идеята?' },
  { key: 'problem_importance_score', en: 'Problem Importance', bg: 'Важност на проблема', desc_en: 'How significant is the problem being solved?', desc_bg: 'Колко значим е проблемът?' },
  { key: 'innovation_score', en: 'Innovation Level', bg: 'Ниво на иновация', desc_en: 'How innovative and original is the solution?', desc_bg: 'Колко иновативно е решението?' },
  { key: 'feasibility_score', en: 'Feasibility', bg: 'Осъществимост', desc_en: 'Can this idea be realistically implemented?', desc_bg: 'Може ли идеята реалистично да бъде реализирана?' },
  { key: 'market_potential_score', en: 'Market Potential', bg: 'Пазарен потенциал', desc_en: 'Is there a viable market for this product?', desc_bg: 'Има ли жизнеспособен пазар за този продукт?' },
];

interface Assignment {
  id: string;
  reviewer_user_id: string;
  reviewee_user_id: string;
  target_type: string;
  target_id: string;
  submission_id: string | null;
  status: string;
  assigned_at: string;
}

interface ReceivedReview {
  clarity_score: number;
  problem_importance_score: number;
  innovation_score: number;
  feasibility_score: number;
  market_potential_score: number;
  comments: string | null;
  average_score: number;
  teacher_override_score: number | null;
  created_at: string;
}

export default function PeerReview() {
  const { user, loading: authLoading } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [receivedReviews, setReceivedReviews] = useState<ReceivedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReview, setActiveReview] = useState<Assignment | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [targetContent, setTargetContent] = useState<any>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/auth?redirect=/peer-review'); return; }
    loadData();
  }, [user, authLoading]);

  const loadData = async () => {
    if (!user) return;
    const [assignRes, reviewRes] = await Promise.all([
      supabase.from('peer_review_assignments').select('*').eq('reviewer_user_id', user.id).order('assigned_at', { ascending: false }),
      supabase.from('peer_reviews').select('clarity_score, problem_importance_score, innovation_score, feasibility_score, market_potential_score, comments, average_score, teacher_override_score, created_at').eq('reviewee_user_id', user.id).order('created_at', { ascending: false }),
    ]);
    setAssignments((assignRes.data || []) as Assignment[]);
    setReceivedReviews((reviewRes.data || []) as ReceivedReview[]);
    setLoading(false);
  };

  const startReview = async (assignment: Assignment) => {
    setActiveReview(assignment);
    setScores({});
    setComments('');
    // Load target content anonymously
    if (assignment.target_type === 'startup_project') {
      const { data } = await supabase.from('startup_projects').select('problem, customer, value_proposition, digital_product, business_model, growth_strategy, final_pitch, industry').eq('user_id', assignment.reviewee_user_id).maybeSingle();
      setTargetContent(data);
    } else if (assignment.submission_id) {
      const { data: sub } = await supabase.from('submissions').select('case_study_id, total_score, max_score').eq('id', assignment.submission_id).maybeSingle();
      if (sub) {
        const { data: cs } = await supabase.from('case_studies').select('title').eq('id', sub.case_study_id).maybeSingle();
        const { data: responses } = await supabase.from('responses').select('answer, question_id').eq('submission_id', assignment.submission_id);
        setTargetContent({ case_title: cs?.title, responses: responses || [], score: sub.total_score, max_score: sub.max_score });
      }
    }
  };

  const submitReview = async () => {
    if (!activeReview || !user) return;
    const allScored = RUBRIC_CRITERIA.every(c => scores[c.key] !== undefined && scores[c.key] >= 0);
    if (!allScored) { toast.error(t('Please rate all criteria', 'Моля, оценете всички критерии')); return; }
    setSubmitting(true);
    try {
      const { error: reviewError } = await supabase.from('peer_reviews').insert({
        reviewer_user_id: user.id,
        reviewee_user_id: activeReview.reviewee_user_id,
        submission_id: activeReview.submission_id || activeReview.target_id,
        clarity_score: scores.clarity_score || 0,
        problem_importance_score: scores.problem_importance_score || 0,
        innovation_score: scores.innovation_score || 0,
        feasibility_score: scores.feasibility_score || 0,
        market_potential_score: scores.market_potential_score || 0,
        comments: comments.trim() || '',
        target_type: activeReview.target_type,
        target_id: activeReview.target_id,
      });
      if (reviewError) throw reviewError;

      await supabase.from('peer_review_assignments').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', activeReview.id);

      toast.success(t('Review submitted!', 'Рецензията е изпратена!'));
      setActiveReview(null);
      setTargetContent(null);
      loadData();
    } catch (e: any) {
      toast.error(e?.message || 'Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const completedCount = assignments.filter(a => a.status === 'completed').length;

  const avgReceived = receivedReviews.length > 0
    ? (receivedReviews.reduce((a, r) => a + Number(r.average_score || 0), 0) / receivedReviews.length).toFixed(1)
    : '—';

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-muted-foreground">{t('Loading...', 'Зареждане...')}</div>
        </div>
      </div>
    );
  }

  // Active review form
  if (activeReview) {
    const STARTUP_SECTIONS = [
      { key: 'problem', en: 'Problem', bg: 'Проблем' },
      { key: 'customer', en: 'Customer', bg: 'Клиент' },
      { key: 'value_proposition', en: 'Value Proposition', bg: 'Стойностно предложение' },
      { key: 'digital_product', en: 'Digital Product', bg: 'Дигитален продукт' },
      { key: 'business_model', en: 'Business Model', bg: 'Бизнес модел' },
      { key: 'growth_strategy', en: 'Growth Strategy', bg: 'Стратегия за растеж' },
      { key: 'final_pitch', en: 'Final Pitch', bg: 'Финално представяне' },
    ];

    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
          <Button variant="ghost" size="sm" onClick={() => { setActiveReview(null); setTargetContent(null); }}>
            ← {t('Back', 'Назад')}
          </Button>

          <div className="flex items-center gap-2 mb-2">
            <EyeOff className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t('Anonymous review — the author will not see your name', 'Анонимна рецензия — авторът няма да види вашето име')}</span>
          </div>

          {/* Content to review */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {activeReview.target_type === 'startup_project'
                ? t('Startup Idea to Review', 'Стартъп идея за рецензия')
                : t('Case Solution to Review', 'Решение на казус за рецензия')}
            </h2>
            {activeReview.target_type === 'startup_project' && targetContent && (
              <div className="space-y-3">
                {targetContent.industry && <Badge variant="outline" className="text-xs mb-2">{targetContent.industry}</Badge>}
                {STARTUP_SECTIONS.map(s => {
                  const val = (targetContent as any)[s.key] || '';
                  return val.trim() ? (
                    <div key={s.key}>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">{lang === 'bg' ? s.bg : s.en}</p>
                      <p className="text-sm text-foreground mt-0.5 whitespace-pre-wrap">{val}</p>
                    </div>
                  ) : null;
                })}
              </div>
            )}
            {activeReview.target_type === 'case_submission' && targetContent && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">{targetContent.case_title || 'Case Study'}</p>
                <p className="text-xs text-muted-foreground">
                  {t('Score', 'Резултат')}: {targetContent.score ?? '?'}/{targetContent.max_score ?? '?'}
                </p>
                {targetContent.responses?.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {targetContent.responses.map((r: any, i: number) => (
                      <div key={i} className="rounded-lg bg-accent/30 p-3">
                        <p className="text-xs text-muted-foreground">Q{i + 1}</p>
                        <p className="text-sm text-foreground">{typeof r.answer === 'string' ? r.answer : JSON.stringify(r.answer)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {!targetContent && (
              <p className="text-sm text-muted-foreground italic">{t('Content not available', 'Съдържанието не е налично')}</p>
            )}
          </div>

          {/* Rubric scoring */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-5">
            <h2 className="text-lg font-semibold text-foreground">
              {t('Evaluation Rubric (0–4)', 'Рубрика за оценка (0–4)')}
            </h2>
            {RUBRIC_CRITERIA.map(c => (
              <div key={c.key}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-sm font-medium text-foreground">{lang === 'bg' ? c.bg : c.en}</p>
                    <p className="text-xs text-muted-foreground">{lang === 'bg' ? c.desc_bg : c.desc_en}</p>
                  </div>
                  <span className="text-sm font-bold text-primary min-w-[2rem] text-right">
                    {scores[c.key] !== undefined ? scores[c.key] : '—'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4].map(v => (
                    <button
                      key={v}
                      onClick={() => setScores(prev => ({ ...prev, [c.key]: v }))}
                      className={`flex-1 h-9 rounded-lg border text-sm font-medium transition-colors ${
                        scores[c.key] === v
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card text-foreground border-border hover:bg-accent'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <p className="text-sm font-medium text-foreground mb-1">{t('Comments (optional)', 'Коментари (по избор)')}</p>
              <Textarea value={comments} onChange={e => setComments(e.target.value)} placeholder={t('Provide constructive feedback...', 'Дайте конструктивна обратна връзка...')} rows={3} />
            </div>

            <Button onClick={submitReview} disabled={submitting} className="w-full">
              <Send className="h-4 w-4 mr-2" /> {submitting ? '...' : t('Submit Review', 'Изпрати рецензия')}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
        <h1 className="text-2xl font-display font-bold text-foreground">
          {t('Peer Review', 'Партньорска рецензия')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('Evaluate your peers\' work anonymously and develop critical thinking skills.', 'Оценете анонимно работата на колегите си и развийте умения за критично мислене.')}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">{t('Pending Reviews', 'Чакащи рецензии')}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{completedCount}</p>
            <p className="text-xs text-muted-foreground">{t('Completed', 'Завършени')}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-primary">{avgReceived}</p>
            <p className="text-xs text-muted-foreground">{t('Your Avg Score', 'Вашата средна оценка')}</p>
          </div>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" className="relative">
              {t('To Review', 'За рецензия')}
              {pendingCount > 0 && (
                <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold">{pendingCount}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">{t('Completed', 'Завършени')}</TabsTrigger>
            <TabsTrigger value="received">{t('My Reviews', 'Моите оценки')}</TabsTrigger>
          </TabsList>

          {/* Pending */}
          <TabsContent value="pending" className="space-y-3">
            {assignments.filter(a => a.status === 'pending').length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                {t('No pending reviews. Check back later!', 'Няма чакащи рецензии. Проверете по-късно!')}
              </div>
            ) : assignments.filter(a => a.status === 'pending').map(a => (
              <div key={a.id} className="rounded-xl border border-border bg-card p-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs capitalize">
                      {a.target_type === 'startup_project' ? t('Startup Idea', 'Стартъп идея') : t('Case Solution', 'Решение на казус')}
                    </Badge>
                    <Badge className="bg-[hsl(var(--sim-warning))]/10 text-[hsl(var(--sim-warning))] border-0 text-xs">
                      <Clock className="h-3 w-3 mr-1" /> {t('Pending', 'Чакаща')}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('Assigned', 'Възложена')}: {new Date(a.assigned_at).toLocaleDateString()}
                  </p>
                </div>
                <Button size="sm" onClick={() => startReview(a)}>
                  <Eye className="h-4 w-4 mr-1" /> {t('Start Review', 'Започни рецензия')}
                </Button>
              </div>
            ))}
          </TabsContent>

          {/* Completed */}
          <TabsContent value="completed" className="space-y-3">
            {assignments.filter(a => a.status === 'completed').length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">{t('No completed reviews yet.', 'Все още няма завършени рецензии.')}</div>
            ) : assignments.filter(a => a.status === 'completed').map(a => (
              <div key={a.id} className="rounded-xl border border-border bg-card p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--sim-success))]" />
                  <Badge variant="outline" className="text-xs capitalize">
                    {a.target_type === 'startup_project' ? t('Startup Idea', 'Стартъп идея') : t('Case Solution', 'Решение на казус')}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(a.assigned_at).toLocaleDateString()}</span>
              </div>
            ))}
          </TabsContent>

          {/* Received Reviews */}
          <TabsContent value="received" className="space-y-4">
            {receivedReviews.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">{t('No reviews received yet.', 'Все още няма получени рецензии.')}</div>
            ) : receivedReviews.map((r, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{t('Anonymous Reviewer', 'Анонимен рецензент')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.teacher_override_score !== null && (
                      <Badge className="bg-primary/10 text-primary border-0 text-xs">
                        {t('Teacher Score', 'Оценка от учител')}: {r.teacher_override_score}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs font-bold">
                      <Star className="h-3 w-3 mr-1" /> {Number(r.average_score).toFixed(1)}/4
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {RUBRIC_CRITERIA.map(c => (
                    <div key={c.key} className="text-center">
                      <p className="text-lg font-bold text-foreground">{(r as any)[c.key]}</p>
                      <p className="text-xs text-muted-foreground leading-tight">{lang === 'bg' ? c.bg : c.en}</p>
                    </div>
                  ))}
                </div>
                {r.comments && (
                  <p className="text-sm text-foreground/80 italic border-t border-border pt-2">"{r.comments}"</p>
                )}
                <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
