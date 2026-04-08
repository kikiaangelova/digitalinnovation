import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MarkdownContent from '@/components/ui/markdown-content';
import { Bot, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export type FeedbackContext =
  | { type: 'case_submission'; caseTitle: string; totalScore: number; maxScore: number }
  | { type: 'simulator'; currentWeek: number; kpis: Record<string, any>; grade?: string; decisions?: any[] }
  | { type: 'startup_project'; problem: string; customer: string; valueProp: string; businessModel: string; growthStrategy: string; finalPitch: string }
  | { type: 'quiz_result'; moduleTitle: string; quizScore: number; quizMax: number; analyticalAnswer?: string; applicationAnswer?: string };

interface Props {
  context: FeedbackContext;
  lang: 'en' | 'bg';
  autoLoad?: boolean;
  className?: string;
}

export default function StructuredFeedback({ context, lang, autoLoad = false, className = '' }: Props) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      let feedbackType: string;
      let data: Record<string, any>;

      switch (context.type) {
        case 'case_submission':
          feedbackType = 'case_submission';
          data = { case_title: context.caseTitle, total_score: context.totalScore, max_score: context.maxScore };
          break;
        case 'simulator':
          feedbackType = 'simulator';
          data = { current_week: context.currentWeek, kpis: context.kpis, grade: context.grade, decisions: context.decisions };
          break;
        case 'startup_project':
          feedbackType = 'startup_project';
          data = { problem: context.problem, customer: context.customer, value_proposition: context.valueProp, business_model: context.businessModel, growth_strategy: context.growthStrategy, final_pitch: context.finalPitch };
          break;
        case 'quiz_result':
          feedbackType = 'case_submission';
          data = { case_title: context.moduleTitle, total_score: context.quizScore, max_score: context.quizMax };
          break;
      }

      const { data: result, error: fnError } = await supabase.functions.invoke('ai-feedback', {
        body: { type: feedbackType, data, lang },
      });

      if (fnError) throw fnError;
      if (result?.error) {
        if (result.rateLimited) {
          toast.error(result.error);
          return;
        }
        throw new Error(result.error);
      }
      setFeedback(result.feedback);
    } catch (e: any) {
      const msg = e?.message || t('Failed to get feedback', 'Грешка при получаване на обратна връзка');
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Auto-load on mount if requested
  useEffect(() => {
    if (autoLoad) requestFeedback();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`rounded-xl border-2 border-primary/20 bg-card overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 bg-primary/5 border-b border-primary/10">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Bot className="h-4.5 w-4.5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">
            {t('AI Learning Feedback', 'AI обратна връзка за напредъка ти')}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t('Personalized guidance based on your performance', 'Персонализирани насоки на базата на твоите резултати')}
          </p>
        </div>
        <Sparkles className="h-4 w-4 text-primary" />
      </div>

      <div className="p-5">
        {!feedback && !loading && !error && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">
              {t(
                'Get structured feedback on what you did well, what needs improvement, and your recommended next step.',
                'Получете структурирана обратна връзка за силните ви страни, какво трябва да подобрите и препоръчителната следваща стъпка.'
              )}
            </p>
            <Button onClick={requestFeedback} className="gap-2">
              <Bot className="h-4 w-4" />
              {t('Get Feedback', 'Получи обратна връзка')}
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-3 py-8">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">
              {t('Analyzing your work...', 'Анализиране на работата ви...')}
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
            <Button variant="ghost" size="sm" onClick={requestFeedback} className="ml-auto text-xs">
              {t('Retry', 'Опитай отново')}
            </Button>
          </div>
        )}

        {feedback && (
          <div className="prose prose-sm max-w-none text-foreground/90">
            <MarkdownContent content={feedback} />
          </div>
        )}
      </div>
    </div>
  );
}
