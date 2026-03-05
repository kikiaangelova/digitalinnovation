import { BookOpen, Search, Lightbulb, Palette, TrendingUp, Presentation, CheckCircle2 } from 'lucide-react';

const WEEKS = [
  { week: 1, icon: BookOpen, en: 'Discover the Problem', bg: 'Открий проблема' },
  { week: 2, icon: Search, en: 'Analyze the Market', bg: 'Анализирай пазара' },
  { week: 3, icon: Lightbulb, en: 'Design the Solution', bg: 'Проектирай решението' },
  { week: 4, icon: Palette, en: 'Build the Startup', bg: 'Изгради стартъпа' },
  { week: 5, icon: TrendingUp, en: 'Test in Simulator', bg: 'Тествай в симулатора' },
  { week: 6, icon: Presentation, en: 'Pitch the Startup', bg: 'Представи стартъпа' },
];

interface CourseTimelineProps {
  lang: 'en' | 'bg';
  currentWeek: number;
}

export default function CourseTimeline({ lang, currentWeek }: CourseTimelineProps) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-lg font-display font-semibold text-foreground mb-4">
        {t('Innovation Journey', 'Иновационно пътешествие')}
      </h2>
      <div className="relative">
        <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-border" />
        <div className="space-y-3">
          {WEEKS.map(w => {
            const Icon = w.icon;
            const isDone = w.week < currentWeek;
            const isCurrent = w.week === currentWeek;

            return (
              <div key={w.week} className={`flex items-center gap-4 p-3 rounded-lg relative transition-colors ${isCurrent ? 'bg-accent' : ''}`}>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full z-10 ${isDone ? 'bg-sim-success text-primary-foreground' : isCurrent ? 'sim-gradient text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <div>
                  <p className={`text-xs font-medium ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                    {t('Step', 'Стъпка')} {w.week}
                  </p>
                  <p className={`text-sm font-medium ${isDone || isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {lang === 'bg' ? w.bg : w.en}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
