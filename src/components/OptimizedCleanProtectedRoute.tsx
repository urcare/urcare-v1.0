import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";

// Debug logging for production troubleshooting
const debugLog = (message: string, data?: any) => {
  if (import.meta.env.PROD) {
    console.log(`🔍 OptimizedCleanProtectedRoute: ${message}`, data || '');
  }
};

interface OptimizedCleanProtectedRouteProps {
  children: React.ReactNode;
  requireOnboardingComplete?: boolean;
}

export const OptimizedCleanProtectedRoute: React.FC<OptimizedCleanProtectedRouteProps> = ({
  children,
  requireOnboardingComplete = false,
}) => {
  const { user, profile, loading, isInitialized, onboardingStatus } = useAuth();
  const location = useLocation();
  const hasRedirected = useRef(false);

  // Memoize the auth state to prevent unnecessary re-renders
  const authState = useMemo(() => ({
    user: user?.id,
    profile: profile?.id,
    loading,
    isInitialized,
    requireOnboardingComplete,
    pathname: location.pathname,
    onboardingStatus
  }), [user?.id, profile?.id, loading, isInitialized, requireOnboardingComplete, location.pathname, onboardingStatus]);

  debugLog('Component rendered', authState);

  // Reset hasRedirected when location changes
  useEffect(() => {
    hasRedirected.current = false;
  }, [location.pathname]);

  // OPTIMIZED: Use cached onboarding status instead of multiple checks
  const isLoading = useMemo(() => {
    const baseLoading = !isInitialized || loading;
    
    // If we require onboarding completion and user exists but onboarding status not checked yet, keep loading
    if (requireOnboardingComplete && user && !onboardingStatus.checked) {
      return true;
    }
    
    return baseLoading;
  }, [isInitialized, loading, requireOnboardingComplete, user, onboardingStatus.checked]);

  // OPTIMIZED: Use cached onboarding status for redirect logic
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

    // If we require onboarding completion but onboarding status not checked yet, wait
    if (requireOnboardingComplete && !onboardingStatus.checked) {
      return { type: 'render' as const };
    }

    // OPTIMIZED: Use cached onboarding status instead of profile check
    if (requireOnboardingComplete && onboardingStatus.checked && !onboardingStatus.completed) {
      debugLog('Redirecting to onboarding - onboarding not complete (cached status)');
      hasRedirected.current = true;
      return { type: 'onboarding' as const };
    }

    // If onboarding is completed but user is trying to access onboarding, redirect to dashboard
    if (onboardingStatus.checked && onboardingStatus.completed && location.pathname === "/onboarding") {
      debugLog('Redirecting to dashboard - onboarding already completed (cached status)');
      hasRedirected.current = true;
      return { type: 'dashboard' as const };
    }

    return { type: 'render' as const };
  }, [user, onboardingStatus, requireOnboardingComplete, location.pathname]);

  // Show loading while checking authentication
  if (isLoading) {
    debugLog('Showing loading state', { isLoading });
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-logo-text border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
          <p className="text-xs text-text-secondary mt-2">
            {loading ? "Checking authentication..." : "Initializing..."}
          </p>
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
    onboardingComplete: onboardingStatus.completed,
    onboardingChecked: onboardingStatus.checked
  });

  return <>{children}</>;
};
