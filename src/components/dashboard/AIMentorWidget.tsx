import { useState } from 'react';
import { Brain, Send, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface AIMentorWidgetProps {
  lang: 'en' | 'bg';
  startupData?: Record<string, string> | null;
  onFeedbackReceived?: () => void;
}

export default function AIMentorWidget({ lang, startupData, onFeedbackReceived }: AIMentorWidgetProps) {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [cached, setCached] = useState(false);
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const requestFeedback = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-feedback', {
        body: {
          type: 'startup_project',
          data: startupData || {},
          lang,
        },
      });
      if (error) throw error;
      if (data?.rateLimited) {
        toast.error(data.error);
        return;
      }
      setFeedback(data?.feedback || t('No feedback available.', 'Няма налична обратна връзка.'));
      if (data?.remaining !== undefined) setRemaining(data.remaining);
      setCached(!!data?.cached);
      onFeedbackReceived?.();
    } catch (e: any) {
      if (e?.status === 429) {
        toast.error(t('Daily limit reached. Try again tomorrow.', 'Дневният лимит е достигнат. Опитайте утре.'));
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
        <div className="flex-1">
          <h2 className="text-lg font-display font-semibold text-foreground">{t('AI Mentor', 'AI Ментор')}</h2>
          <p className="text-xs text-muted-foreground">{t('Get personalized feedback on your startup', 'Получи персонална обратна връзка за твоя стартъп')}</p>
        </div>
        {remaining !== null && (
          <Badge variant="outline" className="text-xs">
            {remaining} {t('left today', 'остават днес')}
          </Badge>
        )}
      </div>

      {feedback ? (
        <div className="rounded-lg bg-accent/50 p-4 mb-3 text-sm text-foreground leading-relaxed prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>{feedback}</ReactMarkdown>
          {cached && (
            <p className="text-xs text-muted-foreground mt-2 italic">
              {t('📋 Cached response (no AI credits used)', '📋 Кеширан отговор (без използване на AI кредити)')}
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-lg bg-muted/50 p-4 mb-3 text-sm text-muted-foreground italic">
          {t(
            '"Your startup idea looks promising. Click below to get personalized feedback from the AI Mentor."',
            '"Твоята стартъп идея изглежда обещаваща. Натисни по-долу за персонална обратна връзка от AI Ментора."'
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={requestFeedback} disabled={loading} size="sm" className="sim-gradient border-0">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
          {feedback
            ? t('Refresh Feedback', 'Обнови обратната връзка')
            : t('Get AI Feedback', 'Получи AI обратна връзка')
          }
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {t('Limited to 3 uses per day. Asking the same question returns the same answer.', 'До 3 въпроса на ден. Ако питаш едно и също, получаваш същия отговор.')}
      </p>
    </div>
  );
}
