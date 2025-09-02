import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import CustomPlan from "./pages/CustomPlan";
import Dashboard from "./pages/Dashboard";
import HealthPlan from "./pages/HealthPlan";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Paywall from "./pages/Paywall";
import Subscription from "./pages/Subscription";
import AIHealthAssistantDemo from "./pages/AIHealthAssistantDemo";

import { WelcomeScreen } from "./components/WelcomeScreen";
import { AuthCallback } from "./components/auth/AuthCallback";

// Robust ProtectedRoute
const ProtectedRoute = ({
  children,
  requireOnboardingComplete = false,
}: {
  children: React.ReactNode;
  requireOnboardingComplete?: boolean;
}) => {
  const { user, profile, loading, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  if (!profile) {
    return null; // or a loading spinner
  }
  if (requireOnboardingComplete && !profile.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }
  if (
    !requireOnboardingComplete &&
    profile.onboarding_completed &&
    location.pathname === "/onboarding"
  ) {
    return <Navigate to="/custom-plan" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<AuthCallback />} />
        
        {/* Protected Routes */}
        <Route
          path="/welcome-screen"
          element={
            <ProtectedRoute>
              <WelcomeScreen />
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
          path="/custom-plan"
          element={
            <ProtectedRoute requireOnboardingComplete={true}>
              <CustomPlan />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/paywall"
          element={
            <ProtectedRoute requireOnboardingComplete={true}>
              <Paywall />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/subscription"
          element={
            <ProtectedRoute requireOnboardingComplete={true}>
              <Subscription />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireOnboardingComplete={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/health-plan"
          element={
            <ProtectedRoute requireOnboardingComplete={true}>
              <HealthPlan />
            </ProtectedRoute>
          }
        />
        
        {/* AI Health Assistant Demo Route */}
        <Route
          path="/ai-health-assistant-demo"
          element={
            <ProtectedRoute requireOnboardingComplete={true}>
              <AIHealthAssistantDemo />
            </ProtectedRoute>
          }
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
