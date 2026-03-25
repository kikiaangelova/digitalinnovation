import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import LevelCard from '@/components/dashboard/LevelCard';
import JourneyProgress from '@/components/dashboard/JourneyProgress';
import AchievementBadges from '@/components/dashboard/AchievementBadges';
import AIMentorWidget from '@/components/dashboard/AIMentorWidget';
import LearningOutcomes, { calcOutcomeScores } from '@/components/dashboard/LearningOutcomes';
import Leaderboard from '@/components/dashboard/Leaderboard';
import WelcomeOnboarding from '@/components/onboarding/WelcomeOnboarding';
import { Button } from '@/components/ui/button';
import { Zap, BookOpen, Rocket, BarChart3, FileText, Users, Star } from 'lucide-react';

interface CaseRow { id: string; title: string; difficulty: string; est_minutes: number | null; topic?: string | null; }
interface SubRow { case_study_id: string; is_draft: boolean; total_score?: number | null; max_score?: number | null; }

export default function StudentDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
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
        // Login streak from xp_ledger
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

  // Industries explored: count distinct topics from completed cases
  const completedCaseIds = new Set(completedSubs.map(s => s.case_study_id));
  const industriesExplored = new Set(cases.filter(c => completedCaseIds.has(c.id) && c.topic).map(c => c.topic)).size;

  const xp = totalXp;

  // Learning outcomes
  const outcomeScores = calcOutcomeScores({
    casesCompleted,
    casesTotal: cases.length,
    startupSections: startupSectionMap,
    simWeek,
    simComplete,
  });

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

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      {showOnboarding && <WelcomeOnboarding onComplete={handleOnboardingComplete} />}
      <main className="container mx-auto px-4 py-8 space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              {t('Your Innovation Dashboard', 'Твоето иновационно табло')}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {t('Track your progress, earn XP, and build your startup', 'Проследи напредъка си, спечели XP и изгради своя стартъп')}
            </p>
          </div>
          <Button variant="outline" size="sm" className="print:hidden" onClick={() => navigate('/my-report')}>
            <FileText className="h-4 w-4 mr-1" /> {t('My Report', 'Моят доклад')}
          </Button>
        </div>

        {/* ═══ PRIMARY: Journey Progress + XP ═══ */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <JourneyProgress
              lang={lang}
              casesCompleted={casesCompleted}
              startupSections={startupSectionMap}
              startupSubmitted={startupProject?.is_submitted || false}
              simWeek={simWeek}
              simComplete={simComplete}
            />
          </div>
          <div className="space-y-4">
            <LevelCard xp={xp} lang={lang} />
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
        </div>

        {/* ═══ Learning Outcomes + Leaderboard ═══ */}
        <div className="grid gap-4 md:grid-cols-2">
          <LearningOutcomes lang={lang} scores={outcomeScores} />
          <Leaderboard lang={lang} currentUserId={user?.id} limit={5} />
        </div>

        {/* ═══ Badges ═══ */}
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
        />

        {/* ═══ Peer Review ═══ */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              {t('Peer Review', 'Партньорска рецензия')}
            </h3>
            <Button variant="outline" size="sm" onClick={() => navigate('/peer-review')}>
              {t('Open', 'Отвори')}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-accent/50 p-3 text-center">
              {pendingReviews > 0 ? (
                <>
                  <p className="text-xl font-bold text-foreground">{pendingReviews}</p>
                  <p className="text-xs text-muted-foreground">{t('Pending Reviews', 'Чакащи рецензии')}</p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed py-1">
                  {t(
                    "No reviews yet — you'll receive feedback after submitting your first case",
                    'Все още няма рецензии — ще получиш обратна връзка, след като подадеш първия си казус'
                  )}
                </p>
              )}
            </div>
            <div className="rounded-lg bg-accent/50 p-3 text-center">
              <p className="text-xl font-bold text-primary flex items-center justify-center gap-1">
                {avgPeerScore !== null ? <><Star className="h-4 w-4" /> {avgPeerScore.toFixed(1)}/4</> : '—'}
              </p>
              <p className="text-xs text-muted-foreground">{t('Your Avg Score', 'Вашата средна оценка')}</p>
            </div>
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
