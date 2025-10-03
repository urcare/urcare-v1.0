// User Flow Service - Handles new user and old user flows
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface UserFlowState {
  isNewUser: boolean;
  isOldUser: boolean;
  needsOnboarding: boolean;
  needsHealthAssessment: boolean;
  needsPaywall: boolean;
  canAccessDashboard: boolean;
  nextRoute: string;
  subscriptionStatus: 'active' | 'trialing' | 'inactive' | 'expired' | 'none';
}

export interface UserProfile {
  id: string;
  onboarding_completed: boolean;
  subscription_status: string;
  created_at: string;
  updated_at: string;
}

class UserFlowService {
  /**
   * Determine user flow state based on user and profile data
   */
  async getUserFlowState(user: User | null, profile?: UserProfile | null): Promise<UserFlowState> {
    // No user - redirect to landing (unless in development mode on dashboard)
    if (!user) {
      // In development mode, if we're on dashboard, allow access
      if (typeof window !== 'undefined' && 
          (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
          window.location.pathname === '/dashboard') {
        console.log("UserFlowService: Development mode - allowing dashboard access without user");
        return {
          isNewUser: false,
          isOldUser: true,
          needsOnboarding: false,
          needsHealthAssessment: false,
          needsPaywall: false,
          canAccessDashboard: true,
          nextRoute: '/dashboard',
          subscriptionStatus: 'active'
        };
      }
      
      return {
        isNewUser: false,
        isOldUser: false,
        needsOnboarding: false,
        needsHealthAssessment: false,
        needsPaywall: false,
        canAccessDashboard: false,
        nextRoute: '/',
        subscriptionStatus: 'none'
      };
    }

    // Development mode bypass
    if (typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      console.log("UserFlowService: Development mode bypass activated");
      return {
        isNewUser: false,
        isOldUser: true,
        needsOnboarding: false,
        needsHealthAssessment: false,
        needsPaywall: false,
        canAccessDashboard: true,
        nextRoute: '/dashboard',
        subscriptionStatus: 'active'
      };
    }

    try {
      // Get profile data if not provided
      let userProfile = profile;
      if (!userProfile) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.warn('Failed to fetch user profile:', error);
          // Create minimal profile for new user
          userProfile = {
            id: user.id,
            onboarding_completed: false,
            subscription_status: 'none',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        } else {
          userProfile = data;
        }
      }

      // Determine if user is new or old
      console.log("UserFlowService: Profile data:", userProfile);
      console.log("UserFlowService: onboarding_completed:", userProfile.onboarding_completed);
      const isNewUser = !userProfile.onboarding_completed;
      const isOldUser = userProfile.onboarding_completed;
      console.log("UserFlowService: isNewUser:", isNewUser, "isOldUser:", isOldUser);

      // Check subscription status
      const subscriptionStatus = this.getSubscriptionStatus(userProfile.subscription_status);

      // Determine flow requirements
      const needsOnboarding = isNewUser && !userProfile.onboarding_completed;
      const needsHealthAssessment = isNewUser && userProfile.onboarding_completed;
      const needsPaywall = isOldUser && !this.hasActiveSubscription(subscriptionStatus);
      const canAccessDashboard = isOldUser && this.hasActiveSubscription(subscriptionStatus);

      // Determine next route
      let nextRoute = '/';
      console.log("UserFlowService: Flow requirements - needsOnboarding:", needsOnboarding, "needsHealthAssessment:", needsHealthAssessment, "needsPaywall:", needsPaywall, "canAccessDashboard:", canAccessDashboard);
      
      if (needsOnboarding) {
        nextRoute = '/onboarding';
      } else if (needsHealthAssessment) {
        nextRoute = '/health-assessment';
      } else if (needsPaywall) {
        nextRoute = '/paywall';
      } else if (canAccessDashboard) {
        nextRoute = '/dashboard';
      }
      
      console.log("UserFlowService: Final nextRoute:", nextRoute);

      return {
        isNewUser,
        isOldUser,
        needsOnboarding,
        needsHealthAssessment,
        needsPaywall,
        canAccessDashboard,
        nextRoute,
        subscriptionStatus
      };

    } catch (error) {
      console.error('Error determining user flow state:', error);
      // Fallback to new user flow
      return {
        isNewUser: true,
        isOldUser: false,
        needsOnboarding: true,
        needsHealthAssessment: false,
        needsPaywall: false,
        canAccessDashboard: false,
        nextRoute: '/onboarding',
        subscriptionStatus: 'none'
      };
    }
  }

  /**
   * Handle special admin/test user flows
   */
  async handleSpecialUserFlow(user: User, profile?: UserProfile | null): Promise<UserFlowState> {
    const email = user.email?.toLowerCase() || '';
    
    // Admin user flow
    if (email === 'admin@urcare.com' || email === 'admin') {
      return {
        isNewUser: false,
        isOldUser: true,
        needsOnboarding: false,
        needsHealthAssessment: false,
        needsPaywall: false,
        canAccessDashboard: true,
        nextRoute: '/my-admin',
        subscriptionStatus: 'active'
      };
    }

    // Test user flow
    if (email === 'test@email.com' || email === 'test@urcare.com') {
      return {
        isNewUser: true,
        isOldUser: false,
        needsOnboarding: true,
        needsHealthAssessment: false,
        needsPaywall: false,
        canAccessDashboard: false,
        nextRoute: '/onboarding',
        subscriptionStatus: 'active' // Auto-activate for test users
      };
    }

    // Regular user flow
    return this.getUserFlowState(user, profile);
  }

  /**
   * Get subscription status from string
   */
  private getSubscriptionStatus(status: string): 'active' | 'trialing' | 'inactive' | 'expired' | 'none' {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'premium':
        return 'active';
      case 'trialing':
      case 'trial':
        return 'trialing';
      case 'inactive':
      case 'cancelled':
        return 'inactive';
      case 'expired':
        return 'expired';
      default:
        return 'none';
    }
  }

  /**
   * Check if user has active subscription
   */
  private hasActiveSubscription(status: 'active' | 'trialing' | 'inactive' | 'expired' | 'none'): boolean {
    return status === 'active' || status === 'trialing';
  }

  /**
   * Create user profile for new users
   */
  async createUserProfile(user: User, isTestUser: boolean = false): Promise<UserProfile> {
    const profileData = {
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      onboarding_completed: false,
      subscription_status: isTestUser ? 'active' : 'none',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profileData])
      .select()
      .single();

    if (error) {
      console.error('Failed to create user profile:', error);
      throw error;
    }

    return data;
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  }

  /**
   * Complete onboarding for user
   */
  async completeOnboarding(userId: string): Promise<void> {
    await this.updateUserProfile(userId, {
      onboarding_completed: true
    });
  }

  /**
   * Activate subscription for user
   */
  async activateSubscription(userId: string, plan: string = 'premium'): Promise<void> {
    await this.updateUserProfile(userId, {
      subscription_status: 'active'
    });
  }
}

export const userFlowService = new UserFlowService();
