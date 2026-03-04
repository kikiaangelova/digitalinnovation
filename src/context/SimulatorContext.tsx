import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  SimulationSeason, Team, TeamMember, CompanyState, DecisionSubmission,
  DecisionAnswer, OutcomeReport, KPIs, SeasonScoreboard,
} from '@/types/simulator';
import { SEED_SEASON, INITIAL_KPIS } from '@/data/seed-season';
import { processRound } from '@/engine/simulation-engine';

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
}

interface SimulatorActions {
  createTeam: (seasonId: string, name: string) => Team;
  joinTeam: (code: string, userName: string) => Team | null;
  saveDraft: (roundId: string, teamId: string, answers: DecisionAnswer[], rationale: string, reflection: string) => void;
  submitDecisions: (roundId: string, teamId: string) => OutcomeReport | null;
  getTeamForSeason: (seasonId: string) => Team | null;
  getCompanyState: (teamId: string, roundId: string) => CompanyState | null;
  getLatestCompanyState: (teamId: string) => CompanyState | null;
  getSubmission: (teamId: string, roundId: string) => DecisionSubmission | null;
  getOutcomeReport: (teamId: string, roundId: string) => OutcomeReport | null;
  getCompanyStateHistory: (teamId: string) => CompanyState[];
  switchRole: (role: 'student' | 'admin') => void;
  addInstructorComment: (teamId: string, roundId: string, comment: string) => void;
  getScoreboard: (seasonId: string) => SeasonScoreboard[];
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
  const [teams, setTeams] = useState<Team[]>([
    {
      id: 'demo-team',
      season_id: 'season-startup-lab',
      name: 'Team Alpha',
      join_code: 'ALPHA1',
      members: [
        { id: 'm1', team_id: 'demo-team', user_name: 'You', role: 'lead' },
        { id: 'm2', team_id: 'demo-team', user_name: 'Alex Chen', role: 'member' },
        { id: 'm3', team_id: 'demo-team', user_name: 'Maria Santos', role: 'member' },
      ],
    },
  ]);
  const [companyStates, setCompanyStates] = useState<CompanyState[]>([
    { id: 'cs-0', team_id: 'demo-team', round_id: 'round-1', week_number: 0, kpis: INITIAL_KPIS },
  ]);
  const [submissions, setSubmissions] = useState<DecisionSubmission[]>([]);
  const [outcomeReports, setOutcomeReports] = useState<OutcomeReport[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; role: 'student' | 'admin' }>({ id: 'user-1', name: 'You', role: 'student' });
  const [draftAnswers, setDraftAnswers] = useState<Record<string, DecisionAnswer[]>>({});
  const [draftRationales, setDraftRationales] = useState<Record<string, string>>({});
  const [draftReflections, setDraftReflections] = useState<Record<string, string>>({});

  const getTeamForSeason = useCallback((seasonId: string) => {
    return teams.find(t => t.season_id === seasonId) || null;
  }, [teams]);

  const getCompanyState = useCallback((teamId: string, roundId: string) => {
    return companyStates.find(cs => cs.team_id === teamId && cs.round_id === roundId) || null;
  }, [companyStates]);

  const getLatestCompanyState = useCallback((teamId: string) => {
    const states = companyStates.filter(cs => cs.team_id === teamId);
    return states.sort((a, b) => b.week_number - a.week_number)[0] || null;
  }, [companyStates]);

  const getSubmission = useCallback((teamId: string, roundId: string) => {
    return submissions.find(s => s.team_id === teamId && s.round_id === roundId && !s.is_draft) || null;
  }, [submissions]);

  const getOutcomeReport = useCallback((teamId: string, roundId: string) => {
    return outcomeReports.find(r => r.team_id === teamId && r.round_id === roundId) || null;
  }, [outcomeReports]);

  const getCompanyStateHistory = useCallback((teamId: string) => {
    return companyStates.filter(cs => cs.team_id === teamId).sort((a, b) => a.week_number - b.week_number);
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

  const saveDraft = useCallback((roundId: string, teamId: string, answers: DecisionAnswer[], rationale: string, reflection: string) => {
    const key = `${teamId}-${roundId}`;
    setDraftAnswers(prev => ({ ...prev, [key]: answers }));
    setDraftRationales(prev => ({ ...prev, [key]: rationale }));
    setDraftReflections(prev => ({ ...prev, [key]: reflection }));
  }, []);

  const submitDecisions = useCallback((roundId: string, teamId: string) => {
    const key = `${teamId}-${roundId}`;
    const answers = draftAnswers[key];
    if (!answers || answers.length === 0) return null;

    const season = seasons.find(s => s.rounds.some(r => r.id === roundId));
    if (!season) return null;
    const round = season.rounds.find(r => r.id === roundId);
    if (!round) return null;

    const latestState = getLatestCompanyState(teamId);
    if (!latestState) return null;

    const { newKPIs, report } = processRound(
      latestState.kpis,
      answers,
      round.decisions,
      round.shock_event,
      season.volatility
    );

    const submission: DecisionSubmission = {
      id: `sub-${generateId()}`,
      team_id: teamId,
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
      team_id: teamId,
      round_id: roundId,
      week_number: round.week_number,
      ...report,
    };

    const newState: CompanyState = {
      id: `cs-${generateId()}`,
      team_id: teamId,
      round_id: roundId,
      week_number: round.week_number,
      kpis: newKPIs,
    };

    setSubmissions(prev => [...prev, submission]);
    setOutcomeReports(prev => [...prev, outcomeReport]);
    setCompanyStates(prev => [...prev, newState]);

    // Clear draft
    setDraftAnswers(prev => { const n = { ...prev }; delete n[key]; return n; });
    setDraftRationales(prev => { const n = { ...prev }; delete n[key]; return n; });
    setDraftReflections(prev => { const n = { ...prev }; delete n[key]; return n; });

    return outcomeReport;
  }, [draftAnswers, draftRationales, draftReflections, seasons, getLatestCompanyState, currentUser.id]);

  const switchRole = useCallback((role: 'student' | 'admin') => {
    setCurrentUser(prev => ({ ...prev, role }));
  }, []);

  const addInstructorComment = useCallback((teamId: string, roundId: string, comment: string) => {
    setOutcomeReports(prev => prev.map(r =>
      r.team_id === teamId && r.round_id === roundId
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
      draftAnswers, draftRationales, draftReflections,
      createTeam, joinTeam, saveDraft, submitDecisions,
      getTeamForSeason, getCompanyState, getLatestCompanyState,
      getSubmission, getOutcomeReport, getCompanyStateHistory,
      switchRole, addInstructorComment, getScoreboard,
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
