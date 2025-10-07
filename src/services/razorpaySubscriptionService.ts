import { supabase } from '../integrations/supabase/client';
import { subscriptionService } from './subscriptionService';

export interface RazorpaySubscriptionData {
  userId: string;
  planSlug: string;
  billingCycle: 'monthly' | 'yearly';
  paymentId: string;
  orderId?: string;
  amount: number;
  currency: string;
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
}

export interface RazorpayPaymentData {
  paymentId: string;
  orderId?: string;
  amount: number;
  currency: string;
  status: 'captured' | 'failed' | 'pending';
  userId: string;
  planSlug: string;
  billingCycle: 'monthly' | 'yearly';
  timestamp: string;
}

class RazorpaySubscriptionService {
  /**
   * Create subscription after successful Razorpay payment
   */
  async createSubscriptionFromPayment(paymentData: RazorpayPaymentData): Promise<boolean> {
    try {
      console.log('🎯 Creating subscription from Razorpay payment:', paymentData);

      // Calculate subscription dates
      const startDate = new Date();
      const endDate = new Date();
      
      if (paymentData.billingCycle === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      // Create subscription record
      const subscriptionData: RazorpaySubscriptionData = {
        userId: paymentData.userId,
        planSlug: paymentData.planSlug,
        billingCycle: paymentData.billingCycle,
        paymentId: paymentData.paymentId,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: 'active',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      // Save to database
      const { error: subscriptionError } = await supabase
        .from('razorpay_subscriptions')
        .insert([subscriptionData]);

      if (subscriptionError) {
        console.error('❌ Error creating Razorpay subscription:', subscriptionError);
        return false;
      }

      // Also create in main subscription system
      const mainSubscription = await subscriptionService.createSubscription(
        paymentData.userId,
        {
          planId: paymentData.planSlug,
          billingCycle: paymentData.billingCycle,
          stripeCustomerId: null, // Not using Stripe
          trialDays: 0
        }
      );

      if (!mainSubscription) {
        console.error('❌ Error creating main subscription');
        return false;
      }

      // Save payment record
      const { error: paymentError } = await supabase
        .from('razorpay_payments')
        .insert([{
          payment_id: paymentData.paymentId,
          order_id: paymentData.orderId,
          user_id: paymentData.userId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: paymentData.status,
          plan_slug: paymentData.planSlug,
          billing_cycle: paymentData.billingCycle,
          created_at: paymentData.timestamp
        }]);

      if (paymentError) {
        console.error('❌ Error saving payment record:', paymentError);
        return false;
      }

      console.log('✅ Razorpay subscription created successfully');
      return true;

    } catch (error) {
      console.error('❌ Error in createSubscriptionFromPayment:', error);
      return false;
    }
  }

  /**
   * Check if user has active Razorpay subscription
   */
  async hasActiveRazorpaySubscription(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('razorpay_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString())
        .single();

      if (error) {
        // If table doesn't exist, return false gracefully
        if (error.code === '42P01') {
          console.warn('Razorpay subscriptions table does not exist yet');
          return false;
        }
        // If no rows found (PGRST116), return false gracefully
        if (error.code === 'PGRST116') {
          return false;
        }
        console.error('Error checking Razorpay subscription:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in hasActiveRazorpaySubscription:', error);
      return false;
    }
  }

  /**
   * Get user's Razorpay subscription
   */
  async getUserRazorpaySubscription(userId: string): Promise<RazorpaySubscriptionData | null> {
    try {
      const { data, error } = await supabase
        .from('razorpay_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        // If table doesn't exist, return null gracefully
        if (error.code === '42P01' || error.status === 404) {
          console.warn('Razorpay subscriptions table does not exist yet');
          return null;
        }
        // If no rows found (PGRST116), return null gracefully
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error getting Razorpay subscription:', error);
        return null;
      }

      // Check if subscription is still active (not expired)
      if (data && data.length > 0) {
        const subscription = data[0];
        const now = new Date();
        const endDate = new Date(subscription.end_date);
        
        if (endDate >= now) {
          return subscription;
        }
      }

      return null;
    } catch (error) {
      console.error('Error in getUserRazorpaySubscription:', error);
      return null;
    }
  }

  /**
   * Update subscription status
   */
  async updateSubscriptionStatus(
    userId: string, 
    status: 'active' | 'expired' | 'cancelled'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('razorpay_subscriptions')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) {
        console.error('Error updating subscription status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateSubscriptionStatus:', error);
      return false;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('razorpay_subscriptions')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) {
        console.error('Error cancelling subscription:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in cancelSubscription:', error);
      return false;
    }
  }

  /**
   * Get subscription status for user
   */
  async getSubscriptionStatus(userId: string): Promise<{
    hasActiveSubscription: boolean;
    subscription: RazorpaySubscriptionData | null;
    daysUntilExpiry: number;
    isExpired: boolean;
  }> {
    try {
      const subscription = await this.getUserRazorpaySubscription(userId);
      
      if (!subscription) {
        return {
          hasActiveSubscription: false,
          subscription: null,
          daysUntilExpiry: 0,
          isExpired: false
        };
      }

      const now = new Date();
      const endDate = new Date(subscription.endDate);
      const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const isExpired = endDate < now;

      return {
        hasActiveSubscription: !isExpired && subscription.status === 'active',
        subscription,
        daysUntilExpiry: Math.max(0, daysUntilExpiry),
        isExpired
      };
    } catch (error) {
      console.error('Error in getSubscriptionStatus:', error);
      return {
        hasActiveSubscription: false,
        subscription: null,
        daysUntilExpiry: 0,
        isExpired: false
      };
    }
  }

  /**
   * Handle webhook payment events
   */
  async handleWebhookPayment(paymentData: any): Promise<boolean> {
    try {
      console.log('📩 Handling Razorpay webhook payment:', paymentData);

      // Extract user information from payment notes or metadata
      const userId = paymentData.notes?.userId || paymentData.metadata?.userId;
      const planSlug = paymentData.notes?.planSlug || paymentData.metadata?.planSlug || 'basic';
      const billingCycle = paymentData.notes?.billingCycle || paymentData.metadata?.billingCycle || 'monthly';

      if (!userId) {
        console.error('❌ No user ID found in payment data');
        return false;
      }

      const razorpayPaymentData: RazorpayPaymentData = {
        paymentId: paymentData.id,
        orderId: paymentData.order_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: paymentData.status === 'captured' ? 'captured' : 'failed',
        userId,
        planSlug,
        billingCycle,
        timestamp: new Date().toISOString()
      };

      if (paymentData.status === 'captured') {
        return await this.createSubscriptionFromPayment(razorpayPaymentData);
      } else {
        console.log('⚠️ Payment not captured, status:', paymentData.status);
        return false;
      }

    } catch (error) {
      console.error('❌ Error handling webhook payment:', error);
      return false;
    }
  }
}

export const razorpaySubscriptionService = new RazorpaySubscriptionService();
