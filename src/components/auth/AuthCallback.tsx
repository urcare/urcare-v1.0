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
    let timeoutId: NodeJS.Timeout;
    let authStateSubscription: any;

    const handleAuthCallback = async () => {
      console.log("AuthCallback: Starting OAuth callback handling...");
      console.log("AuthCallback: Current URL:", window.location.href);
      console.log("AuthCallback: URL search params:", window.location.search);
      console.log("AuthCallback: URL hash:", window.location.hash);

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

      // Add a timeout to prevent infinite loading
      timeoutId = setTimeout(() => {
        console.error(
          "AuthCallback: Timeout reached, redirecting to welcome screen"
        );
        toast.error("Authentication timeout", {
          description: "Redirecting to welcome screen...",
        });
        navigate("/welcome-screen", { replace: true });
      }, 15000); // Increased to 15 seconds

      try {
        // Listen for auth state changes to handle OAuth callback
        authStateSubscription = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("AuthCallback: Auth state change:", { event, session: !!session });
            
            if (event === 'SIGNED_IN' && session) {
              console.log("AuthCallback: User signed in:", session.user.id);
              await handleUserSession(session);
            } else if (event === 'SIGNED_OUT') {
              console.log("AuthCallback: User signed out");
              navigate("/", { replace: true });
            }
          }
        );

        // Also check for existing session immediately
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("AuthCallback: Session error:", error);
          toast.error("Authentication failed", { description: error.message });
          navigate("/", { replace: true });
          return;
        }

        if (session?.user) {
          console.log("AuthCallback: Existing session found:", session.user.id);
          await handleUserSession(session);
        } else {
          console.log("AuthCallback: No existing session, waiting for auth state change...");
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
        clearTimeout(timeoutId);
        console.log("AuthCallback: Starting handleUserSession for user:", session.user.id);
        
        // Create or get user profile with timeout
        console.log("AuthCallback: Fetching user profile...");
        
        // First, test if we can access the table at all
        console.log("AuthCallback: Testing table access...");
        const testPromise = supabase
          .from("user_profiles")
          .select("id")
          .limit(1);
        
        const testTimeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Table access timeout")), 3000)
        );
        
        try {
          await Promise.race([testPromise, testTimeoutPromise]);
          console.log("AuthCallback: Table access successful, fetching profile...");
        } catch (testError) {
          console.error("AuthCallback: Table access failed:", testError);
          // If we can't access the table, check user metadata for smart routing
          console.log("AuthCallback: Cannot access database - checking user metadata for routing");
          
          const userEmail = session.user.email;
          const userMetadata = session.user.user_metadata;
          
          console.log("AuthCallback: User metadata:", userMetadata);
          
          // For OAuth users, they usually have metadata, so assume they're returning
          if (userMetadata?.full_name || userEmail) {
            console.log("AuthCallback: User appears to be returning - redirecting to custom plan");
            toast.success("Welcome back!", {
              description: "Redirecting to your dashboard...",
            });
            navigate("/custom-plan", { replace: true });
            return;
          }
          
          // If no metadata, they might be a new user
          console.log("AuthCallback: No user metadata - redirecting to welcome screen");
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

        const { data: profileData, error: profileError } = await Promise.race([
          profilePromise,
          timeoutPromise
        ]) as any;

        console.log("AuthCallback: Profile check:", {
          profileData,
          profileError,
        });

        // If profile doesn't exist, create one
        if (profileError && profileError.code === "PGRST116") {
          console.log("AuthCallback: Creating new user profile...");
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
              console.error("AuthCallback: Error creating profile:", createError);
              // Fallback: redirect to welcome screen anyway
              console.log("AuthCallback: Falling back to welcome screen due to profile creation error");
              navigate("/welcome-screen", { replace: true });
              return;
            } else {
              console.log("AuthCallback: Profile created successfully");
              // Redirect to welcome screen for new users
              navigate("/welcome-screen", { replace: true });
              return;
            }
          } catch (createErr) {
            console.error("AuthCallback: Exception during profile creation:", createErr);
            // Fallback: redirect to welcome screen
            navigate("/welcome-screen", { replace: true });
            return;
          }
        } else if (profileError) {
          console.error("AuthCallback: Error fetching profile:", profileError);
          // Fallback: redirect to welcome screen
          console.log("AuthCallback: Falling back to welcome screen due to profile fetch error");
          navigate("/welcome-screen", { replace: true });
          return;
        }

        // User has a profile, check onboarding status
        if (!profileData?.onboarding_completed) {
          console.log(
            "AuthCallback: User needs onboarding, redirecting to welcome screen"
          );
          navigate("/welcome-screen", { replace: true });
        } else {
          // Check subscription status
          const isSubscribed =
            profileData.preferences?.subscription === "active";
          if (isSubscribed) {
            console.log("AuthCallback: Redirecting to dashboard");
            navigate("/dashboard", { replace: true });
          } else {
            console.log("AuthCallback: Redirecting to custom plan");
            navigate("/custom-plan", { replace: true });
          }
        }
      } catch (error) {
        console.error("AuthCallback: Error handling user session:", error);
        
        // If it's a timeout error, try to redirect based on user metadata
        if (error instanceof Error && (error.message === "Profile fetch timeout" || error.message === "Table access timeout")) {
          console.log("AuthCallback: Database timeout - checking user metadata for routing");
          
          // Check if user has any metadata that might indicate they're returning
          const userEmail = session.user.email;
          const userMetadata = session.user.user_metadata;
          
          console.log("AuthCallback: User metadata:", userMetadata);
          
          // For OAuth users, they usually have metadata, so assume they're returning
          if (userMetadata?.full_name || userEmail) {
            console.log("AuthCallback: User appears to be returning - redirecting to custom plan");
            toast.success("Welcome back!", {
              description: "Redirecting to your dashboard...",
            });
            navigate("/custom-plan", { replace: true });
            return;
          }
          
          // If no metadata, they might be a new user
          console.log("AuthCallback: No user metadata - redirecting to welcome screen");
          navigate("/welcome-screen", { replace: true });
          return;
        }
        
        toast.error("Authentication failed", {
          description: "Failed to process user session. Please try again.",
        });
        // Fallback: redirect to welcome screen instead of landing page
        console.log("AuthCallback: Final fallback - redirecting to welcome screen");
        navigate("/welcome-screen", { replace: true });
      }
    };

    handleAuthCallback();

    // Cleanup function
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (authStateSubscription) authStateSubscription.data.subscription.unsubscribe();
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
