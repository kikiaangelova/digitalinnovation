import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { useProgress } from '@/context/ProgressContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import LearningNavigator from '@/components/dashboard/LearningNavigator';
import NextStepHero from '@/components/dashboard/NextStepHero';
import DailyGoalCard from '@/components/dashboard/DailyGoalCard';
import QuickResumeCards from '@/components/dashboard/QuickResumeCards';
import AchievementBadges from '@/components/dashboard/AchievementBadges';
import TestInsights from '@/components/dashboard/TestInsights';
import AIMentorWidget from '@/components/dashboard/AIMentorWidget';
import LearningOutcomes from '@/components/dashboard/LearningOutcomes';
import Leaderboard from '@/components/dashboard/Leaderboard';
import WelcomeOnboarding from '@/components/onboarding/WelcomeOnboarding';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, BookOpen, Rocket, BarChart3, FileText, Users, Star, Award, ArrowRight, CheckCircle2, GraduationCap, Sparkles } from 'lucide-react';
import ChallengeHub from '@/components/dashboard/ChallengeHub';
import HypothesisTracker from '@/components/dashboard/HypothesisTracker';
import { LEARNING_MODULES } from '@/data/learning-modules';
import PhaseBadge from '@/components/ui/phase-badge';
import TodayHero from '@/components/dashboard/TodayHero';
import StatsStrip from '@/components/dashboard/StatsStrip';
import { resolveNextAction, type AssignmentInput } from '@/lib/nextAction';

interface CaseRow { id: string; title: string; difficulty: string; est_minutes: number | null; topic?: string | null; }
interface SubRow { case_study_id: string; is_draft: boolean; total_score?: number | null; max_score?: number | null; updated_at?: string | null; }

export default function StudentDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const progress = useProgress();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;


  const [cases, setCases] = useState<CaseRow[]>([]);
  const [submissions, setSubmissions] = useState<SubRow[]>([]);
  const [startupProject, setStartupProject] = useState<any>(null);
  const [simProgress, setSimProgress] = useState<any>(null);
  const [usedAIMentor, setUsedAIMentor] = useState(false);
  const [pendingReviews, setPendingReviews] = useState(0);
  const [avgPeerScore, setAvgPeerScore] = useState<number | null>(null);
  const [totalXp, setTotalXp] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [peerReviewsGiven, setPeerReviewsGiven] = useState(0);
  const [loginStreakDays, setLoginStreakDays] = useState(0);
  const [quizTestsCompleted, setQuizTestsCompleted] = useState(0);
  const [quizCategoriesTested, setQuizCategoriesTested] = useState(0);
  const [quizConsecutiveImprovements, setQuizConsecutiveImprovements] = useState(0);
  const [quizHighScores80, setQuizHighScores80] = useState(0);
  const [completedModuleSlugs, setCompletedModuleSlugs] = useState<Set<string>>(new Set());
  const [assignments, setAssignments] = useState<AssignmentInput[]>([]);
  const [lastActivity, setLastActivity] = useState<{
    caseDraftAt?: string | null;
    startupAt?: string | null;
    simulatorAt?: string | null;
    moduleAt?: string | null;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/auth?redirect=/dashboard'); return; }
    const fetchData = async () => {
      try {
        const [casesRes, subsRes, projRes, simRes, prAssignRes, prReceivedRes, profileRes, prGivenRes] = await Promise.all([
          supabase.from('case_studies').select('id, title, difficulty, est_minutes, topic').eq('published', true),
          supabase.from('submissions').select('case_study_id, is_draft, total_score, max_score, updated_at').eq('user_id', user.id),
          supabase.from('startup_projects').select('problem, customer, value_proposition, digital_product, business_model, growth_strategy, final_pitch, is_submitted, updated_at, bmc_customer_segments, bmc_value_proposition, bmc_channels, bmc_customer_relationships, bmc_revenue_streams, bmc_key_resources, bmc_key_activities, bmc_key_partners, bmc_cost_structure').eq('user_id', user.id).maybeSingle(),
          supabase.from('simulator_progress').select('current_week, is_complete, updated_at').eq('user_id', user.id).maybeSingle(),
          supabase.from('peer_review_assignments').select('id').eq('reviewer_user_id', user.id).eq('status', 'pending'),
          supabase.from('peer_reviews').select('average_score').eq('reviewee_user_id', user.id),
          supabase.from('profiles').select('total_xp, onboarding_completed').eq('user_id', user.id).maybeSingle(),
          supabase.from('peer_reviews').select('id').eq('reviewer_user_id', user.id),
        ]);
        setCases(casesRes.data || []);
        setSubmissions(subsRes.data || []);
        setStartupProject(projRes.data || null);
        setSimProgress(simRes.data || null);
        // Derive last-activity timestamps for the resume tie-breaker.
        const draftSubs = (subsRes.data || []).filter((s: any) => s.is_draft);
        const latestDraft = draftSubs
          .map((s: any) => s.updated_at)
          .filter(Boolean)
          .sort()
          .reverse()[0] ?? null;
        const startupAt = (projRes.data as any)?.updated_at ?? null;
        const simulatorAt = (simRes.data as any)?.updated_at ?? null;
        setPendingReviews((prAssignRes.data || []).length);
        setPeerReviewsGiven((prGivenRes.data || []).length);
        const prScores = (prReceivedRes.data || []) as { average_score: number | null }[];
        setAvgPeerScore(prScores.length > 0 ? prScores.reduce((a, r) => a + Number(r.average_score || 0), 0) / prScores.length : null);
        const profileData = profileRes.data as any;
        setTotalXp(profileData?.total_xp || 0);
        if (profileData && !profileData.onboarding_completed && (profileData.total_xp || 0) === 0) {
          setShowOnboarding(true);
        }
        const { data: ledgerDates } = await supabase.from('xp_ledger').select('created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(100);
        if (ledgerDates && ledgerDates.length > 0) {
          const uniqueDays = [...new Set(ledgerDates.map(r => r.created_at.slice(0, 10)))].sort().reverse();
          let streak = 1;
          for (let i = 1; i < uniqueDays.length; i++) {
            const diff = (new Date(uniqueDays[i - 1]).getTime() - new Date(uniqueDays[i]).getTime()) / 86400000;
            if (diff <= 1.5) streak++; else break;
          }
          setLoginStreakDays(streak);
        }
        // Quiz stats for badges
        const { data: quizData } = await supabase
          .from('quiz_results')
          .select('score, category, created_at')
          .eq('user_id', user.id)
          .eq('quiz_type', 'dictionary')
          .order('created_at', { ascending: true });
        if (quizData && quizData.length > 0) {
          setQuizTestsCompleted(quizData.length);
          setQuizCategoriesTested(new Set(quizData.map(r => r.category).filter(Boolean)).size);
          setQuizHighScores80(quizData.filter(r => r.score >= 80).length);
          // Count consecutive improvements
          let consec = 0, maxConsec = 0;
          for (let i = 1; i < quizData.length; i++) {
            if (quizData[i].score > quizData[i - 1].score) { consec++; maxConsec = Math.max(maxConsec, consec); }
            else consec = 0;
          }
          setQuizConsecutiveImprovements(maxConsec);
        }
        // Theory module completion
        const { data: moduleResponses } = await supabase
          .from('learning_module_responses')
          .select('module_id, completed_at')
          .eq('user_id', user.id)
          .not('completed_at', 'is', null);
        if (moduleResponses && moduleResponses.length > 0) {
          const { data: allMods } = await supabase.from('learning_modules').select('id, slug');
          if (allMods) {
            const completedIds = new Set(moduleResponses.map(r => r.module_id));
            setCompletedModuleSlugs(new Set(allMods.filter(m => completedIds.has(m.id)).map(m => m.slug)));
          }
        }
        // Latest module-response activity (any response, not just completed).
        const { data: latestModuleResp } = await supabase
          .from('learning_module_responses')
          .select('updated_at')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1);
        const moduleAt = latestModuleResp?.[0]?.updated_at ?? null;
        setLastActivity({
          caseDraftAt: latestDraft,
          startupAt,
          simulatorAt,
          moduleAt,
        });

        // Teacher assignments — RLS restricts to classrooms the student
        // belongs to. We just query; the DB is the security boundary.
        const { data: memberships } = await supabase
          .from('classroom_students')
          .select('classroom_id')
          .eq('student_id', user.id);
        const classroomIds = (memberships ?? []).map((m: any) => m.classroom_id);
        if (classroomIds.length > 0) {
          const { data: rawAssignments } = await supabase
            .from('classroom_assignments')
            .select('id, classroom_id, assignment_type, case_id, module_slug, due_date, note')
            .in('classroom_id', classroomIds);
          const casesById = new Map((casesRes.data || []).map((c: any) => [c.id, c]));
          const modulesBySlug = new Map(LEARNING_MODULES.map(m => [m.slug, m]));
          const enriched: AssignmentInput[] = (rawAssignments ?? []).map((a: any) => {
            let title_en: string | null = null;
            let title_bg: string | null = null;
            let target_id: string | null = null;
            if (a.assignment_type === 'case_study' && a.case_id) {
              const c = casesById.get(a.case_id);
              title_en = c?.title ?? 'Assigned case';
              title_bg = c?.title ?? 'Възложен казус';
              target_id = a.case_id;
            } else if (a.assignment_type === 'learn_module' && a.module_slug) {
              const m = modulesBySlug.get(a.module_slug);
              title_en = m?.title_en ?? 'Assigned module';
              title_bg = m?.title_bg ?? 'Възложен модул';
              target_id = a.module_slug;
            } else if (a.assignment_type === 'journey_stage') {
              title_en = 'Journey stage assigned by your teacher';
              title_bg = 'Етап от пътя, зададен от учителя';
            }
            return {
              id: a.id,
              due_date: a.due_date,
              assignment_type: a.assignment_type,
              target_id,
              title_en,
              title_bg,
            };
          });
          setAssignments(enriched);
        } else {
          setAssignments([]);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, authLoading, navigate]);

  // Scroll to hash target (e.g. /dashboard#kiki-mentor) once loading is done.
  useEffect(() => {
    if (loading) return;
    if (typeof window === 'undefined') return;
    const hash = window.location.hash?.replace('#', '');
    if (!hash) return;
    const timer = window.setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
        window.setTimeout(
          () => el.classList.remove('ring-2', 'ring-primary', 'ring-offset-2'),
          2000,
        );
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [loading]);

  const completedSubs = submissions.filter(s => !s.is_draft);
  const casesCompleted = completedSubs.length;
  const casesAbove80Percent = completedSubs.filter(s => s.total_score && s.max_score && (s.total_score / s.max_score) >= 0.8).length;
  const simWeek = simProgress?.current_week || 1;
  const simComplete = simProgress?.is_complete || false;

  const startupSections = ['problem', 'customer', 'value_proposition', 'digital_product', 'business_model', 'growth_strategy', 'final_pitch'];
  const startupSectionMap: Record<string, boolean> = {};
  startupSections.forEach(s => {
    startupSectionMap[s] = startupProject ? ((startupProject as any)[s] || '').trim().length > 20 : false;
  });

  const bmcFields = ['bmc_customer_segments', 'bmc_value_proposition', 'bmc_channels', 'bmc_customer_relationships', 'bmc_revenue_streams', 'bmc_key_resources', 'bmc_key_activities', 'bmc_key_partners', 'bmc_cost_structure'];
  const bmcSectionsCompleted = startupProject ? bmcFields.filter(f => ((startupProject as any)[f] || '').trim().length > 10).length : 0;
  const finalPitchSubmitted = startupProject ? ((startupProject as any).final_pitch || '').trim().length > 20 : false;

  const completedCaseIds = new Set(completedSubs.map(s => s.case_study_id));
  const industriesExplored = new Set(cases.filter(c => completedCaseIds.has(c.id) && c.topic).map(c => c.topic)).size;

  const xp = totalXp || progress.xp;

  const outcomeScores = progress.outcomeScores;

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

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setTotalXp(20);
  };

    const draftCaseIds = new Set(submissions.filter(s => s.is_draft).map(s => s.case_study_id));
    const canonical = resolveNextAction({
      assignments,
      modules: LEARNING_MODULES.map(m => ({
        slug: m.slug,
        title_en: m.title_en,
        title_bg: m.title_bg,
      })),
      completedModuleSlugs,
      cases: cases.map(c => ({ id: c.id, title: c.title, est_minutes: c.est_minutes, topic: c.topic })),
      completedCaseIds,
      draftCaseIds,
      startupSectionMap,
      startupSubmitted: !!startupProject?.is_submitted,
      finalPitchSubmitted,
      simWeek,
      simComplete,
      hasAnyActivity: xp > 0 || casesCompleted > 0 || simWeek > 1,
      lastActivity,
    });

    const hasPeerReviewSignal = pendingReviews > 0 || avgPeerScore !== null;
    const hasFeedbackSignal = hasPeerReviewSignal; // extend when teacher feedback surfaces here

    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        {showOnboarding && <WelcomeOnboarding onComplete={handleOnboardingComplete} />}
        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24 md:pb-8 space-y-5 sm:space-y-6 max-w-5xl">
          {/* ── Warm greeting — narrative Fraunces hero ── */}
          {(() => {
            const rawName = profile?.display_name || profile?.full_name || '';
            const firstName = rawName.trim().split(/\s+/)[0] || '';
            const hour = new Date().getHours();
            const greetEn = hour < 12 ? 'Morning' : hour < 18 ? 'Hey' : 'Evening';
            const greetBg = hour < 12 ? 'Добро утро' : hour < 18 ? 'Здрасти' : 'Добър вечер';
            const emoji = hour < 12 ? '☀️' : hour < 18 ? '👋' : '🌙';
            return (
              <section
                className="relative overflow-hidden rounded-3xl border border-border/60 p-6 sm:p-8"
                style={{ background: 'var(--gradient-soft)', boxShadow: 'var(--shadow-warm)' }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                  {t('Today', 'Днес')}
                </p>
                <h1 className="mt-1 font-display text-4xl font-extrabold leading-[0.95] text-foreground sm:text-6xl">
                  {t(greetEn, greetBg)}{firstName ? `, ${firstName}` : ''}
                  <span className="ml-2 inline-block -rotate-6">{emoji}</span>
                  <br />
                  <span
                    className="italic bg-clip-text text-transparent"
                    style={{ backgroundImage: 'var(--gradient-zest)' }}
                  >
                    {t('one move.', 'един ход.')}
                  </span>
                </h1>
                <p className="mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
                  {t(
                    'You don\u2019t need to do it all today. Kiki\u2019s note: pick one thing, finish it, close the tab proud.',
                    'Не е нужно да правиш всичко днес. Кики казва: избери едно нещо, довърши го, затвори с усмивка.'
                  )}
                </p>
              </section>
            );
          })()}

          {/* ── Stats strip ── */}
          <StatsStrip
            lang={lang}
            xp={xp}
            streakDays={loginStreakDays}
            casesCompleted={casesCompleted}
          />

          {/* ── Primary zone: Today ── */}
          <TodayHero lang={lang} action={canonical} />

          {/* ── Secondary zone: Your Learning (max 3 cards) ── */}
          <section aria-label={t('Your learning', 'Твоето учене')} className="space-y-4">
            <div className="section-chip-amber -rotate-1">
              <BarChart3 className="h-4 w-4" />
              {t('Your learning', 'Твоето учене')}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <LearningOutcomes lang={lang} scores={outcomeScores} />
              {hasFeedbackSignal ? (
                <div className="dash-section">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="typo-card-title flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      {t('Recent feedback', 'Последна обратна връзка')}
                    </h3>
                    <Button variant="outline" size="sm" className="min-h-[44px]" onClick={() => navigate('/peer-review')}>
                      {t('Open', 'Отвори')}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {pendingReviews > 0 && (
                      <div className="rounded-xl bg-accent/50 p-3 text-center">
                        <p className="text-xl font-bold text-foreground">{pendingReviews}</p>
                        <p className="text-xs text-muted-foreground">{t('Pending reviews', 'Чакащи рецензии')}</p>
                      </div>
                    )}
                    {avgPeerScore !== null && (
                      <div className="rounded-xl bg-accent/50 p-3 text-center">
                        <p className="text-xl font-bold text-primary flex items-center justify-center gap-1">
                          <Star className="h-4 w-4" /> {avgPeerScore.toFixed(1)}/4
                        </p>
                        <p className="text-xs text-muted-foreground">{t('Your avg score', 'Средна оценка')}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="dash-section text-sm text-muted-foreground">
                  <h3 className="typo-card-title flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-primary" />
                    {t('Recent feedback', 'Последна обратна връзка')}
                  </h3>
                  <p>{t('Submit a case to start receiving peer feedback.', 'Подай казус, за да започнеш да получаваш рецензии.')}</p>
                </div>
              )}
            </div>
            {/* Missions / assignments row — reuses ChallengeHub as the weekly-mission surface */}
            <ChallengeHub lang={lang} userId={user?.id} />
          </section>

          {/* ── Progress zone ── */}
          <section aria-label={t('Progress', 'Прогрес')} className="space-y-4">
            <div className="section-chip-orange rotate-1">
              <Star className="h-4 w-4" />
              {t('Progress', 'Прогрес')}
            </div>
            <LearningNavigator
              lang={lang}
              xp={xp}
              casesCompleted={casesCompleted}
              startupSections={startupSectionMap}
              startupSubmitted={startupProject?.is_submitted || false}
              simWeek={simWeek}
              simComplete={simComplete}
              outcomeScores={outcomeScores}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <AchievementBadges
                lang={lang}
                casesCompleted={casesCompleted}
                startupSubmitted={startupProject?.is_submitted || false}
                simulatorComplete={simComplete}
                usedAIMentor={usedAIMentor}
                casesAbove80Percent={casesAbove80Percent}
                bmcSectionsCompleted={bmcSectionsCompleted}
                finalPitchSubmitted={finalPitchSubmitted}
                peerReviewsGiven={peerReviewsGiven}
                industriesExplored={industriesExplored}
                loginStreakDays={loginStreakDays}
                quizTestsCompleted={quizTestsCompleted}
                quizCategoriesTested={quizCategoriesTested}
                quizConsecutiveImprovements={quizConsecutiveImprovements}
                quizHighScores80={quizHighScores80}
              />
              <Leaderboard lang={lang} currentUserId={user?.id} limit={5} />
            </div>
          </section>

          {/* ── Explore zone ── */}
          <section aria-label={t('Explore', 'Разгледай')} className="space-y-4">
            <div className="section-chip-violet -rotate-1">
              <BookOpen className="h-4 w-4" />
              {t('Explore', 'Разгледай')}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { to: '/dictionary', bg: 'bg-[hsl(200_90%_88%)]', title: t('Dictionary', 'Речник'), desc: t('Key terms, fast.', 'Ключовите думи, бързо.') },
                { to: '/industries', bg: 'bg-[hsl(160_84%_82%)]', title: t('Industry Map', 'Индустриална карта'), desc: t('Innovation across sectors.', 'Иновации по сектори.') },
                { to: '/my-report', bg: 'bg-[hsl(43_96%_78%)]', title: t('My Report', 'Моят отчет'), desc: t('Your learning report.', 'Отчет за напредъка.') },
                { to: '/final-exam', bg: 'bg-[hsl(340_82%_85%)]', title: t('Final Exam', 'Финален изпит'), desc: t('Earn your certificate.', 'Спечели сертификат.'), icon: Award },
              ].map((tile, i) => {
                const Icon = tile.icon;
                return (
                  <button
                    key={tile.to}
                    onClick={() => navigate(tile.to)}
                    className={`text-left min-h-[96px] rounded-2xl border-2 border-foreground quest-shadow-sm p-4 transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none ${tile.bg} ${i % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
                  >
                    <h3 className="font-quest font-bold text-foreground flex items-center gap-1">
                      {Icon ? <Icon className="h-4 w-4" /> : null} {tile.title}
                    </h3>
                    <p className="text-xs text-foreground/70 mt-1">{tile.desc}</p>
                  </button>
                );
              })}
            </div>
            <AIMentorWidget
              lang={lang}
              startupData={startupProject}
              onFeedbackReceived={() => setUsedAIMentor(true)}
            />
            <TestInsights lang={lang} userId={user?.id} />
          </section>

        </main>
      </div>
    );
}
