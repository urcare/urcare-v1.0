import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSafariMobileFix } from "./hooks/useSafariMobileFix";
import RouteGuard from "./components/RouteGuard";

const Landing = React.lazy(() => import("./pages/Landing"));
const Welcome = React.lazy(() => import("./pages/Welcome"));
const Onboarding = React.lazy(() => import("./pages/Onboarding"));
const HealthAssessment = React.lazy(() => import("./pages/HealthAssessment"));
const Paywall = React.lazy(() => import("./pages/Paywall"));
const PaymentSuccess = React.lazy(() => import("./pages/PaymentSuccess"));
const Dashboard = React.lazy(() => import("./pages/SimpleDashboard"));
const AuthCallback = React.lazy(() => import("./pages/AuthCallback"));

function App() {
  useSafariMobileFix();

  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-app-bg">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-logo-text border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading...</p>
          </div>
        </div>
      }>
        <Routes>
          {/* Public routes - no auth required */}
          <Route path="/" element={
            <RouteGuard requiredAuth={false} allowedPaths={['/']}>
              <Landing />
            </RouteGuard>
          } />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Protected routes - auth required */}
          <Route path="/welcome" element={
            <RouteGuard requiredAuth={true}>
              <Welcome />
            </RouteGuard>
          } />
          <Route path="/onboarding" element={
            <RouteGuard requiredAuth={true}>
              <Onboarding />
            </RouteGuard>
          } />
          <Route path="/health-assessment" element={
            <RouteGuard requiredAuth={true}>
              <HealthAssessment />
            </RouteGuard>
          } />
          <Route path="/paywall" element={
            <RouteGuard requiredAuth={true}>
              <Paywall />
            </RouteGuard>
          } />
          <Route path="/payment-success" element={
            <RouteGuard requiredAuth={true}>
              <PaymentSuccess />
            </RouteGuard>
          } />
          <Route path="/dashboard" element={
            <RouteGuard requiredAuth={true}>
              <Dashboard />
            </RouteGuard>
          } />
          
          {/* Fallback */}
          <Route path="*" element={
            <RouteGuard requiredAuth={false} allowedPaths={['/']}>
              <Landing />
            </RouteGuard>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;