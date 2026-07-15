import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Users, Copy, Link2, Plus, Settings, ClipboardList, School,
  Download, UserMinus, Save, RefreshCw, Trash2, AlertTriangle,
  BookOpen, Map, GraduationCap, Calendar, ArrowRight, CheckCircle2, Clock, X,
} from 'lucide-react';
import {
  SUBJECT_CATALOG,
  DEFAULT_SUBJECT_KEY,
  getSubject,
  subjectTitle,
  subjectLabel,
} from '@/data/subject-catalog';

interface Classroom {
  id: string;
  name: string;
  class_code: string;
  invite_link: string | null;
  is_active: boolean;
  created_at: string;
  subject_key: string | null;
}

interface Student {
  id: string;
  student_id: string;
  joined_at: string;
  profile?: {
    display_name: string | null;
    full_name: string | null;
    total_xp: number;
    updated_at: string;
  };
}

interface Assignment {
  id: string;
  assignment_type: string;
  journey_stage: number | null;
  case_id: string | null;
  module_slug: string | null;
  due_date: string | null;
  note: string | null;
  created_at: string;
}

export default function TeacherClassroom() {
  const { user } = useAuth();
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const classroom = classrooms.find((c) => c.id === selectedId) ?? null;
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  // Create classroom
  const [createName, setCreateName] = useState('');
  const [createSubject, setCreateSubject] = useState<string>('');
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  // Assign modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignType, setAssignType] = useState<string>('learn_module');
  const [assignModuleSlug, setAssignModuleSlug] = useState('');
  const [assignCaseId, setAssignCaseId] = useState('');
  const [assignStage, setAssignStage] = useState(1);
  const [assignDueDate, setAssignDueDate] = useState('');
  const [assignNote, setAssignNote] = useState('');

  // Settings
  const [editName, setEditName] = useState('');
  const [dissolveName, setDissolveName] = useState('');
  const [editSubject, setEditSubject] = useState<string>('');
  const [pendingSubject, setPendingSubject] = useState<string | null>(null);
  const [savingSubject, setSavingSubject] = useState(false);

  // Student detail
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [feedbackNote, setFeedbackNote] = useState('');

  // Data for dropdowns
  const [caseStudies, setCaseStudies] = useState<{ id: string; title: string }[]>([]);
  const [modules, setModules] = useState<{ slug: string; title: string; subject_key: string | null }[]>([]);
  const [showAllSubjectModules, setShowAllSubjectModules] = useState(false);

  const siteUrl = window.location.origin;

  const fetchClassroom = useCallback(async () => {
    if (!user) return;
    // Fetch all active classrooms owned by this teacher (multi-class V1).
    const { data: allClassrooms } = await supabase
      .from('classrooms')
      .select('*')
      .eq('teacher_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    const list = (allClassrooms ?? []) as Classroom[];
    setClassrooms(list);

    // Preserve current selection if still present; otherwise pick first.
    const nextId =
      selectedId && list.some((c) => c.id === selectedId)
        ? selectedId
        : list[0]?.id ?? null;
    setSelectedId(nextId);

    const data = nextId ? list.find((c) => c.id === nextId) : null;
    if (data) {
      setEditName(data.name);
      setEditSubject(data.subject_key || DEFAULT_SUBJECT_KEY);
      setPendingSubject(null);
      // Fetch students
      const { data: studentsData } = await supabase
        .from('classroom_students')
        .select('id, student_id, joined_at')
        .eq('classroom_id', data.id);
      if (studentsData && studentsData.length > 0) {
        const studentIds = studentsData.map(s => s.student_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, display_name, full_name, total_xp, updated_at')
          .in('user_id', studentIds);
        const profileMap = Object.fromEntries((profiles || []).map(p => [p.user_id, p]));
        setStudents(studentsData.map(s => ({ ...s, profile: profileMap[s.student_id] })));
      } else {
        setStudents([]);
      }
      // Fetch assignments
      const { data: assignData } = await supabase
        .from('classroom_assignments')
        .select('*')
        .eq('classroom_id', data.id)
        .order('created_at', { ascending: false });
      setAssignments((assignData || []) as Assignment[]);
    } else {
      setStudents([]);
      setAssignments([]);
    }
    setLoading(false);
  }, [user, selectedId]);

  useEffect(() => {
    fetchClassroom();
    // Fetch case studies and modules for assignment dropdowns
    Promise.all([
      supabase.from('case_studies').select('id, title').eq('published', true),
      supabase
        .from('learning_modules')
        .select('slug, title_en, title_bg, subject_key' as any)
        .order('display_order'),
    ]).then(([casesRes, modsRes]) => {
      setCaseStudies((casesRes.data || []).map(c => ({ id: c.id, title: c.title })));
      setModules(((modsRes.data || []) as any[]).map((m) => ({
        slug: m.slug,
        title: lang === 'bg' ? m.title_bg : m.title_en,
        subject_key: (m as any).subject_key ?? null,
      })));
    });
  }, [fetchClassroom, lang]);

  const createClassroom = async () => {
    if (!user || !createName.trim() || !createSubject) return;
    setCreating(true);
    // Generate class code via RPC
    const { data: code } = await supabase.rpc('generate_class_code');
    if (!code) { toast.error('Failed to generate code'); setCreating(false); return; }
    const inviteLink = `${siteUrl}/join/${code}`;
    const { error } = await supabase.from('classrooms').insert({
      teacher_id: user.id,
      name: createName.trim(),
      class_code: code,
      invite_link: inviteLink,
      subject_key: createSubject,
    } as any);
    if (error) { toast.error(error.message); setCreating(false); return; }
    toast.success(t('Classroom created!', 'Класната стая е създадена!'));
    setCreateName('');
    setCreateSubject('');
    setShowCreate(false);
    setCreating(false);
    fetchClassroom();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t(`${label} copied!`, `${label} е копиран!`));
  };

  const createAssignment = async () => {
    if (!user || !classroom) return;
    const payload: any = {
      classroom_id: classroom.id,
      assigned_by: user.id,
      assignment_type: assignType,
      due_date: assignDueDate || null,
      note: assignNote.trim() || null,
    };
    if (assignType === 'journey_stage') payload.journey_stage = assignStage;
    if (assignType === 'case_study') payload.case_id = assignCaseId || null;
    if (assignType === 'learn_module') payload.module_slug = assignModuleSlug || null;

    const { error } = await supabase.from('classroom_assignments').insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success(t('Assignment created!', 'Задачата е назначена!'));
    setShowAssignModal(false);
    setAssignNote('');
    setAssignDueDate('');
    fetchClassroom();
  };

  const removeStudent = async (studentId: string) => {
    if (!classroom) return;
    await supabase.from('classroom_students')
      .delete()
      .eq('classroom_id', classroom.id)
      .eq('student_id', studentId);
    toast.success(t('Student removed', 'Ученикът е премахнат'));
    setSelectedStudent(null);
    fetchClassroom();
  };

  const saveClassroomName = async () => {
    if (!classroom || !editName.trim()) return;
    await supabase.from('classrooms').update({ name: editName.trim() }).eq('id', classroom.id);
    toast.success(t('Name updated', 'Името е обновено'));
    fetchClassroom();
  };

  const changeClassroomSubject = async () => {
    if (!classroom || !pendingSubject || pendingSubject === (classroom.subject_key || '')) {
      setPendingSubject(null);
      return;
    }
    setSavingSubject(true);
    const { error } = await supabase
      .from('classrooms')
      .update({ subject_key: pendingSubject } as any)
      .eq('id', classroom.id);
    setSavingSubject(false);
    if (error) {
      toast.error(t('Could not change subject', 'Неуспешна смяна на предмет'));
      return;
    }
    toast.success(t('Subject updated', 'Предметът е обновен'));
    setPendingSubject(null);
    fetchClassroom();
  };

  const regenerateCode = async () => {
    if (!classroom) return;
    const { data: code } = await supabase.rpc('generate_class_code');
    if (!code) return;
    const inviteLink = `${siteUrl}/join/${code}`;
    await supabase.from('classrooms').update({ class_code: code, invite_link: inviteLink }).eq('id', classroom.id);
    toast.success(t('New code generated', 'Нов код е генериран'));
    fetchClassroom();
  };

  const dissolveClassroom = async () => {
    if (!classroom) return;
    await supabase.from('classrooms').delete().eq('id', classroom.id);
    toast.success(t('Classroom dissolved', 'Класната стая е разпусната'));
    setClassrooms((prev) => prev.filter((c) => c.id !== classroom.id));
    setSelectedId(null);
    setStudents([]);
    setAssignments([]);
    fetchClassroom();
  };

  const saveFeedback = async (studentId: string) => {
    if (!user || !feedbackNote.trim()) return;
    await supabase.from('teacher_feedback').insert({
      teacher_id: user.id,
      student_id: studentId,
      target_type: 'classroom_note',
      target_id: classroom?.id || '',
      comment: feedbackNote.trim(),
    });
    toast.success(t('Note saved', 'Бележката е запазена'));
    setFeedbackNote('');
  };

  const exportCSV = () => {
    const headers = [t('Nickname', 'Псевдоним'), 'XP', t('Level', 'Ниво'), t('Joined', 'Присъединил се'), t('Last Active', 'Последна активност')];
    const rows = students.map(s => [
      `"${s.profile?.display_name || s.profile?.full_name || ''}"`,
      s.profile?.total_xp || 0,
      Math.floor((s.profile?.total_xp || 0) / 100) + 1,
      new Date(s.joined_at).toLocaleDateString('bg-BG'),
      new Date(s.profile?.updated_at || '').toLocaleDateString('bg-BG'),
    ].join(','));
    const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'classroom_students.csv';
    a.click();
    toast.success(t('Exported', 'Експортирано'));
  };

  const getStatusBadge = (s: Student) => {
    const xp = s.profile?.total_xp || 0;
    const lastActive = s.profile?.updated_at ? new Date(s.profile.updated_at) : null;
    const daysSince = lastActive ? (Date.now() - lastActive.getTime()) / 86400000 : 999;
    if (xp === 0) return { label: t('Not started', 'Не е започнал'), color: 'bg-destructive/10 text-destructive' };
    if (daysSince > 14) return { label: t('Inactive', 'Неактивен'), color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' };
    if (daysSince <= 7) return { label: t('Active', 'Активен'), color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' };
    return { label: t('Inactive', 'Неактивен'), color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' };
  };

  const activeThisWeek = students.filter(s => {
    const d = s.profile?.updated_at ? (Date.now() - new Date(s.profile.updated_at).getTime()) / 86400000 : 999;
    return d <= 7;
  }).length;

  const needsHelp = students.filter(s => (s.profile?.total_xp || 0) === 0).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20 text-muted-foreground">{t('Loading...', 'Зареждане...')}</div>
      </div>
    );
  }

  // ── STATE A: No classroom yet ──
  if (!classroom) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto px-4 py-16 max-w-lg">
          <Card className="p-8 text-center space-y-4">
            <div className="text-5xl">🏫</div>
            <h1 className="text-xl font-bold text-foreground">{t('Create your classroom', 'Създай своя клас')}</h1>
            <p className="text-sm text-muted-foreground">
              {t('Start by creating a classroom and invite your students.', 'Стартирай с генериране на класна стая и покани учениците си.')}
            </p>
            <div className="space-y-3 text-left">
              <Label>{t('Classroom name', 'Име на класа')}</Label>
              <Input
                value={createName}
                onChange={e => setCreateName(e.target.value)}
                placeholder={t('e.g. 12A Business 2026', 'напр. 12А Бизнес 2026')}
              />
              <Label>{t('Subject', 'Предмет')}</Label>
              <select
                value={createSubject}
                onChange={(e) => setCreateSubject(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">{t('— Select subject —', '— Избери предмет —')}</option>
                {SUBJECT_CATALOG.map((s) => (
                  <option key={s.key} value={s.key}>
                    {subjectTitle(s, lang as 'bg' | 'en')}
                    {s.availability !== 'playable'
                      ? ` (${s.availability === 'preview' ? t('preview', 'преглед') : t('planned', 'планиран')})`
                      : ''}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-muted-foreground">
                {t(
                  'Each class teaches one subject. Create another class for a different subject.',
                  'Всеки клас изучава един предмет. Създай нов клас за друг предмет.',
                )}
              </p>
              <Button onClick={createClassroom} disabled={creating || !createName.trim() || !createSubject} className="w-full sim-gradient border-0">
                <Plus className="h-4 w-4 mr-1" />
                {creating ? t('Creating...', 'Създаване...') : t('Create classroom', 'Създай класна стая')}
              </Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  // ── STATE B: Classroom exists ──
  const assignmentLabel = (a: Assignment) => {
    if (a.assignment_type === 'learn_module') {
      const mod = modules.find(m => m.slug === a.module_slug);
      return mod?.title || a.module_slug || '';
    }
    if (a.assignment_type === 'case_study') {
      const cs = caseStudies.find(c => c.id === a.case_id);
      return cs?.title || '';
    }
    if (a.assignment_type === 'journey_stage') {
      return `${t('Journey Stage', 'Етап')} ${a.journey_stage}`;
    }
    return '';
  };

  const typeIcon = (type: string) => {
    if (type === 'learn_module') return <GraduationCap className="h-4 w-4 text-primary" />;
    if (type === 'case_study') return <BookOpen className="h-4 w-4 text-blue-500" />;
    return <Map className="h-4 w-4 text-amber-500" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-6 max-w-6xl space-y-6">
        {/* Header + multi-class selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="typo-h1 flex items-center gap-2 flex-wrap">
              👩‍🏫 {classroom.name}
              <Badge variant="outline" className="text-xs font-normal">
                {subjectLabel(classroom.subject_key, lang as 'bg' | 'en')}
              </Badge>
            </h1>
            {classrooms.length > 1 && (
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <Label className="text-xs text-muted-foreground">
                  {t('Class', 'Клас')}:
                </Label>
                <select
                  value={classroom.id}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                >
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {subjectLabel(c.subject_key, lang as 'bg' | 'en')}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => setShowCreate(true)}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              {t('Create another class', 'Създай нов клас')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(classroom.class_code, t('Code', 'Кодът'))}>
              <Copy className="h-3.5 w-3.5 mr-1" />
              📋 {classroom.class_code}
            </Button>
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(classroom.invite_link || `${siteUrl}/join/${classroom.class_code}`, t('Link', 'Линкът'))}>
              <Link2 className="h-3.5 w-3.5 mr-1" />
              🔗 {t('Copy invite', 'Копирай покана')}
            </Button>
          </div>
        </div>

        {/* Inline Create-another-class panel */}
        {showCreate && (
          <Card className="p-4 space-y-3 border-primary/30">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                {t('New class', 'Нов клас')}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>{t('Class name', 'Име на класа')}</Label>
                <Input
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder={t('e.g. 11B', 'напр. 11Б')}
                />
              </div>
              <div>
                <Label>{t('Subject', 'Предмет')}</Label>
                <select
                  value={createSubject}
                  onChange={(e) => setCreateSubject(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">{t('— Select subject —', '— Избери предмет —')}</option>
                  {SUBJECT_CATALOG.map((s) => (
                    <option key={s.key} value={s.key}>
                      {subjectTitle(s, lang as 'bg' | 'en')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button
              onClick={createClassroom}
              disabled={creating || !createName.trim() || !createSubject}
              size="sm"
              className="sim-gradient border-0"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              {t('Create class', 'Създай клас')}
            </Button>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{students.length}</p>
            <p className="text-xs text-muted-foreground">📊 {t('Students', 'Ученика')}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{activeThisWeek}</p>
            <p className="text-xs text-muted-foreground">✅ {t('Active this week', 'Активни тази седмица')}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{needsHelp}</p>
            <p className="text-xs text-muted-foreground">⚠️ {t('Need help', 'Нуждаят се от помощ')}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{assignments.length}</p>
            <p className="text-xs text-muted-foreground">📋 {t('Assignments', 'Задачи')}</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="students">
          <TabsList>
            <TabsTrigger value="students">👥 {t('Students', 'Ученици')}</TabsTrigger>
            <TabsTrigger value="assignments">📋 {t('Assignments', 'Задачи')}</TabsTrigger>
            <TabsTrigger value="settings">⚙️ {t('Settings', 'Настройки')}</TabsTrigger>
          </TabsList>

          {/* ── Students Tab ── */}
          <TabsContent value="students" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{students.length} {t('enrolled', 'записани')}</p>
              <Button variant="outline" size="sm" onClick={exportCSV}>
                <Download className="h-3.5 w-3.5 mr-1" /> CSV
              </Button>
            </div>
            {students.length === 0 ? (
              <Card className="p-8 text-center">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t('No students yet. Share the class code to invite them!', 'Все още няма ученици. Сподели кода, за да ги поканиш!')}
                </p>
                <p className="text-lg font-mono font-bold text-primary mt-2">{classroom.class_code}</p>
              </Card>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">{t('Nickname', 'Псевдоним')}</th>
                      <th className="text-center px-3 py-2.5 font-medium text-muted-foreground">XP</th>
                      <th className="text-center px-3 py-2.5 font-medium text-muted-foreground">{t('Status', 'Статус')}</th>
                      <th className="text-center px-3 py-2.5 font-medium text-muted-foreground">{t('Joined', 'Присъединил се')}</th>
                      <th className="px-3 py-2.5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {students.map(s => {
                      const status = getStatusBadge(s);
                      return (
                        <tr key={s.id} className="hover:bg-muted/30 cursor-pointer" onClick={() => { setSelectedStudent(s.student_id); setFeedbackNote(''); }}>
                          <td className="px-4 py-3 font-medium text-foreground">{s.profile?.display_name || s.profile?.full_name || '—'}</td>
                          <td className="text-center px-3 py-3">{s.profile?.total_xp || 0}</td>
                          <td className="text-center px-3 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>{status.label}</span>
                          </td>
                          <td className="text-center px-3 py-3 text-muted-foreground text-xs">
                            {new Date(s.joined_at).toLocaleDateString('bg-BG')}
                          </td>
                          <td className="px-3 py-3">
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Student detail drawer */}
            {selectedStudent && (() => {
              const s = students.find(st => st.student_id === selectedStudent);
              if (!s) return null;
              return (
                <Card className="p-5 space-y-4 border-primary/20">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">
                      {s.profile?.display_name || s.profile?.full_name || '—'} · {s.profile?.total_xp || 0} XP
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Label>{t('Private note for student', 'Частна бележка за ученика')}</Label>
                    <Textarea
                      value={feedbackNote}
                      onChange={e => setFeedbackNote(e.target.value)}
                      placeholder={t('Add a private note...', 'Добави частна бележка...')}
                      rows={3}
                    />
                    <Button size="sm" className="mt-2" onClick={() => saveFeedback(s.student_id)} disabled={!feedbackNote.trim()}>
                      <Save className="h-3.5 w-3.5 mr-1" /> {t('Save note', 'Запази бележката')}
                    </Button>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive border-destructive/50">
                        <UserMinus className="h-3.5 w-3.5 mr-1" /> {t('Remove from class', 'Премахни от класа')}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('Remove student?', 'Премахни ученик?')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t(
                            'The student will lose access to class assignments but keep their progress.',
                            'Ученикът ще загуби достъп до задачите на класа, но ще запази прогреса си.'
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('Cancel', 'Отказ')}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => removeStudent(s.student_id)} className="bg-destructive text-destructive-foreground">
                          {t('Remove', 'Премахни')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Card>
              );
            })()}
          </TabsContent>

          {/* ── Assignments Tab ── */}
          <TabsContent value="assignments" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{assignments.length} {t('assignments', 'задачи')}</p>
              <Button size="sm" onClick={() => setShowAssignModal(true)} className="sim-gradient border-0">
                <Plus className="h-3.5 w-3.5 mr-1" /> {t('Assign task', 'Назначи задача')}
              </Button>
            </div>

            {assignments.length === 0 ? (
              <Card className="p-8 text-center">
                <ClipboardList className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t('No assignments yet. Create one to get started.', 'Все още няма задачи. Създай първата.')}
                </p>
              </Card>
            ) : (
              <div className="space-y-2">
                {assignments.map(a => (
                  <Card key={a.id} className="p-4 flex items-center gap-3">
                    {typeIcon(a.assignment_type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{assignmentLabel(a)}</p>
                      {a.note && <p className="text-xs text-muted-foreground truncate">{a.note}</p>}
                    </div>
                    {a.due_date && (
                      <Badge variant="outline" className="text-xs shrink-0">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(a.due_date).toLocaleDateString('bg-BG')}
                      </Badge>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {/* Assign Modal */}
            {showAssignModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAssignModal(false)}>
                <Card className="w-full max-w-md p-6 space-y-4 mx-4" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{t('Assign task to class', 'Назначи задача на класа')}</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowAssignModal(false)}><X className="h-4 w-4" /></Button>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('Type', 'Тип')}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { val: 'learn_module', icon: '📖', label: t('Module', 'Модул') },
                        { val: 'case_study', icon: '📂', label: t('Case', 'Казус') },
                        { val: 'journey_stage', icon: '🗺️', label: t('Stage', 'Етап') },
                      ].map(opt => (
                        <button
                          key={opt.val}
                          onClick={() => setAssignType(opt.val)}
                          className={`p-3 rounded-lg border text-center text-sm transition-colors ${
                            assignType === opt.val ? 'border-primary bg-primary/10 font-medium' : 'border-border hover:border-primary/30'
                          }`}
                        >
                          <span className="text-lg block">{opt.icon}</span>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {assignType === 'learn_module' && (
                    <div>
                      <Label>{t('Select module', 'Избери модул')}</Label>
                      <p className="text-[11px] text-muted-foreground mb-1">
                        {t('Showing modules for', 'Показани модули за')}:{' '}
                        <span className="font-medium">
                          {subjectLabel(classroom.subject_key, lang as 'bg' | 'en')}
                        </span>
                      </p>
                      {(() => {
                        const classroomSubject = classroom.subject_key || DEFAULT_SUBJECT_KEY;
                        const filtered = showAllSubjectModules
                          ? modules
                          : modules.filter(
                              (m) => (m.subject_key || DEFAULT_SUBJECT_KEY) === classroomSubject,
                            );
                        return (
                          <select
                            value={assignModuleSlug}
                            onChange={(e) => setAssignModuleSlug(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="">{t('— Select —', '— Избери —')}</option>
                            {filtered.map((m) => (
                              <option key={m.slug} value={m.slug}>
                                {m.title}
                                {showAllSubjectModules
                                  ? ` — ${subjectLabel(m.subject_key, lang as 'bg' | 'en')}`
                                  : ''}
                              </option>
                            ))}
                            {filtered.length === 0 && (
                              <option disabled>
                                {t('No modules yet for this subject', 'Все още няма модули за този предмет')}
                              </option>
                            )}
                          </select>
                        );
                      })()}
                      <label className="mt-2 flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showAllSubjectModules}
                          onChange={(e) => setShowAllSubjectModules(e.target.checked)}
                        />
                        {t('Show modules from other subjects', 'Покажи модули от други предмети')}
                      </label>
                    </div>
                  )}
                  {assignType === 'case_study' && (
                    <div>
                      <Label>{t('Select case', 'Избери казус')}</Label>
                      <select value={assignCaseId} onChange={e => setAssignCaseId(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">{t('— Select —', '— Избери —')}</option>
                        {caseStudies.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
                    </div>
                  )}
                  {assignType === 'journey_stage' && (
                    <div>
                      <Label>{t('Select stage', 'Избери етап')} (1–6)</Label>
                      <Input type="number" min={1} max={6} value={assignStage} onChange={e => setAssignStage(Number(e.target.value))} />
                    </div>
                  )}

                  <div>
                    <Label>{t('Due date (optional)', 'Краен срок (по избор)')}</Label>
                    <Input type="date" value={assignDueDate} onChange={e => setAssignDueDate(e.target.value)} />
                  </div>
                  <div>
                    <Label>{t('Note to students (optional)', 'Бележка за учениците (по избор)')}</Label>
                    <Textarea value={assignNote} onChange={e => setAssignNote(e.target.value)} maxLength={200} rows={2} />
                  </div>

                  <Button onClick={createAssignment} className="w-full sim-gradient border-0">
                    {t('Assign', 'Назначи')}
                  </Button>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* ── Settings Tab ── */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="p-5 space-y-4">
              <div>
                <Label>{t('Classroom name', 'Име на класа')}</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={editName} onChange={e => setEditName(e.target.value)} />
                  <Button onClick={saveClassroomName} variant="outline"><Save className="h-4 w-4" /></Button>
                </div>
              </div>
              <div>
                <Label>{t('Class code', 'Код на класа')}</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-lg font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded">{classroom.class_code}</code>
                  <Button variant="outline" size="sm" onClick={regenerateCode}>
                    <RefreshCw className="h-3.5 w-3.5 mr-1" /> {t('New code', 'Нов код')}
                  </Button>
                </div>
              </div>
              <div>
                <Label>{t('Invite link', 'Линк за покана')}</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input value={classroom.invite_link || `${siteUrl}/join/${classroom.class_code}`} readOnly />
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(classroom.invite_link || `${siteUrl}/join/${classroom.class_code}`, t('Link', 'Линкът'))}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-5 space-y-3">
              <div>
                <Label>{t('Subject', 'Предмет')}</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {t(
                    'The subject this class studies. Students see the class under this subject in "My Subjects".',
                    'Предметът, който този клас изучава. Учениците виждат класа под този предмет в „Моите предмети“.',
                  )}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={pendingSubject ?? editSubject}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPendingSubject(v === (classroom.subject_key || DEFAULT_SUBJECT_KEY) ? null : v);
                  }}
                >
                  {SUBJECT_CATALOG.map((s) => (
                    <option key={s.key} value={s.key}>
                      {subjectTitle(s, lang as 'bg' | 'en')}
                      {s.availability !== 'playable'
                        ? ` (${s.availability === 'preview' ? t('preview', 'преглед') : t('planned', 'планиран')})`
                        : ''}
                    </option>
                  ))}
                </select>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={!pendingSubject || savingSubject}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {t('Change subject', 'Смени предмета')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {t('Change subject for this class?', 'Смяна на предмет за този клас?')}
                      </AlertDialogTitle>
                      <AlertDialogDescription className="space-y-2">
                        <span className="block">
                          {t(
                            'From',
                            'От',
                          )}:{' '}
                          <strong>
                            {subjectLabel(classroom.subject_key, lang as 'bg' | 'en')}
                          </strong>
                          {' → '}
                          <strong>
                            {subjectLabel(pendingSubject, lang as 'bg' | 'en')}
                          </strong>
                        </span>
                        <span className="block text-destructive">
                          {t(
                            'Existing assignments and student progress are kept, but assigned modules may no longer belong to the new subject. Review your assignments after changing.',
                            'Съществуващите задачи и напредъкът на учениците се запазват, но зададените модули може вече да не принадлежат към новия предмет. Прегледай задачите след смяната.',
                          )}
                        </span>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('Cancel', 'Отказ')}</AlertDialogCancel>
                      <AlertDialogAction onClick={changeClassroomSubject}>
                        {t('Confirm change', 'Потвърди смяната')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>

            <Card className="p-5 border-destructive/30 bg-destructive/5 space-y-3">
              <h3 className="font-semibold text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {t('Danger Zone', 'Опасна зона')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('Dissolving removes all students and assignments. This cannot be undone.', 'Разпускането премахва всички ученици и задачи. Това е необратимо.')}
              </p>
              <div className="space-y-2">
                <Label>{t('Type classroom name to confirm:', 'Въведи името на класа за потвърждение:')}</Label>
                <Input value={dissolveName} onChange={e => setDissolveName(e.target.value)} placeholder={classroom.name} />
                <Button
                  variant="outline"
                  className="text-destructive border-destructive/50"
                  disabled={dissolveName !== classroom.name}
                  onClick={dissolveClassroom}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> {t('Dissolve classroom', 'Разпусни класа')}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
