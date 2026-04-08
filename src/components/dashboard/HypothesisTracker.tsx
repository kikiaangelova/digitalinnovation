import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { FlaskConical, CheckCircle2, XCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HypothesisTrackerProps {
  lang: string;
}

export default function HypothesisTracker({ lang }: HypothesisTrackerProps) {
  const { user } = useAuth();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const [validated, setValidated] = useState(0);
  const [failed, setFailed] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!user) return;
    (supabase as any).from('hypotheses')
      .select('was_validated')
      .eq('user_id', user.id)
      .then(({ data }: any) => {
        if (!data) return;
        setTotal(data.length);
        setValidated(data.filter((h: any) => h.was_validated === true).length);
        setFailed(data.filter((h: any) => h.was_validated === false).length);
      });
  }, [user]);

  if (total === 0) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="p-4 border-border hover:border-primary/30 transition-colors cursor-default">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <FlaskConical className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {t('Hypotheses', 'Хипотези')}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-600" /> {validated} {t('validated', 'потвърдени')}
                  </span>
                  <span className="flex items-center gap-1">
                    <XCircle className="h-3 w-3 text-red-500" /> {failed} {t('refuted', 'опровергани')}
                  </span>
                </div>
              </div>
              <span className="text-lg font-bold text-foreground">{total}</span>
            </div>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-xs">
            {t(
              'Good founders learn from refuted hypotheses, not just from validated ones.',
              'Добрите основатели се учат от опровергани хипотези, не само от потвърдените.'
            )}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
