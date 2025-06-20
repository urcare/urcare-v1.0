
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import './App.css';

// Lazy load components for better performance - using correct syntax for named exports
const Dashboard = lazy(() => import('@/components/Dashboard').then(module => ({ default: module.Dashboard || module.default })));
const PatientDashboardLayout = lazy(() => import('@/components/patient/PatientDashboardLayout').then(module => ({ default: module.PatientDashboardLayout || module.default })));
const Appointments = lazy(() => import('@/pages/Appointments'));
const Documents = lazy(() => import('@/pages/Documents'));
const Emergency = lazy(() => import('@/pages/Emergency'));
const Community = lazy(() => import('@/pages/Community'));
const MentalHealth = lazy(() => import('@/pages/MentalHealth'));

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Router>
            <SidebarProvider>
              <div className="min-h-screen flex w-full">
                <AppSidebar />
                <div className="flex-1">
                  <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
                    <Routes>
                      {/* Main Dashboard */}
                      <Route path="/" element={<Dashboard />} />
                      
                      {/* Patient Dashboard */}
                      <Route path="/patient-dashboard/*" element={<PatientDashboardLayout />} />
                      
                      {/* Core Pages */}
                      <Route path="/appointments" element={<Appointments />} />
                      <Route path="/documents" element={<Documents />} />
                      <Route path="/emergency" element={<Emergency />} />
                      <Route path="/community" element={<Community />} />
                      <Route path="/mental-health" element={<MentalHealth />} />
                      
                      {/* Auth & Settings */}
                      <Route path="/auth" element={<div className="p-6">Authentication Page</div>} />
                      <Route path="/settings" element={<div className="p-6">Settings Page</div>} />
                      <Route path="/profile" element={<div className="p-6">Profile Page</div>} />
                      
                      {/* Analytics & Reporting */}
                      <Route path="/analytics" element={<div className="p-6">Analytics Dashboard</div>} />
                      
                      {/* Clinical & Medical */}
                      <Route path="/pharmacy" element={<div className="p-6">Pharmacy Management</div>} />
                      <Route path="/billing" element={<div className="p-6">Billing Dashboard</div>} />
                      <Route path="/hr" element={<div className="p-6">HR Management</div>} />
                      <Route path="/records" element={<div className="p-6">Health Records</div>} />
                      
                      {/* Telemedicine */}
                      <Route path="/teleconsult" element={<div className="p-6">Teleconsultation</div>} />
                      
                      {/* Specialized Departments */}
                      <Route path="/oncology" element={<div className="p-6">Oncology Care</div>} />
                      <Route path="/pediatric" element={<div className="p-6">Pediatric Care</div>} />
                      <Route path="/geriatric" element={<div className="p-6">Geriatric Care</div>} />
                      <Route path="/rehabilitation" element={<div className="p-6">Rehabilitation Services</div>} />
                      
                      {/* Research & Development */}
                      <Route path="/research" element={<div className="p-6">Research Dashboard</div>} />
                      <Route path="/clinical-trials" element={<div className="p-6">Clinical Trials</div>} />
                      
                      {/* System Management */}
                      <Route path="/admin" element={<div className="p-6">Admin Dashboard</div>} />
                      <Route path="/compliance" element={<div className="p-6">Compliance Management</div>} />
                      <Route path="/security" element={<div className="p-6">Security Dashboard</div>} />
                      
                      {/* Laboratory & Diagnostics */}
                      <Route path="/lims" element={<div className="p-6">Lab Management</div>} />
                      <Route path="/pathology" element={<div className="p-6">Pathology Services</div>} />
                      <Route path="/imaging" element={<div className="p-6">Medical Imaging</div>} />
                      
                      {/* Operations */}
                      <Route path="/quality" element={<div className="p-6">Quality Management</div>} />
                      
                      {/* AI & Analytics */}
                      <Route path="/ai-diagnostics" element={<div className="p-6">AI-powered Diagnostics</div>} />
                      
                      {/* Communication */}
                      <Route path="/messaging" element={<div className="p-6">Messaging & Communication</div>} />
                      <Route path="/public-health" element={<div className="p-6">Public Health Initiatives</div>} />
                      
                      {/* Technology & Security */}
                      <Route path="/integration" element={<div className="p-6">System Integrations</div>} />
                      <Route path="/performance" element={<div className="p-6">System Performance</div>} />
                      <Route path="/mobile" element={<div className="p-6">Mobile App Management</div>} />
                      
                      {/* Data & Governance */}
                      <Route path="/data-governance" element={<div className="p-6">Data Management & Governance</div>} />
                      <Route path="/backup" element={<div className="p-6">Data Backup Systems</div>} />
                      <Route path="/process-optimization" element={<div className="p-6">Workflow Optimization</div>} />
                      
                      {/* Catch all route */}
                      <Route path="*" element={<div className="p-6">Page Not Found</div>} />
                    </Routes>
                  </Suspense>
                </div>
              </div>
            </SidebarProvider>
          </Router>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
