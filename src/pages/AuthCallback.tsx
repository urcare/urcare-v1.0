import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
        // Supabase authentication and session handling removed.
        // Assuming a successful authentication flow for now.
        // In a real app, you'd verify the session or handle the callback here.
        // For this placeholder, we'll just proceed to profile check.
        console.log('AuthCallback: Placeholder: Assuming successful authentication.');

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (user) {
          // Fetch user profile from user_profiles
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          if (profile && profile.onboarding_completed) {
            console.log('AuthCallback: Onboarding complete, redirecting to custom plan');
            navigate('/custom-plan', { replace: true });
            return;
          } else {
            console.log('AuthCallback: Onboarding not complete, redirecting to onboarding');
            navigate('/onboarding', { replace: true });
            return;
          }
        } else {
          console.log('AuthCallback: No session found, redirecting to welcome');
          navigate('/welcome');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('Authentication failed');
        navigate('/welcome');
      }
    };

    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      console.log('AuthCallback: Timeout reached, forcing redirect to welcome');
      toast.error('Authentication timeout', {
        description: 'Taking too long to authenticate. Please try again.'
      });
      navigate('/welcome');
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