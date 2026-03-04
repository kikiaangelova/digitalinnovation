import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLang } from '@/context/LangContext';
import { useSimulator } from '@/context/SimulatorContext';
import KPIDashboard from '@/components/simulator/KPIDashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Lock, Clock, Users, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function SeasonView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const { seasons, getTeamForSeason, getLatestCompanyState, getSubmission } = useSimulator();

  const season = seasons.find(s => s.id === id);
  if (!season) return <div className="p-8 text-center text-muted-foreground">{t('Season not found', 'Сезонът не е намерен')}</div>;

  const team = getTeamForSeason(season.id);
  const latestState = team ? getLatestCompanyState(team.id) : null;

  const copyCode = () => {
    if (team) {
      navigator.clipboard.writeText(team.join_code);
      toast.success(t('Join code copied!', 'Кодът е копиран!'));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/simulator')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{season.theme}</h1>
            <p className="text-sm text-muted-foreground">
              {season.weeks} {t('weeks', 'седмици')} · {season.difficulty === 'easy' ? t('Easy', 'Лесно') : season.difficulty === 'medium' ? t('Medium', 'Средно') : t('Hard', 'Трудно')}
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Team Info */}
        {team && (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">{team.name}</h3>
                  <p className="text-sm text-muted-foreground">{team.members.map(m => m.user_name).join(', ')}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={copyCode}>
                <Copy className="h-3.5 w-3.5 mr-1" />
                {team.join_code}
              </Button>
            </div>
          </div>
        )}

        {/* Current KPIs */}
        {latestState && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t('Current Company Metrics', 'Текущи показатели на компанията')}</h2>
            <KPIDashboard kpis={latestState.kpis} />
          </div>
        )}

        {/* Rounds */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">{t('Weekly Rounds', 'Седмични рундове')}</h2>
          <div className="space-y-3">
            {season.rounds.map((round, idx) => {
              const isSubmitted = team ? !!getSubmission(team.id, round.id) : false;
              const prevSubmitted = idx === 0 || (team ? !!getSubmission(team.id, season.rounds[idx - 1].id) : false);
              const isUnlocked = idx === 0 || prevSubmitted;

              return (
                <div
                  key={round.id}
                  className={`rounded-xl border p-4 transition-all ${
                    isUnlocked
                      ? 'border-border bg-card hover:shadow-md cursor-pointer'
                      : 'border-border/50 bg-muted/50 opacity-60'
                  }`}
                  onClick={() => isUnlocked && team && navigate(`/simulator/season/${season.id}/round/${round.week_number}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      isSubmitted ? 'bg-sim-success/10' : isUnlocked ? 'sim-gradient' : 'bg-muted'
                    }`}>
                      {isSubmitted ? (
                        <Check className="h-5 w-5 text-sim-success" />
                      ) : isUnlocked ? (
                        <Clock className="h-5 w-5 text-primary-foreground" />
                      ) : (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground">
                        {t('Week', 'Седмица')} {round.week_number}
                        {round.shock_event && <span className="ml-2 text-sim-warning">⚡ {t('Shock Event', 'Шоково събитие')}</span>}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">{round.narrative.substring(0, 100)}...</p>
                    </div>
                    <div className="text-right text-sm">
                      {isSubmitted && <span className="text-sim-success font-medium">{t('Completed', 'Завършен')}</span>}
                      {!isSubmitted && isUnlocked && <span className="text-primary font-medium">{t('Ready', 'Готов')}</span>}
                      {!isUnlocked && <span className="text-muted-foreground">{t('Locked', 'Заключен')}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
