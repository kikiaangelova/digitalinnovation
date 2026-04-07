import { useState, useEffect, useCallback, useRef } from 'react';
import { Flame, Sparkles, Zap, Clock, Target, TrendingUp, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { showXpToast } from '@/lib/xp-toast';

interface ChallengeHubProps {
  lang: 'en' | 'bg';
  userId?: string;
}

type ChallengeType = 'daily' | 'weekly' | 'crisis' | 'strategic';

interface ChallengeOption {
  label: string;
  description: string;
  risk: string;
}

interface Challenge {
  id: string;
  type: string;
  title: string;
  scenario: string;
  options: ChallengeOption[];
  xp_reward: number;
  time_limit_seconds: number | null;
  difficulty: string;
}

const TYPE_CONFIG: Record<ChallengeType, { icon: typeof Zap; color: string; en: string; bg: string; descEn: string; descBg: string }> = {
  daily: { icon: Sparkles, color: 'text-xp-gold', en: 'Daily Challenge', bg: 'Ежедневно', descEn: 'Quick 1-2 min decision', descBg: 'Бързо решение за 1-2 мин' },
  weekly: { icon: Target, color: 'text-blue-500', en: 'Weekly Challenge', bg: 'Седмично', descEn: 'Complex strategic scenario', descBg: 'Сложен стратегически сценарий' },
  crisis: { icon: AlertTriangle, color: 'text-red-500', en: 'Crisis Challenge', bg: 'Кризисно', descEn: 'Time pressure & limited info', descBg: 'Време и ограничена информация' },
  strategic: { icon: TrendingUp, color: 'text-purple-500', en: 'Strategic Challenge', bg: 'Стратегическо', descEn: 'Long-term impact decision', descBg: 'Решение с дългосрочно влияние' },
};

export default function ChallengeHub({ lang, userId }: ChallengeHubProps) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const [activeType, setActiveType] = useState<ChallengeType>('daily');
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchChallenge = useCallback(async (type: ChallengeType) => {
    if (!userId) return;
    setLoading(true);
    setChallenge(null);
    setFeedback(null);
    setSelectedOption(null);
    setAlreadyCompleted(false);
    setTimer(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-challenge', {
        body: { type, lang },
      });

      if (error) throw error;

      if (data.already_completed) {
        setAlreadyCompleted(true);
      } else if (data.challenge) {
        const c = data.challenge;
        setChallenge({
          ...c,
          options: typeof c.options === 'string' ? JSON.parse(c.options) : c.options,
        });
        if (c.time_limit_seconds) {
          setTimer(c.time_limit_seconds);
          setStartTime(Date.now());
        }
      }
    } catch (err) {
      console.error('Failed to load challenge:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, lang]);

  // Timer countdown
  useEffect(() => {
    if (timer !== null && timer > 0 && !feedback) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev !== null && prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [timer !== null, feedback]);

  const handleSubmit = async () => {
    if (selectedOption === null || !challenge || !userId) return;
    setSubmitting(true);

    const timeTaken = startTime ? Math.round((Date.now() - startTime) / 1000) : undefined;

    try {
      const { data, error } = await supabase.functions.invoke('submit-challenge', {
        body: {
          challenge_id: challenge.id,
          selected_option: selectedOption,
          time_taken_seconds: timeTaken,
          lang,
        },
      });

      if (error) throw error;

      setFeedback(data.feedback);
      setXpEarned(data.xp_earned || 0);

      if (data.xp_earned > 0) {
        showXpToast(`challenge_${challenge.type}` as any, data.xp_earned, lang);
      }
    } catch (err) {
      console.error('Submit challenge error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const types = Object.keys(TYPE_CONFIG) as ChallengeType[];

  return (
    <Card className="p-5 border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="typo-card-title flex items-center gap-2">
          <Flame className="h-4 w-4 text-xp-gold" />
          {t('Challenges', 'Предизвикателства')}
        </h3>
      </div>

      {/* Type tabs */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {types.map(type => {
          const cfg = TYPE_CONFIG[type];
          const Icon = cfg.icon;
          const isActive = activeType === type;
          return (
            <button
              key={type}
              onClick={() => { setActiveType(type); setChallenge(null); setFeedback(null); setAlreadyCompleted(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors
                ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
            >
              <Icon className="h-3 w-3" />
              {lang === 'bg' ? cfg.bg : cfg.en}
            </button>
          );
        })}
      </div>

      {/* Challenge area */}
      {!challenge && !loading && !alreadyCompleted && (
        <div className="text-center py-6">
          <p className="typo-body text-muted-foreground mb-3">
            {lang === 'bg' ? TYPE_CONFIG[activeType].descBg : TYPE_CONFIG[activeType].descEn}
          </p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="secondary" className="gap-1">
              <Zap className="h-3 w-3 text-xp-gold" />
              +{TYPE_CONFIG[activeType] && activeType === 'daily' ? 10 : activeType === 'weekly' ? 25 : activeType === 'crisis' ? 20 : 30} XP
            </Badge>
            {activeType === 'crisis' && (
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" />
                2 min
              </Badge>
            )}
          </div>
          <Button onClick={() => fetchChallenge(activeType)} disabled={!userId}>
            {t('Start Challenge', 'Започни предизвикателство')}
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">{t('Generating scenario...', 'Генериране на сценарий...')}</span>
        </div>
      )}

      {alreadyCompleted && (
        <div className="flex items-center gap-3 rounded-lg bg-success/10 p-4">
          <CheckCircle className="h-5 w-5 text-success shrink-0" />
          <div>
            <p className="typo-body font-semibold text-success">
              {t('Challenge completed!', 'Предизвикателството е завършено!')}
            </p>
            <p className="typo-helper mt-1">
              {activeType === 'daily' || activeType === 'crisis'
                ? t('Come back tomorrow for a new challenge', 'Върни се утре за ново предизвикателство')
                : t('Come back next week for a new challenge', 'Върни се следващата седмица за ново предизвикателство')}
            </p>
          </div>
        </div>
      )}

      {challenge && !feedback && (
        <div className="space-y-4">
          {/* Timer */}
          {timer !== null && (
            <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${timer <= 30 ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>
              <Clock className="h-4 w-4" />
              <span className="text-sm font-mono font-bold">
                {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
              </span>
              <span className="text-xs">{t('remaining', 'остават')}</span>
            </div>
          )}

          <div>
            <h4 className="typo-body font-bold mb-2">{challenge.title}</h4>
            <p className="typo-body text-foreground/80 whitespace-pre-line">{challenge.scenario}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t('Your Decision', 'Твоето решение')}
            </p>
            {challenge.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelectedOption(i)}
                disabled={timer === 0}
                className={`w-full text-left rounded-lg border-2 p-3 transition-all
                  ${selectedOption === i
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                  } ${timer === 0 ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary text-sm shrink-0">{String.fromCharCode(65 + i)}.</span>
                  <div>
                    <p className="text-sm font-semibold">{opt.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                    <p className="text-xs text-warning/80 mt-1 italic">⚠ {opt.risk}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={selectedOption === null || submitting || timer === 0}
            className="w-full"
          >
            {submitting ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" />{t('Analyzing...', 'Анализиране...')}</>
            ) : timer === 0 ? (
              t('Time expired', 'Времето изтече')
            ) : (
              t('Submit Decision', 'Подай решение')
            )}
          </Button>
        </div>
      )}

      {feedback && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-success" />
            <span className="typo-body font-bold text-success">
              {t('Decision Submitted', 'Решението е подадено')} — +{xpEarned} XP
            </span>
          </div>
          <div className="rounded-lg bg-accent/50 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              {t('AI Mentor Feedback', 'Обратна връзка от AI ментора')}
            </p>
            <p className="typo-body text-foreground/90 whitespace-pre-line">{feedback}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setChallenge(null); setFeedback(null); }}
            className="w-full"
          >
            {t('Back to Challenges', 'Обратно към предизвикателствата')}
          </Button>
        </div>
      )}
    </Card>
  );
}
