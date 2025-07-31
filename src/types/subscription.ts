export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price_monthly: number;
  price_annual: number;
  price_first_time_monthly?: number;
  price_first_time_annual?: number;
  features: string[];
  max_users: number;
  max_storage_gb: number;
  is_active: boolean;
  is_popular: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
  billing_cycle: 'monthly' | 'annual';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at?: string;
  trial_start?: string;
  trial_end?: string;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionUsage {
  id: string;
  subscription_id: string;
  feature_name: string;
  usage_count: number;
  usage_limit?: number;
  reset_date: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionInvoice {
  id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'canceled';
  stripe_invoice_id?: string;
  due_date?: string;
  paid_at?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface UserSubscription {
  subscription_id: string;
  plan_name: string;
  plan_slug: string;
  status: string;
  billing_cycle: string;
  current_period_end: string;
  features: string[];
}

export interface SubscriptionWithPlan extends Subscription {
  plan: SubscriptionPlan;
}

export interface SubscriptionCheckResult {
  hasActiveSubscription: boolean;
  subscription?: UserSubscription;
  isTrialActive: boolean;
  daysUntilExpiry: number;
  canAccessFeature: (featureName: string) => boolean;
  getUsageForFeature: (featureName: string) => number;
  getLimitForFeature: (featureName: string) => number | null;
}

export interface CreateSubscriptionParams {
  planId: string;
  billingCycle: 'monthly' | 'annual';
  stripeCustomerId?: string;
  trialDays?: number;
}

export interface UpdateSubscriptionParams {
  planId?: string;
  billingCycle?: 'monthly' | 'annual';
  cancelAtPeriodEnd?: boolean;
}

export interface FeatureLimits {
  [featureName: string]: {
    limit: number;
    resetPeriod: 'daily' | 'monthly' | 'yearly';
  };
}

export interface SubscriptionTier {
  id: string;
  name: string;
  originalPrice: number;
  firstTimePrice: number;
  annualPrice: number;
  features: string[];
  popular?: boolean;
  icon: React.ComponentType<any>;
  color: string;
}

export interface BillingCycle {
  type: 'monthly' | 'annual';
  price: number;
  savings?: number;
  isPopular?: boolean;
}

export interface SubscriptionStatus {
  isActive: boolean;
  isTrial: boolean;
  isExpired: boolean;
  isCanceled: boolean;
  daysUntilExpiry: number;
  canRenew: boolean;
}

export interface UsageMetrics {
  featureName: string;
  currentUsage: number;
  limit: number | null;
  percentageUsed: number;
  resetDate: string;
  isOverLimit: boolean;
}

export interface SubscriptionAnalytics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  canceledSubscriptions: number;
  revenue: {
    monthly: number;
    annual: number;
    total: number;
  };
  popularPlans: Array<{
    planName: string;
    count: number;
  }>;
  churnRate: number;
  averageLifetime: number;
} 