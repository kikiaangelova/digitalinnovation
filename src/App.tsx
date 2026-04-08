import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { XpCelebrationToaster } from "@/components/ui/xp-celebration-toast";
import { CelebrationOverlay } from "@/components/ui/celebration-overlay";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { LangProvider } from "@/context/LangContext";
import { SimulatorProvider } from "@/context/SimulatorContext";
import { ProgressProvider } from "@/context/ProgressContext";
import ProfileGate from "@/components/layout/ProfileGate";
import AppFooter from "@/components/layout/AppFooter";
import AdminRoute from "@/components/layout/AdminRoute";
import RoleGuard from "@/components/layout/RoleGuard";
import CycleFAB from "@/components/layout/CycleFAB";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import StudentDashboard from "./pages/StudentDashboard";
import CasePlayer from "./pages/CasePlayer";
import CaseResults from "./pages/CaseResults";
import CaseLibrary from "./pages/CaseLibrary";
import Dictionary from "./pages/Dictionary";
import AboutDigitalInnovation from "./pages/AboutDigitalInnovation";
import CasePreview from "./pages/CasePreview";
import SimulatorPreview from "./pages/SimulatorPreview";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";
import TeamWorkspace from "./pages/TeamWorkspace";
import AssessmentPlayer from "./pages/AssessmentPlayer";
import AssessmentResults from "./pages/AssessmentResults";
import StudentLanding from "./pages/simulator/StudentLanding";
import SeasonView from "./pages/simulator/SeasonView";
import RoundView from "./pages/simulator/RoundView";
import SimulatorAdmin from "./pages/admin/SimulatorAdmin";
import SeasonAnalytics from "./pages/admin/SeasonAnalytics";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import CohortManager from "./pages/admin/CohortManager";
import MyStartupIdea from "./pages/MyStartupIdea";
import StartupProjectsAdmin from "./pages/admin/StartupProjectsAdmin";
import IndustryInnovationMap from "./pages/IndustryInnovationMap";
import StartupSimulator from "./pages/StartupSimulator";
import TeacherDashboard from "./pages/TeacherDashboard";
import LearningReport from "./pages/LearningReport";
import SystemStatus from "./pages/admin/SystemStatus";
import LeaderboardPage from "./pages/LeaderboardPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PeerReview from "./pages/PeerReview";
import PeerReviewAdmin from "./pages/admin/PeerReviewAdmin";
import LearningJourney from "./pages/LearningJourney";
import StageLearn from "./pages/StageLearn";
import LearningModules from "./pages/LearningModules";
import LearningModulePlayer from "./pages/LearningModulePlayer";
import FinalExam from "./pages/FinalExam";
import Certificate from "./pages/Certificate";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import PendingApproval from "./pages/PendingApproval";
import TeacherClassroom from "./pages/TeacherClassroom";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import JoinClassroom from "./pages/JoinClassroom";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <XpCelebrationToaster />
      <CelebrationOverlay />
      <LangProvider>
        <AuthProvider>
          <ProgressProvider>
            <SimulatorProvider>
              <BrowserRouter>
                <ScrollToTop />
                <ProfileGate>
                <div className="flex min-h-screen flex-col overflow-x-hidden">
                  <div className="flex-1 pb-20 md:pb-0">
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/reset-password" element={<ResetPasswordPage />} />
                      <Route path="/about" element={<AboutDigitalInnovation />} />
                      <Route path="/innovation-basics" element={<AboutDigitalInnovation />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="/terms" element={<TermsOfUse />} />

                      {/* Pending teacher route */}
                      <Route path="/pending" element={<PendingApproval />} />

                      {/* Student + teacher_verified + admin routes */}
                      <Route path="/dashboard" element={<RoleGuard allowed={['student', 'teacher_verified', 'admin']}><StudentDashboard /></RoleGuard>} />
                      <Route path="/profile" element={<RoleGuard allowed={['student', 'teacher_pending', 'teacher_verified', 'admin']}><ProfilePage /></RoleGuard>} />
                      <Route path="/cases" element={<RoleGuard allowed={['student', 'teacher_verified', 'admin']}><CaseLibrary /></RoleGuard>} />
                      <Route path="/dictionary" element={<RoleGuard allowed={['student', 'teacher_verified', 'admin']}><Dictionary /></RoleGuard>} />
                      <Route path="/case/:id/preview" element={<RoleGuard allowed={['student', 'teacher_verified', 'admin']}><CasePreview /></RoleGuard>} />
                      <Route path="/case/:id" element={<RoleGuard allowed={['student', 'teacher_verified', 'admin']}><CasePlayer /></RoleGuard>} />
                      <Route path="/case/:id/results" element={<RoleGuard allowed={['student', 'teacher_verified', 'admin']}><CaseResults /></RoleGuard>} />
                      <Route path="/simulator/preview" element={<RoleGuard allowed={['student', 'teacher_verified', 'admin']}><SimulatorPreview /></RoleGuard>} />
                      <Route path="/team/:teamId" element={<RoleGuard allowed={['student', 'teacher_verified', 'admin']}><TeamWorkspace /></RoleGuard>} />
                      <Route path="/assessment/:id" element={<RoleGuard allowed={['student', 'admin']}><AssessmentPlayer /></RoleGuard>} />
                      <Route path="/assessment/:id/results" element={<RoleGuard allowed={['student', 'admin']}><AssessmentResults /></RoleGuard>} />
                      <Route path="/journey" element={<RoleGuard allowed={['student', 'admin']}><LearningJourney /></RoleGuard>} />
                      <Route path="/journey/learn/:stageId" element={<RoleGuard allowed={['student', 'admin']}><StageLearn /></RoleGuard>} />
                      <Route path="/learn" element={<RoleGuard allowed={['student', 'teacher_verified', 'admin']}><LearningModules /></RoleGuard>} />
                      <Route path="/learn/:slug" element={<RoleGuard allowed={['student', 'teacher_verified', 'admin']}><LearningModulePlayer /></RoleGuard>} />
                      <Route path="/leaderboard" element={<RoleGuard allowed={['student', 'admin']}><LeaderboardPage /></RoleGuard>} />
                      <Route path="/simulator" element={<RoleGuard allowed={['student', 'teacher_verified', 'admin']}><StartupSimulator /></RoleGuard>} />
                      <Route path="/simulator/season/:id" element={<RoleGuard allowed={['student', 'teacher_verified', 'admin']}><SeasonView /></RoleGuard>} />
                      <Route path="/simulator/season/:id/round/:n" element={<RoleGuard allowed={['student', 'teacher_verified', 'admin']}><RoundView /></RoleGuard>} />
                      <Route path="/industries" element={<RoleGuard allowed={['student', 'teacher_verified', 'admin']}><IndustryInnovationMap /></RoleGuard>} />
                      <Route path="/startup-simulator" element={<RoleGuard allowed={['student', 'teacher_verified', 'admin']}><StartupSimulator /></RoleGuard>} />
                      <Route path="/peer-review" element={<RoleGuard allowed={['student', 'admin']}><PeerReview /></RoleGuard>} />
                      <Route path="/my-report" element={<RoleGuard allowed={['student', 'admin']}><LearningReport /></RoleGuard>} />
                      <Route path="/final-exam" element={<RoleGuard allowed={['student', 'admin']}><FinalExam /></RoleGuard>} />
                      <Route path="/certificate" element={<RoleGuard allowed={['student', 'admin']}><Certificate /></RoleGuard>} />

                      {/* Student-only routes */}
                      <Route path="/my-startup" element={<RoleGuard allowed={['student', 'admin']}><MyStartupIdea /></RoleGuard>} />

                      {/* Teacher-verified routes */}
                      <Route path="/teacher" element={<RoleGuard allowed={['teacher_verified', 'admin']} redirectTo="/dashboard"><TeacherClassroom /></RoleGuard>} />
                      <Route path="/teacher-dashboard" element={<RoleGuard allowed={['teacher_verified', 'admin']} redirectTo="/dashboard"><TeacherDashboardPage /></RoleGuard>} />

                      {/* Join classroom route (students) */}
                      <Route path="/join/:code" element={<JoinClassroom />} />

                      {/* Admin routes */}
                      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                      <Route path="/admin/analytics" element={<AdminRoute><AnalyticsDashboard /></AdminRoute>} />
                      <Route path="/admin/cohorts" element={<AdminRoute><CohortManager /></AdminRoute>} />
                      <Route path="/admin/simulator" element={<AdminRoute><SimulatorAdmin /></AdminRoute>} />
                      <Route path="/admin/simulator/season/:id" element={<AdminRoute><SeasonAnalytics /></AdminRoute>} />
                      <Route path="/admin/startup-projects" element={<AdminRoute><StartupProjectsAdmin /></AdminRoute>} />
                      <Route path="/admin/teacher" element={<AdminRoute><TeacherDashboard /></AdminRoute>} />
                      <Route path="/admin/peer-reviews" element={<AdminRoute><PeerReviewAdmin /></AdminRoute>} />
                      <Route path="/admin/system-status" element={<AdminRoute><SystemStatus /></AdminRoute>} />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                  <CycleFAB />
                  <AppFooter />
                </div>
                </ProfileGate>
              </BrowserRouter>
            </SimulatorProvider>
          </ProgressProvider>
        </AuthProvider>
      </LangProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
