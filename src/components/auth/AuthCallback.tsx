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
      }, 10000); // 10 seconds timeout

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
          
          // Set the session manually
          const { data: { session }, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });

          if (sessionError) {
            console.error('AuthCallback: Error setting session:', sessionError);
            toast.error('Authentication failed', { description: sessionError.message });
            navigate('/');
            return;
          }

          console.log('AuthCallback: Session set successfully:', session);
        }

        // Now try to get the session
        const { data: { session }, error: getSessionError } = await supabase.auth.getSession();
        
        if (getSessionError) {
          console.error('AuthCallback: Error getting session:', getSessionError);
          toast.error('Authentication failed', { description: getSessionError.message });
          navigate('/');
          return;
        }

        console.log('AuthCallback: Session data:', session);

        if (session?.user) {
          console.log('AuthCallback: User authenticated:', session.user);
          
          // Wait a moment for the auth state to propagate
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Check if user has a profile and onboarding status
          let { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('onboarding_completed, preferences')
            .eq('id', session.user.id)
            .single();

          console.log('AuthCallback: Profile data:', profileData);
          console.log('AuthCallback: Profile error:', profileError);

          // If profile doesn't exist, create one
          if (profileError && profileError.code === 'PGRST116') {
            console.log('AuthCallback: Profile not found, creating new profile...');
            const { data: newProfile, error: createError } = await supabase
              .from('user_profiles')
              .insert([{
                id: session.user.id,
                full_name: session.user.user_metadata?.full_name || session.user.email,
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
        } else {
          console.log('AuthCallback: No session found, redirecting to landing');
          navigate('/');
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