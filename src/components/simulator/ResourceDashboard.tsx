import { Resources } from '@/types/simulator';
import { Wallet, Users, Clock, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Props {
  resources: Resources;
  previousResources?: Resources;
  lang?: string;
}

export default function ResourceDashboard({ resources, previousResources, lang = 'en' }: Props) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const items = [
    {
      key: 'money',
      icon: Wallet,
      label: t('Budget', 'Бюджет'),
      value: `€${resources.money.toLocaleString()}`,
      current: resources.money,
      max: 15000,
      prev: previousResources?.money,
      critical: resources.money < 2000,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-600',
    },
    {
      key: 'team',
      icon: Users,
      label: t('Team', 'Екип'),
      value: `${resources.team} ${t('people', 'души')}`,
      current: resources.team,
      max: 10,
      prev: previousResources?.team,
      critical: resources.team <= 1,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-600',
    },
    {
      key: 'runway',
      icon: Clock,
      label: t('Runway', 'Резерв'),
      value: `${resources.runway} ${t('months', 'месеца')}`,
      current: resources.runway,
      max: 6,
      prev: previousResources?.runway,
      critical: resources.runway <= 1,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map(item => {
        const delta = item.prev !== undefined ? item.current - item.prev : undefined;
        const pct = Math.min(100, (item.current / item.max) * 100);
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            className={`rounded-xl border-2 p-4 transition-all ${
              item.critical
                ? 'border-destructive/50 bg-destructive/5 animate-pulse'
                : 'border-border bg-card'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.bgColor}`}>
                <Icon className={`h-4 w-4 ${item.textColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
                <p className={`text-lg font-bold ${item.critical ? 'text-destructive' : 'text-foreground'}`}>
                  {item.value}
                </p>
              </div>
              {item.critical && (
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
              )}
            </div>

            <Progress value={pct} className="h-2" />

            {delta !== undefined && delta !== 0 && (
              <p className={`text-xs mt-1.5 font-semibold ${delta > 0 ? 'text-sim-success' : 'text-destructive'}`}>
                {delta > 0 ? '+' : ''}{item.key === 'money' ? `€${delta.toLocaleString()}` : delta}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}