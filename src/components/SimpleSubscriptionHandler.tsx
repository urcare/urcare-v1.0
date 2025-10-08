import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const SimpleSubscriptionHandler: React.FC = () => {
  const { user, profile, isInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);

  useEffect(() => {
    const checkUserFlow = async () => {
      console.log('🔄 SimpleSubscriptionHandler: Checking user flow', {
        isInitialized,
        hasUser: !!user,
        hasProfile: !!profile,
        onboardingCompleted: profile?.onboarding_completed,
        pathname: location.pathname,
        isCheckingSubscription
      });

      // Only run if auth is initialized and user exists
      if (!isInitialized || !user || !profile) {
        console.log('⏸️ Skipping - auth not ready or no user/profile');
        return;
      }

      // Skip for public routes
      const publicRoutes = ['/', '/legal', '/auth', '/auth/callback', '/onboarding', '/health-assessment', '/paywall', '/payment-wall', '/paymentpage', '/phonecheckout', '/paycheckout', '/payment/success', '/payment-success'];
      if (publicRoutes.includes(location.pathname)) {
        console.log('⏸️ Skipping - on public route:', location.pathname);
        return;
      }

      // Skip if already checking
      if (isCheckingSubscription) {
        console.log('⏸️ Skipping - already checking subscription');
        return;
      }

      // CRITICAL: Always check dashboard access regardless of onboarding status
      if (location.pathname === '/dashboard') {
        console.log('🚫 Dashboard access attempt detected - checking subscription status');
        setIsCheckingSubscription(true);

        try {
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
          const hasActiveSubscription = !!(razorpayActive || mainActive);

          console.log('📊 Dashboard access check - Subscription status:', {
            razorpayActive: !!razorpayActive,
            mainActive: !!mainActive,
            hasActiveSubscription,
            razorpayData: razorpayResult.status === 'fulfilled' ? razorpayResult.value : null,
            mainData: mainResult.status === 'fulfilled' ? mainResult.value : null
          });

          if (!hasActiveSubscription) {
            console.log('🚫 No active subscription found - redirecting to health assessment');
            navigate('/health-assessment', { replace: true });
            return;
          } else {
            console.log('✅ Active subscription found - allowing dashboard access');
          }
        } catch (error) {
          console.error('❌ Error checking subscription status for dashboard:', error);
          navigate('/health-assessment', { replace: true });
        } finally {
          setIsCheckingSubscription(false);
        }
        return;
      }

      // STEP 4: Check subscription status after onboarding completion
      if (profile.onboarding_completed) {
        console.log('🔄 STEP 4: Checking subscription status for user:', user.id);
        setIsCheckingSubscription(true);

        try {
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
          const hasActiveSubscription = !!(razorpayActive || mainActive);

          console.log('📊 Subscription status:', {
            razorpayActive: !!razorpayActive,
            mainActive: !!mainActive,
            hasActiveSubscription
          });

          if (hasActiveSubscription) {
            // User has subscription and onboarding completed, allow access to dashboard
            console.log('✅ User has active subscription and completed onboarding');
            if (location.pathname !== '/dashboard') {
              navigate('/dashboard', { replace: true });
            }
          } else {
            // STEP 6: Onboarding completed but no active subscription
            console.log('🏥 Onboarding completed but no active subscription');
            
            // Check if user is already on a payment-related page
            const paymentRoutes = ['/paywall', '/payment-wall', '/paymentpage', '/phonecheckout', '/paycheckout'];
            const isOnPaymentPage = paymentRoutes.includes(location.pathname);
            
            if (isOnPaymentPage) {
              // User is on payment page, allow them to stay
              console.log('💳 User is on payment page, allowing access');
              return;
            } else {
              // Redirect to health assessment first, then they can proceed to payment
              console.log('🏥 Redirecting to health assessment');
              if (location.pathname !== '/health-assessment') {
                navigate('/health-assessment', { replace: true });
              }
            }
          }
        } catch (error) {
          console.error('❌ Error checking subscription status:', error);
          // On error, redirect to health assessment
          navigate('/health-assessment', { replace: true });
        } finally {
          setIsCheckingSubscription(false);
        }
      }
    };

    checkUserFlow();
  }, [user, profile, isInitialized, location.pathname, navigate, isCheckingSubscription]);

  // This component doesn't render anything
  return null;
};
