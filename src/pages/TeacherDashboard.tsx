import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import LearningOutcomes, { calcOutcomeScores, LEARNING_OUTCOMES } from '@/components/dashboard/LearningOutcomes';
import Leaderboard from '@/components/dashboard/Leaderboard';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import {
  Users, BookOpen, Rocket, Activity, Search, ChevronDown, ChevronRight,
  MessageSquare, Sparkles, Download, TrendingUp, Target, BarChart3, User,
  Check, Clock, Send, ArrowLeft, Trophy, GraduationCap, Printer, FileText,
} from 'lucide-react';

// Types
interface ProfileData {
  user_id: string;
  full_name: string | null;
  bio: string | null;
  skills_tags: string[] | null;
  interests: string[] | null;
  cohort_id: string | null;
}

interface StartupProject {
  id: string;
  user_id: string;
  problem: string;
  customer: string;
  value_proposition: string;
  digital_product: string;
  business_model: string;
  growth_strategy: string;
  final_pitch: string;
  industry: string;
  is_submitted: boolean;
  created_at: string;
}

interface SimProgress {
  id: string;
  user_id: string;
  current_week: number;
  kpis: any;
  decisions: any;
  grade: string | null;
  is_complete: boolean;
}

interface Submission {
  id: string;
  user_id: string;
  case_study_id: string;
  total_score: number | null;
  max_score: number | null;
  submitted_at: string | null;
  is_draft: boolean;
}

interface CaseStudy {
  id: string;
  title: string;
  topic: string | null;
}

interface FeedbackRow {
  id: string;
  teacher_id: string;
  student_id: string;
  target_type: string;
  target_id: string;
  comment: string;
  created_at: string;
}

const SECTION_KEYS = ['problem', 'customer', 'value_proposition', 'digital_product', 'business_model', 'growth_strategy', 'final_pitch'] as const;

const SECTION_LABELS: Record<string, { en: string; bg: string }> = {
  problem: { en: 'Problem', bg: 'Проблем' },
  customer: { en: 'Customer', bg: 'Клиент' },
  value_proposition: { en: 'Value Proposition', bg: 'Стойностно предложение' },
  digital_product: { en: 'Digital Product', bg: 'Дигитален продукт' },
  business_model: { en: 'Business Model', bg: 'Бизнес модел' },
  growth_strategy: { en: 'Growth Strategy', bg: 'Стратегия за растеж' },
  final_pitch: { en: 'Final Pitch', bg: 'Финално представяне' },
};

const COLORS = ['hsl(226 70% 55%)', 'hsl(173 58% 39%)', 'hsl(38 92% 50%)', 'hsl(280 60% 55%)', 'hsl(0 72% 51%)'];

export default function TeacherDashboard() {
  const { isAdmin, user } = useAuth();
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [projects, setProjects] = useState<StartupProject[]>([]);
  const [simProgress, setSimProgress] = useState<SimProgress[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackTarget, setFeedbackTarget] = useState<{ type: string; id: string; studentId: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      const [profRes, projRes, simRes, subRes, caseRes, fbRes] = await Promise.all([
        supabase.from('profiles').select('user_id, full_name, bio, skills_tags, interests, cohort_id'),
        supabase.from('startup_projects').select('*').order('created_at', { ascending: false }),
        supabase.from('simulator_progress').select('*'),
        supabase.from('submissions').select('id, user_id, case_study_id, total_score, max_score, submitted_at, is_draft').eq('is_draft', false),
        supabase.from('case_studies').select('id, title, topic'),
        supabase.from('teacher_feedback').select('*').order('created_at', { ascending: false }),
      ]);
      setProfiles(profRes.data || []);
      setProjects((projRes.data || []) as StartupProject[]);
      setSimProgress((simRes.data || []) as SimProgress[]);
      setSubmissions(subRes.data || []);
      setCases(caseRes.data || []);
      setFeedbacks((fbRes.data || []) as FeedbackRow[]);
      setLoading(false);
    };
    load();
  }, [isAdmin]);

  const profileMap = Object.fromEntries(profiles.map(p => [p.user_id, p]));
  const getName = (uid: string) => profileMap[uid]?.full_name || t('Unknown', 'Неизвестен');
  const caseMap = Object.fromEntries(cases.map(c => [c.id, c]));

  // Stats
  const totalStudents = profiles.length;
  const completedCases = submissions.length;
  const totalProjects = projects.length;
  const simCompleted = simProgress.filter(s => s.is_complete).length;
  const avgProgress = simProgress.length > 0
    ? Math.round(simProgress.reduce((a, s) => a + (s.current_week / 6) * 100, 0) / simProgress.length)
    : 0;

  // Filtered students
  const filteredProfiles = profiles.filter(p => {
    if (!search) return true;
    return (p.full_name || '').toLowerCase().includes(search.toLowerCase());
  });

  const getStudentProject = (uid: string) => projects.find(p => p.user_id === uid);
  const getStudentSim = (uid: string) => simProgress.find(s => s.user_id === uid);
  const getStudentSubs = (uid: string) => submissions.filter(s => s.user_id === uid);
  const getProjectProgress = (p: StartupProject) => {
    const filled = SECTION_KEYS.filter(k => ((p as any)[k] || '').trim().length > 10).length;
    return Math.round((filled / SECTION_KEYS.length) * 100);
  };

  const submitFeedback = async () => {
    if (!feedbackTarget || !feedbackText.trim() || !user) return;
    const { error } = await supabase.from('teacher_feedback').insert({
      teacher_id: user.id,
      student_id: feedbackTarget.studentId,
      target_type: feedbackTarget.type,
      target_id: feedbackTarget.id,
      comment: feedbackText.trim(),
    });
    if (error) { toast.error('Failed to save feedback'); return; }
    const newFb: FeedbackRow = {
      id: crypto.randomUUID(),
      teacher_id: user.id,
      student_id: feedbackTarget.studentId,
      target_type: feedbackTarget.type,
      target_id: feedbackTarget.id,
      comment: feedbackText.trim(),
      created_at: new Date().toISOString(),
    };
    setFeedbacks(prev => [newFb, ...prev]);
    setFeedbackText('');
    setFeedbackTarget(null);
    toast.success(t('Feedback saved', 'Обратната връзка е запазена'));
  };

  const requestAiFeedback = async (type: string, data: any) => {
    setAiLoading(true);
    setAiFeedback(null);
    try {
      const { data: result, error } = await supabase.functions.invoke('ai-feedback', {
        body: { type, data },
      });
      if (error) throw error;
      setAiFeedback(result.feedback);
    } catch (e: any) {
      toast.error(e?.message || 'AI feedback failed');
    } finally {
      setAiLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Student', 'Cases Completed', 'Avg Score', 'Simulator Week', 'Sim Grade', 'Project Progress'];
    const rows = profiles.map(p => {
      const subs = getStudentSubs(p.user_id);
      const sim = getStudentSim(p.user_id);
      const proj = getStudentProject(p.user_id);
      const avgScore = subs.length > 0
        ? Math.round(subs.reduce((a, s) => a + ((s.total_score || 0) / Math.max(s.max_score || 1, 1)) * 100, 0) / subs.length)
        : 0;
      return [
        getName(p.user_id), subs.length, `${avgScore}%`,
        sim ? `${sim.current_week}/6` : '0/6', sim?.grade || '-',
        proj ? `${getProjectProgress(proj)}%` : '0%',
      ].join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'student_progress.csv';
    a.click();
    toast.success(t('Exported', 'Експортирано'));
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          {t('Admin access required.', 'Изисква се администраторски достъп.')}
        </div>
      </div>
    );
  }

  // Case completion chart data
  const caseCompletionData = cases.map(c => ({
    name: (c.title || '').substring(0, 18),
    submissions: submissions.filter(s => s.case_study_id === c.id).length,
    avgScore: (() => {
      const subs = submissions.filter(s => s.case_study_id === c.id);
      if (!subs.length) return 0;
      return Math.round(subs.reduce((a, s) => a + ((s.total_score || 0) / Math.max(s.max_score || 1, 1)) * 100, 0) / subs.length);
    })(),
  }));

  // Simulator grade distribution
  const gradeDistribution = ['A', 'B', 'C', 'D'].map(g => ({
    name: g,
    value: simProgress.filter(s => s.grade === g).length,
  })).filter(g => g.value > 0);

  // Student detail view
  if (selectedStudent) {
    const prof = profileMap[selectedStudent];
    const proj = getStudentProject(selectedStudent);
    const sim = getStudentSim(selectedStudent);
    const subs = getStudentSubs(selectedStudent);
    const studentFeedbacks = feedbacks.filter(f => f.student_id === selectedStudent);

    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto max-w-5xl px-4 py-8 space-y-6">
          <Button variant="ghost" size="sm" onClick={() => { setSelectedStudent(null); setAiFeedback(null); }}>
            <ArrowLeft className="h-4 w-4 mr-1" /> {t('Back to Dashboard', 'Обратно към таблото')}
          </Button>

          {/* Student Info */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{prof?.full_name || 'Unknown'}</h1>
                <p className="text-sm text-muted-foreground">{prof?.bio || t('No bio', 'Няма биография')}</p>
              </div>
            </div>
            {prof?.skills_tags && prof.skills_tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {prof.skills_tags.map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
              </div>
            )}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="rounded-lg bg-accent/50 p-3 text-center">
                <p className="text-lg font-bold text-foreground">{subs.length}</p>
                <p className="text-xs text-muted-foreground">{t('Cases Done', 'Казуси')}</p>
              </div>
              <div className="rounded-lg bg-accent/50 p-3 text-center">
                <p className="text-lg font-bold text-foreground">{proj ? `${getProjectProgress(proj)}%` : '—'}</p>
                <p className="text-xs text-muted-foreground">{t('Startup', 'Стартъп')}</p>
              </div>
              <div className="rounded-lg bg-accent/50 p-3 text-center">
                <p className="text-lg font-bold text-foreground">{sim ? `${sim.current_week}/6` : '—'}</p>
                <p className="text-xs text-muted-foreground">{t('Simulator', 'Симулатор')}</p>
              </div>
            </div>
          </div>

          {/* Startup Project */}
          {proj && (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">{t('Startup Project', 'Стартъп проект')}</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => requestAiFeedback('startup_project', proj)} disabled={aiLoading}>
                    <Sparkles className="h-4 w-4 mr-1" /> {aiLoading ? '...' : t('AI Feedback', 'AI Оценка')}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setFeedbackTarget({ type: 'startup_project', id: proj.id, studentId: selectedStudent })}>
                    <MessageSquare className="h-4 w-4 mr-1" /> {t('Comment', 'Коментар')}
                  </Button>
                </div>
              </div>
              {proj.industry && <Badge variant="outline" className="mb-3 text-xs">{proj.industry}</Badge>}
              <div className="space-y-3">
                {SECTION_KEYS.map(key => {
                  const val = (proj as any)[key] as string || '';
                  return (
                    <div key={key}>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {SECTION_LABELS[key][lang === 'bg' ? 'bg' : 'en']}
                      </p>
                      <p className="text-sm text-foreground mt-0.5">
                        {val.trim() || <span className="italic text-muted-foreground">{t('Not filled', 'Не е попълнено')}</span>}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Feedback Display */}
          {aiFeedback && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-primary">{t('AI Mentor Feedback', 'AI Ментор Обратна Връзка')}</h3>
              </div>
              <p className="text-sm text-foreground whitespace-pre-wrap">{aiFeedback}</p>
            </div>
          )}

          {/* Case Study Results */}
          {subs.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-3">{t('Case Study Results', 'Резултати от казуси')}</h2>
              <div className="space-y-2">
                {subs.map(s => {
                  const cs = caseMap[s.case_study_id];
                  const pct = s.max_score ? Math.round(((s.total_score || 0) / s.max_score) * 100) : 0;
                  return (
                    <div key={s.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{cs?.title || 'Case'}</p>
                        <p className="text-xs text-muted-foreground">{s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : ''}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24">
                          <Progress value={pct} className="h-2" />
                        </div>
                        <Badge variant={pct >= 70 ? 'default' : 'outline'} className="text-xs min-w-[3rem] text-center">
                          {pct}%
                        </Badge>
                        <Button size="sm" variant="ghost" onClick={() => setFeedbackTarget({ type: 'case_submission', id: s.id, studentId: selectedStudent })}>
                          <MessageSquare className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Simulator Performance */}
          {sim && (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-foreground">{t('Simulator Performance', 'Резултати от симулатор')}</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => requestAiFeedback('simulator', sim)} disabled={aiLoading}>
                    <Sparkles className="h-4 w-4 mr-1" /> {aiLoading ? '...' : t('AI Feedback', 'AI Оценка')}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setFeedbackTarget({ type: 'simulator', id: sim.id, studentId: selectedStudent })}>
                    <MessageSquare className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  { label: t('Users', 'Потребители'), value: sim.kpis?.users ?? 0 },
                  { label: t('Revenue', 'Приходи'), value: `$${sim.kpis?.revenue ?? 0}` },
                  { label: t('Satisfaction', 'Удовл.'), value: `${sim.kpis?.satisfaction ?? 0}%` },
                  { label: t('Growth', 'Растеж'), value: `${sim.kpis?.growthRate ?? 0}%` },
                ].map((kpi, i) => (
                  <div key={i} className="rounded-lg bg-accent/50 p-3 text-center">
                    <p className="text-lg font-bold text-foreground">{kpi.value}</p>
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  </div>
                ))}
              </div>
              {sim.grade && (
                <Badge className="text-sm">{t('Grade', 'Оценка')}: {sim.grade}</Badge>
              )}
            </div>
          )}

          {/* Feedback Form */}
          {feedbackTarget && (
            <div className="rounded-xl border border-primary/30 bg-card p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{t('Leave Feedback', 'Оставете коментар')}</h3>
              <Textarea
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                placeholder={t('Write your feedback here...', 'Напишете коментара си тук...')}
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={submitFeedback} disabled={!feedbackText.trim()}>
                  <Send className="h-4 w-4 mr-1" /> {t('Send', 'Изпрати')}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setFeedbackTarget(null)}>
                  {t('Cancel', 'Отказ')}
                </Button>
              </div>
            </div>
          )}

          {/* Previous Feedbacks */}
          {studentFeedbacks.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-3">{t('Previous Feedback', 'Предишни коментари')}</h2>
              <div className="space-y-2">
                {studentFeedbacks.map(f => (
                  <div key={f.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs capitalize">{f.target_type.replace('_', ' ')}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(f.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-foreground">{f.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-display font-bold text-foreground">
            {t('Teacher Dashboard', 'Табло на учителя')}
          </h1>
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-1" /> CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-1" /> {t('Print Report', 'Печат доклад')}
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { icon: Users, label: t('Students', 'Ученици'), value: totalStudents, color: 'text-primary' },
            { icon: BookOpen, label: t('Cases Done', 'Казуси'), value: completedCases, color: 'text-primary' },
            { icon: Rocket, label: t('Projects', 'Проекти'), value: totalProjects, color: 'text-primary' },
            { icon: Activity, label: t('Sim Done', 'Симулатор'), value: simCompleted, color: 'text-primary' },
            { icon: TrendingUp, label: t('Avg Progress', 'Среден прогрес'), value: `${avgProgress}%`, color: 'text-primary' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="students" className="space-y-4">
          <TabsList className="bg-muted/50 flex-wrap h-auto">
            <TabsTrigger value="students">{t('Students', 'Ученици')}</TabsTrigger>
            <TabsTrigger value="startups">{t('Startups', 'Стартъпи')}</TabsTrigger>
            <TabsTrigger value="cases">{t('Cases', 'Казуси')}</TabsTrigger>
            <TabsTrigger value="simulator">{t('Simulator', 'Симулатор')}</TabsTrigger>
            <TabsTrigger value="outcomes">{t('Learning Outcomes', 'Учебни резултати')}</TabsTrigger>
            <TabsTrigger value="leaderboard">{t('Leaderboard', 'Класация')}</TabsTrigger>
            <TabsTrigger value="analytics">{t('Analytics', 'Анализи')}</TabsTrigger>
          </TabsList>

          {/* STUDENTS TAB */}
          <TabsContent value="students" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('Search students...', 'Търсене на ученици...')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="space-y-2">
              {loading ? (
                <p className="text-center py-8 text-muted-foreground">{t('Loading...', 'Зареждане...')}</p>
              ) : filteredProfiles.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">{t('No students found', 'Няма намерени ученици')}</p>
              ) : (
                filteredProfiles.map(p => {
                  const subs = getStudentSubs(p.user_id);
                  const sim = getStudentSim(p.user_id);
                  const proj = getStudentProject(p.user_id);
                  return (
                    <button
                      key={p.user_id}
                      onClick={() => setSelectedStudent(p.user_id)}
                      className="w-full rounded-xl border border-border bg-card p-4 flex items-center gap-4 hover:bg-accent/30 transition-colors text-left"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent shrink-0">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{p.full_name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">
                          {t('Cases', 'Казуси')}: {subs.length} · {t('Sim', 'Сим')}: {sim ? `${sim.current_week}/6` : '—'} · {t('Project', 'Проект')}: {proj ? `${getProjectProgress(proj)}%` : '—'}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </button>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* STARTUPS TAB */}
          <TabsContent value="startups" className="space-y-3">
            {projects.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">{t('No projects yet', 'Няма проекти')}</p>
            ) : (
              projects.map(p => {
                const progress = getProjectProgress(p);
                const isOpen = expandedProject === p.id;
                return (
                  <div key={p.id} className="rounded-xl border border-border bg-card overflow-hidden">
                    <button
                      onClick={() => setExpandedProject(isOpen ? null : p.id)}
                      className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-accent/30 transition-colors"
                    >
                      <User className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="font-medium text-foreground flex-1">{getName(p.user_id)}</span>
                      {p.industry && <Badge variant="outline" className="text-xs mr-2">{p.industry}</Badge>}
                      <span className="text-xs font-medium text-primary mr-2">{progress}%</span>
                      {p.is_submitted ? (
                        <Badge className="bg-[hsl(var(--sim-success))]/10 text-[hsl(var(--sim-success))] border-0 text-xs">
                          <Check className="h-3 w-3 mr-1" /> {t('Submitted', 'Предаден')}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" /> {t('In progress', 'В процес')}
                        </Badge>
                      )}
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="border-t border-border px-5 py-4 space-y-3">
                        {SECTION_KEYS.map(key => {
                          const val = (p as any)[key] as string || '';
                          return (
                            <div key={key}>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                {SECTION_LABELS[key][lang === 'bg' ? 'bg' : 'en']}
                              </p>
                              {val.trim() ? (
                                <p className="text-sm text-foreground mt-0.5 whitespace-pre-wrap">{val}</p>
                              ) : (
                                <p className="text-sm text-muted-foreground italic">{t('Not filled', 'Не е попълнено')}</p>
                              )}
                            </div>
                          );
                        })}
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" onClick={() => requestAiFeedback('startup_project', p)} disabled={aiLoading}>
                            <Sparkles className="h-4 w-4 mr-1" /> {t('AI Feedback', 'AI Оценка')}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { setSelectedStudent(p.user_id); setFeedbackTarget({ type: 'startup_project', id: p.id, studentId: p.user_id }); }}>
                            <MessageSquare className="h-4 w-4 mr-1" /> {t('Comment', 'Коментар')}
                          </Button>
                        </div>
                        {aiFeedback && expandedProject === p.id && (
                          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 mt-2">
                            <div className="flex items-center gap-2 mb-1">
                              <Sparkles className="h-3.5 w-3.5 text-primary" />
                              <span className="text-xs font-semibold text-primary">{t('AI Mentor', 'AI Ментор')}</span>
                            </div>
                            <p className="text-sm text-foreground whitespace-pre-wrap">{aiFeedback}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </TabsContent>

          {/* CASES TAB */}
          <TabsContent value="cases" className="space-y-4">
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('Student', 'Ученик')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('Case', 'Казус')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('Score', 'Резултат')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('Date', 'Дата')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.slice(0, 50).map(s => {
                    const cs = caseMap[s.case_study_id];
                    const pct = s.max_score ? Math.round(((s.total_score || 0) / s.max_score) * 100) : 0;
                    return (
                      <tr key={s.id} className="border-t border-border">
                        <td className="px-4 py-3 text-sm font-medium text-foreground">{getName(s.user_id)}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{cs?.title || '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Progress value={pct} className="h-2 w-16" />
                            <span className="text-xs font-medium text-foreground">{pct}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : ''}</td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="ghost" onClick={() => setSelectedStudent(s.user_id)}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {submissions.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">{t('No submissions', 'Няма предадени')}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* SIMULATOR TAB */}
          <TabsContent value="simulator" className="space-y-3">
            {simProgress.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">{t('No simulator data', 'Няма данни')}</p>
            ) : (
              simProgress.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudent(s.user_id)}
                  className="w-full rounded-xl border border-border bg-card p-4 flex items-center gap-4 hover:bg-accent/30 transition-colors text-left"
                >
                  <User className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{getName(s.user_id)}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('Week', 'Седмица')} {s.current_week}/6 · {t('Users', 'Потр.')}: {s.kpis?.users ?? 0} · ${t('Rev', 'Прих.')}: ${s.kpis?.revenue ?? 0}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.grade && <Badge className="text-xs">{s.grade}</Badge>}
                    {s.is_complete ? (
                      <Badge className="bg-[hsl(var(--sim-success))]/10 text-[hsl(var(--sim-success))] border-0 text-xs">
                        <Check className="h-3 w-3 mr-1" /> {t('Done', 'Завършено')}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">{t('In Progress', 'В процес')}</Badge>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))
            )}
          </TabsContent>

          {/* LEARNING OUTCOMES TAB */}
          <TabsContent value="outcomes" className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">{t('Class Learning Outcomes', 'Учебни резултати на класа')}</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {t('Average learning outcome scores across all students.', 'Средни резултати за учебни постижения на всички ученици.')}
              </p>
              {(() => {
                const STARTUP_SECTIONS = ['problem', 'customer', 'value_proposition', 'digital_product', 'business_model', 'growth_strategy', 'final_pitch'];
                // Calculate average outcome scores across all students
                const allScores: Record<string, number[]> = {};
                LEARNING_OUTCOMES.forEach(lo => { allScores[lo.id] = []; });

                profiles.forEach(p => {
                  const subs = getStudentSubs(p.user_id);
                  const sim = getStudentSim(p.user_id);
                  const proj = getStudentProject(p.user_id);
                  const sectionMap: Record<string, boolean> = {};
                  STARTUP_SECTIONS.forEach(s => {
                    sectionMap[s] = proj ? ((proj as any)[s] || '').trim().length > 10 : false;
                  });
                  const scores = calcOutcomeScores({
                    casesCompleted: subs.length,
                    casesTotal: cases.length,
                    startupSections: sectionMap,
                    simWeek: sim?.current_week || 1,
                    simComplete: sim?.is_complete || false,
                  });
                  LEARNING_OUTCOMES.forEach(lo => {
                    allScores[lo.id].push(scores[lo.id] || 0);
                  });
                });

                const avgScores = LEARNING_OUTCOMES.map(lo => ({
                  name: lang === 'bg' ? lo.bg : lo.en,
                  score: allScores[lo.id].length > 0
                    ? Math.round(allScores[lo.id].reduce((a, b) => a + b, 0) / allScores[lo.id].length)
                    : 0,
                }));

                return (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      {avgScores.map((s, i) => {
                        const Icon = LEARNING_OUTCOMES[i].icon;
                        return (
                          <div key={i}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-xs font-medium text-foreground">{s.name}</span>
                              </div>
                              <span className={`text-xs font-bold ${s.score >= 70 ? 'text-sim-success' : s.score >= 40 ? 'text-sim-warning' : 'text-muted-foreground'}`}>
                                {s.score}%
                              </span>
                            </div>
                            <Progress value={s.score} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                      <RadarChart data={avgScores}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
                        <Radar dataKey="score" stroke="hsl(226 70% 55%)" fill="hsl(226 70% 55%)" fillOpacity={0.2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                );
              })()}
            </div>

            {/* Students needing help */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-3">{t('Students Needing Attention', 'Ученици, нуждаещи се от внимание')}</h2>
              <div className="space-y-2">
                {(() => {
                  const STARTUP_SECTIONS = ['problem', 'customer', 'value_proposition', 'digital_product', 'business_model', 'growth_strategy', 'final_pitch'];
                  const studentsWithScores = profiles.map(p => {
                    const subs = getStudentSubs(p.user_id);
                    const sim = getStudentSim(p.user_id);
                    const proj = getStudentProject(p.user_id);
                    const sectionMap: Record<string, boolean> = {};
                    STARTUP_SECTIONS.forEach(s => {
                      sectionMap[s] = proj ? ((proj as any)[s] || '').trim().length > 10 : false;
                    });
                    const scores = calcOutcomeScores({
                      casesCompleted: subs.length,
                      casesTotal: cases.length,
                      startupSections: sectionMap,
                      simWeek: sim?.current_week || 1,
                      simComplete: sim?.is_complete || false,
                    });
                    const avg = Math.round(LEARNING_OUTCOMES.reduce((sum, lo) => sum + (scores[lo.id] || 0), 0) / LEARNING_OUTCOMES.length);
                    return { ...p, avgScore: avg };
                  }).filter(s => s.avgScore < 30).sort((a, b) => a.avgScore - b.avgScore).slice(0, 5);

                  return studentsWithScores.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t('All students are making good progress!', 'Всички ученици напредват добре!')}</p>
                  ) : (
                    studentsWithScores.map(s => (
                      <button
                        key={s.user_id}
                        onClick={() => setSelectedStudent(s.user_id)}
                        className="w-full flex items-center gap-3 rounded-lg p-3 bg-destructive/5 border border-destructive/20 hover:bg-destructive/10 transition-colors text-left"
                      >
                        <User className="h-4 w-4 text-destructive shrink-0" />
                        <span className="text-sm font-medium text-foreground flex-1">{s.full_name || 'Unknown'}</span>
                        <span className="text-xs font-bold text-destructive">{s.avgScore}%</span>
                      </button>
                    ))
                  );
                })()}
              </div>
            </div>
          </TabsContent>

          {/* LEADERBOARD TAB */}
          <TabsContent value="leaderboard" className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-sim-warning" />
                <h2 className="text-lg font-semibold text-foreground">{t('Student Leaderboard', 'Класация на ученици')}</h2>
              </div>
              <Leaderboard lang={lang} limit={20} showTitle={false} />
            </div>
          </TabsContent>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Case Completion Chart */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">{t('Case Completion & Scores', 'Казуси — завършване и резултати')}</h2>
              {caseCompletionData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={caseCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                    <Bar dataKey="submissions" name={t('Submissions', 'Предадени')} radius={[4, 4, 0, 0]} fill="hsl(226 70% 55%)" />
                    <Bar dataKey="avgScore" name={t('Avg Score %', 'Среден резултат %')} radius={[4, 4, 0, 0]} fill="hsl(173 58% 39%)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">{t('No data', 'Няма данни')}</p>
              )}
            </div>

            {/* Simulator Grades */}
            {gradeDistribution.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">{t('Simulator Grade Distribution', 'Разпределение на оценки')}</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={gradeDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                      {gradeDistribution.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Progress overview */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">{t('Student Progress Summary', 'Обобщение на прогреса')}</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg bg-accent/50 p-4">
                  <p className="text-2xl font-bold text-foreground">{submissions.length > 0 ? Math.round(submissions.reduce((a, s) => a + ((s.total_score || 0) / Math.max(s.max_score || 1, 1)) * 100, 0) / submissions.length) : 0}%</p>
                  <p className="text-xs text-muted-foreground">{t('Avg Case Score', 'Среден резултат')}</p>
                </div>
                <div className="rounded-lg bg-accent/50 p-4">
                  <p className="text-2xl font-bold text-foreground">{projects.filter(p => p.is_submitted).length}/{projects.length}</p>
                  <p className="text-xs text-muted-foreground">{t('Projects Submitted', 'Предадени проекти')}</p>
                </div>
                <div className="rounded-lg bg-accent/50 p-4">
                  <p className="text-2xl font-bold text-foreground">{simCompleted}/{simProgress.length}</p>
                  <p className="text-xs text-muted-foreground">{t('Simulators Complete', 'Завършени симулации')}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
