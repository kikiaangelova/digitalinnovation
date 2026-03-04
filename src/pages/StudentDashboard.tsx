import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import AppHeader from '@/components/layout/AppHeader';
import { BookOpen, Clock, BarChart3, CheckCircle2, ArrowRight, Users, FileText, Plus, Target } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface CaseStudyRow {
  id: string;
  title: string;
  description: string | null;
  topic: string | null;
  difficulty: string;
  est_minutes: number | null;
}

interface SubmissionRow {
  case_study_id: string;
  is_draft: boolean;
  total_score: number | null;
  max_score: number | null;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [cases, setCases] = useState<CaseStudyRow[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [assessmentSubs, setAssessmentSubs] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTopic, setFilterTopic] = useState('');
  const [filterDiff, setFilterDiff] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [teamNameInput, setTeamNameInput] = useState('');
  const [showTeamDialog, setShowTeamDialog] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [casesRes, subsRes, assessRes, aSubsRes, teamsRes] = await Promise.all([
        supabase.from('case_studies').select('id, title, description, topic, difficulty, est_minutes').eq('published', true),
        supabase.from('submissions').select('case_study_id, is_draft, total_score, max_score').eq('user_id', user.id),
        supabase.from('assessments').select('id, title, type, settings_json').eq('published', true),
        supabase.from('submissions').select('assessment_id, is_draft, total_score, max_score').eq('user_id', user.id).not('assessment_id', 'is', null),
        supabase.from('team_members').select('team_id, role, teams(id, name, join_code, cohort_id)').eq('user_id', user.id),
      ]);
      setCases(casesRes.data || []);
      setSubmissions(subsRes.data || []);
      setAssessments(assessRes.data || []);
      setAssessmentSubs(aSubsRes.data || []);
      setTeams(teamsRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const getSubmission = (caseId: string) => submissions.find(s => s.case_study_id === caseId);
  const getAssessmentSub = (aId: string) => assessmentSubs.find(s => s.assessment_id === aId);

  const difficultyColor = (d: string) => {
    switch (d) {
      case 'beginner': return 'bg-sim-success/10 text-sim-success';
      case 'intermediate': return 'bg-sim-warning/10 text-sim-warning';
      case 'advanced': return 'bg-sim-danger/10 text-sim-danger';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const completedCount = submissions.filter(s => !s.is_draft).length;

  const filteredCases = cases.filter(c => {
    if (filterTopic && !c.topic?.toLowerCase().includes(filterTopic.toLowerCase())) return false;
    if (filterDiff && c.difficulty !== filterDiff) return false;
    return true;
  });

  const topics = [...new Set(cases.map(c => c.topic).filter(Boolean))];

  const joinTeam = async () => {
    if (!joinCodeInput.trim() || !user) return;
    const { data: team } = await supabase.from('teams').select('id').eq('join_code', joinCodeInput.trim()).single();
    if (!team) { toast.error('Invalid join code'); return; }
    const { error } = await supabase.from('team_members').insert({ team_id: team.id, user_id: user.id, role: 'member' });
    if (error) { toast.error(error.message.includes('duplicate') ? 'Already a member' : 'Failed to join'); return; }
    toast.success('Joined team!');
    setJoinCodeInput('');
    setShowTeamDialog(false);
    window.location.reload();
  };

  const createTeam = async () => {
    if (!teamNameInput.trim() || !user) return;
    const { data: team, error } = await supabase.from('teams').insert({ name: teamNameInput.trim(), created_by: user.id }).select('id').single();
    if (error || !team) { toast.error('Failed to create team'); return; }
    await supabase.from('team_members').insert({ team_id: team.id, user_id: user.id, role: 'leader' });
    toast.success('Team created!');
    setTeamNameInput('');
    setShowTeamDialog(false);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{cases.length}</p>
                <p className="text-xs text-muted-foreground">Cases</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sim-success/10">
                <CheckCircle2 className="h-4 w-4 text-sim-success" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{completedCount}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{assessments.length}</p>
                <p className="text-xs text-muted-foreground">Assessments</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{teams.length}</p>
                <p className="text-xs text-muted-foreground">Teams</p>
              </div>
            </div>
          </div>
        </div>

        {/* Teams section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold text-foreground">My Teams</h2>
            <Dialog open={showTeamDialog} onOpenChange={setShowTeamDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" /> Join / Create</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle className="font-display">Join or Create Team</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Join by Code</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value={joinCodeInput} onChange={e => setJoinCodeInput(e.target.value)} placeholder="Enter join code" />
                      <Button onClick={joinTeam} size="sm">Join</Button>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <Label>Create New Team</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value={teamNameInput} onChange={e => setTeamNameInput(e.target.value)} placeholder="Team name" />
                      <Button onClick={createTeam} size="sm" className="sim-gradient border-0">Create</Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {teams.length === 0 ? (
            <p className="text-sm text-muted-foreground">No teams yet. Join or create one!</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {teams.map((t: any) => (
                <Link key={t.team_id} to={`/team/${t.team_id}`} className="rounded-lg border border-border bg-card p-4 hover:border-primary/40 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">{(t.teams as any)?.name || 'Team'}</span>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">{t.role}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Assessments */}
        {assessments.length > 0 && (
          <div>
            <h2 className="text-lg font-display font-semibold text-foreground mb-4">Assessments</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {assessments.map(a => {
                const sub = getAssessmentSub(a.id);
                const isComplete = sub && !sub.is_draft;
                return (
                  <Link key={a.id} to={isComplete ? `/assessment/${a.id}/results` : `/assessment/${a.id}`}
                    className="rounded-lg border border-border bg-card p-5 hover:border-primary/40 transition-colors group">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs capitalize">{a.type}</Badge>
                      {isComplete && <Badge className="bg-sim-success/10 text-sim-success border-0 text-xs"><CheckCircle2 className="h-3 w-3 mr-1" />{sub.total_score}/{sub.max_score}</Badge>}
                    </div>
                    <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">{a.title}</h3>
                    {a.settings_json?.timed && <p className="text-xs text-muted-foreground mt-1"><Clock className="h-3 w-3 inline mr-1" />{a.settings_json.time_limit_minutes} min timed</p>}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Case Library */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold text-foreground">Case Library</h2>
          </div>
          <div className="flex gap-2 mb-4 flex-wrap">
            <Input value={filterTopic} onChange={e => setFilterTopic(e.target.value)} placeholder="Filter by topic..." className="w-48" />
            <select value={filterDiff} onChange={e => setFilterDiff(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <option value="">All difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCases.map(c => {
                const sub = getSubmission(c.id);
                const isComplete = sub && !sub.is_draft;
                const isDraft = sub && sub.is_draft;
                return (
                  <Link key={c.id} to={isComplete ? `/case/${c.id}/results` : `/case/${c.id}`}
                    className="group rounded-lg border border-border bg-card p-5 transition-all hover:shadow-lg hover:border-primary/40">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className={`text-xs ${difficultyColor(c.difficulty)}`}>{c.difficulty}</Badge>
                      {isComplete && <Badge className="bg-sim-success/10 text-sim-success border-0"><CheckCircle2 className="h-3 w-3 mr-1" />{sub.total_score}/{sub.max_score}</Badge>}
                      {isDraft && <Badge className="bg-sim-warning/10 text-sim-warning border-0">In Progress</Badge>}
                    </div>
                    <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">{c.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{c.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {c.topic && <span className="truncate">{c.topic}</span>}
                      {c.est_minutes && <span className="flex items-center gap-1 shrink-0"><Clock className="h-3 w-3" />{c.est_minutes} min</span>}
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      {isComplete ? 'View Results' : isDraft ? 'Continue' : 'Start Case'} <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
