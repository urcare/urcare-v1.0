import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { subscriptionService } from "./subscriptionService";
import { trialService } from "./trialService";

export interface AuthFlowState {
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
  hasActiveSubscription: boolean;
  hasActiveTrial: boolean;
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
        hasActiveTrial: false,
        shouldShowPaywall: false,
        nextRoute: "/",
        canAccessDashboard: false,
      };
    }

    try {
      console.log("AuthFlowService: Getting auth flow state for user:", user.id);
      
      // Get user profile to check onboarding status
      console.log("AuthFlowService: Fetching user profile...");
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single();

      console.log("AuthFlowService: Profile result:", { profile, profileError });
      const isOnboardingComplete = profile?.onboarding_completed ?? false;

      // Get subscription status
      console.log("AuthFlowService: Getting subscription status...");
      const subscriptionStatus =
        await subscriptionService.getSubscriptionStatus(user.id);
      const hasActiveSubscription = subscriptionStatus.isActive;
      console.log("AuthFlowService: Subscription status:", subscriptionStatus);

      // Get trial status
      console.log("AuthFlowService: Getting trial status...");
      let hasActiveTrial = false;
      try {
        const trialStatus = await trialService.getTrialStatus(user.id);
        hasActiveTrial = trialStatus.isActive;
        console.log("AuthFlowService: Trial status:", trialStatus);
      } catch (trialError) {
        console.warn("AuthFlowService: Trial service failed, continuing without trial check:", trialError);
        hasActiveTrial = false;
      }

      // Determine if user can access dashboard
      const canAccessDashboard = hasActiveSubscription || hasActiveTrial;

      // Determine next route based on current state
      let nextRoute = "/";
      let shouldShowPaywall = false;

      if (!isOnboardingComplete) {
        nextRoute = "/onboarding";
      } else if (!canAccessDashboard) {
        // Check if user has completed health assessment
        const hasCompletedHealthAssessment =
          await this.hasCompletedHealthAssessment(user.id);
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
        hasActiveTrial,
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
        hasActiveTrial: false,
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
      const { data, error } = await supabase
        .from("health_plans")
        .select("id")
        .eq("user_id", userId)
        .limit(1);

      if (error) {
        console.error("Error checking health assessment completion:", error);
        return false;
      }

      return !!data && data.length > 0;
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
   * Start trial for user
   */
  async startTrial(userId: string): Promise<boolean> {
    try {
      const trialInfo = await trialService.claimTrial(userId);
      return !!trialInfo;
    } catch (error) {
      console.error("Error starting trial:", error);
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
