// Subscription Service Adapter for Backward Compatibility
// Routes calls to unified subscription service while maintaining old interfaces
import { unifiedSubscriptionService } from '../unifiedSubscriptionService';

// Re-export all functions from unified service with deprecation warnings
export const hasActiveSubscription = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] hasActiveSubscription is deprecated. Use unifiedSubscriptionService.hasActiveSubscription instead.');
  return unifiedSubscriptionService.hasActiveSubscription(...args);
};

export const getUserSubscription = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] getUserSubscription is deprecated. Use unifiedSubscriptionService.getUserSubscription instead.');
  return unifiedSubscriptionService.getUserSubscription(...args);
};

export const getSubscriptionPlans = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] getSubscriptionPlans is deprecated. Use unifiedSubscriptionService.getSubscriptionPlans instead.');
  return unifiedSubscriptionService.getSubscriptionPlans(...args);
};

export const getSubscriptionPlanBySlug = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] getSubscriptionPlanBySlug is deprecated. Use unifiedSubscriptionService.getSubscriptionPlanBySlug instead.');
  return unifiedSubscriptionService.getSubscriptionPlanBySlug(...args);
};

export const isEligibleForFirstTimePricing = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] isEligibleForFirstTimePricing is deprecated. Use unifiedSubscriptionService.isEligibleForFirstTimePricing instead.');
  return unifiedSubscriptionService.isEligibleForFirstTimePricing(...args);
};

export const getPricingForUser = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] getPricingForUser is deprecated. Use unifiedSubscriptionService.getPricingForUser instead.');
  return unifiedSubscriptionService.getPricingForUser(...args);
};

export const createSubscription = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] createSubscription is deprecated. Use unifiedSubscriptionService.createSubscription instead.');
  return unifiedSubscriptionService.createSubscription(...args);
};

export const updateSubscription = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] updateSubscription is deprecated. Use unifiedSubscriptionService.updateSubscription instead.');
  return unifiedSubscriptionService.updateSubscription(...args);
};

export const cancelSubscription = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] cancelSubscription is deprecated. Use unifiedSubscriptionService.cancelSubscription instead.');
  return unifiedSubscriptionService.cancelSubscription(...args);
};

export const getSubscriptionStatus = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] getSubscriptionStatus is deprecated. Use unifiedSubscriptionService.getSubscriptionStatus instead.');
  return unifiedSubscriptionService.getSubscriptionStatus(...args);
};

export const getSubscriptionCheckResult = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] getSubscriptionCheckResult is deprecated. Use unifiedSubscriptionService.getSubscriptionCheckResult instead.');
  return unifiedSubscriptionService.getSubscriptionCheckResult(...args);
};

// Razorpay-specific functions
export const handleRazorpayPaymentSuccess = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] handleRazorpayPaymentSuccess is deprecated. Use unifiedSubscriptionService.handleRazorpayPaymentSuccess instead.');
  return unifiedSubscriptionService.handleRazorpayPaymentSuccess(...args);
};

// PhonePe-specific functions
export const handlePhonePePaymentSuccess = (...args: any[]) => {
  console.warn('⚠️ [DEPRECATED] handlePhonePePaymentSuccess is deprecated. Use unifiedSubscriptionService.handlePhonePePaymentSuccess instead.');
  return unifiedSubscriptionService.handlePhonePePaymentSuccess(...args);
};

// Export the unified service for direct access
export { unifiedSubscriptionService };

// Create a subscription service class for backward compatibility
export class SubscriptionService {
  async hasActiveSubscription(userId: string) {
    return unifiedSubscriptionService.hasActiveSubscription(userId);
  }

  async getUserSubscription(userId: string) {
    return unifiedSubscriptionService.getUserSubscription(userId);
  }

  async getSubscriptionPlans() {
    return unifiedSubscriptionService.getSubscriptionPlans();
  }

  async getSubscriptionPlanBySlug(slug: string) {
    return unifiedSubscriptionService.getSubscriptionPlanBySlug(slug);
  }

  async isEligibleForFirstTimePricing(userId: string) {
    return unifiedSubscriptionService.isEligibleForFirstTimePricing(userId);
  }

  async getPricingForUser(userId: string, planSlug: string, billingCycle: 'monthly' | 'annual') {
    return unifiedSubscriptionService.getPricingForUser(userId, planSlug, billingCycle);
  }

  async createSubscription(userId: string, params: any) {
    return unifiedSubscriptionService.createSubscription(userId, params);
  }

  async updateSubscription(subscriptionId: string, params: any) {
    return unifiedSubscriptionService.updateSubscription(subscriptionId, params);
  }

  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true) {
    return unifiedSubscriptionService.cancelSubscription(subscriptionId, cancelAtPeriodEnd);
  }

  async getSubscriptionStatus(userId: string) {
    return unifiedSubscriptionService.getSubscriptionStatus(userId);
  }

  async getSubscriptionCheckResult(userId: string) {
    return unifiedSubscriptionService.getSubscriptionCheckResult(userId);
  }
}

export const subscriptionService = new SubscriptionService();
