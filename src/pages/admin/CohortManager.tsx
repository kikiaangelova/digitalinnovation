import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
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
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
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
    if (error) { toast.error(t('Failed', 'Грешка')); return; }
    setCohorts(prev => [data, ...prev]);
    setNewCohortName('');
    toast.success(t('Cohort created', 'Кохортата е създадена'));
  };

  const createTeam = async () => {
    if (!newTeamName.trim() || !newTeamCohort) return;
    const { data, error } = await supabase.from('teams').insert({ name: newTeamName.trim(), cohort_id: newTeamCohort, created_by: user?.id }).select().single();
    if (error) { toast.error(t('Failed', 'Грешка')); return; }
    setTeams(prev => [data, ...prev]);
    setNewTeamName('');
    toast.success(t('Team created', 'Екипът е създаден'));
  };

  const createAssignment = async () => {
    if (!assignCohort || (!assignCase && !assignAssessment)) { toast.error(t('Select cohort and case/assessment', 'Изберете кохорта и казус/оценка')); return; }
    const { error } = await supabase.from('assignments').insert({
      cohort_id: assignCohort,
      case_study_id: assignCase || null,
      assessment_id: assignAssessment || null,
      assignment_type: assignType,
      due_at: assignDue || null,
      created_by: user?.id,
    });
    if (error) { toast.error(t('Failed to assign', 'Грешка при задаване')); return; }
    toast.success(t('Assignment created', 'Задачата е създадена'));
    setShowAssignDialog(false);
    const { data } = await supabase.from('assignments').select('*').order('created_at', { ascending: false });
    setAssignments(data || []);
  };

  const getName = (uid: string) => profiles.find(p => p.user_id === uid)?.full_name || t('Unknown', 'Неизвестен');

  if (!isAdmin) return (
    <div className="min-h-screen bg-background"><AppHeader />
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        {t('Admin access required.', 'Необходим е администраторски достъп.')}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-foreground">{t('Cohorts & Teams', 'Кохорти и екипи')}</h1>
          <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="sim-gradient border-0"><Plus className="h-4 w-4 mr-1" /> {t('Assign Work', 'Задай работа')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display">{t('Create Assignment', 'Създай задача')}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{t('Cohort', 'Кохорта')}</Label>
                  <Select value={assignCohort} onValueChange={setAssignCohort}>
                    <SelectTrigger><SelectValue placeholder={t('Select cohort', 'Изберете кохорта')} /></SelectTrigger>
                    <SelectContent>{cohorts.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('Case Study (optional)', 'Казус (незадължително)')}</Label>
                  <Select value={assignCase} onValueChange={v => { setAssignCase(v); setAssignAssessment(''); }}>
                    <SelectTrigger><SelectValue placeholder={t('Select case', 'Изберете казус')} /></SelectTrigger>
                    <SelectContent>{cases.filter(c => c.published).map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('Assessment (optional)', 'Оценка (незадължително)')}</Label>
                  <Select value={assignAssessment} onValueChange={v => { setAssignAssessment(v); setAssignCase(''); }}>
                    <SelectTrigger><SelectValue placeholder={t('Select assessment', 'Изберете оценка')} /></SelectTrigger>
                    <SelectContent>{assessments.filter(a => a.published).map(a => <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('Type', 'Тип')}</Label>
                  <Select value={assignType} onValueChange={setAssignType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">{t('Individual', 'Индивидуална')}</SelectItem>
                      <SelectItem value="team">{t('Team', 'Екипна')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('Due Date (optional)', 'Краен срок (незадължително)')}</Label>
                  <Input type="datetime-local" value={assignDue} onChange={e => setAssignDue(e.target.value)} />
                </div>
                <Button onClick={createAssignment} className="w-full sim-gradient border-0">{t('Create Assignment', 'Създай задача')}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Create Cohort */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="font-display font-semibold text-foreground mb-3">{t('Create Cohort', 'Създай кохорта')}</h2>
          <div className="flex gap-2">
            <Input value={newCohortName} onChange={e => setNewCohortName(e.target.value)} placeholder={t('Cohort name (e.g., Fall 2026)', 'Име на кохорта (напр. Есен 2026)')} />
            <Button onClick={createCohort} className="sim-gradient border-0 shrink-0">{t('Create', 'Създай')}</Button>
          </div>
        </div>

        {/* Cohorts List */}
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">{t('Cohorts', 'Кохорти')}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {cohorts.map(c => {
              const mCount = members.filter(m => m.cohort_id === c.id).length;
              const tCount = teams.filter(tm => tm.cohort_id === c.id).length;
              return (
                <div key={c.id} className="rounded-lg border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{c.name}</h3>
                    <Badge variant="outline" className="text-xs">{mCount} {t('students', 'ученици')}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{tCount} {t('teams', 'екипа')} · {t('Created', 'Създадена')} {new Date(c.created_at).toLocaleDateString()}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Create Team */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="font-display font-semibold text-foreground mb-3">{t('Create Team', 'Създай екип')}</h2>
          <div className="flex gap-2 flex-wrap">
            <Input value={newTeamName} onChange={e => setNewTeamName(e.target.value)} placeholder={t('Team name', 'Име на екип')} className="w-48" />
            <Select value={newTeamCohort} onValueChange={setNewTeamCohort}>
              <SelectTrigger className="w-48"><SelectValue placeholder={t('Select cohort', 'Изберете кохорта')} /></SelectTrigger>
              <SelectContent>{cohorts.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
            <Button onClick={createTeam} className="sim-gradient border-0">{t('Create Team', 'Създай екип')}</Button>
          </div>
        </div>

        {/* Teams List */}
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">{t('Teams', 'Екипи')}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map(tm => {
              const cohortName = cohorts.find(c => c.id === tm.cohort_id)?.name || t('No cohort', 'Без кохорта');
              return (
                <div key={tm.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground text-sm">{tm.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{cohortName}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t('Join code:', 'Код за присъединяване:')} <code className="bg-muted px-1.5 py-0.5 rounded">{tm.join_code}</code></p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Assignments */}
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">{t('Assignments', 'Задачи')}</h2>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{t('Cohort', 'Кохорта')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{t('Content', 'Съдържание')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{t('Type', 'Тип')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{t('Due', 'Краен срок')}</th>
                </tr>
              </thead>
              <tbody>
                {assignments.slice(0, 20).map(a => {
                  const cohortName = cohorts.find(c => c.id === a.cohort_id)?.name || '—';
                  const content = a.case_study_id
                    ? cases.find(c => c.id === a.case_study_id)?.title || t('Case', 'Казус')
                    : assessments.find(as_ => as_.id === a.assessment_id)?.title || t('Assessment', 'Оценка');
                  return (
                    <tr key={a.id} className="border-t border-border">
                      <td className="px-4 py-3 text-sm text-foreground">{cohortName}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{content}</td>
                      <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{a.assignment_type === 'individual' ? t('Individual', 'Индивидуална') : t('Team', 'Екипна')}</Badge></td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{a.due_at ? new Date(a.due_at).toLocaleDateString() : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {assignments.length === 0 && <p className="text-center py-8 text-sm text-muted-foreground">{t('No assignments yet', 'Все още няма задачи')}</p>}
          </div>
        </div>
      </main>
    </div>
  );
}
