import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { simpleRoutingService } from "@/services/simpleRoutingService";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboardingComplete?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireOnboardingComplete = false,
}) => {
  const { user, profile, loading, isInitialized } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Only check if we're not already loading
    if (!loading && isInitialized) {
      setIsChecking(false);
    }
  }, [loading, isInitialized]);

  // Show loading while checking authentication
  if (loading || !isInitialized || isChecking) {
    return (
      <div className="h-screen flex items-center justify-center bg-app-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-logo-text border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to landing if not authenticated
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check if user can access this route
  useEffect(() => {
    const checkRouteAccess = async () => {
      if (user && profile) {
        const canAccess = await simpleRoutingService.canAccessRoute(user, location.pathname, profile);
        if (!canAccess) {
          // Get the correct route for this user
          const correctRoute = await simpleRoutingService.getCorrectRoute(user, profile);
          window.location.replace(correctRoute);
        }
      }
    };

    checkRouteAccess();
  }, [user, profile, location.pathname]);

  // Check onboarding completion if required
  if (requireOnboardingComplete && !profile?.onboarding_completed) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  // If onboarding is completed but user is trying to access onboarding, redirect to dashboard
  if (profile?.onboarding_completed && location.pathname === "/onboarding") {
    window.location.replace("/dashboard");
    return null; // Prevent rendering while redirecting
  }

  return <>{children}</>;
};