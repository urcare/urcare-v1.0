import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Import components
import { PatientLandingPage } from '@/components/landing/PatientLandingPage';
import Layout from '@/components/Layout';

// Lazy load pages for better performance
const PatientDashboard = React.lazy(() => import('@/pages/PatientDashboard'));
const Login = React.lazy(() => import('@/pages/Login'));
const Signup = React.lazy(() => import('@/pages/Signup'));
const Settings = React.lazy(() => import('@/pages/Settings'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

// Lazy load components
const AdvancedAIDiagnostics = React.lazy(() => import('@/pages/AdvancedAIDiagnostics'));
const AdvancedAccessControl = React.lazy(() => import('@/pages/AdvancedAccessControl'));
const AdvancedAutomation = React.lazy(() => import('@/pages/AdvancedAutomation'));
const AdvancedMobileFeatures = React.lazy(() => import('@/pages/AdvancedMobileFeatures'));
const AdvancedResearchTools = React.lazy(() => import('@/pages/AdvancedResearchTools'));
const AdvancedSecurityFeatures = React.lazy(() => import('@/pages/AdvancedSecurityFeatures'));
const AdvancedUI = React.lazy(() => import('@/pages/AdvancedUI'));
const AdvancedWorkflowAI = React.lazy(() => import('@/pages/AdvancedWorkflowAI'));
const Appointments = React.lazy(() => import('@/pages/Appointments'));
const Auth = React.lazy(() => import('@/pages/Auth'));
const AuthPage = React.lazy(() => import('@/pages/AuthPage'));
const Billing = React.lazy(() => import('@/pages/Billing'));
const BioWasteManagement = React.lazy(() => import('@/pages/BioWasteManagement'));
const ClinicalAnalytics = React.lazy(() => import('@/pages/ClinicalAnalytics'));
const ClinicalDecisionSupport = React.lazy(() => import('@/pages/ClinicalDecisionSupport'));
const ClinicalOptimization = React.lazy(() => import('@/pages/ClinicalOptimization'));
const CommunicationSystems = React.lazy(() => import('@/pages/CommunicationSystems'));
const Community = React.lazy(() => import('@/pages/Community'));
const ComplianceManagement = React.lazy(() => import('@/pages/ComplianceManagement'));
const ContentEngagementAI = React.lazy(() => import('@/pages/ContentEngagementAI'));
const CrossPlatformCompatibility = React.lazy(() => import('@/pages/CrossPlatformCompatibility'));
const DataGovernance = React.lazy(() => import('@/pages/DataGovernance'));
const DeviceIntegration = React.lazy(() => import('@/pages/DeviceIntegration'));
const Documents = React.lazy(() => import('@/pages/Documents'));
const Emergency = React.lazy(() => import('@/pages/Emergency'));
const EmergencyMedicine = React.lazy(() => import('@/pages/EmergencyMedicine'));
const EmotionalHealth = React.lazy(() => import('@/pages/EmotionalHealth'));
const EmotionalRetentionAI = React.lazy(() => import('@/pages/EmotionalRetentionAI'));
const Engagement = React.lazy(() => import('@/pages/Engagement'));
const GeriatricCare = React.lazy(() => import('@/pages/GeriatricCare'));
const HRAnalytics = React.lazy(() => import('@/pages/HRAnalytics'));
const HRManagement = React.lazy(() => import('@/pages/HRManagement'));
const HealthTwin = React.lazy(() => import('@/pages/HealthTwin'));
const HospitalAnalytics = React.lazy(() => import('@/pages/HospitalAnalytics'));
const Index = React.lazy(() => import('@/pages/Index'));
const Insurance = React.lazy(() => import('@/pages/Insurance'));
const IntelligentContent = React.lazy(() => import('@/pages/IntelligentContent'));
const LIMS = React.lazy(() => import('@/pages/LIMS'));
const MentalHealth = React.lazy(() => import('@/pages/MentalHealth'));
const MentalHealthAI = React.lazy(() => import('@/pages/MentalHealthAI'));
const MobileLanding = React.lazy(() => import('@/pages/MobileLanding'));
const MobileOptimization = React.lazy(() => import('@/pages/MobileOptimization'));
const NaturalLanguageProcessing = React.lazy(() => import('@/pages/NaturalLanguageProcessing'));
const Onboarding = React.lazy(() => import('@/pages/Onboarding'));
const OncologyCare = React.lazy(() => import('@/pages/OncologyCare'));
const Pathology = React.lazy(() => import('@/pages/Pathology'));
const PatientJourney = React.lazy(() => import('@/pages/PatientJourney'));
const PediatricCare = React.lazy(() => import('@/pages/PediatricCare'));
const PerformanceMonitoring = React.lazy(() => import('@/pages/PerformanceMonitoring'));
const PerformanceOptimization = React.lazy(() => import('@/pages/PerformanceOptimization'));
const Pharmacy = React.lazy(() => import('@/pages/Pharmacy'));
const PredictiveClinicalAI = React.lazy(() => import('@/pages/PredictiveClinicalAI'));
const PredictiveMaintenanceAI = React.lazy(() => import('@/pages/PredictiveMaintenanceAI'));
const ProcessOptimizationAI = React.lazy(() => import('@/pages/ProcessOptimizationAI'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const ProfileManagement = React.lazy(() => import('@/pages/ProfileManagement'));
const PublicHealthIntegration = React.lazy(() => import('@/pages/PublicHealthIntegration'));
const QualityAssurance = React.lazy(() => import('@/pages/QualityAssurance'));
const RIS = React.lazy(() => import('@/pages/RIS'));
const RehabilitationServices = React.lazy(() => import('@/pages/RehabilitationServices'));
const ResearchDataManagement = React.lazy(() => import('@/pages/ResearchDataManagement'));
const RiskManagement = React.lazy(() => import('@/pages/RiskManagement'));
const SafetyComplianceAI = React.lazy(() => import('@/pages/SafetyComplianceAI'));
const ScalabilityManagement = React.lazy(() => import('@/pages/ScalabilityManagement'));
const SurgicalServices = React.lazy(() => import('@/pages/SurgicalServices'));
const SystemIntegration = React.lazy(() => import('@/pages/SystemIntegration'));
const SystemMaintenance = React.lazy(() => import('@/pages/SystemMaintenance'));
const TPA = React.lazy(() => import('@/pages/TPA'));
const Telemedicine = React.lazy(() => import('@/pages/Telemedicine'));
const TreatmentProtocolAI = React.lazy(() => import('@/pages/TreatmentProtocolAI'));
const Unauthorized = React.lazy(() => import('@/pages/Unauthorized'));
const VisitorControl = React.lazy(() => import('@/pages/VisitorControl'));
const Ward = React.lazy(() => import('@/pages/Ward'));
const Wellness = React.lazy(() => import('@/pages/Wellness'));
const WorkflowAutomationAI = React.lazy(() => import('@/pages/WorkflowAutomationAI'));

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <div className="App">
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                    </div>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<PatientLandingPage />} />
                    <Route path="/landing" element={<PatientLandingPage />} />
                    
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/auth-page" element={<AuthPage />} />
                    <Route path="/mobile-landing" element={<MobileLanding />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    
                    <Route 
                      path="/patient-dashboard" 
                      element={
                        <ProtectedRoute>
                          <PatientDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    <Route
                      path="/dashboard"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <Index />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/settings"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <Settings />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/profile"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/profile-management"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <ProfileManagement />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/appointments"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <Appointments />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/documents"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <Documents />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/billing"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <Billing />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/pharmacy"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <Pharmacy />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/emergency"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <Emergency />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/wellness"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <Wellness />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/community"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <Community />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/engagement"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <Engagement />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/emotional-health"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <EmotionalHealth />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/health-twin"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <HealthTwin />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/mental-health"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <MentalHealth />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/intelligent-content"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <IntelligentContent />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/insurance"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <Insurance />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/telemedicine"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <Telemedicine />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/tpa"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <TPA />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/hospital-analytics"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <HospitalAnalytics />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/clinical-analytics"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <ClinicalAnalytics />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/hr-analytics"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <HRAnalytics />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/hr-management"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <HRManagement />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/clinical-decision-support"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <ClinicalDecisionSupport />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/clinical-optimization"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <ClinicalOptimization />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/treatment-protocol-ai"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <TreatmentProtocolAI />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/predictive-clinical-ai"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <PredictiveClinicalAI />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/mental-health-ai"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <MentalHealthAI />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/advanced-ai-diagnostics"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <AdvancedAIDiagnostics />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/natural-language-processing"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <NaturalLanguageProcessing />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/predictive-maintenance-ai"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <PredictiveMaintenanceAI />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/process-optimization-ai"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <ProcessOptimizationAI />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/workflow-automation-ai"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <WorkflowAutomationAI />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/advanced-workflow-ai"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <AdvancedWorkflowAI />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/content-engagement-ai"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <ContentEngagementAI />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/emotional-retention-ai"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <EmotionalRetentionAI />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/safety-compliance-ai"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <SafetyComplianceAI />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/advanced-automation"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <AdvancedAutomation />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/advanced-access-control"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <AdvancedAccessControl />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/data-governance"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <DataGovernance />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/compliance-management"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <ComplianceManagement />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/risk-management"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <RiskManagement />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/advanced-security-features"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <AdvancedSecurityFeatures />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/quality-assurance"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <QualityAssurance />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/performance-monitoring"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <PerformanceMonitoring />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/performance-optimization"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <PerformanceOptimization />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/scalability-management"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <ScalabilityManagement />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/mobile-optimization"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <MobileOptimization />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/advanced-mobile-features"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <AdvancedMobileFeatures />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/cross-platform-compatibility"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <CrossPlatformCompatibility />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/advanced-ui"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <AdvancedUI />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/system-integration"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <SystemIntegration />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/system-maintenance"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <SystemMaintenance />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/device-integration"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <DeviceIntegration />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/communication-systems"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <CommunicationSystems />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/advanced-research-tools"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <AdvancedResearchTools />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/research-data-management"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <ResearchDataManagement />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/oncology-care"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <OncologyCare />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/pediatric-care"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <PediatricCare />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/geriatric-care"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <GeriatricCare />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/emergency-medicine"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <EmergencyMedicine />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/surgical-services"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <SurgicalServices />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/rehabilitation-services"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <RehabilitationServices />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/pathology"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <Pathology />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/lims"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <LIMS />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/ris"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <RIS />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/patient-journey"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <PatientJourney />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/ward"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <Ward />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/bio-waste-management"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <BioWasteManagement />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/visitor-control"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <VisitorControl />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/public-health-integration"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <PublicHealthIntegration />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
            </AuthProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
