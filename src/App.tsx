
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Onboarding from '@/pages/Onboarding';
import ProfileManagement from '@/pages/ProfileManagement';
import Appointments from '@/pages/Appointments';
import Documents from '@/pages/Documents';
import HealthTwin from '@/pages/HealthTwin';
import Wellness from '@/pages/Wellness';
import EmotionalHealth from '@/pages/EmotionalHealth';
import EmotionalRetentionAI from '@/pages/EmotionalRetentionAI';
import ContentEngagementAI from '@/pages/ContentEngagementAI';
import SafetyComplianceAI from '@/pages/SafetyComplianceAI';
import Engagement from '@/pages/Engagement';
import IntelligentContent from '@/pages/IntelligentContent';
import Emergency from '@/pages/Emergency';
import Community from '@/pages/Community';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';
import PatientJourney from '@/pages/PatientJourney';
import Ward from '@/pages/Ward';
import Pharmacy from '@/pages/Pharmacy';
import Billing from '@/pages/Billing';
import Insurance from '@/pages/Insurance';
import BioWasteManagement from '@/pages/BioWasteManagement';
import PredictiveClinicalAI from '@/pages/PredictiveClinicalAI';
import MentalHealthAI from '@/pages/MentalHealthAI';
import ClinicalDecisionSupport from '@/pages/ClinicalDecisionSupport';
import TreatmentProtocolAI from '@/pages/TreatmentProtocolAI';
import ClinicalOptimization from '@/pages/ClinicalOptimization';
import HRManagement from '@/pages/HRManagement';
import HRAnalytics from '@/pages/HRAnalytics';
import VisitorControl from '@/pages/VisitorControl';
import AdvancedAccessControl from '@/pages/AdvancedAccessControl';
import WorkflowAutomationAI from '@/pages/WorkflowAutomationAI';
import AdvancedWorkflowAI from '@/pages/AdvancedWorkflowAI';
import ProcessOptimizationAI from '@/pages/ProcessOptimizationAI';
import HospitalAnalytics from '@/pages/HospitalAnalytics';
import ClinicalAnalytics from '@/pages/ClinicalAnalytics';
import ResearchDataManagement from '@/pages/ResearchDataManagement';
import AdvancedResearchTools from '@/pages/AdvancedResearchTools';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <AuthProvider>
            <div className="App">
              <Routes>
                <Route path="/" element={<Layout><Outlet /></Layout>}>
                  <Route index element={<Index />} />
                  <Route path="auth" element={<Auth />} />
                  <Route path="onboarding" element={<Onboarding />} />
                  <Route path="profile" element={<ProfileManagement />} />
                  <Route path="appointments" element={<Appointments />} />
                  <Route path="patient-journey" element={<PatientJourney />} />
                  <Route path="ward" element={<Ward />} />
                  <Route path="pharmacy" element={<Pharmacy />} />
                  <Route path="billing" element={<Billing />} />
                  <Route path="insurance" element={<Insurance />} />
                  <Route path="bio-waste" element={<BioWasteManagement />} />
                  <Route path="predictive-ai" element={<PredictiveClinicalAI />} />
                  <Route path="mental-health-ai" element={<MentalHealthAI />} />
                  <Route path="clinical-decision-support" element={<ClinicalDecisionSupport />} />
                  <Route path="treatment-protocol-ai" element={<TreatmentProtocolAI />} />
                  <Route path="clinical-optimization" element={<ClinicalOptimization />} />
                  <Route path="workflow-automation-ai" element={<WorkflowAutomationAI />} />
                  <Route path="advanced-workflow-ai" element={<AdvancedWorkflowAI />} />
                  <Route path="process-optimization-ai" element={<ProcessOptimizationAI />} />
                  <Route path="emotional-retention-ai" element={<EmotionalRetentionAI />} />
                  <Route path="content-engagement-ai" element={<ContentEngagementAI />} />
                  <Route path="safety-compliance-ai" element={<SafetyComplianceAI />} />
                  <Route path="hospital-analytics" element={<HospitalAnalytics />} />
                  <Route path="clinical-analytics" element={<ClinicalAnalytics />} />
                  <Route path="research-data-management" element={<ResearchDataManagement />} />
                  <Route path="advanced-research-tools" element={<AdvancedResearchTools />} />
                  <Route path="hr-management" element={
                    <ProtectedRoute>
                      <HRManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="hr-analytics" element={
                    <ProtectedRoute>
                      <HRAnalytics />
                    </ProtectedRoute>
                  } />
                  <Route path="visitor-control" element={
                    <ProtectedRoute>
                      <VisitorControl />
                    </ProtectedRoute>
                  } />
                  <Route path="advanced-access-control" element={
                    <ProtectedRoute>
                      <AdvancedAccessControl />
                    </ProtectedRoute>
                  } />
                  <Route path="documents" element={<Documents />} />
                  <Route path="health-twin" element={<HealthTwin />} />
                  <Route path="wellness" element={<Wellness />} />
                  <Route path="emotional-health" element={<EmotionalHealth />} />
                  <Route path="engagement" element={<Engagement />} />
                  <Route path="content" element={<IntelligentContent />} />
                  <Route path="emergency" element={<Emergency />} />
                  <Route path="community" element={<Community />} />
                  <Route path="unauthorized" element={<Unauthorized />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
              <Toaster />
            </div>
          </AuthProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
