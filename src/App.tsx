
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PerformanceMonitoring from './pages/PerformanceMonitoring';
import ScalabilityManagement from './pages/ScalabilityManagement';
import HRAnalytics from './pages/HRAnalytics';
import DataGovernance from './pages/DataGovernance';
import NaturalLanguageProcessing from './pages/NaturalLanguageProcessing';
import PediatricCare from './pages/PediatricCare';
import GeriatricCare from './pages/GeriatricCare';
import OncologyCare from './pages/OncologyCare';
import EmergencyMedicine from './pages/EmergencyMedicine';
import SurgicalServices from './pages/SurgicalServices';
import RehabilitationServices from './pages/RehabilitationServices';
import PerformanceOptimization from './pages/PerformanceOptimization';
import RIS from './pages/RIS';
import TPA from './pages/TPA';
import LIMS from './pages/LIMS';
import Pharmacy from './pages/Pharmacy';
import Insurance from './pages/Insurance';
import VisitorControl from './pages/VisitorControl';
import MentalHealthAI from './pages/MentalHealthAI';
import PublicHealthIntegration from './pages/PublicHealthIntegration';
import SafetyComplianceAI from './pages/SafetyComplianceAI';
import TreatmentProtocolAI from './pages/TreatmentProtocolAI';
import PredictiveClinicalAI from './pages/PredictiveClinicalAI';
import WorkflowAutomationAI from './pages/WorkflowAutomationAI';
import ProcessOptimizationAI from './pages/ProcessOptimizationAI';
import ResearchDataManagement from './pages/ResearchDataManagement';
import Wellness from './pages/Wellness';
import Pathology from './pages/Pathology';
import Telemedicine from './pages/Telemedicine';
import MentalHealth from './pages/MentalHealth';
import RiskManagement from './pages/RiskManagement';
import MobileOptimization from './pages/MobileOptimization';
import IntelligentContent from './pages/IntelligentContent';
import SystemIntegration from './pages/SystemIntegration';
import PredictiveMaintenanceAI from './pages/PredictiveMaintenanceAI';
import ProfileManagement from './pages/ProfileManagement';
import Ward from './pages/Ward';
import PatientJourney from './pages/PatientJourney';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import Onboarding from './pages/Onboarding';
import SystemMaintenance from './pages/SystemMaintenance';
import QualityAssurance from './pages/QualityAssurance';

// Create QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Toaster />
        <Router>
          <AuthProvider>
            <Routes>
              {/* Landing and Auth Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<PerformanceMonitoring />} />
              <Route path="/dashboard/*" element={<PerformanceMonitoring />} />
              
              {/* Performance & System Routes */}
              <Route path="/performance-monitoring" element={<PerformanceMonitoring />} />
              <Route path="/performance-monitoring/*" element={<PerformanceMonitoring />} />
              <Route path="/scalability-management" element={<ScalabilityManagement />} />
              <Route path="/scalability-management/*" element={<ScalabilityManagement />} />
              <Route path="/system-maintenance" element={<SystemMaintenance />} />
              <Route path="/system-maintenance/*" element={<SystemMaintenance />} />
              <Route path="/quality-assurance" element={<QualityAssurance />} />
              <Route path="/quality-assurance/*" element={<QualityAssurance />} />
              <Route path="/performance-optimization" element={<PerformanceOptimization />} />
              <Route path="/performance-optimization/*" element={<PerformanceOptimization />} />
              
              {/* Clinical Care Routes */}
              <Route path="/pediatric-care" element={<PediatricCare />} />
              <Route path="/pediatric-care/*" element={<PediatricCare />} />
              <Route path="/geriatric-care" element={<GeriatricCare />} />
              <Route path="/geriatric-care/*" element={<GeriatricCare />} />
              <Route path="/oncology-care" element={<OncologyCare />} />
              <Route path="/oncology-care/*" element={<OncologyCare />} />
              <Route path="/emergency-medicine" element={<EmergencyMedicine />} />
              <Route path="/emergency-medicine/*" element={<EmergencyMedicine />} />
              <Route path="/surgical-services" element={<SurgicalServices />} />
              <Route path="/surgical-services/*" element={<SurgicalServices />} />
              <Route path="/rehabilitation-services" element={<RehabilitationServices />} />
              <Route path="/rehabilitation-services/*" element={<RehabilitationServices />} />
              
              {/* Medical Services Routes */}
              <Route path="/ris" element={<RIS />} />
              <Route path="/ris/*" element={<RIS />} />
              <Route path="/tpa" element={<TPA />} />
              <Route path="/tpa/*" element={<TPA />} />
              <Route path="/lims" element={<LIMS />} />
              <Route path="/lims/*" element={<LIMS />} />
              <Route path="/pharmacy" element={<Pharmacy />} />
              <Route path="/pharmacy/*" element={<Pharmacy />} />
              <Route path="/pathology" element={<Pathology />} />
              <Route path="/pathology/*" element={<Pathology />} />
              <Route path="/telemedicine" element={<Telemedicine />} />
              <Route path="/telemedicine/*" element={<Telemedicine />} />
              
              {/* AI & Analytics Routes */}
              <Route path="/hr-analytics" element={<HRAnalytics />} />
              <Route path="/hr-analytics/*" element={<HRAnalytics />} />
              <Route path="/data-governance" element={<DataGovernance />} />
              <Route path="/data-governance/*" element={<DataGovernance />} />
              <Route path="/natural-language-processing" element={<NaturalLanguageProcessing />} />
              <Route path="/natural-language-processing/*" element={<NaturalLanguageProcessing />} />
              <Route path="/mental-health-ai" element={<MentalHealthAI />} />
              <Route path="/mental-health-ai/*" element={<MentalHealthAI />} />
              <Route path="/public-health-integration" element={<PublicHealthIntegration />} />
              <Route path="/public-health-integration/*" element={<PublicHealthIntegration />} />
              <Route path="/safety-compliance-ai" element={<SafetyComplianceAI />} />
              <Route path="/safety-compliance-ai/*" element={<SafetyComplianceAI />} />
              <Route path="/treatment-protocol-ai" element={<TreatmentProtocolAI />} />
              <Route path="/treatment-protocol-ai/*" element={<TreatmentProtocolAI />} />
              <Route path="/predictive-clinical-ai" element={<PredictiveClinicalAI />} />
              <Route path="/predictive-clinical-ai/*" element={<PredictiveClinicalAI />} />
              <Route path="/workflow-automation-ai" element={<WorkflowAutomationAI />} />
              <Route path="/workflow-automation-ai/*" element={<WorkflowAutomationAI />} />
              <Route path="/process-optimization-ai" element={<ProcessOptimizationAI />} />
              <Route path="/process-optimization-ai/*" element={<ProcessOptimizationAI />} />
              <Route path="/predictive-maintenance-ai" element={<PredictiveMaintenanceAI />} />
              <Route path="/predictive-maintenance-ai/*" element={<PredictiveMaintenanceAI />} />
              
              {/* Patient & Wellness Routes */}
              <Route path="/wellness" element={<Wellness />} />
              <Route path="/wellness/*" element={<Wellness />} />
              <Route path="/mental-health" element={<MentalHealth />} />
              <Route path="/mental-health/*" element={<MentalHealth />} />
              <Route path="/patient-journey" element={<PatientJourney />} />
              <Route path="/patient-journey/*" element={<PatientJourney />} />
              <Route path="/profile-management" element={<ProfileManagement />} />
              <Route path="/profile-management/*" element={<ProfileManagement />} />
              <Route path="/ward" element={<Ward />} />
              <Route path="/ward/*" element={<Ward />} />
              
              {/* Additional Services Routes */}
              <Route path="/insurance" element={<Insurance />} />
              <Route path="/insurance/*" element={<Insurance />} />
              <Route path="/visitor-control" element={<VisitorControl />} />
              <Route path="/visitor-control/*" element={<VisitorControl />} />
              <Route path="/research-data-management" element={<ResearchDataManagement />} />
              <Route path="/research-data-management/*" element={<ResearchDataManagement />} />
              <Route path="/risk-management" element={<RiskManagement />} />
              <Route path="/risk-management/*" element={<RiskManagement />} />
              <Route path="/mobile-optimization" element={<MobileOptimization />} />
              <Route path="/mobile-optimization/*" element={<MobileOptimization />} />
              <Route path="/intelligent-content" element={<IntelligentContent />} />
              <Route path="/intelligent-content/*" element={<IntelligentContent />} />
              <Route path="/system-integration" element={<SystemIntegration />} />
              <Route path="/system-integration/*" element={<SystemIntegration />} />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
