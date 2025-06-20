
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PatientLandingPage } from '@/components/landing/PatientLandingPage';

// Lazy load components
const Dashboard = React.lazy(() => import('@/components/Dashboard').then(module => ({ default: module.Dashboard })));
const PatientDashboard = React.lazy(() => import('@/pages/PatientDashboard'));
const Auth = React.lazy(() => import('@/pages/Auth'));
const Onboarding = React.lazy(() => import('@/pages/Onboarding'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const Unauthorized = React.lazy(() => import('@/pages/Unauthorized'));

// Medical Services
const EmergencyMedicine = React.lazy(() => import('@/pages/EmergencyMedicine'));
const Emergency = React.lazy(() => import('@/pages/Emergency'));
const SurgicalServices = React.lazy(() => import('@/pages/SurgicalServices'));
const Pathology = React.lazy(() => import('@/pages/Pathology'));
const OncologyCare = React.lazy(() => import('@/pages/OncologyCare'));
const MentalHealth = React.lazy(() => import('@/pages/MentalHealth'));
const PediatricCare = React.lazy(() => import('@/pages/PediatricCare'));
const GeriatricCare = React.lazy(() => import('@/pages/GeriatricCare'));
const RehabilitationServices = React.lazy(() => import('@/pages/RehabilitationServices'));
const Telemedicine = React.lazy(() => import('@/pages/Telemedicine'));

// Healthcare Analytics
const HospitalAnalytics = React.lazy(() => import('@/pages/HospitalAnalytics'));
const ClinicalAnalytics = React.lazy(() => import('@/pages/ClinicalAnalytics'));
const ClinicalDecisionSupport = React.lazy(() => import('@/pages/ClinicalDecisionSupport'));
const ClinicalOptimization = React.lazy(() => import('@/pages/ClinicalOptimization'));
const PerformanceMonitoring = React.lazy(() => import('@/pages/PerformanceMonitoring'));
const PerformanceOptimization = React.lazy(() => import('@/pages/PerformanceOptimization'));

// Laboratory & Diagnostics
const LIMS = React.lazy(() => import('@/pages/LIMS'));
const RIS = React.lazy(() => import('@/pages/RIS'));
const Pharmacy = React.lazy(() => import('@/pages/Pharmacy'));

// Financial Management
const Billing = React.lazy(() => import('@/pages/Billing'));
const Insurance = React.lazy(() => import('@/pages/Insurance'));
const TPA = React.lazy(() => import('@/pages/TPA'));

// AI & Automation
const AdvancedAIDiagnostics = React.lazy(() => import('@/pages/AdvancedAIDiagnostics'));
const MentalHealthAI = React.lazy(() => import('@/pages/MentalHealthAI'));
const PredictiveClinicalAI = React.lazy(() => import('@/pages/PredictiveClinicalAI'));
const WorkflowAutomationAI = React.lazy(() => import('@/pages/WorkflowAutomationAI'));
const AdvancedWorkflowAI = React.lazy(() => import('@/pages/AdvancedWorkflowAI'));
const ProcessOptimizationAI = React.lazy(() => import('@/pages/ProcessOptimizationAI'));
const TreatmentProtocolAI = React.lazy(() => import('@/pages/TreatmentProtocolAI'));
const ContentEngagementAI = React.lazy(() => import('@/pages/ContentEngagementAI'));
const EmotionalRetentionAI = React.lazy(() => import('@/pages/EmotionalRetentionAI'));
const SafetyComplianceAI = React.lazy(() => import('@/pages/SafetyComplianceAI'));
const PredictiveMaintenanceAI = React.lazy(() => import('@/pages/PredictiveMaintenanceAI'));
const AdvancedAutomation = React.lazy(() => import('@/pages/AdvancedAutomation'));

// Patient Engagement
const Community = React.lazy(() => import('@/pages/Community'));
const Engagement = React.lazy(() => import('@/pages/Engagement'));
const Wellness = React.lazy(() => import('@/pages/Wellness'));
const IntelligentContent = React.lazy(() => import('@/pages/IntelligentContent'));

// System Management
const HRManagement = React.lazy(() => import('@/pages/HRManagement'));
const HRAnalytics = React.lazy(() => import('@/pages/HRAnalytics'));
const VisitorControl = React.lazy(() => import('@/pages/VisitorControl'));
const BioWasteManagement = React.lazy(() => import('@/pages/BioWasteManagement'));
const SystemIntegration = React.lazy(() => import('@/pages/SystemIntegration'));
const DeviceIntegration = React.lazy(() => import('@/pages/DeviceIntegration'));
const CommunicationSystems = React.lazy(() => import('@/pages/CommunicationSystems'));
const SystemMaintenance = React.lazy(() => import('@/pages/SystemMaintenance'));

// Security & Compliance
const AdvancedSecurityFeatures = React.lazy(() => import('@/pages/AdvancedSecurityFeatures'));
const AdvancedAccessControl = React.lazy(() => import('@/pages/AdvancedAccessControl'));
const ComplianceManagement = React.lazy(() => import('@/pages/ComplianceManagement'));
const DataGovernance = React.lazy(() => import('@/pages/DataGovernance'));
const RiskManagement = React.lazy(() => import('@/pages/RiskManagement'));
const QualityAssurance = React.lazy(() => import('@/pages/QualityAssurance'));

// Advanced Features
const AdvancedResearchTools = React.lazy(() => import('@/pages/AdvancedResearchTools'));
const ResearchDataManagement = React.lazy(() => import('@/pages/ResearchDataManagement'));
const PublicHealthIntegration = React.lazy(() => import('@/pages/PublicHealthIntegration'));
const NaturalLanguageProcessing = React.lazy(() => import('@/pages/NaturalLanguageProcessing'));
const CrossPlatformCompatibility = React.lazy(() => import('@/pages/CrossPlatformCompatibility'));
const ScalabilityManagement = React.lazy(() => import('@/pages/ScalabilityManagement'));
const AdvancedUI = React.lazy(() => import('@/pages/AdvancedUI'));

// Mobile & Optimization
const MobileOptimization = React.lazy(() => import('@/pages/MobileOptimization'));
const AdvancedMobileFeatures = React.lazy(() => import('@/pages/AdvancedMobileFeatures'));
const MobileLanding = React.lazy(() => import('@/pages/MobileLanding'));

// Core Pages
const Appointments = React.lazy(() => import('@/pages/Appointments'));
const Documents = React.lazy(() => import('@/pages/Documents'));
const Ward = React.lazy(() => import('@/pages/Ward'));
const PatientJourney = React.lazy(() => import('@/pages/PatientJourney'));
const ProfileManagement = React.lazy(() => import('@/pages/ProfileManagement'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const Settings = React.lazy(() => import('@/pages/Settings'));
const Index = React.lazy(() => import('@/pages/Index'));
const Landing = React.lazy(() => import('@/pages/Landing'));
const PatientLanding = React.lazy(() => import('@/pages/PatientLanding'));
const Login = React.lazy(() => import('@/pages/Login'));
const HealthTwin = React.lazy(() => import('@/pages/HealthTwin'));
const EmotionalHealth = React.lazy(() => import('@/pages/EmotionalHealth'));

const queryClient = new QueryClient();

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Index />
                  </Suspense>
                } />
                <Route path="/landing" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Landing />
                  </Suspense>
                } />
                <Route path="/patient-landing" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PatientLanding />
                  </Suspense>
                } />
                <Route path="/auth" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Auth />
                  </Suspense>
                } />
                <Route path="/login" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Login />
                  </Suspense>
                } />
                <Route path="/unauthorized" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Unauthorized />
                  </Suspense>
                } />

                {/* Onboarding route */}
                <Route path="/onboarding" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Onboarding />
                    </Suspense>
                  </ProtectedRoute>
                } />

                {/* Protected dashboard routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <PatientDashboard />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/dashboard/admin" element={
                  <ProtectedRoute>
                    <Layout>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Dashboard />
                      </Suspense>
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Core System Routes */}
                <Route path="/appointments" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Appointments />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/documents" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Documents />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/ward" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Ward />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/patient-journey" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <PatientJourney />
                    </Suspense>
                  </ProtectedRoute>
                } />

                {/* Medical Services Routes */}
                <Route path="/emergency-medicine" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <EmergencyMedicine />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/emergency" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Emergency />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/surgical-services" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <SurgicalServices />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/pathology" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Pathology />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/oncology-care" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <OncologyCare />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/mental-health" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <MentalHealth />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/pediatric-care" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <PediatricCare />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/geriatric-care" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <GeriatricCare />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/rehabilitation-services" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <RehabilitationServices />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/telemedicine" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Telemedicine />
                    </Suspense>
                  </ProtectedRoute>
                } />

                {/* Healthcare Analytics Routes */}
                <Route path="/hospital-analytics" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <HospitalAnalytics />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/clinical-analytics" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ClinicalAnalytics />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/clinical-decision-support" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ClinicalDecisionSupport />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/clinical-optimization" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ClinicalOptimization />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/performance-monitoring" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <PerformanceMonitoring />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/performance-optimization" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <PerformanceOptimization />
                    </Suspense>
                  </ProtectedRoute>
                } />

                {/* Laboratory & Diagnostics Routes */}
                <Route path="/lims" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <LIMS />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/ris" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <RIS />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/pharmacy" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Pharmacy />
                    </Suspense>
                  </ProtectedRoute>
                } />

                {/* Financial Management Routes */}
                <Route path="/billing" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Billing />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/insurance" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Insurance />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/tpa" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <TPA />
                    </Suspense>
                  </ProtectedRoute>
                } />

                {/* AI & Automation Routes */}
                <Route path="/advanced-ai-diagnostics" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdvancedAIDiagnostics />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/mental-health-ai" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <MentalHealthAI />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/predictive-clinical-ai" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <PredictiveClinicalAI />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/workflow-automation-ai" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <WorkflowAutomationAI />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/advanced-workflow-ai" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdvancedWorkflowAI />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/process-optimization-ai" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ProcessOptimizationAI />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/treatment-protocol-ai" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <TreatmentProtocolAI />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/content-engagement-ai" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ContentEngagementAI />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/emotional-retention-ai" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <EmotionalRetentionAI />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/safety-compliance-ai" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <SafetyComplianceAI />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/predictive-maintenance-ai" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <PredictiveMaintenanceAI />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/advanced-automation" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdvancedAutomation />
                    </Suspense>
                  </ProtectedRoute>
                } />

                {/* Patient Engagement Routes */}
                <Route path="/community" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Community />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/engagement" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Engagement />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/wellness" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Wellness />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/intelligent-content" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <IntelligentContent />
                    </Suspense>
                  </ProtectedRoute>
                } />

                {/* System Management Routes */}
                <Route path="/hr-management" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <HRManagement />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/hr-analytics" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <HRAnalytics />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/visitor-control" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <VisitorControl />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/bio-waste-management" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <BioWasteManagement />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/system-integration" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <SystemIntegration />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/device-integration" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <DeviceIntegration />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/communication-systems" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <CommunicationSystems />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/system-maintenance" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <SystemMaintenance />
                    </Suspense>
                  </ProtectedRoute>
                } />

                {/* Security & Compliance Routes */}
                <Route path="/advanced-security-features" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdvancedSecurityFeatures />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/advanced-access-control" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdvancedAccessControl />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/compliance-management" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ComplianceManagement />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/data-governance" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <DataGovernance />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/risk-management" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <RiskManagement />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/quality-assurance" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <QualityAssurance />
                    </Suspense>
                  </ProtectedRoute>
                } />

                {/* Advanced Features Routes */}
                <Route path="/advanced-research-tools" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdvancedResearchTools />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/research-data-management" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ResearchDataManagement />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/public-health-integration" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <PublicHealthIntegration />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/natural-language-processing" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <NaturalLanguageProcessing />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/cross-platform-compatibility" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <CrossPlatformCompatibility />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/scalability-management" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ScalabilityManagement />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/advanced-ui" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdvancedUI />
                    </Suspense>
                  </ProtectedRoute>
                } />

                {/* Mobile & Optimization Routes */}
                <Route path="/mobile-optimization" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <MobileOptimization />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/advanced-mobile-features" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdvancedMobileFeatures />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/mobile-landing" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <MobileLanding />
                    </Suspense>
                  </ProtectedRoute>
                } />

                {/* Profile & Settings Routes */}
                <Route path="/profile-management" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ProfileManagement />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Profile />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Settings />
                    </Suspense>
                  </ProtectedRoute>
                } />

                {/* Special Features Routes */}
                <Route path="/health-twin" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <HealthTwin />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/emotional-health" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <EmotionalHealth />
                    </Suspense>
                  </ProtectedRoute>
                } />

                {/* 404 route */}
                <Route path="*" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <NotFound />
                  </Suspense>
                } />
              </Routes>
            </div>
            <Toaster />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
