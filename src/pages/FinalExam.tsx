import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Award, BookOpen, Rocket, BarChart3, Brain, CheckCircle2, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';

const SECTIONS = [
  { key: 'case_analysis', icon: BookOpen, enTitle: 'Case Analysis', bgTitle: 'Анализ на казус',
    enDesc: 'Analyze the following business problem: A traditional delivery company is losing market share to digital competitors. Identify the core problem, analyze the market environment, and propose a strategic direction for digital transformation.',
    bgDesc: 'Анализирайте следния бизнес проблем: Традиционна компания за доставки губи пазарен дял заради дигитални конкуренти. Идентифицирайте основния проблем, анализирайте пазарната среда и предложете стратегическа посока за дигитална трансформация.' },
  { key: 'startup_concept', icon: Rocket, enTitle: 'Startup Concept', bgTitle: 'Стартъп концепция',
    enDesc: 'Define a startup idea that solves a real problem. Describe: 1) The problem, 2) Target customer, 3) Your value proposition, 4) How you will make money.',
    bgDesc: 'Дефинирайте стартъп идея, която решава реален проблем. Опишете: 1) Проблемът, 2) Целевият клиент, 3) Вашето ценностно предложение, 4) Как ще печелите пари.' },
  { key: 'strategic_decision', icon: BarChart3, enTitle: 'Strategic Decision', bgTitle: 'Стратегическо решение',
    enDesc: 'Your startup has a €50,000 budget and must choose between: A) Investing in marketing for rapid growth, B) Improving the product for higher satisfaction, C) Hiring a new team. Justify your decision, analyze risks, and expected outcomes.',
    bgDesc: 'Вашият стартъп има 50,000 лв бюджет и трябва да избере между: A) Инвестиране в маркетинг за бърз растеж, B) Подобряване на продукта за по-висока задоволеност, C) Наемане на нов екип. Обосновете решението си, анализирайте рисковете и очакваните резултати.' },
  { key: 'reflection', icon: Brain, enTitle: 'Reflection', bgTitle: 'Рефлексия',
    enDesc: 'What did you learn during the course? How has your thinking about innovation and business changed? What skills did you develop and how will you apply them in the future?',
    bgDesc: 'Какво научихте по време на курса? Как се промени начинът ви на мислене за иновации и бизнес? Какви умения развихте и как ще ги приложите в бъдеще?' },
];

interface FeedbackSection { score: number; strengths: string; gaps: string; hint: string; }

export default function FinalExam() {
  const { user, loading: authLoading } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const [answers, setAnswers] = useState<Record<string, string>>({ case_analysis: '', startup_concept: '', strategic_decision: '', reflection: '' });
  const [currentSection, setCurrentSection] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ totalScore: number; passed: boolean; feedback: Record<string, FeedbackSection> } | null>(null);
  const [existingResult, setExistingResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/auth?redirect=/final-exam'); return; }
    supabase.from('final_exam_results').select('*').eq('user_id', user.id).maybeSingle().then(({ data }) => {
      if (data) {
        setExistingResult(data);
        setAnswers({
          case_analysis: data.case_analysis_answer || '',
          startup_concept: data.startup_concept_answer || '',
          strategic_decision: data.strategic_decision_answer || '',
          reflection: data.reflection_answer || '',
        });
        if (data.total_score > 0) {
          setResult({ totalScore: data.total_score, passed: data.passed, feedback: (data.ai_feedback as any) || {} });
        }
      }
      setLoading(false);
    });
  }, [user, authLoading, navigate]);

  const handleSubmit = async () => {
    const allFilled = SECTIONS.every(s => (answers[s.key] || '').trim().length >= 50);
    if (!allFilled) {
      toast.error(t('Each answer must be at least 50 characters.', 'Всеки отговор трябва да е поне 50 символа.'));
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('grade-final-exam', {
        body: { answers, lang },
      });
      if (error) throw error;
      setResult({ totalScore: data.totalScore, passed: data.passed, feedback: data.feedback });
      if (data.passed) {
        toast.success(t('🎉 Congratulations! You passed the final exam!', '🎉 Поздравления! Взехте финалния изпит!'));
      } else {
        toast.info(t('Exam graded. Review your feedback below.', 'Изпитът е оценен. Вижте обратната връзка по-долу.'));
      }
    } catch (err: any) {
      toast.error(err.message || 'Error grading exam');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (<div className="min-h-screen bg-background"><AppHeader /><div className="flex items-center justify-center py-20"><div className="animate-pulse text-muted-foreground">{t('Loading...', 'Зареждане...')}</div></div></div>);
  }

  const section = SECTIONS[currentSection];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="typo-h1 flex items-center gap-2">
              <Award className="h-7 w-7 text-primary" />
              {t('Final Exam', 'Финален изпит')}
            </h1>
            <p className="typo-helper mt-1">
              {t('Certificate in Digital Innovation & Startup Thinking', 'Сертификат по дигитални иновации и предприемаческо мислене')}
            </p>
          </div>
          {result?.passed && (
            <Button onClick={() => navigate('/certificate')} className="gap-2">
              <Award className="h-4 w-4" /> {t('View Certificate', 'Виж сертификат')}
            </Button>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{t('Section', 'Секция')} {currentSection + 1} / {SECTIONS.length}</span>
            <span>{Math.round(((currentSection + 1) / SECTIONS.length) * 100)}%</span>
          </div>
          <Progress value={((currentSection + 1) / SECTIONS.length) * 100} className="h-2" />
        </div>

        {/* Section nav tabs */}
        <div className="flex gap-2 flex-wrap">
          {SECTIONS.map((s, i) => {
            const Icon = s.icon;
            const isComplete = (answers[s.key] || '').trim().length >= 50;
            return (
              <Button key={s.key} variant={i === currentSection ? 'default' : 'outline'} size="sm"
                onClick={() => setCurrentSection(i)} className="gap-1.5">
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{lang === 'bg' ? s.bgTitle : s.enTitle}</span>
                {isComplete && <CheckCircle2 className="h-3 w-3 text-sim-success" />}
              </Button>
            );
          })}
        </div>

        {/* Current section */}
        {!result ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {(() => { const Icon = section.icon; return <Icon className="h-5 w-5 text-primary" />; })()}
                {lang === 'bg' ? section.bgTitle : section.enTitle}
                <Badge variant="outline" className="ml-auto">25 {t('points', 'точки')}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-accent/50 p-4 text-sm text-foreground leading-relaxed">
                {lang === 'bg' ? section.bgDesc : section.enDesc}
              </div>
              <Textarea
                value={answers[section.key] || ''}
                onChange={(e) => setAnswers(prev => ({ ...prev, [section.key]: e.target.value }))}
                placeholder={t('Write your answer here...', 'Напишете отговора си тук...')}
                className="min-h-[200px]"
              />
              <div className="flex items-center justify-between">
                <span className={`text-xs ${(answers[section.key] || '').length >= 50 ? 'text-sim-success' : 'text-muted-foreground'}`}>
                  {(answers[section.key] || '').length} {t('characters', 'символа')} {(answers[section.key] || '').length < 50 && `(${t('min 50', 'мин 50')})`}
                </span>
                <div className="flex gap-2">
                  {currentSection > 0 && (
                    <Button variant="outline" size="sm" onClick={() => setCurrentSection(currentSection - 1)}>
                      ← {t('Previous', 'Назад')}
                    </Button>
                  )}
                  {currentSection < SECTIONS.length - 1 ? (
                    <Button size="sm" onClick={() => setCurrentSection(currentSection + 1)} className="gap-1">
                      {t('Next', 'Напред')} <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <Button size="sm" onClick={handleSubmit} disabled={submitting} className="gap-1">
                      {submitting ? t('Grading...', 'Оценяване...') : t('Submit Exam', 'Подай изпита')}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Results view */
          <div className="space-y-6">
            {/* Overall score */}
            <Card className={result.passed ? 'border-sim-success/50 bg-sim-success/5' : 'border-sim-warning/50 bg-sim-warning/5'}>
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="text-5xl font-bold text-foreground">{result.totalScore}/100</div>
                  <Badge variant={result.passed ? 'default' : 'secondary'} className={`text-base px-4 py-1 ${result.passed ? 'bg-sim-success text-white' : ''}`}>
                    {result.passed ? t('PASSED ✓', 'ВЗЕТ ✓') : t('NOT PASSED — Review feedback', 'НЕВЗЕТ — Прегледай обратната връзка')}
                  </Badge>
                  {result.passed && (
                    <p className="text-sm text-muted-foreground">
                      {t('You earned 150 XP and a certificate!', 'Спечелихте 150 XP и сертификат!')}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Per-section feedback */}
            {SECTIONS.map((s) => {
              const fb = result.feedback[s.key] as FeedbackSection | undefined;
              if (!fb) return null;
              const Icon = s.icon;
              return (
                <Card key={s.key}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-base">
                        <Icon className="h-4 w-4 text-primary" />
                        {lang === 'bg' ? s.bgTitle : s.enTitle}
                      </span>
                      <Badge variant="outline" className={fb.score >= 18 ? 'border-sim-success text-sim-success' : fb.score >= 13 ? 'border-sim-warning text-sim-warning' : 'border-destructive text-destructive'}>
                        {fb.score}/25
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2 rounded-lg bg-sim-success/10 p-3">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-sim-success shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-sim-success mb-0.5">{t('Strengths', 'Силни страни')}</p>
                        <p className="text-sm text-foreground">{fb.strengths}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 rounded-lg bg-sim-warning/10 p-3">
                      <AlertTriangle className="h-4 w-4 mt-0.5 text-sim-warning shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-sim-warning mb-0.5">{t('Gaps', 'Пропуски')}</p>
                        <p className="text-sm text-foreground">{fb.gaps}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 rounded-lg bg-primary/10 p-3">
                      <Lightbulb className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-primary mb-0.5">{t('Improvement Hint', 'Насока за подобрение')}</p>
                        <p className="text-sm text-foreground">{fb.hint}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              {!result.passed && (
                <Button variant="outline" onClick={() => setResult(null)}>
                  {t('Retry Exam', 'Повтори изпита')}
                </Button>
              )}
              {result.passed && (
                <Button onClick={() => navigate('/certificate')} className="gap-2">
                  <Award className="h-4 w-4" /> {t('View Certificate', 'Виж сертификат')}
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                {t('Back to Dashboard', 'Към таблото')}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
