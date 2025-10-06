import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { razorpaySubscriptionService } from '@/services/razorpaySubscriptionService';
import { subscriptionService } from '@/services/subscriptionService';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface SubscriptionFlowHandlerProps {
  children: React.ReactNode;
}

const SubscriptionFlowHandler: React.FC<SubscriptionFlowHandlerProps> = ({ children }) => {
  const { user, profile, isInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);

  // Routes that don't require subscription
  const publicRoutes = [
    '/',
    '/legal',
    '/paywall',
    '/payment-success',
    '/payment-failed',
    '/admin-login',
    '/my-admin',
    '/admin-dashboard',
    '/email-auth',
    '/email-signin',
    '/email-verification',
    '/tasks-demo',
    '/onboarding',
    '/health-assessment'
  ];

  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(location.pathname);

  useEffect(() => {
    const checkUserFlow = async () => {
      // Skip if not initialized or no user
      if (!isInitialized || !user) {
        return;
      }

      // Skip for public routes
      if (isPublicRoute) {
        return;
      }

      // Skip if already checking
      if (isCheckingSubscription) {
        return;
      }

      // Skip if we're already on the correct route to prevent redirect loops
      if (location.pathname === '/onboarding' && !profile?.onboarding_completed) {
        return;
      }
      if (location.pathname === '/health-assessment' && profile?.onboarding_completed && !profile?.subscription_status) {
        return;
      }
      if (location.pathname === '/dashboard' && profile?.onboarding_completed && profile?.subscription_status === 'active') {
        return;
      }

      setIsCheckingSubscription(true);

      try {
        console.log('🔍 Checking user flow for:', user.id);

        // FIRST: Check if onboarding is completed
        if (!profile?.onboarding_completed) {
          console.log('🔄 Onboarding not completed, redirecting to onboarding');
          navigate('/onboarding');
          return;
        }

        // SECOND: Check if user has active subscription (either Razorpay or main system)
        const [razorpayStatus, mainSubscription] = await Promise.all([
          razorpaySubscriptionService.getSubscriptionStatus(user.id),
          subscriptionService.getSubscriptionStatus(user.id)
        ]);

        const hasActiveSubscription = razorpayStatus.hasActiveSubscription || mainSubscription.isActive;

        console.log('📊 Subscription status:', {
          razorpayActive: razorpayStatus.hasActiveSubscription,
          mainActive: mainSubscription.isActive,
          hasActiveSubscription
        });

        if (hasActiveSubscription) {
          // User has subscription and onboarding completed, allow access to dashboard
          console.log('✅ User has active subscription and completed onboarding');
          if (location.pathname !== '/dashboard') {
            navigate('/dashboard');
          }
          return;
        } else {
          // Onboarding completed but no active subscription, redirect to health assessment first
          console.log('🏥 Onboarding completed but no active subscription, redirecting to health assessment');
          if (location.pathname !== '/health-assessment') {
            navigate('/health-assessment');
          }
          return;
        }

      } catch (error) {
        console.error('❌ Error checking user flow:', error);
        // On error, check onboarding first
        if (!profile?.onboarding_completed) {
          navigate('/onboarding');
        } else {
          navigate('/health-assessment');
        }
      } finally {
        setIsCheckingSubscription(false);
      }
    };

    // Add debounce to prevent rapid successive calls
    const timeoutId = setTimeout(checkUserFlow, 100);
    return () => clearTimeout(timeoutId);
  }, [user, profile, isInitialized, isPublicRoute, isCheckingSubscription, navigate, location.pathname]);

  // Show loading while checking subscription
  if (isCheckingSubscription && user && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#88ba82] to-[#95c190]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Checking subscription status...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SubscriptionFlowHandler;
