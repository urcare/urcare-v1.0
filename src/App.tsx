
import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@/components/ui/theme-provider';
import './App.css';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const MobileLanding = lazy(() => import("./pages/MobileLanding"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const PatientDashboard = lazy(() => import("./pages/PatientDashboard"));

// Import Dashboard directly since it's a component, not a page
import { Dashboard } from '@/components/Dashboard';

// Lazy load all other pages
const LIMS = lazy(() => import("./pages/LIMS"));
const Billing = lazy(() => import("./pages/Billing"));
const HRManagement = lazy(() => import("./pages/HRManagement"));
const HRAnalytics = lazy(() => import("./pages/HRAnalytics"));
const Insurance = lazy(() => import("./pages/Insurance"));
const HospitalAnalytics = lazy(() => import("./pages/HospitalAnalytics"));
const BioWasteManagement = lazy(() => import("./pages/BioWasteManagement"));
const AdvancedResearchTools = lazy(() => import("./pages/AdvancedResearchTools"));
const AdvancedWorkflowAI = lazy(() => import("./pages/AdvancedWorkflowAI"));
const ClinicalAnalytics = lazy(() => import("./pages/ClinicalAnalytics"));
const Community = lazy(() => import("./pages/Community"));
const ContentEngagementAI = lazy(() => import("./pages/ContentEngagementAI"));
const AdvancedUI = lazy(() => import("./pages/AdvancedUI"));
const EmotionalRetentionAI = lazy(() => import("./pages/EmotionalRetentionAI"));
const Emergency = lazy(() => import("./pages/Emergency"));
const ClinicalOptimization = lazy(() => import("./pages/ClinicalOptimization"));
const MentalHealth = lazy(() => import("./pages/MentalHealth"));
const GeriatricCare = lazy(() => import("./pages/GeriatricCare"));
const ClinicalDecisionSupport = lazy(() => import("./pages/ClinicalDecisionSupport"));
const Engagement = lazy(() => import("./pages/Engagement"));
const DataGovernance = lazy(() => import("./pages/DataGovernance"));
const AdvancedMobileFeatures = lazy(() => import("./pages/AdvancedMobileFeatures"));
const EmergencyMedicine = lazy(() => import("./pages/EmergencyMedicine"));
const AdvancedSecurityFeatures = lazy(() => import("./pages/AdvancedSecurityFeatures"));
const CrossPlatformCompatibility = lazy(() => import("./pages/CrossPlatformCompatibility"));
const AdvancedAutomation = lazy(() => import("./pages/AdvancedAutomation"));
const ComplianceManagement = lazy(() => import("./pages/ComplianceManagement"));
const AdvancedAIDiagnostics = lazy(() => import("./pages/AdvancedAIDiagnostics"));
const AdvancedAccessControl = lazy(() => import("./pages/AdvancedAccessControl"));
const IntelligentContent = lazy(() => import("./pages/IntelligentContent"));
const DeviceIntegration = lazy(() => import("./pages/DeviceIntegration"));
const CommunicationSystems = lazy(() => import("./pages/CommunicationSystems"));
const Appointments = lazy(() => import("./pages/Appointments"));
const Documents = lazy(() => import("./pages/Documents"));
const EmotionalHealth = lazy(() => import("./pages/EmotionalHealth"));
const HealthTwin = lazy(() => import("./pages/HealthTwin"));
const RIS = lazy(() => import("./pages/RIS"));
const TPA = lazy(() => import("./pages/TPA"));
const Pharmacy = lazy(() => import("./pages/Pharmacy"));
const VisitorControl = lazy(() => import("./pages/VisitorControl"));
const MentalHealthAI = lazy(() => import("./pages/MentalHealthAI"));
const PublicHealthIntegration = lazy(() => import("./pages/PublicHealthIntegration"));
const SafetyComplianceAI = lazy(() => import("./pages/SafetyComplianceAI"));
const TreatmentProtocolAI = lazy(() => import("./pages/TreatmentProtocolAI"));
const PredictiveClinicalAI = lazy(() => import("./pages/PredictiveClinicalAI"));
const WorkflowAutomationAI = lazy(() => import("./pages/WorkflowAutomationAI"));
const ProcessOptimizationAI = lazy(() => import("./pages/ProcessOptimizationAI"));
const ResearchDataManagement = lazy(() => import("./pages/ResearchDataManagement"));
const Wellness = lazy(() => import("./pages/Wellness"));
const OncologyCare = lazy(() => import("./pages/OncologyCare"));
const Pathology = lazy(() => import("./pages/Pathology"));
const Telemedicine = lazy(() => import("./pages/Telemedicine"));
const PediatricCare = lazy(() => import("./pages/PediatricCare"));
const RiskManagement = lazy(() => import("./pages/RiskManagement"));
const SurgicalServices = lazy(() => import("./pages/SurgicalServices"));
const MobileOptimization = lazy(() => import("./pages/MobileOptimization"));
const QualityAssurance = lazy(() => import("./pages/QualityAssurance"));
const SystemMaintenance = lazy(() => import("./pages/SystemMaintenance"));
const PerformanceMonitoring = lazy(() => import("./pages/PerformanceMonitoring"));
const ScalabilityManagement = lazy(() => import("./pages/ScalabilityManagement"));
const RehabilitationServices = lazy(() => import("./pages/RehabilitationServices"));
const PerformanceOptimization = lazy(() => import("./pages/PerformanceOptimization"));
const SystemIntegration = lazy(() => import("./pages/SystemIntegration"));
const NaturalLanguageProcessing = lazy(() => import("./pages/NaturalLanguageProcessing"));
const PredictiveMaintenanceAI = lazy(() => import("./pages/PredictiveMaintenanceAI"));
const ProfileManagement = lazy(() => import("./pages/ProfileManagement"));
const Ward = lazy(() => import("./pages/Ward"));
const PatientJourney = lazy(() => import("./pages/PatientJourney"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="system">
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <div className="min-h-screen w-full">
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="text-center space-y-4">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-body text-muted-foreground">Loading UrCare...</p>
                    </div>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/mobile" element={<MobileLanding />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    
                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
                    <Route path="/patient-dashboard/*" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
                    
                    {/* Medical Services */}
                    <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
                    <Route path="/telemedicine" element={<ProtectedRoute><Telemedicine /></ProtectedRoute>} />
                    <Route path="/emergency-medicine" element={<ProtectedRoute><EmergencyMedicine /></ProtectedRoute>} />
                    <Route path="/surgical-services" element={<ProtectedRoute><SurgicalServices /></ProtectedRoute>} />
                    <Route path="/pathology" element={<ProtectedRoute><Pathology /></ProtectedRoute>} />
                    <Route path="/mental-health" element={<ProtectedRoute><MentalHealth /></ProtectedRoute>} />
                    <Route path="/mental-health-ai" element={<ProtectedRoute><Layout><MentalHealthAI /></Layout></ProtectedRoute>} />
                    <Route path="/pediatric-care" element={<ProtectedRoute><PediatricCare /></ProtectedRoute>} />
                    <Route path="/geriatric-care" element={<ProtectedRoute><GeriatricCare /></ProtectedRoute>} />
                    <Route path="/oncology-care" element={<ProtectedRoute><OncologyCare /></ProtectedRoute>} />
                    <Route path="/rehabilitation-services" element={<ProtectedRoute><RehabilitationServices /></ProtectedRoute>} />
                    
                    {/* Laboratory & Diagnostics */}
                    <Route path="/lims" element={<ProtectedRoute><Layout><LIMS /></Layout></ProtectedRoute>} />
                    <Route path="/ris" element={<ProtectedRoute><Layout><RIS /></Layout></ProtectedRoute>} />
                    
                    {/* Health & Wellness */}
                    <Route path="/wellness" element={<ProtectedRoute><Wellness /></ProtectedRoute>} />
                    <Route path="/health-twin" element={<ProtectedRoute><HealthTwin /></ProtectedRoute>} />
                    <Route path="/emotional-health" element={<ProtectedRoute><EmotionalHealth /></ProtectedRoute>} />
                    
                    {/* Community & Communication */}
                    <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
                    <Route path="/communication-systems" element={<ProtectedRoute><CommunicationSystems /></ProtectedRoute>} />
                    
                    {/* Emergency & Safety */}
                    <Route path="/emergency" element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
                    <Route path="/ward" element={<ProtectedRoute><Ward /></ProtectedRoute>} />
                    
                    {/* Documents & Records */}
                    <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
                    
                    {/* Pharmacy */}
                    <Route path="/pharmacy" element={<ProtectedRoute><Layout><Pharmacy /></Layout></ProtectedRoute>} />
                    
                    {/* AI & Advanced Features */}
                    <Route path="/advanced-ai-diagnostics" element={<ProtectedRoute><AdvancedAIDiagnostics /></ProtectedRoute>} />
                    <Route path="/clinical-decision-support" element={<ProtectedRoute><Layout><ClinicalDecisionSupport /></Layout></ProtectedRoute>} />
                    <Route path="/predictive-clinical-ai" element={<ProtectedRoute><Layout><PredictiveClinicalAI /></Layout></ProtectedRoute>} />
                    <Route path="/treatment-protocol-ai" element={<ProtectedRoute><Layout><TreatmentProtocolAI /></Layout></ProtectedRoute>} />
                    <Route path="/advanced-workflow-ai" element={<ProtectedRoute><Layout><AdvancedWorkflowAI /></Layout></ProtectedRoute>} />
                    <Route path="/workflow-automation-ai" element={<ProtectedRoute><Layout><WorkflowAutomationAI /></Layout></ProtectedRoute>} />
                    <Route path="/process-optimization-ai" element={<ProtectedRoute><Layout><ProcessOptimizationAI /></Layout></ProtectedRoute>} />
                    <Route path="/content-engagement-ai" element={<ProtectedRoute><Layout><ContentEngagementAI /></Layout></ProtectedRoute>} />
                    <Route path="/emotional-retention-ai" element={<ProtectedRoute><Layout><EmotionalRetentionAI /></Layout></ProtectedRoute>} />
                    <Route path="/natural-language-processing" element={<ProtectedRoute><NaturalLanguageProcessing /></ProtectedRoute>} />
                    <Route path="/predictive-maintenance-ai" element={<ProtectedRoute><PredictiveMaintenanceAI /></ProtectedRoute>} />
                    
                    {/* Administration & Management */}
                    <Route path="/billing" element={<ProtectedRoute><Layout><Billing /></Layout></ProtectedRoute>} />
                    <Route path="/hr" element={<ProtectedRoute><Layout><HRManagement /></Layout></ProtectedRoute>} />
                    <Route path="/hr-analytics" element={<ProtectedRoute><Layout><HRAnalytics />
                    <Route path="/insurance" element={<ProtectedRoute><Layout><Insurance /></Layout></ProtectedRoute>} />
                    <Route path="/tpa" element={<ProtectedRoute><Layout><TPA /></Layout></ProtectedRoute>} />
                    <Route path="/visitor-control" element={<ProtectedRoute><Layout><VisitorControl /></Layout></ProtectedRoute>} />
                    
                    {/* Analytics */}
                    <Route path="/hospital-analytics" element={<ProtectedRoute><Layout><HospitalAnalytics /></Layout></ProtectedRoute>} />
                    <Route path="/clinical-analytics" element={<ProtectedRoute><Layout><ClinicalAnalytics /></Layout></ProtectedRoute>} />
                    
                    {/* Research & Development */}
                    <Route path="/advanced-research-tools" element={<ProtectedRoute><Layout><AdvancedResearchTools /></Layout></ProtectedRoute>} />
                    <Route path="/research-data-management" element={<ProtectedRoute><Layout><ResearchDataManagement /></Layout></ProtectedRoute>} />
                    <Route path="/clinical-optimization" element={<ProtectedRoute><Layout><ClinicalOptimization /></Layout></ProtectedRoute>} />
                    
                    {/* Quality & Compliance */}
                    <Route path="/quality-assurance" element={<ProtectedRoute><QualityAssurance /></ProtectedRoute>} />
                    <Route path="/compliance-management" element={<ProtectedRoute><ComplianceManagement /></ProtectedRoute>} />
                    <Route path="/safety-compliance-ai" element={<ProtectedRoute><Layout><SafetyComplianceAI /></Layout></ProtectedRoute>} />
                    <Route path="/risk-management" element={<ProtectedRoute><RiskManagement /></ProtectedRoute>} />
                    <Route path="/bio-waste-management" element={<ProtectedRoute><Layout><BioWasteManagement /></Layout></ProtectedRoute>} />
                    
                    {/* Technology & Integration */}
                    <Route path="/device-integration" element={<ProtectedRoute><DeviceIntegration /></ProtectedRoute>} />
                    <Route path="/system-integration" element={<ProtectedRoute><SystemIntegration /></ProtectedRoute>} />
                    <Route path="/advanced-security-features" element={<ProtectedRoute><AdvancedSecurityFeatures /></ProtectedRoute>} />
                    <Route path="/advanced-access-control" element={<ProtectedRoute><AdvancedAccessControl /></ProtectedRoute>} />
                    <Route path="/data-governance" element={<ProtectedRoute><DataGovernance /></ProtectedRoute>} />
                    <Route path="/cross-platform-compatibility" element={<ProtectedRoute><CrossPlatformCompatibility /></ProtectedRoute>} />
                    
                    {/* Mobile & UI */}
                    <Route path="/advanced-mobile-features" element={<ProtectedRoute><AdvancedMobileFeatures /></ProtectedRoute>} />
                    <Route path="/mobile-optimization" element={<ProtectedRoute><MobileOptimization /></ProtectedRoute>} />
                    <Route path="/advanced-ui" element={<ProtectedRoute><AdvancedUI /></ProtectedRoute>} />
                    
                    {/* Performance & Monitoring */}
                    <Route path="/performance-monitoring" element={<ProtectedRoute><PerformanceMonitoring /></ProtectedRoute>} />
                    <Route path="/performance-optimization" element={<ProtectedRoute><PerformanceOptimization /></ProtectedRoute>} />
                    <Route path="/system-maintenance" element={<ProtectedRoute><SystemMaintenance /></ProtectedRoute>} />
                    <Route path="/scalability-management" element={<ProtectedRoute><ScalabilityManagement /></ProtectedRoute>} />
                    
                    {/* Automation & Optimization */}
                    <Route path="/advanced-automation" element={<ProtectedRoute><AdvancedAutomation /></ProtectedRoute>} />
                    <Route path="/intelligent-content" element={<ProtectedRoute><IntelligentContent /></ProtectedRoute>} />
                    <Route path="/engagement" element={<ProtectedRoute><Engagement /></ProtectedRoute>} />
                    
                    {/* Specialized Services */}
                    <Route path="/patient-journey" element={<ProtectedRoute><PatientJourney /></ProtectedRoute>} />
                    <Route path="/public-health-integration" element={<ProtectedRoute><Layout><PublicHealthIntegration /></Layout></ProtectedRoute>} />
                    <Route path="/profile-management" element={<ProtectedRoute><ProfileManagement /></ProtectedRoute>} />
                  </Routes>
                </Suspense>
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
