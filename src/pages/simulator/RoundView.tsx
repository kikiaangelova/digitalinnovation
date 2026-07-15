import { useParams, useNavigate } from 'react-router-dom';
import { useCallback, useMemo, useState } from 'react';
import { useLang } from '@/context/LangContext';
import { useSimulator } from '@/context/SimulatorContext';
import { LearningPhaseBar } from '@/components/learning/LearningStructure';
import type { LearningPhase } from '@/components/learning/LearningStructure';
import KPIDashboard from '@/components/simulator/KPIDashboard';
import NarrativeBriefing from '@/components/simulator/NarrativeBriefing';
import DecisionForm from '@/components/simulator/DecisionForm';
import OutcomeReportView from '@/components/simulator/OutcomeReportView';
import TurbulenceMeter from '@/components/simulator/TurbulenceMeter';
import CrisisResponsePanel from '@/components/simulator/CrisisResponsePanel';
import ResourceDashboard from '@/components/simulator/ResourceDashboard';
import GameOverScreen from '@/components/simulator/GameOverScreen';
import StructuredFeedback from '@/components/feedback/StructuredFeedback';
import SkillsImproved from '@/components/learning/SkillsImproved';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronLeft, ChevronRight, Zap, Target, TrendingUp, AlertTriangle, Shield, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { localizeSeason } from '@/lib/localize-season';

export default function RoundView() {
  const { id, n } = useParams<{ id: string; n: string }>();
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const {
    seasons, getParticipantId, getLatestCompanyState, getCompanyState,
    getSubmission, getOutcomeReport, saveDraft, submitDecisions,
    draftAnswers, draftRationales, draftReflections, getCompanyStateHistory,
  } = useSimulator();

  const weekNumber = parseInt(n || '1');
  const rawSeason = seasons.find(s => s.id === id);
  const season = useMemo(
    () => (rawSeason ? localizeSeason(rawSeason, lang) : undefined),
    [rawSeason, lang]
  );
  const round = season?.rounds.find(r => r.week_number === weekNumber);
  const participantId = season ? getParticipantId(season.id) : null;

  const [crisisAnswers, setCrisisAnswers] = useState<Record<string, string>>({});

  const previousState = useMemo(() => {
    if (!participantId) return null;
    const history = getCompanyStateHistory(participantId);
    const prevWeek = history.filter(s => s.week_number < weekNumber);
    return prevWeek.length > 0 ? prevWeek[prevWeek.length - 1] : null;
  }, [participantId, weekNumber, getCompanyStateHistory]);

  const currentState = useMemo(() => {
    if (!participantId || !round) return null;
    const state = getCompanyState(participantId, round.id);
    return state || previousState;
  }, [participantId, round, getCompanyState, previousState]);

  const isInCrisis = (currentState?.turbulence?.stability_score ?? 100) < 30;
  const isGameOver = currentState?.gameStatus === 'lost_money' || currentState?.gameStatus === 'lost_time';
  const isWon = currentState?.gameStatus === 'won';

  const submission = participantId && round ? getSubmission(participantId, round.id) : null;
  const outcomeReport = participantId && round ? getOutcomeReport(participantId, round.id) : null;
  const isSubmitted = !!submission;

  const draftKey = participantId && round ? `${participantId}-${round.id}` : '';

  const handleCrisisDecision = useCallback((decisionId: string, optionId: string) => {
    setCrisisAnswers(prev => ({ ...prev, [decisionId]: optionId }));
  }, []);

  const handleSaveDraft = useCallback((answers: any[], rationale: string, reflection: string) => {
    if (!round || !participantId) return;
    saveDraft(round.id, participantId, answers, rationale, reflection);
  }, [round, participantId, saveDraft]);

  const handleSubmit = useCallback(() => {
    if (!round || !participantId) return;
    const report = submitDecisions(round.id, participantId, crisisAnswers);
    if (report) {
      toast.success(t('Decisions submitted! See the consequences below.', 'Решенията са изпратени! Вижте последствията по-долу.'));
    }
  }, [round, participantId, submitDecisions, t, crisisAnswers]);

  if (!season || !round) {
    return <div className="p-8 text-center text-muted-foreground">{t('Round not found', 'Рундът не е намерен')}</div>;
  }

  const hasPrev = weekNumber > 1;
  const hasNext = weekNumber < season.weeks;

  const currentPhase: LearningPhase = isSubmitted ? 'feedback' : 'practice';
  const completedPhases: LearningPhase[] = ['learn'];
  if (isSubmitted) completedPhases.push('practice');

  // Get the submitted state for this round (to show post-decision resources)
  const submittedState = participantId && round ? getCompanyState(participantId, round.id) : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/simulator/season/${id}`)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-base font-bold text-foreground">
                {t('Week', 'Седмица')} {weekNumber} {t('of', 'от')} {season.weeks}
              </h1>
              <p className="text-xs text-muted-foreground">{season.theme}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasPrev && (
              <Button variant="outline" size="sm" onClick={() => navigate(`/simulator/season/${id}/round/${weekNumber - 1}`)}>
                <ChevronLeft className="h-4 w-4" />
                {t('Prev', 'Назад')}
              </Button>
            )}
            {hasNext && isSubmitted && !isGameOver && (
              <Button variant="outline" size="sm" onClick={() => navigate(`/simulator/season/${id}/round/${weekNumber + 1}`)}>
                {t('Next', 'Напред')}
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl space-y-8">
        <LearningPhaseBar currentPhase={currentPhase} lang={lang as 'en' | 'bg'} completedPhases={completedPhases} />

        {/* GAME OVER / WIN SCREEN */}
        {isSubmitted && (isGameOver || isWon) && submittedState && (
          <GameOverScreen
            gameStatus={submittedState.gameStatus}
            resources={submittedState.resources}
            kpis={submittedState.kpis}
            weekNumber={weekNumber}
            onBack={() => navigate(`/simulator/season/${id}`)}
            lang={lang}
          />
        )}

        {/* RESOURCE DASHBOARD – always visible */}
        {currentState && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                {t('Startup Resources', 'Ресурси на стартъпа')}
              </h2>
              {currentState.resources.money < 2000 && (
                <Badge variant="destructive" className="text-xs ml-auto animate-pulse">
                  {t('⚠ LOW BUDGET', '⚠ НИСЪК БЮДЖЕТ')}
                </Badge>
              )}
              {currentState.resources.runway <= 1 && (
                <Badge variant="destructive" className="text-xs animate-pulse">
                  {t('⚠ LOW RUNWAY', '⚠ НИСЪК РЕЗЕРВ')}
                </Badge>
              )}
            </div>
            <ResourceDashboard
              resources={isSubmitted && submittedState ? submittedState.resources : currentState.resources}
              previousResources={previousState?.resources}
              lang={lang}
            />
          </div>
        )}

        {/* 1. SCENARIO BRIEFING */}
        {!isGameOver && !isWon && (
          <NarrativeBriefing
            narrative={round.narrative}
            weekNumber={round.week_number}
            shockEvent={round.shock_event}
            turbulence={currentState?.turbulence}
            lang={lang}
          />
        )}

        {/* TURBULENCE METER */}
        {currentState?.turbulence && !isGameOver && !isWon && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                {lang === 'bg' ? 'Пазарна турбулентност' : 'Market Turbulence'}
              </h2>
            </div>
            <TurbulenceMeter turbulence={currentState.turbulence} lang={lang} />
          </div>
        )}

        {/* CRISIS RESPONSE */}
        {isInCrisis && currentState?.turbulence && !isSubmitted && !isGameOver && (
          <CrisisResponsePanel
            turbulence={currentState.turbulence}
            onCrisisDecision={handleCrisisDecision}
            crisisAnswers={crisisAnswers}
            isSubmitted={isSubmitted}
            lang={lang}
          />
        )}

        {/* 2. CURRENT KPI METRICS */}
        {currentState && !isGameOver && !isWon && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                {isSubmitted
                  ? t('Updated Metrics (After Your Decisions)', 'Актуализирани показатели (след решенията)')
                  : t('Your Current Metrics', 'Текущите ви показатели')}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {isSubmitted
                ? t('See how your decisions changed these metrics.', 'Вижте как решенията ви промениха тези показатели.')
                : t('Consider these metrics when making your decisions. Every choice has trade-offs.', 'Вземете предвид тези показатели при вземане на решения. Всеки избор има компромиси.')}
            </p>
            <KPIDashboard
              kpis={isSubmitted && outcomeReport ? (getCompanyState(participantId!, round.id)?.kpis || currentState.kpis) : currentState.kpis}
              previousKpis={previousState?.kpis}
              lang={lang}
            />
          </div>
        )}

        {/* 3. CONSEQUENCE REPORT */}
        {isSubmitted && outcomeReport && !isGameOver && !isWon && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-sim-warning" />
              <h2 className="text-lg font-semibold text-foreground">
                {t('Consequences of Your Decisions', 'Последствия от решенията ви')}
              </h2>
            </div>
            <OutcomeReportView report={outcomeReport} lang={lang} />
          </div>
        )}

        {/* 4. SKILLS + AI FEEDBACK */}
        {isSubmitted && !isGameOver && (
          <SkillsImproved activityType="simulator" scorePercent={70 + weekNumber * 5} lang={lang as 'en' | 'bg'} />
        )}

        {isSubmitted && outcomeReport && currentState && !isGameOver && (
          <StructuredFeedback
            context={{
              type: 'simulator',
              currentWeek: weekNumber,
              kpis: currentState.kpis,
              grade: undefined,
              decisions: submission?.answers,
            }}
            lang={lang as 'en' | 'bg'}
          />
        )}

        {/* 5. DECISION ENGINE – hidden on game over */}
        {!isGameOver && !isWon && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                {isSubmitted ? t('Your Decisions (Submitted)', 'Вашите решения (Изпратени)') : t('Strategic Decisions', 'Стратегически решения')}
              </h2>
            </div>
            {!isSubmitted && (
              <div className="flex items-start gap-3 rounded-lg border border-sim-warning/30 bg-sim-warning/5 p-4 mb-4">
                <AlertTriangle className="h-4 w-4 text-sim-warning shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/80">
                  {t(
                    'Each option shows its impact on your metrics and resources. Read the trade-offs carefully — your choices shape your startup\'s survival. Once submitted, you cannot change your decisions.',
                    'Всяка опция показва въздействието си върху показателите и ресурсите ви. Прочетете компромисите внимателно — изборите ви определят оцеляването на стартъпа. След изпращане не можете да променяте решенията.'
                  )}
                </p>
              </div>
            )}
            <DecisionForm
              decisions={round.decisions}
              initialAnswers={isSubmitted ? submission?.answers : draftAnswers[draftKey]}
              rationale={isSubmitted ? submission?.rationale : draftRationales[draftKey]}
              reflection={isSubmitted ? submission?.reflection : draftReflections[draftKey]}
              onSaveDraft={handleSaveDraft}
              onSubmit={handleSubmit}
              isSubmitted={isSubmitted}
              lang={lang}
            />
          </div>
        )}

        {/* Next week CTA */}
        {isSubmitted && hasNext && !isGameOver && !isWon && (
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate(`/simulator/season/${id}/round/${weekNumber + 1}`)}
              className="sim-gradient border-0"
            >
              {t(`Continue to Week ${weekNumber + 1}`, `Продължи към Седмица ${weekNumber + 1}`)}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}