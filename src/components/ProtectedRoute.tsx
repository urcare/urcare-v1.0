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
  const [retryCount, setRetryCount] = useState(0);

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
        // Add timeout to prevent hanging - increased to 10 seconds for better reliability
        const timeoutPromise = new Promise<boolean>((_, reject) => {
          setTimeout(
            () => reject(new Error("Route access check timeout")),
            10000
          );
        });

        const accessPromise = authFlowService.canAccessRoute(
          user,
          location.pathname
        );
        const hasAccess = await Promise.race([accessPromise, timeoutPromise]);

        if (isMounted) {
          setCanAccess(hasAccess);

          if (!hasAccess) {
            try {
              const redirect = await authFlowService.getRedirectRoute(user);
              setRedirectRoute(redirect);
            } catch (redirectError) {
              console.error("Error getting redirect route:", redirectError);
              // Fallback to onboarding if redirect fails
              setRedirectRoute("/onboarding");
            }
          }
        }
      } catch (error) {
        console.error("Error checking route access:", error);
        if (isMounted) {
          // Retry up to 2 times for transient errors
          if (
            retryCount < 2 &&
            error instanceof Error &&
            error.message.includes("timeout")
          ) {
            console.log(`Retrying access check (attempt ${retryCount + 1}/2)`);
            setRetryCount((prev) => prev + 1);
            // Retry after a short delay
            setTimeout(() => {
              if (isMounted) {
                checkAccess();
              }
            }, 1000);
            return;
          }

          // Treat timeout and other errors as access denial for security
          setCanAccess(false);
          setRedirectRoute("/onboarding");
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
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm">
            {loading
              ? "Loading..."
              : retryCount > 0
              ? `Retrying... (${retryCount}/2)`
              : "Checking access..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/welcome-screen" state={{ from: location }} replace />;
  }

  if (!canAccess) {
    return <Navigate to={redirectRoute} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
