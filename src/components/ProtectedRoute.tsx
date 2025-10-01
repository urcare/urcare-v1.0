import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  // For localhost development, always render children without any checks
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    console.log("🔓 Localhost development mode - allowing access to all routes");
    return <>{children}</>;
  }

  // For production, use the original logic
  const { user, profile, loading, isInitialized } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitialized || loading) {
      return;
    }

    if (!user) {
      console.log("No user, redirecting to welcome screen");
      navigate("/welcome-screen", { replace: true });
      return;
    }

    console.log("User authenticated, allowing access");
  }, [user, isInitialized, loading, navigate]);

  // Show loading while checking
  if (loading || !isInitialized) {
    return (
      <MobileLoadingScreen
        message={loading ? "Loading..." : "Checking access..."}
        submessage="Please wait"
      />
    );
  }

  // Render children if user exists
  if (user) {
    return <>{children}</>;
  }

  // This should not be reached due to redirect above
  return null;
};