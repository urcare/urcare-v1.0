import { MobileLoadingScreen } from "@/components/MobileLoadingScreen";
import { devUtils, isDevelopment } from "@/config/development";
import { useAuth } from "@/contexts/AuthContext";
import { useDevAuthFallback } from "@/hooks/useDevAuthFallback";
import { authFlowService } from "@/services/authFlowService";
import { devAuthService } from "@/services/devAuthService";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, isInitialized, loading } = useAuth();
  const { isDevAuthActive, forceDevAuth } = useDevAuthFallback();
  const hasRedirected = useRef(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check if we're in development and need to redirect to local URL
      if (isDevelopment()) {
        devUtils.log("Handling auth callback in development mode");
        if (!devAuthService.checkDevelopmentUrl()) {
          return; // Redirect is happening
        }
        // Let the development auth service handle the session check
        await devAuthService.handleAuthCallback();
      }
    };

    handleAuthCallback();
  }, []);

  // Handle redirect when user is authenticated and context is ready
  useEffect(() => {
    const handleRedirect = async () => {
      // Only redirect once and when everything is ready
      if (
        !hasRedirected.current &&
        isInitialized &&
        !loading &&
        user
        // Remove profile requirement - it might not be loaded yet
      ) {
        hasRedirected.current = true;

        try {
          console.log("AuthCallback: User authenticated, determining redirect");
          console.log("AuthCallback: User ID:", user.id);
          console.log("AuthCallback: Profile:", profile);
          console.log("AuthCallback: Profile onboarding_completed:", profile?.onboarding_completed);

          // Add a small delay to ensure auth context is fully settled
          await new Promise((resolve) => setTimeout(resolve, 200));

          // Get the appropriate redirect route using the auth flow service
          console.log(
            "AuthCallback: Calling authFlowService.getRedirectRoute..."
          );
          
          // If profile is not loaded yet, wait a bit more or use a default route
          let redirectRoute;
          if (profile) {
            redirectRoute = await authFlowService.getRedirectRoute(user, profile);
          } else {
            console.log("AuthCallback: Profile not loaded yet, using default dashboard route");
            redirectRoute = "/dashboard"; // Default to dashboard for returning users
          }
          
          console.log("AuthCallback: Got redirect route:", redirectRoute);
          console.log("AuthCallback: Current URL before redirect:", window.location.href);

          toast.success("Welcome back!", {
            description: "Redirecting to your dashboard...",
          });

          // Use window.location.href for more reliable mobile navigation
          window.location.href = redirectRoute;
        } catch (error) {
          console.error("AuthCallback: Error determining redirect:", error);
          console.error("AuthCallback: Error details:", error);
          // ✅ DO NOT redirect on error — stay on loading screen
          // Removed fallback to "/onboarding"
        }
      }
    };

    // ✅ REMOVED timeout fallback to prevent auto-redirect
    // const timeoutId = setTimeout(() => {
    //   if (!hasRedirected.current && isInitialized && !loading) {
    //     console.log("AuthCallback: Timeout reached, redirecting to onboarding");
    //     hasRedirected.current = true;
    //     window.location.href = "/onboarding";
    //   }
    // }, 8000);

    handleRedirect();

    // ✅ No cleanup needed since timeout is removed
    // return () => clearTimeout(timeoutId);
  }, [isInitialized, loading, user]);

  // Reset redirect flag when user changes
  useEffect(() => {
    if (!user) {
      hasRedirected.current = false;
    }
  }, [user]);

  // Show loading while processing
  return (
    <MobileLoadingScreen
      message="Completing sign in..."
      submessage="Setting up your account"
    />
  );
};