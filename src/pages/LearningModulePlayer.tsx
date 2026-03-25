import { useEffect, useState, useCallback } from 'react';
import { LearningPhaseBar, WhatYouWillLearn, THEORY_MODULE_OUTCOMES } from '@/components/learning/LearningStructure';
import StructuredFeedback from '@/components/feedback/StructuredFeedback';
import SkillsImproved from '@/components/learning/SkillsImproved';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { LEARNING_MODULES, type LearningModule, type QuizQuestion } from '@/data/learning-modules';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { awardXp } from '@/lib/xp';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft, BookOpen, CheckCircle2, XCircle, Brain, Target,
  Lightbulb, Rocket, Send, ChevronRight, FileText, Zap,
} from 'lucide-react';

type Phase = 'theory' | 'quiz' | 'analytical' | 'application' | 'results';

export default function LearningModulePlayer() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const mod = LEARNING_MODULES.find(m => m.slug === slug);

  const [phase, setPhase] = useState<Phase>('theory');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [analyticalAnswer, setAnalyticalAnswer] = useState('');
  const [applicationAnswer, setApplicationAnswer] = useState('');
  const [saving, setSaving] = useState(false);
  const [existingResponse, setExistingResponse] = useState<any>(null);
  const [dbModuleId, setDbModuleId] = useState<string | null>(null);
  const [scores, setScores] = useState({ concept: 0, analytical: 0, strategic: 0, application: 0 });

  // Ensure module exists in DB
  useEffect(() => {
    if (!mod) return;
    supabase.from('learning_modules').select('id').eq('slug', mod.slug).maybeSingle()
      .then(async ({ data }) => {
        if (data) {
          setDbModuleId(data.id);
        } else {
          // Insert module into DB
          const { data: inserted } = await supabase.from('learning_modules').insert({
            slug: mod.slug,
            title_en: mod.title_en,
            title_bg: mod.title_bg,
            theory_en: mod.theory_en,
            theory_bg: mod.theory_bg,
            quiz_questions: mod.quiz_questions as any,
            analytical_question_en: mod.analytical_question_en,
            analytical_question_bg: mod.analytical_question_bg,
            application_question_en: mod.application_question_en,
            application_question_bg: mod.application_question_bg,
            display_order: mod.display_order,
          } as any).select('id').single();
          if (inserted) setDbModuleId(inserted.id);
        }
      });
  }, [mod]);

  // Load existing response
  useEffect(() => {
    if (!user || !dbModuleId) return;
    supabase.from('learning_module_responses').select('*')
      .eq('user_id', user.id).eq('module_id', dbModuleId).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setExistingResponse(data);
          if (data.completed_at) {
            setQuizAnswers((data.quiz_answers as any) || {});
            setAnalyticalAnswer(data.analytical_answer || '');
            setApplicationAnswer(data.application_answer || '');
            setQuizSubmitted(true);
            setScores({
              concept: data.concept_score || 0,
              analytical: data.analytical_score || 0,
              strategic: data.strategic_score || 0,
              application: data.application_score || 0,
            });
            setPhase('results');
          }
        }
      });
  }, [user, dbModuleId]);

  if (!mod) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20 text-muted-foreground">{t('Module not found', 'Модулът не е намерен')}</div>
      </div>
    );
  }

  const quizScore = mod.quiz_questions.reduce((acc, q) => {
    const selected = quizAnswers[q.id];
    const correct = q.options.find(o => o.correct)?.id;
    return acc + (selected === correct ? 1 : 0);
  }, 0);

  const quizMax = mod.quiz_questions.length;

  const handleQuizSubmit = () => {
    if (Object.keys(quizAnswers).length < quizMax) {
      toast.error(t('Please answer all questions', 'Моля, отговорете на всички въпроси'));
      return;
    }
    setQuizSubmitted(true);
  };

  const calculateScores = () => {
    const conceptPct = Math.round((quizScore / Math.max(quizMax, 1)) * 100);
    const analyticalPct = analyticalAnswer.trim().length >= 50 ? Math.min(100, Math.round((analyticalAnswer.trim().length / 200) * 100)) : analyticalAnswer.trim().length > 0 ? 30 : 0;
    const strategicPct = Math.round((conceptPct + analyticalPct) / 2);
    const applicationPct = applicationAnswer.trim().length >= 50 ? Math.min(100, Math.round((applicationAnswer.trim().length / 200) * 100)) : applicationAnswer.trim().length > 0 ? 30 : 0;
    return { concept: conceptPct, analytical: analyticalPct, strategic: strategicPct, application: applicationPct };
  };

  const handleSubmitAll = async () => {
    if (!user || !dbModuleId) return;
    if (analyticalAnswer.trim().length < 20) {
      toast.error(t('Please write a more detailed analytical answer (min 20 characters)', 'Моля, напишете по-подробен аналитичен отговор (мин. 20 знака)'));
      return;
    }
    if (applicationAnswer.trim().length < 20) {
      toast.error(t('Please write a more detailed application answer (min 20 characters)', 'Моля, напишете по-подробен отговор за приложение (мин. 20 знака)'));
      return;
    }

    setSaving(true);
    const finalScores = calculateScores();
    setScores(finalScores);

    const payload = {
      user_id: user.id,
      module_id: dbModuleId,
      quiz_answers: quizAnswers,
      quiz_score: quizScore,
      quiz_max: quizMax,
      analytical_answer: analyticalAnswer,
      application_answer: applicationAnswer,
      concept_score: finalScores.concept,
      analytical_score: finalScores.analytical,
      strategic_score: finalScores.strategic,
      application_score: finalScores.application,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (existingResponse) {
      await supabase.from('learning_module_responses').update(payload as any).eq('id', existingResponse.id);
    } else {
      await supabase.from('learning_module_responses').insert(payload as any);
    }

    // Award XP for theory completion
    const xpResult = await awardXp('theory_complete', mod.slug);
    let totalXp = xpResult.xp_awarded;

    // Award bonus XP if quiz score >= 60%
    const quizPct = (quizScore / Math.max(quizMax, 1)) * 100;
    if (quizPct >= 60) {
      const quizXpResult = await awardXp('theory_quiz_pass', mod.slug);
      totalXp += quizXpResult.xp_awarded;
    }

    setSaving(false);
    setPhase('results');
    if (totalXp > 0) {
      toast.success(`+${totalXp} XP ${t('earned!', 'спечелени!')}`);
    } else {
      toast.success(t('Module completed!', 'Модулът е завършен!'));
    }
  };

  const phases: { key: Phase; label: string }[] = [
    { key: 'theory', label: t('Theory', 'Теория') },
    { key: 'quiz', label: t('Quiz', 'Тест') },
    { key: 'analytical', label: t('Analysis', 'Анализ') },
    { key: 'application', label: t('Application', 'Приложение') },
    { key: 'results', label: t('Results', 'Резултати') },
  ];
  const phaseIdx = phases.findIndex(p => p.key === phase);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/learn')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> {t('All Modules', 'Всички модули')}
          </Button>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {lang === 'bg' ? mod.title_bg : mod.title_en}
          </h1>
        </div>

        {/* Learning Structure Bar */}
        <LearningPhaseBar
          currentPhase={phase === 'theory' ? 'learn' : phase === 'quiz' ? 'practice' : phase === 'analytical' ? 'feedback' : phase === 'application' ? 'reflect' : 'next'}
          lang={lang as 'en' | 'bg'}
          completedPhases={phase === 'results' ? ['learn', 'practice', 'feedback', 'reflect', 'next'] : []}
        />
        <WhatYouWillLearn outcomes={THEORY_MODULE_OUTCOMES} lang={lang as 'en' | 'bg'} activityType={{ en: 'Theory Module', bg: 'Теоретичен модул' }} />

        {/* Phase Progress */}
        <div className="flex items-center gap-1">
          {phases.map((p, i) => (
            <div key={p.key} className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (phase === 'results' || (p.key === 'theory') || (p.key === 'quiz' && phaseIdx >= 1) || (p.key === 'analytical' && quizSubmitted) || (p.key === 'application' && quizSubmitted) || (p.key === 'results' && existingResponse?.completed_at))
                    setPhase(p.key);
                }}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${i === phaseIdx ? 'bg-primary text-primary-foreground font-semibold' : i < phaseIdx ? 'bg-primary/20 text-primary' : 'bg-accent text-muted-foreground'}`}
              >
                {p.label}
              </button>
              {i < phases.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
            </div>
          ))}
        </div>

        {/* THEORY PHASE */}
        {phase === 'theory' && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <Badge variant="outline" className="mb-2">{t('📖 Theory', '📖 Теория')}</Badge>
            <div className="prose prose-sm max-w-none text-foreground dark:prose-invert">
              <ReactMarkdown>{lang === 'bg' ? mod.theory_bg : mod.theory_en}</ReactMarkdown>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={() => setPhase('quiz')}>
                {t('Continue to Quiz', 'Продължи към тест')} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* QUIZ PHASE */}
        {phase === 'quiz' && (
          <div className="space-y-4">
            <Badge variant="outline">{t('🧠 Knowledge Check', '🧠 Проверка на знания')}</Badge>
            {mod.quiz_questions.map((q, qi) => {
              const correctId = q.options.find(o => o.correct)?.id;
              return (
                <div key={q.id} className="rounded-xl border border-border bg-card p-5 space-y-3">
                  <p className="text-sm font-semibold text-foreground">
                    {qi + 1}. {lang === 'bg' ? q.question_bg : q.question_en}
                  </p>
                  <div className="space-y-2">
                    {q.options.map(opt => {
                      const selected = quizAnswers[q.id] === opt.id;
                      const isCorrect = opt.correct;
                      let cls = 'border-border hover:border-primary/40';
                      if (quizSubmitted) {
                        if (isCorrect) cls = 'border-primary bg-primary/10';
                        else if (selected && !isCorrect) cls = 'border-destructive bg-destructive/10';
                      } else if (selected) {
                        cls = 'border-primary bg-primary/5';
                      }
                      return (
                        <button
                          key={opt.id}
                          disabled={quizSubmitted}
                          onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                          className={`w-full text-left rounded-lg border p-3 text-sm transition-colors ${cls}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-foreground">{lang === 'bg' ? opt.bg : opt.en}</span>
                            {quizSubmitted && isCorrect && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                            {quizSubmitted && selected && !isCorrect && <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {!quizSubmitted ? (
              <div className="flex justify-end">
                <Button onClick={handleQuizSubmit}>
                  {t('Check Answers', 'Провери отговорите')}
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{t('Quiz Score', 'Резултат от теста')}: {quizScore}/{quizMax}</p>
                  <p className="text-xs text-muted-foreground">{Math.round((quizScore / quizMax) * 100)}%</p>
                </div>
                <Button onClick={() => setPhase('analytical')}>
                  {t('Continue to Analysis', 'Продължи към анализа')} <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ANALYTICAL PHASE */}
        {phase === 'analytical' && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <Badge variant="outline">{t('🔍 Analytical Question', '🔍 Аналитичен въпрос')}</Badge>
            <p className="text-sm font-semibold text-foreground">
              {lang === 'bg' ? mod.analytical_question_bg : mod.analytical_question_en}
            </p>
            <Textarea
              value={analyticalAnswer}
              onChange={e => setAnalyticalAnswer(e.target.value)}
              placeholder={t('Write your analysis here...', 'Напишете вашия анализ тук...')}
              className="min-h-[120px]"
              disabled={!!existingResponse?.completed_at}
            />
            <p className="text-xs text-muted-foreground">{analyticalAnswer.length} {t('characters', 'знака')} ({t('min 20', 'мин. 20')})</p>
            <div className="flex justify-end">
              <Button onClick={() => setPhase('application')}>
                {t('Continue to Application', 'Продължи към приложението')} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* APPLICATION PHASE */}
        {phase === 'application' && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <Badge variant="outline">{t('🚀 Apply to Your Startup', '🚀 Приложи към твоя стартъп')}</Badge>
            <p className="text-sm font-semibold text-foreground">
              {lang === 'bg' ? mod.application_question_bg : mod.application_question_en}
            </p>
            <Textarea
              value={applicationAnswer}
              onChange={e => setApplicationAnswer(e.target.value)}
              placeholder={t('Apply this concept to your startup idea...', 'Приложете тази концепция към вашата стартъп идея...')}
              className="min-h-[120px]"
              disabled={!!existingResponse?.completed_at}
            />
            <p className="text-xs text-muted-foreground">{applicationAnswer.length} {t('characters', 'знака')} ({t('min 20', 'мин. 20')})</p>
            {!existingResponse?.completed_at && (
              <div className="flex justify-end">
                <Button onClick={handleSubmitAll} disabled={saving}>
                  <Send className="h-4 w-4 mr-1" />
                  {saving ? t('Saving...', 'Запазване...') : t('Submit Module', 'Изпрати модул')}
                </Button>
              </div>
            )}
            {existingResponse?.completed_at && (
              <div className="flex justify-end">
                <Button onClick={() => setPhase('results')}>
                  {t('View Results', 'Виж резултати')} <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* RESULTS PHASE */}
        {phase === 'results' && (
          <div className="space-y-4">
            <Badge variant="outline">{t('📊 Learning Outcomes', '📊 Учебни резултати')}</Badge>

            {/* Quiz result */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">{t('Quiz Score', 'Резултат от теста')}</h3>
              <div className="flex items-center gap-3">
                <Progress value={(quizScore / Math.max(quizMax, 1)) * 100} className="h-2 flex-1" />
                <span className="text-sm font-bold text-foreground">{quizScore}/{quizMax}</span>
              </div>
            </div>

            {/* Outcome Scores */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">{t('Learning Outcome Scores', 'Оценки на учебните резултати')}</h3>
              <div className="space-y-3">
                {[
                  { key: 'concept', icon: Brain, en: 'Concept Understanding', bg: 'Разбиране на концепции', score: scores.concept },
                  { key: 'analytical', icon: Target, en: 'Analytical Thinking', bg: 'Аналитично мислене', score: scores.analytical },
                  { key: 'strategic', icon: Lightbulb, en: 'Strategic Reasoning', bg: 'Стратегическо мислене', score: scores.strategic },
                  { key: 'application', icon: Rocket, en: 'Startup Application', bg: 'Приложение в стартъп', score: scores.application },
                ].map(cat => (
                  <div key={cat.key}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <cat.icon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium text-foreground">{t(cat.en, cat.bg)}</span>
                      </div>
                      <span className={`text-xs font-bold ${cat.score >= 70 ? 'text-primary' : cat.score >= 40 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                        {cat.score}%
                      </span>
                    </div>
                    <Progress value={cat.score} className="h-1.5" />
                  </div>
                ))}
              </div>
            </div>

            {/* Written Answers Summary */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{t('Your Answers', 'Вашите отговори')}</h3>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">{t('Analytical Answer', 'Аналитичен отговор')}</p>
                <p className="text-xs text-foreground bg-accent/50 rounded-lg p-3">{analyticalAnswer || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">{t('Application Answer', 'Отговор за приложение')}</p>
                <p className="text-xs text-foreground bg-accent/50 rounded-lg p-3">{applicationAnswer || '—'}</p>
              </div>
            </div>

            {/* Skills improved */}
            <SkillsImproved
              activityType="theory_module"
              scorePercent={Math.round((quizScore / Math.max(quizMax, 1)) * 100)}
              lang={lang as 'en' | 'bg'}
            />

            {/* AI Structured Feedback */}
            {mod && (
              <StructuredFeedback
                context={{
                  type: 'quiz_result',
                  moduleTitle: lang === 'bg' ? mod.title_bg : mod.title_en,
                  quizScore,
                  quizMax,
                  analyticalAnswer,
                  applicationAnswer,
                }}
                lang={lang as 'en' | 'bg'}
              />
            )}

            {mod.case_transition_en && (
              <TheoryToCaseCTA mod={mod} lang={lang} t={t} navigate={navigate} />
            )}

            {/* Theory → Simulator CTA */}
            {mod.sim_transition_en && (
              <Card className="p-5 border-primary/20 bg-primary/5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {t('Test in Simulator', 'Тествай в симулатора')}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {lang === 'bg' ? mod.sim_transition_bg : mod.sim_transition_en}
                    </p>
                    <Button size="sm" variant="outline" onClick={() => navigate('/simulator')}>
                      <Rocket className="h-3.5 w-3.5 mr-1" />
                      {t('Open Simulator', 'Отвори симулатора')}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/learn')}>
                <ArrowLeft className="h-4 w-4 mr-1" /> {t('All Modules', 'Всички модули')}
              </Button>
              {LEARNING_MODULES.findIndex(m => m.slug === slug) < LEARNING_MODULES.length - 1 && (
                <Button onClick={() => {
                  const nextIdx = LEARNING_MODULES.findIndex(m => m.slug === slug) + 1;
                  navigate(`/learn/${LEARNING_MODULES[nextIdx].slug}`);
                }}>
                  {t('Next Module', 'Следващ модул')} <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Sub-component: Theory → Case CTA (fetches matching case from DB)
function TheoryToCaseCTA({ mod, lang, t, navigate }: { mod: LearningModule; lang: string; t: (en: string, bg: string) => string; navigate: (path: string) => void }) {
  const [caseId, setCaseId] = useState<string | null>(null);
  const [caseTitle, setCaseTitle] = useState('');

  useEffect(() => {
    if (!mod.related_case_topic) return;
    supabase.from('case_studies')
      .select('id, title, title_bg')
      .eq('published', true)
      .ilike('topic', `%${mod.related_case_topic}%`)
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setCaseId(data.id);
          setCaseTitle(lang === 'bg' ? (data.title_bg || data.title) : data.title);
        }
      });
  }, [mod.related_case_topic, lang]);

  if (!caseId) return null;

  return (
    <Card className="p-5 border-primary/20 bg-accent">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            {t('Apply in a Case Study', 'Приложи в казус')}
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            {lang === 'bg' ? mod.case_transition_bg : mod.case_transition_en}
          </p>
          <Button size="sm" onClick={() => navigate(`/case/${caseId}/preview`)}>
            <FileText className="h-3.5 w-3.5 mr-1" />
            {t('Start Case Study', 'Започни казус')}
          </Button>
        </div>
      </div>
    </Card>
  );
}
