// Unified Subscription Service
// Merges: subscriptionService.ts, razorpaySubscriptionService.ts
// Uses: subscriptions_unified, payments_unified
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionData {
  id: string;
  user_id: string;
  plan_id: string;
  plan_slug: string;
  status: string;
  billing_cycle: string;
  amount: number;
  currency: string;
  payment_provider: string;
  payment_method?: string;
  current_period_start: string;
  current_period_end: string;
  trial_start?: string;
  trial_end?: string;
  cancel_at_period_end: boolean;
  canceled_at?: string;
  provider_subscription_id?: string;
  provider_customer_id?: string;
  provider_order_id?: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

interface PaymentData {
  id: string;
  user_id: string;
  subscription_id?: string;
  plan_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  payment_provider: string;
  provider_transaction_id?: string;
  provider_payment_id?: string;
  provider_order_id?: string;
  provider_merchant_transaction_id?: string;
  provider_response?: any;
  billing_cycle: string;
  is_first_time: boolean;
  failure_reason?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

interface SubscriptionCheckResult {
  hasActiveSubscription: boolean;
  subscription?: SubscriptionData;
  daysUntilExpiry: number;
  canAccessFeature: (featureName: string) => boolean;
  getUsageForFeature: (featureName: string) => Promise<number>;
  getLimitForFeature: (featureName: string) => number | null;
}

interface SubscriptionStatus {
  isActive: boolean;
  isExpired: boolean;
  isCanceled: boolean;
  daysUntilExpiry: number;
  canRenew: boolean;
}

interface UsageMetrics {
  featureName: string;
  currentUsage: number;
  limit: number | null;
  percentageUsed: number;
  resetDate: string;
  isOverLimit: boolean;
}

interface FeatureLimits {
  [featureName: string]: {
    [planSlug: string]: {
      limit: number;
      resetPeriod: string;
    };
  };
}

class UnifiedSubscriptionService {
  /**
   * Check if user has an active subscription
   */
  async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('subscriptions_unified')
        .select('id, status, current_period_end')
        .eq('user_id', userId)
        .eq('status', 'active')
        .gte('current_period_end', new Date().toISOString())
        .limit(1);

      if (error) {
        console.error('Error checking active subscription:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error in hasActiveSubscription:', error);
      return false;
    }
  }

  /**
   * Get user's current subscription with plan details
   */
  async getUserSubscription(userId: string): Promise<SubscriptionData | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions_unified')
        .select(`
          *,
          subscription_plans!inner(
            id,
            name,
            slug,
            features,
            price_monthly,
            price_annual
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .gte('current_period_end', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error getting user subscription:', error);
        return null;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('Error in getUserSubscription:', error);
      return null;
    }
  }

  /**
   * Get all subscription plans
   */
  async getSubscriptionPlans() {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching subscription plans:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSubscriptionPlans:', error);
      return [];
    }
  }

  /**
   * Get a specific subscription plan by slug
   */
  async getSubscriptionPlanBySlug(slug: string) {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching subscription plan:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getSubscriptionPlanBySlug:', error);
      return null;
    }
  }

  /**
   * Check if user is eligible for first-time pricing
   */
  async isEligibleForFirstTimePricing(userId: string): Promise<boolean> {
    try {
      const { data: existingSubscriptions, error } = await supabase
        .from('subscriptions_unified')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (error) {
        console.error('Error checking first-time pricing eligibility:', error);
        return false;
      }

      return !existingSubscriptions || existingSubscriptions.length === 0;
    } catch (error) {
      console.error('Error in isEligibleForFirstTimePricing:', error);
      return false;
    }
  }

  /**
   * Get pricing for user based on first-time eligibility and billing cycle
   */
  async getPricingForUser(userId: string, planSlug: string, billingCycle: 'monthly' | 'annual'): Promise<number> {
    try {
      const [plans, isFirstTime] = await Promise.all([
        this.getSubscriptionPlans(),
        this.isEligibleForFirstTimePricing(userId)
      ]);

      const plan = plans.find(p => p.slug === planSlug);
      if (!plan) {
        console.error('Plan not found:', planSlug);
        return 0;
      }

      if (isFirstTime) {
        return billingCycle === 'monthly' 
          ? (plan.price_first_time_monthly ?? plan.price_monthly)
          : (plan.price_first_time_annual ?? plan.price_annual);
      }

      return billingCycle === 'monthly' ? plan.price_monthly : plan.price_annual;
    } catch (error) {
      console.error('Error in getPricingForUser:', error);
      return 0;
    }
  }

  /**
   * Create a new subscription
   */
  async createSubscription(userId: string, params: {
    planId: string;
    billingCycle: 'monthly' | 'annual';
    stripeCustomerId?: string;
    trialDays?: number;
    paymentProvider?: string;
    amount?: number;
    currency?: string;
  }): Promise<SubscriptionData | null> {
    try {
      const plan = await this.getSubscriptionPlanBySlug(params.planId);
      if (!plan) {
        throw new Error('Plan not found');
      }

      const now = new Date();
      const trialStart = params.trialDays ? now : null;
      const trialEnd = params.trialDays ? new Date(now.getTime() + params.trialDays * 24 * 60 * 60 * 1000) : null;
      
      // Calculate period end based on billing cycle
      const periodStart = trialEnd || now;
      const periodEnd = new Date(periodStart.getTime() + (params.billingCycle === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000);

      const subscriptionData = {
        user_id: userId,
        plan_id: plan.id,
        plan_slug: plan.slug,
        status: trialStart ? 'trialing' : 'active',
        billing_cycle: params.billingCycle,
        amount: params.amount || (params.billingCycle === 'annual' ? plan.price_annual : plan.price_monthly),
        currency: params.currency || 'INR',
        payment_provider: params.paymentProvider || 'manual',
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
        trial_start: trialStart?.toISOString(),
        trial_end: trialEnd?.toISOString(),
        metadata: {}
      };

      const { data, error } = await supabase
        .from('subscriptions_unified')
        .insert(subscriptionData)
        .select()
        .single();

      if (error) {
        console.error('Error creating subscription:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createSubscription:', error);
      return null;
    }
  }

  /**
   * Update subscription
   */
  async updateSubscription(subscriptionId: string, params: {
    planId?: string;
    billingCycle?: string;
    cancelAtPeriodEnd?: boolean;
  }): Promise<SubscriptionData | null> {
    try {
      const updateData: any = {};

      if (params.planId) {
        const plan = await this.getSubscriptionPlanBySlug(params.planId);
        if (plan) {
          updateData.plan_id = plan.id;
          updateData.plan_slug = plan.slug;
        }
      }

      if (params.billingCycle) {
        updateData.billing_cycle = params.billingCycle;
      }

      if (params.cancelAtPeriodEnd !== undefined) {
        updateData.cancel_at_period_end = params.cancelAtPeriodEnd;
        if (params.cancelAtPeriodEnd) {
          updateData.canceled_at = new Date().toISOString();
        }
      }

      const { data, error } = await supabase
        .from('subscriptions_unified')
        .update(updateData)
        .eq('id', subscriptionId)
        .select()
        .single();

      if (error) {
        console.error('Error updating subscription:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in updateSubscription:', error);
      return null;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true): Promise<boolean> {
    try {
      const updateData: any = {
        cancel_at_period_end: cancelAtPeriodEnd,
        canceled_at: new Date().toISOString()
      };

      if (!cancelAtPeriodEnd) {
        updateData.status = 'canceled';
      }

      const { error } = await supabase
        .from('subscriptions_unified')
        .update(updateData)
        .eq('id', subscriptionId);

      if (error) {
        console.error('Error canceling subscription:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in cancelSubscription:', error);
      return false;
    }
  }

  /**
   * Create payment record
   */
  async createPayment(paymentData: {
    userId: string;
    subscriptionId?: string;
    planId: string;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: string;
    paymentProvider: string;
    providerTransactionId?: string;
    providerPaymentId?: string;
    providerOrderId?: string;
    billingCycle: string;
    isFirstTime?: boolean;
  }): Promise<PaymentData | null> {
    try {
      const { data, error } = await supabase
        .from('payments_unified')
        .insert({
          user_id: paymentData.userId,
          subscription_id: paymentData.subscriptionId,
          plan_id: paymentData.planId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: paymentData.status,
          payment_method: paymentData.paymentMethod,
          payment_provider: paymentData.paymentProvider,
          provider_transaction_id: paymentData.providerTransactionId,
          provider_payment_id: paymentData.providerPaymentId,
          provider_order_id: paymentData.providerOrderId,
          billing_cycle: paymentData.billingCycle,
          is_first_time: paymentData.isFirstTime || false
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating payment:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createPayment:', error);
      return null;
    }
  }

  /**
   * Get subscription status details
   */
  async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      if (!subscription) {
        return {
          isActive: false,
          isExpired: false,
          isCanceled: false,
          daysUntilExpiry: 0,
          canRenew: false
        };
      }

      const now = new Date();
      const expiryDate = new Date(subscription.current_period_end);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const isExpired = expiryDate < now;
      const isCanceled = subscription.status === 'canceled';

      return {
        isActive: subscription.status === 'active' && !isExpired,
        isExpired,
        isCanceled,
        daysUntilExpiry: Math.max(0, daysUntilExpiry),
        canRenew: isExpired || isCanceled
      };
    } catch (error) {
      console.error('Error in getSubscriptionStatus:', error);
      return {
        isActive: false,
        isExpired: false,
        isCanceled: false,
        daysUntilExpiry: 0,
        canRenew: false
      };
    }
  }

  /**
   * Get comprehensive subscription check result
   */
  async getSubscriptionCheckResult(userId: string): Promise<SubscriptionCheckResult> {
    try {
      const subscription = await this.getUserSubscription(userId);
      const hasActiveSubscription = !!subscription;
      
      if (!subscription) {
        return {
          hasActiveSubscription: false,
          daysUntilExpiry: 0,
          canAccessFeature: () => false,
          getUsageForFeature: () => Promise.resolve(0),
          getLimitForFeature: () => null
        };
      }

      const now = new Date();
      const expiryDate = new Date(subscription.current_period_end);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return {
        hasActiveSubscription,
        subscription,
        daysUntilExpiry: Math.max(0, daysUntilExpiry),
        canAccessFeature: (featureName: string) => {
          // This would need to be implemented based on plan features
          return true; // Simplified for now
        },
        getUsageForFeature: async (featureName: string) => {
          // This would need to be implemented based on usage tracking
          return 0; // Simplified for now
        },
        getLimitForFeature: (featureName: string) => {
          // This would need to be implemented based on plan limits
          return null; // Simplified for now
        }
      };
    } catch (error) {
      console.error('Error in getSubscriptionCheckResult:', error);
      return {
        hasActiveSubscription: false,
        daysUntilExpiry: 0,
        canAccessFeature: () => false,
        getUsageForFeature: () => Promise.resolve(0),
        getLimitForFeature: () => null
      };
    }
  }

  /**
   * Handle Razorpay payment success
   */
  async handleRazorpayPaymentSuccess(paymentData: {
    userId: string;
    planSlug: string;
    billingCycle: 'monthly' | 'yearly';
    paymentId: string;
    orderId?: string;
    amount: number;
    currency: string;
  }): Promise<boolean> {
    try {
      // Create subscription
      const subscription = await this.createSubscription(paymentData.userId, {
        planId: paymentData.planSlug,
        billingCycle: paymentData.billingCycle,
        paymentProvider: 'razorpay',
        amount: paymentData.amount,
        currency: paymentData.currency
      });

      if (!subscription) {
        console.error('Failed to create subscription');
        return false;
      }

      // Create payment record
      const payment = await this.createPayment({
        userId: paymentData.userId,
        subscriptionId: subscription.id,
        planId: subscription.plan_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: 'captured',
        paymentMethod: 'razorpay',
        paymentProvider: 'razorpay',
        providerTransactionId: paymentData.paymentId,
        providerOrderId: paymentData.orderId,
        billingCycle: paymentData.billingCycle
      });

      if (!payment) {
        console.error('Failed to create payment record');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error handling Razorpay payment success:', error);
      return false;
    }
  }

  /**
   * Handle PhonePe payment success
   */
  async handlePhonePePaymentSuccess(paymentData: {
    userId: string;
    planSlug: string;
    billingCycle: 'monthly' | 'yearly';
    transactionId: string;
    amount: number;
    currency: string;
  }): Promise<boolean> {
    try {
      // Create subscription
      const subscription = await this.createSubscription(paymentData.userId, {
        planId: paymentData.planSlug,
        billingCycle: paymentData.billingCycle,
        paymentProvider: 'phonepe',
        amount: paymentData.amount,
        currency: paymentData.currency
      });

      if (!subscription) {
        console.error('Failed to create subscription');
        return false;
      }

      // Create payment record
      const payment = await this.createPayment({
        userId: paymentData.userId,
        subscriptionId: subscription.id,
        planId: subscription.plan_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: 'captured',
        paymentMethod: 'phonepe',
        paymentProvider: 'phonepe',
        providerTransactionId: paymentData.transactionId,
        billingCycle: paymentData.billingCycle
      });

      if (!payment) {
        console.error('Failed to create payment record');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error handling PhonePe payment success:', error);
      return false;
    }
  }
}

export const unifiedSubscriptionService = new UnifiedSubscriptionService();

// Export individual functions for backward compatibility
export const hasActiveSubscription = unifiedSubscriptionService.hasActiveSubscription.bind(unifiedSubscriptionService);
export const getUserSubscription = unifiedSubscriptionService.getUserSubscription.bind(unifiedSubscriptionService);
export const getSubscriptionPlans = unifiedSubscriptionService.getSubscriptionPlans.bind(unifiedSubscriptionService);
export const getSubscriptionPlanBySlug = unifiedSubscriptionService.getSubscriptionPlanBySlug.bind(unifiedSubscriptionService);
export const isEligibleForFirstTimePricing = unifiedSubscriptionService.isEligibleForFirstTimePricing.bind(unifiedSubscriptionService);
export const getPricingForUser = unifiedSubscriptionService.getPricingForUser.bind(unifiedSubscriptionService);
export const createSubscription = unifiedSubscriptionService.createSubscription.bind(unifiedSubscriptionService);
export const updateSubscription = unifiedSubscriptionService.updateSubscription.bind(unifiedSubscriptionService);
export const cancelSubscription = unifiedSubscriptionService.cancelSubscription.bind(unifiedSubscriptionService);
export const getSubscriptionStatus = unifiedSubscriptionService.getSubscriptionStatus.bind(unifiedSubscriptionService);
export const getSubscriptionCheckResult = unifiedSubscriptionService.getSubscriptionCheckResult.bind(unifiedSubscriptionService);
export const handleRazorpayPaymentSuccess = unifiedSubscriptionService.handleRazorpayPaymentSuccess.bind(unifiedSubscriptionService);
export const handlePhonePePaymentSuccess = unifiedSubscriptionService.handlePhonePePaymentSuccess.bind(unifiedSubscriptionService);
