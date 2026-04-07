import { CheckCircle2, Clock, Play, Circle, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type ActivityStatus = 'completed' | 'in_progress' | 'not_started' | 'locked' | 'submitted' | 'reviewed';

interface StatusBadgeProps {
  status: ActivityStatus;
  lang: 'en' | 'bg';
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<ActivityStatus, {
  en: string;
  bg: string;
  icon: React.ElementType;
  className: string;
}> = {
  completed: {
    en: 'Completed',
    bg: 'Завършено',
    icon: CheckCircle2,
    className: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20',
  },
  in_progress: {
    en: 'In Progress',
    bg: 'В процес',
    icon: Play,
    className: 'bg-amber-500/15 text-amber-600 border-amber-500/20',
  },
  not_started: {
    en: 'Not Started',
    bg: 'Незапочнато',
    icon: Circle,
    className: 'bg-muted text-muted-foreground border-border',
  },
  locked: {
    en: 'Locked',
    bg: 'Заключено',
    icon: Lock,
    className: 'bg-muted/50 text-muted-foreground/60 border-border/50',
  },
  submitted: {
    en: 'Submitted',
    bg: 'Подадено',
    icon: CheckCircle2,
    className: 'bg-blue-500/15 text-blue-600 border-blue-500/20',
  },
  reviewed: {
    en: 'Reviewed',
    bg: 'Оценено',
    icon: CheckCircle2,
    className: 'bg-primary/15 text-primary border-primary/20',
  },
};

export function StatusBadge({ status, lang, size = 'sm' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const label = lang === 'bg' ? config.bg : config.en;

  return (
    <Badge
      variant="outline"
      className={`${config.className} border ${size === 'sm' ? 'text-[10px] px-1.5 py-0' : 'text-xs px-2 py-0.5'} font-medium gap-1`}
    >
      <Icon className={size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3'} />
      {label}
    </Badge>
  );
}
