
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ui/theme-provider';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Layout } from './components/Layout';

// Lazy load components
const PatientLanding = React.lazy(() => import('./pages/PatientLanding'));
const PatientDashboard = React.lazy(() => import('./pages/PatientDashboard'));
const Auth = React.lazy(() => import('./pages/Auth'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Appointments = React.lazy(() => import('./pages/Appointments'));
const Documents = React.lazy(() => import('./pages/Documents'));
const Billing = React.lazy(() => import('./pages/Billing'));
const Pharmacy = React.lazy(() => import('./pages/Pharmacy'));
const HospitalAnalytics = React.lazy(() => import('./pages/HospitalAnalytics'));
const HRManagement = React.lazy(() => import('./pages/HRManagement'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Profile = React.lazy(() => import('./pages/Profile'));
const LIMS = React.lazy(() => import('./pages/LIMS'));
const TPA = React.lazy(() => import('./pages/TPA'));
const Ward = React.lazy(() => import('./pages/Ward'));
const Emergency = React.lazy(() => import('./pages/Emergency'));
const Wellness = React.lazy(() => import('./pages/Wellness'));
const Community = React.lazy(() => import('./pages/Community'));
const HealthTwin = React.lazy(() => import('./pages/HealthTwin'));
const MentalHealth = React.lazy(() => import('./pages/MentalHealth'));
const Engagement = React.lazy(() => import('./pages/Engagement'));
const IntelligentContent = React.lazy(() => import('./pages/IntelligentContent'));
const Insurance = React.lazy(() => import('./pages/Insurance'));
const Onboarding = React.lazy(() => import('./pages/Onboarding'));
const EmotionalHealth = React.lazy(() => import('./pages/EmotionalHealth'));
const ProfileManagement = React.lazy(() => import('./pages/ProfileManagement'));
const AdvancedSecurityFeatures = React.lazy(() => import('./pages/AdvancedSecurityFeatures'));
const AdvancedAccessControl = React.lazy(() => import('./pages/AdvancedAccessControl'));
const AdvancedAutomation = React.lazy(() => import('./pages/AdvancedAutomation'));
const AdvancedWorkflowAI = React.lazy(() => import('./pages/AdvancedWorkflowAI'));
const WorkflowAutomationAI = React.lazy(() => import('./pages/WorkflowAutomationAI'));
const AdvancedAIDiagnostics = React.lazy(() => import('./pages/AdvancedAIDiagnostics'));
const PredictiveClinicalAI = React.lazy(() => import('./pages/PredictiveClinicalAI'));
const PredictiveMaintenanceAI = React.lazy(() => import('./pages/PredictiveMaintenanceAI'));
const ProcessOptimizationAI = React.lazy(() => import('./pages/ProcessOptimizationAI'));
const SafetyComplianceAI = React.lazy(() => import('./pages/SafetyComplianceAI'));
const ContentEngagementAI = React.lazy(() => import('./pages/ContentEngagementAI'));
const EmotionalRetentionAI = React.lazy(() => import('./pages/EmotionalRetentionAI'));
const MentalHealthAI = React.lazy(() => import('./pages/MentalHealthAI'));
const TreatmentProtocolAI = React.lazy(() => import('./pages/TreatmentProtocolAI'));
const ClinicalAnalytics = React.lazy(() => import('./pages/ClinicalAnalytics'));
const ClinicalDecisionSupport = React.lazy(() => import('./pages/ClinicalDecisionSupport'));
const ClinicalOptimization = React.lazy(() => import('./pages/ClinicalOptimization'));
const HRAnalytics = React.lazy(() => import('./pages/HRAnalytics'));
const ComplianceManagement = React.lazy(() => import('./pages/ComplianceManagement'));
const DataGovernance = React.lazy(() => import('./pages/DataGovernance'));
const RiskManagement = React.lazy(() => import('./pages/RiskManagement'));
const QualityAssurance = React.lazy(() => import('./pages/QualityAssurance'));
const PerformanceMonitoring = React.lazy(() => import('./pages/PerformanceMonitoring'));
const PerformanceOptimization = React.lazy(() => import('./pages/PerformanceOptimization'));
const ScalabilityManagement = React.lazy(() => import('./pages/ScalabilityManagement'));
const SystemIntegration = React.lazy(() => import('./pages/SystemIntegration'));
const SystemMaintenance = React.lazy(() => import('./pages/SystemMaintenance'));
const DeviceIntegration = React.lazy(() => import('./pages/DeviceIntegration'));
const CrossPlatformCompatibility = React.lazy(() => import('./pages/CrossPlatformCompatibility'));
const MobileOptimization = React.lazy(() => import('./pages/MobileOptimization'));
const AdvancedMobileFeatures = React.lazy(() => import('./pages/AdvancedMobileFeatures'));
const AdvancedUI = React.lazy(() => import('./pages/AdvancedUI'));
const NaturalLanguageProcessing = React.lazy(() => import('./pages/NaturalLanguageProcessing'));
const CommunicationSystems = React.lazy(() => import('./pages/CommunicationSystems'));
const Telemedicine = React.lazy(() => import('./pages/Telemedicine'));
const BioWasteManagement = React.lazy(() => import('./pages/BioWasteManagement'));
const VisitorControl = React.lazy(() => import('./pages/VisitorControl'));
const PatientJourney = React.lazy(() => import('./pages/PatientJourney'));
const GeriatricCare = React.lazy(() => import('./pages/GeriatricCare'));
const PediatricCare = React.lazy(() => import('./pages/PediatricCare'));
const OncologyCare = React.lazy(() => import('./pages/OncologyCare'));
const SurgicalServices = React.lazy(() => import('./pages/SurgicalServices'));
const EmergencyMedicine = React.lazy(() => import('./pages/EmergencyMedicine'));
const RehabilitationServices = React.lazy(() => import('./pages/RehabilitationServices'));
const Pathology = React.lazy(() => import('./pages/Pathology'));
const RIS = React.lazy(() => import('./pages/RIS'));
const AdvancedResearchTools = React.lazy(() => import('./pages/AdvancedResearchTools'));
const ResearchDataManagement = React.lazy(() => import('./pages/ResearchDataManagement'));
const PublicHealthIntegration = React.lazy(() => import('./pages/PublicHealthIntegration'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <TooltipProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                    </div>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<PatientLanding />} />
                    <Route path="/landing" element={<PatientLanding />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/patient-dashboard" element={
                      <ProtectedRoute>
                        <PatientDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Layout>
                          <Dashboard />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/appointments" element={
                      <ProtectedRoute>
                        <Layout>
                          <Appointments />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/documents" element={
                      <ProtectedRoute>
                        <Layout>
                          <Documents />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/billing" element={
                      <ProtectedRoute>
                        <Layout>
                          <Billing />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/pharmacy" element={
                      <ProtectedRoute>
                        <Layout>
                          <Pharmacy />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/analytics" element={
                      <ProtectedRoute>
                        <Layout>
                          <HospitalAnalytics />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/hr" element={
                      <ProtectedRoute>
                        <Layout>
                          <HRManagement />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <Layout>
                          <Settings />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Layout>
                          <Profile />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/lims" element={
                      <ProtectedRoute>
                        <Layout>
                          <LIMS />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/tpa" element={
                      <ProtectedRoute>
                        <Layout>
                          <TPA />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/ward" element={
                      <ProtectedRoute>
                        <Layout>
                          <Ward />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/emergency" element={
                      <ProtectedRoute>
                        <Layout>
                          <Emergency />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/wellness" element={
                      <ProtectedRoute>
                        <Layout>
                          <Wellness />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/community" element={
                      <ProtectedRoute>
                        <Layout>
                          <Community />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/health-twin" element={
                      <ProtectedRoute>
                        <Layout>
                          <HealthTwin />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/mental-health" element={
                      <ProtectedRoute>
                        <Layout>
                          <MentalHealth />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/engagement" element={
                      <ProtectedRoute>
                        <Layout>
                          <Engagement />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/intelligent-content" element={
                      <ProtectedRoute>
                        <Layout>
                          <IntelligentContent />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/insurance" element={
                      <ProtectedRoute>
                        <Layout>
                          <Insurance />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/onboarding" element={
                      <ProtectedRoute>
                        <Layout>
                          <Onboarding />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/emotional-health" element={
                      <ProtectedRoute>
                        <Layout>
                          <EmotionalHealth />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/profile-management" element={
                      <ProtectedRoute>
                        <Layout>
                          <ProfileManagement />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/advanced-security" element={
                      <ProtectedRoute>
                        <Layout>
                          <AdvancedSecurityFeatures />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/advanced-access-control" element={
                      <ProtectedRoute>
                        <Layout>
                          <AdvancedAccessControl />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/advanced-automation" element={
                      <ProtectedRoute>
                        <Layout>
                          <AdvancedAutomation />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/advanced-workflow-ai" element={
                      <ProtectedRoute>
                        <Layout>
                          <AdvancedWorkflowAI />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/workflow-automation-ai" element={
                      <ProtectedRoute>
                        <Layout>
                          <WorkflowAutomationAI />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/advanced-ai-diagnostics" element={
                      <ProtectedRoute>
                        <Layout>
                          <AdvancedAIDiagnostics />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/predictive-clinical-ai" element={
                      <ProtectedRoute>
                        <Layout>
                          <PredictiveClinicalAI />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/predictive-maintenance-ai" element={
                      <ProtectedRoute>
                        <Layout>
                          <PredictiveMaintenanceAI />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/process-optimization-ai" element={
                      <ProtectedRoute>
                        <Layout>
                          <ProcessOptimizationAI />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/safety-compliance-ai" element={
                      <ProtectedRoute>
                        <Layout>
                          <SafetyComplianceAI />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/content-engagement-ai" element={
                      <ProtectedRoute>
                        <Layout>
                          <ContentEngagementAI />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/emotional-retention-ai" element={
                      <ProtectedRoute>
                        <Layout>
                          <EmotionalRetentionAI />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/mental-health-ai" element={
                      <ProtectedRoute>
                        <Layout>
                          <MentalHealthAI />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/treatment-protocol-ai" element={
                      <ProtectedRoute>
                        <Layout>
                          <TreatmentProtocolAI />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/clinical-analytics" element={
                      <ProtectedRoute>
                        <Layout>
                          <ClinicalAnalytics />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/clinical-decision-support" element={
                      <ProtectedRoute>
                        <Layout>
                          <ClinicalDecisionSupport />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/clinical-optimization" element={
                      <ProtectedRoute>
                        <Layout>
                          <ClinicalOptimization />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/hr-analytics" element={
                      <ProtectedRoute>
                        <Layout>
                          <HRAnalytics />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/compliance-management" element={
                      <ProtectedRoute>
                        <Layout>
                          <ComplianceManagement />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/data-governance" element={
                      <ProtectedRoute>
                        <Layout>
                          <DataGovernance />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/risk-management" element={
                      <ProtectedRoute>
                        <Layout>
                          <RiskManagement />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/quality-assurance" element={
                      <ProtectedRoute>
                        <Layout>
                          <QualityAssurance />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/performance-monitoring" element={
                      <ProtectedRoute>
                        <Layout>
                          <PerformanceMonitoring />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/performance-optimization" element={
                      <ProtectedRoute>
                        <Layout>
                          <PerformanceOptimization />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/scalability-management" element={
                      <ProtectedRoute>
                        <Layout>
                          <ScalabilityManagement />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/system-integration" element={
                      <ProtectedRoute>
                        <Layout>
                          <SystemIntegration />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/system-maintenance" element={
                      <ProtectedRoute>
                        <Layout>
                          <SystemMaintenance />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/device-integration" element={
                      <ProtectedRoute>
                        <Layout>
                          <DeviceIntegration />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/cross-platform-compatibility" element={
                      <ProtectedRoute>
                        <Layout>
                          <CrossPlatformCompatibility />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/mobile-optimization" element={
                      <ProtectedRoute>
                        <Layout>
                          <MobileOptimization />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/advanced-mobile-features" element={
                      <ProtectedRoute>
                        <Layout>
                          <AdvancedMobileFeatures />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/advanced-ui" element={
                      <ProtectedRoute>
                        <Layout>
                          <AdvancedUI />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/natural-language-processing" element={
                      <ProtectedRoute>
                        <Layout>
                          <NaturalLanguageProcessing />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/communication-systems" element={
                      <ProtectedRoute>
                        <Layout>
                          <CommunicationSystems />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/telemedicine" element={
                      <ProtectedRoute>
                        <Layout>
                          <Telemedicine />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/bio-waste-management" element={
                      <ProtectedRoute>
                        <Layout>
                          <BioWasteManagement />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/visitor-control" element={
                      <ProtectedRoute>
                        <Layout>
                          <VisitorControl />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/patient-journey" element={
                      <ProtectedRoute>
                        <Layout>
                          <PatientJourney />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/geriatric-care" element={
                      <ProtectedRoute>
                        <Layout>
                          <GeriatricCare />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/pediatric-care" element={
                      <ProtectedRoute>
                        <Layout>
                          <PediatricCare />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/oncology-care" element={
                      <ProtectedRoute>
                        <Layout>
                          <OncologyCare />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/surgical-services" element={
                      <ProtectedRoute>
                        <Layout>
                          <SurgicalServices />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/emergency-medicine" element={
                      <ProtectedRoute>
                        <Layout>
                          <EmergencyMedicine />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/rehabilitation-services" element={
                      <ProtectedRoute>
                        <Layout>
                          <RehabilitationServices />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/pathology" element={
                      <ProtectedRoute>
                        <Layout>
                          <Pathology />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/ris" element={
                      <ProtectedRoute>
                        <Layout>
                          <RIS />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/advanced-research-tools" element={
                      <ProtectedRoute>
                        <Layout>
                          <AdvancedResearchTools />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/research-data-management" element={
                      <ProtectedRoute>
                        <Layout>
                          <ResearchDataManagement />
                        </Layout>
                      </ProtectedRoute>
                    } />
                    <Route path="/public-health-integration" element={
                      <ProtectedRoute>
                        <Layout>
                          <PublicHealthIntegration />
                        </Layout>
                      </ProtectedRoute>
                    } />
                  </Routes>
                </Suspense>
              </div>
            </Router>
          </TooltipProvider>
        </ThemeProvider>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
