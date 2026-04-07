import { useState, useMemo } from 'react';
import { useTranslation } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { awardXp } from '@/lib/xp';
import { TERMS } from '@/data/dictionary-terms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sparkles, BookOpen, Rocket, Check, Star, Award, GraduationCap,
  Layers, BarChart3, MessageSquare, PenLine, Lightbulb, ArrowRight,
  Lock, Trophy,
} from 'lucide-react';

interface Props {
  onComplete: () => void;
}

/* ── tiny bilingual helper ── */
const T = (lang: string, en: string, bg: string) => lang === 'bg' ? bg : en;

export default function WelcomeOnboarding({ onComplete }: Props) {
  const { lang, t } = useTranslation();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [classVal, setClassVal] = useState('');
  const [schoolVal, setSchoolVal] = useState('');
  const [xpPulse, setXpPulse] = useState(false);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [saving, setSaving] = useState(false);

  const TOTAL_STEPS = 5; // 0: how it works, 1: learning methods, 2: profile, 3: dictionary, 4: journey

  const randomTerm = useMemo(() => TERMS[Math.floor(Math.random() * TERMS.length)], []);

  const showXp = (amount: number) => {
    setTotalXpEarned(prev => prev + amount);
    setXpPulse(true);
    setTimeout(() => setXpPulse(false), 1200);
  };

  const handleProfileSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const profileUpdate: Record<string, unknown> = {};
      if (classVal || schoolVal) {
        profileUpdate.bio = [classVal && `Class: ${classVal}`, schoolVal && `School: ${schoolVal}`].filter(Boolean).join(' | ');
      }
      if (Object.keys(profileUpdate).length > 0) {
        await supabase.from('profiles').update(profileUpdate).eq('user_id', user.id);
      }
      await awardXp('onboarding_profile', 'onboarding_step_2');
      showXp(5);
      setTimeout(() => setStep(3), 800);
    } finally {
      setSaving(false);
    }
  };

  const handleDictionary = async () => {
    await awardXp('dict_view_term', randomTerm.term);
    showXp(5);
    setTimeout(() => setStep(4), 800);
  };

  const handleJourney = async () => {
    await awardXp('onboarding_journey', 'onboarding_step_4');
    showXp(10);
    setTimeout(() => setStep(5), 800);
  };

  const handleFinish = async () => {
    if (!user) return;
    await supabase.from('profiles').update({ onboarding_completed: true } as any).eq('user_id', user.id);
    onComplete();
  };

  /* ── Step dots (show 5 steps) ── */
  const dots = (
    <div className="flex items-center justify-center gap-1.5 mb-5">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-500 ${
            i < step ? 'w-2 bg-primary' : i === step ? 'w-7 bg-primary' : 'w-2 bg-muted'
          }`}
        />
      ))}
    </div>
  );

  /* ── Progression levels for step 0 ── */
  const LEVELS = [
    { icon: BookOpen, en: 'Level 1 — Foundations', bg: 'Ниво 1 — Основи', descEn: 'Learn concepts & explore cases', descBg: 'Научи основните концепции' },
    { icon: Lightbulb, en: 'Level 2 — Builder', bg: 'Ниво 2 — Строител', descEn: 'Design your startup idea', descBg: 'Проектирай стартъп идея' },
    { icon: BarChart3, en: 'Level 3 — Strategist', bg: 'Ниво 3 — Стратег', descEn: 'Test decisions in the simulator', descBg: 'Тествай решения в симулатора' },
    { icon: Trophy, en: 'Final Assessment', bg: 'Финален изпит', descEn: 'Prove your skills & earn a certificate', descBg: 'Докажи уменията си и вземи сертификат' },
  ];

  /* ── Learning methods for step 1 ── */
  const METHODS = [
    { icon: BookOpen, en: 'Theory', bg: 'Теория', descEn: 'Short readings on key concepts', descBg: 'Кратки четива за ключови концепции' },
    { icon: Layers, en: 'Case Studies', bg: 'Казуси', descEn: 'Analyze real-world business problems', descBg: 'Анализирай реални бизнес проблеми' },
    { icon: Rocket, en: 'Startup Builder', bg: 'Стартъп', descEn: 'Build your own startup idea step-by-step', descBg: 'Изгради стартъп идея стъпка по стъпка' },
    { icon: BarChart3, en: 'Simulator', bg: 'Симулатор', descEn: 'Make strategic decisions & see impact', descBg: 'Вземай стратегически решения' },
    { icon: MessageSquare, en: 'AI Feedback', bg: 'AI обратна връзка', descEn: 'Get personalized guidance on every task', descBg: 'Получи персонализирана помощ' },
    { icon: PenLine, en: 'Reflection', bg: 'Рефлексия', descEn: 'Think about what you learned', descBg: 'Помисли какво научи' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md mx-4 rounded-2xl border border-border bg-card p-7 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* XP pop */}
        {xpPulse && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 animate-fade-in z-10">
            <div className="flex items-center gap-1.5 rounded-full bg-xp-gold px-4 py-1.5 text-sm font-bold text-white shadow-lg animate-bounce">
              <Star className="h-4 w-4" /> +{step === 4 ? 10 : 5} XP
            </div>
          </div>
        )}

        {/* ═══ STEP 0: How the Platform Works ═══ */}
        {step === 0 && (
          <>
            <div className="text-center mb-5">
              <div className="mx-auto w-14 h-14 rounded-2xl sim-gradient flex items-center justify-center mb-3">
                <GraduationCap className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-display font-bold text-foreground">
                {T(lang, 'Welcome to DigiInnov! 🎓', 'Добре дошъл в DigiInnov! 🎓')}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {T(lang, "Here's how your learning journey works:", 'Ето как работи твоето обучение:')}
              </p>
            </div>
            {dots}
            <div className="space-y-2.5 mb-5">
              {LEVELS.map((lv, i) => {
                const Icon = lv.icon;
                const isLast = i === LEVELS.length - 1;
                return (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${isLast ? 'bg-primary/10 border border-primary/20' : 'bg-accent/50'}`}>
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isLast ? 'sim-gradient' : 'bg-primary/15'}`}>
                      <Icon className={`h-4 w-4 ${isLast ? 'text-primary-foreground' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{lang === 'bg' ? lv.bg : lv.en}</p>
                      <p className="text-xs text-muted-foreground">{lang === 'bg' ? lv.descBg : lv.descEn}</p>
                    </div>
                    {!isLast && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0 rotate-90" />}
                    {isLast && <Award className="h-4 w-4 text-primary shrink-0" />}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-center text-muted-foreground mb-4">
              {T(lang,
                'Each level unlocks after completing the previous one. Score 70+ on the final exam to earn your certificate!',
                'Всяко ниво се отключва след предходното. Получи 70+ на финалния изпит за сертификат!'
              )}
            </p>
            <Button className="w-full sim-gradient border-0" onClick={() => setStep(1)}>
              {T(lang, 'Got it! What will I learn?', 'Разбрах! Какво ще уча?')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </>
        )}

        {/* ═══ STEP 1: Learning Methods ═══ */}
        {step === 1 && (
          <>
            <div className="text-center mb-5">
              <h2 className="text-xl font-display font-bold text-foreground">
                {T(lang, 'How You Will Learn', 'Как ще учиш')}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {T(lang, '6 proven methods guide your learning:', '6 доказани метода водят обучението ти:')}
              </p>
            </div>
            {dots}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {METHODS.map((m, i) => {
                const Icon = m.icon;
                return (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-accent/50">
                    <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">{lang === 'bg' ? m.bg : m.en}</p>
                      <p className="text-[11px] text-muted-foreground leading-snug">{lang === 'bg' ? m.descBg : m.descEn}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-center text-muted-foreground mb-4">
              {T(lang,
                'Every activity earns XP. Level up and track your skills as you go!',
                'Всяка дейност носи XP. Вдигай ниво и следи уменията си!'
              )}
            </p>
            <Button className="w-full sim-gradient border-0" onClick={() => setStep(2)}>
              {T(lang, "Let's set up your profile!", 'Нека настроим профила ти!')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </>
        )}

        {/* ═══ STEP 2: Profile Setup (was step 0) ═══ */}
        {step === 2 && (
          <>
            <div className="text-center mb-5">
              <h2 className="text-xl font-display font-bold text-foreground">{t.onboardingStep1Title || T(lang, 'Set Up Your Profile', 'Настрой профила си')}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t.onboardingStep1Desc || ''}</p>
            </div>
            {dots}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                <Sparkles className="h-6 w-6 text-primary" />
                <p className="text-sm text-muted-foreground">{T(lang, 'Tell us a bit about yourself to personalize your experience.', 'Кажи ни малко за себе си.')}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">{t.onboardingStep1Class || T(lang, 'Class / Grade', 'Клас')}</label>
                <Input value={classVal} onChange={e => setClassVal(e.target.value)} placeholder={t.onboardingStep1ClassPlaceholder || '10A'} />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">{t.onboardingStep1School || T(lang, 'School', 'Училище')}</label>
                <Input value={schoolVal} onChange={e => setSchoolVal(e.target.value)} placeholder={t.onboardingStep1SchoolPlaceholder || ''} />
              </div>
              <Button className="w-full" onClick={handleProfileSave} disabled={saving}>
                {t.onboardingStep1Btn || T(lang, 'Save & Continue', 'Запази')} <span className="ml-1 text-xs opacity-80">+5 XP</span>
              </Button>
            </div>
          </>
        )}

        {/* ═══ STEP 3: Dictionary (was step 1) ═══ */}
        {step === 3 && (
          <>
            <div className="text-center mb-5">
              <h2 className="text-xl font-display font-bold text-foreground">{t.onboardingStep2Title || T(lang, 'Your First Concept', 'Първата ти концепция')}</h2>
            </div>
            {dots}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                <BookOpen className="h-6 w-6 text-primary" />
                <p className="text-sm text-muted-foreground">{t.onboardingStep2Desc || T(lang, 'Learn a key innovation term:', 'Научи ключов термин:')}</p>
              </div>
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <h3 className="font-bold text-foreground text-lg">{lang === 'bg' ? randomTerm.termBg : randomTerm.term}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{lang === 'bg' ? randomTerm.definitionBg : randomTerm.definition}</p>
                {randomTerm.example && (
                  <p className="text-xs text-muted-foreground mt-2 italic border-t border-border pt-2">{randomTerm.example}</p>
                )}
              </div>
              <Button className="w-full" onClick={handleDictionary}>
                {t.onboardingStep2Btn || T(lang, 'Got it!', 'Разбрах!')} <span className="ml-1 text-xs opacity-80">+5 XP</span>
              </Button>
            </div>
          </>
        )}

        {/* ═══ STEP 4: Journey intro (was step 2) ═══ */}
        {step === 4 && (
          <>
            <div className="text-center mb-5">
              <h2 className="text-xl font-display font-bold text-foreground">{t.onboardingStep3Title || T(lang, 'Your Innovation Journey', 'Твоето иновационно пътешествие')}</h2>
            </div>
            {dots}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                <Rocket className="h-6 w-6 text-primary" />
                <p className="font-semibold text-sm text-foreground">{T(lang, 'Stage 1: Discover the Problem', 'Етап 1: Открий проблема')}</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.onboardingStep3Desc || T(lang,
                  'Your journey starts with understanding digital innovation and real business problems. Complete activities, earn XP, and level up!',
                  'Пътешествието ти започва с разбиране на дигиталните иновации. Завършвай дейности, печели XP и вдигай ниво!'
                )}
              </p>
              <Button className="w-full" onClick={handleJourney}>
                {t.onboardingStep3Btn || T(lang, "Let's begin!", 'Да започнем!')} <span className="ml-1 text-xs opacity-80">+10 XP</span>
              </Button>
            </div>
          </>
        )}

        {/* ═══ STEP 5: Completion ═══ */}
        {step === 5 && (
          <div className="text-center space-y-4 animate-scale-in">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="h-8 w-8 text-primary animate-bounce" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground">{t.onboardingComplete || T(lang, "You're all set!", 'Готов си!')}</h2>
            <p className="text-sm text-muted-foreground">{t.onboardingCompleteDesc || T(lang, 'Your dashboard will guide you through every step.', 'Таблото ти ще те води през всяка стъпка.')}</p>
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-xp-gold">
              <Star className="h-6 w-6" /> {totalXpEarned} XP
            </div>
            <Button className="w-full sim-gradient border-0" onClick={handleFinish}>
              {t.onboardingGoToDashboard || T(lang, 'Go to Dashboard', 'Към таблото')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
