import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import OnDemandLanding from './pages/OnDemandLanding';
import { Dashboard } from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import { WelcomeScreen } from './components/WelcomeScreen';
import { 
  ProfilePage,
  AIDiagnosticsPage,
  ClinicalDecisionSupportPage,
  MentalHealthPage,
  GeriatricCarePage,
  LIMSPage,
  ClinicalAnalyticsPage,
  PerformanceMonitoringPage,
  AnalyticsPage
} from './pages/RouteComponents';
import AuthCallback from './pages/AuthCallback';
import CustomPlan from './pages/CustomPlan';
import Paywall from './pages/Paywall';

function App() {
  const { user, profile, loading, isInitialized, isOnboardingComplete } = useAuth();

  // Add debugging information
  console.log('App Component Debug:', {
    user: !!user,
    profile: !!profile,
    loading,
    isInitialized,
    userEmail: user?.email
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

    // Redirect to welcome if not authenticated
    if (!user) {
      return <Navigate to="/welcome" replace />;
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

    // If not authenticated, redirect to welcome page
    if (!user) {
      console.log('OnboardingRoute: No user, redirecting to welcome');
      return <Navigate to="/welcome" replace />;
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

    // If onboarding is complete, redirect to custom plan
    console.log('OnboardingRoute: Onboarding complete, redirecting to custom plan');
    return <Navigate to="/custom-plan" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<OnDemandLanding />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/old-landing" element={<Landing />} />
        
        {/* Auth callback route for OAuth */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Onboarding route */}
        {/* <Route path="/onboarding" element={ <OnboardingRoute><Onboarding /></OnboardingRoute> } /> */}
        <Route path="/onboarding" element={ <Onboarding /> } />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> } />

        <Route path="/profile" element={ <ProtectedRoute> <ProfilePage /> </ProtectedRoute> } />
        <Route path="/ai-diagnostics" element={ <ProtectedRoute> <AIDiagnosticsPage /> </ProtectedRoute> } />
        <Route path="/clinical-decision-support" element={ <ProtectedRoute> <ClinicalDecisionSupportPage /> </ProtectedRoute> } />
        <Route path="/mental-health" element={ <ProtectedRoute> <MentalHealthPage /> </ProtectedRoute> } />
        <Route path="/geriatric-care" element={ <ProtectedRoute> <GeriatricCarePage /> </ProtectedRoute> } />
        <Route path="/lims" element={ <ProtectedRoute> <LIMSPage /> </ProtectedRoute> } />
        <Route path="/clinical-analytics" element={ <ProtectedRoute> <ClinicalAnalyticsPage /> </ProtectedRoute> } />
        <Route path="/performance-monitoring" element={ <ProtectedRoute> <PerformanceMonitoringPage /> </ProtectedRoute> } />
        <Route path="/analytics" element={ <ProtectedRoute> <AnalyticsPage /> </ProtectedRoute> } />
        <Route path="/custom-plan" element={ <ProtectedRoute> <CustomPlan /> </ProtectedRoute> } />
        <Route path="/paywall" element={<Paywall />} />
        
        {/* Catch-all route for unmatched paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
