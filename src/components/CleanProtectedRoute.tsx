import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

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

  // Wait for auth to be initialized
  useEffect(() => {
    if (isInitialized && !loading) {
      setIsReady(true);
    }
  }, [isInitialized, loading]);

  // Show loading while checking authentication
  if (!isReady || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-logo-text border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to landing if not authenticated
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check onboarding completion if required
  if (requireOnboardingComplete && !profile?.onboarding_completed) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  // If onboarding is completed but user is trying to access onboarding, redirect to dashboard
  if (profile?.onboarding_completed && location.pathname === "/onboarding") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
