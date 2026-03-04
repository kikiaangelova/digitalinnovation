import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { LangProvider } from "@/context/LangContext";
import { SimulatorProvider } from "@/context/SimulatorContext";
import ProfileGate from "@/components/layout/ProfileGate";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LangProvider>
        <AuthProvider>
          <SimulatorProvider>
            <BrowserRouter>
              <ProfileGate>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/dashboard" element={<StudentDashboard />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/cases" element={<CaseLibrary />} />
                  <Route path="/dictionary" element={<Dictionary />} />
                  <Route path="/about" element={<AboutDigitalInnovation />} />
                  <Route path="/case/:id/preview" element={<CasePreview />} />
                  <Route path="/case/:id" element={<CasePlayer />} />
                  <Route path="/case/:id/results" element={<CaseResults />} />
                  <Route path="/simulator/preview" element={<SimulatorPreview />} />
                  <Route path="/team/:teamId" element={<TeamWorkspace />} />
                  <Route path="/assessment/:id" element={<AssessmentPlayer />} />
                  <Route path="/assessment/:id/results" element={<AssessmentResults />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
                  <Route path="/admin/cohorts" element={<CohortManager />} />
                  <Route path="/my-startup" element={<MyStartupIdea />} />
                  <Route path="/industries" element={<IndustryInnovationMap />} />
                  <Route path="/startup-simulator" element={<StartupSimulator />} />
                  <Route path="/simulator" element={<StudentLanding />} />
                  <Route path="/simulator/season/:id" element={<SeasonView />} />
                  <Route path="/simulator/season/:id/round/:n" element={<RoundView />} />
                  <Route path="/admin/simulator" element={<SimulatorAdmin />} />
                  <Route path="/admin/simulator/season/:id" element={<SeasonAnalytics />} />
                  <Route path="/admin/startup-projects" element={<StartupProjectsAdmin />} />
                  <Route path="/admin/teacher" element={<TeacherDashboard />} />
                  <Route path="/my-report" element={<LearningReport />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ProfileGate>
            </BrowserRouter>
          </SimulatorProvider>
        </AuthProvider>
      </LangProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
