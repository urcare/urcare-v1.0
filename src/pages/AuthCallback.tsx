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
    let timeoutId: NodeJS.Timeout;
    
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
          
          // Clear the timeout since we found a session
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          
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
              
              setTimeout(() => {
                console.log('AuthCallback: Executing navigation for new user to onboarding');
                navigate('/onboarding', { replace: true });
              }, 100);
              return;
            }

            // Check if onboarding is complete - safely access the field
            const onboardingCompleted = (profileData as any)?.onboarding_completed === true;
            
            // Check for required data fields as additional validation
            const preferences = profileData.preferences as any;
            const hasRequiredData = !!(
              profileData.full_name &&
              profileData.date_of_birth &&
              profileData.gender &&
              preferences?.meals?.breakfast_time &&
              preferences?.schedule?.sleep_time &&
              preferences?.health?.blood_group
            );
            
            console.log('AuthCallback: Profile found, onboarding status:', { 
              onboardingCompleted,
              hasRequiredData,
              fullName: profileData.full_name,
              dateOfBirth: profileData.date_of_birth,
              profileData 
            });

            if (onboardingCompleted && hasRequiredData) {
              // Returning user with completed onboarding - redirect to custom plan
              console.log('AuthCallback: User with complete data, redirecting to custom plan');
              toast.success('Welcome back!', {
                description: 'You have been signed in successfully.'
              });
              
              setTimeout(() => {
                console.log('AuthCallback: Executing navigation to custom plan');
                navigate('/custom-plan', { replace: true });
              }, 100);
            } else {
              // User exists but onboarding is incomplete - redirect to onboarding
              console.log('AuthCallback: User data incomplete, redirecting to onboarding', {
                onboardingCompleted,
                hasRequiredData
              });
              toast.success('Welcome!', {
                description: onboardingCompleted ? 'Please complete your profile setup' : 'Let\'s set up your profile'
              });
              
              setTimeout(() => {
                console.log('AuthCallback: Executing navigation to onboarding');
                navigate('/onboarding', { replace: true });
              }, 100);
            }
          } catch (profileError) {
            console.error('AuthCallback: Error checking profile:', profileError);
            // If there's an error checking profile, assume user is new
            toast.success('Welcome to UrCare!', {
              description: 'Let\'s set up your profile'
            });
            
            setTimeout(() => {
              console.log('AuthCallback: Executing fallback navigation to onboarding');
              navigate('/onboarding', { replace: true });
            }, 100);
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

    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      console.log('AuthCallback: Timeout reached, forcing redirect to auth');
      toast.error('Authentication timeout', {
        description: 'Taking too long to authenticate. Please try again.'
      });
      navigate('/auth');
    }, 15000); // 15 second timeout

    handleAuthCallback();

    // Cleanup timeout on unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Completing Authentication
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Setting up your secure session...
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-500 mb-6">
          If this takes more than 15 seconds, you'll be redirected automatically.
        </div>
        
        <button 
          onClick={() => {
            console.log('AuthCallback: Manual navigation to onboarding');
            toast.info('Redirecting to setup...');
            navigate('/onboarding');
          }}
          className="text-blue-600 hover:text-blue-700 underline text-sm"
        >
          Having trouble? Click here to continue
        </button>
      </div>
    </div>
  );
};

export default AuthCallback; 