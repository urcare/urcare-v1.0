import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";

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
  const hasRedirected = useRef(false);

  // Memoize the auth state to prevent unnecessary re-renders
  const authState = useMemo(() => ({
    user: user?.id,
    profile: profile?.id,
    loading,
    isInitialized,
    requireOnboardingComplete,
    pathname: location.pathname
  }), [user?.id, profile?.id, loading, isInitialized, requireOnboardingComplete, location.pathname]);

  debugLog('Component rendered', authState);

  // Reset hasRedirected when location changes
  useEffect(() => {
    hasRedirected.current = false;
  }, [location.pathname]);

  // Memoize the loading state check
  const isLoading = useMemo(() => {
    const baseLoading = !isInitialized || loading;
    
    // If we require onboarding completion and user exists but profile doesn't exist, keep loading
    if (requireOnboardingComplete && user && !profile) {
      return true;
    }
    
    return baseLoading;
  }, [isInitialized, loading, requireOnboardingComplete, user, profile]);

  // STEP 1: Add onboarding completion check
  const redirectLogic = useMemo(() => {
    // If we've already made a redirect decision, just render
    if (hasRedirected.current) {
      return { type: 'render' as const };
    }

    // Redirect to landing if not authenticated
    if (!user) {
      debugLog('Redirecting to landing - no user');
      hasRedirected.current = true;
      return { type: 'landing' as const };
    }

    // If we require onboarding completion but profile doesn't exist, wait for it to load
    if (requireOnboardingComplete && !profile) {
      return { type: 'render' as const };
    }

    // Check onboarding completion if required
    if (requireOnboardingComplete && profile && profile.onboarding_completed === false) {
      debugLog('Redirecting to onboarding - onboarding not complete');
      hasRedirected.current = true;
      return { type: 'onboarding' as const };
    }

    // If onboarding is completed but user is trying to access onboarding, redirect to dashboard
    if (profile?.onboarding_completed && location.pathname === "/onboarding") {
      debugLog('Redirecting to dashboard - onboarding already completed');
      hasRedirected.current = true;
      return { type: 'dashboard' as const };
    }

    return { type: 'render' as const };
  }, [user, profile, requireOnboardingComplete, location.pathname]);

  // Show loading while checking authentication
  if (isLoading) {
    debugLog('Showing loading state', { isLoading });
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-logo-text border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle redirects
  if (redirectLogic.type === 'landing') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  if (redirectLogic.type === 'onboarding') {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }
  
  if (redirectLogic.type === 'dashboard') {
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
