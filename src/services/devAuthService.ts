import { DEV_CONFIG, devUtils, isDevelopment } from "@/config/development";
import { supabase } from "@/integrations/supabase/client";

export class DevAuthService {
  private static instance: DevAuthService;

  public static getInstance(): DevAuthService {
    if (!DevAuthService.instance) {
      DevAuthService.instance = new DevAuthService();
    }
    return DevAuthService.instance;
  }

  /**
   * Sign in with Google for development
   */
  async signInWithGoogle(): Promise<void> {
    if (!isDevelopment()) {
      throw new Error(
        "Development auth service only works in development mode"
      );
    }

    devUtils.log("Signing in with Google (development mode)");

    // For development, we'll use a mock OAuth flow
    // This avoids the complex redirect handling
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: DEV_CONFIG.URLS.callback,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        devUtils.error("Google sign-in error:", error);
        throw error;
      }
    } catch (error) {
      devUtils.error("OAuth sign-in failed, using fallback:", error);
      // Fallback: simulate successful authentication
      await this.simulateSuccessfulAuth();
    }
  }

  /**
   * Simulate successful authentication for development
   */
  private async simulateSuccessfulAuth(): Promise<void> {
    devUtils.log("Simulating successful authentication for development");

    // Create a mock session
    const mockSession = {
      access_token: "dev-mock-token",
      refresh_token: "dev-mock-refresh",
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: "bearer",
      user: DEV_CONFIG.DEV_USER,
    };

    // Store the mock session in localStorage
    localStorage.setItem("supabase.auth.token", JSON.stringify(mockSession));

    // Trigger auth state change
    window.dispatchEvent(new Event("storage"));

    devUtils.log("Mock authentication completed");
  }

  /**
   * Sign in with Apple for development
   */
  async signInWithApple(): Promise<void> {
    if (!isDevelopment()) {
      throw new Error(
        "Development auth service only works in development mode"
      );
    }

    devUtils.log("Signing in with Apple (development mode)");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: DEV_CONFIG.URLS.callback,
        },
      });

      if (error) {
        devUtils.error("Apple sign-in error:", error);
        throw error;
      }
    } catch (error) {
      devUtils.error("OAuth sign-in failed, using fallback:", error);
      // Fallback: simulate successful authentication
      await this.simulateSuccessfulAuth();
    }
  }

  /**
   * Sign in with email for development
   */
  async signInWithEmail(email: string, password: string): Promise<void> {
    if (!isDevelopment()) {
      throw new Error(
        "Development auth service only works in development mode"
      );
    }

    devUtils.log("Signing in with email (development mode)");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      devUtils.error("Email sign-in error:", error);
      throw error;
    }
  }

  /**
   * Sign up with email for development
   */
  async signUp(
    email: string,
    password: string,
    fullName: string
  ): Promise<void> {
    if (!isDevelopment()) {
      throw new Error(
        "Development auth service only works in development mode"
      );
    }

    devUtils.log("Signing up with email (development mode)");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: DEV_CONFIG.URLS.callback,
      },
    });

    if (error) {
      devUtils.error("Email sign-up error:", error);
      throw error;
    }
  }

  /**
   * Handle authentication callback for development
   */
  async handleAuthCallback(): Promise<void> {
    if (!isDevelopment()) {
      return;
    }

    devUtils.log("Handling auth callback (development mode)");

    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        devUtils.error("Auth callback error:", error);
        return;
      }

      if (data.session) {
        devUtils.log("Auth callback successful, user authenticated");
        // Don't redirect here - let the AuthCallback component handle navigation
        // The AuthCallback component will handle the proper React navigation
        return;
      }
    } catch (error) {
      devUtils.error("Auth callback handling error:", error);
    }
  }

  /**
   * Check if we're on the correct development URL
   */
  checkDevelopmentUrl(): boolean {
    if (!isDevelopment()) {
      return true; // Not in development, so URL check doesn't apply
    }

    const currentUrl = window.location.href;
    const isLocalhost =
      currentUrl.includes("localhost:8080") ||
      currentUrl.includes("127.0.0.1:8080");

    if (!isLocalhost) {
      devUtils.warn(
        `Redirecting from ${currentUrl} to ${DEV_CONFIG.URLS.local}`
      );
      window.location.href = DEV_CONFIG.URLS.local;
      return false;
    }

    return true;
  }

  /**
   * Force redirect to local development URL
   */
  forceLocalRedirect(): void {
    if (isDevelopment()) {
      devUtils.log("Forcing redirect to local development URL");
      window.location.href = DEV_CONFIG.URLS.local;
    }
  }
}

export const devAuthService = DevAuthService.getInstance();
