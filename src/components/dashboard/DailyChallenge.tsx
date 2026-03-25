import { useState, useMemo } from 'react';
import { Flame, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TERMS } from '@/data/dictionary-terms';
import { awardXp } from '@/lib/xp';

interface Props {
  lang: 'en' | 'bg';
  userId?: string;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDailyQuiz(lang: 'en' | 'bg') {
  const today = getTodayKey();
  const seed = Array.from(today).reduce((a, c) => a + c.charCodeAt(0), 0) * 31;
  const rng = seededRandom(seed);

  const termIndex = Math.floor(rng() * TERMS.length);
  const correctTerm = TERMS[termIndex];
  const correctAnswer = lang === 'bg' ? correctTerm.definitionBg : correctTerm.definition;
  const question = lang === 'bg' ? correctTerm.termBg : correctTerm.term;

  // Pick 3 wrong answers
  const wrongIndices: number[] = [];
  while (wrongIndices.length < 3) {
    const idx = Math.floor(rng() * TERMS.length);
    if (idx !== termIndex && !wrongIndices.includes(idx)) wrongIndices.push(idx);
  }

  const options = wrongIndices.map(i => lang === 'bg' ? TERMS[i].definitionBg : TERMS[i].definition);
  const correctPos = Math.floor(rng() * 4);
  options.splice(correctPos, 0, correctAnswer);

  return { question, options, correctIndex: correctPos, correctAnswer };
}

const STORAGE_KEY = 'daily-challenge';

function getStoredState(userId?: string) {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}-${userId || 'anon'}`);
    if (!raw) return null;
    return JSON.parse(raw) as { date: string; answered: boolean; correct: boolean; streak: number };
  } catch { return null; }
}

function saveState(userId: string | undefined, answered: boolean, correct: boolean, streak: number) {
  localStorage.setItem(`${STORAGE_KEY}-${userId || 'anon'}`, JSON.stringify({
    date: getTodayKey(),
    answered,
    correct,
    streak,
  }));
}

export default function DailyChallenge({ lang, userId }: Props) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const stored = useMemo(() => getStoredState(userId), [userId]);
  const isToday = stored?.date === getTodayKey();
  const initialStreak = stored?.streak ?? 0;

  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(isToday && stored?.answered === true);
  const [wasCorrect, setWasCorrect] = useState(isToday ? stored?.correct ?? false : false);
  const [streak, setStreak] = useState(initialStreak);

  const quiz = useMemo(() => getDailyQuiz(lang), [lang]);

  const handleAnswer = async (idx: number) => {
    if (answered) return;
    setSelected(idx);
    const correct = idx === quiz.correctIndex;
    setWasCorrect(correct);
    setAnswered(true);

    // Calculate new streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    
    let newStreak = 0;
    if (correct) {
      if (stored?.date === yesterdayKey && stored?.correct) {
        newStreak = (stored.streak || 0) + 1;
      } else {
        newStreak = 1;
      }
    }
    setStreak(newStreak);
    saveState(userId, true, correct, newStreak);

    if (correct) {
      await awardXp('dict_quiz_correct', `daily-${getTodayKey()}`);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="typo-card-title flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-xp-gold" />
          {t('Daily Challenge', 'Предизвикателство на деня')}
        </h3>
        {streak > 0 && (
          <span className="flex items-center gap-1 text-sm font-bold text-xp-gold">
            <Flame className="h-4 w-4" />
            {streak} {t('days in a row', 'дни подред')}
          </span>
        )}
      </div>

      {answered ? (
        <div className="space-y-3">
          {wasCorrect ? (
            <div className="flex items-start gap-3 rounded-lg bg-success/10 p-4">
              <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
              <div>
                <p className="typo-body font-semibold text-success">
                  {t('Correct! +5 XP', 'Вярно! +5 XP')}
                </p>
                <p className="typo-helper mt-1">
                  {t('Come back tomorrow for a new challenge', 'Върни се утре за ново предизвикателство')}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-lg bg-warning/10 p-4">
              <XCircle className="h-5 w-5 text-warning mt-0.5 shrink-0" />
              <div>
                <p className="typo-body font-semibold text-warning">
                  {t(
                    `Not quite — the right answer is "${quiz.correctAnswer}". Try again tomorrow!`,
                    `Не съвсем — правилният отговор е "${quiz.correctAnswer}". Опитай утре!`
                  )}
                </p>
                <p className="typo-helper mt-1">
                  {t('Come back tomorrow for a new challenge', 'Върни се утре за ново предизвикателство')}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="typo-body font-medium">
            {t('What is', 'Какво е')} <span className="font-bold text-foreground">"{quiz.question}"</span>?
          </p>
          <div className="grid gap-2">
            {quiz.options.map((opt, i) => (
              <Button
                key={i}
                variant="outline"
                className="justify-start text-left h-auto py-3 px-4 typo-body whitespace-normal"
                onClick={() => handleAnswer(i)}
              >
                <span className="font-semibold text-primary mr-2 shrink-0">
                  {String.fromCharCode(65 + i)}.
                </span>
                <span className="line-clamp-2">{opt}</span>
              </Button>
            ))}
          </div>
          <p className="typo-helper text-center">
            {t('Earn +5 XP for the correct answer!', 'Спечели +5 XP за верен отговор!')}
          </p>
        </div>
      )}
    </div>
  );
}
