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

      try {
        // First, try to get the session from the URL hash/fragment
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('AuthCallback: Error getting session:', sessionError);
          toast.error('Authentication failed', { description: sessionError.message });
          navigate('/');
          return;
        }

        console.log('AuthCallback: Session data:', session);

        if (session?.user) {
          console.log('AuthCallback: User authenticated:', session.user);
          
          // Wait a moment for the auth state to propagate
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if user has a profile and onboarding status
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('onboarding_completed, preferences')
            .eq('id', session.user.id)
            .single();

          console.log('AuthCallback: Profile data:', profileData);
          console.log('AuthCallback: Profile error:', profileError);

          if (profileError && profileError.code !== 'PGRST116') {
            console.error('AuthCallback: Error fetching profile:', profileError);
            // Don't redirect on profile error, just log it
          }

          // Determine where to redirect based on onboarding status
          if (!profileData || !profileData.onboarding_completed) {
            console.log('AuthCallback: Redirecting to welcome screen');
            navigate('/welcome-screen');
          } else {
            // Check subscription status
            const isSubscribed = profileData.preferences?.subscription === 'active';
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
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Completing authentication...</p>
      </div>
    </div>
  );
}; 