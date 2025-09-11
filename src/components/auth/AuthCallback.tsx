import { devUtils, isDevelopment } from "@/config/development";
import { useAuth } from "@/contexts/AuthContext";
import { useDevAuthFallback } from "@/hooks/useDevAuthFallback";
import { supabase } from "@/integrations/supabase/client";
import { authFlowService } from "@/services/authFlowService";
import { devAuthService } from "@/services/devAuthService";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, isInitialized } = useAuth();
  const { isDevAuthActive, forceDevAuth } = useDevAuthFallback();

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("AuthCallback: Starting OAuth callback handling...");

      // Check if we're in development and need to redirect to local URL
      if (isDevelopment()) {
        devUtils.log("Handling auth callback in development mode");
        if (!devAuthService.checkDevelopmentUrl()) {
          return; // Redirect is happening
        }
        // Let the development auth service handle the session check
        await devAuthService.handleAuthCallback();
      }

      try {
        // Listen for auth state changes to handle OAuth callback
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log(
            "AuthCallback: Auth state change",
            event,
            session?.user?.id
          );

          if (event === "SIGNED_IN" && session?.user) {
            await handleUserSession(session.user);
          } else if (event === "SIGNED_OUT") {
            navigate("/", { replace: true });
          }
        });

        // Also check for existing session immediately
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("AuthCallback: Session error:", error);
          navigate("/", { replace: true });
          return;
        }

        if (session?.user) {
          await handleUserSession(session.user);
        } else {
          // No session, redirect to landing
          navigate("/", { replace: true });
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("AuthCallback: Error in auth callback:", error);
        navigate("/", { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  const handleUserSession = async (user: any) => {
    try {
      console.log("AuthCallback: handleUserSession called with user:", user.id);

      // Wait for auth context to be initialized
      if (!isInitialized) {
        // Wait a bit for auth context to initialize
        setTimeout(() => handleUserSession(user), 100);
        return;
      }

      // Get the appropriate redirect route using the auth flow service
      const redirectRoute = await authFlowService.getRedirectRoute(user);

      console.log("AuthCallback: Redirecting to:", redirectRoute);

      toast.success("Welcome back!", {
        description: "Redirecting to your dashboard...",
      });

      navigate(redirectRoute, { replace: true });
    } catch (error) {
      console.error("AuthCallback: Error handling user session:", error);
      // Fallback to onboarding if there's an error
      navigate("/onboarding", { replace: true });
    }
  };

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
