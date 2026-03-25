import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { awardXp } from '@/lib/xp';
import { TERMS, type DictionaryTerm } from '@/data/dictionary-terms';
import {
  HelpCircle, CheckCircle2, XCircle, Trophy, Zap,
  ArrowRight, RotateCcw, Target,
} from 'lucide-react';

const QUESTIONS_PER_TEST = 10;

const CATEGORY_FILTER_OPTIONS = [
  'All',
  'Marketing',
  'Pricing & Revenue',
  'Team & Roles',
  'Operations',
  'Supply Chain',
];

interface QuizQuestion {
  term: DictionaryTerm;
  options: string[];
  correctIndex: number;
}

function generateTestQuestions(lang: string, category: string): QuizQuestion[] {
  const isBg = lang === 'bg';
  const pool = category === 'All' ? [...TERMS] : TERMS.filter(t => t.category === category);
  
  // Shuffle pool
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const selected = pool.slice(0, Math.min(QUESTIONS_PER_TEST, pool.length));
  
  return selected.map(term => {
    const wrongPool = TERMS.filter(t => t.term !== term.term);
    const wrongs: string[] = [];
    const usedIndices = new Set<number>();
    while (wrongs.length < 3 && usedIndices.size < wrongPool.length) {
      const idx = Math.floor(Math.random() * wrongPool.length);
      if (!usedIndices.has(idx)) {
        usedIndices.add(idx);
        wrongs.push(isBg ? wrongPool[idx].definitionBg : wrongPool[idx].definition);
      }
    }
    const correctIndex = Math.floor(Math.random() * 4);
    const options = [...wrongs];
    options.splice(correctIndex, 0, isBg ? term.definitionBg : term.definition);
    return { term, options, correctIndex };
  });
}

function getXpTier(score: number): { xp: number; label: string; labelBg: string } {
  if (score >= 85) return { xp: 50, label: 'Excellent!', labelBg: 'Отлично!' };
  if (score >= 70) return { xp: 30, label: 'Great job!', labelBg: 'Чудесно!' };
  if (score >= 50) return { xp: 20, label: 'Good effort!', labelBg: 'Добро представяне!' };
  return { xp: 10, label: 'Keep learning!', labelBg: 'Продължавай да учиш!' };
}

function getFeedback(score: number, lang: string): string {
  if (lang === 'bg') {
    if (score >= 85) return 'Отлично разбиране на бизнес терминологията. Готов си за следващото ниво!';
    if (score >= 70) return 'Силно представяне! Обърни внимание на термините, които сбърка.';
    if (score >= 50) return 'Добро начало, но има още какво да научиш. Прегледай речника за термините, които не познаваш.';
    return 'Нужна е повече практика. Прегледай термините в речника и опитай отново!';
  }
  if (score >= 85) return 'Excellent understanding of business terminology. You are ready for the next level!';
  if (score >= 70) return 'Strong performance! Pay attention to the terms you missed.';
  if (score >= 50) return 'Good start, but there is more to learn. Review the dictionary for unfamiliar terms.';
  return 'More practice needed. Review the terms in the dictionary and try again!';
}

type Phase = 'setup' | 'active' | 'results';

export default function QuickTest() {
  const { lang } = useLang();
  const { user } = useAuth();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const [phase, setPhase] = useState<Phase>('setup');
  const [category, setCategory] = useState('All');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedResult, setSavedResult] = useState<{ score: number; xp: number } | null>(null);

  const startTest = useCallback(() => {
    const qs = generateTestQuestions(lang, category);
    setQuestions(qs);
    setCurrentQ(0);
    setAnswers(new Array(qs.length).fill(null));
    setSelectedAnswer(null);
    setSavedResult(null);
    setPhase('active');
  }, [lang, category]);

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      submitTest();
    }
  };

  const submitTest = async () => {
    setSaving(true);
    const correctCount = answers.reduce((acc, ans, i) => {
      return acc + (ans === questions[i]?.correctIndex ? 1 : 0);
    }, 0);
    const score = Math.round((correctCount / questions.length) * 100);
    const tier = getXpTier(score);

    // Award XP
    if (user) {
      await awardXp('dict_quiz_correct', `quick_test_${Date.now()}`, {
        score,
        correct: correctCount,
        total: questions.length,
        category,
      });

      // Save result to DB
      try {
        await supabase.from('quiz_results').insert({
          user_id: user.id,
          quiz_type: 'dictionary',
          score,
          max_score: 100,
          xp_earned: tier.xp,
          questions_count: questions.length,
          correct_count: correctCount,
          category: category === 'All' ? null : category,
        });
      } catch (e) {
        console.error('Failed to save quiz result:', e);
      }
    }

    setSavedResult({ score, xp: tier.xp });
    setSaving(false);
    setPhase('results');
  };

  const categoryTranslations: Record<string, string> = {
    All: 'Всички',
    Marketing: 'Маркетинг',
    'Pricing & Revenue': 'Ценообразуване',
    'Team & Roles': 'Екип и роли',
    Operations: 'Операции',
    'Supply Chain': 'Верига на доставки',
  };

  // ─── SETUP PHASE ───
  if (phase === 'setup') {
    return (
      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h2 className="font-display font-bold text-foreground text-lg">
            {t('Quick Test', 'Бърз тест')}
          </h2>
        </div>

        <p className="text-sm text-muted-foreground">
          {t(
            `Answer ${QUESTIONS_PER_TEST} questions to test your business vocabulary. Earn XP based on your score!`,
            `Отговори на ${QUESTIONS_PER_TEST} въпроса, за да тестваш бизнес речника си. Спечели XP според резултата!`
          )}
        </p>

        {/* XP Preview */}
        <div className="rounded-lg bg-accent/50 p-3 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              {t('XP Rewards', 'XP награди')}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
            <span>85–100%: <strong className="text-foreground">50 XP</strong></span>
            <span>70–84%: <strong className="text-foreground">30 XP</strong></span>
            <span>50–69%: <strong className="text-foreground">20 XP</strong></span>
            <span>0–49%: <strong className="text-foreground">10 XP</strong></span>
          </div>
        </div>

        {/* Category selection */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            {t('Category', 'Категория')}
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTER_OPTIONS.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  category === c
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {lang === 'bg' ? (categoryTranslations[c] || c) : c}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={startTest} className="w-full" disabled={!user}>
          <Target className="h-4 w-4 mr-2" />
          {t('Start Test', 'Започни тест')}
        </Button>
        {!user && (
          <p className="text-xs text-muted-foreground text-center">
            {t('Sign in to take the test and earn XP.', 'Влез в акаунта си, за да направиш теста и да спечелиш XP.')}
          </p>
        )}
      </Card>
    );
  }

  // ─── ACTIVE PHASE ───
  if (phase === 'active' && questions.length > 0) {
    const q = questions[currentQ];
    const progress = ((currentQ + (selectedAnswer !== null ? 1 : 0)) / questions.length) * 100;

    return (
      <Card className="p-6 space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {t('Question', 'Въпрос')} {currentQ + 1}/{questions.length}
            </span>
            <Badge variant="outline" className="text-xs">
              {answers.filter((a, i) => a === questions[i]?.correctIndex).length} {t('correct', 'верни')}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <p className="text-sm font-semibold text-foreground">
          {t('What is', 'Какво е')} <span className="text-primary">{lang === 'bg' ? q.term.termBg : q.term.term}</span>?
        </p>

        {/* Options */}
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctIndex;
            const isSelected = selectedAnswer === i;
            const showResult = selectedAnswer !== null;
            let borderClass = 'border-border';
            if (showResult && isCorrect) borderClass = 'border-emerald-500 bg-emerald-500/5';
            else if (showResult && isSelected && !isCorrect) borderClass = 'border-destructive bg-destructive/5';

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left rounded-md border p-3 text-xs leading-relaxed transition-all ${borderClass} ${
                  selectedAnswer === null ? 'hover:border-primary/40 cursor-pointer' : ''
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">
                    {showResult && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-destructive" />}
                    {!showResult && <span className="inline-block w-4 h-4 rounded-full border border-border" />}
                  </span>
                  <span className="text-foreground/80 line-clamp-3">{opt}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Next / Submit */}
        {selectedAnswer !== null && (
          <Button onClick={nextQuestion} className="w-full" disabled={saving}>
            {currentQ < questions.length - 1
              ? <>{t('Next Question', 'Следващ въпрос')} <ArrowRight className="h-4 w-4 ml-1" /></>
              : <>{t('See Results', 'Виж резултатите')} <Trophy className="h-4 w-4 ml-1" /></>
            }
          </Button>
        )}
      </Card>
    );
  }

  // ─── RESULTS PHASE ───
  if (phase === 'results' && savedResult) {
    const { score, xp } = savedResult;
    const correctCount = answers.filter((a, i) => a === questions[i]?.correctIndex).length;
    const tier = getXpTier(score);

    return (
      <Card className="p-6 space-y-5">
        {/* Score circle */}
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full border-4 ${
            score >= 70 ? 'border-emerald-500 text-emerald-600' : score >= 50 ? 'border-amber-500 text-amber-600' : 'border-destructive text-destructive'
          }`}>
            <span className="text-2xl font-display font-bold">{score}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {correctCount}/{questions.length} {t('correct', 'верни')}
          </p>
        </div>

        {/* XP earned */}
        <div className="flex items-center justify-center gap-2 rounded-lg bg-accent/50 p-3">
          <Zap className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold text-foreground">+{xp} XP</span>
          <span className="text-sm text-muted-foreground">—</span>
          <span className="text-sm font-medium text-primary">
            {lang === 'bg' ? tier.labelBg : tier.label}
          </span>
        </div>

        {/* Feedback */}
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-foreground/85 leading-relaxed">
            {getFeedback(score, lang)}
          </p>
        </div>

        {/* Missed terms */}
        {questions.some((q, i) => answers[i] !== q.correctIndex) && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t('Terms to Review', 'Термини за преговор')}
            </h4>
            <div className="space-y-1.5">
              {questions.filter((q, i) => answers[i] !== q.correctIndex).map((q, i) => (
                <div key={i} className="flex items-center gap-2 text-xs rounded-md bg-destructive/5 border border-destructive/10 p-2">
                  <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                  <span className="text-foreground font-medium">{lang === 'bg' ? q.term.termBg : q.term.term}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setPhase('setup'); }} className="flex-1">
            <RotateCcw className="h-4 w-4 mr-1" />
            {t('Try Again', 'Опитай пак')}
          </Button>
        </div>
      </Card>
    );
  }

  return null;
}
