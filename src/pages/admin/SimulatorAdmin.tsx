import { useSimulator } from '@/context/SimulatorContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import AppHeader from '@/components/layout/AppHeader';
import { ArrowLeft, Users, BarChart3, CheckCircle2, Clock } from 'lucide-react';

export default function SimulatorAdmin() {
  const { seasons, teams, submissions, simulatorMode, setSimulatorMode } = useSimulator();
  const { isAdmin } = useAuth();
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">{t('Admin access required', 'Необходим е администраторски достъп')}</p>
            <Button onClick={() => navigate('/dashboard')}>{t('Back to Dashboard', 'Към таблото')}</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto px-4 py-8 space-y-8 max-w-5xl">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            {t('Simulator Admin', 'Администрация на симулатора')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('Manage seasons, teams, and results', 'Управление на сезони, екипи и резултати')}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold text-foreground mb-3">
            {t('Simulator Mode', 'Режим на симулатора')}
          </h2>
          <div className="flex items-center gap-3">
            <Label htmlFor="mode-toggle" className="text-sm text-muted-foreground">
              {t('Individual', 'Индивидуален')}
            </Label>
            <Switch
              id="mode-toggle"
              checked={simulatorMode === 'team'}
              onCheckedChange={(checked) => setSimulatorMode(checked ? 'team' : 'individual')}
            />
            <Label htmlFor="mode-toggle" className="text-sm text-muted-foreground">
              {t('Team', 'Екипен')}
            </Label>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {simulatorMode === 'individual'
              ? t('Students run the simulator individually. No team creation required.', 'Учениците работят индивидуално. Не е необходимо създаване на екип.')
              : t('Students must create or join a team before starting the simulator.', 'Учениците трябва да създадат или да се присъединят към екип преди да започнат симулатора.')}
          </p>
        </div>

        {/* Seasons */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {t('Simulation Seasons', 'Сезони на симулацията')}
          </h2>
          <div className="space-y-4">
            {seasons.map(season => {
              const seasonTeams = teams.filter(t => t.season_id === season.id);
              const totalSubmissions = submissions.filter(s =>
                seasonTeams.some(t => t.id === s.team_id) && !s.is_draft
              ).length;

              return (
                <Link
                  key={season.id}
                  to={`/admin/simulator/season/${season.id}`}
                  className="block rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{season.theme}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{season.description}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
                      {season.difficulty}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      {seasonTeams.length} {t('teams', 'екипи')}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      {totalSubmissions} {t('submissions', 'предавания')}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {season.weeks} {t('weeks', 'седмици')}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Teams Overview */}
        {teams.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {t('All Teams', 'Всички екипи')}
            </h2>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('Team', 'Екип')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('Season', 'Сезон')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('Members', 'Членове')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('Rounds Done', 'Завършени рундове')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('Join Code', 'Код за присъединяване')}</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map(team => {
                    const season = seasons.find(s => s.id === team.season_id);
                    const roundsDone = submissions.filter(s => s.team_id === team.id && !s.is_draft).length;
                    return (
                      <tr key={team.id} className="border-t border-border">
                        <td className="px-4 py-3 text-sm font-medium text-foreground">{team.name}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{season?.theme || '—'}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{team.members.length}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{roundsDone}/{season?.weeks || 0}</td>
                        <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{team.join_code}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
