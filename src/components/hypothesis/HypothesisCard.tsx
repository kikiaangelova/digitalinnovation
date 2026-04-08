import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Lightbulb, CheckCircle2, XCircle, ArrowRight, FlaskConical } from 'lucide-react';
import { awardXp } from '@/lib/xp';

interface HypothesisCardProps {
  contextType: 'simulator' | 'case' | 'startup';
  contextId: string;
  /** Show the outcome panel after decision results are revealed */
  showOutcome?: boolean;
  /** Was the hypothesis validated? null = not yet revealed */
  wasValidated?: boolean | null;
  /** Explanation of why it was validated/refuted */
  validationNote?: string;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Custom label */
  label?: string;
  /** Called after saving */
  onSaved?: (hypothesisText: string) => void;
  /** If true, hide the skip button */
  hideSkip?: boolean;
  /** Show a link instead of validation (for startup) */
  linkTo?: string;
  linkLabel?: string;
}

export default function HypothesisCard({
  contextType, contextId, showOutcome, wasValidated, validationNote,
  placeholder, label, onSaved, hideSkip, linkTo, linkLabel,
}: HypothesisCardProps) {
  const { user } = useAuth();
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [existingHypothesis, setExistingHypothesis] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    (supabase as any).from('hypotheses')
      .select('hypothesis_text')
      .eq('user_id', user.id)
      .eq('context_type', contextType)
      .eq('context_id', contextId)
      .maybeSingle()
      .then(({ data }: any) => {
        if (data) {
          setExistingHypothesis(data.hypothesis_text);
          setText(data.hypothesis_text);
          setSaved(true);
        }
        setLoading(false);
      });
  }, [user, contextType, contextId]);

  const handleSave = async () => {
    if (!user || text.trim().length < 10) {
      toast.error(t('Write at least 10 characters', 'Напиши поне 10 знака'));
      return;
    }
    const payload = {
      user_id: user.id,
      context_type: contextType,
      context_id: contextId,
      hypothesis_text: text.trim(),
    };
    if (existingHypothesis) {
      await (supabase as any).from('hypotheses')
        .update({ hypothesis_text: text.trim() })
        .eq('user_id', user.id)
        .eq('context_type', contextType)
        .eq('context_id', contextId);
    } else {
      await (supabase as any).from('hypotheses').insert(payload);
      // Award +2 XP for first hypothesis in this context
      await awardXp('hypothesis_saved', contextId);
      toast.success(t('+2 XP for your hypothesis!', '+2 XP за хипотезата ти!'));
    }
    setSaved(true);
    setExistingHypothesis(text.trim());
    onSaved?.(text.trim());
  };

  if (loading) return null;
  if (skipped && !showOutcome) return null;

  // Show outcome panel after results are revealed
  if (showOutcome && existingHypothesis) {
    return (
      <Card className="border-2 border-primary/20 bg-primary/5 p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FlaskConical className="h-4 w-4 text-primary" />
          {t('Your Hypothesis', 'Твоята хипотеза')}
        </div>
        <p className="text-sm text-muted-foreground italic">"{existingHypothesis}"</p>
        {wasValidated !== null && wasValidated !== undefined && (
          <div className={`rounded-lg p-4 ${wasValidated ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800'}`}>
            <div className="flex items-center gap-2 mb-1">
              {wasValidated ? (
                <><CheckCircle2 className="h-4 w-4 text-green-600" /><span className="text-sm font-bold text-green-700 dark:text-green-400">{t('VALIDATED', 'ПОТВЪРДЕНА')} ✅</span></>
              ) : (
                <><XCircle className="h-4 w-4 text-red-600" /><span className="text-sm font-bold text-red-700 dark:text-red-400">{t('REFUTED', 'ОПРОВЕРГАНА')} ❌</span></>
              )}
            </div>
            {validationNote && <p className="text-sm text-foreground/80">{validationNote}</p>}
          </div>
        )}
      </Card>
    );
  }

  // Already saved — show compact version
  if (saved && !showOutcome) {
    return (
      <Card className="border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2 text-sm">
          <FlaskConical className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">{t('Your hypothesis', 'Твоята хипотеза')}:</span>
          <span className="text-muted-foreground italic flex-1 truncate">"{existingHypothesis}"</span>
          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
        </div>
      </Card>
    );
  }

  // Input card
  return (
    <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-amber-500" />
        <h4 className="text-sm font-bold text-foreground">
          {label || t('Your Hypothesis', 'Твоята хипотеза')}
        </h4>
        <span className="text-xs text-primary font-medium ml-auto">+2 XP</span>
      </div>
      <p className="text-sm text-muted-foreground">
        {t('Before you decide, write what you believe:', 'Преди да решиш, запиши какво вярваш:')}
      </p>
      <Textarea
        value={text}
        onChange={e => setText(e.target.value.slice(0, 140))}
        placeholder={placeholder || t('"I believe ___ because ___"', '"Вярвам, че ___ защото ___"')}
        className="min-h-[70px] bg-background"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{text.length}/140</span>
        <div className="flex gap-2">
          {!hideSkip && (
            <Button variant="ghost" size="sm" onClick={() => setSkipped(true)}>
              {t('Skip', 'Пропусни')}
            </Button>
          )}
          <Button size="sm" onClick={handleSave} disabled={text.trim().length < 10}>
            {t('Save hypothesis & continue', 'Запази хипотезата и продължи')}
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </div>
      {linkTo && (
        <a href={linkTo} className="text-xs text-primary hover:underline flex items-center gap-1">
          {linkLabel || t('Test this hypothesis in the simulator →', 'Тествай тази хипотеза в симулатора →')}
        </a>
      )}
    </Card>
  );
}
