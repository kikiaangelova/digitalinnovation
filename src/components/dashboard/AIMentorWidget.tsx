import { useState } from 'react';
import { Brain, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIMentorWidgetProps {
  lang: 'en' | 'bg';
  startupData?: Record<string, string> | null;
  onFeedbackReceived?: () => void;
}

export default function AIMentorWidget({ lang, startupData, onFeedbackReceived }: AIMentorWidgetProps) {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const requestFeedback = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-feedback', {
        body: {
          type: 'startup_project',
          data: startupData || {},
        },
      });
      if (error) throw error;
      setFeedback(data?.feedback || t('No feedback available.', 'Няма налична обратна връзка.'));
      onFeedbackReceived?.();
    } catch (e: any) {
      if (e?.status === 429) {
        toast.error(t('Rate limit reached. Try again later.', 'Достигнат лимит. Опитайте по-късно.'));
      } else if (e?.status === 402) {
        toast.error(t('Credits exhausted.', 'Кредитите са изчерпани.'));
      } else {
        toast.error(t('Failed to get feedback', 'Грешка при получаване на обратна връзка'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-founder">
          <Brain className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground">{t('AI Mentor', 'AI Ментор')}</h2>
          <p className="text-xs text-muted-foreground">{t('Get personalized feedback on your startup', 'Получи персонална обратна връзка')}</p>
        </div>
      </div>

      {feedback ? (
        <div className="rounded-lg bg-accent/50 p-4 mb-3 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {feedback}
        </div>
      ) : (
        <div className="rounded-lg bg-muted/50 p-4 mb-3 text-sm text-muted-foreground italic">
          {t(
            '"Your startup idea looks promising. Click below to get personalized feedback from the AI Mentor."',
            '"Твоята стартъп идея изглежда обещаваща. Натисни по-долу за персонална обратна връзка от AI Ментора."'
          )}
        </div>
      )}

      <Button onClick={requestFeedback} disabled={loading} size="sm" className="sim-gradient border-0 w-full sm:w-auto">
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
        {t('Get AI Feedback', 'Получи AI обратна връзка')}
      </Button>
    </div>
  );
}
