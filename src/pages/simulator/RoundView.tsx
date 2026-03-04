import { useParams, useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { useSimulator } from '@/context/SimulatorContext';
import KPIDashboard from '@/components/simulator/KPIDashboard';
import NarrativeBriefing from '@/components/simulator/NarrativeBriefing';
import DecisionForm from '@/components/simulator/DecisionForm';
import OutcomeReportView from '@/components/simulator/OutcomeReportView';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export default function RoundView() {
  const { id, n } = useParams<{ id: string; n: string }>();
  const navigate = useNavigate();
  const {
    seasons, getTeamForSeason, getLatestCompanyState, getCompanyState,
    getSubmission, getOutcomeReport, saveDraft, submitDecisions,
    draftAnswers, draftRationales, draftReflections, getCompanyStateHistory,
  } = useSimulator();

  const weekNumber = parseInt(n || '1');
  const season = seasons.find(s => s.id === id);
  const round = season?.rounds.find(r => r.week_number === weekNumber);
  const team = season ? getTeamForSeason(season.id) : null;

  const previousState = useMemo(() => {
    if (!team) return null;
    const history = getCompanyStateHistory(team.id);
    // Get state from previous round or initial state
    const prevWeek = history.filter(s => s.week_number < weekNumber);
    return prevWeek.length > 0 ? prevWeek[prevWeek.length - 1] : null;
  }, [team, weekNumber, getCompanyStateHistory]);

  const currentState = useMemo(() => {
    if (!team || !round) return null;
    // After submission, get the state for this round
    const state = getCompanyState(team.id, round.id);
    return state || previousState;
  }, [team, round, getCompanyState, previousState]);

  const submission = team && round ? getSubmission(team.id, round.id) : null;
  const outcomeReport = team && round ? getOutcomeReport(team.id, round.id) : null;
  const isSubmitted = !!submission;

  const draftKey = team && round ? `${team.id}-${round.id}` : '';

  const handleSaveDraft = useCallback((answers: any[], rationale: string, reflection: string) => {
    if (!round || !team) return;
    saveDraft(round.id, team.id, answers, rationale, reflection);
  }, [round, team, saveDraft]);

  const handleSubmit = useCallback(() => {
    if (!round || !team) return;
    const report = submitDecisions(round.id, team.id);
    if (report) {
      toast.success('Decisions submitted! View your outcome report below.');
    }
  }, [round, team, submitDecisions]);

  if (!season || !round) {
    return <div className="p-8 text-center text-muted-foreground">Round not found</div>;
  }

  const hasPrev = weekNumber > 1;
  const hasNext = weekNumber < season.weeks;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/simulator/season/${id}`)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-base font-bold text-foreground">Week {weekNumber} of {season.weeks}</h1>
              <p className="text-xs text-muted-foreground">{season.theme}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasPrev && (
              <Button variant="outline" size="sm" onClick={() => navigate(`/simulator/season/${id}/round/${weekNumber - 1}`)}>
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
            )}
            {hasNext && isSubmitted && (
              <Button variant="outline" size="sm" onClick={() => navigate(`/simulator/season/${id}/round/${weekNumber + 1}`)}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl space-y-8">
        {/* Narrative */}
        <NarrativeBriefing
          narrative={round.narrative}
          weekNumber={round.week_number}
          shockEvent={round.shock_event}
        />

        {/* KPI Dashboard */}
        {currentState && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              {isSubmitted ? 'Updated Metrics' : 'Current Metrics'}
            </h2>
            <KPIDashboard
              kpis={isSubmitted && outcomeReport ? (getCompanyState(team!.id, round.id)?.kpis || currentState.kpis) : currentState.kpis}
              previousKpis={previousState?.kpis}
            />
          </div>
        )}

        {/* Outcome Report (if submitted) */}
        {isSubmitted && outcomeReport && (
          <OutcomeReportView report={outcomeReport} />
        )}

        {/* Decision Form */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            {isSubmitted ? 'Your Decisions (Submitted)' : 'Make Your Decisions'}
          </h2>
          <DecisionForm
            decisions={round.decisions}
            initialAnswers={isSubmitted ? submission?.answers : draftAnswers[draftKey]}
            rationale={isSubmitted ? submission?.rationale : draftRationales[draftKey]}
            reflection={isSubmitted ? submission?.reflection : draftReflections[draftKey]}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
            isSubmitted={isSubmitted}
          />
        </div>
      </main>
    </div>
  );
}
