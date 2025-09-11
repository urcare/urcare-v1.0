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
    const checkAccess = async () => {
      if (!isInitialized || loading) {
        return;
      }

      if (!user) {
        setCanAccess(false);
        setRedirectRoute("/");
        return;
      }

      try {
        const hasAccess = await authFlowService.canAccessRoute(
          user,
          location.pathname
        );
        setCanAccess(hasAccess);

        if (!hasAccess) {
          const redirect = await authFlowService.getRedirectRoute(user);
          setRedirectRoute(redirect);
        }
      } catch (error) {
        console.error("Error checking route access:", error);
        setCanAccess(false);
        setRedirectRoute("/onboarding");
      }
    };

    checkAccess();
  }, [user, profile, loading, isInitialized, location.pathname]);

  if (loading || !isInitialized || canAccess === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
