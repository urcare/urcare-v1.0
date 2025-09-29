import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";
import { useSafariMobileFix } from "./hooks/useSafariMobileFix";
import AdminLogin from "./pages/AdminLogin";
import Camera from "./pages/Camera";
import Dashboard from "./pages/Dashboard";
import Diet from "./pages/Diet";
import EmailAuth from "./pages/EmailAuth";
import EmailSignIn from "./pages/EmailSignIn";
import EmailVerification from "./pages/EmailVerification";
import Goals from "./pages/Goals";
import HealthAssessment from "./pages/HealthAssessment";
import HealthPlan from "./pages/HealthPlan";
import HealthPlanGeneration from "./pages/HealthPlanGeneration";
import CustomPlan from "./pages/CustomPlan";
import Landing from "./pages/Landing";
import Legal from "./pages/Legal";
import Onboarding from "./pages/Onboarding";
import Paywall from "./pages/Paywall";
import PaymentWall from "./pages/PaymentWall";
import PhonePeSuccess from "./pages/PhonePeSuccess";
import PlanDetails from "./pages/Calendar";
import Planner from "./pages/Planner";
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
import AdminDashboard from "./components/AdminDashboard";

function App() {
  // Apply Safari mobile fixes
  useSafariMobileFix();

  return (
    <AuthProvider>
      <AdminProvider>
        <BrowserRouter>
          <DevRedirectHandler />
          <InitialRouteHandler />
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<AuthCallback />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/tasks-demo" element={<TasksDemo />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/my-admin" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/email-auth" element={<EmailAuth />} />
          <Route path="/email-signin" element={<EmailSignIn />} />
          <Route path="/email-verification" element={<EmailVerification />} />

          {/* Protected Routes */}
          <Route
            path="/welcome-screen"
            element={
              <ProtectedRoute>
                <WelcomeScreen />
              </ProtectedRoute>
            }
          />

          {/* TEMPORARY: Remove ProtectedRoute from onboarding and paywall for bypass */}
          <Route path="/onboarding" element={<Onboarding />} />

          <Route
            path="/health-assessment"
            element={
              <ProtectedRoute requireOnboardingComplete={true}>
                <HealthAssessment />
              </ProtectedRoute>
            }
          />

          <Route path="/paywall" element={<Paywall />} />

          <Route
            path="/payment-wall"
            element={
              <ProtectedRoute requireOnboardingComplete={true}>
                <PaymentWall />
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
            path="/health-plan-generation"
            element={
              <ProtectedRoute
                requireOnboardingComplete={true}
                requireSubscription={false}
              >
                <HealthPlanGeneration />
              </ProtectedRoute>
            }
          />

          <Route
            path="/custom-plan"
            element={
              <ProtectedRoute
                requireOnboardingComplete={true}
                requireSubscription={false}
              >
                <CustomPlan />
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
                <Planner />
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
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
