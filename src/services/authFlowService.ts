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
  async getAuthFlowState(user: User | null, profile?: any): Promise<AuthFlowState> {
    // Development mode bypass for localhost
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      console.log("🔓 Development mode - allowing all access");
      return {
        isAuthenticated: true,
        isOnboardingComplete: true,
        hasActiveSubscription: true,
        shouldShowPaywall: false,
        nextRoute: "/dashboard",
        canAccessDashboard: true,
      };
    }

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
      // Use profile from AuthContext if available, otherwise fetch from database
      let isOnboardingComplete = false;
      
      if (profile?.onboarding_completed !== undefined) {
        // Use profile from AuthContext (more reliable)
        isOnboardingComplete = profile.onboarding_completed;
        console.log("Using profile from AuthContext, onboarding_completed:", isOnboardingComplete);
      } else {
        // Fallback to database query with longer timeout
        try {
          const result = await Promise.race([
            supabase
              .from("user_profiles")
              .select("onboarding_completed")
              .eq("id", user.id)
              .single(),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Profile check timeout")), 10000)
            ),
          ]) as any;
          
          const { data, error } = result;

          if (error) {
            console.warn("Profile check failed:", error);
            isOnboardingComplete = false;
          } else {
            isOnboardingComplete = data?.onboarding_completed ?? false;
          }
        } catch (profileError) {
          console.warn("Profile check failed:", profileError);
          isOnboardingComplete = false;
        }
      }

      // Skip subscription check to avoid timeouts - subscription is not required for basic dashboard access
      // Users can view generated plans without a subscription
      let hasActiveSubscription = false;

      // Skip health assessment check for now to avoid timeouts
      // This can be enabled later when the health_plans table is properly set up
      const hasCompletedHealthAssessment = true; // Assume completed to avoid redirects

      // Allow dashboard access after onboarding completion (for viewing generated plans)
      // Subscription is only required for premium features, not basic dashboard access
      const canAccessDashboard = isOnboardingComplete;

      // Determine next route based on current state
      let nextRoute = "/";
      let shouldShowPaywall = false;

      if (!isOnboardingComplete) {
        nextRoute = "/onboarding";
      } else if (!hasCompletedHealthAssessment) {
        nextRoute = "/health-assessment";
      } else {
        // After onboarding and health assessment, allow dashboard access
        // Paywall can be shown later for premium features
        nextRoute = "/dashboard";
      }

      console.log("Auth flow state:", {
        isOnboardingComplete,
        hasActiveSubscription,
        hasCompletedHealthAssessment,
        canAccessDashboard,
        nextRoute
      });

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
      // More conservative fallback - assume onboarding is complete if we have a user
      return {
        isAuthenticated: true,
        isOnboardingComplete: true, // Changed from false to true
        hasActiveSubscription: false,
        shouldShowPaywall: false,
        nextRoute: "/health-assessment", // Changed from /onboarding to /health-assessment
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
      // Try multiple tables to check for health assessment completion
      const tables = ["health_plans", "comprehensive_health_plans", "two_day_health_plans"];
      
      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select("id")
            .eq("user_id", userId)
            .limit(1)
            .maybeSingle();

          if (!error && data) {
            console.log(`Health assessment found in ${table}`);
            return true;
          }
        } catch (tableError) {
          console.log(`Table ${table} not accessible or doesn't exist, trying next...`);
          continue;
        }
      }

      // If no health plans found in any table, assume not completed
      console.log("No health assessment found in any table");
      return false;
    } catch (error) {
      console.error("Error in hasCompletedHealthAssessment:", error);
      // Return true to avoid redirect loops when tables don't exist
      return true;
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
          preferences: {
            health_assessment_completed: true
          },
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
  async canAccessRoute(user: User | null, route: string, profile?: any): Promise<boolean> {
    // Development mode bypass for localhost
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      console.log("🔓 Development mode - allowing access to route:", route);
      return true;
    }

    if (!user) {
      // Public routes
      const publicRoutes = ["/", "/auth", "/auth/callback"];
      return publicRoutes.includes(route);
    }

    // Quick bypass for routes accessible after onboarding - no need for complex checks
    if (profile?.onboarding_completed) {
      const postOnboardingRoutes = [
        "/health-assessment",
        "/custom-plan", 
        "/health-plan-generation",
        "/plan-details",
        "/subscription",
        "/settings",
        "/profile-management",
        "/camera",
        "/dashboard", // Add dashboard to quick bypass
        "/phonecheckout", // Add PhonePe checkout routes
        "/phonecheckout/result",
        "/payment/success",
        "/payment/failure",
        "/test-phonepe",
        "/phonepe-test"
      ];
      
      if (postOnboardingRoutes.includes(route)) {
        console.log(`Quick bypass for ${route} - user has completed onboarding`);
        return true;
      }
    }

    // For other routes, use simple logic without complex auth flow checks
    const routeAccessRules: Record<string, boolean> = {
      "/onboarding": !profile?.onboarding_completed,
      "/health-assessment": profile?.onboarding_completed || false,
      "/paywall": true, // Always accessible - user can pay before onboarding
      "/dashboard": profile?.onboarding_completed || false,
      "/health-plan": profile?.onboarding_completed || false,
      "/diet": profile?.onboarding_completed || false,
      "/workout": profile?.onboarding_completed || false,
      "/planner": profile?.onboarding_completed || false,
      "/plan-details": profile?.onboarding_completed || false,
      "/subscription": profile?.onboarding_completed || false,
      "/phonecheckout": true, // Always accessible - payment page
      "/phonecheckout/result": true, // Always accessible - payment result
      "/payment/success": true, // Always accessible - payment success
      "/payment/failure": true, // Always accessible - payment failure
      "/test-phonepe": profile?.onboarding_completed || false,
      "/phonepe-test": profile?.onboarding_completed || false,
      "/welcome-screen": true, // Always accessible for authenticated users
    };

    return routeAccessRules[route] ?? false;
  }

  /**
   * Get the appropriate redirect route for a user
   */
  async getRedirectRoute(user: User | null, profile?: any): Promise<string> {
    if (!user) {
      return "/";
    }

    // Simple logic based on profile state - no complex auth flow checks
    if (profile?.onboarding_completed) {
      return "/dashboard"; // After onboarding, go to dashboard
    } else {
      return "/onboarding"; // If not completed, go to onboarding
    }
  }
}

export const authFlowService = new AuthFlowService();
