import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface UserFlowState {
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
  hasActiveSubscription: boolean;
  currentStep: 'landing' | 'onboarding' | 'health-assessment' | 'paywall' | 'dashboard';
  nextRoute: string;
  canAccessDashboard: boolean;
}

class RoutingFlowService {
  /**
   * Determine the correct route for a user based on their current state
   */
  async getCorrectRoute(user: User | null, profile?: any): Promise<string> {
    console.log("🔍 Determining route for user:", user?.id, "profile:", profile?.onboarding_completed);

    // No user - go to landing
    if (!user) {
      return "/";
    }

    // Check if onboarding is completed
    const isOnboardingComplete = profile?.onboarding_completed ?? false;
    console.log("🔍 Onboarding completed:", isOnboardingComplete);

    // First time user flow: landing > onboarding > health-assessment > paywall > dashboard
    if (!isOnboardingComplete) {
      console.log("🔍 First time user - redirecting to onboarding");
      return "/onboarding";
    }

    // Returning user flow: landing > if onboarding completed > paywall if valid subscription > dashboard
    if (isOnboardingComplete) {
      // Check if user has active subscription
      const hasActiveSubscription = await this.checkActiveSubscription(user.id);
      console.log("🔍 Has active subscription:", hasActiveSubscription);

      if (hasActiveSubscription) {
        console.log("🔍 Returning user with subscription - redirecting to dashboard");
        return "/dashboard";
      } else {
        console.log("🔍 Returning user without subscription - redirecting to paywall");
        return "/paywall";
      }
    }

    // Fallback
    return "/dashboard";
  }

  /**
   * Check if user has an active subscription
   */
  private async checkActiveSubscription(userId: string): Promise<boolean> {
    try {
      // Check user_profiles table for subscription status
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("subscription_status, subscription_expires_at")
        .eq("id", userId)
        .single();

      if (error) {
        console.warn("Error checking subscription:", error);
        return false;
      }

      // Check if subscription is active
      if (profile?.subscription_status === 'active') {
        // Check if subscription hasn't expired
        if (profile?.subscription_expires_at) {
          const expiresAt = new Date(profile.subscription_expires_at);
          const now = new Date();
          return expiresAt > now;
        }
        return true;
      }

      return false;
    } catch (error) {
      console.warn("Error checking subscription:", error);
      return false;
    }
  }

  /**
   * Get the user's current flow state
   */
  async getUserFlowState(user: User | null, profile?: any): Promise<UserFlowState> {
    if (!user) {
      return {
        isAuthenticated: false,
        isOnboardingComplete: false,
        hasActiveSubscription: false,
        currentStep: 'landing',
        nextRoute: '/',
        canAccessDashboard: false,
      };
    }

    const isOnboardingComplete = profile?.onboarding_completed ?? false;
    const hasActiveSubscription = await this.checkActiveSubscription(user.id);

    let currentStep: UserFlowState['currentStep'] = 'landing';
    let nextRoute = '/';
    let canAccessDashboard = false;

    if (!isOnboardingComplete) {
      currentStep = 'onboarding';
      nextRoute = '/onboarding';
    } else if (hasActiveSubscription) {
      currentStep = 'dashboard';
      nextRoute = '/dashboard';
      canAccessDashboard = true;
    } else {
      currentStep = 'paywall';
      nextRoute = '/paywall';
    }

    return {
      isAuthenticated: true,
      isOnboardingComplete,
      hasActiveSubscription,
      currentStep,
      nextRoute,
      canAccessDashboard,
    };
  }

  /**
   * Check if user can access a specific route
   */
  async canAccessRoute(user: User | null, route: string, profile?: any): Promise<boolean> {
    // Public routes
    const publicRoutes = ["/", "/auth", "/auth/callback", "/legal", "/admin-login", "/my-admin", "/admin-dashboard", "/email-auth", "/email-signin", "/email-verification", "/tasks-demo"];
    if (publicRoutes.includes(route)) {
      return true;
    }

    // No user - only public routes allowed
    if (!user) {
      return false;
    }

    const isOnboardingComplete = profile?.onboarding_completed ?? false;

    // Routes accessible after onboarding
    const postOnboardingRoutes = [
      "/dashboard",
      "/health-assessment", 
      "/health-plan",
      "/health-plan-generation",
      "/custom-plan",
      "/diet",
      "/workout",
      "/planner",
      "/plan-details",
      "/subscription",
      "/settings",
      "/profile-management",
      "/camera",
      "/goals",
      "/progress",
      "/welcome-screen"
    ];

    // Routes accessible before onboarding completion
    const preOnboardingRoutes = [
      "/onboarding",
      "/onboarding-healthassessment-screen"
    ];

    // Payment routes (always accessible)
    const paymentRoutes = [
      "/paywall",
      "/payment-wall",
      "/paymentpage",
      "/phonecheckout",
      "/paycheckout",
      "/phonecheckout/result",
      "/payment/success",
      "/payment/failure",
      "/mock-phonepe-payment",
      "/phonepe-qr-fallback",
      "/test-phonepe",
      "/phonepe-test",
      "/phonepe-test-no-auth",
      "/phonepe-simple",
      "/payment/phonepe/success"
    ];

    if (paymentRoutes.includes(route)) {
      return true;
    }

    if (preOnboardingRoutes.includes(route)) {
      return !isOnboardingComplete;
    }

    if (postOnboardingRoutes.includes(route)) {
      return isOnboardingComplete;
    }

    return false;
  }
}

export const routingFlowService = new RoutingFlowService();
