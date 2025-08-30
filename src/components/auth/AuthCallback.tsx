import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("AuthCallback: Starting OAuth callback handling...");

      // Add a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.error(
          "AuthCallback: Timeout reached, redirecting to landing page"
        );
        navigate("/", { replace: true });
      }, 8000); // 8 seconds timeout

      try {
        // Let Supabase handle the OAuth callback automatically
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        console.log("AuthCallback: Session check result:", {
          session: !!session,
          error,
        });

        if (error) {
          console.error("AuthCallback: Session error:", error);
          toast.error("Authentication failed", { description: error.message });
          navigate("/", { replace: true });
          return;
        }

        if (!session?.user) {
          console.log("AuthCallback: No session found, redirecting to landing");
          navigate("/", { replace: true });
          return;
        }

        console.log("AuthCallback: User authenticated:", session.user.id);

        // Create or get user profile
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("onboarding_completed, preferences")
          .eq("id", session.user.id)
          .single();

        console.log("AuthCallback: Profile check:", {
          profileData,
          profileError,
        });

        // If profile doesn't exist, create one
        if (profileError && profileError.code === "PGRST116") {
          console.log("AuthCallback: Creating new user profile...");
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
            // Continue anyway, user can complete onboarding later
          } else {
            console.log("AuthCallback: Profile created successfully");
            // Redirect to welcome screen for new users
            navigate("/welcome-screen");
            return;
          }
        } else if (profileError) {
          console.error("AuthCallback: Error fetching profile:", profileError);
          // Continue anyway, redirect to welcome screen
          navigate("/welcome-screen");
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
        console.error("AuthCallback: Unexpected error:", error);
        toast.error("Authentication failed", {
          description: "An unexpected error occurred",
        });
        navigate("/", { replace: true });
      } finally {
        clearTimeout(timeoutId);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Completing authentication...
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Please wait while we set up your account...
        </p>
      </div>
    </div>
  );
};
