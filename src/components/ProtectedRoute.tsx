import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { authFlowService } from "@/services/authFlowService";
import { MobileLoadingScreen } from "@/components/MobileLoadingScreen";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboardingComplete?: boolean;
  requireSubscription?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireOnboardingComplete = false,
  requireSubscription = false,
}) => {
  const { user, profile, loading, isInitialized } = useAuth();
  const location = useLocation();
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const [redirectRoute, setRedirectRoute] = useState<string>("/");

  useEffect(() => {
    // Simplified access check - allow all routes for localhost development
    if (!isInitialized || loading) {
      return;
    }

    if (!user) {
      setCanAccess(false);
      setRedirectRoute("/welcome-screen");
      return;
    }

    // For localhost development, allow access to all routes
    console.log("🔓 Localhost development mode - allowing access to all routes");
    setCanAccess(true);
  }, [user, isInitialized, loading]);

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