import { useAuth } from "@/contexts/AuthContext";
import { authFlowService } from "@/services/authFlowService";
import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const InitialRouteHandler: React.FC = () => {
  const { user, profile, loading, isInitialized } = useAuth();
  const location = useLocation();
  const processedRedirect = useRef<boolean>(false);

  useEffect(() => {
    const handleInitialRedirect = async () => {
      // Only handle redirects from the landing page and only once
      if (
        isInitialized &&
        !loading &&
        user &&
        profile &&
        location.pathname === "/" &&
        !processedRedirect.current
      ) {
        processedRedirect.current = true;

        try {
          const redirectRoute = await authFlowService.getRedirectRoute(user);
          // Use window.location.replace for a clean redirect
          window.location.replace(redirectRoute);
        } catch (error) {
          console.error("❌ Error determining redirect:", error);
          // Fallback to onboarding
          window.location.replace("/onboarding");
        }
      }
    };

    handleInitialRedirect();
  }, [isInitialized, loading, user, profile, location.pathname]);

  // Reset processed redirect when user changes
  useEffect(() => {
    if (!user) {
      processedRedirect.current = false;
    }
  }, [user]);

  return null;
};
