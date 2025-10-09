import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSafariMobileFix } from "./hooks/useSafariMobileFix";

const Landing = React.lazy(() => import("./pages/Landing"));
const Welcome = React.lazy(() => import("./pages/Welcome"));
const Onboarding = React.lazy(() => import("./pages/Onboarding"));
const HealthAssessment = React.lazy(() => import("./pages/HealthAssessment"));
const Paywall = React.lazy(() => import("./pages/Paywall"));
const PaymentSuccess = React.lazy(() => import("./pages/PaymentSuccess"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
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
          {/* Simple routing - no guards */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/health-assessment" element={<HealthAssessment />} />
          <Route path="/paywall" element={<Paywall />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Fallback to landing */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;