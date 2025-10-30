import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSafariMobileFix } from "./hooks/useSafariMobileFix";
import { AuthProvider } from "./contexts/AuthContext";
import RouteGuard from "./components/RouteGuard";
import { App as CapApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';

// Import commonly used pages directly to avoid loading screens
import Landing from "./pages/Landing";
import Welcome from "./pages/Welcome";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import AuthCallback from "./pages/AuthCallback";

// Keep less frequently used pages as lazy loaded
const HealthAssessment = React.lazy(() => import("./pages/HealthAssessment"));
const Paywall = React.lazy(() => import("./pages/Paywall"));
const PaymentSuccess = React.lazy(() => import("./pages/PaymentSuccess"));
const PaymentMonthly = React.lazy(() => import("./pages/PaymentMonthly"));
const PaymentAnnual = React.lazy(() => import("./pages/PaymentAnnual"));
const AdminPayments = React.lazy(() => import("./pages/AdminPayments"));
const Legal = React.lazy(() => import("./pages/Legal"));

function App() {
  useSafariMobileFix();

  useEffect(() => {
    // Auto-close in-app browser and route to /auth/callback
    CapApp.addListener('appUrlOpen', async ({ url }) => {
      if (url && url.startsWith('https://urrcare.vercel.app/auth/callback')) {
        await Browser.close();
        window.location.href = '/auth/callback' + (url.split('auth/callback')[1] || '');
      }
    });
    return () => {
      CapApp.removeAllListeners();
    };
  }, []);

  return (
    <AuthProvider>
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
            <Route path="/" element={<Landing />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/legal" element={<Legal />} />
            
            {/* Protected routes - auth required with routing logic */}
            <Route path="/onboarding" element={
              <RouteGuard>
                <Onboarding />
              </RouteGuard>
            } />
            <Route path="/health-assessment" element={
              <RouteGuard>
                <HealthAssessment />
              </RouteGuard>
            } />
            <Route path="/paywall" element={
              <RouteGuard>
                <Paywall />
              </RouteGuard>
            } />
            <Route path="/payment-success" element={
              <RouteGuard>
                <PaymentSuccess />
              </RouteGuard>
            } />
            <Route path="/payment/monthly" element={
              <RouteGuard requireAuth={false}>
                <PaymentMonthly />
              </RouteGuard>
            } />
            <Route path="/payment/annual" element={
              <RouteGuard requireAuth={false}>
                <PaymentAnnual />
              </RouteGuard>
            } />
            <Route path="/admin/payments" element={
              <RouteGuard>
                <AdminPayments />
              </RouteGuard>
            } />
            <Route path="/dashboard" element={
              <RouteGuard>
                <Dashboard />
              </RouteGuard>
            } />
            
            {/* Fallback to landing */}
            <Route path="*" element={<Landing />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;