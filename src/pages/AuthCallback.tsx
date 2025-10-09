import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        
        // Get the session from the URL hash/fragment
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          
          // Redirect back to landing page after error
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 3000);
          return;
        }

        if (session?.user) {
          console.log('🔐 User authenticated successfully:', session.user.email);
          
          // Create user profile in database
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata?.full_name || '',
                avatar_url: session.user.user_metadata?.avatar_url || '',
                provider: session.user.app_metadata?.provider || 'google',
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
            } else {
              console.log('✅ Profile created/updated successfully:', profileData);
            }
          } catch (profileError) {
            console.error('Profile creation error:', profileError);
          }
          
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          
          // Check if user has completed onboarding
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('onboarding_profiles')
              .select('onboarding_completed')
              .eq('user_id', session.user.id)
              .single();

            if (profileError) {
              console.error('Error checking onboarding status:', profileError);
              // If we can't check status, redirect to welcome
              setTimeout(() => {
                navigate('/welcome', { replace: true });
              }, 2000);
            } else if (profileData?.onboarding_completed) {
              // User has completed onboarding, redirect to health assessment
              console.log('✅ User has completed onboarding, redirecting to health assessment');
              setTimeout(() => {
                navigate('/health-assessment', { replace: true });
              }, 2000);
            } else {
              // User needs to complete onboarding
              console.log('📝 User needs to complete onboarding, redirecting to welcome');
              setTimeout(() => {
                navigate('/welcome', { replace: true });
              }, 2000);
            }
          } catch (error) {
            console.error('Error checking onboarding status:', error);
            // Fallback to welcome screen
            setTimeout(() => {
              navigate('/welcome', { replace: true });
            }, 2000);
          }
        } else {
          setStatus('error');
          setMessage('No user session found. Please try again.');
          
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 3000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage('An error occurred during authentication.');
        
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authenticating...</h2>
            <p className="text-gray-600">Please wait while we complete your authentication.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Success!</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
