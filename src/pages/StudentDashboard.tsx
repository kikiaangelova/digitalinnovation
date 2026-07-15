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
import { Zap, BookOpen, Rocket, BarChart3, FileText, Users, Star, Award, ArrowRight, CheckCircle2, GraduationCap } from 'lucide-react';
import ChallengeHub from '@/components/dashboard/ChallengeHub';
import HypothesisTracker from '@/components/dashboard/HypothesisTracker';
import { LEARNING_MODULES } from '@/data/learning-modules';
import PhaseBadge from '@/components/ui/phase-badge';
import TodayHero from '@/components/dashboard/TodayHero';
import { isFeatureEnabled } from '@/lib/featureFlags';
import { resolveNextAction } from '@/lib/nextAction';

interface CaseRow { id: string; title: string; difficulty: string; est_minutes: number | null; topic?: string | null; }
interface SubRow { case_study_id: string; is_draft: boolean; total_score?: number | null; max_score?: number | null; }

export default function StudentDashboard() {
  const { user, loading: authLoading } = useAuth();
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/auth?redirect=/dashboard'); return; }
    const fetchData = async () => {
      try {
        const [casesRes, subsRes, projRes, simRes, prAssignRes, prReceivedRes, profileRes, prGivenRes] = await Promise.all([
          supabase.from('case_studies').select('id, title, difficulty, est_minutes, topic').eq('published', true),
          supabase.from('submissions').select('case_study_id, is_draft, total_score, max_score').eq('user_id', user.id),
          supabase.from('startup_projects').select('problem, customer, value_proposition, digital_product, business_model, growth_strategy, final_pitch, is_submitted, bmc_customer_segments, bmc_value_proposition, bmc_channels, bmc_customer_relationships, bmc_revenue_streams, bmc_key_resources, bmc_key_activities, bmc_key_partners, bmc_cost_structure').eq('user_id', user.id).maybeSingle(),
          supabase.from('simulator_progress').select('current_week, is_complete').eq('user_id', user.id).maybeSingle(),
          supabase.from('peer_review_assignments').select('id').eq('reviewer_user_id', user.id).eq('status', 'pending'),
          supabase.from('peer_reviews').select('average_score').eq('reviewee_user_id', user.id),
          supabase.from('profiles').select('total_xp, onboarding_completed').eq('user_id', user.id).maybeSingle(),
          supabase.from('peer_reviews').select('id').eq('reviewer_user_id', user.id),
        ]);
        setCases(casesRes.data || []);
        setSubmissions(subsRes.data || []);
        setStartupProject(projRes.data || null);
        setSimProgress(simRes.data || null);
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
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, authLoading, navigate]);

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

  const xpActions = [
    { action: t('Complete case study', 'Завърши казус'), xp: '+100 XP', icon: BookOpen },
    { action: t('High-quality analysis (>70%)', 'Качествен анализ (>70%)'), xp: '+30 XP', icon: Zap },
    { action: t('Complete simulator scenario', 'Завърши сценарий от симулатора'), xp: '+50 XP', icon: BarChart3 },
    { action: t('Submit startup section', 'Подай секция от стартъп'), xp: '+40–50 XP', icon: Rocket },
    { action: t('Submit final pitch', 'Подай финално представяне'), xp: '+120 XP', icon: Zap },
    { action: t('Explore dictionary term', 'Научи термин от речника'), xp: '+2 XP', icon: BookOpen },
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

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setTotalXp(20);
  };

  // Determine next action for the student
  const getNextAction = () => {
    if (casesCompleted === 0) return { label: t('Start your first case study', 'Започни първия си казус'), path: '/cases', icon: BookOpen };
    const startupFilled = Object.values(startupSectionMap).filter(Boolean).length;
    if (startupFilled < 3) return { label: t('Build your startup idea', 'Изгради стартъп идеята си'), path: '/my-startup', icon: Rocket };
    if (!simComplete && simWeek <= 3) return { label: t('Test your strategy in the simulator', 'Тествай стратегията в симулатора'), path: '/simulator', icon: BarChart3 };
    if (!finalPitchSubmitted) return { label: t('Submit your final pitch', 'Подай финалното си представяне'), path: '/my-startup', icon: Rocket };
    return { label: t('Take the final exam', 'Започни финалния изпит'), path: '/final-exam', icon: Award };
  };

  const nextAction = getNextAction();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      {showOnboarding && <WelcomeOnboarding onComplete={handleOnboardingComplete} />}
      <main className="container mx-auto px-4 py-6 sm:py-8 pb-24 md:pb-8 space-y-6 sm:space-y-8 max-w-6xl">
        {/* ═══ Header + Next Action ═══ */}
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="typo-h1 flex items-center gap-2">
              {t('Your Innovation Dashboard', 'Твоето иновационно табло')}
              <PhaseBadge phase="fun" lang={lang} />
            </h1>
            <p className="typo-helper mt-1">
              {t('Track your progress, earn XP, and build your startup', 'Проследи напредъка си, спечели XP и изгради своя стартъп')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Button
              className="sim-gradient border-0 gap-2 w-full sm:w-auto"
              onClick={() => navigate(nextAction.path)}
            >
              <nextAction.icon className="h-4 w-4" />
              <span className="truncate">{nextAction.label}</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Button>
            <Button variant="outline" size="sm" className="print:hidden w-full sm:w-auto" onClick={() => navigate('/my-report')}>
              <FileText className="h-4 w-4 mr-1" /> {t('Report', 'Доклад')}
            </Button>
          </div>
        </div>

        {/* ═══ NEXT STEP HERO (read-only) ═══ */}
        <NextStepHero
          lang={lang}
          casesCompleted={casesCompleted}
          startupSectionMap={startupSectionMap}
          startupSubmitted={startupProject?.is_submitted || false}
          simWeek={simWeek}
          simComplete={simComplete}
          finalPitchSubmitted={finalPitchSubmitted}
          stagesCompleted={progress.stagesCompleted}
        />

        {/* ═══ SECTION 1: Learning Navigator (Hero) ═══ */}
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

        {/* ═══ Quick Resume Cards — "Продължи оттам, където спря" ═══ */}
        {(() => {
          // Find next incomplete module
          const nextMod = LEARNING_MODULES.find(m => !completedModuleSlugs.has(m.slug));
          // Find last started but incomplete case (draft submission)
          const draftSubs = submissions.filter(s => s.is_draft);
          const lastDraftCase = draftSubs.length > 0
            ? cases.find(c => c.id === draftSubs[draftSubs.length - 1].case_study_id)
            : undefined;
          // Find next unstarted case if no draft
          const nextCase = !lastDraftCase
            ? cases.find(c => !completedCaseIds.has(c.id))
            : undefined;
          const resumeCase = lastDraftCase || nextCase;

          return (
            <QuickResumeCards
              lang={lang}
              lastCaseTitle={resumeCase?.title}
              lastCaseId={resumeCase?.id}
              nextModuleTitle={nextMod ? (lang === 'bg' ? nextMod.title_bg : nextMod.title_en) : undefined}
              nextModuleSlug={nextMod?.slug}
              simWeek={simWeek}
              simComplete={simComplete}
              startupProgressPct={progress.startupProgressPct}
              startupSubmitted={startupProject?.is_submitted || false}
            />
          );
        })()}
        {/* ═══ Daily Goal (visual only, no XP changes) ═══ */}
        <DailyGoalCard lang={lang} simComplete={simComplete} simWeek={simWeek} />

        {/* ═══ Theory Modules ═══ */}
        <Card className="p-5 border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                {t('Theory Modules', 'Теоретични модули')}
              </h3>
            </div>
            <span className="text-xs text-muted-foreground">
              {t('Earn up to 125 XP', 'Спечели до 125 XP')}
            </span>
          </div>
          <div className="space-y-2">
            {LEARNING_MODULES.map(mod => {
              const done = completedModuleSlugs.has(mod.slug);
              return (
                <button
                  key={mod.slug}
                  onClick={() => navigate(`/learn/${mod.slug}`)}
                  className="flex items-center gap-3 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-left hover:border-primary/30 transition-colors"
                >
                  {done ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                  )}
                  <span className={`text-sm flex-1 ${done ? 'text-muted-foreground line-through' : 'text-foreground font-medium'}`}>
                    {lang === 'bg' ? mod.title_bg : mod.title_en}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </Card>

        <HypothesisTracker lang={lang} />
        <ChallengeHub lang={lang} userId={user?.id} />
        <TestInsights lang={lang} userId={user?.id} />

        {/* ═══ SECTION 2: Learning & Competition ═══ */}
        <div>
          <h2 className="typo-h2 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {t('Your Learning & Ranking', 'Твоят напредък и класиране')}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <LearningOutcomes lang={lang} scores={outcomeScores} />
            <Leaderboard lang={lang} currentUserId={user?.id} limit={5} />
          </div>
        </div>

        {/* ═══ SECTION 3: Achievements & Social ═══ */}
        <div>
          <h2 className="typo-h2 mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-xp-gold" />
            {t('Achievements & Community', 'Постижения и общност')}
          </h2>

          <div className="space-y-4">
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

            {/* Peer Review + XP Actions — side by side */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Peer Review */}
              <div className="dash-section">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="typo-card-title flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    {t('Peer Review', 'Партньорска рецензия')}
                  </h3>
                  <Button variant="outline" size="sm" onClick={() => navigate('/peer-review')}>
                    {t('Open', 'Отвори')}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-accent/50 p-3 text-center">
                    {pendingReviews > 0 ? (
                      <>
                        <p className="text-xl font-bold text-foreground">{pendingReviews}</p>
                        <p className="text-xs text-muted-foreground">{t('Pending Reviews', 'Чакащи рецензии')}</p>
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground leading-relaxed py-1">
                        {t(
                          "No reviews yet — submit a case first",
                          'Все още няма — подай казус първо'
                        )}
                      </p>
                    )}
                  </div>
                  <div className="rounded-xl bg-accent/50 p-3 text-center">
                    <p className="text-xl font-bold text-primary flex items-center justify-center gap-1">
                      {avgPeerScore !== null ? <><Star className="h-4 w-4" /> {avgPeerScore.toFixed(1)}/4</> : '—'}
                    </p>
                    <p className="text-xs text-muted-foreground">{t('Your Avg Score', 'Средна оценка')}</p>
                  </div>
                </div>
              </div>

              {/* XP Actions */}
              <div className="dash-section">
                <h3 className="typo-card-title mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-xp-gold" />
                  {t('Earn XP', 'Спечели XP')}
                </h3>
                <div className="space-y-1.5">
                  {xpActions.map((a, i) => (
                    <div key={i} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <a.icon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-foreground">{a.action}</span>
                      </div>
                      <span className="text-xs typo-xp">{a.xp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SECTION 4: Final Exam ═══ */}
        <div className="dash-section-accent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="typo-card-title">{t('Final Exam & Certificate', 'Финален изпит и сертификат')}</h3>
                <p className="text-xs text-muted-foreground">{t('Prove your skills and earn your certificate', 'Докажи уменията си и получи сертификат')}</p>
              </div>
            </div>
            <Button onClick={() => navigate('/final-exam')} className="gap-2">
              <Award className="h-4 w-4" /> {t('Take Exam', 'Започни изпит')}
            </Button>
          </div>
        </div>

        {/* ═══ AI Mentor ═══ */}
        <AIMentorWidget
          lang={lang}
          startupData={startupProject}
          onFeedbackReceived={() => setUsedAIMentor(true)}
        />
      </main>
    </div>
  );
}
