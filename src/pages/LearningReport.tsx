import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import LearningOutcomes, { calcOutcomeScores, LEARNING_OUTCOMES } from '@/components/dashboard/LearningOutcomes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Printer, Download, Trophy, BookOpen, Rocket, BarChart3, Target,
  TrendingUp, Lightbulb, Star, ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LearningReport() {
  const { user, profile } = useAuth();
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);

  const [cases, setCases] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [startupProject, setStartupProject] = useState<any>(null);
  const [simProgress, setSimProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('case_studies').select('id, title, difficulty').eq('published', true),
      supabase.from('submissions').select('case_study_id, is_draft, total_score, max_score').eq('user_id', user.id),
      supabase.from('startup_projects').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('simulator_progress').select('*').eq('user_id', user.id).maybeSingle(),
    ]).then(([casesRes, subsRes, projRes, simRes]) => {
      setCases(casesRes.data || []);
      setSubmissions(subsRes.data || []);
      setStartupProject(projRes.data || null);
      setSimProgress(simRes.data || null);
      setLoading(false);
    });
  }, [user]);

  const casesCompleted = submissions.filter(s => !s.is_draft).length;
  const simWeek = simProgress?.current_week || 1;
  const simComplete = simProgress?.is_complete || false;

  const startupSections = ['problem', 'customer', 'value_proposition', 'digital_product', 'business_model', 'growth_strategy', 'final_pitch'];
  const startupFilled = startupProject
    ? startupSections.filter(s => ((startupProject as any)[s] || '').trim().length > 20).length
    : 0;
  const startupPct = Math.round((startupFilled / startupSections.length) * 100);

  const xp = casesCompleted * 50 + (simWeek - 1) * 100 + (simComplete ? 100 : 0) + startupFilled * 75 + (startupProject?.is_submitted ? 200 : 0);
  const levelNum = xp < 200 ? 1 : xp < 500 ? 2 : xp < 1000 ? 3 : xp < 2000 ? 4 : 5;

  const startupSectionMap: Record<string, boolean> = {};
  startupSections.forEach(s => { startupSectionMap[s] = startupProject ? ((startupProject as any)[s] || '').trim().length > 20 : false; });
  const outcomeScores = calcOutcomeScores({ casesCompleted, casesTotal: cases.length, startupSections: startupSectionMap, simWeek, simComplete });

  const avgScore = submissions.filter(s => !s.is_draft && s.max_score).length > 0
    ? Math.round(submissions.filter(s => !s.is_draft && s.max_score).reduce((a, s) => a + ((s.total_score || 0) / Math.max(s.max_score, 1)) * 100, 0) / submissions.filter(s => !s.is_draft && s.max_score).length)
    : 0;

  // Strengths & weaknesses
  const sorted = LEARNING_OUTCOMES.map(lo => ({ ...lo, score: outcomeScores[lo.id] || 0 })).sort((a, b) => b.score - a.score);
  const strengths = sorted.filter(s => s.score >= 50).slice(0, 3);
  const weaknesses = sorted.filter(s => s.score < 50).slice(-3).reverse();

  // Recommendations
  const recommendations: { en: string; bg: string }[] = [];
  if (casesCompleted < cases.length) recommendations.push({ en: `Complete more case studies (${casesCompleted}/${cases.length} done)`, bg: `Завършете повече казуси (${casesCompleted}/${cases.length} завършени)` });
  if (!simComplete) recommendations.push({ en: `Continue the simulator (Week ${simWeek}/6)`, bg: `Продължете симулатора (Седмица ${simWeek}/6)` });
  if (startupPct < 100) recommendations.push({ en: `Fill in missing startup project sections (${startupPct}% complete)`, bg: `Попълнете липсващи секции от стартъп проекта (${startupPct}% завършен)` });
  if (weaknesses.length > 0) recommendations.push({ en: `Focus on: ${weaknesses.map(w => w.en).join(', ')}`, bg: `Фокусирайте се върху: ${weaknesses.map(w => w.bg).join(', ')}` });

  const handlePrint = () => window.print();

  const handleCSV = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Student', profile?.full_name || ''],
      ['XP', String(xp)],
      ['Level', String(levelNum)],
      ['Cases Completed', `${casesCompleted}/${cases.length}`],
      ['Average Score', `${avgScore}%`],
      ['Simulator Week', `${simWeek}/6`],
      ['Simulator Complete', simComplete ? 'Yes' : 'No'],
      ['Startup Progress', `${startupPct}%`],
      ...LEARNING_OUTCOMES.map(lo => [lo.en, `${outcomeScores[lo.id] || 0}%`]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'learning_report.csv';
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20 text-muted-foreground">{t('Loading...', 'Зареждане...')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-1" /> {t('Dashboard', 'Табло')}
            </Button>
            <h1 className="text-2xl font-bold text-foreground">{t('My Learning Report', 'Моят учебен доклад')}</h1>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={handleCSV}>
              <Download className="h-4 w-4 mr-1" /> CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1" /> {t('Print / PDF', 'Печат / PDF')}
            </Button>
          </div>
        </div>

        <div ref={reportRef} className="space-y-6">
          {/* Student Info + Summary */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Trophy className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{profile?.full_name || t('Student', 'Ученик')}</h2>
                <p className="text-sm text-muted-foreground">{t('Generated on', 'Генериран на')} {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: t('XP', 'XP'), value: xp, icon: Star },
                { label: t('Level', 'Ниво'), value: levelNum, icon: TrendingUp },
                { label: t('Cases', 'Казуси'), value: `${casesCompleted}/${cases.length}`, icon: BookOpen },
                { label: t('Avg Score', 'Средна оценка'), value: `${avgScore}%`, icon: Target },
              ].map((s, i) => (
                <div key={i} className="rounded-lg bg-accent/50 p-3 text-center">
                  <s.icon className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Overview */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">{t('Case Studies', 'Казуси')}</h3>
              </div>
              <Progress value={(casesCompleted / Math.max(cases.length, 1)) * 100} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">{casesCompleted} / {cases.length} {t('completed', 'завършени')}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">{t('Simulator', 'Симулатор')}</h3>
              </div>
              <Progress value={(simWeek / 6) * 100} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">{t('Week', 'Седмица')} {simWeek}/6 {simComplete ? `✓ ${t('Complete', 'Завършен')}` : ''}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Rocket className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">{t('Startup Project', 'Стартъп проект')}</h3>
              </div>
              <Progress value={startupPct} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">{startupPct}% {t('complete', 'завършен')}</p>
            </div>
          </div>

          {/* Learning Outcomes */}
          <LearningOutcomes lang={lang} scores={outcomeScores} />

          {/* Strengths & Weaknesses */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-sim-success" />
                {t('Strengths', 'Силни страни')}
              </h3>
              {strengths.length === 0 ? (
                <p className="text-xs text-muted-foreground">{t('Complete more activities to identify strengths', 'Завършете повече дейности, за да идентифицирате силни страни')}</p>
              ) : (
                <div className="space-y-2">
                  {strengths.map(s => (
                    <div key={s.id} className="flex items-center justify-between">
                      <span className="text-xs text-foreground">{lang === 'bg' ? s.bg : s.en}</span>
                      <Badge variant="outline" className="text-[10px] text-sim-success">{s.score}%</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-sim-warning" />
                {t('Areas to Improve', 'Области за подобрение')}
              </h3>
              {weaknesses.length === 0 ? (
                <p className="text-xs text-muted-foreground">{t('Great job! All areas above 50%', 'Браво! Всички области над 50%')}</p>
              ) : (
                <div className="space-y-2">
                  {weaknesses.map(s => (
                    <div key={s.id} className="flex items-center justify-between">
                      <span className="text-xs text-foreground">{lang === 'bg' ? s.bg : s.en}</span>
                      <Badge variant="outline" className="text-[10px] text-destructive">{s.score}%</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                {t('Recommended Next Steps', 'Препоръчани следващи стъпки')}
              </h3>
              <ul className="space-y-2">
                {recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-bold text-xs mt-0.5">→</span>
                    <span className="text-xs text-foreground">{t(r.en, r.bg)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
