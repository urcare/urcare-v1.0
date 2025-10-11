import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface RoutingResult {
  shouldRedirect: boolean;
  redirectPath: string;
  reason: string;
}

/**
 * Handles user routing logic after authentication
 * This is the same logic used in AuthCallback.tsx
 */
export const handleUserRouting = async (user: User): Promise<RoutingResult> => {
  try {
    // Create/update user profile in database
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || '',
        avatar_url: user.user_metadata?.avatar_url || '',
        provider: user.app_metadata?.provider || 'email',
        last_sign_in: new Date().toISOString(),
        sign_in_count: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
      .select();

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    // Check onboarding completion
    const { data: onboardingData, error: onboardingError } = await supabase
      .from('onboarding_profiles')
      .select('onboarding_completed')
      .eq('user_id', user.id)
      .single();

    if (onboardingError || !onboardingData?.onboarding_completed) {
      // User hasn't completed onboarding - redirect to welcome
      return {
        shouldRedirect: true,
        redirectPath: '/welcome',
        reason: 'User needs to complete onboarding'
      };
    }

    // User has completed onboarding - check subscription status
    try {
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (subscriptionError) {
        console.error('Subscription query error:', subscriptionError);
        // If database query fails, redirect to health assessment as fallback
        return {
          shouldRedirect: true,
          redirectPath: '/health-assessment',
          reason: 'Database query failed, redirecting to health assessment'
        };
      }

      if (!subscriptionData) {
        // No active subscription - redirect to health assessment
        return {
          shouldRedirect: true,
          redirectPath: '/health-assessment',
          reason: 'No active subscription found'
        };
      }

      // User has active subscription - redirect to dashboard
      return {
        shouldRedirect: true,
        redirectPath: '/dashboard',
        reason: 'User has active subscription'
      };
    } catch (dbError) {
      console.error('Database error during subscription check:', dbError);
      // Fallback to health assessment if database is unreachable
      return {
        shouldRedirect: true,
        redirectPath: '/health-assessment',
        reason: 'Database unreachable, redirecting to health assessment'
      };
    }

  } catch (error) {
    console.error('Error checking user status:', error);
    // Fallback to welcome screen
    return {
      shouldRedirect: true,
      redirectPath: '/welcome',
      reason: 'Error occurred, fallback to welcome'
    };
  }
};
