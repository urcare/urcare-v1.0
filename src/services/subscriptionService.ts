import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_monthly: number;
  price_annual: number;
  original_price_monthly?: number;
  original_price_annual?: number;
  features: string[];
  is_active: boolean;
}

export interface UserSubscription {
  subscription_id: string;
  plan_name: string;
  plan_slug: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  billing_cycle: 'monthly' | 'annual';
  current_period_end: string;
  is_active: boolean;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  razorpay_payment_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'captured' | 'failed' | 'refunded';
  billing_cycle: 'monthly' | 'annual';
  plan_name: string;
  created_at: string;
}

class SubscriptionService {
  // =====================================================
  // Razorpay Payment Links
  // =====================================================
  private readonly RAZORPAY_LINKS = {
    monthly: "https://razorpay.me/@urcare?amount=vy%2F7jJNxh9pvHsb2%2Bqs52w%3D%3D",
    annual: "https://razorpay.me/@urcare?amount=6zcPuaHTrIB8Jllw5habFw%3D%3D"
  };

  private readonly PLAN_PRICES = {
    monthly: 9.57,
    annual: 56.36,
    original_monthly: 19.99,
    original_annual: 149.99
  };

  // =====================================================
  // Get Available Subscription Plans
  // =====================================================
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });

      if (error) {
        console.error('Error fetching subscription plans:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch subscription plans:', error);
      throw error;
    }
  }

  // =====================================================
  // Get User's Current Subscription
  // =====================================================
  async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const { data, error } = await supabase
        .rpc('get_user_subscription', { p_user_id: userId });

      if (error) {
        console.error('Error fetching user subscription:', error);
        throw error;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('Failed to fetch user subscription:', error);
      throw error;
    }
  }

  // =====================================================
  // Check if User Has Active Subscription
  // =====================================================
  async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      return subscription?.is_active || false;
    } catch (error) {
      console.error('Failed to check active subscription:', error);
      return false;
    }
  }

  // =====================================================
  // Create Subscription After Payment
  // =====================================================
  async createSubscription(
    userId: string,
    planSlug: string,
    billingCycle: 'monthly' | 'annual',
    razorpayPaymentId?: string,
    razorpaySubscriptionId?: string
  ): Promise<string> {
    try {
      const { data, error } = await supabase
        .rpc('create_subscription', {
          p_user_id: userId,
          p_plan_slug: planSlug,
          p_billing_cycle: billingCycle,
          p_razorpay_payment_id: razorpayPaymentId,
          p_razorpay_subscription_id: razorpaySubscriptionId
        });

      if (error) {
        console.error('Error creating subscription:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to create subscription:', error);
      throw error;
    }
  }

  // =====================================================
  // Record Payment Transaction
  // =====================================================
  async recordPayment(
    userId: string,
    razorpayPaymentId: string,
    amount: number,
    billingCycle: 'monthly' | 'annual',
    planName: string,
    status: 'pending' | 'captured' | 'failed' | 'refunded' = 'captured'
  ): Promise<string> {
    try {
      const { data, error } = await supabase
        .rpc('record_payment', {
          p_user_id: userId,
          p_razorpay_payment_id: razorpayPaymentId,
          p_amount: amount,
          p_billing_cycle: billingCycle,
          p_plan_name: planName,
          p_status: status
        });

      if (error) {
        console.error('Error recording payment:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to record payment:', error);
      throw error;
    }
  }

  // =====================================================
  // Get Payment Link for Billing Cycle
  // =====================================================
  getPaymentLink(billingCycle: 'monthly' | 'annual', successUrl?: string): string {
    const baseLink = this.RAZORPAY_LINKS[billingCycle];
    
    if (successUrl) {
      const encodedUrl = encodeURIComponent(successUrl);
      return `${baseLink}&redirect_url=${encodedUrl}`;
    }
    
    return baseLink;
  }

  // =====================================================
  // Get Plan Pricing
  // =====================================================
  getPlanPricing() {
    return this.PLAN_PRICES;
  }

  // =====================================================
  // Handle Payment Success
  // =====================================================
  async handlePaymentSuccess(
    userId: string,
    billingCycle: 'monthly' | 'annual',
    razorpayPaymentId: string,
    planName: string = 'UrCare Basic'
  ): Promise<void> {
    try {
      // Record the payment
      const amount = billingCycle === 'monthly' 
        ? this.PLAN_PRICES.monthly 
        : this.PLAN_PRICES.annual;

      await this.recordPayment(
        userId,
        razorpayPaymentId,
        amount,
        billingCycle,
        planName,
        'captured'
      );

      // Create the subscription
      await this.createSubscription(
        userId,
        'basic',
        billingCycle,
        razorpayPaymentId
      );

      console.log('✅ Payment and subscription created successfully');
    } catch (error) {
      console.error('❌ Failed to handle payment success:', error);
      throw error;
    }
  }

  // =====================================================
  // Cancel Subscription
  // =====================================================
  async cancelSubscription(userId: string): Promise<boolean> {
    try {
        const { error } = await supabase
        .from('user_subscriptions')
          .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
          })
        .eq('user_id', userId)
        .eq('status', 'active');

        if (error) {
        console.error('Error cancelling subscription:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      return false;
    }
  }

  // =====================================================
  // Get User's Payment History
  // =====================================================
  async getPaymentHistory(userId: string): Promise<PaymentTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payment history:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      throw error;
    }
  }

  // =====================================================
  // Check Subscription Status
  // =====================================================
  async checkSubscriptionStatus(userId: string): Promise<{
    hasActiveSubscription: boolean;
    subscription: UserSubscription | null;
    isExpired: boolean;
    daysUntilExpiry: number | null;
  }> {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      if (!subscription) {
        return {
          hasActiveSubscription: false,
          subscription: null,
          isExpired: false,
          daysUntilExpiry: null
        };
      }

      const isExpired = subscription.status === 'expired' || 
        (subscription.status === 'active' && new Date(subscription.current_period_end) < new Date());
      
      const daysUntilExpiry = subscription.status === 'active' 
        ? Math.ceil((new Date(subscription.current_period_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null;

      return {
        hasActiveSubscription: subscription.is_active && !isExpired,
        subscription,
        isExpired,
        daysUntilExpiry
      };
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      return {
        hasActiveSubscription: false,
        subscription: null,
        isExpired: false,
        daysUntilExpiry: null
      };
    }
  }
}

// Export singleton instance
export const subscriptionService = new SubscriptionService();
export default subscriptionService;
