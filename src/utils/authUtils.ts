import { supabase } from '@/integrations/supabase/client';
import { subscriptionService } from '@/services/subscriptionService';

export interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: any | null;
  profile: any | null;
  onboardingCompleted: boolean;
  hasActiveSubscription: boolean;
  healthAssessmentCompleted: boolean;
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
  // Step 1: Initial Checks (Always Run First)
  // =====================================================
  
  async checkAuthInitialization(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      return !error;
    } catch {
      return false;
    }
  }

  async checkUserAuthentication(): Promise<{ isAuthenticated: boolean; user: any | null }> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session?.user) {
        return { isAuthenticated: false, user: null };
      }
      
      return { isAuthenticated: true, user: session.user };
    } catch {
      return { isAuthenticated: false, user: null };
    }
  }

  async checkProfileLoaded(userId: string): Promise<{ profile: any | null; loading: boolean }> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        return { profile: null, loading: true };
      }

      return { profile, loading: false };
    } catch {
      return { profile: null, loading: true };
    }
  }

  // =====================================================
  // Step 2: Onboarding Check (Priority Check)
  // =====================================================
  
  async checkOnboardingCompleted(userId: string): Promise<boolean> {
    try {
      // First check if user has any onboarding data at all
      const { data: onboardingProfile, error } = await supabase
        .from('onboarding_profiles')
        .select('onboarding_completed')
        .eq('user_id', userId)
        .maybeSingle(); // Use maybeSingle() instead of single() to handle no results gracefully

      if (error) {
        console.log('Onboarding check error:', error);
        return false;
      }

      if (!onboardingProfile) {
        console.log('No onboarding profile found for user - creating default profile');
        // Create a default onboarding profile for the user
        await this.createDefaultOnboardingProfile(userId);
        return false; // Return false so they get redirected to onboarding
      }

      // Check if onboarding is completed
      const isCompleted = onboardingProfile.onboarding_completed === true;
      
      console.log('Onboarding status:', { 
        onboarding_completed: onboardingProfile.onboarding_completed,
        isCompleted 
      });
      
      return isCompleted;
    } catch (error) {
      console.log('Onboarding check exception:', error);
      return false;
    }
  }

  // =====================================================
  // Helper Methods
  // =====================================================
  
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

  // =====================================================
  // Step 3: Subscription Check (Only if onboarding completed)
  // =====================================================
  
  async checkActiveSubscription(userId: string): Promise<boolean> {
    try {
      return await subscriptionService.hasActiveSubscription(userId);
    } catch {
      return false;
    }
  }

  // =====================================================
  // Step 4: Health Assessment Check (Only if no subscription)
  // =====================================================
  
  async checkHealthAssessmentCompleted(userId: string): Promise<boolean> {
    try {
      // Check if user has completed health assessment
      const { data: onboardingProfile, error } = await supabase
        .from('onboarding_profiles')
        .select('health_assessment_completed')
        .eq('user_id', userId)
        .maybeSingle(); // Use maybeSingle() instead of single()

      if (error) {
        console.log('Health assessment check error:', error);
        return false;
      }

      if (!onboardingProfile) {
        console.log('No onboarding profile found for health assessment check');
        return false;
      }

      const isCompleted = onboardingProfile.health_assessment_completed === true;
      console.log('Health assessment status:', { 
        health_assessment_completed: onboardingProfile.health_assessment_completed,
        isCompleted 
      });
      
      return isCompleted;
    } catch (error) {
      console.log('Health assessment check exception:', error);
      return false;
    }
  }

  // =====================================================
  // Main Auth State Checker
  // =====================================================
  
  async getAuthState(): Promise<AuthState> {
    const initialState: AuthState = {
      isInitialized: false,
      isAuthenticated: false,
      user: null,
      profile: null,
      onboardingCompleted: false,
      hasActiveSubscription: false,
      healthAssessmentCompleted: false,
      loading: true,
      error: null
    };

    try {
      // Step 1: Check auth initialization
      const isInitialized = await this.checkAuthInitialization();
      if (!isInitialized) {
        return { ...initialState, isInitialized: false, loading: false };
      }

      // Step 1: Check user authentication
      const { isAuthenticated, user } = await this.checkUserAuthentication();
      if (!isAuthenticated || !user) {
        return { ...initialState, isInitialized: true, loading: false };
      }

      // Step 1: Check profile loaded
      const { profile, loading: profileLoading } = await this.checkProfileLoaded(user.id);
      if (profileLoading) {
        return { ...initialState, isInitialized: true, isAuthenticated: true, user, loading: true };
      }

      // Step 2: Check onboarding completion (PRIORITY CHECK)
      const onboardingCompleted = await this.checkOnboardingCompleted(user.id);
      if (!onboardingCompleted) {
        return {
          ...initialState,
          isInitialized: true,
          isAuthenticated: true,
          user,
          profile,
          onboardingCompleted: false,
          loading: false
        };
      }

      // Step 3: Check subscription (only if onboarding completed)
      const hasActiveSubscription = await this.checkActiveSubscription(user.id);
      
      // Step 4: Check health assessment (only if no subscription)
      const healthAssessmentCompleted = hasActiveSubscription 
        ? true // If they have subscription, assume health assessment is done
        : await this.checkHealthAssessmentCompleted(user.id);

      return {
        isInitialized: true,
        isAuthenticated: true,
        user,
        profile,
        onboardingCompleted: true,
        hasActiveSubscription,
        healthAssessmentCompleted,
        loading: false,
        error: null
      };

    } catch (error) {
      return {
        ...initialState,
        isInitialized: true,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // =====================================================
  // Route Decision Logic
  // =====================================================
  
  async getRouteDecision(currentPath: string, authState: AuthState): Promise<RouteDecision> {
    const { 
      isInitialized, 
      isAuthenticated, 
      user, 
      profile, 
      onboardingCompleted, 
      hasActiveSubscription, 
      healthAssessmentCompleted,
      loading 
    } = authState;

    // Step 1: Initial Checks
    if (!isInitialized) {
      return { shouldRedirect: false, redirectTo: null, reason: 'Auth not initialized' };
    }

    if (loading) {
      return { shouldRedirect: false, redirectTo: null, reason: 'Profile loading' };
    }

    if (!isAuthenticated || !user) {
      return { shouldRedirect: true, redirectTo: '/', reason: 'User not authenticated' };
    }

    if (!profile) {
      return { shouldRedirect: false, redirectTo: null, reason: 'Profile not loaded' };
    }

    // Step 2: Onboarding Check (PRIORITY - Nothing else matters until complete)
    if (!onboardingCompleted) {
      if (currentPath === '/onboarding') {
        return { shouldRedirect: false, redirectTo: null, reason: 'Onboarding in progress' };
      }
      return { shouldRedirect: true, redirectTo: '/onboarding', reason: 'Onboarding not completed' };
    }

    // Step 3: Subscription Check (Only if onboarding completed)
    if (hasActiveSubscription) {
      // User has subscription - allow access to dashboard and protected routes
      if (currentPath === '/dashboard') {
        return { shouldRedirect: false, redirectTo: null, reason: 'Dashboard access granted' };
      }
      if (currentPath === '/onboarding') {
        return { shouldRedirect: true, redirectTo: '/health-assessment', reason: 'Onboarding already completed' };
      }
      if (currentPath === '/health-assessment') {
        return { shouldRedirect: true, redirectTo: '/dashboard', reason: 'Health assessment already completed' };
      }
      if (currentPath === '/paywall') {
        return { shouldRedirect: true, redirectTo: '/dashboard', reason: 'Already subscribed' };
      }
      return { shouldRedirect: false, redirectTo: null, reason: 'Subscription active' };
    }

    // Step 4: No Subscription - Check Health Assessment
    if (!healthAssessmentCompleted) {
      if (currentPath === '/health-assessment') {
        return { shouldRedirect: false, redirectTo: null, reason: 'Health assessment in progress' };
      }
      if (currentPath === '/onboarding') {
        return { shouldRedirect: true, redirectTo: '/health-assessment', reason: 'Onboarding already completed' };
      }
      if (currentPath === '/dashboard') {
        return { shouldRedirect: true, redirectTo: '/health-assessment', reason: 'No subscription, need health assessment' };
      }
      if (currentPath === '/paywall') {
        return { shouldRedirect: true, redirectTo: '/health-assessment', reason: 'Need health assessment before paywall' };
      }
      return { shouldRedirect: true, redirectTo: '/health-assessment', reason: 'Health assessment required' };
    }

    // Step 5: Health Assessment Completed - Go to Paywall
    if (currentPath === '/paywall') {
      return { shouldRedirect: false, redirectTo: null, reason: 'Paywall access granted' };
    }
    if (currentPath === '/onboarding') {
      return { shouldRedirect: true, redirectTo: '/health-assessment', reason: 'Onboarding already completed' };
    }
    if (currentPath === '/health-assessment') {
      return { shouldRedirect: true, redirectTo: '/paywall', reason: 'Health assessment already completed' };
    }
    if (currentPath === '/dashboard') {
      return { shouldRedirect: true, redirectTo: '/paywall', reason: 'No subscription, need to subscribe' };
    }
    return { shouldRedirect: true, redirectTo: '/paywall', reason: 'Paywall required' };
  }

  // =====================================================
  // Health Assessment Completion Tracking
  // =====================================================
  
  async markHealthAssessmentCompleted(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('onboarding_profiles')
        .update({ health_assessment_completed: true })
        .eq('user_id', userId);

      if (error) {
        console.error('Error marking health assessment completed:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to mark health assessment completed:', error);
      return false;
    }
  }

  // =====================================================
  // Public API Methods
  // =====================================================
  
  async shouldRedirectToOnboarding(): Promise<boolean> {
    const authState = await this.getAuthState();
    return !authState.onboardingCompleted && authState.isAuthenticated;
  }

  async shouldRedirectToHealthAssessment(): Promise<boolean> {
    const authState = await this.getAuthState();
    return authState.onboardingCompleted && !authState.hasActiveSubscription && !authState.healthAssessmentCompleted;
  }

  async shouldRedirectToPaywall(): Promise<boolean> {
    const authState = await this.getAuthState();
    return authState.onboardingCompleted && !authState.hasActiveSubscription && authState.healthAssessmentCompleted;
  }

  async shouldAllowDashboardAccess(): Promise<boolean> {
    const authState = await this.getAuthState();
    return authState.onboardingCompleted && authState.hasActiveSubscription;
  }

  async getRecommendedRoute(): Promise<string> {
    const authState = await this.getAuthState();
    
    if (!authState.isAuthenticated) return '/';
    if (!authState.onboardingCompleted) return '/onboarding';
    if (!authState.hasActiveSubscription && !authState.healthAssessmentCompleted) return '/health-assessment';
    if (!authState.hasActiveSubscription && authState.healthAssessmentCompleted) return '/paywall';
    return '/dashboard';
  }
}

// Export singleton instance
export const authUtils = new AuthUtils();
export default authUtils;
