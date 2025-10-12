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
    // First, check if profile exists
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    // If profile doesn't exist, create it
    if (profileCheckError && profileCheckError.code === 'PGRST116') {
      console.log('Profile not found, creating new profile...');
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          avatar_url: user.user_metadata?.avatar_url || '',
          provider: user.app_metadata?.provider || 'email',
          last_sign_in: new Date().toISOString(),
          sign_in_count: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Continue with routing even if profile creation fails
      }
    } else if (existingProfile) {
      // Profile exists, update last_sign_in
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          last_sign_in: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
      }
    }

    // Check onboarding completion - check if user has completed health assessment
    const { data: healthAnalysis, error: healthError } = await supabase
      .from('health_analysis')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (healthError || !healthAnalysis) {
      // User hasn't completed health assessment - redirect to health assessment
      return {
        shouldRedirect: true,
        redirectPath: '/health-assessment',
        reason: 'User needs to complete health assessment'
      };
    }

    // User has completed health assessment - check subscription status
    try {
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions_unified')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (subscriptionError) {
        console.error('Subscription query error:', subscriptionError);
        // If database query fails, redirect to paywall as fallback
        return {
          shouldRedirect: true,
          redirectPath: '/paywall',
          reason: 'Database query failed, redirecting to paywall'
        };
      }

      if (!subscriptionData) {
        // No active subscription - redirect to paywall
        return {
          shouldRedirect: true,
          redirectPath: '/paywall',
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
      // Fallback to paywall if database is unreachable
      return {
        shouldRedirect: true,
        redirectPath: '/paywall',
        reason: 'Database unreachable, redirecting to paywall'
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
