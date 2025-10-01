import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface AuthState {
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
  nextRoute: string;
}

class AuthService {
  /**
   * Get the current authentication state
   */
  async getAuthState(user: User | null, profile?: any): Promise<AuthState> {
    if (!user) {
      return {
        isAuthenticated: false,
        isOnboardingComplete: false,
        nextRoute: "/",
      };
    }

    // Check if onboarding is complete
    const isOnboardingComplete = profile?.onboarding_completed || false;

    // Determine next route
    let nextRoute = "/";
    if (!isOnboardingComplete) {
      nextRoute = "/onboarding";
    } else {
      // After onboarding, check if health assessment is completed
      // For now, assume health assessment is required before dashboard
      nextRoute = "/health-assessment";
    }

    return {
      isAuthenticated: true,
      isOnboardingComplete,
      nextRoute,
    };
  }

  /**
   * Check if user can access a specific route
   */
  canAccessRoute(user: User | null, route: string, profile?: any): boolean {
    if (!user) {
      // Public routes
      const publicRoutes = ["/", "/auth", "/auth/callback", "/email-auth", "/email-signin", "/email-verification"];
      return publicRoutes.includes(route);
    }

    // If user has completed onboarding, they can access most routes
    if (profile?.onboarding_completed) {
      const restrictedRoutes = ["/onboarding"];
      return !restrictedRoutes.includes(route);
    }

    // If onboarding not complete, only allow onboarding and auth routes
    const allowedRoutes = ["/onboarding", "/welcome-screen"];
    return allowedRoutes.includes(route);
  }

  /**
   * Get the appropriate redirect route for a user
   */
  async getRedirectRoute(user: User | null, profile?: any): Promise<string> {
    if (!user) {
      return "/";
    }

    if (profile?.onboarding_completed) {
      // After onboarding, go to health assessment
      return "/health-assessment";
    } else {
      return "/onboarding";
    }
  }

  /**
   * Create a minimal user profile
   */
  async createUserProfile(user: User): Promise<void> {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .insert([
          {
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
            onboarding_completed: false,
            status: "active",
          },
        ]);

      if (error && error.code !== "23505") { // Ignore duplicate key errors
        console.error("Error creating user profile:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error in createUserProfile:", error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: Record<string, any>): Promise<void> {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update(updates)
        .eq("id", userId);

      if (error) {
        console.error("Error updating user profile:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error in updateUserProfile:", error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in getUserProfile:", error);
      return null;
    }
  }
}

export const authService = new AuthService();
