import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
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
import { calcOutcomeScores, LEARNING_OUTCOMES } from '@/components/dashboard/LearningOutcomes';
import Leaderboard from '@/components/dashboard/Leaderboard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import {
  Users, BookOpen, Rocket, Activity, Search, ChevronDown, ChevronRight,
  MessageSquare, Sparkles, Download, TrendingUp, Target, BarChart3, User,
  Check, Clock, Send, ArrowLeft, Trophy, GraduationCap, Printer, FileText,
  AlertTriangle, Layers, DollarSign, Megaphone, Briefcase, Star,
} from 'lucide-react';

// Types
interface ProfileData {
  user_id: string;
  full_name: string | null;
  
  skills_tags: string[] | null;
  interests: string[] | null;
  cohort_id: string | null;
  links_json: any;
  updated_at: string;
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
  updated_at: string;
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

// Helper: extract strategy from simulator decisions (supports both old w- and new s- IDs)
function extractSimStrategy(decisions: any[]) {
  if (!decisions || !Array.isArray(decisions)) return null;
  const allChoices = decisions.flatMap((d: any) => d.choices || []);
  if (allChoices.length === 0) return null;

  const productMap: Record<string, string> = {
    'w3-mobile': 'Mobile App', 'w3-web': 'Web Platform', 'w3-ai': 'AI Tool',
    'w3-data': 'Data Platform', 'w3-marketplace': 'Marketplace',
    's4-mobile': 'Mobile App', 's4-saas': 'SaaS Platform', 's4-ai': 'AI Tool',
    's4-marketplace': 'Marketplace',
  };
  const revenueMap: Record<string, string> = {
    'w4-subscription': 'Subscription', 'w4-freemium': 'Freemium', 'w4-payperuse': 'Pay-per-use',
    'w4-iap': 'In-app purchases', 'w4-commission': 'Commission', 'w4-ads': 'Advertising',
    'w4-enterprise': 'Enterprise licensing', 'w4-onetime': 'One-time purchase',
    's5-subscription': 'Subscription', 's5-freemium': 'Freemium', 's5-payperuse': 'Pay-per-use',
    's5-commission': 'Commission', 's5-ads': 'Advertising',
  };
  const marketMap: Record<string, string> = {
    'w4-mass': 'Mass Market', 'w4-nichemarket': 'Niche', 'w4-b2b-target': 'B2B',
    'w4-b2c-target': 'B2C', 'w4-enterprise-target': 'Enterprise',
  };
  const marketingMap: Record<string, string> = {
    'w5-social': 'Social Media', 'w5-influencer': 'Influencer', 'w5-seo': 'SEO/Content',
    'w5-paid': 'Paid Ads', 'w5-community': 'Community', 'w5-partnerships': 'Partnerships',
    'w5-plg': 'Product-Led Growth', 'w5-referral': 'Referral', 'w5-email': 'Email', 'w5-events': 'Events',
    's6-social': 'Social Media', 's6-influencers': 'Influencers', 's6-seo': 'SEO',
    's6-partnerships': 'Partnerships', 's6-paidads': 'Paid Ads',
  };

  return {
    product: allChoices.filter((c: string) => productMap[c]).map((c: string) => productMap[c]),
    revenue: allChoices.filter((c: string) => revenueMap[c]).map((c: string) => revenueMap[c]),
    market: allChoices.filter((c: string) => marketMap[c]).map((c: string) => marketMap[c]),
    marketing: allChoices.filter((c: string) => marketingMap[c]).map((c: string) => marketingMap[c]),
  };
}

// Helper: get startup stage
function getStartupStage(proj: StartupProject): { en: string; bg: string; color: string } {
  const filled = SECTION_KEYS.filter(k => ((proj as any)[k] || '').trim().length > 10).length;
  if (proj.is_submitted || filled >= 6) return { en: 'Pitch', bg: 'Представяне', color: 'text-[hsl(var(--sim-success))]' };
  if (filled >= 4) return { en: 'MVP', bg: 'MVP', color: 'text-primary' };
  return { en: 'Idea', bg: 'Идея', color: 'text-muted-foreground' };
}

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
  const [moduleResponses, setModuleResponses] = useState<any[]>([]);
  const [dbModules, setDbModules] = useState<any[]>([]);
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
      const [profRes, projRes, simRes, subRes, caseRes, fbRes, modRespRes, modRes] = await Promise.all([
        supabase.from('profiles').select('user_id, full_name, skills_tags, interests, cohort_id, links_json, updated_at'),
        supabase.from('startup_projects').select('*').order('created_at', { ascending: false }),
        supabase.from('simulator_progress').select('*'),
        supabase.from('submissions').select('id, user_id, case_study_id, total_score, max_score, submitted_at, is_draft').eq('is_draft', false),
        supabase.from('case_studies').select('id, title, topic'),
        supabase.from('teacher_feedback').select('*').order('created_at', { ascending: false }),
        supabase.from('learning_module_responses').select('*'),
        supabase.from('learning_modules').select('id, slug, title_en, title_bg'),
      ]);
      setProfiles(profRes.data || []);
      setProjects((projRes.data || []) as StartupProject[]);
      setSimProgress((simRes.data || []) as SimProgress[]);
      setSubmissions(subRes.data || []);
      setCases(caseRes.data || []);
      setFeedbacks((fbRes.data || []) as FeedbackRow[]);
      setModuleResponses(modRespRes.data || []);
      setDbModules(modRes.data || []);
      setLoading(false);
    };
    load();
  }, [isAdmin]);

  const profileMap = Object.fromEntries(profiles.map(p => [p.user_id, p]));
  const getName = (uid: string) => profileMap[uid]?.full_name || t('Unknown', 'Неизвестен');
  const getMetadata = (uid: string) => {
    const lj = profileMap[uid]?.links_json;
    return {
      school: lj?.school || '',
      classGrade: lj?.class_grade || '',
      country: lj?.country || '',
    };
  };
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
    const meta = getMetadata(p.user_id);
    const searchLower = search.toLowerCase();
    return (p.full_name || '').toLowerCase().includes(searchLower)
      || meta.school.toLowerCase().includes(searchLower)
      || meta.country.toLowerCase().includes(searchLower);
  });

  const getStudentProject = (uid: string) => projects.find(p => p.user_id === uid);
  const getStudentSim = (uid: string) => simProgress.find(s => s.user_id === uid);
  const getStudentSubs = (uid: string) => submissions.filter(s => s.user_id === uid);
  const getProjectProgress = (p: StartupProject) => {
    const filled = SECTION_KEYS.filter(k => ((p as any)[k] || '').trim().length > 10).length;
    return Math.round((filled / SECTION_KEYS.length) * 100);
  };

  const getOverallProgress = (uid: string) => {
    const subs = getStudentSubs(uid);
    const sim = getStudentSim(uid);
    const proj = getStudentProject(uid);
    const caseProgress = cases.length > 0 ? (subs.length / cases.length) * 100 : 0;
    const simProg = sim ? (sim.current_week / 6) * 100 : 0;
    const projProg = proj ? getProjectProgress(proj) : 0;
    return Math.round((caseProgress + simProg + projProg) / 3);
  };

  // Students needing support
  const getStudentsNeedingSupport = () => {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    return profiles.map(p => {
      const reasons: string[] = [];
      const progress = getOverallProgress(p.user_id);
      const subs = getStudentSubs(p.user_id);
      const sim = getStudentSim(p.user_id);
      const proj = getStudentProject(p.user_id);

      if (progress < 20) reasons.push(t('Low overall progress', 'Нисък общ напредък'));
      if (subs.length === 0 && cases.length > 0) reasons.push(t('No completed cases', 'Няма завършени казуси'));
      if (!sim || sim.current_week <= 1) reasons.push(t('Simulator not started', 'Симулаторът не е стартиран'));

      // Check inactivity based on profile updated_at
      const lastActive = new Date(p.updated_at).getTime();
      const simLastActive = sim ? new Date((sim as any).updated_at || 0).getTime() : 0;
      const latest = Math.max(lastActive, simLastActive);
      if (latest > 0 && (now - latest) > sevenDays) {
        reasons.push(t('Inactive for 7+ days', 'Неактивен 7+ дни'));
      }

      return { ...p, reasons, progress };
    }).filter(s => s.reasons.length > 0).sort((a, b) => a.progress - b.progress);
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
    if (error) { toast.error(t('Failed to save feedback', 'Грешка при запазване на обратна връзка')); return; }
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
    const headers = [
      t('Student', 'Ученик'), t('School', 'Училище'), t('Class', 'Клас'), t('Country', 'Държава'),
      t('Cases Completed', 'Казуси'), t('Avg Score', 'Ср. резултат'),
      t('Simulator Week', 'Седмица'), t('Sim Grade', 'Оценка'),
      t('Startup Stage', 'Етап'), t('Overall Progress', 'Общ прогрес'),
    ];
    const rows = profiles.map(p => {
      const meta = getMetadata(p.user_id);
      const subs = getStudentSubs(p.user_id);
      const sim = getStudentSim(p.user_id);
      const proj = getStudentProject(p.user_id);
      const avgScore = subs.length > 0
        ? Math.round(subs.reduce((a, s) => a + ((s.total_score || 0) / Math.max(s.max_score || 1, 1)) * 100, 0) / subs.length)
        : 0;
      const stage = proj ? getStartupStage(proj) : null;
      return [
        `"${getName(p.user_id)}"`, `"${meta.school}"`, `"${meta.classGrade}"`, `"${meta.country}"`,
        subs.length, `${avgScore}%`,
        sim ? `${sim.current_week}/6` : '0/6', sim?.grade || '-',
        stage ? (lang === 'bg' ? stage.bg : stage.en) : '-', `${getOverallProgress(p.user_id)}%`,
      ].join(',');
    });
    const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'student_progress.csv';
    a.click();
    toast.success(t('Exported as CSV', 'Експортирано като CSV'));
  };

  const exportExcel = () => {
    // TSV format that Excel opens correctly
    const headers = [
      t('Student', 'Ученик'), t('School', 'Училище'), t('Class', 'Клас'), t('Country', 'Държава'),
      t('Cases Completed', 'Казуси'), t('Avg Score %', 'Ср. резултат %'),
      t('Simulator Week', 'Седмица'), t('Sim Grade', 'Оценка'),
      t('Startup Stage', 'Етап'), t('Overall Progress %', 'Общ прогрес %'),
    ];
    const rows = profiles.map(p => {
      const meta = getMetadata(p.user_id);
      const subs = getStudentSubs(p.user_id);
      const sim = getStudentSim(p.user_id);
      const proj = getStudentProject(p.user_id);
      const avgScore = subs.length > 0
        ? Math.round(subs.reduce((a, s) => a + ((s.total_score || 0) / Math.max(s.max_score || 1, 1)) * 100, 0) / subs.length)
        : 0;
      const stage = proj ? getStartupStage(proj) : null;
      return [
        getName(p.user_id), meta.school, meta.classGrade, meta.country,
        subs.length, avgScore,
        sim ? `${sim.current_week}/6` : '0/6', sim?.grade || '-',
        stage ? (lang === 'bg' ? stage.bg : stage.en) : '-', getOverallProgress(p.user_id),
      ].join('\t');
    });
    const tsv = '\uFEFF' + [headers.join('\t'), ...rows].join('\n');
    const blob = new Blob([tsv], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'student_progress.xls';
    a.click();
    toast.success(t('Exported as Excel', 'Експортирано като Excel'));
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

  const gradeDistribution = ['A', 'B', 'C', 'D'].map(g => ({
    name: g,
    value: simProgress.filter(s => s.grade === g).length,
  })).filter(g => g.value > 0);

  // ── Student Detail View ──
  if (selectedStudent) {
    const prof = profileMap[selectedStudent];
    const proj = getStudentProject(selectedStudent);
    const sim = getStudentSim(selectedStudent);
    const subs = getStudentSubs(selectedStudent);
    const studentFeedbacks = feedbacks.filter(f => f.student_id === selectedStudent);
    const meta = getMetadata(selectedStudent);
    const strategy = sim ? extractSimStrategy(sim.decisions) : null;

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
                <p className="text-sm text-muted-foreground">{prof?.skills_tags?.join(', ') || t('No skills listed', 'Няма посочени умения')}</p>
              </div>
            </div>
            {(meta.school || meta.classGrade || meta.country) && (
              <div className="flex flex-wrap gap-2 mb-3">
                {meta.school && <Badge variant="outline" className="text-xs">🏫 {meta.school}</Badge>}
                {meta.classGrade && <Badge variant="outline" className="text-xs">📚 {meta.classGrade}</Badge>}
                {meta.country && <Badge variant="outline" className="text-xs">🌍 {meta.country}</Badge>}
              </div>
            )}
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

          {/* Simulator Strategy Summary */}
          {strategy && (strategy.product.length > 0 || strategy.revenue.length > 0) && (
            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5">
              <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                {t('Simulator Strategy', 'Стратегия от симулатора')}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {strategy.product.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-1"><Briefcase className="h-3 w-3" /> {t('Product', 'Продукт')}</p>
                    <div className="flex flex-wrap gap-1">{strategy.product.map((p, i) => <Badge key={i} variant="secondary" className="text-xs">{p}</Badge>)}</div>
                  </div>
                )}
                {strategy.revenue.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-1"><DollarSign className="h-3 w-3" /> {t('Revenue Model', 'Приходен модел')}</p>
                    <div className="flex flex-wrap gap-1">{strategy.revenue.map((r, i) => <Badge key={i} variant="secondary" className="text-xs">{r}</Badge>)}</div>
                  </div>
                )}
                {strategy.market.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-1"><Target className="h-3 w-3" /> {t('Market', 'Пазар')}</p>
                    <div className="flex flex-wrap gap-1">{strategy.market.map((m, i) => <Badge key={i} variant="secondary" className="text-xs">{m}</Badge>)}</div>
                  </div>
                )}
                {strategy.marketing.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-1"><Megaphone className="h-3 w-3" /> {t('Marketing', 'Маркетинг')}</p>
                    <div className="flex flex-wrap gap-1">{strategy.marketing.map((m, i) => <Badge key={i} variant="secondary" className="text-xs">{m}</Badge>)}</div>
                  </div>
                )}
              </div>
            </div>
          )}

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
                        <div className="w-24"><Progress value={pct} className="h-2" /></div>
                        <Badge variant={pct >= 70 ? 'default' : 'outline'} className="text-xs min-w-[3rem] text-center">{pct}%</Badge>
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
              {sim.grade && <Badge className="text-sm">{t('Grade', 'Оценка')}: {sim.grade}</Badge>}
            </div>
          )}

          {/* Feedback Form */}
          {feedbackTarget && (
            <div className="rounded-xl border border-primary/30 bg-card p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{t('Leave Feedback', 'Оставете коментар')}</h3>
              <Textarea value={feedbackText} onChange={e => setFeedbackText(e.target.value)} placeholder={t('Write your feedback here...', 'Напишете коментара си тук...')} rows={3} />
              <div className="flex gap-2">
                <Button size="sm" onClick={submitFeedback} disabled={!feedbackText.trim()}>
                  <Send className="h-4 w-4 mr-1" /> {t('Send', 'Изпрати')}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setFeedbackTarget(null)}>{t('Cancel', 'Отказ')}</Button>
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

  // ── Main Dashboard ──
  const studentsNeedingSupport = getStudentsNeedingSupport();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-display font-bold text-foreground">
            {t('Teacher Dashboard', 'Табло на учителя')}
          </h1>
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/peer-reviews"><Star className="h-4 w-4 mr-1" /> {t('Peer Reviews', 'Рецензии')}</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-1" /> CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportExcel}>
              <FileText className="h-4 w-4 mr-1" /> Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-1" /> {t('Print / PDF', 'Печат / PDF')}
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
            <TabsTrigger value="support" className="relative">
              {t('Needs Support', 'Нуждае се от помощ')}
              {studentsNeedingSupport.length > 0 && (
                <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
                  {studentsNeedingSupport.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="outcomes">{t('Learning Analytics', 'Учебни резултати')}</TabsTrigger>
            <TabsTrigger value="modules">{t('Learning Modules', 'Учебни модули')}</TabsTrigger>
            <TabsTrigger value="analytics">{t('Analytics', 'Анализи')}</TabsTrigger>
            <TabsTrigger value="leaderboard">{t('Leaderboard', 'Класация')}</TabsTrigger>
          </TabsList>

          {/* STUDENTS TAB - Full Table */}
          <TabsContent value="students" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t('Search by name, school, or country...', 'Търсене по име, училище или държава...')} value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="rounded-xl border border-border overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{t('Student', 'Ученик')}</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">{t('Class', 'Клас')}</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">{t('School', 'Училище')}</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">{t('Country', 'Държава')}</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-muted-foreground">{t('Cases', 'Казуси')}</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-muted-foreground">{t('Sim Week', 'Сим. седм.')}</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-muted-foreground">{t('Startup', 'Стартъп')}</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-muted-foreground">{t('Progress', 'Прогрес')}</th>
                    <th className="px-3 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-muted-foreground">{t('Loading...', 'Зареждане...')}</td></tr>
                  ) : filteredProfiles.length === 0 ? (
                    <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-muted-foreground">{t('No students found', 'Няма намерени ученици')}</td></tr>
                  ) : (
                    filteredProfiles.map(p => {
                      const meta = getMetadata(p.user_id);
                      const subs = getStudentSubs(p.user_id);
                      const sim = getStudentSim(p.user_id);
                      const proj = getStudentProject(p.user_id);
                      const progress = getOverallProgress(p.user_id);
                      const stage = proj ? getStartupStage(proj) : null;
                      return (
                        <tr key={p.user_id} className="border-t border-border hover:bg-accent/30 cursor-pointer transition-colors" onClick={() => setSelectedStudent(p.user_id)}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent shrink-0">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <span className="text-sm font-medium text-foreground">{p.full_name || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-sm text-muted-foreground">{meta.classGrade || '—'}</td>
                          <td className="px-3 py-3 text-sm text-muted-foreground max-w-[120px] truncate">{meta.school || '—'}</td>
                          <td className="px-3 py-3 text-sm text-muted-foreground">{meta.country || '—'}</td>
                          <td className="px-3 py-3 text-center text-sm font-medium text-foreground">{subs.length}</td>
                          <td className="px-3 py-3 text-center text-sm text-foreground">{sim ? `${sim.current_week}/6` : '—'}</td>
                          <td className="px-3 py-3 text-center">
                            {stage ? (
                              <Badge variant="outline" className={`text-xs ${stage.color}`}>{lang === 'bg' ? stage.bg : stage.en}</Badge>
                            ) : <span className="text-sm text-muted-foreground">—</span>}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <Progress value={progress} className="h-2 w-16" />
                              <span className="text-xs font-medium text-foreground">{progress}%</span>
                            </div>
                          </td>
                          <td className="px-3 py-3"><ChevronRight className="h-4 w-4 text-muted-foreground" /></td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* STARTUPS TAB */}
          <TabsContent value="startups" className="space-y-3">
            <div className="rounded-xl border border-border overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{t('Student', 'Ученик')}</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">{t('Startup Idea', 'Стартъп идея')}</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">{t('Industry', 'Индустрия')}</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-muted-foreground">{t('Stage', 'Етап')}</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-muted-foreground">{t('Progress', 'Прогрес')}</th>
                    <th className="px-3 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">{t('No projects yet', 'Няма проекти')}</td></tr>
                  ) : (
                    projects.map(p => {
                      const stage = getStartupStage(p);
                      const progress = getProjectProgress(p);
                      const idea = (p.problem || '').substring(0, 60) || t('Not filled', 'Не е попълнено');
                      return (
                        <tr key={p.id} className="border-t border-border hover:bg-accent/30 cursor-pointer transition-colors" onClick={() => setSelectedStudent(p.user_id)}>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">{getName(p.user_id)}</td>
                          <td className="px-3 py-3 text-sm text-muted-foreground max-w-[200px] truncate">{idea}</td>
                          <td className="px-3 py-3">{p.industry ? <Badge variant="outline" className="text-xs">{p.industry}</Badge> : <span className="text-sm text-muted-foreground">—</span>}</td>
                          <td className="px-3 py-3 text-center"><Badge variant="outline" className={`text-xs ${stage.color}`}>{lang === 'bg' ? stage.bg : stage.en}</Badge></td>
                          <td className="px-3 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <Progress value={progress} className="h-2 w-16" />
                              <span className="text-xs font-medium text-foreground">{progress}%</span>
                            </div>
                          </td>
                          <td className="px-3 py-3"><ChevronRight className="h-4 w-4 text-muted-foreground" /></td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* NEEDS SUPPORT TAB */}
          <TabsContent value="support" className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h2 className="text-lg font-semibold text-foreground">{t('Students Needing Support', 'Ученици, нуждаещи се от помощ')}</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {t(
                  'Students flagged automatically based on: low progress, unfinished cases, simulator not started, or inactive for 7+ days.',
                  'Ученици, маркирани автоматично поради: нисък прогрес, незавършени казуси, нестартиран симулатор или неактивност 7+ дни.'
                )}
              </p>
              {studentsNeedingSupport.length === 0 ? (
                <div className="text-center py-8">
                  <Check className="h-8 w-8 text-[hsl(var(--sim-success))] mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">{t('All students are making good progress!', 'Всички ученици напредват добре!')}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {studentsNeedingSupport.map(s => (
                    <button
                      key={s.user_id}
                      onClick={() => setSelectedStudent(s.user_id)}
                      className="w-full flex items-center gap-4 rounded-lg p-4 bg-destructive/5 border border-destructive/20 hover:bg-destructive/10 transition-colors text-left"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 shrink-0">
                        <User className="h-4 w-4 text-destructive" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{s.full_name || 'Unknown'}</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {s.reasons.map((r, i) => (
                            <Badge key={i} variant="outline" className="text-xs border-destructive/30 text-destructive">{r}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-lg font-bold text-destructive">{s.progress}%</span>
                        <p className="text-xs text-muted-foreground">{t('progress', 'прогрес')}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* LEARNING ANALYTICS TAB */}
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
                const allScores: Record<string, number[]> = {};
                LEARNING_OUTCOMES.forEach(lo => { allScores[lo.id] = []; });
                profiles.forEach(p => {
                  const subs = getStudentSubs(p.user_id);
                  const sim = getStudentSim(p.user_id);
                  const proj = getStudentProject(p.user_id);
                  const sectionMap: Record<string, boolean> = {};
                  STARTUP_SECTIONS.forEach(s => { sectionMap[s] = proj ? ((proj as any)[s] || '').trim().length > 10 : false; });
                  const scores = calcOutcomeScores({ casesCompleted: subs.length, casesTotal: cases.length, startupSections: sectionMap, simWeek: sim?.current_week || 1, simComplete: sim?.is_complete || false });
                  LEARNING_OUTCOMES.forEach(lo => { allScores[lo.id].push(scores[lo.id] || 0); });
                });
                const avgScores = LEARNING_OUTCOMES.map(lo => ({
                  name: lang === 'bg' ? lo.bg : lo.en,
                  score: allScores[lo.id].length > 0 ? Math.round(allScores[lo.id].reduce((a, b) => a + b, 0) / allScores[lo.id].length) : 0,
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
                              <span className={`text-xs font-bold ${s.score >= 70 ? 'text-[hsl(var(--sim-success))]' : s.score >= 40 ? 'text-[hsl(var(--sim-warning))]' : 'text-muted-foreground'}`}>{s.score}%</span>
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
          </TabsContent>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics" className="space-y-6">
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

          {/* LEARNING MODULES TAB */}
          <TabsContent value="modules" className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">{t('Learning Module Results', 'Резултати от учебни модули')}</h2>
              </div>
              {moduleResponses.filter((r: any) => r.completed_at).length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('No completed modules yet.', 'Все още няма завършени модули.')}</p>
              ) : (
                <div className="rounded-xl border border-border overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{t('Student', 'Ученик')}</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">{t('Module', 'Модул')}</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-muted-foreground">{t('Quiz', 'Тест')}</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-muted-foreground">{t('Concept', 'Концепция')}</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-muted-foreground">{t('Analytical', 'Анализ')}</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-muted-foreground">{t('Strategic', 'Стратегия')}</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-muted-foreground">{t('Application', 'Приложение')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {moduleResponses.filter((r: any) => r.completed_at).map((r: any) => {
                        const modInfo = dbModules.find((m: any) => m.id === r.module_id);
                        return (
                          <tr key={r.id} className="border-t border-border hover:bg-accent/30">
                            <td className="px-4 py-3 text-sm text-foreground">{getName(r.user_id)}</td>
                            <td className="px-3 py-3 text-sm text-foreground">{modInfo ? (lang === 'bg' ? modInfo.title_bg : modInfo.title_en) : r.module_id}</td>
                            <td className="px-3 py-3 text-center text-sm font-medium">{r.quiz_score}/{r.quiz_max}</td>
                            <td className="px-3 py-3 text-center text-sm">{r.concept_score}%</td>
                            <td className="px-3 py-3 text-center text-sm">{r.analytical_score}%</td>
                            <td className="px-3 py-3 text-center text-sm">{r.strategic_score}%</td>
                            <td className="px-3 py-3 text-center text-sm">{r.application_score}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-[hsl(var(--sim-warning))]" />
                <h2 className="text-lg font-semibold text-foreground">{t('Student Leaderboard', 'Класация на ученици')}</h2>
              </div>
              <Leaderboard lang={lang} limit={20} showTitle={false} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
