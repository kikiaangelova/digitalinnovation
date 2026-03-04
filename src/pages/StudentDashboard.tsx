import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/layout/AppHeader';
import LevelCard from '@/components/dashboard/LevelCard';
import ProgressCards from '@/components/dashboard/ProgressCards';
import AchievementBadges from '@/components/dashboard/AchievementBadges';
import AIMentorWidget from '@/components/dashboard/AIMentorWidget';
import CourseTimeline from '@/components/dashboard/CourseTimeline';
import { Zap, BookOpen, Rocket, BarChart3 } from 'lucide-react';

interface CaseRow { id: string; title: string; difficulty: string; est_minutes: number | null; }
interface SubRow { case_study_id: string; is_draft: boolean; }

export default function StudentDashboard() {
  const { user } = useAuth();
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  const [cases, setCases] = useState<CaseRow[]>([]);
  const [submissions, setSubmissions] = useState<SubRow[]>([]);
  const [startupProject, setStartupProject] = useState<any>(null);
  const [simProgress, setSimProgress] = useState<any>(null);
  const [usedAIMentor, setUsedAIMentor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const [casesRes, subsRes, projRes, simRes] = await Promise.all([
        supabase.from('case_studies').select('id, title, difficulty, est_minutes').eq('published', true),
        supabase.from('submissions').select('case_study_id, is_draft').eq('user_id', user.id),
        supabase.from('startup_projects').select('problem, customer, value_proposition, digital_product, business_model, growth_strategy, final_pitch, is_submitted').eq('user_id', user.id).maybeSingle(),
        supabase.from('simulator_progress').select('current_week, is_complete').eq('user_id', user.id).maybeSingle(),
      ]);
      setCases(casesRes.data || []);
      setSubmissions(subsRes.data || []);
      setStartupProject(projRes.data || null);
      setSimProgress(simRes.data || null);
      setLoading(false);
    };
    fetch();
  }, [user]);

  // XP calculation
  const casesCompleted = submissions.filter(s => !s.is_draft).length;
  const casesInProgress = submissions.filter(s => s.is_draft).length;
  const simWeek = simProgress?.current_week || 1;
  const simComplete = simProgress?.is_complete || false;

  const startupSections = ['problem', 'customer', 'value_proposition', 'digital_product', 'business_model', 'growth_strategy', 'final_pitch'];
  const startupFilled = startupProject
    ? startupSections.filter(s => ((startupProject as any)[s] || '').trim().length > 20).length
    : 0;
  const startupPct = Math.round((startupFilled / startupSections.length) * 100);

  // XP: 50 per case, 100 per sim week, 75 per startup section, 200 bonus for submission
  const xp =
    casesCompleted * 50 +
    (simWeek - 1) * 100 + (simComplete ? 100 : 0) +
    startupFilled * 75 +
    (startupProject?.is_submitted ? 200 : 0);

  // Next incomplete case
  const completedIds = new Set(submissions.filter(s => !s.is_draft).map(s => s.case_study_id));
  const nextCase = cases.find(c => !completedIds.has(c.id));

  // Current course week estimate (simplified)
  const courseWeek = Math.min(6, Math.max(1, Math.ceil((casesCompleted + startupFilled * 0.5 + (simWeek - 1) * 0.5) / 1.5) + 1));

  // XP actions list
  const xpActions = [
    { action: t('Complete case study', 'Завърши казус'), xp: '+50 XP', icon: BookOpen },
    { action: t('Finish simulator week', 'Завърши седмица от симулатора'), xp: '+100 XP', icon: BarChart3 },
    { action: t('Submit startup section', 'Подай секция от стартъп'), xp: '+75 XP', icon: Rocket },
    { action: t('Submit final pitch', 'Подай финално представяне'), xp: '+200 XP', icon: Zap },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-muted-foreground">{t('Loading...', 'Зареждане...')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 space-y-6 max-w-6xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            {t('Your Innovation Dashboard', 'Твоето иновационно табло')}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t('Track your progress, earn XP, and build your startup', 'Проследи напредъка си, спечели XP и изгради своя стартъп')}
          </p>
        </div>

        {/* Level + XP Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <LevelCard xp={xp} lang={lang} />
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-sim-warning" />
              {t('Earn XP', 'Спечели XP')}
            </h3>
            <div className="space-y-2">
              {xpActions.map((a, i) => (
                <div key={i} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <a.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs">{a.action}</span>
                  </div>
                  <span className="text-xs font-bold text-sim-warning">{a.xp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Cards */}
        <ProgressCards
          lang={lang}
          casesCompleted={casesCompleted}
          casesTotal={cases.length}
          startupProgress={startupPct}
          startupSubmitted={startupProject?.is_submitted || false}
          simulatorWeek={simWeek}
          simulatorComplete={simComplete}
          nextCaseTitle={nextCase?.title}
          nextCaseDifficulty={nextCase?.difficulty}
          nextCaseMinutes={nextCase?.est_minutes || undefined}
          nextCaseId={nextCase?.id}
        />

        {/* Badges */}
        <AchievementBadges
          lang={lang}
          casesCompleted={casesCompleted}
          startupSubmitted={startupProject?.is_submitted || false}
          simulatorComplete={simComplete}
          usedAIMentor={usedAIMentor}
        />

        {/* AI Mentor + Course Timeline */}
        <div className="grid gap-4 md:grid-cols-2">
          <AIMentorWidget
            lang={lang}
            startupData={startupProject}
            onFeedbackReceived={() => setUsedAIMentor(true)}
          />
          <CourseTimeline lang={lang} currentWeek={courseWeek} />
        </div>
      </main>
    </div>
  );
}
