import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log('AuthCallback: Starting OAuth callback handling...');
      console.log('AuthCallback: Current URL:', window.location.href);
      console.log('AuthCallback: URL hash:', window.location.hash);
      console.log('AuthCallback: URL search params:', window.location.search);

      // Add a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.error('AuthCallback: Timeout reached, redirecting to landing page');
        navigate('/');
      }, 5000); // 5 seconds timeout

      try {
        // Check if we have OAuth tokens in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        const accessToken = urlParams.get('access_token') || hashParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token') || hashParams.get('refresh_token');
        const error = urlParams.get('error') || hashParams.get('error');
        const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');

        console.log('AuthCallback: Parsed tokens:', { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken,
          error,
          errorDescription
        });

        if (error) {
          console.error('AuthCallback: OAuth error:', error, errorDescription);
          toast.error('Authentication failed', { description: errorDescription || error });
          navigate('/');
          return;
        }

        if (accessToken) {
          console.log('AuthCallback: Found access token, setting session...');
          
          try {
            // Set the session manually
            const { data: { session }, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            });

            if (sessionError) {
              console.error('AuthCallback: Error setting session:', sessionError);
              // Try alternative approach - just proceed with the tokens we have
              console.log('AuthCallback: Trying alternative approach...');
            } else {
              console.log('AuthCallback: Session set successfully:', session);
            }
          } catch (error) {
            console.error('AuthCallback: Exception setting session:', error);
            // Continue with alternative approach
            console.log('AuthCallback: Continuing with alternative approach...');
          }
        }

        // Now try to get the session
        console.log('AuthCallback: Getting session after setting...');
        const { data: { session }, error: getSessionError } = await supabase.auth.getSession();
        
        if (getSessionError) {
          console.error('AuthCallback: Error getting session:', getSessionError);
          toast.error('Authentication failed', { description: getSessionError.message });
          navigate('/');
          return;
        }

        console.log('AuthCallback: Session data:', session);
        
        // Extract user info from tokens if session is not available
        let userId = session?.user?.id;
        let userEmail = session?.user?.email;
        
        if (!userId && accessToken) {
          // Try to decode the token to get user info
          try {
            const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
            userId = tokenPayload.sub;
            userEmail = tokenPayload.email;
            console.log('AuthCallback: Extracted user info from token:', { userId, userEmail });
          } catch (error) {
            console.error('AuthCallback: Failed to decode token:', error);
          }
        }

        if (!userId) {
          console.error('AuthCallback: No valid user ID found');
          toast.error('Authentication failed', { description: 'Unable to identify user' });
          navigate('/');
          return;
        }

        console.log('AuthCallback: Processing user:', { userId, userEmail });
        
        // Wait a moment for the auth state to propagate
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if user has a profile and onboarding status
        let { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('onboarding_completed, preferences')
          .eq('id', userId)
          .single();

        console.log('AuthCallback: Profile data:', profileData);
        console.log('AuthCallback: Profile error:', profileError);

        // If profile doesn't exist, create one
        if (profileError && profileError.code === 'PGRST116') {
          console.log('AuthCallback: Profile not found, creating new profile...');
          const { data: newProfile, error: createError } = await supabase
            .from('user_profiles')
            .insert([{
              id: userId,
              full_name: userEmail,
              onboarding_completed: false
            }])
            .select('onboarding_completed, preferences')
            .single();

          if (createError) {
            console.error('AuthCallback: Error creating profile:', createError);
          } else {
            console.log('AuthCallback: Profile created successfully:', newProfile);
            profileData = newProfile;
            profileError = null;
          }
        } else if (profileError) {
          console.error('AuthCallback: Error fetching profile:', profileError);
          // Don't redirect on profile error, just log it
        }

        // Determine where to redirect based on onboarding status
        if (!profileData || !profileData.onboarding_completed) {
          console.log('AuthCallback: Redirecting to welcome screen');
          console.log('AuthCallback: Profile data is null or onboarding not completed');
          console.log('AuthCallback: profileData:', profileData);
          console.log('AuthCallback: onboarding_completed:', profileData?.onboarding_completed);
          navigate('/welcome-screen');
        } else {
          // Check subscription status
          const isSubscribed = profileData.preferences?.subscription === 'active';
          console.log('AuthCallback: User has completed onboarding, checking subscription');
          console.log('AuthCallback: isSubscribed:', isSubscribed);
          if (isSubscribed) {
            console.log('AuthCallback: Redirecting to dashboard');
            navigate('/dashboard');
          } else {
            console.log('AuthCallback: Redirecting to custom plan');
            navigate('/custom-plan');
          }
        }
      } catch (error) {
        console.error('AuthCallback: Unexpected error:', error);
        toast.error('Authentication failed', { description: 'An unexpected error occurred' });
        navigate('/');
      } finally {
        clearTimeout(timeoutId);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Completing authentication...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we set up your account...</p>
      </div>
    </div>
  );
}; 