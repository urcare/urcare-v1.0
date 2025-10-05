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
import Performance from "./pages/Performance";
import CustomPlan from "./pages/CustomPlan";
import Landing from "./pages/Landing";
import Legal from "./pages/Legal";
import Onboarding from "./pages/Onboarding";
import OnboardingHealthAssessment from "./pages/OnboardingHealthAssessment";
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
import Pay from "./pages/Pay";
import Paycheckout from "./pages/Paycheckout";
import MyAdmin from "./pages/MyAdmin";
import PhonePeTestPage from "./pages/PhonePeTestPage";
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

import ErrorBoundary from "./components/ErrorBoundary";
import { CleanProtectedRoute } from "./components/CleanProtectedRoute";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { CleanAuthCallback } from "./components/auth/CleanAuthCallback";
import { SmartRouteHandler } from "./components/SmartRouteHandler";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  // Apply Safari mobile fixes
  useSafariMobileFix();
  
  // Force rebuild - using CleanProtectedRoute instead of old ProtectedRoute
  // Build timestamp: 2024-01-15 - Fixed React Hooks errors
  // Cache bust: 2024-01-15-10:36 - Force fresh build

  return (
    <AuthProvider>
      <AdminProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <SmartRouteHandler />
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<CleanAuthCallback />} />
          <Route path="/auth/callback" element={<CleanAuthCallback />} />
          <Route path="/tasks-demo" element={<TasksDemo />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/my-admin" element={<MyAdmin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/email-auth" element={<EmailAuth />} />
          <Route path="/email-signin" element={<EmailSignIn />} />
          <Route path="/email-verification" element={<EmailVerification />} />

          {/* Protected Routes */}
          <Route
            path="/welcome-screen"
            element={
              <CleanProtectedRoute>
                <WelcomeScreen />
              </CleanProtectedRoute>
            }
          />

          <Route
            path="/onboarding"
            element={
              <CleanProtectedRoute>
                <Onboarding />
              </CleanProtectedRoute>
            }
          />

          <Route
            path="/onboarding-healthassessment-screen"
            element={
              <CleanProtectedRoute>
                <OnboardingHealthAssessment />
              </CleanProtectedRoute>
            }
          />

          <Route
            path="/health-assessment"
            element={
              <CleanProtectedRoute requireOnboardingComplete={false}>
                <HealthAssessment />
              </CleanProtectedRoute>
            }
          />

          <Route
            path="/paywall"
            element={
              <CleanProtectedRoute requireOnboardingComplete={true}>
                <Paywall />
              </CleanProtectedRoute>
            }
          />

          <Route
            path="/payment-wall"
            element={
              <CleanProtectedRoute requireOnboardingComplete={true}>
                <PaymentWall />
              </CleanProtectedRoute>
            }
          />

          <Route
            path="/paymentpage"
            element={
              <CleanProtectedRoute requireOnboardingComplete={true}>
                <PaymentPage />
              </CleanProtectedRoute>
            }
          />

          <Route
            path="/phonecheckout"
            element={
              <CleanProtectedRoute requireOnboardingComplete={true}>
                <PhonePeCheckout />
              </CleanProtectedRoute>
            }
          />

          <Route
            path="/paycheckout"
            element={
              <CleanProtectedRoute requireOnboardingComplete={true}>
                <Paycheckout />
              </CleanProtectedRoute>
            }
          />

                  <Route
                    path="/phonecheckout/result"
                    element={
                      <CleanProtectedRoute requireOnboardingComplete={true}>
                        <PaymentResult />
                      </CleanProtectedRoute>
                    }
                  />
                  <Route
                    path="/payment/success"
                    element={
                      <CleanProtectedRoute requireOnboardingComplete={false}>
                        <PaymentSuccess />
                      </CleanProtectedRoute>
                    }
                  />
                  <Route
                    path="/mock-phonepe-payment"
                    element={
                      <CleanProtectedRoute requireOnboardingComplete={false}>
                        <MockPhonePePayment />
                      </CleanProtectedRoute>
                    }
                  />
                  <Route
                    path="/phonepe-qr-fallback"
                    element={
                      <CleanProtectedRoute requireOnboardingComplete={false}>
                        <PhonePeQRFallbackPage />
                      </CleanProtectedRoute>
                    }
                  />

                  {/* Test route for PhonePe page - remove in production */}
                  <Route
                    path="/test-phonepe"
                    element={
                      <CleanProtectedRoute requireOnboardingComplete={true}>
                        <PhonePeCheckout />
                      </CleanProtectedRoute>
                    }
                  />

                  <Route
                    path="/phonepe-test"
                    element={
                      <CleanProtectedRoute requireOnboardingComplete={false}>
                        <PhonePeTest />
                      </CleanProtectedRoute>
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
              <CleanProtectedRoute requireOnboardingComplete={true}>
                <Subscription />
              </CleanProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <CleanProtectedRoute requireOnboardingComplete={true}>
                <Dashboard />
              </CleanProtectedRoute>
            }
          />

          <Route
            path="/health-plan"
            element={
              <CleanProtectedRoute requireOnboardingComplete={true}>
                <HealthPlan />
              </CleanProtectedRoute>
            }
          />

          <Route
            path="/health-plan-generation"
            element={
              <CleanProtectedRoute requireOnboardingComplete={true}>
                <HealthPlanGeneration />
              </CleanProtectedRoute>
            }
          />

          <Route
            path="/my-admin"
            element={<AdminPanel />}
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
            path="/pay"
            element={<Pay />}
          />

          <Route
            path="/phonepe-test"
            element={<PhonePeTestPage />}
          />

          <Route
            path="/custom-plan"
            element={
              <CleanProtectedRoute requireOnboardingComplete={true}>
                <CustomPlan />
              </CleanProtectedRoute>
            }
          />

          <Route
            path="/diet"
            element={
              <CleanProtectedRoute requireOnboardingComplete={true}>
                <Diet />
              </CleanProtectedRoute>
            }
          />

          <Route
            path="/workout"
            element={
              <CleanProtectedRoute requireOnboardingComplete={true}>
                <Workout />
              </CleanProtectedRoute>
            }
          />

          <Route
            path="/planner"
            element={
              <CleanProtectedRoute requireOnboardingComplete={true}>
                <Planner />
              </CleanProtectedRoute>
            }
          />

          <Route
            path="/camera"
            element={
              <CleanProtectedRoute requireOnboardingComplete={true}>
                <ErrorBoundary>
                  <Camera />
                </ErrorBoundary>
              </CleanProtectedRoute>
            }
          />

          <Route
            path="/plan-details"
            element={
              <CleanProtectedRoute requireOnboardingComplete={true}>
                <ErrorBoundary>
                  <PlanDetails />
                </ErrorBoundary>
              </CleanProtectedRoute>
            }
          />

          <Route
            path="/goals"
            element={
              <CleanProtectedRoute requireOnboardingComplete={true}>
                <Goals />
              </CleanProtectedRoute>
            }
          />

          <Route
            path="/progress"
            element={
              <CleanProtectedRoute requireOnboardingComplete={true}>
                <Progress />
              </CleanProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <CleanProtectedRoute requireOnboardingComplete={true}>
                <Settings />
              </CleanProtectedRoute>
            }
          />

          <Route
            path="/profile-management"
            element={
              <CleanProtectedRoute requireOnboardingComplete={true}>
                <ProfileManagement />
              </CleanProtectedRoute>
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
