import { BookOpen, Search, Briefcase, Palette, TrendingUp, Presentation, CheckCircle2 } from 'lucide-react';

const WEEKS = [
  { week: 1, icon: BookOpen, en: 'Digital Innovation Basics', bg: 'Основи на дигиталните иновации' },
  { week: 2, icon: Search, en: 'Industry Analysis', bg: 'Анализ на индустрията' },
  { week: 3, icon: Briefcase, en: 'Business Model', bg: 'Бизнес модел' },
  { week: 4, icon: Palette, en: 'Product Design', bg: 'Дизайн на продукт' },
  { week: 5, icon: TrendingUp, en: 'Growth Strategy', bg: 'Стратегия за растеж' },
  { week: 6, icon: Presentation, en: 'Startup Pitch', bg: 'Стартъп представяне' },
];

interface CourseTimelineProps {
  lang: 'en' | 'bg';
  currentWeek: number; // 1-6, which week the student is on
}

export default function CourseTimeline({ lang, currentWeek }: CourseTimelineProps) {
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-lg font-display font-semibold text-foreground mb-4">
        {t('Course Journey', 'Учебно пътешествие')}
      </h2>
      <div className="relative">
        {/* Connecting line */}
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
                    {t('Week', 'Седмица')} {w.week}
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
