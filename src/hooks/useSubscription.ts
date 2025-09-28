import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { subscriptionService } from '../services/subscriptionService';
import {
  SubscriptionCheckResult,
  SubscriptionStatus,
  UsageMetrics,
  UserSubscription
} from '../types/subscription';

interface UseSubscriptionReturn {
  // Subscription state
  hasActiveSubscription: boolean;
  subscription: UserSubscription | null;
  subscriptionStatus: SubscriptionStatus | null;
  usageMetrics: UsageMetrics[];
  
  // Loading states
  isLoading: boolean;
  isCheckingSubscription: boolean;
  
  // Methods
  checkSubscription: () => Promise<void>;
  canAccessFeature: (featureName: string) => boolean;
  trackFeatureUsage: (featureName: string, increment?: number) => Promise<boolean>;
  refreshUsageMetrics: () => Promise<void>;
  
  // Computed values
  daysUntilExpiry: number;
  isExpired: boolean;
  canRenew: boolean;
}

export const useSubscription = (): UseSubscriptionReturn => {
  const { user } = useAuth();
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);

  // Check subscription status
  const checkSubscription = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    setIsCheckingSubscription(true);
    try {
      const [hasActive, userSub, status, metrics] = await Promise.all([
        subscriptionService.hasActiveSubscription(user.id),
        subscriptionService.getUserSubscription(user.id),
        subscriptionService.getSubscriptionStatus(user.id),
        subscriptionService.getUsageMetrics(user.id)
      ]);

      setHasActiveSubscription(hasActive);
      setSubscription(userSub);
      setSubscriptionStatus(status);
      setUsageMetrics(metrics);
    } catch (error) {
      console.error('Error checking subscription:', error);
      setHasActiveSubscription(false);
      setSubscription(null);
      setSubscriptionStatus(null);
      setUsageMetrics([]);
    } finally {
      setIsLoading(false);
      setIsCheckingSubscription(false);
    }
  }, [user?.id]);

  // Track feature usage
  const trackFeatureUsage = useCallback(async (featureName: string, increment: number = 1): Promise<boolean> => {
    if (!user?.id || !subscription) {
      return false;
    }

    try {
      const success = await subscriptionService.trackFeatureUsage(
        subscription.subscription_id,
        featureName,
        increment
      );

      if (success) {
        // Refresh usage metrics after tracking
        await refreshUsageMetrics();
      }

      return success;
    } catch (error) {
      console.error('Error tracking feature usage:', error);
      return false;
    }
  }, [user?.id, subscription]);

  // Refresh usage metrics
  const refreshUsageMetrics = useCallback(async () => {
    if (!user?.id) return;

    try {
      const metrics = await subscriptionService.getUsageMetrics(user.id);
      setUsageMetrics(metrics);
    } catch (error) {
      console.error('Error refreshing usage metrics:', error);
    }
  }, [user?.id]);

  // Check if user can access a specific feature
  const canAccessFeature = useCallback((featureName: string): boolean => {
    if (!subscription || !hasActiveSubscription) {
      return false;
    }

    // Check if feature is included in the plan
    const hasFeature = subscription.features.includes(featureName);
    if (!hasFeature) {
      return false;
    }

    // Check if subscription is expired
    if (subscriptionStatus?.isExpired) {
      return false;
    }

    // Check usage limits
    const featureUsage = usageMetrics.find(m => m.featureName === featureName);
    if (featureUsage && featureUsage.isOverLimit) {
      return false;
    }

    return true;
  }, [subscription, hasActiveSubscription, subscriptionStatus, usageMetrics]);

  // Computed values
  const daysUntilExpiry = subscriptionStatus?.daysUntilExpiry || 0;
  const isExpired = subscriptionStatus?.isExpired || false;
  const canRenew = subscriptionStatus?.canRenew || false;

  // Initial subscription check
  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  return {
    // State
    hasActiveSubscription,
    subscription,
    subscriptionStatus,
    usageMetrics,
    
    // Loading states
    isLoading,
    isCheckingSubscription,
    
    // Methods
    checkSubscription,
    canAccessFeature,
    trackFeatureUsage,
    refreshUsageMetrics,
    
    // Computed values
    daysUntilExpiry,
    isExpired,
    canRenew
  };
};

// Hook for checking if a specific feature is accessible
export const useFeatureAccess = (featureName: string) => {
  const { canAccessFeature, hasActiveSubscription, isLoading } = useSubscription();
  
  return {
    canAccess: canAccessFeature(featureName),
    hasSubscription: hasActiveSubscription,
    isLoading
  };
};

// Hook for tracking feature usage
export const useFeatureUsage = (featureName: string) => {
  const { trackFeatureUsage, usageMetrics, isLoading } = useSubscription();
  
  const currentUsage = usageMetrics.find(m => m.featureName === featureName);
  
  return {
    currentUsage: currentUsage?.currentUsage || 0,
    limit: currentUsage?.limit || null,
    percentageUsed: currentUsage?.percentageUsed || 0,
    isOverLimit: currentUsage?.isOverLimit || false,
    trackUsage: (increment?: number) => trackFeatureUsage(featureName, increment),
    isLoading
  };
}; 