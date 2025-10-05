import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const SmartRouteHandler: React.FC = () => {
  const { user, profile, loading, isInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only run routing logic when auth is initialized and not loading
    if (!isInitialized || loading) {
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
      return;
    }

    // If no user, redirect to landing
    if (!user) {
      navigate('/', { replace: true });
      return;
    }

    // If user exists but no profile, redirect to onboarding
    if (user && !profile) {
      navigate('/onboarding', { replace: true });
      return;
    }

    // If user is on onboarding but already completed it, redirect to dashboard
    if (location.pathname === '/onboarding' && profile?.onboarding_completed) {
      navigate('/dashboard', { replace: true });
      return;
    }

    // If user is on dashboard but onboarding not completed, redirect to onboarding
    if (location.pathname === '/dashboard' && !profile?.onboarding_completed) {
      navigate('/onboarding', { replace: true });
      return;
    }

  }, [user, profile, loading, isInitialized, navigate, location.pathname]);

  // This component doesn't render anything
  return null;
};
