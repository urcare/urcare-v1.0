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
    '/tasks-demo'
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

      setIsCheckingSubscription(true);

      try {
        console.log('🔍 Checking user flow for:', user.id);

        // Check if user has active subscription (either Razorpay or main system)
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
          // User has active subscription, check onboarding
          if (!profile?.onboarding_completed) {
            console.log('🔄 User has subscription but onboarding not completed, redirecting to onboarding');
            navigate('/onboarding-health-assessment');
            return;
          }

          // User has subscription and onboarding completed, allow access to dashboard
          console.log('✅ User has active subscription and completed onboarding');
          return;
        } else {
          // No active subscription, redirect to paywall
          console.log('💳 No active subscription, redirecting to paywall');
          navigate('/paywall');
          return;
        }

      } catch (error) {
        console.error('❌ Error checking user flow:', error);
        // On error, redirect to paywall to be safe
        navigate('/paywall');
      } finally {
        setIsCheckingSubscription(false);
      }
    };

    checkUserFlow();
  }, [user, profile, isInitialized, isPublicRoute, isCheckingSubscription, navigate]);

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
