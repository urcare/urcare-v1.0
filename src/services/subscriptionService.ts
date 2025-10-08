import { supabase } from '../integrations/supabase/client';
import {
  SubscriptionPlan,
  Subscription,
  SubscriptionUsage,
  SubscriptionInvoice,
  UserSubscription,
  SubscriptionCheckResult,
  CreateSubscriptionParams,
  UpdateSubscriptionParams,
  FeatureLimits,
  UsageMetrics,
  SubscriptionStatus
} from '../types/subscription';

class SubscriptionService {
  /**
   * Check if user has an active subscription
   */
  async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('has_active_subscription', { user_uuid: userId });

      if (error) {
        console.error('Error checking active subscription:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error in hasActiveSubscription:', error);
      return false;
    }
  }

  /**
   * Get user's current subscription with plan details
   */
  async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const { data, error } = await supabase
        .rpc('get_user_subscription', { user_uuid: userId });

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
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
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
  async getSubscriptionPlanBySlug(slug: string): Promise<SubscriptionPlan | null> {
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
        .from('subscriptions')
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
  async createSubscription(userId: string, params: CreateSubscriptionParams): Promise<Subscription | null> {
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
        status: trialStart ? 'trialing' : 'active',
        billing_cycle: params.billingCycle,
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
        trial_start: trialStart?.toISOString(),
        trial_end: trialEnd?.toISOString(),
        stripe_customer_id: params.stripeCustomerId,
        metadata: {}
      };

      const { data, error } = await supabase
        .from('unified_subscriptions')
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
  async updateSubscription(subscriptionId: string, params: UpdateSubscriptionParams): Promise<Subscription | null> {
    try {
      const updateData: any = {};

      if (params.planId) {
        const plan = await this.getSubscriptionPlanBySlug(params.planId);
        if (plan) {
          updateData.plan_id = plan.id;
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
        .from('unified_subscriptions')
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
        .from('unified_subscriptions')
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
   * Track feature usage
   */
  async trackFeatureUsage(subscriptionId: string, featureName: string, increment: number = 1): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Get current usage
      const { data: existingUsage } = await supabase
        .from('subscription_usage')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .eq('feature_name', featureName)
        .eq('reset_date', today)
        .single();

      if (existingUsage) {
        // Update existing usage
        const { error } = await supabase
          .from('subscription_usage')
          .update({
            usage_count: existingUsage.usage_count + increment,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUsage.id);

        if (error) {
          console.error('Error updating feature usage:', error);
          return false;
        }
      } else {
        // Create new usage record
        const { error } = await supabase
          .from('subscription_usage')
          .insert({
            subscription_id: subscriptionId,
            feature_name: featureName,
            usage_count: increment,
            reset_date: today
          });

        if (error) {
          console.error('Error creating feature usage:', error);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error in trackFeatureUsage:', error);
      return false;
    }
  }

  /**
   * Get usage for a specific feature
   */
  async getFeatureUsage(subscriptionId: string, featureName: string): Promise<number> {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('subscription_usage')
        .select('usage_count')
        .eq('subscription_id', subscriptionId)
        .eq('feature_name', featureName)
        .eq('reset_date', today)
        .single();

      if (error) {
        return 0;
      }

      return data?.usage_count || 0;
    } catch (error) {
      console.error('Error in getFeatureUsage:', error);
      return 0;
    }
  }

  /**
   * Check if user can access a specific feature
   */
  async canAccessFeature(userId: string, featureName: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) {
        return false;
      }

      // Check if feature is included in the plan
      const hasFeature = subscription.features.includes(featureName);
      if (!hasFeature) {
        return false;
      }

      // Check usage limits if applicable
      const usage = await this.getFeatureUsage(subscription.subscription_id, featureName);
      const limit = this.getFeatureLimit(subscription.plan_slug, featureName);
      
      if (limit && usage >= limit) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in canAccessFeature:', error);
      return false;
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
          getUsageForFeature: () => 0,
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
          return subscription.features.includes(featureName);
        },
        getUsageForFeature: async (featureName: string) => {
          return await this.getFeatureUsage(subscription.subscription_id, featureName);
        },
        getLimitForFeature: (featureName: string) => {
          return this.getFeatureLimit(subscription.plan_slug, featureName);
        }
      };
    } catch (error) {
      console.error('Error in getSubscriptionCheckResult:', error);
      return {
        hasActiveSubscription: false,
        daysUntilExpiry: 0,
        canAccessFeature: () => false,
        getUsageForFeature: () => 0,
        getLimitForFeature: () => null
      };
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
   * Get usage metrics for all features
   */
  async getUsageMetrics(userId: string): Promise<UsageMetrics[]> {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) {
        return [];
      }

      const metrics: UsageMetrics[] = [];
      const today = new Date().toISOString().split('T')[0];

      // Get all usage records for this subscription
      const { data: usageRecords } = await supabase
        .from('subscription_usage')
        .select('*')
        .eq('subscription_id', subscription.subscription_id)
        .eq('reset_date', today);

      for (const feature of subscription.features) {
        const usageRecord = usageRecords?.find(r => r.feature_name === feature);
        const currentUsage = usageRecord?.usage_count || 0;
        const limit = this.getFeatureLimit(subscription.plan_slug, feature);
        const percentageUsed = limit ? (currentUsage / limit) * 100 : 0;

        metrics.push({
          featureName: feature,
          currentUsage,
          limit,
          percentageUsed,
          resetDate: today,
          isOverLimit: limit ? currentUsage > limit : false
        });
      }

      return metrics;
    } catch (error) {
      console.error('Error in getUsageMetrics:', error);
      return [];
    }
  }

  /**
   * Get feature limits based on plan
   */
  private getFeatureLimit(planSlug: string, featureName: string): number | null {
    const featureLimits: FeatureLimits = {
      'ai_consultations': {
        basic: { limit: 5, resetPeriod: 'monthly' },
        family: { limit: 20, resetPeriod: 'monthly' },
        elite: { limit: -1, resetPeriod: 'monthly' } // Unlimited
      },
      'health_reports': {
        basic: { limit: 3, resetPeriod: 'monthly' },
        family: { limit: 10, resetPeriod: 'monthly' },
        elite: { limit: -1, resetPeriod: 'monthly' }
      },
      'meal_plans': {
        basic: { limit: 7, resetPeriod: 'monthly' },
        family: { limit: 30, resetPeriod: 'monthly' },
        elite: { limit: -1, resetPeriod: 'monthly' }
      }
    };

    const planLimits = featureLimits[featureName as keyof FeatureLimits];
    if (!planLimits) {
      return null; // No limit for this feature
    }

    const limit = planLimits[planSlug as keyof typeof planLimits];
    return limit ? (limit.limit === -1 ? null : limit.limit) : null;
  }

  /**
   * Get subscription invoices
   */
  async getSubscriptionInvoices(subscriptionId: string): Promise<SubscriptionInvoice[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_invoices')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching subscription invoices:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSubscriptionInvoices:', error);
      return [];
    }
  }
}

export const subscriptionService = new SubscriptionService(); 