import { useSimulator } from '@/context/SimulatorContext';
import { useLang } from '@/context/LangContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, Users, BarChart3, Settings, ArrowRight } from 'lucide-react';

export default function StudentLanding() {
  const { seasons, getTeamForSeason, currentUser, switchRole } = useSimulator();
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg sim-gradient">
              <Play className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">DigiInnov {t('Simulator', 'Симулатор')}</h1>
              <p className="text-xs text-muted-foreground">Digital Innovation Case Lab</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {currentUser.name} · <span className="capitalize">{currentUser.role === 'student' ? t('Student', 'Ученик') : t('Admin', 'Админ')}</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => switchRole(currentUser.role === 'student' ? 'admin' : 'student')}
            >
              {t('Switch to', 'Превключи към')} {currentUser.role === 'student' ? t('Admin', 'Админ') : t('Student', 'Ученик')}
            </Button>
            {currentUser.role === 'admin' && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/simulator">
                  <Settings className="h-4 w-4 mr-1" />
                  {t('Admin', 'Админ')}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">{t('Your Simulations', 'Вашите симулации')}</h2>
          <p className="mt-1 text-muted-foreground">{t('Run a virtual startup and make strategic decisions that shape your company\'s future.', 'Управлявайте виртуален стартъп и вземайте стратегически решения, които оформят бъдещето на компанията ви.')}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {seasons.map(season => {
            const team = getTeamForSeason(season.id);
            return (
              <Link
                key={season.id}
                to={`/simulator/season/${season.id}`}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/40"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl sim-gradient">
                    <BarChart3 className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {season.weeks} {t('weeks', 'седмици')}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {season.theme}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{season.description}</p>

                <div className="mt-4 flex items-center justify-between">
                  {team ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{team.name} · {team.members.length} {t('members', 'члена')}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">{t('No team yet', 'Все още няма екип')}</span>
                  )}
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>

                <div className="mt-3 flex gap-2">
                  <span className="rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground capitalize">{season.difficulty}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
