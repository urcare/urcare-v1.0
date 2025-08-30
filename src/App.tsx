import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import CustomPlan from './pages/CustomPlan';
import Paywall from './pages/Paywall';
import Dashboard from './pages/Dashboard';
import Subscription from './pages/Subscription';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthCallback } from './components/auth/AuthCallback';
import { TestAuth } from './pages/TestAuth';

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
        {/* Welcome Screen (before onboarding) */}
        <Route path="/welcome-screen" element={<WelcomeScreen />} />
        {/* Auth Callback for OAuth redirects */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        {/* Test Auth Page for debugging */}
        <Route path="/test-auth" element={<TestAuth />} />
        {/* Auth - removed */}
        {/* <Route path="/auth" element={<Auth />} /> */}
        {/* Onboarding (no longer protected) */}
        <Route path="/onboarding" element={<Onboarding />} />
        {/* Custom Plan (protected, require onboarding complete) */}
        <Route path="/custom-plan" element={<ProtectedRoute requireOnboardingComplete={true}><CustomPlan /></ProtectedRoute>} />
        {/* Paywall (protected) */}
        <Route path="/paywall" element={<ProtectedRoute><Paywall /></ProtectedRoute>} />
        {/* Dashboard (protected) */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        {/* Subscription (protected) */}
        <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
        {/* Profile (protected) */}
        <Route path="/profile" element={<ProtectedRoute><div className="p-4">Profile Page - Coming Soon</div></ProtectedRoute>} />
        {/* Progress (protected) */}
        <Route path="/progress" element={<ProtectedRoute><div className="p-4">Progress Page - Coming Soon</div></ProtectedRoute>} />
        {/* Calendar (protected) */}
        <Route path="/calendar" element={<ProtectedRoute><div className="p-4">Calendar Page - Coming Soon</div></ProtectedRoute>} />
        {/* Notifications (protected) */}
        <Route path="/notifications" element={<ProtectedRoute><div className="p-4">Notifications Page - Coming Soon</div></ProtectedRoute>} />
        {/* Settings (protected) */}
        <Route path="/settings" element={<ProtectedRoute><div className="p-4">Settings Page - Coming Soon</div></ProtectedRoute>} />
        {/* Help (protected) */}
        <Route path="/help" element={<ProtectedRoute><div className="p-4">Help & Support Page - Coming Soon</div></ProtectedRoute>} />
        {/* Payment (protected) */}
        <Route path="/payment" element={<ProtectedRoute><div className="p-4">Payment Page - Coming Soon</div></ProtectedRoute>} />
        {/* Catch-all: redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
