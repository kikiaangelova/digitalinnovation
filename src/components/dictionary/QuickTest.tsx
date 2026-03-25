import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { awardXp } from '@/lib/xp';
import { TERMS, getTermDifficulty, type DictionaryTerm, type TermDifficulty } from '@/data/dictionary-terms';
import {
  HelpCircle, CheckCircle2, XCircle, Trophy, Zap,
  ArrowRight, RotateCcw, Target, TrendingUp, TrendingDown,
  BookOpen, Brain, Lightbulb,
} from 'lucide-react';

const QUESTIONS_PER_TEST = 10;

const CATEGORY_FILTER_OPTIONS = [
  'All', 'Marketing', 'Pricing & Revenue', 'Team & Roles', 'Operations', 'Supply Chain',
];

interface QuizQuestion {
  term: DictionaryTerm;
  options: string[];
  correctIndex: number;
  difficulty: TermDifficulty;
}

// ─── Adaptive question generation ───
function generateAdaptiveQuestions(
  lang: string,
  category: string,
  startDifficulty: TermDifficulty,
  weakAreas: string[] = [],
  pastAvg?: number | null,
): QuizQuestion[] {
  const isBg = lang === 'bg';
  const pool = category === 'All' ? [...TERMS] : TERMS.filter(t => t.category === category);

  const byDifficulty: Record<TermDifficulty, DictionaryTerm[]> = { beginner: [], intermediate: [], advanced: [] };
  pool.forEach(t => byDifficulty[getTermDifficulty(t)].push(t));

  Object.values(byDifficulty).forEach(arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  });

  const selected: DictionaryTerm[] = [];
  const diffLevels: TermDifficulty[] = ['beginner', 'intermediate', 'advanced'];
  const pointers: Record<TermDifficulty, number> = { beginner: 0, intermediate: 0, advanced: 0 };

  // Reinforcement first: if weak areas exist, start with easier clarifying terms from weak categories
  if (weakAreas.length > 0) {
    const weakPool = pool
      .filter(t => weakAreas.includes(t.category))
      .sort((a, b) => (getTermDifficulty(a) === 'beginner' ? -1 : 1) - (getTermDifficulty(b) === 'beginner' ? -1 : 1));

    for (const term of weakPool.slice(0, 3)) {
      if (!selected.some(s => s.term === term.term)) selected.push(term);
    }
  }

  let currentDiff = startDifficulty;
  for (let i = selected.length; i < Math.min(QUESTIONS_PER_TEST, pool.length); i++) {
    // adaptive ramp from historical performance
    if ((pastAvg ?? 0) >= 80 && i >= 2) currentDiff = 'advanced';
    else if ((pastAvg ?? 0) >= 60 && i >= 3) currentDiff = 'intermediate';
    else if (i >= 6) currentDiff = 'intermediate';
    else currentDiff = 'beginner';

    let picked = false;
    for (const tryDiff of [currentDiff, ...diffLevels.filter(d => d !== currentDiff)]) {
      while (pointers[tryDiff] < byDifficulty[tryDiff].length) {
        const candidate = byDifficulty[tryDiff][pointers[tryDiff]++];
        if (!selected.some(s => s.term === candidate.term)) {
          selected.push(candidate);
          picked = true;
          break;
        }
      }
      if (picked) break;
    }
    if (!picked) break;
  }

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
    return { term, options, correctIndex, difficulty: getTermDifficulty(term) };
  });
}

function getXpTier(score: number): { xp: number; label: string; labelBg: string } {
  if (score >= 86) return { xp: 50, label: 'Excellent!', labelBg: 'Отлично!' };
  if (score >= 71) return { xp: 30, label: 'Great job!', labelBg: 'Чудесно!' };
  if (score >= 51) return { xp: 20, label: 'Good effort!', labelBg: 'Добро представяне!' };
  return { xp: 10, label: 'Keep learning!', labelBg: 'Продължавай да учиш!' };
}

function getFeedback(score: number, lang: string): string {
  if (lang === 'bg') {
    if (score >= 86) return 'Отлично разбиране на бизнес терминологията. Готов си за следващото ниво!';
    if (score >= 71) return 'Силно представяне! Обърни внимание на термините, които сбърка.';
    if (score >= 51) return 'Добро начало, но има още какво да научиш. Прегледай речника за термините, които не познаваш.';
    return 'Нужна е повече практика. Прегледай термините в речника и опитай отново!';
  }
  if (score >= 86) return 'Excellent understanding of business terminology. You are ready for the next level!';
  if (score >= 71) return 'Strong performance! Pay attention to the terms you missed.';
  if (score >= 51) return 'Good start, but there is more to learn. Review the dictionary for unfamiliar terms.';
  return 'More practice needed. Review the terms in the dictionary and try again!';
}

// ─── Weak area detection ───
interface WeakArea {
  category: string;
  correct: number;
  total: number;
  pct: number;
}

function detectWeakAreas(questions: QuizQuestion[], answers: (number | null)[]): { strong: WeakArea[]; weak: WeakArea[] } {
  const byCategory: Record<string, { correct: number; total: number }> = {};
  questions.forEach((q, i) => {
    const cat = q.term.category;
    if (!byCategory[cat]) byCategory[cat] = { correct: 0, total: 0 };
    byCategory[cat].total++;
    if (answers[i] === q.correctIndex) byCategory[cat].correct++;
  });

  const areas: WeakArea[] = Object.entries(byCategory).map(([category, { correct, total }]) => ({
    category, correct, total, pct: Math.round((correct / total) * 100),
  }));

  return {
    strong: areas.filter(a => a.pct >= 70).sort((a, b) => b.pct - a.pct),
    weak: areas.filter(a => a.pct < 70).sort((a, b) => a.pct - b.pct),
  };
}

// ─── Recommendations ───
const CATEGORY_RECOMMENDATIONS: Record<string, { moduleEn: string; moduleBg: string; path: string }> = {
  Marketing: { moduleEn: 'Marketing Module', moduleBg: 'Модул Маркетинг', path: '/learning-modules' },
  'Pricing & Revenue': { moduleEn: 'Pricing & Revenue Module', moduleBg: 'Модул Ценообразуване', path: '/learning-modules' },
  'Team & Roles': { moduleEn: 'Team & Roles Module', moduleBg: 'Модул Екип и роли', path: '/learning-modules' },
  Operations: { moduleEn: 'Operations Module', moduleBg: 'Модул Операции', path: '/learning-modules' },
  'Supply Chain': { moduleEn: 'Supply Chain Module', moduleBg: 'Модул Верига на доставки', path: '/learning-modules' },
  Strategy: { moduleEn: 'Strategy Cases', moduleBg: 'Казуси по стратегия', path: '/cases' },
  Metrics: { moduleEn: 'Business Metrics Theory', moduleBg: 'Теория за бизнес метрики', path: '/learning-modules' },
  'Business Model': { moduleEn: 'Business Model Canvas', moduleBg: 'Канвас на бизнес модела', path: '/my-startup' },
};

type Phase = 'setup' | 'active' | 'results';

const categoryTranslations: Record<string, string> = {
  All: 'Всички',
  Marketing: 'Маркетинг',
  'Pricing & Revenue': 'Ценообразуване',
  'Team & Roles': 'Екип и роли',
  Operations: 'Операции',
  'Supply Chain': 'Верига на доставки',
};

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
  const [savedResult, setSavedResult] = useState<{ score: number; xp: number; bonusXp: number } | null>(null);
  const [startDifficulty, setStartDifficulty] = useState<TermDifficulty>('beginner');
  const [pastAvg, setPastAvg] = useState<number | null>(null);

  // Load past performance to determine adaptive difficulty
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('quiz_results')
        .select('score')
        .eq('user_id', user.id)
        .eq('quiz_type', 'dictionary')
        .order('created_at', { ascending: false })
        .limit(5);
      if (data && data.length > 0) {
        const avg = data.reduce((s, r) => s + r.score, 0) / data.length;
        setPastAvg(avg);
        if (avg >= 80) setStartDifficulty('advanced');
        else if (avg >= 55) setStartDifficulty('intermediate');
        else setStartDifficulty('beginner');
      }
    })();
  }, [user]);

  const startTest = useCallback(() => {
    const qs = generateAdaptiveQuestions(lang, category, startDifficulty);
    setQuestions(qs);
    setCurrentQ(0);
    setAnswers(new Array(qs.length).fill(null));
    setSelectedAnswer(null);
    setSavedResult(null);
    setPhase('active');
  }, [lang, category, startDifficulty]);

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
    const correctCount = answers.reduce((acc, ans, i) => acc + (ans === questions[i]?.correctIndex ? 1 : 0), 0);
    const score = Math.round((correctCount / questions.length) * 100);
    const tier = getXpTier(score);

    let bonusXp = 0;

    if (user) {
      // Check for bonus XP: first high score or improvement
      try {
        const { data: pastResults } = await supabase
          .from('quiz_results')
          .select('score')
          .eq('user_id', user.id)
          .eq('quiz_type', 'dictionary')
          .order('created_at', { ascending: false })
          .limit(5);

        if (pastResults) {
          if (pastResults.length === 0 && score >= 80) bonusXp += 10; // First attempt high score
          if (pastResults.length > 0 && score > pastResults[0].score) bonusXp += 10; // Improvement
        }
      } catch { /* best effort */ }

      await awardXp('dict_quiz_correct', `quick_test_${Date.now()}`, {
        score, correct: correctCount, total: questions.length, category, bonusXp,
      });

      try {
        await supabase.from('quiz_results').insert({
          user_id: user.id,
          quiz_type: 'dictionary',
          score,
          max_score: 100,
          xp_earned: tier.xp + bonusXp,
          questions_count: questions.length,
          correct_count: correctCount,
          category: category === 'All' ? null : category,
        });
      } catch (e) {
        console.error('Failed to save quiz result:', e);
      }
    }

    setSavedResult({ score, xp: tier.xp, bonusXp });
    setSaving(false);
    setPhase('results');
  };

  // ─── SETUP PHASE ───
  if (phase === 'setup') {
    const diffLabel: Record<TermDifficulty, string> = {
      beginner: t('Beginner', 'Начинаещ'),
      intermediate: t('Intermediate', 'Средно'),
      advanced: t('Advanced', 'Напреднал'),
    };
    const diffColor: Record<TermDifficulty, string> = {
      beginner: 'text-emerald-600', intermediate: 'text-amber-600', advanced: 'text-rose-600',
    };

    return (
      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h2 className="font-display font-bold text-foreground text-lg">
            {t('Adaptive Quick Test', 'Адаптивен бърз тест')}
          </h2>
        </div>

        <p className="text-sm text-muted-foreground">
          {t(
            `Answer ${QUESTIONS_PER_TEST} questions that adapt to your level. Earn XP and discover your strengths and weaknesses!`,
            `Отговори на ${QUESTIONS_PER_TEST} въпроса, които се адаптират към нивото ти. Спечели XP и открий силните и слабите си страни!`
          )}
        </p>

        {/* Adaptive difficulty indicator */}
        {pastAvg !== null && (
          <div className="rounded-lg bg-accent/50 p-3 flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              {t('Based on your history:', 'Базирано на историята ти:')}
            </span>
            <span className={`text-xs font-bold ${diffColor[startDifficulty]}`}>
              {diffLabel[startDifficulty]}
            </span>
            <span className="text-xs text-muted-foreground">
              ({t('avg', 'ср.')} {Math.round(pastAvg)}%)
            </span>
          </div>
        )}

        {/* XP Preview */}
        <div className="rounded-lg bg-accent/50 p-3 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              {t('XP Rewards', 'XP награди')}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
            <span>86–100%: <strong className="text-foreground">50 XP</strong></span>
            <span>71–85%: <strong className="text-foreground">30 XP</strong></span>
            <span>51–70%: <strong className="text-foreground">20 XP</strong></span>
            <span>0–50%: <strong className="text-foreground">10 XP</strong></span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            + {t('Bonus +10 XP for improvement or first high score', 'Бонус +10 XP за подобрение или първи висок резултат')}
          </p>
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
          {t('Start Adaptive Test', 'Започни адаптивен тест')}
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
    const diffBadge: Record<TermDifficulty, string> = {
      beginner: 'bg-emerald-500/10 text-emerald-600',
      intermediate: 'bg-amber-500/10 text-amber-600',
      advanced: 'bg-rose-500/10 text-rose-600',
    };

    return (
      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {t('Question', 'Въпрос')} {currentQ + 1}/{questions.length}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-[10px] ${diffBadge[q.difficulty]}`}>
                {q.difficulty === 'beginner' ? '●' : q.difficulty === 'intermediate' ? '●●' : '●●●'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {answers.filter((a, i) => a === questions[i]?.correctIndex).length} {t('correct', 'верни')}
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <p className="text-sm font-semibold text-foreground">
          {t('What is', 'Какво е')} <span className="text-primary">{lang === 'bg' ? q.term.termBg : q.term.term}</span>?
        </p>

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
    const { score, xp, bonusXp } = savedResult;
    const correctCount = answers.filter((a, i) => a === questions[i]?.correctIndex).length;
    const tier = getXpTier(score);
    const { strong, weak } = detectWeakAreas(questions, answers);

    return (
      <Card className="p-6 space-y-5">
        {/* Score circle */}
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full border-4 ${
            score >= 71 ? 'border-emerald-500 text-emerald-600' : score >= 51 ? 'border-amber-500 text-amber-600' : 'border-destructive text-destructive'
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
          <span className="text-lg font-bold text-foreground">+{xp + bonusXp} XP</span>
          {bonusXp > 0 && (
            <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-500/30">
              +{bonusXp} {t('bonus', 'бонус')}
            </Badge>
          )}
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

        {/* Strong areas */}
        {strong.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              {t('Strong Areas', 'Силни страни')}
            </h4>
            <div className="space-y-1.5">
              {strong.map(a => (
                <div key={a.category} className="flex items-center justify-between text-xs rounded-md bg-emerald-500/5 border border-emerald-500/10 p-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span className="text-foreground font-medium">
                      {lang === 'bg' ? (categoryTranslations[a.category] || a.category) : a.category}
                    </span>
                  </div>
                  <span className="text-emerald-600 font-bold">{a.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weak areas with recommendations */}
        {weak.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <TrendingDown className="h-3.5 w-3.5 text-amber-500" />
              {t('Needs Improvement', 'Области за подобрение')}
            </h4>
            <div className="space-y-1.5">
              {weak.map(a => {
                const rec = CATEGORY_RECOMMENDATIONS[a.category];
                return (
                  <div key={a.category} className="rounded-md bg-amber-500/5 border border-amber-500/10 p-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span className="text-foreground font-medium">
                          {lang === 'bg' ? (categoryTranslations[a.category] || a.category) : a.category}
                        </span>
                      </div>
                      <span className="text-amber-600 font-bold">{a.pct}%</span>
                    </div>
                    {rec && (
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pl-5">
                        <Lightbulb className="h-3 w-3 text-amber-500" />
                        {t('Recommended:', 'Препоръчано:')} {lang === 'bg' ? rec.moduleBg : rec.moduleEn}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Missed terms */}
        {questions.some((q, i) => answers[i] !== q.correctIndex) && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
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

        {/* Next recommended step */}
        {weak.length > 0 && (
          <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-3">
            <p className="text-xs font-semibold text-primary mb-1">
              {t('Recommended Next Step', 'Препоръчана следваща стъпка')}
            </p>
            <p className="text-xs text-foreground/80">
              {t(
                `Focus on ${weak[0].category} — review the related dictionary terms and try another test.`,
                `Фокусирай се върху ${categoryTranslations[weak[0].category] || weak[0].category} — прегледай свързаните термини и опитай отново.`
              )}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPhase('setup')} className="flex-1">
            <RotateCcw className="h-4 w-4 mr-1" />
            {t('Try Again', 'Опитай пак')}
          </Button>
        </div>
      </Card>
    );
  }

  return null;
}
