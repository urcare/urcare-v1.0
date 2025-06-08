
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ProfileManagement from "./pages/ProfileManagement";
import NotFound from "./pages/NotFound";
import Appointments from "./pages/Appointments";
import Billing from "./pages/Billing";
import Documents from "./pages/Documents";
import Emergency from "./pages/Emergency";
import Community from "./pages/Community";
import Engagement from "./pages/Engagement";
import HealthTwin from "./pages/HealthTwin";
import Wellness from "./pages/Wellness";
import EmotionalHealth from "./pages/EmotionalHealth";
import Onboarding from "./pages/Onboarding";
import Ward from "./pages/Ward";
import Pharmacy from "./pages/Pharmacy";
import LIMS from "./pages/LIMS";
import RIS from "./pages/RIS";
import Pathology from "./pages/Pathology";
import PatientJourney from "./pages/PatientJourney";
import HRManagement from "./pages/HRManagement";
import HRAnalytics from "./pages/HRAnalytics";
import BioWasteManagement from "./pages/BioWasteManagement";
import TPA from "./pages/TPA";
import Insurance from "./pages/Insurance";
import VisitorControl from "./pages/VisitorControl";
import AdvancedAccessControl from "./pages/AdvancedAccessControl";
import HospitalAnalytics from "./pages/HospitalAnalytics";
import ClinicalAnalytics from "./pages/ClinicalAnalytics";
import PredictiveClinicalAI from "./pages/PredictiveClinicalAI";
import ClinicalDecisionSupport from "./pages/ClinicalDecisionSupport";
import ClinicalOptimization from "./pages/ClinicalOptimization";
import TreatmentProtocolAI from "./pages/TreatmentProtocolAI";
import WorkflowAutomationAI from "./pages/WorkflowAutomationAI";
import AdvancedWorkflowAI from "./pages/AdvancedWorkflowAI";
import ProcessOptimizationAI from "./pages/ProcessOptimizationAI";
import MentalHealthAI from "./pages/MentalHealthAI";
import EmotionalRetentionAI from "./pages/EmotionalRetentionAI";
import ContentEngagementAI from "./pages/ContentEngagementAI";
import IntelligentContent from "./pages/IntelligentContent";
import SafetyComplianceAI from "./pages/SafetyComplianceAI";
import ResearchDataManagement from "./pages/ResearchDataManagement";
import AdvancedResearchTools from "./pages/AdvancedResearchTools";
import PublicHealthIntegration from "./pages/PublicHealthIntegration";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SidebarProvider>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfileManagement /></ProtectedRoute>} />
              <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
              <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
              <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
              <Route path="/emergency" element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
              <Route path="/engagement" element={<ProtectedRoute><Engagement /></ProtectedRoute>} />
              <Route path="/health-twin" element={<ProtectedRoute><HealthTwin /></ProtectedRoute>} />
              <Route path="/wellness" element={<ProtectedRoute><Wellness /></ProtectedRoute>} />
              <Route path="/emotional-health" element={<ProtectedRoute><EmotionalHealth /></ProtectedRoute>} />
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/ward" element={<ProtectedRoute><Ward /></ProtectedRoute>} />
              <Route path="/pharmacy" element={<ProtectedRoute><Pharmacy /></ProtectedRoute>} />
              <Route path="/lims" element={<ProtectedRoute><LIMS /></ProtectedRoute>} />
              <Route path="/ris" element={<ProtectedRoute><RIS /></ProtectedRoute>} />
              <Route path="/pathology" element={<ProtectedRoute><Pathology /></ProtectedRoute>} />
              <Route path="/patient-journey" element={<ProtectedRoute><PatientJourney /></ProtectedRoute>} />
              <Route path="/hr-management" element={<ProtectedRoute><HRManagement /></ProtectedRoute>} />
              <Route path="/hr-analytics" element={<ProtectedRoute><HRAnalytics /></ProtectedRoute>} />
              <Route path="/bio-waste" element={<ProtectedRoute><BioWasteManagement /></ProtectedRoute>} />
              <Route path="/tpa" element={<ProtectedRoute><TPA /></ProtectedRoute>} />
              <Route path="/insurance" element={<ProtectedRoute><Insurance /></ProtectedRoute>} />
              <Route path="/visitor-control" element={<ProtectedRoute><VisitorControl /></ProtectedRoute>} />
              <Route path="/advanced-access-control" element={<ProtectedRoute><AdvancedAccessControl /></ProtectedRoute>} />
              <Route path="/hospital-analytics" element={<ProtectedRoute><HospitalAnalytics /></ProtectedRoute>} />
              <Route path="/clinical-analytics" element={<ProtectedRoute><ClinicalAnalytics /></ProtectedRoute>} />
              <Route path="/predictive-clinical-ai" element={<ProtectedRoute><PredictiveClinicalAI /></ProtectedRoute>} />
              <Route path="/clinical-decision-support" element={<ProtectedRoute><ClinicalDecisionSupport /></ProtectedRoute>} />
              <Route path="/clinical-optimization" element={<ProtectedRoute><ClinicalOptimization /></ProtectedRoute>} />
              <Route path="/treatment-protocol-ai" element={<ProtectedRoute><TreatmentProtocolAI /></ProtectedRoute>} />
              <Route path="/workflow-automation-ai" element={<ProtectedRoute><WorkflowAutomationAI /></ProtectedRoute>} />
              <Route path="/advanced-workflow-ai" element={<ProtectedRoute><AdvancedWorkflowAI /></ProtectedRoute>} />
              <Route path="/process-optimization-ai" element={<ProtectedRoute><ProcessOptimizationAI /></ProtectedRoute>} />
              <Route path="/mental-health-ai" element={<ProtectedRoute><MentalHealthAI /></ProtectedRoute>} />
              <Route path="/emotional-retention-ai" element={<ProtectedRoute><EmotionalRetentionAI /></ProtectedRoute>} />
              <Route path="/content-engagement-ai" element={<ProtectedRoute><ContentEngagementAI /></ProtectedRoute>} />
              <Route path="/intelligent-content" element={<ProtectedRoute><IntelligentContent /></ProtectedRoute>} />
              <Route path="/safety-compliance-ai" element={<ProtectedRoute><SafetyComplianceAI /></ProtectedRoute>} />
              <Route path="/research-data-management" element={<ProtectedRoute><ResearchDataManagement /></ProtectedRoute>} />
              <Route path="/advanced-research-tools" element={<ProtectedRoute><AdvancedResearchTools /></ProtectedRoute>} />
              <Route path="/public-health-integration" element={<ProtectedRoute><PublicHealthIntegration /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </SidebarProvider>
  </QueryClientProvider>
);

export default App;
