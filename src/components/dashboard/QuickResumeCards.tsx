import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, BarChart3, Rocket, ArrowRight, Clock, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ResumeItem {
  type: 'case' | 'module' | 'simulator' | 'startup';
  label: string;
  sublabel?: string;
  path: string;
}

interface QuickResumeCardsProps {
  lang: 'en' | 'bg';
  /** Last started but incomplete case */
  lastCaseTitle?: string;
  lastCaseId?: string;
  /** Next incomplete module */
  nextModuleTitle?: string;
  nextModuleSlug?: string;
  /** Simulator in progress */
  simWeek: number;
  simComplete: boolean;
  /** Startup progress */
  startupProgressPct: number;
  startupSubmitted: boolean;
}

export default function QuickResumeCards({
  lang, lastCaseTitle, lastCaseId, nextModuleTitle, nextModuleSlug,
  simWeek, simComplete, startupProgressPct, startupSubmitted,
}: QuickResumeCardsProps) {
  const navigate = useNavigate();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const items: ResumeItem[] = [];

  if (lastCaseId && lastCaseTitle) {
    items.push({
      type: 'case',
      label: lastCaseTitle,
      sublabel: t('Continue case study', 'Продължи казуса'),
      path: `/case/${lastCaseId}`,
    });
  }

  if (nextModuleSlug && nextModuleTitle) {
    items.push({
      type: 'module',
      label: nextModuleTitle,
      sublabel: t('Continue learning', 'Продължи да учиш'),
      path: `/learn/${nextModuleSlug}`,
    });
  }

  if (!simComplete && simWeek > 1) {
    items.push({
      type: 'simulator',
      label: t(`Week ${simWeek} of 6`, `Седмица ${simWeek} от 6`),
      sublabel: t('Resume simulator', 'Продължи симулатора'),
      path: '/simulator',
    });
  }

  if (!startupSubmitted && startupProgressPct > 0) {
    items.push({
      type: 'startup',
      label: `${startupProgressPct}% ${t('complete', 'завършен')}`,
      sublabel: t('Continue startup project', 'Продължи стартъп проекта'),
      path: '/my-startup',
    });
  }

  if (items.length === 0) return null;

  const icons = {
    case: BookOpen,
    module: GraduationCap,
    simulator: BarChart3,
    startup: Rocket,
  };

  const colors = {
    case: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    module: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    simulator: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    startup: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  };

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <PlayCircle className="h-3.5 w-3.5" />
        {t('Pick up where you left off', 'Продължи откъдето спря')}
      </h3>
      <div className={`grid gap-3 ${items.length >= 3 ? 'md:grid-cols-3' : items.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
        {items.slice(0, 3).map((item) => {
          const Icon = icons[item.type];
          return (
            <button
              key={item.type}
              onClick={() => navigate(item.path)}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 text-left hover:border-primary/40 hover:shadow-sm transition-all"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${colors[item.type]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{item.sublabel}</p>
                <p className="text-sm font-medium text-foreground truncate">{item.label}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
