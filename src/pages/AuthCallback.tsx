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
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast.error('Authentication failed', {
            description: error.message
          });
          navigate('/auth');
          return;
        }

        if (data.session?.user) {
          console.log('AuthCallback: User authenticated, checking profile...', { 
            userId: data.session.user.id,
            email: data.session.user.email 
          });
          
          // Check if user profile exists and onboarding is complete
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', data.session.user.id)
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
              // Returning user with completed onboarding - redirect to dashboard
              console.log('AuthCallback: Returning user, redirecting to dashboard');
              toast.success('Welcome back!', {
                description: 'You have been signed in successfully.'
              });
              navigate('/dashboard', { replace: true });
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