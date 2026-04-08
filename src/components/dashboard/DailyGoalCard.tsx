import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Flame, BarChart3, CheckCircle2 } from 'lucide-react';

interface DailyGoalCardProps {
  lang: 'en' | 'bg';
  simComplete: boolean;
  simWeek: number;
}

/**
 * Visual-only daily goal card.
 * Does NOT modify XP or any data — purely motivational UI.
 */
export default function DailyGoalCard({ lang, simComplete, simWeek }: DailyGoalCardProps) {
  const navigate = useNavigate();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  // If simulator is fully complete, show a congratulatory state
  if (simComplete) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 shrink-0">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">{t('Daily Goal', 'Дневна цел')}</p>
          <p className="text-sm font-medium text-foreground">
            {t('Simulator complete! Try a case study today.', 'Симулаторът е завършен! Опитай казус днес.')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-orange-500/20 bg-orange-500/5 p-3.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 shrink-0">
        <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{t('Daily Goal', 'Дневна цел')}</p>
        <p className="text-sm font-medium text-foreground">
          {t('Run 1 simulation today → +20 XP', 'Направи 1 симулация днес → +20 XP')}
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="shrink-0 gap-1.5 border-orange-500/30 text-orange-700 dark:text-orange-400 hover:bg-orange-500/10"
        onClick={() => navigate('/simulator')}
      >
        <BarChart3 className="h-3.5 w-3.5" />
        {t('Go', 'Старт')}
      </Button>
    </div>
  );
}
