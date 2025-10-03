import { SubscriptionPlan, UserSubscription, SubscriptionStatus } from '@/types/subscription';

/**
 * Check if a subscription is active and not expired
 */
export const isSubscriptionActive = (subscription: UserSubscription | null): boolean => {
  if (!subscription) return false;
  
  const now = new Date();
  const expiryDate = new Date(subscription.current_period_end);
  
  return subscription.status === 'active' && expiryDate > now;
};

/**
 * Check if a subscription is in trial period
 */
export const isSubscriptionTrial = (subscription: UserSubscription | null): boolean => {
  if (!subscription) return false;
  return subscription.status === 'trialing';
};

/**
 * Calculate days until subscription expires
 */
export const getDaysUntilExpiry = (subscription: UserSubscription | null): number => {
  if (!subscription) return 0;
  
  const now = new Date();
  const expiryDate = new Date(subscription.current_period_end);
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return Math.max(0, daysUntilExpiry);
};

/**
 * Check if subscription is expiring soon (within specified days)
 */
export const isExpiringSoon = (subscription: UserSubscription | null, days: number = 7): boolean => {
  const daysUntilExpiry = getDaysUntilExpiry(subscription);
  return daysUntilExpiry <= days && daysUntilExpiry > 0;
};

/**
 * Check if user can access a specific feature based on their plan
 */
export const canAccessFeature = (
  subscription: UserSubscription | null,
  featureName: string,
  currentUsage?: number,
  usageLimit?: number
): boolean => {
  if (!subscription) return false;
  
  // Check if feature is included in the plan
  const hasFeature = subscription.features.includes(featureName);
  if (!hasFeature) return false;
  
  // Check if subscription is active
  if (!isSubscriptionActive(subscription)) return false;
  
  // Check usage limits if provided
  if (usageLimit && currentUsage !== undefined) {
    return currentUsage < usageLimit;
  }
  
  return true;
};

/**
 * Get the plan level (0 = no plan, 1 = basic, 2 = family, 3 = elite)
 */
export const getPlanLevel = (subscription: UserSubscription | null): number => {
  if (!subscription) return 0;
  
  const planLevels: Record<string, number> = {
    'basic': 1,
    'family': 2,
    'elite': 3
  };
  
  return planLevels[subscription.plan_slug] || 0;
};

/**
 * Check if user can upgrade to a specific plan
 */
export const canUpgradeToPlan = (
  currentSubscription: UserSubscription | null,
  targetPlanSlug: string
): boolean => {
  const currentLevel = getPlanLevel(currentSubscription);
  const targetLevel = getPlanLevel({ plan_slug: targetPlanSlug } as UserSubscription);
  
  return targetLevel > currentLevel;
};

/**
 * Get the next available plan for upgrade
 */
export const getNextUpgradePlan = (
  currentSubscription: UserSubscription | null,
  availablePlans: SubscriptionPlan[]
): SubscriptionPlan | null => {
  const currentLevel = getPlanLevel(currentSubscription);
  
  const upgradePlans = availablePlans
    .filter(plan => getPlanLevel({ plan_slug: plan.slug } as UserSubscription) > currentLevel)
    .sort((a, b) => getPlanLevel({ plan_slug: a.slug } as UserSubscription) - getPlanLevel({ plan_slug: b.slug } as UserSubscription));
  
  return upgradePlans[0] || null;
};

/**
 * Calculate subscription savings for annual vs monthly
 */
export const calculateAnnualSavings = (plan: SubscriptionPlan): number => {
  const monthlyTotal = plan.price_monthly * 12;
  return monthlyTotal - plan.price_annual;
};

/**
 * Get subscription status summary
 */
export const getSubscriptionStatusSummary = (subscription: UserSubscription | null): string => {
  if (!subscription) return 'No subscription';
  
  if (isSubscriptionTrial(subscription)) {
    const daysLeft = getDaysUntilExpiry(subscription);
    return `Trial (${daysLeft} days left)`;
  }
  
  if (!isSubscriptionActive(subscription)) {
    return 'Expired';
  }
  
  const daysLeft = getDaysUntilExpiry(subscription);
  if (daysLeft <= 7) {
    return `Expiring soon (${daysLeft} days)`;
  }
  
  return `Active (${daysLeft} days left)`;
};

/**
 * Format subscription price for display
 */
export const formatSubscriptionPrice = (
  plan: SubscriptionPlan,
  billingCycle: 'monthly' | 'annual'
): string => {
  const price = billingCycle === 'annual' ? plan.price_annual : plan.price_monthly;
  return `$${price.toFixed(2)}/${billingCycle === 'annual' ? 'year' : 'month'}`;
};

/**
 * Get feature limits for a specific plan
 */
export const getFeatureLimits = (planSlug: string): Record<string, number | null> => {
  const limits: Record<string, Record<string, number | null>> = {
    basic: {
      ai_consultations: 5,
      health_reports: 3,
      meal_plans: 7,
      family_members: 1,
      storage_gb: 1
    },
    family: {
      ai_consultations: 20,
      health_reports: 10,
      meal_plans: 30,
      family_members: 5,
      storage_gb: 5
    },
    elite: {
      ai_consultations: null, // Unlimited
      health_reports: null,
      meal_plans: null,
      family_members: 10,
      storage_gb: 20
    }
  };
  
  return limits[planSlug] || {};
};

/**
 * Check if a feature has unlimited usage
 */
export const isFeatureUnlimited = (planSlug: string, featureName: string): boolean => {
  const limits = getFeatureLimits(planSlug);
  return limits[featureName] === null;
};

/**
 * Get usage percentage for a feature
 */
export const getUsagePercentage = (
  currentUsage: number,
  limit: number | null
): number => {
  if (!limit) return 0;
  return Math.min((currentUsage / limit) * 100, 100);
};

/**
 * Validate subscription data
 */
export const validateSubscription = (subscription: any): boolean => {
  if (!subscription) return false;
  
  const requiredFields = [
    'id',
    'user_id',
    'plan_id',
    'status',
    'billing_cycle',
    'current_period_start',
    'current_period_end'
  ];
  
  return requiredFields.every(field => subscription.hasOwnProperty(field));
};

/**
 * Get subscription warning level
 */
export const getSubscriptionWarningLevel = (subscription: UserSubscription | null): 'none' | 'warning' | 'critical' => {
  if (!subscription) return 'none';
  
  const daysUntilExpiry = getDaysUntilExpiry(subscription);
  
  if (daysUntilExpiry === 0) return 'critical';
  if (daysUntilExpiry <= 3) return 'critical';
  if (daysUntilExpiry <= 7) return 'warning';
  
  return 'none';
};

/**
 * Format subscription period for display
 */
export const formatSubscriptionPeriod = (subscription: UserSubscription | null): string => {
  if (!subscription) return '';
  
  const startDate = new Date(subscription.current_period_start);
  const endDate = new Date(subscription.current_period_end);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

/**
 * Check if subscription can be renewed
 */
export const canRenewSubscription = (subscription: UserSubscription | null): boolean => {
  if (!subscription) return false;
  
  const daysUntilExpiry = getDaysUntilExpiry(subscription);
  const isExpired = daysUntilExpiry === 0;
  const isCanceled = subscription.status === 'canceled';
  
  return isExpired || isCanceled;
};

/**
 * Get subscription benefits summary
 */
export const getSubscriptionBenefits = (subscription: UserSubscription | null): string[] => {
  if (!subscription) return [];
  
  const benefits: string[] = [];
  
  // Add plan-specific benefits
  switch (subscription.plan_slug) {
    case 'basic':
      benefits.push('AI Health Insights', 'Basic Health Tracking', 'Mobile App Access');
      break;
    case 'family':
      benefits.push('Up to 5 Family Members', 'Family Health Dashboard', 'Shared Meal Planning');
      break;
    case 'elite':
      benefits.push('Unlimited Consultations', 'Personal Health Coach', 'Premium Content');
      break;
  }
  
  // Add trial benefits if applicable
  if (isSubscriptionTrial(subscription)) {
    benefits.push('Trial Period Active');
  }
  
  return benefits;
};

/**
 * Check if user is eligible for first-time pricing
 */
export const isEligibleForFirstTimePricing = async (userId: string): Promise<boolean> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: existingSubscriptions } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .limit(1);
    
    return !existingSubscriptions || existingSubscriptions.length === 0;
  } catch (error) {
    console.error('Error checking first-time pricing eligibility:', error);
    return false;
  }
};

/**
 * Get pricing for user based on first-time eligibility and billing cycle
 */
export const getPricingForUser = (
  plan: SubscriptionPlan, 
  isFirstTime: boolean, 
  billingCycle: 'monthly' | 'annual'
): number => {
  if (isFirstTime) {
    return billingCycle === 'monthly' 
      ? (plan.price_first_time_monthly ?? plan.price_monthly)
      : (plan.price_first_time_annual ?? plan.price_annual);
  }
  
  return billingCycle === 'monthly' ? plan.price_monthly : plan.price_annual;
};

/**
 * Get plan level by slug
 */
export const getPlanLevelBySlug = (planSlug: string): 'basic' | 'family' | 'elite' | 'unknown' => {
  switch (planSlug.toLowerCase()) {
    case 'basic':
      return 'basic';
    case 'family':
      return 'family';
    case 'elite':
      return 'elite';
    default:
      return 'unknown';
  }
}; 