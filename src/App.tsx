
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import ProfileManagement from "./pages/ProfileManagement";
import HealthTwin from "./pages/HealthTwin";
import EmotionalHealth from "./pages/EmotionalHealth";
import Appointments from "./pages/Appointments";
import Documents from "./pages/Documents";
import IntelligentContent from "./pages/IntelligentContent";
import Engagement from "./pages/Engagement";
import Wellness from "./pages/Wellness";
import Unauthorized from "./pages/Unauthorized";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile-management" 
              element={
                <ProtectedRoute>
                  <ProfileManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/health-twin" 
              element={
                <ProtectedRoute>
                  <HealthTwin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/emotional-health" 
              element={
                <ProtectedRoute>
                  <EmotionalHealth />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/appointments" 
              element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/documents" 
              element={
                <ProtectedRoute>
                  <Documents />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/content" 
              element={
                <ProtectedRoute>
                  <IntelligentContent />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/engagement" 
              element={
                <ProtectedRoute>
                  <Engagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wellness" 
              element={
                <ProtectedRoute>
                  <Wellness />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
