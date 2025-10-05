import type { User } from "@supabase/supabase-js";

export interface SimpleUserFlowState {
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
  currentStep: 'landing' | 'onboarding' | 'dashboard';
  nextRoute: string;
}

class SimpleRoutingService {
  /**
   * Get the correct route for a user based on their current state
   */
  async getCorrectRoute(user: User | null, profile?: any): Promise<string> {
    console.log("🔍 SimpleRoutingService: Determining route for user:", user?.id);

    // No user - go to landing
    if (!user) {
      console.log("🔍 No user - redirecting to landing");
      return "/";
    }

    // Check if onboarding is completed
    const isOnboardingComplete = profile?.onboarding_completed ?? false;
    console.log("🔍 Onboarding completed:", isOnboardingComplete);

    // Simple routing logic
    if (!isOnboardingComplete) {
      console.log("🔍 User needs onboarding - redirecting to onboarding");
      return "/onboarding";
    } else {
      console.log("🔍 User completed onboarding - redirecting to dashboard");
      return "/dashboard";
    }
  }

  /**
   * Get the user's current flow state
   */
  async getUserFlowState(user: User | null, profile?: any): Promise<SimpleUserFlowState> {
    if (!user) {
      return {
        isAuthenticated: false,
        isOnboardingComplete: false,
        currentStep: 'landing',
        nextRoute: '/',
      };
    }

    const isOnboardingComplete = profile?.onboarding_completed ?? false;

    let currentStep: SimpleUserFlowState['currentStep'] = 'landing';
    let nextRoute = '/';

    if (!isOnboardingComplete) {
      currentStep = 'onboarding';
      nextRoute = '/onboarding';
    } else {
      currentStep = 'dashboard';
      nextRoute = '/dashboard';
    }

    return {
      isAuthenticated: true,
      isOnboardingComplete,
      currentStep,
      nextRoute,
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
      "/welcome-screen",
      "/paywall", // Always accessible
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

    // Routes accessible before onboarding completion
    const preOnboardingRoutes = [
      "/onboarding",
      "/onboarding-healthassessment-screen"
    ];

    if (preOnboardingRoutes.includes(route)) {
      return !isOnboardingComplete;
    }

    if (postOnboardingRoutes.includes(route)) {
      return isOnboardingComplete;
    }

    return false;
  }
}

export const simpleRoutingService = new SimpleRoutingService();
