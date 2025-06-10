
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PerformanceMonitoring from './pages/PerformanceMonitoring';
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

// Create QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Toaster />
        <Router>
          <Routes>
            <Route path="/" element={<PerformanceMonitoring />} />
            <Route path="/performance-monitoring" element={<PerformanceMonitoring />} />
            <Route path="/hr-analytics" element={<HRAnalytics />} />
            <Route path="/data-governance" element={<DataGovernance />} />
            <Route path="/natural-language-processing" element={<NaturalLanguageProcessing />} />
            <Route path="/pediatric-care" element={<PediatricCare />} />
            <Route path="/geriatric-care" element={<GeriatricCare />} />
            <Route path="/oncology-care" element={<OncologyCare />} />
            <Route path="/emergency-medicine" element={<EmergencyMedicine />} />
            <Route path="/surgical-services" element={<SurgicalServices />} />
            <Route path="/rehabilitation-services" element={<RehabilitationServices />} />
            <Route path="/performance-optimization" element={<PerformanceOptimization />} />
            <Route path="/ris" element={<RIS />} />
            <Route path="/tpa" element={<TPA />} />
            <Route path="/lims" element={<LIMS />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/insurance" element={<Insurance />} />
            <Route path="/visitor-control" element={<VisitorControl />} />
            <Route path="/mental-health-ai" element={<MentalHealthAI />} />
            <Route path="/public-health-integration" element={<PublicHealthIntegration />} />
            <Route path="/safety-compliance-ai" element={<SafetyComplianceAI />} />
            <Route path="/treatment-protocol-ai" element={<TreatmentProtocolAI />} />
            <Route path="/predictive-clinical-ai" element={<PredictiveClinicalAI />} />
            <Route path="/workflow-automation-ai" element={<WorkflowAutomationAI />} />
            <Route path="/process-optimization-ai" element={<ProcessOptimizationAI />} />
            <Route path="/research-data-management" element={<ResearchDataManagement />} />
            <Route path="/wellness" element={<Wellness />} />
            <Route path="/pathology" element={<Pathology />} />
            <Route path="/telemedicine" element={<Telemedicine />} />
            <Route path="/mental-health" element={<MentalHealth />} />
            <Route path="/risk-management" element={<RiskManagement />} />
            <Route path="/mobile-optimization" element={<MobileOptimization />} />
            <Route path="/intelligent-content" element={<IntelligentContent />} />
            <Route path="/system-integration" element={<SystemIntegration />} />
            <Route path="/predictive-maintenance-ai" element={<PredictiveMaintenanceAI />} />
            <Route path="/profile-management" element={<ProfileManagement />} />
            <Route path="/ward" element={<Ward />} />
            <Route path="/patient-journey" element={<PatientJourney />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
