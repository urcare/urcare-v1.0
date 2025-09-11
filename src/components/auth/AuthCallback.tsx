import { devUtils, isDevelopment } from "@/config/development";
import { useAuth } from "@/contexts/AuthContext";
import { useDevAuthFallback } from "@/hooks/useDevAuthFallback";
import { supabase } from "@/integrations/supabase/client";
import { devAuthService } from "@/services/devAuthService";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { isDevAuthActive, forceDevAuth } = useDevAuthFallback();

  useEffect(() => {
    let authStateSubscription: any;

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
        // Continue with the normal flow below - don't return here
      }

      // Remove timeout to allow natural completion of auth process
      // The auth state change listener will handle the redirect

      try {
        // Listen for auth state changes to handle OAuth callback
        authStateSubscription = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === "SIGNED_IN" && session) {
              await handleUserSession(session);
            } else if (event === "SIGNED_OUT") {
              navigate("/", { replace: true });
            }
          }
        );

        // Also check for existing session immediately
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("AuthCallback: Session error:", error);
          toast.error("Authentication failed", { description: error.message });
          navigate("/", { replace: true });
          return;
        }

        if (session?.user) {
          await handleUserSession(session);
        }
      } catch (error) {
        console.error("AuthCallback: Unexpected error:", error);
        if (error instanceof Error) {
          console.error("AuthCallback: Error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name,
          });
        }
        toast.error("Authentication failed", {
          description: "An unexpected error occurred. Please try again.",
        });
      }
    };

    const handleUserSession = async (session: any) => {
      try {
        console.log(
          "AuthCallback: handleUserSession called with session:",
          session?.user?.id
        );

        // First, test if we can access the table at all
        const testPromise = supabase
          .from("user_profiles")
          .select("id")
          .limit(1);

        const testTimeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Table access timeout")), 3000)
        );

        try {
          await Promise.race([testPromise, testTimeoutPromise]);
        } catch (testError) {
          // If we can't access the table, check user metadata for smart routing
          const userEmail = session.user.email;
          const userMetadata = session.user.user_metadata;

          // For OAuth users, they usually have metadata, so assume they're returning
          if (userMetadata?.full_name || userEmail) {
            toast.success("Welcome back!", {
              description: "Redirecting to your dashboard...",
            });
            navigate("/custom-plan", { replace: true });
            return;
          }

          // If no metadata, they might be a new user
          navigate("/welcome-screen", { replace: true });
          return;
        }

        const profilePromise = supabase
          .from("user_profiles")
          .select("onboarding_completed, preferences")
          .eq("id", session.user.id)
          .single();

        // Add a timeout to the profile fetch
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Profile fetch timeout")), 5000)
        );

        const { data: profileData, error: profileError } = (await Promise.race([
          profilePromise,
          timeoutPromise,
        ])) as any;

        // If profile doesn't exist, create one
        if (profileError && profileError.code === "PGRST116") {
          try {
            const { data: newProfile, error: createError } = await supabase
              .from("user_profiles")
              .insert([
                {
                  id: session.user.id,
                  full_name:
                    session.user.user_metadata?.full_name || session.user.email,
                  onboarding_completed: false,
                },
              ])
              .select("onboarding_completed, preferences")
              .single();

            if (createError) {
              // Fallback: redirect to welcome screen anyway
              navigate("/welcome-screen", { replace: true });
              return;
            } else {
              // Redirect to welcome screen for new users
              navigate("/welcome-screen", { replace: true });
              return;
            }
          } catch (createErr) {
            // Fallback: redirect to welcome screen
            navigate("/welcome-screen", { replace: true });
            return;
          }
        } else if (profileError) {
          // Fallback: redirect to welcome screen
          navigate("/welcome-screen", { replace: true });
          return;
        }

        // User has a profile, check onboarding status
        console.log("AuthCallback: Profile data:", profileData);
        if (!profileData?.onboarding_completed) {
          console.log(
            "AuthCallback: User onboarding not completed, redirecting to onboarding"
          );
          navigate("/onboarding", { replace: true });
        } else {
          console.log(
            "AuthCallback: User onboarding completed, checking subscription"
          );
          // Check subscription status using the proper subscription service
          try {
            const { subscriptionService } = await import(
              "@/services/subscriptionService"
            );
            const { isTrialBypassEnabled } = await import(
              "@/config/subscription"
            );

            // Check if trial bypass is enabled (for development/testing)
            if (isTrialBypassEnabled()) {
              console.log(
                "AuthCallback: Trial bypass enabled, redirecting to dashboard"
              );
              navigate("/dashboard", { replace: true });
              return;
            }

            // Check actual subscription status
            const subscriptionStatus =
              await subscriptionService.getSubscriptionStatus(session.user.id);
            const hasAccess =
              subscriptionStatus.isActive || subscriptionStatus.isTrial;

            if (hasAccess) {
              console.log(
                "AuthCallback: User has active subscription or trial, redirecting to dashboard"
              );
              navigate("/dashboard", { replace: true });
            } else {
              console.log(
                "AuthCallback: User no subscription, redirecting to health-assessment"
              );
              navigate("/health-assessment", { replace: true });
            }
          } catch (subscriptionError) {
            console.error(
              "AuthCallback: Error checking subscription status:",
              subscriptionError
            );
            // Fallback: redirect to health assessment
            console.log(
              "AuthCallback: Subscription check failed, redirecting to health-assessment"
            );
            navigate("/health-assessment", { replace: true });
          }
        }
      } catch (error) {
        console.error("AuthCallback: Error handling user session:", error);

        // If it's a timeout error, try to redirect based on user metadata
        if (
          error instanceof Error &&
          (error.message === "Profile fetch timeout" ||
            error.message === "Table access timeout")
        ) {
          console.log(
            "AuthCallback: Database timeout - checking user metadata for routing"
          );

          // Check if user has any metadata that might indicate they're returning
          const userEmail = session.user.email;
          const userMetadata = session.user.user_metadata;

          console.log("AuthCallback: User metadata:", userMetadata);

          // For OAuth users, they usually have metadata, so assume they're returning
          if (userMetadata?.full_name || userEmail) {
            console.log(
              "AuthCallback: User appears to be returning - redirecting to custom plan"
            );
            toast.success("Welcome back!", {
              description: "Redirecting to your dashboard...",
            });
            navigate("/custom-plan", { replace: true });
            return;
          }

          // If no metadata, they might be a new user
          console.log(
            "AuthCallback: No user metadata - redirecting to welcome screen"
          );
          navigate("/welcome-screen", { replace: true });
          return;
        }

        toast.error("Authentication failed", {
          description: "Failed to process user session. Please try again.",
        });
        // Fallback: redirect to welcome screen instead of landing page
        console.log(
          "AuthCallback: Final fallback - redirecting to welcome screen"
        );
        navigate("/welcome-screen", { replace: true });
      }
    };

    handleAuthCallback();

    // Cleanup function
    return () => {
      if (authStateSubscription)
        authStateSubscription.data.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          {isDevAuthActive
            ? "Development authentication active..."
            : "Completing authentication..."}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Please wait while we set up your account...
        </p>

        {/* Development fallback button */}
        {isDevelopment() && !isDevAuthActive && (
          <div className="mt-6">
            <button
              onClick={forceDevAuth}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
            >
              🔧 Use Development Auth (Stuck?)
            </button>
            <p className="text-xs text-gray-400 mt-2">
              Click if authentication is taking too long
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
