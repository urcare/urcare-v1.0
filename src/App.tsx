import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Auth from './pages/Auth';
import Landing from './pages/Landing';
import OnDemandLanding from './pages/OnDemandLanding';
import { Dashboard } from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import AIDiagnostics from './pages/AIDiagnostics';
import ClinicalDecisionSupport from './pages/ClinicalDecisionSupport';
import MentalHealth from './pages/MentalHealth';
import GeriatricCare from './pages/GeriatricCare';
import LIMS from './pages/LIMS';
import ClinicalAnalytics from './pages/ClinicalAnalytics';
import PerformanceMonitoring from './pages/PerformanceMonitoring';
import Analytics from './pages/Analytics';
import AuthCallback from './pages/AuthCallback';

function App() {
  const { user, profile, loading, isInitialized, isOnboardingComplete } = useAuth();

  // Add debugging information
  console.log('App Component Debug:', {
    user: !!user,
    profile: !!profile,
    loading,
    isInitialized,
    userEmail: user?.email,
    userRole: profile?.role
  });

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    // Show loading while auth is initializing
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

    // Redirect to auth if not authenticated
    if (!user) {
      return <Navigate to="/auth" replace />;
    }

    return <>{children}</>;
  };

  const OnboardingRoute = ({ children }: { children: React.ReactNode }) => {
    // Show loading while auth is initializing
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

    // If not authenticated, redirect to landing page
    if (!user) {
      console.log('OnboardingRoute: No user, redirecting to landing');
      return <Navigate to="/" replace />;
    }

    const onboardingComplete = isOnboardingComplete();
    console.log('OnboardingRoute check:', { 
      user: !!user, 
      onboardingComplete, 
      profile: !!profile,
      profileOnboardingCompleted: profile?.onboarding_completed 
    });

    // If user is authenticated but onboarding is incomplete, show onboarding
    if (user && !onboardingComplete) {
      console.log('OnboardingRoute: Showing onboarding');
      return <>{children}</>;
    }

    // If onboarding is complete, redirect to dashboard
    console.log('OnboardingRoute: Onboarding complete, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<OnDemandLanding />} />
        <Route path="/old-landing" element={<Landing />} />
        <Route path="/auth" element={<OnDemandLanding showModal={true} />} />
        {/* <Route path="/auth" element={<Auth />} /> */}
        <Route path="/login" element={<Login />} />
        
        {/* Auth callback route for OAuth */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Onboarding route */}
        {/* <Route path="/onboarding" element={ <OnboardingRoute><Onboarding /></OnboardingRoute> } /> */}
        <Route path="/onboarding" element={ <Onboarding /> } />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> } />

        <Route path="/profile" element={ <ProtectedRoute> <Profile /> </ProtectedRoute> } />
        
        <Route path="/ai-diagnostics" element={ <ProtectedRoute> <AIDiagnostics /> </ProtectedRoute> } />
        
        <Route path="/clinical-decision-support" element={ <ProtectedRoute> <ClinicalDecisionSupport /> </ProtectedRoute> } />
        
        <Route path="/mental-health" element={ <ProtectedRoute> <MentalHealth /> </ProtectedRoute> } />
        
        <Route
          path="/geriatric-care"
          element={
            <ProtectedRoute>
              <GeriatricCare />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lims"
          element={
            <ProtectedRoute>
              <LIMS />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clinical-analytics"
          element={
            <ProtectedRoute>
              <ClinicalAnalytics />
            </ProtectedRoute>
          }
        />
        
        {/* Phase 9: Performance Monitoring and Analytics */}
        <Route 
          path="/performance-monitoring" 
          element={
            <ProtectedRoute>
              <PerformanceMonitoring />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch-all route for unmatched paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
