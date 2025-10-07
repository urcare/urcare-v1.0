import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

// Debug logging for production troubleshooting
const debugLog = (message: string, data?: any) => {
  if (import.meta.env.PROD) {
    console.log(`🔍 CleanProtectedRoute: ${message}`, data || '');
  }
};

interface CleanProtectedRouteProps {
  children: React.ReactNode;
  requireOnboardingComplete?: boolean;
}

export const CleanProtectedRoute: React.FC<CleanProtectedRouteProps> = ({
  children,
  requireOnboardingComplete = false,
}) => {
  const { user, profile, loading, isInitialized } = useAuth();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);

  debugLog('Component rendered', {
    user: user?.id,
    profile: profile?.id,
    loading,
    isInitialized,
    isReady,
    requireOnboardingComplete,
    pathname: location.pathname
  });

  // Wait for auth to be initialized
  useEffect(() => {
    debugLog('useEffect triggered', { isInitialized, loading });
    if (isInitialized && !loading) {
      debugLog('Setting isReady to true');
      setIsReady(true);
    } else if (!isInitialized || loading) {
      // Reset isReady when auth is not ready
      setIsReady(false);
    }
  }, [isInitialized, loading]);

  // Reset isReady when user changes
  useEffect(() => {
    if (user?.id) {
      setIsReady(false);
    }
  }, [user?.id]);

  // Show loading while checking authentication
  if (!isReady || loading) {
    debugLog('Showing loading state', { isReady, loading });
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-logo-text border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
          <p className="text-xs text-text-secondary mt-2">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to landing if not authenticated
  if (!user) {
    debugLog('Redirecting to landing - no user');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check onboarding completion if required
  // Only redirect if we have a profile and onboarding is explicitly false
  // If profile is null/undefined due to timeout, assume onboarding is complete
  if (requireOnboardingComplete && profile && profile.onboarding_completed === false) {
    debugLog('Redirecting to onboarding - onboarding not complete');
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  // If profile is null/undefined but user is authenticated, assume onboarding is complete
  // This prevents redirect loops when profile fetch times out
  if (requireOnboardingComplete && !profile) {
    debugLog('Profile is null/undefined, assuming onboarding complete to prevent redirect loops');
    // Don't redirect, just continue to the protected route
  }

  // If onboarding is completed but user is trying to access onboarding, redirect to dashboard
  if (profile?.onboarding_completed && location.pathname === "/onboarding") {
    debugLog('Redirecting to dashboard - onboarding already completed');
    return <Navigate to="/dashboard" replace />;
  }

  debugLog('Rendering children', {
    pathname: location.pathname,
    requireOnboardingComplete,
    hasProfile: !!profile,
    onboardingComplete: profile?.onboarding_completed
  });

  return <>{children}</>;
};
