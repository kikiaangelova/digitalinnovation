import { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLang } from '@/context/LangContext';
import { useSimulator } from '@/context/SimulatorContext';
import KPIDashboard from '@/components/simulator/KPIDashboard';
import SimulatorJourneySummary from '@/components/simulator/SimulatorJourneySummary';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Lock, Clock, Users, Copy, Home } from 'lucide-react';
import { toast } from 'sonner';
import type { KPIs } from '@/types/simulator';
import { KPI_DIRECTIONS } from '@/types/simulator';

export default function SeasonView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const { seasons, getParticipantId, getLatestCompanyState, getSubmission, getOutcomeReport, getCompanyStateHistory, getTeamForSeason, simulatorMode } = useSimulator();

  const season = seasons.find(s => s.id === id);

  const participantId = season ? getParticipantId(season.id) : null;
  const latestState = participantId ? getLatestCompanyState(participantId) : null;
  const team = simulatorMode === 'team' ? getTeamForSeason(season.id) : null;

  const simComplete = participantId
    ? season.rounds.every(r => !!getSubmission(participantId, r.id))
    : false;

  const stateHistory = participantId ? getCompanyStateHistory(participantId) : [];
  const startKpis: KPIs = stateHistory.length > 0
    ? stateHistory[0].kpis
    : (season.rounds[0]?.baseline_kpis || {} as KPIs);
  const finalKpis: KPIs = latestState?.kpis || startKpis;

  const journeySummary = useMemo(() => {
    if (!participantId) return [];
    return season.rounds.map(round => {
      const sub = getSubmission(participantId, round.id);
      const report = getOutcomeReport(participantId, round.id);
      const decisions = (sub?.answers || []).map(a => {
        const tmpl = round.decisions.find(d => d.id === a.decision_template_id);
        const chosen = tmpl?.options.find(o => o.id === a.answer);
        return { title: tmpl?.title || '', chosenOption: chosen?.label || a.answer };
      });
      const changes = report?.kpi_changes || {};
      let topPos = '';
      let topNeg = '';
      let bestDelta = 0;
      let worstDelta = 0;
      Object.entries(changes).forEach(([key, val]) => {
        if (!val) return;
        const dir = KPI_DIRECTIONS[key as keyof KPIs];
        const effective = dir === 'down' ? -val.delta : val.delta;
        if (effective > bestDelta) { bestDelta = effective; topPos = key; }
        if (effective < worstDelta) { worstDelta = effective; topNeg = key; }
      });
      return {
        weekNumber: round.week_number,
        decisions,
        topPositiveKpi: topPos || 'revenue',
        topNegativeKpi: topNeg || 'burn_rate',
      };
    });
  }, [participantId, season.rounds, getSubmission, getOutcomeReport]);

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
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-1" />
              {t('Home', 'Начало')}
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Team Info (only in team mode) */}
        {simulatorMode === 'team' && team && (
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
            <KPIDashboard kpis={latestState.kpis} lang={lang} />
          </div>
        )}

        {/* Rounds */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">{t('Weekly Rounds', 'Седмични рундове')}</h2>
          <div className="space-y-3">
            {season.rounds.map((round, idx) => {
              const isSubmitted = participantId ? !!getSubmission(participantId, round.id) : false;
              const prevSubmitted = idx === 0 || (participantId ? !!getSubmission(participantId, season.rounds[idx - 1].id) : false);
              const isUnlocked = idx === 0 || prevSubmitted;

              return (
                <div
                  key={round.id}
                  className={`rounded-xl border p-4 transition-all ${
                    isUnlocked
                      ? 'border-border bg-card hover:shadow-md hover:border-primary/40 cursor-pointer'
                      : 'border-border/50 bg-muted/50 opacity-60 cursor-not-allowed'
                  }`}
                  onClick={() => isUnlocked && participantId && navigate(`/simulator/season/${season.id}/round/${round.week_number}`)}
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
                      {!isSubmitted && isUnlocked && (
                        <Button size="sm" className="sim-gradient border-0">
                          {t(`Start Week ${round.week_number}`, `Започни седмица ${round.week_number}`)}
                        </Button>
                      )}
                      {!isUnlocked && <span className="text-muted-foreground">{t('Locked', 'Заключено')}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Journey Summary — shown when all rounds are submitted */}
        {simComplete && participantId && (
          <SimulatorJourneySummary
            allWeekAnswers={journeySummary}
            startKpis={startKpis}
            finalKpis={finalKpis}
            lang={lang as 'en' | 'bg'}
          />
        )}
      </main>
    </div>
  );
}
