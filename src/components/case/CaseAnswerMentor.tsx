import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MarkdownContent from '@/components/ui/markdown-content';
import { toast } from 'sonner';
import { Bot, Sparkles, Loader2, PenTool, AlertCircle } from 'lucide-react';

interface Props {
  questionId: string;
  questionPrompt: string;
  questionType: string;
  studentAnswer: string;
  caseTitle: string;
  difficulty: string;
  questionContext?: string;
  lang: 'en' | 'bg';
  disabled?: boolean;
  onImproveClick?: () => void;
}

export default function CaseAnswerMentor({
  questionId, questionPrompt, questionType, studentAnswer,
  caseTitle, difficulty, questionContext, lang, disabled, onImproveClick,
}: Props) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  const minLength = questionType === 'long_answer' ? 20 : 5;
  const canRequest = (studentAnswer || '').trim().length >= minLength && !disabled;

  const requestFeedback = async () => {
    if (!canRequest) return;
    setLoading(true);
    setError(null);
    try {
      const { data: result, error: fnError } = await supabase.functions.invoke('ai-feedback', {
        body: {
          type: 'case_answer',
          data: {
            case_title: caseTitle,
            question_prompt: questionPrompt,
            question_type: questionType,
            student_answer: studentAnswer,
            question_context: questionContext,
            difficulty,
          },
          lang,
        },
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
      if (result.remaining !== undefined) setRemaining(result.remaining);
    } catch (e: any) {
      const msg = e?.message || 'Failed to get feedback';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (questionType === 'multiple_choice') return null;

  return (
    <div className="mt-3 space-y-3">
      {/* Get Feedback button */}
      {!feedback && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={requestFeedback}
            disabled={loading || !canRequest}
            className="gap-1.5 text-xs"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bot className="h-3.5 w-3.5" />}
            {loading
              ? t('Analyzing...', 'Анализиране...')
              : t('Get AI Mentor Feedback', 'Получи обратна връзка от AI ментор')}
          </Button>
          {remaining !== null && (
            <Badge variant="outline" className="text-xs">
              {remaining} {t('left today', 'остават днес')}
            </Badge>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 rounded-lg p-2.5">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Mentor Feedback Card */}
      {feedback && (
        <div className="rounded-lg border-2 border-primary/20 bg-accent/50 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              {t('AI Mentor Feedback', 'Обратна връзка от AI ментор')}
            </span>
            <Sparkles className="h-3.5 w-3.5 text-primary ml-auto" />
          </div>

          <div className="prose prose-sm max-w-none text-foreground/90">
            <MarkdownContent content={feedback} />
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-border">
            {onImproveClick && (
              <Button
                variant="outline"
                size="sm"
                onClick={onImproveClick}
                className="gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/5"
              >
                <PenTool className="h-3.5 w-3.5" />
                {t('Improve My Answer', 'Подобри отговора ми')}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setFeedback(null); setError(null); }}
              className="text-xs text-muted-foreground ml-auto"
            >
              {t('Close', 'Затвори')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
