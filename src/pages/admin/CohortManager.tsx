import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Users, UserPlus, Trash2 } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

export default function CohortManager() {
  const { isAdmin, user } = useAuth();
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Create forms
  const [newCohortName, setNewCohortName] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamCohort, setNewTeamCohort] = useState('');
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [assignCohort, setAssignCohort] = useState('');
  const [assignCase, setAssignCase] = useState('');
  const [assignAssessment, setAssignAssessment] = useState('');
  const [assignType, setAssignType] = useState('individual');
  const [assignDue, setAssignDue] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    const fetch = async () => {
      const [co, te, me, ca, as_, ag, pr] = await Promise.all([
        supabase.from('cohorts').select('*').order('created_at', { ascending: false }),
        supabase.from('teams').select('*').order('created_at', { ascending: false }),
        supabase.from('cohort_members').select('*'),
        supabase.from('case_studies').select('id, title, published'),
        supabase.from('assessments').select('id, title, published'),
        supabase.from('assignments').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('user_id, full_name'),
      ]);
      setCohorts(co.data || []);
      setTeams(te.data || []);
      setMembers(me.data || []);
      setCases(ca.data || []);
      setAssessments(as_.data || []);
      setAssignments(ag.data || []);
      setProfiles(pr.data || []);
      setLoading(false);
    };
    fetch();
  }, [isAdmin]);

  const createCohort = async () => {
    if (!newCohortName.trim()) return;
    const { data, error } = await supabase.from('cohorts').insert({ name: newCohortName.trim(), created_by: user?.id }).select().single();
    if (error) { toast.error('Failed'); return; }
    setCohorts(prev => [data, ...prev]);
    setNewCohortName('');
    toast.success('Cohort created');
  };

  const createTeam = async () => {
    if (!newTeamName.trim() || !newTeamCohort) return;
    const { data, error } = await supabase.from('teams').insert({ name: newTeamName.trim(), cohort_id: newTeamCohort, created_by: user?.id }).select().single();
    if (error) { toast.error('Failed'); return; }
    setTeams(prev => [data, ...prev]);
    setNewTeamName('');
    toast.success('Team created');
  };

  const createAssignment = async () => {
    if (!assignCohort || (!assignCase && !assignAssessment)) { toast.error('Select cohort and case/assessment'); return; }
    const { error } = await supabase.from('assignments').insert({
      cohort_id: assignCohort,
      case_study_id: assignCase || null,
      assessment_id: assignAssessment || null,
      assignment_type: assignType,
      due_at: assignDue || null,
      created_by: user?.id,
    });
    if (error) { toast.error('Failed to assign'); return; }
    toast.success('Assignment created');
    setShowAssignDialog(false);
    // Refresh
    const { data } = await supabase.from('assignments').select('*').order('created_at', { ascending: false });
    setAssignments(data || []);
  };

  const getName = (uid: string) => profiles.find(p => p.user_id === uid)?.full_name || 'Unknown';

  if (!isAdmin) return <div className="min-h-screen bg-background"><AppHeader /><div className="flex items-center justify-center py-20 text-muted-foreground">Admin access required.</div></div>;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-foreground">Cohorts & Teams</h1>
          <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="sim-gradient border-0"><Plus className="h-4 w-4 mr-1" /> Assign Work</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display">Create Assignment</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Cohort</Label>
                  <Select value={assignCohort} onValueChange={setAssignCohort}>
                    <SelectTrigger><SelectValue placeholder="Select cohort" /></SelectTrigger>
                    <SelectContent>{cohorts.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Case Study (optional)</Label>
                  <Select value={assignCase} onValueChange={v => { setAssignCase(v); setAssignAssessment(''); }}>
                    <SelectTrigger><SelectValue placeholder="Select case" /></SelectTrigger>
                    <SelectContent>{cases.filter(c => c.published).map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Assessment (optional)</Label>
                  <Select value={assignAssessment} onValueChange={v => { setAssignAssessment(v); setAssignCase(''); }}>
                    <SelectTrigger><SelectValue placeholder="Select assessment" /></SelectTrigger>
                    <SelectContent>{assessments.filter(a => a.published).map(a => <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={assignType} onValueChange={setAssignType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Due Date (optional)</Label>
                  <Input type="datetime-local" value={assignDue} onChange={e => setAssignDue(e.target.value)} />
                </div>
                <Button onClick={createAssignment} className="w-full sim-gradient border-0">Create Assignment</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Create Cohort */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="font-display font-semibold text-foreground mb-3">Create Cohort</h2>
          <div className="flex gap-2">
            <Input value={newCohortName} onChange={e => setNewCohortName(e.target.value)} placeholder="Cohort name (e.g., Fall 2026)" />
            <Button onClick={createCohort} className="sim-gradient border-0 shrink-0">Create</Button>
          </div>
        </div>

        {/* Cohorts List */}
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Cohorts</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {cohorts.map(c => {
              const mCount = members.filter(m => m.cohort_id === c.id).length;
              const tCount = teams.filter(t => t.cohort_id === c.id).length;
              return (
                <div key={c.id} className="rounded-lg border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{c.name}</h3>
                    <Badge variant="outline" className="text-xs">{mCount} students</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{tCount} teams · Created {new Date(c.created_at).toLocaleDateString()}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Create Team */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="font-display font-semibold text-foreground mb-3">Create Team</h2>
          <div className="flex gap-2 flex-wrap">
            <Input value={newTeamName} onChange={e => setNewTeamName(e.target.value)} placeholder="Team name" className="w-48" />
            <Select value={newTeamCohort} onValueChange={setNewTeamCohort}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Select cohort" /></SelectTrigger>
              <SelectContent>{cohorts.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
            <Button onClick={createTeam} className="sim-gradient border-0">Create Team</Button>
          </div>
        </div>

        {/* Teams List */}
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Teams</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map(t => {
              const cohortName = cohorts.find(c => c.id === t.cohort_id)?.name || 'No cohort';
              return (
                <div key={t.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground text-sm">{t.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{cohortName}</p>
                  <p className="text-xs text-muted-foreground mt-1">Join code: <code className="bg-muted px-1.5 py-0.5 rounded">{t.join_code}</code></p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Assignments */}
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Assignments</h2>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Cohort</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Content</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Due</th>
                </tr>
              </thead>
              <tbody>
                {assignments.slice(0, 20).map(a => {
                  const cohortName = cohorts.find(c => c.id === a.cohort_id)?.name || '—';
                  const content = a.case_study_id
                    ? cases.find(c => c.id === a.case_study_id)?.title || 'Case'
                    : assessments.find(as_ => as_.id === a.assessment_id)?.title || 'Assessment';
                  return (
                    <tr key={a.id} className="border-t border-border">
                      <td className="px-4 py-3 text-sm text-foreground">{cohortName}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{content}</td>
                      <td className="px-4 py-3"><Badge variant="outline" className="text-xs capitalize">{a.assignment_type}</Badge></td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{a.due_at ? new Date(a.due_at).toLocaleDateString() : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {assignments.length === 0 && <p className="text-center py-8 text-sm text-muted-foreground">No assignments yet</p>}
          </div>
        </div>
      </main>
    </div>
  );
}
