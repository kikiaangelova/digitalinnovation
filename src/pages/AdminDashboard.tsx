import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import CaseStepEditor from '@/components/admin/CaseStepEditor';
import {
  BookOpen, Users, FileText, Download, Plus, Eye, EyeOff,
  Trash2, ChevronDown, ChevronRight, MessageSquare, Award, BarChart3, Edit,
} from 'lucide-react';

interface StudentXpSummary {
  user_id: string;
  full_name: string;
  display_name: string;
  email: string;
  total_xp: number;
  cases_completed: number;
  sessions: { case_id: string; xp_earned: number; completion_status: string }[];
  quiz_avg: number;
  quiz_count: number;
  sim_week: number;
  sim_complete: boolean;
  sim_grade: string | null;
  startup_pct: number;
  startup_submitted: boolean;
  last_active: string | null;
  role: string;
}

interface CaseStudyAdmin {
  id: string;
  title: string;
  topic: string | null;
  difficulty: string;
  published: boolean;
  created_at: string;
}

interface SubmissionAdmin {
  id: string;
  case_study_id: string;
  user_id: string;
  is_draft: boolean;
  total_score: number | null;
  max_score: number | null;
  submitted_at: string | null;
}

interface CaseSessionAdmin {
  user_id: string;
  case_id: string;
  xp_earned: number;
  current_step: number;
  completion_status: string;
  last_saved: string | null;
}

interface AnswerHistoryAdmin {
  id: string;
  user_id: string;
  case_id: string;
  question_id: string;
  version_number: number;
  answer_text: string;
  created_at: string;
}

const DIFFICULTY_LABELS: Record<string, { en: string; bg: string }> = {
  beginner: { en: 'Beginner', bg: 'Начинаещ' },
  intermediate: { en: 'Intermediate', bg: 'Средно ниво' },
  advanced: { en: 'Advanced', bg: 'Напреднал' },
};

export default function AdminDashboard() {
  const { isAdmin, user, authLoading, roleLoading } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const [cases, setCases] = useState<CaseStudyAdmin[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionAdmin[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [sessionMap, setSessionMap] = useState<Record<string, CaseSessionAdmin>>({});
  const [showCreate, setShowCreate] = useState(false);
  const [expandedSub, setExpandedSub] = useState<string | null>(null);
  const [subResponses, setSubResponses] = useState<any[]>([]);
  const [subHistory, setSubHistory] = useState<AnswerHistoryAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentXpData, setStudentXpData] = useState<StudentXpSummary[]>([]);
  const [editingCaseSteps, setEditingCaseSteps] = useState<string | null>(null);

  // Create form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newDiff, setNewDiff] = useState('intermediate');
  const [newMinutes, setNewMinutes] = useState(60);
  const [newReadingUrl, setNewReadingUrl] = useState('');
  const [newReadingLabel, setNewReadingLabel] = useState('');

  const XP_LEVELS = [
    { name: 'Explorer', min: 0 }, { name: 'Apprentice', min: 101 }, { name: 'Strategist', min: 251 },
    { name: 'Innovator', min: 501 }, { name: 'Visionary', min: 1001 }, { name: 'Legend', min: 2001 },
  ];
  const getLevel = (xp: number) => {
    for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
      if (xp >= XP_LEVELS[i].min) return XP_LEVELS[i].name;
    }
    return XP_LEVELS[0].name;
  };

  const STARTUP_SECTIONS = ['problem', 'customer', 'value_proposition', 'digital_product', 'business_model', 'growth_strategy', 'final_pitch'];

  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || roleLoading) return;
    if (!user) {
      navigate('/auth', { replace: true });
      return;
    }
    if (!isAdmin) return;
    const fetchData = async () => {
      try {
        const { data: result, error } = await supabase.functions.invoke('admin-data', {
          body: { scope: 'dashboard' },
        });
        if (error || !result) {
          const msg = error?.message || t('Failed to load admin data', 'Грешка при зареждане на данните');
          console.error('[AdminDashboard] admin-data error:', error);
          setFetchError(msg);
          toast.error(msg);
          setLoading(false);
          return;
        }

        const casesData = result.cases || [];
        const subsData = result.submissions || [];
        const profilesData = result.profiles || [];
        const sessionsData = result.case_sessions || [];
        const quizData = result.quiz_results || [];
        const simData = result.sim_progress || [];
        const startupData = result.startups || [];
        const authUsers = result.auth_users || [];
        const rolesData = result.user_roles || [];

        setCases(casesData);
        setSubmissions(subsData);
        const pm: Record<string, string> = {};
        profilesData.forEach((p: any) => { pm[p.user_id] = p.full_name || t('Unknown', 'Неизвестен'); });
        setProfiles(pm);

        // Email map from auth users
        const emailMap: Record<string, string> = {};
        const lastSignInMap: Record<string, string | null> = {};
        authUsers.forEach((u: any) => {
          emailMap[u.id] = u.email || '';
          lastSignInMap[u.id] = u.last_sign_in_at || null;
        });

        // Role map
        const roleMap: Record<string, string> = {};
        rolesData.forEach((r: any) => {
          const existing = roleMap[r.user_id];
          const priority: Record<string, number> = { admin: 4, teacher_verified: 3, teacher_pending: 2, student: 1 };
          if (!existing || (priority[r.role] || 0) > (priority[existing] || 0)) {
            roleMap[r.user_id] = r.role;
          }
        });

        const sm: Record<string, CaseSessionAdmin> = {};
        sessionsData.forEach((s: any) => {
          sm[`${s.user_id}:${s.case_id}`] = s;
        });
        setSessionMap(sm);

        // Build per-student summary with ALL data
        const xpSummaries: StudentXpSummary[] = profilesData.map((p: any) => {
          const userSessions = sessionsData.filter((s: any) => s.user_id === p.user_id);
          const completedSubs = subsData.filter((s: any) => s.user_id === p.user_id && !s.is_draft);
          
          // Quiz scores
          const userQuizzes = quizData.filter((q: any) => q.user_id === p.user_id);
          const quizAvg = userQuizzes.length > 0
            ? Math.round(userQuizzes.reduce((sum: number, q: any) => sum + (q.max_score > 0 ? (q.score / q.max_score) * 100 : 0), 0) / userQuizzes.length)
            : 0;

          // Simulator
          const userSim = simData.find((s: any) => s.user_id === p.user_id);

          // Startup
          const userStartup = startupData.find((s: any) => s.user_id === p.user_id);
          let startupPct = 0;
          if (userStartup) {
            const filled = STARTUP_SECTIONS.filter(sec => ((userStartup[sec] || '').trim().length > 20)).length;
            startupPct = Math.round((filled / STARTUP_SECTIONS.length) * 100);
          }

          // Last active = most recent of: profile updated_at, last_sign_in, session last_saved
          const dates = [p.updated_at, lastSignInMap[p.user_id]].filter(Boolean);
          userSessions.forEach((s: any) => { if (s.last_saved) dates.push(s.last_saved); });
          const lastActive = dates.length > 0
            ? dates.sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime())[0]
            : null;

          return {
            user_id: p.user_id,
            full_name: p.full_name || t('Unknown', 'Неизвестен'),
            display_name: p.display_name || '',
            email: emailMap[p.user_id] || '',
            total_xp: p.total_xp || 0,
            cases_completed: completedSubs.length,
            sessions: userSessions.map((s: any) => ({
              case_id: s.case_id,
              xp_earned: s.xp_earned,
              completion_status: s.completion_status,
            })),
            quiz_avg: quizAvg,
            quiz_count: userQuizzes.length,
            sim_week: userSim?.current_week || 0,
            sim_complete: userSim?.is_complete || false,
            sim_grade: userSim?.grade || null,
            startup_pct: startupPct,
            startup_submitted: userStartup?.is_submitted || false,
            last_active: lastActive,
            role: roleMap[p.user_id] || 'student',
          };
        });

        xpSummaries.sort((a, b) => b.total_xp - a.total_xp);
        setStudentXpData(xpSummaries);
      } catch (err) {
        console.error('[AdminDashboard] fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin, user, authLoading, roleLoading]);

  const togglePublish = async (caseId: string, published: boolean) => {
    await supabase.from('case_studies').update({ published: !published }).eq('id', caseId);
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, published: !published } : c));
    toast.success(published ? t('Case unpublished', 'Казусът е скрит') : t('Case published', 'Казусът е публикуван'));
  };

  const createCase = async () => {
    if (!newTitle.trim()) { toast.error(t('Title required', 'Заглавието е задължително')); return; }
    const { data, error } = await supabase.from('case_studies').insert({
      title: newTitle,
      description: newDesc,
      topic: newTopic,
      difficulty: newDiff as any,
      est_minutes: newMinutes,
      reading_url: newReadingUrl || null,
      reading_button_label: newReadingLabel || null,
      published: false,
      created_by: user?.id,
    }).select('id, title, topic, difficulty, published, created_at').single();

    if (error) { toast.error(t('Failed to create case', 'Грешка при създаване на казус')); return; }
    if (data) {
      setCases(prev => [data, ...prev]);
      setShowCreate(false);
      setNewTitle(''); setNewDesc(''); setNewTopic(''); setNewReadingUrl(''); setNewReadingLabel('');
      toast.success(t('Case created', 'Казусът е създаден'));
    }
  };

  const viewSubmission = async (subId: string, userId: string, caseId: string) => {
    if (expandedSub === subId) { setExpandedSub(null); return; }
    setExpandedSub(subId);
    const [responsesRes, historyRes] = await Promise.all([
      supabase.from('responses').select('id, question_id, answer, score, feedback').eq('submission_id', subId),
      (supabase as any)
        .from('answer_history')
        .select('id, user_id, case_id, question_id, version_number, answer_text, created_at')
        .eq('user_id', userId)
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })
        .limit(30),
    ]);
    setSubResponses(responsesRes.data || []);
    setSubHistory((historyRes.data || []) as AnswerHistoryAdmin[]);
  };

  const updateScore = async (responseId: string, score: number, feedback: string) => {
    await supabase.from('responses').update({ score, feedback }).eq('id', responseId);
    setSubResponses(prev => prev.map(r => r.id === responseId ? { ...r, score, feedback } : r));
    toast.success(t('Score updated', 'Оценката е обновена'));
  };

  const exportCSV = () => {
    const headers = [t('Student', 'Ученик'), t('Case', 'Казус'), t('Score', 'Оценка'), t('Max Score', 'Макс. оценка'), '%', t('Submitted At', 'Подадено на')];
    const rows = submissions.map(s => {
      const caseName = cases.find(c => c.id === s.case_study_id)?.title || '';
      const studentName = profiles[s.user_id] || t('Unknown', 'Неизвестен');
      const pct = s.max_score ? Math.round(((s.total_score || 0) / s.max_score) * 100) : 0;
      return [studentName, caseName, s.total_score || 0, s.max_score || 0, `${pct}%`, s.submitted_at || ''].join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'grades_export.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success(t('Grades exported', 'Оценките са експортирани'));
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          {t('Loading...', 'Зареждане...')}
        </div>
      </div>
    );
  }

  if (!user) return null; // redirect handled in useEffect

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-destructive font-medium">{t('⚠ Admin access required', '⚠ Необходим е администраторски достъп')}</p>
          <p className="text-muted-foreground text-sm">{t('You are logged in but do not have admin privileges.', 'Влезли сте в системата, но нямате администраторски права.')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{t('Admin Dashboard', 'Администраторско табло')}</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-1" /> {t('Export Grades', 'Експорт на оценки')}
            </Button>
            <Button size="sm" onClick={() => setShowCreate(!showCreate)} className="sim-gradient border-0">
              <Plus className="h-4 w-4 mr-1" /> {t('New Case', 'Нов казус')}
            </Button>
          </div>
        </div>

        {/* Platform-wide Stats */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: t('Total Users', 'Общо потребители'), value: studentXpData.length, icon: <Users className="h-4 w-4" /> },
              { label: t('Total XP Earned', 'Общо XP'), value: studentXpData.reduce((s, u) => s + u.total_xp, 0).toLocaleString(), icon: <Award className="h-4 w-4" /> },
              { label: t('Avg Quiz Score', 'Ср. тест оценка'), value: (() => { const withQuiz = studentXpData.filter(u => u.quiz_count > 0); return withQuiz.length > 0 ? Math.round(withQuiz.reduce((s, u) => s + u.quiz_avg, 0) / withQuiz.length) + '%' : '—'; })(), icon: <BarChart3 className="h-4 w-4" /> },
              { label: t('Cases Solved', 'Решени казуси'), value: studentXpData.reduce((s, u) => s + u.cases_completed, 0), icon: <BookOpen className="h-4 w-4" /> },
              { label: t('Simulator Sessions', 'Симулатор сесии'), value: studentXpData.filter(u => u.sim_week > 0).length, icon: <FileText className="h-4 w-4" /> },
              { label: t('Startup Projects', 'Стартъп проекти'), value: studentXpData.filter(u => u.startup_pct > 0).length, icon: <Plus className="h-4 w-4" /> },
            ].map((stat, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">{stat.icon}<span className="text-xs">{stat.label}</span></div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Create form */}
        {showCreate && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-foreground">{t('Create New Case Study', 'Създай нов казус')}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>{t('Title', 'Заглавие')}</Label>
                <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder={t('Case title', 'Заглавие на казуса')} />
              </div>
              <div>
                <Label>{t('Topic', 'Тема')}</Label>
                <Input value={newTopic} onChange={e => setNewTopic(e.target.value)} placeholder={t('e.g., Digital Strategy', 'напр. Дигитална стратегия')} />
              </div>
              <div>
                <Label>{t('Difficulty', 'Трудност')}</Label>
                <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={newDiff} onChange={e => setNewDiff(e.target.value)}>
                  <option value="beginner">{t('Beginner', 'Начинаещ')}</option>
                  <option value="intermediate">{t('Intermediate', 'Средно ниво')}</option>
                  <option value="advanced">{t('Advanced', 'Напреднал')}</option>
                </select>
              </div>
              <div>
                <Label>{t('Est. Minutes', 'Прибл. минути')}</Label>
                <Input type="number" value={newMinutes} onChange={e => setNewMinutes(parseInt(e.target.value))} />
              </div>
              <div>
                <Label>{t('Reading URL (optional)', 'URL за четене (незадълж.)')}</Label>
                <Input value={newReadingUrl} onChange={e => setNewReadingUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <Label>{t('Reading Button Label', 'Етикет на бутон за четене')}</Label>
                <Input value={newReadingLabel} onChange={e => setNewReadingLabel(e.target.value)} placeholder={t('Open Required Reading', 'Отвори задължително четиво')} />
              </div>
            </div>
            <div>
              <Label>{t('Description', 'Описание')}</Label>
              <Textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder={t('Describe the case scenario...', 'Опишете сценария на казуса...')} />
            </div>
            <div className="flex gap-2">
              <Button onClick={createCase} className="sim-gradient border-0">{t('Create Case', 'Създай казус')}</Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>{t('Cancel', 'Отказ')}</Button>
            </div>
          </div>
        )}

        {/* Cases */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">{t('Case Studies', 'Казуси')}</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('Title', 'Заглавие')}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('Topic', 'Тема')}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('Difficulty', 'Трудност')}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('Status', 'Статус')}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('Actions', 'Действия')}</th>
                </tr>
              </thead>
              <tbody>
                {cases.map(c => {
                  const diffLabel = DIFFICULTY_LABELS[c.difficulty];
                  const isEditingSteps = editingCaseSteps === c.id;
                  return (
                    <tr key={c.id} className="border-t border-border">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{c.title}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{c.topic || '—'}</td>
                      <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{diffLabel ? (lang === 'bg' ? diffLabel.bg : diffLabel.en) : c.difficulty}</Badge></td>
                      <td className="px-4 py-3">
                        {c.published ? (
                          <Badge className="bg-sim-success/10 text-sim-success border-0 text-xs">{t('Published', 'Публикуван')}</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">{t('Draft', 'Чернова')}</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => togglePublish(c.id, c.published)}>
                          {c.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditingCaseSteps(isEditingSteps ? null : c.id)} title={t('Edit Steps', 'Редактирай стъпки')}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {cases.map(c => editingCaseSteps === c.id && (
                  <tr key={`editor-${c.id}`}>
                    <td colSpan={5} className="px-4 py-4 bg-accent/30">
                      <CaseStepEditor caseId={c.id} caseTopic={c.topic} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submissions */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">{t('Recent Submissions', 'Скорошни подавания')}</h2>
          <div className="space-y-3">
            {submissions.slice(0, 20).map(s => {
              const caseName = cases.find(c => c.id === s.case_study_id)?.title || t('Unknown', 'Неизвестен');
              const isExpanded = expandedSub === s.id;
              const session = sessionMap[`${s.user_id}:${s.case_study_id}`];
              return (
                <div key={s.id} className="rounded-xl border border-border bg-card">
                  <button
                    onClick={() => viewSubmission(s.id, s.user_id, s.case_study_id)}
                    className="w-full p-4 flex items-center justify-between text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{profiles[s.user_id] || t('Unknown Student', 'Неизвестен ученик')}</p>
                      <p className="text-xs text-muted-foreground">{caseName} · {s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {session && <Badge variant="outline">XP {session.xp_earned}</Badge>}
                      <Badge variant="outline">{s.total_score || 0}/{s.max_score || 0}</Badge>
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-border p-4 space-y-4">
                      {subResponses.map(r => (
                        <div key={r.id} className="rounded-lg border border-border p-3 space-y-2">
                          <p className="text-sm text-foreground">
                            <strong>{t('Answer:', 'Отговор:')}</strong> {r.answer ? (typeof r.answer === 'string' ? r.answer : JSON.stringify(r.answer)) : t('No answer', 'Няма отговор')}
                          </p>
                          <div className="flex gap-2 items-end">
                            <div className="flex-1">
                              <Label className="text-xs">{t('Score', 'Оценка')}</Label>
                              <Input
                                type="number"
                                defaultValue={r.score || 0}
                                className="h-8"
                                onBlur={e => {
                                  const newScore = parseInt(e.target.value);
                                  if (!isNaN(newScore)) updateScore(r.id, newScore, r.feedback || '');
                                }}
                              />
                            </div>
                            <div className="flex-[3]">
                              <Label className="text-xs">{t('Feedback', 'Обратна връзка')}</Label>
                              <Input
                                defaultValue={r.feedback || ''}
                                className="h-8"
                                placeholder={t('Add feedback...', 'Добавете обратна връзка...')}
                                onBlur={e => updateScore(r.id, r.score || 0, e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="rounded-lg border border-border p-3 space-y-2">
                        <p className="text-sm font-semibold text-foreground">{t('Answer History', 'История на отговорите')}</p>
                        {subHistory.length === 0 ? (
                          <p className="text-xs text-muted-foreground">{t('No answer history yet.', 'Все още няма история на отговорите.')}</p>
                        ) : (
                          <div className="space-y-2 max-h-56 overflow-auto pr-1">
                            {subHistory.map(h => (
                              <div key={h.id} className="rounded-md border border-border/70 p-2">
                                <p className="text-xs text-muted-foreground">Q: {h.question_id} · v{h.version_number} · {new Date(h.created_at).toLocaleString()}</p>
                                <p className="text-sm text-foreground whitespace-pre-wrap">{h.answer_text || '—'}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {submissions.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">{t('No submissions yet', 'Все още няма подавания')}</p>
            )}
          </div>
        </div>

        {/* Comprehensive User List */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {t('All Participants', 'Всички участници')} ({studentXpData.length})
          </h2>
          <div className="rounded-xl border border-border overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">{t('Name / Username', 'Име / Потребител')}</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">{t('Email', 'Имейл')}</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">{t('Role', 'Роля')}</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-muted-foreground">XP</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">{t('Level', 'Ниво')}</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-muted-foreground">{t('Quiz Avg', 'Ср. тест')}</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-muted-foreground">{t('Cases', 'Казуси')}</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">{t('Simulator', 'Симулатор')}</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-muted-foreground">{t('Startup %', 'Стартъп %')}</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">{t('Last Active', 'Последно активен')}</th>
                </tr>
              </thead>
              <tbody>
                {studentXpData.map(s => {
                  const level = getLevel(s.total_xp);
                  const roleLabel: Record<string, string> = {
                    admin: 'Admin',
                    teacher_verified: lang === 'bg' ? 'Учител' : 'Teacher',
                    teacher_pending: lang === 'bg' ? 'Учител (чакащ)' : 'Teacher (pending)',
                    student: lang === 'bg' ? 'Студент' : 'Student',
                  };
                  return (
                    <tr key={s.user_id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2.5">
                        <div>
                          <p className="text-sm font-medium text-foreground truncate max-w-[160px]">{s.full_name}</p>
                          {s.display_name && <p className="text-xs text-muted-foreground truncate max-w-[160px]">@{s.display_name}</p>}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground truncate max-w-[180px]">{s.email}</td>
                      <td className="px-3 py-2.5">
                        <Badge variant={s.role === 'admin' ? 'default' : 'outline'} className="text-xs">
                          {roleLabel[s.role] || s.role}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <Badge className="bg-primary/10 text-primary border-0 text-xs">{s.total_xp}</Badge>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="text-xs font-medium text-foreground">{level}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right text-sm">
                        {s.quiz_count > 0 ? (
                          <span className="text-foreground">{s.quiz_avg}% <span className="text-muted-foreground text-xs">({s.quiz_count})</span></span>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-right text-sm text-foreground">{s.cases_completed}</td>
                      <td className="px-3 py-2.5">
                        {s.sim_week > 0 ? (
                          <div className="text-xs">
                            <span className="text-foreground">{t('Wk', 'Сд')} {s.sim_week}</span>
                            {s.sim_complete && <Badge className="ml-1 bg-emerald-500/10 text-emerald-600 border-0 text-[10px]">{s.sim_grade || '✓'}</Badge>}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        {s.startup_pct > 0 ? (
                          <span className={`text-xs font-medium ${s.startup_submitted ? 'text-emerald-600' : 'text-foreground'}`}>
                            {s.startup_pct}%{s.startup_submitted ? ' ✓' : ''}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">
                        {s.last_active ? new Date(s.last_active).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  );
                })}
                {studentXpData.length === 0 && (
                  <tr><td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">{loading ? t('Loading...', 'Зареждане...') : t('No participants yet', 'Все още няма участници')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
