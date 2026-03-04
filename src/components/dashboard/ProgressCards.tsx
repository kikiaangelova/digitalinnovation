import { Link } from 'react-router-dom';
import { BookOpen, Rocket, BarChart3, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProgressCardsProps {
  lang: 'en' | 'bg';
  casesCompleted: number;
  casesTotal: number;
  startupProgress: number;
  startupSubmitted: boolean;
  simulatorWeek: number;
  simulatorComplete: boolean;
  nextCaseTitle?: string;
  nextCaseDifficulty?: string;
  nextCaseMinutes?: number;
  nextCaseId?: string;
}

export default function ProgressCards({
  lang, casesCompleted, casesTotal, startupProgress, startupSubmitted,
  simulatorWeek, simulatorComplete, nextCaseTitle, nextCaseDifficulty, nextCaseMinutes, nextCaseId,
}: ProgressCardsProps) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const casePct = casesTotal > 0 ? Math.round((casesCompleted / casesTotal) * 100) : 0;
  const simPct = Math.round((simulatorWeek / 6) * 100);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Cases */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
            <BookOpen className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">{t('Case Studies', 'Бизнес казуси')}</h3>
            <p className="text-xs text-muted-foreground">{casesCompleted} / {casesTotal} {t('completed', 'завършени')}</p>
          </div>
        </div>
        <Progress value={casePct} className="h-2 mb-3" />
        {nextCaseId && (
          <div className="mt-auto pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">{t('Next case', 'Следващ казус')}</p>
            <p className="text-sm font-medium text-foreground truncate mb-2">{nextCaseTitle}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              {nextCaseDifficulty && <Badge variant="outline" className="text-xs capitalize">{nextCaseDifficulty}</Badge>}
              {nextCaseMinutes && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{nextCaseMinutes} min</span>}
            </div>
            <Button asChild size="sm" variant="outline" className="w-full">
              <Link to={`/case/${nextCaseId}`}>{t('Start Case Study', 'Започни казус')} <ArrowRight className="h-3 w-3" /></Link>
            </Button>
          </div>
        )}
      </div>

      {/* Startup */}
      <Link to="/my-startup" className="rounded-xl border border-border bg-card p-5 flex flex-col hover:border-primary/40 transition-colors group">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg sim-gradient">
            <Rocket className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">{t('Startup Project', 'Стартъп проект')}</h3>
            <p className="text-xs text-muted-foreground">{startupProgress}% {t('complete', 'завършен')}</p>
          </div>
          {startupSubmitted && (
            <Badge className="ml-auto bg-sim-success/10 text-sim-success border-0 text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" /> {t('Submitted', 'Подаден')}
            </Badge>
          )}
        </div>
        <Progress value={startupProgress} className="h-2 mb-3" />
        <div className="mt-auto pt-3 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          {t('Continue Startup Project', 'Продължи стартъп проекта')} <ArrowRight className="h-4 w-4" />
        </div>
      </Link>

      {/* Simulator */}
      <Link to="/simulator" className="rounded-xl border border-border bg-card p-5 flex flex-col hover:border-primary/40 transition-colors group">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-strategist">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">{t('Simulator', 'Симулатор')}</h3>
            <p className="text-xs text-muted-foreground">
              {simulatorComplete
                ? t('Completed', 'Завършен')
                : `${t('Week', 'Седмица')} ${simulatorWeek} / 6`}
            </p>
          </div>
          {simulatorComplete && (
            <Badge className="ml-auto bg-sim-success/10 text-sim-success border-0 text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" /> {t('Done', 'Готово')}
            </Badge>
          )}
        </div>
        <Progress value={simPct} className="h-2 mb-3" />
        <div className="mt-auto pt-3 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          {t('Continue Simulator', 'Продължи симулатора')} <ArrowRight className="h-4 w-4" />
        </div>
      </Link>
    </div>
  );
}
