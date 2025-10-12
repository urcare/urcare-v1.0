import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface RoutingResult {
  shouldRedirect: boolean;
  redirectPath: string;
  reason: string;
}

/**
 * Handles user routing logic after authentication
 * Based on database table checks: profiles → onboarding_profiles → user_subscription
 */
export const handleUserRouting = async (user: User): Promise<RoutingResult> => {
  try {
    console.log('🔄 Starting routing check for user:', user.id);

    // 1. Check if profile exists in profiles table
    console.log('🔍 Step 1: Checking profiles table for user:', user.id);
    
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();
    
    console.log('📊 Profiles table result:', { existingProfile, profileCheckError });
    
    if (profileCheckError) {
      console.error('❌ Profiles table error:', profileCheckError);
    }

    // If profile doesn't exist, create it
    if (profileCheckError && profileCheckError.code === 'PGRST116') {
      console.log('📝 Profile not found, creating new profile...');
      
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
        console.error('❌ Profile creation error:', profileError);
        // Continue with routing even if profile creation fails
      } else {
        console.log('✅ Profile created successfully');
      }
    } else if (existingProfile) {
      console.log('✅ Profile exists, updating last_sign_in');
      // Profile exists, update last_sign_in
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          last_sign_in: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('❌ Profile update error:', updateError);
      }
    }

    // 2. Check onboarding_profiles table for onboarding_completed
    console.log('🔍 Step 2: Checking onboarding_profiles table for user:', user.id);
    
    const { data: onboardingProfile, error: onboardingError } = await supabase
      .from('onboarding_profiles')
      .select('onboarding_completed')
      .eq('user_id', user.id)
      .single();
    
    console.log('📊 Onboarding profiles table result:', { onboardingProfile, onboardingError });
    
    if (onboardingError) {
      console.error('❌ Onboarding profiles table error:', onboardingError);
    }

    if (onboardingError || !onboardingProfile) {
      console.log('📋 No onboarding profile found, redirecting to onboarding');
      return {
        shouldRedirect: true,
        redirectPath: '/onboarding',
        reason: 'User needs to complete onboarding'
      };
    }

    if (!onboardingProfile.onboarding_completed) {
      console.log('📋 Onboarding not completed, redirecting to onboarding');
      return {
        shouldRedirect: true,
        redirectPath: '/onboarding',
        reason: 'User needs to complete onboarding'
      };
    }

    console.log('✅ Onboarding completed');

    // 3. Check onboarding_profiles for health_assessment_completed
    console.log('🔍 Step 3: Checking health_assessment_completed for user:', user.id);
    
    const { data: healthAssessment, error: healthError } = await supabase
      .from('onboarding_profiles')
      .select('health_assessment_completed')
      .eq('user_id', user.id)
      .single();
    
    console.log('📊 Health assessment table result:', { healthAssessment, healthError });
    
    if (healthError) {
      console.error('❌ Health assessment table error:', healthError);
    }

    if (healthError || !healthAssessment) {
      console.log('🏥 Health assessment data not found, redirecting to health assessment');
      return {
        shouldRedirect: true,
        redirectPath: '/health-assessment',
        reason: 'User needs to complete health assessment'
      };
    }

    if (!healthAssessment.health_assessment_completed) {
      console.log('🏥 Health assessment not completed, redirecting to health assessment');
      return {
        shouldRedirect: true,
        redirectPath: '/health-assessment',
        reason: 'User needs to complete health assessment'
      };
    }

    console.log('✅ Health assessment completed');

    // 4. Check user_subscriptions table for active subscription
    console.log('🔍 Step 4: Checking user_subscriptions table for user:', user.id);
    
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();
    
    console.log('📊 Subscription query result:', { subscriptionData, subscriptionError });
    
    if (subscriptionError) {
      console.error('❌ Subscription table error:', subscriptionError);
    }

    if (subscriptionError) {
      console.error('❌ Subscription query error:', subscriptionError);
      console.log('🔄 Redirecting to paywall due to subscription error');
      return {
        shouldRedirect: true,
        redirectPath: '/paywall',
        reason: 'Database query failed, redirecting to paywall'
      };
    }

    if (!subscriptionData) {
      console.log('💳 No active subscription found, redirecting to paywall');
      console.log('🔄 User has no subscription, must go to paywall');
      return {
        shouldRedirect: true,
        redirectPath: '/paywall',
        reason: 'No active subscription found'
      };
    }

    console.log('✅ Active subscription found');

    // 5. All checks passed - redirect to dashboard
    console.log('🎯 All checks passed, redirecting to dashboard');
    return {
      shouldRedirect: true,
      redirectPath: '/dashboard',
      reason: 'User has completed all requirements'
    };

  } catch (error) {
    console.error('❌ Error in routing check:', error);
    // Fallback to dashboard on error
    return {
      shouldRedirect: true,
      redirectPath: '/dashboard',
      reason: 'Error occurred, fallback to dashboard'
    };
  }
};
