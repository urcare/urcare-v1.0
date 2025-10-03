/**
 * Subscription Configuration
 *
 * This file contains configuration settings for subscription management.
 * Modify these settings to control subscription behavior.
 */

export const SUBSCRIPTION_CONFIG = {
  // Features that require subscription
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

  // Routes that require active subscription
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

