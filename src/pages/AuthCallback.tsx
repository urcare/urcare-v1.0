import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  emergency_contact: string | null;
  emergency_phone: string | null;
  health_id: string | null;
  guardian_id: string | null;
  role: string;
  status: string;
  preferences: any;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('AuthCallback: Starting OAuth callback handling...');
        console.log('AuthCallback: Current URL:', window.location.href);
        console.log('AuthCallback: URL hash:', window.location.hash);
        console.log('AuthCallback: URL search params:', window.location.search);
        
        // First, try to handle the OAuth callback if there are auth params in the URL
        const { data: authData, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          console.error('Auth callback session error:', authError);
          toast.error('Authentication failed', {
            description: authError.message
          });
          navigate('/auth');
          return;
        }

        let sessionData = authData;
        
        // If no session yet, wait a bit for the OAuth callback to process
        if (!authData.session) {
          console.log('AuthCallback: No session found yet, waiting for OAuth processing...');
          
          // Wait a moment for the OAuth flow to complete
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Try getting session again
          const { data: retryData, error: retryError } = await supabase.auth.getSession();
          
          if (retryError) {
            console.error('Auth callback retry error:', retryError);
            toast.error('Authentication failed', {
              description: retryError.message
            });
            navigate('/auth');
            return;
          }
          
          if (!retryData.session) {
            console.log('AuthCallback: Still no session, redirecting to auth');
            toast.error('Authentication failed', {
              description: 'No session was established'
            });
            navigate('/auth');
            return;
          }
          
          sessionData = retryData;
        }

        if (sessionData.session?.user) {
          console.log('AuthCallback: User authenticated, checking profile...', { 
            userId: sessionData.session.user.id,
            email: sessionData.session.user.email 
          });
          
          // Check if user profile exists and onboarding is complete
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', sessionData.session.user.id)
              .single();

            if (profileError) {
              console.log('AuthCallback: No profile found, user is new');
              // User is new - redirect to onboarding
              toast.success('Welcome to UrCare!', {
                description: 'Let\'s set up your profile'
              });
              navigate('/onboarding', { replace: true });
              return;
            }

            // Check if onboarding is complete - safely access the field
            const onboardingCompleted = (profileData as any)?.onboarding_completed || false;
            console.log('AuthCallback: Profile found, onboarding status:', { 
              onboardingCompleted,
              profileData 
            });

            if (onboardingCompleted) {
              // Returning user with completed onboarding - redirect to custom plan
              console.log('AuthCallback: Returning user, redirecting to custom plan');
              toast.success('Welcome back!', {
                description: 'You have been signed in successfully.'
              });
              navigate('/custom-plan', { replace: true });
            } else {
              // User exists but onboarding is incomplete - redirect to onboarding
              console.log('AuthCallback: User exists but onboarding incomplete, redirecting to onboarding');
              toast.success('Welcome back!', {
                description: 'Please complete your profile setup'
              });
              navigate('/onboarding', { replace: true });
            }
          } catch (profileError) {
            console.error('AuthCallback: Error checking profile:', profileError);
            // If there's an error checking profile, assume user is new
            toast.success('Welcome to UrCare!', {
              description: 'Let\'s set up your profile'
            });
            navigate('/onboarding', { replace: true });
          }
        } else {
          console.log('AuthCallback: No session found, redirecting to auth');
          navigate('/auth');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('Authentication failed');
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback; 