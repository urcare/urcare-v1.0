
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/ui/theme-provider';

// Authentication pages
import Auth from '@/pages/Auth';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Unauthorized from '@/pages/Unauthorized';

// Main application pages
import Index from '@/pages/Index';
import Profile from '@/pages/Profile';
import ProfileManagement from '@/pages/ProfileManagement';
import Settings from '@/pages/Settings';
import Appointments from '@/pages/Appointments';
import AppointmentsEnhanced from '@/pages/AppointmentsEnhanced';
import Documents from '@/pages/Documents';
import DocumentScanner from '@/pages/DocumentScanner';
import DocumentIntelligence from '@/pages/DocumentIntelligence';
import MedicalRecords from '@/pages/MedicalRecords';
import MedicationManagement from '@/pages/MedicationManagement';
import Emergency from '@/pages/Emergency';
import EmergencyCenter from '@/pages/EmergencyCenter';
import Wellness from '@/pages/Wellness';
import WellnessTracking from '@/pages/WellnessTracking';
import Community from '@/pages/Community';
import Engagement from '@/pages/Engagement';
import FamilyHub from '@/pages/FamilyHub';
import HealthAssistant from '@/pages/HealthAssistant';
import AIInsights from '@/pages/AIInsights';
import SmartReminders from '@/pages/SmartReminders';
import HealthTwin from '@/pages/HealthTwin';
import EmotionalHealth from '@/pages/EmotionalHealth';
import IntelligentContent from '@/pages/IntelligentContent';
import Notifications from '@/pages/Notifications';
import Onboarding from '@/pages/Onboarding';

// Healthcare provider pages
import HospitalAnalytics from '@/pages/HospitalAnalytics';
import Billing from '@/pages/Billing';
import Pharmacy from '@/pages/Pharmacy';
import LIMS from '@/pages/LIMS';
import RIS from '@/pages/RIS';
import Pathology from '@/pages/Pathology';
import Ward from '@/pages/Ward';
import TPA from '@/pages/TPA';
import Insurance from '@/pages/Insurance';
import VisitorControl from '@/pages/VisitorControl';
import HRManagement from '@/pages/HRManagement';
import HRAnalytics from '@/pages/HRAnalytics';
import BioWasteManagement from '@/pages/BioWasteManagement';

// Advanced healthcare pages
import Telemedicine from '@/pages/Telemedicine';
import EmergencyMedicine from '@/pages/EmergencyMedicine';
import PatientJourney from '@/pages/PatientJourney';
import ClinicalDecisionSupport from '@/pages/ClinicalDecisionSupport';
import ClinicalAnalytics from '@/pages/ClinicalAnalytics';
import ClinicalOptimization from '@/pages/ClinicalOptimization';
import PredictiveClinicalAI from '@/pages/PredictiveClinicalAI';
import MentalHealthAI from '@/pages/MentalHealthAI';
import TreatmentProtocolAI from '@/pages/TreatmentProtocolAI';
import PublicHealthIntegration from '@/pages/PublicHealthIntegration';

// Specialized care pages
import MentalHealth from '@/pages/MentalHealth';
import GeriatricCare from '@/pages/GeriatricCare';
import PediatricCare from '@/pages/PediatricCare';
import OncologyCare from '@/pages/OncologyCare';
import SurgicalServices from '@/pages/SurgicalServices';
import RehabilitationServices from '@/pages/RehabilitationServices';

// Advanced technology pages
import AdvancedMedical from '@/pages/AdvancedMedical';
import NaturalLanguageProcessing from '@/pages/NaturalLanguageProcessing';
import AdvancedAIDiagnostics from '@/pages/AdvancedAIDiagnostics';
import DeviceIntegration from '@/pages/DeviceIntegration';
import MobileOptimization from '@/pages/MobileOptimization';
import AdvancedMobileFeatures from '@/pages/AdvancedMobileFeatures';
import CrossPlatformCompatibility from '@/pages/CrossPlatformCompatibility';
import PerformanceMonitoring from '@/pages/PerformanceMonitoring';
import PerformanceOptimization from '@/pages/PerformanceOptimization';
import ScalabilityManagement from '@/pages/ScalabilityManagement';
import AdvancedSecurityFeatures from '@/pages/AdvancedSecurityFeatures';
import AdvancedAccessControl from '@/pages/AdvancedAccessControl';
import DataGovernance from '@/pages/DataGovernance';
import ComplianceManagement from '@/pages/ComplianceManagement';
import RiskManagement from '@/pages/RiskManagement';
import QualityAssurance from '@/pages/QualityAssurance';
import SystemIntegration from '@/pages/SystemIntegration';
import SystemMaintenance from '@/pages/SystemMaintenance';
import AdvancedResearchTools from '@/pages/AdvancedResearchTools';
import ResearchDataManagement from '@/pages/ResearchDataManagement';

// AI and automation pages
import AdvancedAutomation from '@/pages/AdvancedAutomation';
import WorkflowAutomationAI from '@/pages/WorkflowAutomationAI';
import AdvancedWorkflowAI from '@/pages/AdvancedWorkflowAI';
import ProcessOptimizationAI from '@/pages/ProcessOptimizationAI';
import PredictiveMaintenanceAI from '@/pages/PredictiveMaintenanceAI';
import SafetyComplianceAI from '@/pages/SafetyComplianceAI';
import ContentEngagementAI from '@/pages/ContentEngagementAI';
import EmotionalRetentionAI from '@/pages/EmotionalRetentionAI';
import AdvancedUI from '@/pages/AdvancedUI';
import CommunicationSystems from '@/pages/CommunicationSystems';

// Landing pages
import Landing from '@/pages/Landing';
import MobileLanding from '@/pages/MobileLanding';
import PatientLanding from '@/pages/PatientLanding';
import PatientDashboard from '@/pages/PatientDashboard';
import NotFound from '@/pages/NotFound';

// Protected route wrapper
import { ProtectedRoute } from '@/components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public routes */}
                <Route path="/landing" element={<Landing />} />
                <Route path="/mobile-landing" element={<MobileLanding />} />
                <Route path="/patient-landing" element={<PatientLanding />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Protected routes */}
                <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/patient-dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
                
                {/* Profile and Settings */}
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/profile-management" element={<ProtectedRoute><ProfileManagement /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                
                {/* Core Healthcare Features */}
                <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
                <Route path="/appointments-enhanced" element={<ProtectedRoute><AppointmentsEnhanced /></ProtectedRoute>} />
                <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
                <Route path="/document-scanner" element={<ProtectedRoute><DocumentScanner /></ProtectedRoute>} />
                <Route path="/document-intelligence" element={<ProtectedRoute><DocumentIntelligence /></ProtectedRoute>} />
                <Route path="/medical-records" element={<ProtectedRoute><MedicalRecords /></ProtectedRoute>} />
                <Route path="/medication-management" element={<ProtectedRoute><MedicationManagement /></ProtectedRoute>} />
                <Route path="/emergency" element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
                <Route path="/emergency-center" element={<ProtectedRoute><EmergencyCenter /></ProtectedRoute>} />
                
                {/* Wellness and Engagement */}
                <Route path="/wellness" element={<ProtectedRoute><Wellness /></ProtectedRoute>} />
                <Route path="/wellness-tracking" element={<ProtectedRoute><WellnessTracking /></ProtectedRoute>} />
                <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
                <Route path="/engagement" element={<ProtectedRoute><Engagement /></ProtectedRoute>} />
                <Route path="/family-hub" element={<ProtectedRoute><FamilyHub /></ProtectedRoute>} />
                
                {/* AI and Intelligence */}
                <Route path="/health-assistant" element={<ProtectedRoute><HealthAssistant /></ProtectedRoute>} />
                <Route path="/ai-insights" element={<ProtectedRoute><AIInsights /></ProtectedRoute>} />
                <Route path="/smart-reminders" element={<ProtectedRoute><SmartReminders /></ProtectedRoute>} />
                <Route path="/health-twin" element={<ProtectedRoute><HealthTwin /></ProtectedRoute>} />
                <Route path="/emotional-health" element={<ProtectedRoute><EmotionalHealth /></ProtectedRoute>} />
                <Route path="/intelligent-content" element={<ProtectedRoute><IntelligentContent /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                
                {/* Healthcare Provider Features */}
                <Route path="/hospital-analytics" element={<ProtectedRoute><HospitalAnalytics /></ProtectedRoute>} />
                <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
                <Route path="/pharmacy" element={<ProtectedRoute><Pharmacy /></ProtectedRoute>} />
                <Route path="/lims" element={<ProtectedRoute><LIMS /></ProtectedRoute>} />
                <Route path="/ris" element={<ProtectedRoute><RIS /></ProtectedRoute>} />
                <Route path="/pathology" element={<ProtectedRoute><Pathology /></ProtectedRoute>} />
                <Route path="/ward" element={<ProtectedRoute><Ward /></ProtectedRoute>} />
                <Route path="/tpa" element={<ProtectedRoute><TPA /></ProtectedRoute>} />
                <Route path="/insurance" element={<ProtectedRoute><Insurance /></ProtectedRoute>} />
                <Route path="/visitor-control" element={<ProtectedRoute><VisitorControl /></ProtectedRoute>} />
                <Route path="/hr-management" element={<ProtectedRoute><HRManagement /></ProtectedRoute>} />
                <Route path="/hr-analytics" element={<ProtectedRoute><HRAnalytics /></ProtectedRoute>} />
                <Route path="/bio-waste-management" element={<ProtectedRoute><BioWasteManagement /></ProtectedRoute>} />
                
                {/* Advanced Healthcare */}
                <Route path="/telemedicine" element={<ProtectedRoute><Telemedicine /></ProtectedRoute>} />
                <Route path="/emergency-medicine" element={<ProtectedRoute><EmergencyMedicine /></ProtectedRoute>} />
                <Route path="/patient-journey" element={<ProtectedRoute><PatientJourney /></ProtectedRoute>} />
                <Route path="/clinical-decision-support" element={<ProtectedRoute><ClinicalDecisionSupport /></ProtectedRoute>} />
                <Route path="/clinical-analytics" element={<ProtectedRoute><ClinicalAnalytics /></ProtectedRoute>} />
                <Route path="/clinical-optimization" element={<ProtectedRoute><ClinicalOptimization /></ProtectedRoute>} />
                <Route path="/predictive-clinical-ai" element={<ProtectedRoute><PredictiveClinicalAI /></ProtectedRoute>} />
                <Route path="/mental-health-ai" element={<ProtectedRoute><MentalHealthAI /></ProtectedRoute>} />
                <Route path="/treatment-protocol-ai" element={<ProtectedRoute><TreatmentProtocolAI /></ProtectedRoute>} />
                <Route path="/public-health-integration" element={<ProtectedRoute><PublicHealthIntegration /></ProtectedRoute>} />
                
                {/* Specialized Care Modules */}
                <Route path="/mental-health" element={<ProtectedRoute><MentalHealth /></ProtectedRoute>} />
                <Route path="/geriatric-care" element={<ProtectedRoute><GeriatricCare /></ProtectedRoute>} />
                <Route path="/pediatric-care" element={<ProtectedRoute><PediatricCare /></ProtectedRoute>} />
                <Route path="/oncology-care" element={<ProtectedRoute><OncologyCare /></ProtectedRoute>} />
                <Route path="/surgical-services" element={<ProtectedRoute><SurgicalServices /></ProtectedRoute>} />
                <Route path="/rehabilitation-services" element={<ProtectedRoute><RehabilitationServices /></ProtectedRoute>} />
                
                {/* Advanced Technology */}
                <Route path="/advanced-medical" element={<ProtectedRoute><AdvancedMedical /></ProtectedRoute>} />
                <Route path="/natural-language-processing" element={<ProtectedRoute><NaturalLanguageProcessing /></ProtectedRoute>} />
                <Route path="/advanced-ai-diagnostics" element={<ProtectedRoute><AdvancedAIDiagnostics /></ProtectedRoute>} />
                <Route path="/device-integration" element={<ProtectedRoute><DeviceIntegration /></ProtectedRoute>} />
                <Route path="/mobile-optimization" element={<ProtectedRoute><MobileOptimization /></ProtectedRoute>} />
                <Route path="/advanced-mobile-features" element={<ProtectedRoute><AdvancedMobileFeatures /></ProtectedRoute>} />
                <Route path="/cross-platform-compatibility" element={<ProtectedRoute><CrossPlatformCompatibility /></ProtectedRoute>} />
                <Route path="/performance-monitoring" element={<ProtectedRoute><PerformanceMonitoring /></ProtectedRoute>} />
                <Route path="/performance-optimization" element={<ProtectedRoute><PerformanceOptimization /></ProtectedRoute>} />
                <Route path="/scalability-management" element={<ProtectedRoute><ScalabilityManagement /></ProtectedRoute>} />
                <Route path="/advanced-security-features" element={<ProtectedRoute><AdvancedSecurityFeatures /></ProtectedRoute>} />
                <Route path="/advanced-access-control" element={<ProtectedRoute><AdvancedAccessControl /></ProtectedRoute>} />
                <Route path="/data-governance" element={<ProtectedRoute><DataGovernance /></ProtectedRoute>} />
                <Route path="/compliance-management" element={<ProtectedRoute><ComplianceManagement /></ProtectedRoute>} />
                <Route path="/risk-management" element={<ProtectedRoute><RiskManagement /></ProtectedRoute>} />
                <Route path="/quality-assurance" element={<ProtectedRoute><QualityAssurance /></ProtectedRoute>} />
                <Route path="/system-integration" element={<ProtectedRoute><SystemIntegration /></ProtectedRoute>} />
                <Route path="/system-maintenance" element={<ProtectedRoute><SystemMaintenance /></ProtectedRoute>} />
                <Route path="/advanced-research-tools" element={<ProtectedRoute><AdvancedResearchTools /></ProtectedRoute>} />
                <Route path="/research-data-management" element={<ProtectedRoute><ResearchDataManagement /></ProtectedRoute>} />
                
                {/* AI and Automation */}
                <Route path="/advanced-automation" element={<ProtectedRoute><AdvancedAutomation /></ProtectedRoute>} />
                <Route path="/workflow-automation-ai" element={<ProtectedRoute><WorkflowAutomationAI /></ProtectedRoute>} />
                <Route path="/advanced-workflow-ai" element={<ProtectedRoute><AdvancedWorkflowAI /></ProtectedRoute>} />
                <Route path="/process-optimization-ai" element={<ProtectedRoute><ProcessOptimizationAI /></ProtectedRoute>} />
                <Route path="/predictive-maintenance-ai" element={<ProtectedRoute><PredictiveMaintenanceAI /></ProtectedRoute>} />
                <Route path="/safety-compliance-ai" element={<ProtectedRoute><SafetyComplianceAI /></ProtectedRoute>} />
                <Route path="/content-engagement-ai" element={<ProtectedRoute><ContentEngagementAI /></ProtectedRoute>} />
                <Route path="/emotional-retention-ai" element={<ProtectedRoute><EmotionalRetentionAI /></ProtectedRoute>} />
                <Route path="/advanced-ui" element={<ProtectedRoute><AdvancedUI /></ProtectedRoute>} />
                <Route path="/communication-systems" element={<ProtectedRoute><CommunicationSystems /></ProtectedRoute>} />
                
                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
