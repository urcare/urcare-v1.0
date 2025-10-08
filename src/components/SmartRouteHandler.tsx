import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const SmartRouteHandler: React.FC = () => {
  const { user, profile, loading, isInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("🧭 SMART_ROUTE: SmartRouteHandler effect triggered:", {
      isInitialized,
      loading,
      hasUser: !!user,
      userId: user?.id,
      hasProfile: !!profile,
      profileId: profile?.id,
      onboardingCompleted: profile?.onboarding_completed,
      pathname: location.pathname,
      timestamp: new Date().toISOString()
    });

    // Only run routing logic when auth is initialized and not loading
    if (!isInitialized || loading) {
      console.log("🧭 SMART_ROUTE: Auth not ready - skipping routing logic");
      return;
    }

    // Don't redirect if we're on public routes
    const publicRoutes = [
      '/',
      '/legal',
      '/admin-login',
      '/my-admin',
      '/admin-dashboard',
      '/email-auth',
      '/email-signin',
      '/email-verification',
      '/tasks-demo',
      '/auth',
      '/auth/callback'
    ];

    if (publicRoutes.includes(location.pathname)) {
      console.log("🧭 SMART_ROUTE: On public route - skipping routing logic");
      return;
    }

    // If no user, redirect to landing
    if (!user) {
      console.log("🧭 SMART_ROUTE: No user - redirecting to landing");
      navigate('/', { replace: true });
      return;
    }

    // If user exists but no profile, wait a bit for profile to load
    // Only redirect to onboarding if profile is explicitly false, not just null/undefined
    if (user && profile && profile.onboarding_completed === false) {
      console.log("🧭 SMART_ROUTE: Onboarding not completed - redirecting to onboarding");
      navigate('/onboarding', { replace: true });
      return;
    }

    // If user is on onboarding but already completed it, redirect to dashboard
    if (location.pathname === '/onboarding' && profile?.onboarding_completed) {
      console.log("🧭 SMART_ROUTE: Onboarding completed but on onboarding page - redirecting to dashboard");
      navigate('/dashboard', { replace: true });
      return;
    }

    // If user is on dashboard but onboarding not completed, redirect to onboarding
    if (location.pathname === '/dashboard' && !profile?.onboarding_completed) {
      console.log("🧭 SMART_ROUTE: On dashboard but onboarding not completed - redirecting to onboarding");
      navigate('/onboarding', { replace: true });
      return;
    }

    console.log("🧭 SMART_ROUTE: No redirect needed - staying on current route");

  }, [user, profile, loading, isInitialized, navigate, location.pathname]);

  // This component doesn't render anything
  return null;
};
