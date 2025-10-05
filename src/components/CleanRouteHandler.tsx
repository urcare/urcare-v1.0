import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export const CleanRouteHandler: React.FC = () => {
  const { user, profile, loading, isInitialized } = useAuth();

  useEffect(() => {
    const handleRouteRedirect = async () => {
      // Wait for authentication to be ready
      if (!isInitialized || loading) {
        return;
      }

      // No user - stay on landing page
      if (!user) {
        console.log("🔍 No user - staying on current page");
        return;
      }

      // User is authenticated - check their status
      console.log("🔍 User authenticated:", user.id);
      console.log("🔍 Profile loaded:", !!profile);
      console.log("🔍 Onboarding completed:", profile?.onboarding_completed);

      // Simple routing logic
      if (!profile?.onboarding_completed) {
        console.log("🔍 User needs onboarding - redirecting to onboarding");
        window.location.href = "/onboarding";
      } else {
        console.log("🔍 User completed onboarding - redirecting to dashboard");
        window.location.href = "/dashboard";
      }
    };

    handleRouteRedirect();
  }, [user, profile, loading, isInitialized]);

  // This component doesn't render anything
  return null;
};
