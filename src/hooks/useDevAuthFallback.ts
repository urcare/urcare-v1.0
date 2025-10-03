import { DEV_CONFIG, devUtils, isDevelopment } from "@/config/development";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useDevAuthFallback = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [isDevAuthActive, setIsDevAuthActive] = useState(false);

  useEffect(() => {
    if (!isDevelopment()) {
      return;
    }

    // Check if we're on the auth callback page and stuck
    const currentPath = window.location.pathname;
    if (currentPath === "/auth/callback" || currentPath === "/auth") {
      // Check if we've been on this page for more than 10 seconds (increased from 5)
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;

        // Only activate fallback if we're truly stuck and no OAuth code is present
        if (elapsed > 10000 && !auth.user && !window.location.search.includes('code=')) {
          devUtils.log("Auth callback stuck, activating development fallback");
          activateDevAuth();
          clearInterval(checkInterval);
        } else if (auth.user) {
          // User is authenticated, clear the interval
          clearInterval(checkInterval);
        }
      }, 1000);

      return () => clearInterval(checkInterval);
    }
  }, [auth.user]);

  const activateDevAuth = () => {
    if (!isDevelopment()) {
      return;
    }

    devUtils.log("Activating development authentication fallback");
    setIsDevAuthActive(true);

    // Simulate successful authentication
    const mockSession = {
      access_token: "dev-mock-token",
      refresh_token: "dev-mock-refresh",
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: "bearer",
      user: DEV_CONFIG.DEV_USER,
    };

    // Store the mock session
    localStorage.setItem("supabase.auth.token", JSON.stringify(mockSession));

    // Trigger auth state change
    window.dispatchEvent(new Event("storage"));

    // Navigate to dashboard after a short delay
    setTimeout(() => {
      devUtils.log("Development auth fallback: redirecting to dashboard");
      navigate("/dashboard", { replace: true });
    }, 1000);
  };

  const forceDevAuth = () => {
    devUtils.log("Force activating development authentication");
    activateDevAuth();
  };

  return {
    isDevAuthActive,
    activateDevAuth,
    forceDevAuth,
  };
};
