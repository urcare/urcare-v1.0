import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import HospitalAnalytics from './pages/HospitalAnalytics';
import ClinicalAnalytics from './pages/ClinicalAnalytics';
import HRAnalytics from './pages/HRAnalytics';
import DataSecurityCompliance from './pages/DataSecurityCompliance';
import RiskAssessmentManagement from './pages/RiskAssessmentManagement';
import AccessControl from './pages/AccessControl';
import DataGovernance from './pages/DataGovernance';
import AIAdoptionRoadmap from './pages/AIAdoptionRoadmap';
import AIDiagnostics from './pages/AIDiagnostics';
import PredictiveMaintenance from './pages/PredictiveMaintenance';
import NaturalLanguageProcessing from './pages/NaturalLanguageProcessing';
import AdvancedAutomation from './pages/AdvancedAutomation';
import TelemedicineSolutions from './pages/TelemedicineSolutions';
import PediatricCare from './pages/PediatricCare';
import MentalHealthSupport from './pages/MentalHealthSupport';
import GeriatricCare from './pages/GeriatricCare';
import OncologyCare from './pages/OncologyCare';
import EmergencyMedicine from './pages/EmergencyMedicine';
import SurgicalServices from './pages/SurgicalServices';
import RehabilitationServices from './pages/RehabilitationServices';
import MobileHealthSolutions from './pages/MobileHealthSolutions';
import WasteManagement from './pages/WasteManagement';
import SecurityAudits from './pages/SecurityAudits';
import ComplianceTraining from './pages/ComplianceTraining';
import PerformanceOptimization from './pages/PerformanceOptimization';
import { QueryClient } from '@tanstack/react-query';
import PerformanceMonitoring from './pages/PerformanceMonitoring';

function App() {
  return (
    <QueryClient>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Toaster />
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/hospital-analytics" element={<HospitalAnalytics />} />
              <Route path="/clinical-analytics" element={<ClinicalAnalytics />} />
              <Route path="/hr-analytics" element={<HRAnalytics />} />
              <Route path="/data-security-compliance" element={<DataSecurityCompliance />} />
              <Route path="/risk-assessment-management" element={<RiskAssessmentManagement />} />
              <Route path="/access-control" element={<AccessControl />} />
              <Route path="/data-governance" element={<DataGovernance />} />
              <Route path="/ai-adoption-roadmap" element={<AIAdoptionRoadmap />} />
              <Route path="/ai-diagnostics" element={<AIDiagnostics />} />
              <Route path="/predictive-maintenance" element={<PredictiveMaintenance />} />
              <Route path="/natural-language-processing" element={<NaturalLanguageProcessing />} />
              <Route path="/advanced-automation" element={<AdvancedAutomation />} />
              <Route path="/telemedicine-solutions" element={<TelemedicineSolutions />} />
              <Route path="/pediatric-care" element={<PediatricCare />} />
              <Route path="/mental-health-support" element={<MentalHealthSupport />} />
              <Route path="/geriatric-care" element={<GeriatricCare />} />
              <Route path="/oncology-care" element={<OncologyCare />} />
              <Route path="/emergency-medicine" element={<EmergencyMedicine />} />
              <Route path="/surgical-services" element={<SurgicalServices />} />
              <Route path="/rehabilitation-services" element={<RehabilitationServices />} />
              <Route path="/mobile-health-solutions" element={<MobileHealthSolutions />} />
              <Route path="/waste-management" element={<WasteManagement />} />
              <Route path="/security-audits" element={<SecurityAudits />} />
              <Route path="/compliance-training" element={<ComplianceTraining />} />
              <Route path="/performance-optimization" element={<PerformanceOptimization />} />
              <Route path="/performance-monitoring" element={<PerformanceMonitoring />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClient>
  );
}

export default App;
