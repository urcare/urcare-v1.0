import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { MobileLoadingScreen } from "@/components/MobileLoadingScreen";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboardingComplete?: boolean;
  requireSubscription?: boolean;
}

export const ProtectedRouteNew: React.FC<ProtectedRouteProps> = ({
  children,
  requireOnboardingComplete = false,
  requireSubscription = false,
}) => {
  const { user, profile, loading, isInitialized } = useAuth();
  const location = useLocation();
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const [redirectRoute, setRedirectRoute] = useState<string>("/");

  useEffect(() => {
    if (!isInitialized || loading) {
      return;
    }

    const checkAccess = async () => {
      try {
        // Check if user can access the route
        const hasAccess = authService.canAccessRoute(user, location.pathname, profile);
        
        if (hasAccess) {
          setCanAccess(true);
        } else {
          setCanAccess(false);
          
          // Get redirect route
          const redirect = await authService.getRedirectRoute(user, profile);
          setRedirectRoute(redirect);
        }
      } catch (error) {
        console.error("Error checking route access:", error);
        setCanAccess(false);
        setRedirectRoute("/");
      }
    };

    checkAccess();
  }, [user, profile, isInitialized, loading, location.pathname]);

  // Show loading while checking
  if (loading || !isInitialized || canAccess === null) {
    return (
      <MobileLoadingScreen
        message={loading ? "Loading..." : "Checking access..."}
        submessage="Please wait"
      />
    );
  }

  // Redirect to welcome screen if not authenticated
  if (!user) {
    return <Navigate to="/welcome-screen" state={{ from: location }} replace />;
  }

  // Redirect if no access
  if (!canAccess) {
    return <Navigate to={redirectRoute} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
