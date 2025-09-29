import { MobileLoadingScreen } from "@/components/MobileLoadingScreen";
import { useAuth } from "@/contexts/AuthContext";
import { authFlowService } from "@/services/authFlowService";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

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
  const { user, profile, loading, isInitialized } = useAuth();
  const location = useLocation();
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const [redirectRoute, setRedirectRoute] = useState<string>("/");

  useEffect(() => {
    let isMounted = true;

    const checkAccess = async () => {
      if (!isInitialized || loading) {
        return;
      }

      if (!user) {
        if (isMounted) {
          setCanAccess(false);
          setRedirectRoute("/");
        }
        return;
      }

      try {
        // Add timeout to prevent hanging - reduced to 3 seconds for better responsiveness
        const timeoutPromise = new Promise<boolean>((_, reject) => {
          setTimeout(
            () => reject(new Error("Route access check timeout")),
            3000
          );
        });

        const accessPromise = authFlowService.canAccessRoute(
          user,
          location.pathname,
          profile
        );
        const hasAccess = await Promise.race([accessPromise, timeoutPromise]);

        if (isMounted) {
          setCanAccess(hasAccess);

          if (!hasAccess) {
            try {
              const redirect = await authFlowService.getRedirectRoute(user, profile);
              setRedirectRoute(redirect);
            } catch (redirectError) {
              console.error("Error getting redirect route:", redirectError);
              // Fallback to health assessment if redirect fails
              setRedirectRoute("/health-assessment");
            }
          }
        }
      } catch (error) {
        console.error("Error checking route access:", error);
        if (isMounted) {
          // If there's a timeout but user has completed onboarding, allow access to dashboard
          if (profile?.onboarding_completed && location.pathname === "/dashboard") {
            console.log("Timeout but allowing dashboard access - user completed onboarding");
            setCanAccess(true);
          } else {
            // Treat other errors as access denial for security
            setCanAccess(false);
            setRedirectRoute("/health-assessment");
          }
        }
      }
    };

    // Debounce access checks
    const timeoutId = setTimeout(checkAccess, 100);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [user, isInitialized, loading, location.pathname]);

  if (loading || !isInitialized || canAccess === null) {
    return (
      <MobileLoadingScreen
        message={
          loading
            ? "Loading..."
            : "Checking access..."
        }
        submessage="Please wait"
      />
    );
  }

  // TEMPORARY: Allow access to onboarding without authentication
  if (!user && location.pathname !== "/onboarding") {
    return <Navigate to="/welcome-screen" state={{ from: location }} replace />;
  }

  if (!canAccess) {
    return <Navigate to={redirectRoute} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
