import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { subscriptionService } from "./subscriptionService";

export interface AuthFlowState {
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
  hasActiveSubscription: boolean;
  shouldShowPaywall: boolean;
  nextRoute: string;
  canAccessDashboard: boolean;
}

export interface UserFlowStatus {
  step: "auth" | "onboarding" | "health-assessment" | "paywall" | "dashboard";
  isComplete: boolean;
  nextStep: string | null;
  canProceed: boolean;
}

class AuthFlowService {
  /**
   * Get the current authentication flow state for a user
   */
  async getAuthFlowState(user: User | null): Promise<AuthFlowState> {
    if (!user) {
      return {
        isAuthenticated: false,
        isOnboardingComplete: false,
        hasActiveSubscription: false,
        shouldShowPaywall: false,
        nextRoute: "/",
        canAccessDashboard: false,
      };
    }

    try {
      // Run all database queries in parallel with individual timeouts
      const [
        profileResult,
        subscriptionResult,
        healthAssessmentResult,
      ] = await Promise.allSettled([
        // Profile check with timeout
        Promise.race([
          supabase
            .from("user_profiles")
            .select("onboarding_completed")
            .eq("id", user.id)
            .single(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Profile check timeout")), 3000)
          ),
        ]),

        // Subscription check with timeout
        Promise.race([
          subscriptionService.getSubscriptionStatus(user.id),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Subscription check timeout")),
              3000
            )
          ),
        ]),

        // Health assessment check with timeout
        Promise.race([
          this.hasCompletedHealthAssessment(user.id),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Health assessment check timeout")),
              3000
            )
          ),
        ]),
      ]);

      // Process results with fallbacks
      const isOnboardingComplete =
        profileResult.status === "fulfilled"
          ? (profileResult.value as any)?.data?.onboarding_completed ?? false
          : false;

      const hasActiveSubscription =
        subscriptionResult.status === "fulfilled"
          ? (subscriptionResult.value as any)?.isActive ?? false
          : false;

      const hasCompletedHealthAssessment =
        healthAssessmentResult.status === "fulfilled"
          ? (healthAssessmentResult.value as any) ?? false
          : false;

      // Log any failed checks
      if (profileResult.status === "rejected") {
        console.warn("Profile check failed:", profileResult.reason);
      }
      if (subscriptionResult.status === "rejected") {
        console.warn("Subscription check failed:", subscriptionResult.reason);
      }
      if (healthAssessmentResult.status === "rejected") {
        console.warn(
          "Health assessment check failed:",
          healthAssessmentResult.reason
        );
      }

      // Determine if user can access dashboard
      const canAccessDashboard = hasActiveSubscription;

      // Determine next route based on current state
      let nextRoute = "/";
      let shouldShowPaywall = false;

      if (!isOnboardingComplete) {
        nextRoute = "/onboarding";
      } else if (!canAccessDashboard) {
        if (!hasCompletedHealthAssessment) {
          nextRoute = "/health-assessment";
        } else {
          nextRoute = "/paywall";
          shouldShowPaywall = true;
        }
      } else {
        nextRoute = "/dashboard";
      }

      return {
        isAuthenticated: true,
        isOnboardingComplete,
        hasActiveSubscription,
        shouldShowPaywall,
        nextRoute,
        canAccessDashboard,
      };
    } catch (error) {
      console.error("Error getting auth flow state:", error);
      return {
        isAuthenticated: true,
        isOnboardingComplete: false,
        hasActiveSubscription: false,
        shouldShowPaywall: false,
        nextRoute: "/onboarding",
        canAccessDashboard: false,
      };
    }
  }

  /**
   * Get the user's current flow status
   */
  async getUserFlowStatus(user: User | null): Promise<UserFlowStatus> {
    if (!user) {
      return {
        step: "auth",
        isComplete: false,
        nextStep: "/",
        canProceed: false,
      };
    }

    try {
      const flowState = await this.getAuthFlowState(user);

      if (!flowState.isOnboardingComplete) {
        return {
          step: "onboarding",
          isComplete: false,
          nextStep: "/onboarding",
          canProceed: true,
        };
      }

      const hasCompletedHealthAssessment =
        await this.hasCompletedHealthAssessment(user.id);
      if (!hasCompletedHealthAssessment) {
        return {
          step: "health-assessment",
          isComplete: false,
          nextStep: "/health-assessment",
          canProceed: true,
        };
      }

      if (!flowState.canAccessDashboard) {
        return {
          step: "paywall",
          isComplete: false,
          nextStep: "/paywall",
          canProceed: true,
        };
      }

      return {
        step: "dashboard",
        isComplete: true,
        nextStep: null,
        canProceed: true,
      };
    } catch (error) {
      console.error("Error getting user flow status:", error);
      return {
        step: "onboarding",
        isComplete: false,
        nextStep: "/onboarding",
        canProceed: false,
      };
    }
  }

  /**
   * Check if user has completed health assessment
   */
  private async hasCompletedHealthAssessment(userId: string): Promise<boolean> {
    try {
      // Check if user has a health plan (indicates health assessment completion)
      // Use a more efficient query with exists check
      const { data, error } = await supabase
        .from("health_plans")
        .select("id")
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle(); // Use maybeSingle to handle no results gracefully

      if (error) {
        console.error("Error checking health assessment completion:", error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error("Error in hasCompletedHealthAssessment:", error);
      return false;
    }
  }

  /**
   * Complete onboarding step
   */
  async completeOnboarding(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ onboarding_completed: true })
        .eq("id", userId);

      if (error) {
        console.error("Error completing onboarding:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in completeOnboarding:", error);
      return false;
    }
  }

  /**
   * Complete health assessment step
   */
  async completeHealthAssessment(userId: string): Promise<boolean> {
    try {
      // This would typically involve creating a health plan
      // For now, we'll just mark it as completed in user preferences
      const { error } = await supabase
        .from("user_profiles")
        .update({
          preferences: supabase.raw(
            "COALESCE(preferences, '{}') || '{\"health_assessment_completed\": true}'::jsonb"
          ),
        })
        .eq("id", userId);

      if (error) {
        console.error("Error completing health assessment:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in completeHealthAssessment:", error);
      return false;
    }
  }


  /**
   * Check if user can access a specific route
   */
  async canAccessRoute(user: User | null, route: string): Promise<boolean> {
    if (!user) {
      // Public routes
      const publicRoutes = ["/", "/auth", "/auth/callback"];
      return publicRoutes.includes(route);
    }

    try {
      const flowState = await this.getAuthFlowState(user);

      // Define route access rules
      const routeAccessRules: Record<
        string,
        (state: AuthFlowState) => boolean
      > = {
        "/onboarding": () => !flowState.isOnboardingComplete,
        "/health-assessment": () =>
          flowState.isOnboardingComplete && !flowState.canAccessDashboard,
        "/paywall": () =>
          flowState.isOnboardingComplete && !flowState.canAccessDashboard,
        "/dashboard": () => flowState.canAccessDashboard,
        "/health-plan": () => flowState.canAccessDashboard,
        "/diet": () => flowState.canAccessDashboard,
        "/workout": () => flowState.canAccessDashboard,
        "/planner": () => flowState.canAccessDashboard,
        "/plan-details": () => flowState.isOnboardingComplete, // Plan details accessible after onboarding
        "/subscription": () => flowState.isOnboardingComplete,
        "/welcome-screen": () => true, // Always accessible for authenticated users
      };

      const canAccess = routeAccessRules[route]?.(flowState) ?? false;
      return canAccess;
    } catch (error) {
      console.error("Error checking route access:", error);
      return false;
    }
  }

  /**
   * Get the appropriate redirect route for a user
   */
  async getRedirectRoute(user: User | null): Promise<string> {
    if (!user) {
      return "/";
    }

    try {
      const flowState = await this.getAuthFlowState(user);
      return flowState.nextRoute;
    } catch (error) {
      console.error("Error getting redirect route:", error);
      return "/onboarding";
    }
  }
}

export const authFlowService = new AuthFlowService();
