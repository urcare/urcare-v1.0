import { BrowserRouter, Route, Routes } from "react-router-dom";
import RazorpayTestPage from "./components/payment/RazorpayTestPage";
import { AuthProvider } from "./contexts/AuthContext";
import { useSafariMobileFix } from "./hooks/useSafariMobileFix";
import Camera from "./pages/Camera";
import Dashboard from "./pages/Dashboard";
import Diet from "./pages/Diet";
import EnhancedPlanner from "./pages/EnhancedPlanner";
import Goals from "./pages/Goals";
import HealthAssessment from "./pages/HealthAssessment";
import HealthPlan from "./pages/HealthPlan";
import Landing from "./pages/Landing";
import Legal from "./pages/Legal";
import Onboarding from "./pages/Onboarding";
import Paywall from "./pages/Paywall";
import PhonePeSuccess from "./pages/PhonePeSuccess";
import PlanDetails from "./pages/PlanDetails";
import ProfileManagement from "./pages/ProfileManagement";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription";
import TasksDemo from "./pages/TasksDemo";
import Workout from "./pages/Workout";

import { DevRedirectHandler } from "./components/DevRedirectHandler";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { InitialRouteHandler } from "./components/InitialRouteHandler";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { AuthCallback } from "./components/auth/AuthCallback";

function App() {
  // Apply Safari mobile fixes
  useSafariMobileFix();

  return (
    <AuthProvider>
      <BrowserRouter>
        <DevRedirectHandler />
        <InitialRouteHandler />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<AuthCallback />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/tasks-demo" element={<TasksDemo />} />
          <Route path="/razorpay-test" element={<RazorpayTestPage />} />
          <Route path="/legal" element={<Legal />} />

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

          <Route path="/payment/phonepe/success" element={<PhonePeSuccess />} />

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
                <ErrorBoundary>
                  <Camera />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />

          <Route
            path="/plan-details"
            element={
              <ProtectedRoute
                requireOnboardingComplete={true}
                requireSubscription={false}
              >
                <ErrorBoundary>
                  <PlanDetails />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />

          <Route
            path="/goals"
            element={
              <ProtectedRoute
                requireOnboardingComplete={true}
                requireSubscription={true}
              >
                <Goals />
              </ProtectedRoute>
            }
          />

          <Route
            path="/progress"
            element={
              <ProtectedRoute
                requireOnboardingComplete={true}
                requireSubscription={true}
              >
                <Progress />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute
                requireOnboardingComplete={true}
                requireSubscription={false}
              >
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile-management"
            element={
              <ProtectedRoute
                requireOnboardingComplete={true}
                requireSubscription={false}
              >
                <ProfileManagement />
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
