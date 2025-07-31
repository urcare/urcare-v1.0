import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { razorpayService } from '@/services/razorpayService';
import { subscriptionService } from '@/services/subscriptionService';
import { SubscriptionPaymentData, InternationalPaymentData } from '@/types/razorpay';
import { RazorpayConfig } from '@/types/razorpay';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface UseRazorpayReturn {
  loading: boolean;
  error: string | null;
  initiatePayment: (planSlug: string, billingCycle: 'monthly' | 'annual') => Promise<void>;
  verifyPayment: (paymentId: string, orderId: string, signature: string) => Promise<boolean>;
  getUserCurrency: () => Promise<string>;
  getSupportedPaymentMethods: (currency: string) => Promise<string[]>;
}

export const useRazorpay = (): UseRazorpayReturn => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserCurrency = useCallback(async (): Promise<string> => {
    if (!user) return 'INR';
    
    try {
      // This would typically call the service method
      // For now, we'll use a simple implementation
      const { data: profile } = await import('@/integrations/supabase/client').then(
        ({ supabase }) => supabase
          .from('profiles')
          .select('country, currency')
          .eq('id', user.id)
          .single()
      );

      if (profile?.currency) {
        return profile.currency;
      }

      // Map country to currency
      const countryCurrencyMap: Record<string, string> = {
        'IN': 'INR',
        'US': 'USD',
        'GB': 'GBP',
        'EU': 'EUR',
        'CA': 'CAD',
        'AU': 'AUD',
        'JP': 'JPY',
        'SG': 'SGD',
        'AE': 'AED',
        'SA': 'SAR'
      };

      return countryCurrencyMap[profile?.country || 'IN'] || 'INR';
    } catch (error) {
      console.error('Error getting user currency:', error);
      return 'INR';
    }
  }, [user]);

  const getSupportedPaymentMethods = useCallback(async (currency: string): Promise<string[]> => {
    // Define payment methods by currency/region
    const paymentMethodsByCurrency: Record<string, string[]> = {
      'INR': ['card', 'upi', 'netbanking', 'wallet', 'emi'],
      'USD': ['card', 'paypal'],
      'EUR': ['card', 'sofort', 'giropay', 'ideal'],
      'GBP': ['card', 'bacs'],
      'CAD': ['card', 'interac'],
      'AUD': ['card', 'bpay'],
      'JPY': ['card', 'konbini'],
      'SGD': ['card', 'paynow'],
      'AED': ['card', 'mada'],
      'SAR': ['card', 'mada']
    };

    return paymentMethodsByCurrency[currency] || ['card'];
  }, []);

  const initiatePayment = useCallback(async (planSlug: string, billingCycle: 'monthly' | 'annual') => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if user is eligible for first-time pricing
      const isFirstTime = await subscriptionService.isEligibleForFirstTimePricing(user.id);
      
      // Get user's currency
      const currency = await getUserCurrency();
      
      // Calculate amount in user's currency
      const pricing = await razorpayService.calculateAmount(planSlug, billingCycle, isFirstTime, user.id);
      
      // Get supported payment methods for the currency
      const paymentMethods = await getSupportedPaymentMethods(currency);

      // Create payment data
      const paymentData: InternationalPaymentData = {
        userId: user.id,
        planSlug,
        billingCycle,
        isFirstTime,
        amount: pricing.amount,
        currency: pricing.currency,
        userCurrency: currency,
        paymentMethods
      };

      // Create Razorpay order
      const order = await razorpayService.createOrder(paymentData);

      // Load Razorpay script
      await loadRazorpayScript();

      // Configure Razorpay
      const options: RazorpayConfig = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'UrCare Health',
        description: `${planSlug.charAt(0).toUpperCase() + planSlug.slice(1)} Plan - ${billingCycle}`,
        order_id: order.id,
        prefill: {
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
          contact: user.phone || ''
        },
        notes: {
          userId: user.id,
          planSlug,
          billingCycle,
          isFirstTime: isFirstTime.toString(),
          currency: currency
        },
        theme: {
          color: '#10B981'
        },
        handler: async (response: any) => {
          try {
            const success = await razorpayService.verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature,
              user.id
            );

            if (success) {
              // Update subscription status
              await subscriptionService.createSubscription(
                user.id,
                planSlug,
                billingCycle,
                isFirstTime
              );
              
              console.log('Payment successful!');
              // You can add success callback here
            } else {
              setError('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setError('Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal closed');
            setLoading(false);
          }
        }
      };

      // Open Razorpay modal
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Error initiating payment:', error);
      setError(error instanceof Error ? error.message : 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  }, [user, getUserCurrency, getSupportedPaymentMethods]);

  const verifyPayment = useCallback(async (paymentId: string, orderId: string, signature: string): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      return await razorpayService.verifyPayment(paymentId, orderId, signature, user.id);
    } catch (error) {
      console.error('Payment verification error:', error);
      setError(error instanceof Error ? error.message : 'Payment verification failed');
      return false;
    }
  }, [user]);

  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.head.appendChild(script);
    });
  };

  return {
    loading,
    error,
    initiatePayment,
    verifyPayment,
    getUserCurrency,
    getSupportedPaymentMethods
  };
}; 