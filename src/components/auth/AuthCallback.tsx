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
        // Removed profile requirement - it might not be set yet
      ) {
        hasRedirected.current = true;

        try {
          console.log("AuthCallback: User authenticated, determining redirect");
          console.log("AuthCallback: User ID:", user.id);
          console.log("AuthCallback: Profile:", profile);

          // Add a small delay to ensure auth context is fully settled
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Get the appropriate redirect route using the auth flow service
          console.log(
            "AuthCallback: Calling authFlowService.getRedirectRoute..."
          );
          const redirectRoute = await authFlowService.getRedirectRoute(user);
          console.log("AuthCallback: Got redirect route:", redirectRoute);

          toast.success("Welcome back!", {
            description: "Redirecting to your dashboard...",
          });

          navigate(redirectRoute, { replace: true });
        } catch (error) {
          console.error("AuthCallback: Error determining redirect:", error);
          console.error("AuthCallback: Error details:", error);
          // Fallback to onboarding if there's an error
          navigate("/onboarding", { replace: true });
        }
      }
    };

    // Add timeout to prevent infinite waiting
    const timeoutId = setTimeout(() => {
      if (!hasRedirected.current && isInitialized && !loading) {
        console.log("AuthCallback: Timeout reached, redirecting to onboarding");
        hasRedirected.current = true;
        navigate("/onboarding", { replace: true });
      }
    }, 5000); // 5 second timeout

    handleRedirect();

    return () => clearTimeout(timeoutId);
  }, [isInitialized, loading, user, navigate]);

  // Reset redirect flag when user changes
  useEffect(() => {
    if (!user) {
      hasRedirected.current = false;
    }
  }, [user]);

  // Show loading while processing
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};
