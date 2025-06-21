
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoleBasedRoute } from "@/components/auth/RoleBasedRoute";
import { ThemeProvider } from "next-themes";

// Import all pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Unauthorized from "./pages/Unauthorized";
import PatientDashboard from "./pages/PatientDashboard";
import HRManagement from "./pages/HRManagement";
import Billing from "./pages/Billing";
import LIMS from "./pages/LIMS";
import Insurance from "./pages/Insurance";
import Community from "./pages/Community";
import Appointments from "./pages/Appointments";
import Engagement from "./pages/Engagement";

// Import AI-powered pages
import AIInsights from "./pages/AIInsights";
import DocumentIntelligence from "./pages/DocumentIntelligence";
import SmartReminders from "./pages/SmartReminders";
import HealthAssistant from "./pages/HealthAssistant";

// Import enhanced feature pages
import FamilyHub from "./pages/FamilyHub";
import EmergencyCenter from "./pages/EmergencyCenter";
import WellnessTracking from "./pages/WellnessTracking";
import MedicationManagement from "./pages/MedicationManagement";
import AppointmentsEnhanced from "./pages/AppointmentsEnhanced";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Patient routes */}
                <Route 
                  path="/dashboard/patient" 
                  element={
                    <RoleBasedRoute allowedRoles={['patient']}>
                      <PatientDashboard />
                    </RoleBasedRoute>
                  } 
                />

                {/* Doctor routes */}
                <Route 
                  path="/dashboard/doctor" 
                  element={
                    <RoleBasedRoute allowedRoles={['doctor']}>
                      <div className="p-6">
                        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
                        <p className="text-muted-foreground mt-2">Welcome to your medical practice management system</p>
                      </div>
                    </RoleBasedRoute>
                  } 
                />

                {/* Admin routes */}
                <Route 
                  path="/dashboard/admin" 
                  element={
                    <RoleBasedRoute allowedRoles={['admin']}>
                      <div className="p-6">
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-muted-foreground mt-2">System administration and management</p>
                      </div>
                    </RoleBasedRoute>
                  } 
                />

                {/* HR Management - Admin only */}
                <Route 
                  path="/hr" 
                  element={
                    <RoleBasedRoute allowedRoles={['admin', 'hr']}>
                      <HRManagement />
                    </RoleBasedRoute>
                  } 
                />

                {/* Billing - Multiple roles */}
                <Route 
                  path="/billing" 
                  element={
                    <RoleBasedRoute allowedRoles={['admin', 'reception', 'doctor']}>
                      <Billing />
                    </RoleBasedRoute>
                  } 
                />

                {/* LIMS - Lab and admin */}
                <Route 
                  path="/lims" 
                  element={
                    <RoleBasedRoute allowedRoles={['lab', 'admin', 'doctor']}>
                      <LIMS />
                    </RoleBasedRoute>
                  } 
                />

                {/* Insurance - Admin and reception */}
                <Route 
                  path="/insurance" 
                  element={
                    <RoleBasedRoute allowedRoles={['admin', 'reception']}>
                      <Insurance />
                    </RoleBasedRoute>
                  } 
                />

                {/* Community - All authenticated users */}
                <Route 
                  path="/community" 
                  element={
                    <RoleBasedRoute allowedRoles={['patient', 'doctor', 'nurse', 'admin', 'pharmacy', 'lab', 'reception']}>
                      <Community />
                    </RoleBasedRoute>
                  } 
                />

                {/* Appointments - Patients, doctors, reception */}
                <Route 
                  path="/appointments" 
                  element={
                    <RoleBasedRoute allowedRoles={['patient', 'doctor', 'reception', 'admin']}>
                      <Appointments />
                    </RoleBasedRoute>
                  } 
                />

                {/* Engagement - All authenticated users */}
                <Route 
                  path="/engagement" 
                  element={
                    <RoleBasedRoute allowedRoles={['patient', 'doctor', 'nurse', 'admin', 'pharmacy', 'lab', 'reception']}>
                      <Engagement />
                    </RoleBasedRoute>
                  } 
                />

                {/* AI-Powered Features */}
                <Route 
                  path="/ai-insights" 
                  element={
                    <RoleBasedRoute allowedRoles={['patient', 'doctor', 'admin']}>
                      <AIInsights />
                    </RoleBasedRoute>
                  } 
                />
                <Route 
                  path="/document-intelligence" 
                  element={
                    <RoleBasedRoute allowedRoles={['patient', 'doctor', 'admin']}>
                      <DocumentIntelligence />
                    </RoleBasedRoute>
                  } 
                />
                <Route 
                  path="/smart-reminders" 
                  element={
                    <RoleBasedRoute allowedRoles={['patient', 'doctor', 'admin']}>
                      <SmartReminders />
                    </RoleBasedRoute>
                  } 
                />
                <Route 
                  path="/health-assistant" 
                  element={
                    <RoleBasedRoute allowedRoles={['patient', 'doctor', 'admin']}>
                      <HealthAssistant />
                    </RoleBasedRoute>
                  } 
                />

                {/* Enhanced Features */}
                <Route 
                  path="/family-hub" 
                  element={
                    <RoleBasedRoute allowedRoles={['patient', 'admin']}>
                      <FamilyHub />
                    </RoleBasedRoute>
                  } 
                />
                <Route 
                  path="/emergency-center" 
                  element={
                    <RoleBasedRoute allowedRoles={['patient', 'doctor', 'admin']}>
                      <EmergencyCenter />
                    </RoleBasedRoute>
                  } 
                />
                <Route 
                  path="/wellness-tracking" 
                  element={
                    <RoleBasedRoute allowedRoles={['patient', 'doctor', 'admin']}>
                      <WellnessTracking />
                    </RoleBasedRoute>
                  } 
                />
                <Route 
                  path="/medication-management" 
                  element={
                    <RoleBasedRoute allowedRoles={['patient', 'doctor',- 'pharmacy', 'admin']}>
                      <MedicationManagement />
                    </RoleBasedRoute>
                  } 
                />
                <Route 
                  path="/appointments-enhanced" 
                  element={
                    <RoleBasedRoute allowedRoles={['patient', 'doctor', 'reception', 'admin']}>
                      <AppointmentsEnhanced />
                    </RoleBasedRoute>
                  } 
                />

                {/* Nurse dashboard */}
                <Route 
                  path="/dashboard/nurse" 
                  element={
                    <RoleBasedRoute allowedRoles={['nurse']}>
                      <div className="p-6">
                        <h1 className="text-3xl font-bold">Nurse Dashboard</h1>
                        <p className="text-muted-foreground mt-2">Patient care and medical support</p>
                      </div>
                    </RoleBasedRoute>
                  } 
                />

                {/* Pharmacy dashboard */}
                <Route 
                  path="/dashboard/pharmacy" 
                  element={
                    <RoleBasedRoute allowedRoles={['pharmacy']}>
                      <div className="p-6">
                        <h1 className="text-3xl font-bold">Pharmacy Dashboard</h1>
                        <p className="text-muted-foreground mt-2">Medication management and dispensing</p>
                      </div>
                    </RoleBasedRoute>
                  } 
                />

                {/* Lab dashboard */}
                <Route 
                  path="/dashboard/lab" 
                  element={
                    <RoleBasedRoute allowedRoles={['lab']}>
                      <div className="p-6">
                        <h1 className="text-3xl font-bold">Laboratory Dashboard</h1>
                        <p className="text-muted-foreground mt-2">Test results and laboratory management</p>
                      </div>
                    </RoleBasedRoute>
                  } 
                />

                {/* Reception dashboard */}
                <Route 
                  path="/dashboard/reception" 
                  element={
                    <RoleBasedRoute allowedRoles={['reception']}>
                      <div className="p-6">
                        <h1 className="text-3xl font-bold">Reception Dashboard</h1>
                        <p className="text-muted-foreground mt-2">Patient registration and appointment management</p>
                      </div>
                    </RoleBasedRoute>
                  } 
                />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
