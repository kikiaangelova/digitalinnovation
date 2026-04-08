import { useEffect, useState, useCallback, useRef } from 'react';
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
import { AutoTermTooltips } from '@/components/ui/term-tooltip';
import {
  ArrowLeft, BookOpen, CheckCircle2, XCircle, Brain, Target,
  Lightbulb, Rocket, Send, ChevronRight, FileText, Zap, BarChart3,
  Save, Clock, Loader2,
} from 'lucide-react';

type Phase = 'theory' | 'quiz' | 'case_study' | 'sim_decision' | 'analytical' | 'application' | 'results';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

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
  const [caseAnswers, setCaseAnswers] = useState<Record<string, string>>({});
  const [applicationAnswer, setApplicationAnswer] = useState('');
  const [saving, setSaving] = useState(false);
  const [existingResponse, setExistingResponse] = useState<any>(null);
  const [dbModuleId, setDbModuleId] = useState<string | null>(null);
  const [scores, setScores] = useState({ concept: 0, analytical: 0, strategic: 0, application: 0 });

  // Auto-save state
  const [autoSaveStatus, setAutoSaveStatus] = useState<SaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [startupSynced, setStartupSynced] = useState(false);

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

  // Auto-save answers with debounce
  const performAutoSave = useCallback(async () => {
    if (!user || !dbModuleId || existingResponse?.completed_at) return;
    setAutoSaveStatus('saving');
    try {
      const payload = {
        user_id: user.id,
        module_id: dbModuleId,
        quiz_answers: quizAnswers,
        quiz_score: 0,
        quiz_max: mod?.quiz_questions.length || 0,
        analytical_answer: analyticalAnswer,
        application_answer: applicationAnswer,
        updated_at: new Date().toISOString(),
      };

      if (existingResponse) {
        await supabase.from('learning_module_responses').update(payload as any).eq('id', existingResponse.id);
      } else {
        const { data } = await supabase.from('learning_module_responses').insert(payload as any).select('id').single();
        if (data) setExistingResponse({ ...payload, id: data.id });
      }

      setAutoSaveStatus('saved');
      setLastSavedAt(new Date());
    } catch {
      setAutoSaveStatus('error');
    }
  }, [user, dbModuleId, existingResponse, quizAnswers, analyticalAnswer, applicationAnswer, mod]);

  // Trigger auto-save on answer changes (debounced 2s)
  useEffect(() => {
    if (!user || !dbModuleId || existingResponse?.completed_at) return;
    if (analyticalAnswer.length === 0 && applicationAnswer.length === 0) return;

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      performAutoSave();
    }, 2000);

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [analyticalAnswer, applicationAnswer, performAutoSave]);

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
      toast.error(t('Please write a more detailed analytical answer (min 20 characters)', 'Моля, напиши по-подробен аналитичен отговор (мин. 20 знака)'));
      return;
    }
    // Application answer is optional — no minimum enforced

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

    // NOTE: No auto-sync to startup — user chooses explicitly via "Use in My Startup" button

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
    setLastSavedAt(new Date());
    const { fireCelebration } = await import('@/components/ui/celebration-overlay');
    fireCelebration({
      xp: totalXp,
      title: t('Module Complete!', 'Браво! Завърши модула!'),
      subtitle: totalXp > 0 ? `+${totalXp} XP ${t('earned!', 'спечелени!')}` : t('Well done!', 'Страхотно!'),
    });
  };

  // Transfer application answer to My Startup
  const handleUseInStartup = async () => {
    if (!user || !mod.startup_field || applicationAnswer.trim().length < 10) return;
    try {
      const { data: project } = await supabase.from('startup_projects')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (project) {
        await supabase.from('startup_projects')
          .update({ [mod.startup_field]: applicationAnswer.trim() } as any)
          .eq('id', project.id);
      } else {
        await supabase.from('startup_projects')
          .insert({ user_id: user.id, [mod.startup_field]: applicationAnswer.trim() } as any);
      }
      setStartupSynced(true);
      toast.success(t('Added to My Startup! ✅', 'Добавено в Моят стартъп! ✅'));
    } catch {
      toast.error(t('Failed to save to startup', 'Неуспешно запазване в стартъп'));
    }
  };

  // Save status indicator component
  const SaveStatusIndicator = () => {
    if (existingResponse?.completed_at) return null;
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {autoSaveStatus === 'saving' && (
          <><Loader2 className="h-3 w-3 animate-spin" /> {t('Saving...', 'Запазване...')}</>
        )}
        {autoSaveStatus === 'saved' && lastSavedAt && (
          <><Save className="h-3 w-3 text-progress" /> {t('Saved', 'Запазено')} · {lastSavedAt.toLocaleTimeString()}</>
        )}
        {autoSaveStatus === 'error' && (
          <><XCircle className="h-3 w-3 text-destructive" /> {t('Save failed', 'Грешка при запазване')}</>
        )}
      </div>
    );
  };

  const hasCase = !!mod.embedded_case;
  const phases: { key: Phase; label: string }[] = [
    { key: 'theory', label: t('Theory', 'Теория') },
    { key: 'quiz', label: t('Quiz', 'Тест') },
    ...(hasCase ? [{ key: 'case_study' as Phase, label: t('Case', 'Казус') }] : []),
    { key: 'analytical', label: t('Analysis', 'Анализ') },
    { key: 'application', label: t('Application', 'Приложение') },
    { key: 'results', label: t('Results', 'Резултати') },
  ];
  const phaseIdx = phases.findIndex(p => p.key === phase);
  const nextAfterQuiz: Phase = hasCase ? 'case_study' : 'analytical';

  const canNavigateTo = (key: Phase): boolean => {
    if (phase === 'results') return true;
    if (key === 'theory') return true;
    if (key === 'quiz' && phaseIdx >= 1) return true;
    if (key === 'case_study' && quizSubmitted) return true;
    if (key === 'analytical' && quizSubmitted) return true;
    if (key === 'application' && quizSubmitted) return true;
    if (key === 'results' && existingResponse?.completed_at) return true;
    return false;
  };

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
          currentPhase={phase === 'theory' ? 'learn' : phase === 'quiz' ? 'practice' : phase === 'case_study' ? 'practice' : phase === 'analytical' ? 'feedback' : phase === 'application' ? 'reflect' : 'next'}
          lang={lang as 'en' | 'bg'}
          completedPhases={phase === 'results' ? ['learn', 'practice', 'feedback', 'reflect', 'next'] : []}
        />
        <WhatYouWillLearn outcomes={THEORY_MODULE_OUTCOMES} lang={lang as 'en' | 'bg'} activityType={{ en: 'Theory Module', bg: 'Теоретичен модул' }} />

        {/* Phase Progress */}
        <div className="flex items-center gap-1 flex-wrap">
          {phases.map((p, i) => (
            <div key={p.key} className="flex items-center gap-1">
              <button
                onClick={() => { if (canNavigateTo(p.key)) setPhase(p.key); }}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${i === phaseIdx ? 'bg-primary text-primary-foreground font-semibold' : i < phaseIdx ? 'bg-primary/20 text-primary' : 'bg-accent text-muted-foreground'}`}
              >
                {p.label}
              </button>
              {i < phases.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
            </div>
          ))}
        </div>

        {/* THEORY PHASE — 4-block structure */}
        {phase === 'theory' && (
          <div className="space-y-4">
            {/* Block 1: Hook */}
            {mod.hook && (
              <div className="rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-5">
                <p className="text-sm font-bold text-foreground mb-1">🔥 {t('Why this matters', 'Защо важи това?')}</p>
                <p className="text-sm text-foreground/90 leading-relaxed">{lang === 'bg' ? mod.hook.bg : mod.hook.en}</p>
              </div>
            )}

            {/* Block 2: Concept (trimmed theory + metaphor) */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <Badge variant="outline" className="mb-2">📐 {t('The Concept', 'Концепцията')}</Badge>
              <div className="prose prose-sm max-w-none text-foreground dark:prose-invert">
                <ReactMarkdown>{lang === 'bg' ? mod.theory_bg : mod.theory_en}</ReactMarkdown>
              </div>
              {mod.metaphor && (
                <div className="rounded-lg bg-accent/60 p-4 text-sm text-foreground/80 italic">
                  {lang === 'bg' ? mod.metaphor.bg : mod.metaphor.en}
                </div>
              )}
            </div>

            {/* Block 3: Framework */}
            {mod.framework && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-3">
                <p className="text-sm font-bold text-foreground">🗺️ {t('Framework', 'Рамката')}: <span className="text-primary">{mod.framework.name}</span></p>
                <ul className="space-y-1.5">
                  {(lang === 'bg' ? mod.framework.bullets_bg : mod.framework.bullets_en).map((b, i) => (
                    <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>{b}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-primary font-medium pt-1">
                  🚀 {lang === 'bg' ? mod.framework.apply_bg : mod.framework.apply_en}
                </p>
              </div>
            )}

            {/* Block 4: Provocations */}
            {mod.provocations && mod.provocations.length > 0 && (
              <div className="rounded-xl bg-accent/40 p-5 space-y-2">
                <p className="text-sm font-bold text-foreground flex items-center gap-1.5">💭 {t('Think before you continue', 'Помисли преди да продължиш')}</p>
                {mod.provocations.map((p, i) => (
                  <p key={i} className="text-sm text-foreground/80 italic">"{lang === 'bg' ? p.bg : p.en}"</p>
                ))}
                <p className="text-xs text-muted-foreground pt-1">{t('These questions have no correct answer. Think like a founder.', 'Тези въпроси нямат правилен отговор. Мисли като основател.')}</p>
              </div>
            )}

            <div className="flex justify-end pt-2">
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
                      let cls = 'border-border hover:border-primary/40 hover:bg-accent/40';
                      if (quizSubmitted) {
                        if (isCorrect) cls = 'border-primary bg-primary/10 ring-2 ring-primary/30';
                        else if (selected && !isCorrect) cls = 'border-destructive bg-destructive/10 ring-2 ring-destructive/30';
                      } else if (selected) {
                        cls = 'border-primary bg-primary/10 ring-2 ring-primary/30 shadow-sm';
                      }
                      return (
                        <button
                          key={opt.id}
                          disabled={quizSubmitted}
                          onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                          className={`w-full text-left rounded-lg border-2 p-3 text-sm transition-all duration-150 ${cls}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                              selected && !quizSubmitted ? 'border-primary bg-primary' :
                              quizSubmitted && isCorrect ? 'border-primary bg-primary' :
                              quizSubmitted && selected && !isCorrect ? 'border-destructive bg-destructive' :
                              'border-muted-foreground/40'
                            }`}>
                              {(selected || (quizSubmitted && isCorrect)) && (
                                <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />
                              )}
                            </div>
                            <span className={`flex-1 ${selected && !quizSubmitted ? 'text-primary font-medium' : 'text-foreground'}`}>
                              {lang === 'bg' ? opt.bg : opt.en}
                            </span>
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
                <Button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizAnswers).length < quizMax}
                  className={Object.keys(quizAnswers).length < quizMax ? 'opacity-50' : ''}
                >
                  {t('Check Answers', 'Провери отговорите')}
                  {Object.keys(quizAnswers).length < quizMax && (
                    <span className="ml-2 text-xs opacity-70">({Object.keys(quizAnswers).length}/{quizMax})</span>
                  )}
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{t('Quiz Score', 'Резултат от теста')}: {quizScore}/{quizMax}</p>
                  <p className="text-xs text-muted-foreground">{Math.round((quizScore / quizMax) * 100)}%</p>
                </div>
                <Button onClick={() => setPhase(nextAfterQuiz)}>
                  {hasCase
                    ? t('Continue to Case Study', 'Продължи към казуса')
                    : t('Continue to Analysis', 'Продължи към анализа')
                  } <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* CASE STUDY PHASE */}
        {phase === 'case_study' && mod.embedded_case && (
          <div className="space-y-4">
            {/* Case header */}
            <div className="rounded-xl border-2 border-primary/30 bg-card p-6 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Badge className={`text-xs border-0 ${mod.embedded_case.outcome_type === 'success' ? 'bg-primary/15 text-primary' : mod.embedded_case.outcome_type === 'failure' ? 'bg-destructive/15 text-destructive' : 'bg-warning/15 text-warning'}`}>
                  {mod.embedded_case.outcome_type === 'success' ? '✅ ' : mod.embedded_case.outcome_type === 'failure' ? '❌ ' : '⚠️ '}
                  {t('Real-World Case', 'Реален казус')}
                </Badge>
              </div>
              <h2 className="text-lg font-bold text-foreground">
                {lang === 'bg' ? mod.embedded_case.title_bg : mod.embedded_case.title_en}
              </h2>
              <div className="rounded-lg bg-accent/50 p-3">
                <p className="text-xs font-semibold text-primary mb-1">🎯 {t('Learning Goal', 'Учебна цел')}</p>
                <p className="text-sm text-foreground">{lang === 'bg' ? mod.embedded_case.learning_goal_bg : mod.embedded_case.learning_goal_en}</p>
              </div>
            </div>

            {/* Context */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                {t('Context', 'Контекст')}
              </h3>
              <div className="prose prose-sm max-w-none text-foreground dark:prose-invert">
                <ReactMarkdown>{lang === 'bg' ? mod.embedded_case.context_bg : mod.embedded_case.context_en}</ReactMarkdown>
              </div>
            </div>

            {/* Problem */}
            <div className="rounded-xl border border-warning/30 bg-warning/5 p-5 space-y-2">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-warning" />
                {t('Business Problem', 'Бизнес проблем')}
              </h3>
              <p className="text-sm text-foreground italic">{lang === 'bg' ? mod.embedded_case.problem_bg : mod.embedded_case.problem_en}</p>
            </div>

            {/* Key Decision */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-2">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                {t('Key Decision', 'Ключово решение')}
              </h3>
              <p className="text-sm text-foreground">{lang === 'bg' ? mod.embedded_case.key_decision_bg : mod.embedded_case.key_decision_en}</p>
            </div>

            {/* Outcome */}
            <div className={`rounded-xl border p-5 space-y-2 ${mod.embedded_case.outcome_type === 'success' ? 'border-primary/30 bg-primary/5' : 'border-destructive/30 bg-destructive/5'}`}>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                {mod.embedded_case.outcome_type === 'success'
                  ? <CheckCircle2 className="h-4 w-4 text-primary" />
                  : <XCircle className="h-4 w-4 text-destructive" />
                }
                {t('Outcome', 'Резултат')}
              </h3>
              <p className="text-sm text-foreground">{lang === 'bg' ? mod.embedded_case.outcome_bg : mod.embedded_case.outcome_en}</p>
            </div>

            {/* Analytical Questions */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                {t('Your Analysis', 'Твоят анализ')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t('Answer at least one question in depth. Your analysis will receive AI feedback after submission.',
                   'Отговори на поне един въпрос в дълбочина. Анализът ти ще получи AI обратна връзка след изпращане.')}
              </p>
              {mod.embedded_case.analytical_questions.map((q, qi) => (
                <div key={q.id} className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    {qi + 1}. {lang === 'bg' ? q.question_bg : q.question_en}
                  </p>
                  <Textarea
                    value={caseAnswers[q.id] || ''}
                    onChange={e => setCaseAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder={t('Write your analysis...', 'Напиши анализа си...')}
                    className="min-h-[100px]"
                    disabled={!!existingResponse?.completed_at}
                  />
                  <p className={`text-xs ${(caseAnswers[q.id] || '').length >= 50 ? 'text-primary' : (caseAnswers[q.id] || '').length >= 20 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                    {(caseAnswers[q.id] || '').length} {t('characters', 'знака')}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setPhase('analytical')}>
                {t('Continue to Module Analysis', 'Продължи към анализа на модула')} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ANALYTICAL PHASE */}
        {phase === 'analytical' && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{t('🔍 Analytical Question', '🔍 Аналитичен въпрос')}</Badge>
              <SaveStatusIndicator />
            </div>
            <p className="text-sm font-semibold text-foreground">
              {lang === 'bg' ? mod.analytical_question_bg : mod.analytical_question_en}
            </p>
            <Textarea
              value={analyticalAnswer}
              onChange={e => setAnalyticalAnswer(e.target.value)}
              placeholder={t('Write your analysis here...', 'Напиши анализа си тук...')}
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

        {/* APPLICATION PHASE — Optional */}
        {phase === 'application' && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{t('🚀 Apply to Your Startup', '🚀 Приложи към твоя стартъп')}</Badge>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {t('Optional', 'По избор')}
                </Badge>
              </div>
              <SaveStatusIndicator />
            </div>
            {mod.startup_field && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 flex items-start gap-2">
                <Rocket className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  {t(
                    'This step is optional. If you write an answer, you can transfer it to My Startup later.',
                    'Тази стъпка е по избор. Ако напишеш отговор, можеш да го прехвърлиш в Моят стартъп по-късно.'
                  )}
                </p>
              </div>
            )}
            <p className="text-sm font-semibold text-foreground">
              {lang === 'bg' ? mod.application_question_bg : mod.application_question_en}
            </p>
            <Textarea
              value={applicationAnswer}
              onChange={e => setApplicationAnswer(e.target.value)}
              placeholder={t('Apply this concept to your startup idea...', 'Приложи тази концепция към твоята стартъп идея...')}
              className="min-h-[120px]"
              disabled={!!existingResponse?.completed_at}
            />
            <p className="text-xs text-muted-foreground">{applicationAnswer.length} {t('characters', 'знака')}</p>
            {!existingResponse?.completed_at && (
              <div className="flex items-center justify-between gap-3">
                <Button variant="ghost" size="sm" onClick={handleSubmitAll} disabled={saving} className="text-muted-foreground">
                  {t('Skip & Submit', 'Пропусни и изпрати')}
                </Button>
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
              <h3 className="text-sm font-semibold text-foreground mb-4">{t('Learning Outcome Scores', 'Постижения по умения')}</h3>
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
                      <span className={`text-xs font-bold ${cat.score >= 70 ? 'text-primary' : cat.score >= 40 ? 'text-warning' : 'text-muted-foreground'}`}>
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
              <h3 className="text-sm font-semibold text-foreground">{t('Your Answers', 'Твоите отговори')}</h3>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">{t('Analytical Answer', 'Аналитичен отговор')}</p>
                <p className="text-xs text-foreground bg-accent/50 rounded-lg p-3">{analyticalAnswer || '—'}</p>
              </div>
              {applicationAnswer && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">{t('Application Answer', 'Отговор за приложение')}</p>
                  <p className="text-xs text-foreground bg-accent/50 rounded-lg p-3">{applicationAnswer}</p>
                </div>
              )}
            </div>

            {/* "Use in My Startup" button — explicit action */}
            {mod.startup_field && applicationAnswer.trim().length >= 10 && (
              <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    {t('Use this in My Startup', 'Използвай в Моят стартъп')}
                  </span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-auto">
                    {t('Recommended', 'Препоръчано')}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t(
                    'Transfer your application answer directly into your startup project.',
                    'Прехвърли отговора за приложение директно в стартъп проекта си.'
                  )}
                </p>
                {startupSynced ? (
                  <div className="flex items-center gap-2 text-progress text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    {t('Added to My Startup!', 'Добавено в Моят стартъп!')}
                  </div>
                ) : (
                  <Button variant="outline" onClick={handleUseInStartup} className="w-full">
                    <Rocket className="h-4 w-4 mr-1" />
                    {t('Add to My Startup', 'Добави в Моят стартъп')}
                  </Button>
                )}
              </div>
            )}

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

            {/* Optional Actions Section */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                {t('What would you like to do next?', 'Какво искаш да направиш?')}
              </h3>

              {/* Primary: Continue */}
              <div className="space-y-2">
                {LEARNING_MODULES.findIndex(m => m.slug === slug) < LEARNING_MODULES.length - 1 ? (
                  <Button
                    className="w-full"
                    onClick={() => {
                      const nextIdx = LEARNING_MODULES.findIndex(m => m.slug === slug) + 1;
                      navigate(`/learn/${LEARNING_MODULES[nextIdx].slug}`);
                    }}
                  >
                    {t('Continue to Next Module', 'Продължи към следващия модул')} <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => navigate('/learn')}>
                    {t('Back to All Modules', 'Обратно към всички модули')} <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>

              {/* Secondary: Optional paths */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border">
                <button
                  onClick={() => navigate('/simulator')}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-accent/50 transition-colors text-left"
                >
                  <BarChart3 className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{t('Open Simulator', 'Отвори симулатора')}</p>
                    <p className="text-[10px] text-muted-foreground">{t('Optional · Test strategy', 'По избор · Тествай стратегия')}</p>
                  </div>
                </button>
                <button
                  onClick={() => navigate('/my-startup')}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-accent/50 transition-colors text-left"
                >
                  <Rocket className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{t('My Startup', 'Моят стартъп')}</p>
                    <p className="text-[10px] text-muted-foreground">{t('Optional · Build your idea', 'По избор · Изгради идеята си')}</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex justify-start">
              <Button variant="outline" onClick={() => navigate('/learn')}>
                <ArrowLeft className="h-4 w-4 mr-1" /> {t('All Modules', 'Всички модули')}
              </Button>
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
