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
import ArshAdmin from "./pages/ArshAdmin";
import Performance from "./pages/Performance";
import CustomPlan from "./pages/CustomPlan";
import Landing from "./pages/Landing";
import Legal from "./pages/Legal";
import Onboarding from "./pages/Onboarding";
import Paywall from "./pages/Paywall";
import PaymentPage from "./pages/PaymentPage";
import PaymentWall from "./pages/PaymentWall";
import PhonePeCheckout from "./pages/PhonePeCheckout";
import PaymentResult from "./pages/PaymentResult";
import PaymentSuccess from "./pages/PaymentSuccess";
import MockPhonePePayment from "./pages/MockPhonePePayment";
import PhonePeQRFallbackPage from "./pages/PhonePeQRFallbackPage";
import PhonePeTest from "./pages/PhonePeTest";
import PhonePeCheckoutSimple from "./pages/PhonePeCheckoutSimple";
import PhonePeSuccess from "./pages/PhonePeSuccess";
import PlanDetails from "./pages/Calendar";
import Planner from "./pages/Planner";
import ProfileManagement from "./pages/ProfileManagement";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription";
import TasksDemo from "./pages/TasksDemo";
import Workout from "./pages/Workout";
import WorkoutDashboard from "./pages/WorkoutDashboard";
import WorkoutActivity from "./pages/WorkoutActivity";
import AdminPanel from "./pages/AdminPanel";

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
            path="/payment-wall"
            element={
              <ProtectedRoute requireOnboardingComplete={true}>
                <PaymentWall />
              </ProtectedRoute>
            }
          />

          <Route
            path="/paymentpage"
            element={
              <ProtectedRoute requireOnboardingComplete={true}>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/phonecheckout"
            element={
              <ProtectedRoute requireOnboardingComplete={true}>
                <PhonePeCheckout />
              </ProtectedRoute>
            }
          />

                  <Route
                    path="/phonecheckout/result"
                    element={
                      <ProtectedRoute requireOnboardingComplete={true}>
                        <PaymentResult />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/payment/success"
                    element={
                      <ProtectedRoute requireOnboardingComplete={false}>
                        <PaymentSuccess />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/mock-phonepe-payment"
                    element={
                      <ProtectedRoute requireOnboardingComplete={false}>
                        <MockPhonePePayment />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/phonepe-qr-fallback"
                    element={
                      <ProtectedRoute requireOnboardingComplete={false}>
                        <PhonePeQRFallbackPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Test route for PhonePe page - remove in production */}
                  <Route
                    path="/test-phonepe"
                    element={
                      <ProtectedRoute requireOnboardingComplete={true}>
                        <PhonePeCheckout />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/phonepe-test"
                    element={
                      <ProtectedRoute requireOnboardingComplete={false}>
                        <PhonePeTest />
                      </ProtectedRoute>
                    }
                  />

                  {/* Test route without onboarding requirement */}
                  <Route
                    path="/phonepe-test-no-auth"
                    element={<PhonePeTest />}
                  />

                  {/* Simple PhonePe checkout without auth */}
                  <Route
                    path="/phonepe-simple"
                    element={<PhonePeCheckoutSimple />}
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
            path="/arshadmin"
            element={<ArshAdmin />}
          />

          <Route
            path="/performance"
            element={<Performance />}
          />

          <Route
            path="/workout-dashboard"
            element={<WorkoutDashboard />}
          />

          <Route
            path="/workout-activity"
            element={<WorkoutActivity />}
          />

          <Route
            path="/arshadmin"
            element={<AdminPanel />}
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
