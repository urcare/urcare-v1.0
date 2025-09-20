import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Calendar from "./pages/Calendar";
import Camera from "./pages/Camera";
import Dashboard from "./pages/Dashboard";
import Diet from "./pages/Diet";
import EnhancedPlanner from "./pages/EnhancedPlanner";
import HealthAssessment from "./pages/HealthAssessment";
import HealthPlan from "./pages/HealthPlan";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Paywall from "./pages/Paywall";
import Subscription from "./pages/Subscription";
import Workout from "./pages/Workout";

import { DevPanel } from "./components/DevPanel";
import { DevRedirectHandler } from "./components/DevRedirectHandler";
import { InitialRouteHandler } from "./components/InitialRouteHandler";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { TestComprehensiveHealthPlan } from "./components/TestComprehensiveHealthPlan";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { AuthCallback } from "./components/auth/AuthCallback";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <DevRedirectHandler />
        <DevPanel />
        <InitialRouteHandler />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<AuthCallback />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

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
            path="/health-assessment"
            element={
              <ProtectedRoute requireOnboardingComplete={true}>
                <HealthAssessment />
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
              <ProtectedRoute
                requireOnboardingComplete={true}
                requireSubscription={true}
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/health-plan"
            element={
              <ProtectedRoute
                requireOnboardingComplete={true}
                requireSubscription={true}
              >
                <HealthPlan />
              </ProtectedRoute>
            }
          />

          <Route
            path="/diet"
            element={
              <ProtectedRoute
                requireOnboardingComplete={true}
                requireSubscription={true}
              >
                <Diet />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workout"
            element={
              <ProtectedRoute
                requireOnboardingComplete={true}
                requireSubscription={true}
              >
                <Workout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/planner"
            element={
              <ProtectedRoute
                requireOnboardingComplete={true}
                requireSubscription={true}
              >
                <EnhancedPlanner />
              </ProtectedRoute>
            }
          />

          <Route
            path="/camera"
            element={
              <ProtectedRoute
                requireOnboardingComplete={true}
                requireSubscription={false}
              >
                <Camera />
              </ProtectedRoute>
            }
          />

          <Route
            path="/calendar"
            element={
              <ProtectedRoute
                requireOnboardingComplete={true}
                requireSubscription={true}
              >
                <Calendar />
              </ProtectedRoute>
            }
          />

          {/* Test Route - Remove in production */}
          <Route
            path="/test-comprehensive-health-plan"
            element={<TestComprehensiveHealthPlan />}
          />

          {/* Catch all route */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
