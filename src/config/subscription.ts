/**
 * Subscription Configuration
 *
 * This file contains configuration settings for subscription management.
 * Modify these settings to control subscription behavior.
 */

export const SUBSCRIPTION_CONFIG = {
  // Set to true to bypass subscription checks (for trial period)
  // Set to false to enforce subscription requirements
  TRIAL_BYPASS_ENABLED: true,

  // Trial period duration in days
  TRIAL_DURATION_DAYS: 3,

  // Whether to show paywall even during trial period
  SHOW_PAYWALL_DURING_TRIAL: true,

  // Features that require subscription
  SUBSCRIPTION_REQUIRED_FEATURES: [
    "dashboard",
    "health-plan",
    "diet",
    "workout",
    "planner",
  ],
} as const;

/**
 * Check if subscription is required for a feature
 */
export const isSubscriptionRequired = (feature: string): boolean => {
  return SUBSCRIPTION_CONFIG.SUBSCRIPTION_REQUIRED_FEATURES.includes(feature);
};

/**
 * Check if trial bypass is enabled
 */
export const isTrialBypassEnabled = (): boolean => {
  return SUBSCRIPTION_CONFIG.TRIAL_BYPASS_ENABLED;
};
