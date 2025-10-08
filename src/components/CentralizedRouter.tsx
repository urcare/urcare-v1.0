import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface UserFlow {
  shouldRedirect: boolean;
  redirectTo: string;
  reason: string;
}

export const CentralizedRouter: React.FC = () => {
  console.log('🎯 CENTRALIZED_ROUTER: Component mounted/rendered');
  
  const { user, profile, loading, isInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(false);

  // Immediate debug log on every render
  console.log('🎯 CENTRALIZED_ROUTER: Current state', {
    isInitialized,
    loading,
    hasUser: !!user,
    userId: user?.id,
    hasProfile: !!profile,
    profileId: profile?.id,
    onboardingCompleted: profile?.onboarding_completed,
    pathname: location.pathname,
    isChecking
  });

  // Public routes that don't need authentication
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

  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Determine user flow based on authentication and onboarding status
  const determineUserFlow = async (): Promise<UserFlow> => {
    console.log('🎯 CENTRALIZED_ROUTER: Determining user flow', {
      userId: user?.id,
      pathname: location.pathname,
      isPublicRoute,
      hasProfile: !!profile,
      onboardingCompleted: profile?.onboarding_completed
    });

    // If no user, stay on current route (or redirect to landing if on protected route)
    if (!user) {
      if (isPublicRoute) {
        return { shouldRedirect: false, redirectTo: '', reason: 'No user, staying on public route' };
      } else {
        return { shouldRedirect: true, redirectTo: '/', reason: 'No user, redirecting to landing' };
      }
    }

    // If user exists but no profile yet, wait
    if (!profile) {
      return { shouldRedirect: false, redirectTo: '', reason: 'User exists but profile not loaded yet' };
    }

    // Check subscription status from database
    let hasActiveSubscription = false;
    try {
      console.log('🎯 CENTRALIZED_ROUTER: Checking subscription status');
      
      // Check both Razorpay and main subscription tables
      const [razorpayResult, mainResult] = await Promise.allSettled([
        supabase
          .from('razorpay_subscriptions')
          .select('status, expires_at')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single(),
        supabase
          .from('subscriptions')
          .select('status, expires_at')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single()
      ]);

      const razorpayActive = razorpayResult.status === 'fulfilled' && razorpayResult.value;
      const mainActive = mainResult.status === 'fulfilled' && mainResult.value;
      
      hasActiveSubscription = !!(razorpayActive || mainActive);
      
      console.log('🎯 CENTRALIZED_ROUTER: Subscription check result', {
        razorpayActive: !!razorpayActive,
        mainActive: !!mainActive,
        hasActiveSubscription
      });
    } catch (error) {
      console.warn('🎯 CENTRALIZED_ROUTER: Error checking subscription:', error);
    }

    // Determine routing based on onboarding and subscription status
    if (!profile.onboarding_completed) {
      // User hasn't completed onboarding
      if (location.pathname === '/onboarding') {
        return { shouldRedirect: false, redirectTo: '', reason: 'On onboarding page, staying' };
      } else {
        return { shouldRedirect: true, redirectTo: '/onboarding', reason: 'Onboarding not completed' };
      }
    } else if (profile.onboarding_completed && !hasActiveSubscription) {
      // Onboarding completed but no subscription
      if (location.pathname === '/health-assessment') {
        return { shouldRedirect: false, redirectTo: '', reason: 'On health assessment page, staying' };
      } else {
        return { shouldRedirect: true, redirectTo: '/health-assessment', reason: 'Onboarding completed but no subscription' };
      }
    } else if (profile.onboarding_completed && hasActiveSubscription) {
      // Onboarding completed and has subscription
      if (location.pathname === '/dashboard') {
        return { shouldRedirect: false, redirectTo: '', reason: 'On dashboard page, staying' };
      } else {
        return { shouldRedirect: true, redirectTo: '/dashboard', reason: 'Onboarding completed and has subscription' };
      }
    }

    // Default: stay on current route
    return { shouldRedirect: false, redirectTo: '', reason: 'No redirect needed' };
  };

  // Main routing effect - run whenever anything changes
  useEffect(() => {
    console.log('🎯 CENTRALIZED_ROUTER: useEffect triggered', {
      isInitialized,
      loading,
      hasUser: !!user,
      userId: user?.id,
      hasProfile: !!profile,
      profileId: profile?.id,
      onboardingCompleted: profile?.onboarding_completed,
      pathname: location.pathname,
      isChecking
    });

    // Don't run if auth is still loading
    if (!isInitialized || loading) {
      console.log('🎯 CENTRALIZED_ROUTER: Auth still loading, waiting...');
      return;
    }

    // Add a small delay to ensure auth context has fully settled
    const timeoutId = setTimeout(async () => {
      console.log('🎯 CENTRALIZED_ROUTER: Timeout reached, proceeding with routing...');

      // If we have a user but no profile yet, wait for profile to load
      if (user && !profile) {
        console.log('🎯 CENTRALIZED_ROUTER: User exists but profile not loaded yet, waiting...');
        return;
      }

      // Don't run if already checking
      if (isChecking) {
        console.log('🎯 CENTRALIZED_ROUTER: Already checking, skipping...');
        return;
      }

      console.log('🎯 CENTRALIZED_ROUTER: Starting routing logic...');
      setIsChecking(true);

      try {
        const flow = await determineUserFlow();
        
        console.log('🎯 CENTRALIZED_ROUTER: Flow determination result', flow);

        if (flow.shouldRedirect) {
          console.log(`🎯 CENTRALIZED_ROUTER: Redirecting to ${flow.redirectTo} - ${flow.reason}`);
          navigate(flow.redirectTo, { replace: true });
        } else {
          console.log(`🎯 CENTRALIZED_ROUTER: No redirect needed - ${flow.reason}`);
        }
      } catch (error) {
        console.error('🎯 CENTRALIZED_ROUTER: Error in routing logic:', error);
        // On error, redirect to landing page
        navigate('/', { replace: true });
      } finally {
        setIsChecking(false);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [user, profile, isInitialized, loading, location.pathname, navigate, isChecking]);

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-logo-text border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Determining your route...</p>
        </div>
      </div>
    );
  }

  // This component doesn't render anything - it just handles routing logic
  return null;
};
