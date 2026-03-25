import { useSimulator } from '@/context/SimulatorContext';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AppHeader from '@/components/layout/AppHeader';
import { BarChart3, ArrowRight, Rocket, Target, TrendingUp, Lightbulb } from 'lucide-react';

export default function StudentLanding() {
  const { seasons, hasIndividualRun, startIndividualRun } = useSimulator();
  const { t } = useLang();
  const navigate = useNavigate();

  const handleStart = (seasonId: string) => {
    startIndividualRun(seasonId);
    navigate(`/simulator/season/${seasonId}`);
  };

  const week1Preview = [
    { icon: Target, text: t.week1DefineMarket },
    { icon: Lightbulb, text: t.week1ChooseStrategy },
    { icon: TrendingUp, text: t.week1SetPriorities },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">{t.yourSimulations}</h2>
          <p className="mt-1 text-muted-foreground">{t.yourSimulationsDesc}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {seasons.map(season => {
            const hasRun = hasIndividualRun(season.id);

            return (
              <div key={season.id} className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/40">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl sim-gradient">
                    <BarChart3 className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {season.weeks} {t.weeks}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{season.theme}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{season.description}</p>

                <div className="mt-3 flex gap-2">
                  <span className="rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground capitalize">{season.difficulty}</span>
                </div>

                {hasRun ? (
                  <Link
                    to={`/simulator/season/${season.id}`}
                    className="mt-5 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                  >
                    {t.continueSimulator}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <div className="mt-5 space-y-3">
                    <p className="text-sm text-muted-foreground">{t.notStartedYet}</p>

                    <div className="rounded-lg border border-border bg-muted/30 p-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">{t.week1PreviewTitle}</p>
                      <ul className="space-y-1.5">
                        {week1Preview.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-foreground">
                            <item.icon className="h-3.5 w-3.5 text-primary shrink-0" />
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full sim-gradient border-0" onClick={() => handleStart(season.id)}>
                      <Rocket className="h-4 w-4 mr-2" />
                      {t.startIndividualSimulator}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
