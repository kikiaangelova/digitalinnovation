import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  SimulationSeason, Team, TeamMember, CompanyState, DecisionSubmission,
  DecisionAnswer, OutcomeReport, KPIs, SeasonScoreboard,
} from '@/types/simulator';
import { SEED_SEASON, INITIAL_KPIS } from '@/data/seed-season';
import { processRound } from '@/engine/simulation-engine';

export type SimulatorMode = 'individual' | 'team';

interface SimulatorState {
  seasons: SimulationSeason[];
  teams: Team[];
  companyStates: CompanyState[];
  submissions: DecisionSubmission[];
  outcomeReports: OutcomeReport[];
  currentUser: { id: string; name: string; role: 'student' | 'admin' };
  draftAnswers: Record<string, DecisionAnswer[]>;
  draftRationales: Record<string, string>;
  draftReflections: Record<string, string>;
  simulatorMode: SimulatorMode;
  /** Individual runs keyed by seasonId */
  individualRuns: Record<string, { startedAt: string }>;
}

interface SimulatorActions {
  createTeam: (seasonId: string, name: string) => Team;
  joinTeam: (code: string, userName: string) => Team | null;
  saveDraft: (roundId: string, participantId: string, answers: DecisionAnswer[], rationale: string, reflection: string) => void;
  submitDecisions: (roundId: string, participantId: string, crisisAnswers?: Record<string, string>) => OutcomeReport | null;
  getTeamForSeason: (seasonId: string) => Team | null;
  getCompanyState: (participantId: string, roundId: string) => CompanyState | null;
  getLatestCompanyState: (participantId: string) => CompanyState | null;
  getSubmission: (participantId: string, roundId: string) => DecisionSubmission | null;
  getOutcomeReport: (participantId: string, roundId: string) => OutcomeReport | null;
  getCompanyStateHistory: (participantId: string) => CompanyState[];
  switchRole: (role: 'student' | 'admin') => void;
  addInstructorComment: (participantId: string, roundId: string, comment: string) => void;
  getScoreboard: (seasonId: string) => SeasonScoreboard[];
  setSimulatorMode: (mode: SimulatorMode) => void;
  startIndividualRun: (seasonId: string) => void;
  hasIndividualRun: (seasonId: string) => boolean;
  getParticipantId: (seasonId: string) => string | null;
}

const SimulatorContext = createContext<(SimulatorState & SimulatorActions) | null>(null);

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

function generateJoinCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function SimulatorProvider({ children }: { children: ReactNode }) {
  const [seasons] = useState<SimulationSeason[]>([SEED_SEASON]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [companyStates, setCompanyStates] = useState<CompanyState[]>([]);
  const [submissions, setSubmissions] = useState<DecisionSubmission[]>([]);
  const [outcomeReports, setOutcomeReports] = useState<OutcomeReport[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; role: 'student' | 'admin' }>({ id: 'user-1', name: 'You', role: 'student' });
  const [draftAnswers, setDraftAnswers] = useState<Record<string, DecisionAnswer[]>>({});
  const [draftRationales, setDraftRationales] = useState<Record<string, string>>({});
  const [draftReflections, setDraftReflections] = useState<Record<string, string>>({});
  const [simulatorMode, setSimulatorMode] = useState<SimulatorMode>('individual');
  const [individualRuns, setIndividualRuns] = useState<Record<string, { startedAt: string }>>({});

  const hasIndividualRun = useCallback((seasonId: string) => {
    return !!individualRuns[seasonId];
  }, [individualRuns]);

  const startIndividualRun = useCallback((seasonId: string) => {
    if (individualRuns[seasonId]) return;
    const participantId = `individual-${currentUser.id}`;
    setIndividualRuns(prev => ({ ...prev, [seasonId]: { startedAt: new Date().toISOString() } }));
    const season = seasons.find(s => s.id === seasonId);
    setCompanyStates(prev => [...prev, {
      id: `cs-${generateId()}`,
      team_id: participantId,
      round_id: season?.rounds[0]?.id || '',
      week_number: 0,
      kpis: INITIAL_KPIS,
    }]);
  }, [individualRuns, currentUser.id, seasons]);

  /** Returns the participantId (team.id or individual id) for a season */
  const getParticipantId = useCallback((seasonId: string): string | null => {
    if (simulatorMode === 'team') {
      const team = teams.find(t => t.season_id === seasonId);
      return team?.id || null;
    }
    if (individualRuns[seasonId]) {
      return `individual-${currentUser.id}`;
    }
    return null;
  }, [simulatorMode, teams, individualRuns, currentUser.id]);

  const getTeamForSeason = useCallback((seasonId: string) => {
    return teams.find(t => t.season_id === seasonId) || null;
  }, [teams]);

  const getCompanyState = useCallback((participantId: string, roundId: string) => {
    return companyStates.find(cs => cs.team_id === participantId && cs.round_id === roundId) || null;
  }, [companyStates]);

  const getLatestCompanyState = useCallback((participantId: string) => {
    const states = companyStates.filter(cs => cs.team_id === participantId);
    return states.sort((a, b) => b.week_number - a.week_number)[0] || null;
  }, [companyStates]);

  const getSubmission = useCallback((participantId: string, roundId: string) => {
    return submissions.find(s => s.team_id === participantId && s.round_id === roundId && !s.is_draft) || null;
  }, [submissions]);

  const getOutcomeReport = useCallback((participantId: string, roundId: string) => {
    return outcomeReports.find(r => r.team_id === participantId && r.round_id === roundId) || null;
  }, [outcomeReports]);

  const getCompanyStateHistory = useCallback((participantId: string) => {
    return companyStates.filter(cs => cs.team_id === participantId).sort((a, b) => a.week_number - b.week_number);
  }, [companyStates]);

  const createTeam = useCallback((seasonId: string, name: string) => {
    const team: Team = {
      id: `team-${generateId()}`,
      season_id: seasonId,
      name,
      join_code: generateJoinCode(),
      members: [{ id: `m-${generateId()}`, team_id: '', user_name: currentUser.name, role: 'lead' }],
    };
    team.members[0].team_id = team.id;
    setTeams(prev => [...prev, team]);
    setCompanyStates(prev => [...prev, {
      id: `cs-${generateId()}`,
      team_id: team.id,
      round_id: seasons.find(s => s.id === seasonId)?.rounds[0]?.id || '',
      week_number: 0,
      kpis: INITIAL_KPIS,
    }]);
    return team;
  }, [currentUser.name, seasons]);

  const joinTeam = useCallback((code: string, userName: string) => {
    const team = teams.find(t => t.join_code === code);
    if (!team) return null;
    const member: TeamMember = { id: `m-${generateId()}`, team_id: team.id, user_name: userName, role: 'member' };
    setTeams(prev => prev.map(t => t.id === team.id ? { ...t, members: [...t.members, member] } : t));
    return team;
  }, [teams]);

  const saveDraft = useCallback((roundId: string, participantId: string, answers: DecisionAnswer[], rationale: string, reflection: string) => {
    const key = `${participantId}-${roundId}`;
    setDraftAnswers(prev => ({ ...prev, [key]: answers }));
    setDraftRationales(prev => ({ ...prev, [key]: rationale }));
    setDraftReflections(prev => ({ ...prev, [key]: reflection }));
  }, []);

  const submitDecisions = useCallback((roundId: string, participantId: string) => {
    const key = `${participantId}-${roundId}`;
    const answers = draftAnswers[key];
    if (!answers || answers.length === 0) return null;

    const season = seasons.find(s => s.rounds.some(r => r.id === roundId));
    if (!season) return null;
    const round = season.rounds.find(r => r.id === roundId);
    if (!round) return null;

    const latestState = getLatestCompanyState(participantId);
    if (!latestState) return null;

    const { newKPIs, report, turbulence: newTurbulence, dynamicShock } = processRound(
      latestState.kpis,
      answers,
      round.decisions,
      round.shock_event,
      season.volatility,
      latestState.turbulence,
      round.week_number,
    );

    const submission: DecisionSubmission = {
      id: `sub-${generateId()}`,
      team_id: participantId,
      round_id: roundId,
      submitted_by: currentUser.id,
      submitted_at: new Date().toISOString(),
      rationale: draftRationales[key] || '',
      reflection: draftReflections[key] || '',
      answers,
      is_draft: false,
    };

    const outcomeReport: OutcomeReport = {
      id: `or-${generateId()}`,
      team_id: participantId,
      round_id: roundId,
      week_number: round.week_number,
      ...report,
    };

    const newState: CompanyState = {
      id: `cs-${generateId()}`,
      team_id: participantId,
      round_id: roundId,
      week_number: round.week_number,
      kpis: newKPIs,
      turbulence: newTurbulence,
    };

    setSubmissions(prev => [...prev, submission]);
    setOutcomeReports(prev => [...prev, outcomeReport]);
    setCompanyStates(prev => [...prev, newState]);

    setDraftAnswers(prev => { const n = { ...prev }; delete n[key]; return n; });
    setDraftRationales(prev => { const n = { ...prev }; delete n[key]; return n; });
    setDraftReflections(prev => { const n = { ...prev }; delete n[key]; return n; });

    return outcomeReport;
  }, [draftAnswers, draftRationales, draftReflections, seasons, getLatestCompanyState, currentUser.id]);

  const switchRole = useCallback((role: 'student' | 'admin') => {
    setCurrentUser(prev => ({ ...prev, role }));
  }, []);

  const addInstructorComment = useCallback((participantId: string, roundId: string, comment: string) => {
    setOutcomeReports(prev => prev.map(r =>
      r.team_id === participantId && r.round_id === roundId
        ? { ...r, instructor_comment: comment }
        : r
    ));
  }, []);

  const getScoreboard = useCallback((seasonId: string): SeasonScoreboard[] => {
    const seasonTeams = teams.filter(t => t.season_id === seasonId);
    return seasonTeams.map(team => {
      const teamSubmissions = submissions.filter(s => s.team_id === team.id && !s.is_draft);
      const scoresByRound = teamSubmissions.map(s => {
        const totalScore = s.answers.reduce((sum, a) => sum + (a.score || 0), 0);
        const round = seasons.find(se => se.id === seasonId)?.rounds.find(r => r.id === s.round_id);
        return { round: round?.week_number || 0, score: totalScore };
      });
      return {
        team_id: team.id,
        team_name: team.name,
        total_score: scoresByRound.reduce((sum, s) => sum + s.score, 0),
        scores_by_round: scoresByRound,
      };
    });
  }, [teams, submissions, seasons]);

  return (
    <SimulatorContext.Provider value={{
      seasons, teams, companyStates, submissions, outcomeReports, currentUser,
      draftAnswers, draftRationales, draftReflections, simulatorMode, individualRuns,
      createTeam, joinTeam, saveDraft, submitDecisions,
      getTeamForSeason, getCompanyState, getLatestCompanyState,
      getSubmission, getOutcomeReport, getCompanyStateHistory,
      switchRole, addInstructorComment, getScoreboard,
      setSimulatorMode, startIndividualRun, hasIndividualRun, getParticipantId,
    }}>
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulator() {
  const ctx = useContext(SimulatorContext);
  if (!ctx) throw new Error('useSimulator must be used within SimulatorProvider');
  return ctx;
}
