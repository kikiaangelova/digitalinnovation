import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { awardXp } from '@/lib/xp';
import { TERMS } from '@/data/dictionary-terms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, BookOpen, Rocket, Check, Star } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export default function WelcomeOnboarding({ onComplete }: Props) {
  const { lang, t } = useTranslation();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [classVal, setClassVal] = useState('');
  const [schoolVal, setSchoolVal] = useState('');
  const [xpPulse, setXpPulse] = useState(false);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [saving, setSaving] = useState(false);

  const randomTerm = useMemo(() => {
    const idx = Math.floor(Math.random() * TERMS.length);
    return TERMS[idx];
  }, []);

  const showXpCelebration = (amount: number) => {
    setTotalXpEarned(prev => prev + amount);
    setXpPulse(true);
    setTimeout(() => setXpPulse(false), 1200);
  };

  const handleStep1 = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // Save class/school to profile bio
      const profileUpdate: Record<string, unknown> = {};
      if (classVal || schoolVal) {
        profileUpdate.bio = [classVal && `Class: ${classVal}`, schoolVal && `School: ${schoolVal}`].filter(Boolean).join(' | ');
      }
      if (Object.keys(profileUpdate).length > 0) {
        await supabase.from('profiles').update(profileUpdate).eq('user_id', user.id);
      }
      await awardXp('case_open', 'onboarding_profile');
      showXpCelebration(5);
      setTimeout(() => setStep(1), 800);
    } finally {
      setSaving(false);
    }
  };

  const handleStep2 = async () => {
    await awardXp('dict_view_term', randomTerm.term);
    showXpCelebration(5);
    setTimeout(() => setStep(2), 800);
  };

  const handleStep3 = async () => {
    await awardXp('case_open', 'onboarding_journey');
    showXpCelebration(10);
    setTimeout(() => setStep(3), 800);
  };

  const handleFinish = async () => {
    if (!user) return;
    await supabase.from('profiles').update({ onboarding_completed: true } as any).eq('user_id', user.id);
    onComplete();
  };

  const stepIcons = [
    <Sparkles key="s" className="h-6 w-6" />,
    <BookOpen key="b" className="h-6 w-6" />,
    <Rocket key="r" className="h-6 w-6" />,
  ];

  const stepIndicator = (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={`h-2.5 rounded-full transition-all duration-500 ${
            i < step ? 'w-2.5 bg-primary' :
            i === step ? 'w-8 bg-primary' :
            'w-2.5 bg-muted'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md mx-4 rounded-2xl border border-border bg-card p-8 shadow-2xl animate-scale-in">
        {/* XP celebration */}
        {xpPulse && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 animate-fade-in">
            <div className="flex items-center gap-1.5 rounded-full bg-sim-warning px-4 py-1.5 text-sm font-bold text-white shadow-lg animate-bounce">
              <Star className="h-4 w-4" />
              +{totalXpEarned > 5 && step === 2 ? 10 : 5} XP
            </div>
          </div>
        )}

        {step < 3 && (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-display font-bold text-foreground">
                {step === 0 ? t.welcomeTitle : step === 1 ? t.onboardingStep2Title : t.onboardingStep3Title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {step === 0 ? t.welcomeSubtitle : ''}
              </p>
            </div>

            {stepIndicator}

            {/* Step content */}
            {step === 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                  {stepIcons[0]}
                  <div>
                    <p className="font-semibold text-sm text-foreground">{t.onboardingStep1Title}</p>
                    <p className="text-xs text-muted-foreground">{t.onboardingStep1Desc}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">{t.onboardingStep1Class}</label>
                  <Input
                    value={classVal}
                    onChange={e => setClassVal(e.target.value)}
                    placeholder={t.onboardingStep1ClassPlaceholder}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">{t.onboardingStep1School}</label>
                  <Input
                    value={schoolVal}
                    onChange={e => setSchoolVal(e.target.value)}
                    placeholder={t.onboardingStep1SchoolPlaceholder}
                  />
                </div>
                <Button className="w-full" onClick={handleStep1} disabled={saving}>
                  {t.onboardingStep1Btn} <span className="ml-1 text-xs opacity-80">+5 XP</span>
                </Button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                  {stepIcons[1]}
                  <p className="text-sm text-muted-foreground">{t.onboardingStep2Desc}</p>
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                  <h3 className="font-bold text-foreground text-lg">
                    {lang === 'bg' ? randomTerm.termBg : randomTerm.term}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {lang === 'bg' ? randomTerm.definitionBg : randomTerm.definition}
                  </p>
                  {randomTerm.example && (
                    <p className="text-xs text-muted-foreground mt-2 italic border-t border-border pt-2">
                      {randomTerm.example}
                    </p>
                  )}
                </div>
                <Button className="w-full" onClick={handleStep2}>
                  {t.onboardingStep2Btn} <span className="ml-1 text-xs opacity-80">+5 XP</span>
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                  {stepIcons[2]}
                  <p className="font-semibold text-sm text-foreground">{t.onboardingStep3Title}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.onboardingStep3Desc}
                </p>
                <Button className="w-full" onClick={handleStep3}>
                  {t.onboardingStep3Btn} <span className="ml-1 text-xs opacity-80">+10 XP</span>
                </Button>
              </div>
            )}
          </>
        )}

        {/* Completion */}
        {step === 3 && (
          <div className="text-center space-y-4 animate-scale-in">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="h-8 w-8 text-primary animate-bounce" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground">{t.onboardingComplete}</h2>
            <p className="text-sm text-muted-foreground">{t.onboardingCompleteDesc}</p>
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-sim-warning">
              <Star className="h-6 w-6" /> 20 XP
            </div>
            <Button className="w-full" onClick={handleFinish}>
              {t.onboardingGoToDashboard}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
