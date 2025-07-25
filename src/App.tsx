import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import CustomPlan from './pages/CustomPlan';
import Paywall from './pages/Paywall';
import { Dashboard } from './pages/Dashboard';

// Robust ProtectedRoute
const ProtectedRoute = ({ children, requireOnboardingComplete = false }: { children: React.ReactNode, requireOnboardingComplete?: boolean }) => {
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
  if (!requireOnboardingComplete && profile.onboarding_completed && location.pathname === '/onboarding') {
    return <Navigate to="/custom-plan" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Landing Page */}
        <Route path="/" element={<Landing />} />
        {/* Auth - removed */}
        {/* <Route path="/auth" element={<Auth />} /> */}
        {/* Onboarding (protected) */}
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        {/* Custom Plan (protected, require onboarding complete) */}
        <Route path="/custom-plan" element={<ProtectedRoute requireOnboardingComplete={true}><CustomPlan /></ProtectedRoute>} />
        {/* Paywall (protected) */}
        <Route path="/paywall" element={<ProtectedRoute><Paywall /></ProtectedRoute>} />
        {/* Dashboard (protected) */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        {/* Catch-all: redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
