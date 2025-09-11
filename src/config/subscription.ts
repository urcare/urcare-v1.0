/**
 * Subscription Configuration
 *
 * This file contains configuration settings for subscription management.
 * Modify these settings to control subscription behavior.
 */

export const SUBSCRIPTION_CONFIG = {
  // Set to false to enforce proper subscription requirements
  // Trial bypass is now handled through the trial system
  TRIAL_BYPASS_ENABLED: false,

  // Trial period duration in days
  TRIAL_DURATION_DAYS: 3,

  // Whether to show paywall even during trial period
  SHOW_PAYWALL_DURING_TRIAL: true,

  // Features that require subscription or active trial
  SUBSCRIPTION_REQUIRED_FEATURES: [
    "dashboard",
    "health-plan",
    "diet",
    "workout",
    "planner",
  ],

  // Routes that require authentication
  AUTH_REQUIRED_ROUTES: [
    "/onboarding",
    "/health-assessment",
    "/paywall",
    "/subscription",
    "/welcome-screen",
  ],

  // Routes that require onboarding completion
  ONBOARDING_REQUIRED_ROUTES: [
    "/health-assessment",
    "/paywall",
    "/subscription",
  ],

  // Routes that require active subscription or trial
  SUBSCRIPTION_REQUIRED_ROUTES: [
    "/dashboard",
    "/health-plan",
    "/diet",
    "/workout",
    "/planner",
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
