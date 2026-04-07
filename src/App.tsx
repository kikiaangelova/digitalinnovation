import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { XpCelebrationToaster } from "@/components/ui/xp-celebration-toast";
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
import LearningModules from "./pages/LearningModules";
import LearningModulePlayer from "./pages/LearningModulePlayer";
import FinalExam from "./pages/FinalExam";
import Certificate from "./pages/Certificate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <XpCelebrationToaster />
      <LangProvider>
        <AuthProvider>
          <ProgressProvider>
            <SimulatorProvider>
              <BrowserRouter>
                <ProfileGate>
                <div className="flex min-h-screen flex-col">
                  <div className="flex-1 pb-20 md:pb-0">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/reset-password" element={<ResetPasswordPage />} />
                      <Route path="/dashboard" element={<StudentDashboard />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/cases" element={<CaseLibrary />} />
                      <Route path="/dictionary" element={<Dictionary />} />
                      <Route path="/about" element={<AboutDigitalInnovation />} />
                      <Route path="/innovation-basics" element={<AboutDigitalInnovation />} />
                      <Route path="/case/:id/preview" element={<CasePreview />} />
                      <Route path="/case/:id" element={<CasePlayer />} />
                      <Route path="/case/:id/results" element={<CaseResults />} />
                      <Route path="/simulator/preview" element={<SimulatorPreview />} />
                      <Route path="/team/:teamId" element={<TeamWorkspace />} />
                      <Route path="/assessment/:id" element={<AssessmentPlayer />} />
                      <Route path="/assessment/:id/results" element={<AssessmentResults />} />
                      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                      <Route path="/admin/analytics" element={<AdminRoute><AnalyticsDashboard /></AdminRoute>} />
                      <Route path="/admin/cohorts" element={<AdminRoute><CohortManager /></AdminRoute>} />
                      <Route path="/my-startup" element={<MyStartupIdea />} />
                      <Route path="/industries" element={<IndustryInnovationMap />} />
                      <Route path="/startup-simulator" element={<StartupSimulator />} />
                      <Route path="/simulator" element={<StartupSimulator />} />
                      <Route path="/simulator/season/:id" element={<SeasonView />} />
                      <Route path="/simulator/season/:id/round/:n" element={<RoundView />} />
                      <Route path="/admin/simulator" element={<AdminRoute><SimulatorAdmin /></AdminRoute>} />
                      <Route path="/admin/simulator/season/:id" element={<AdminRoute><SeasonAnalytics /></AdminRoute>} />
                      <Route path="/admin/startup-projects" element={<AdminRoute><StartupProjectsAdmin /></AdminRoute>} />
                      <Route path="/admin/teacher" element={<AdminRoute><TeacherDashboard /></AdminRoute>} />
                      <Route path="/admin/peer-reviews" element={<AdminRoute><PeerReviewAdmin /></AdminRoute>} />
                      <Route path="/peer-review" element={<PeerReview />} />
                      <Route path="/my-report" element={<LearningReport />} />
                      <Route path="/admin/system-status" element={<AdminRoute><SystemStatus /></AdminRoute>} />
                      <Route path="/journey" element={<LearningJourney />} />
                      <Route path="/learn" element={<LearningModules />} />
                      <Route path="/learn/:slug" element={<LearningModulePlayer />} />
                      <Route path="/leaderboard" element={<LeaderboardPage />} />
                      <Route path="/final-exam" element={<FinalExam />} />
                      <Route path="/certificate" element={<Certificate />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="/terms" element={<TermsOfUse />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                  <div className="hidden md:block">
                    <AppFooter />
                  </div>
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
