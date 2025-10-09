import { supabase } from '@/integrations/supabase/client';
import { subscriptionService } from '@/services/subscriptionService';

export interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: any;
  profile: any;
  onboardingCompleted: boolean;
  hasActiveSubscription: boolean;
  loading: boolean;
  error: string | null;
}

export interface RouteDecision {
  shouldRedirect: boolean;
  redirectTo: string | null;
  reason: string;
}

class AuthUtils {
  // =====================================================
  // Simple Auth State Check
  // =====================================================
  
  async getAuthState(): Promise<AuthState> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return {
          isInitialized: true,
          isAuthenticated: false,
          user: null,
          profile: null,
          onboardingCompleted: false,
          hasActiveSubscription: false,
          loading: false,
          error: null
        };
      }

      // Check onboarding_completed
      const onboardingCompleted = await this.checkOnboardingCompleted(user.id);
      
      // Check subscription status
      const hasActiveSubscription = await this.checkActiveSubscription(user.id);
      
      return {
        isInitialized: true,
        isAuthenticated: true,
        user,
        profile: null,
        onboardingCompleted,
        hasActiveSubscription,
        loading: false,
        error: null
      };

    } catch (error) {
      return {
        isInitialized: true,
        isAuthenticated: false,
        user: null,
        profile: null,
        onboardingCompleted: false,
        hasActiveSubscription: false,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // =====================================================
  // Simple Route Decision
  // =====================================================
  
  async getRouteDecision(currentPath: string, authState: AuthState): Promise<RouteDecision> {
    const { 
      isInitialized, 
      isAuthenticated, 
      user, 
      onboardingCompleted, 
      hasActiveSubscription, 
      loading 
    } = authState;

    // Basic checks
    if (!isInitialized || loading) {
      return { shouldRedirect: false, redirectTo: null, reason: 'Loading' };
    }

    if (!isAuthenticated || !user) {
      return { shouldRedirect: true, redirectTo: '/', reason: 'Not authenticated' };
    }

    // Check onboarding_completed
    if (!onboardingCompleted) {
      if (currentPath === '/welcome') {
        return { shouldRedirect: false, redirectTo: null, reason: 'Welcome screen' };
      }
      if (currentPath === '/onboarding') {
        return { shouldRedirect: false, redirectTo: null, reason: 'Onboarding in progress' };
      }
      return { shouldRedirect: true, redirectTo: '/welcome', reason: 'Onboarding not completed' };
    }

    // Check subscription status
    if (hasActiveSubscription) {
      if (currentPath === '/dashboard') {
        return { shouldRedirect: false, redirectTo: null, reason: 'Dashboard access granted' };
      }
      return { shouldRedirect: true, redirectTo: '/dashboard', reason: 'Subscription active' };
    }

    // No subscription - redirect to paywall
    if (currentPath === '/paywall') {
      return { shouldRedirect: false, redirectTo: null, reason: 'Paywall access granted' };
    }
    return { shouldRedirect: true, redirectTo: '/paywall', reason: 'Subscription required' };
  }

  // =====================================================
  // Helper Methods
  // =====================================================
  
  async checkOnboardingCompleted(userId: string): Promise<boolean> {
    try {
      const { data: onboardingProfile, error } = await supabase
        .from('onboarding_profiles')
        .select('onboarding_completed')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.log('Onboarding check error:', error);
        return false;
      }

      if (!onboardingProfile) {
        console.log('No onboarding profile found for user - creating default profile');
        await this.createDefaultOnboardingProfile(userId);
        return false;
      }

      return onboardingProfile.onboarding_completed === true;
    } catch (error) {
      console.log('Error checking onboarding status:', error);
      return false;
    }
  }

  async checkActiveSubscription(userId: string): Promise<boolean> {
    try {
      return await subscriptionService.hasActiveSubscription(userId);
    } catch {
      return false;
    }
  }

  async createDefaultOnboardingProfile(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('onboarding_profiles')
        .insert({
          user_id: userId,
          full_name: 'New User',
          onboarding_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating default onboarding profile:', error);
      } else {
        console.log('✅ Default onboarding profile created for user');
      }
    } catch (error) {
      console.error('Error creating default onboarding profile:', error);
    }
  }
}

export const authUtils = new AuthUtils();
