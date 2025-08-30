import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { OnDemandLandingPage } from '@/components/landing/OnDemandLandingPage';
import { SplashScreen } from '@/components/ui/SplashScreen';
import { AuthOptions } from '@/components/auth/AuthOptions';

const Landing = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const navigate = useNavigate();
  const { user, profile, isInitialized, loading } = useAuth();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (isInitialized && !loading && user && profile?.onboarding_completed) {
      // Only redirect if we're not already on the landing page
      if (window.location.pathname === '/') {
        navigate('/custom-plan', { replace: true });
      }
    }
  }, [isInitialized, loading, user, profile, navigate]);

  const handleSplashComplete = () => {
    setSplashDone(true);
    setShowSplash(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!splashDone) {
        setSplashDone(true);
        setShowSplash(false);
      }
    }, 1200); // 1.2s for faster splash
    return () => clearTimeout(timer);
  }, [splashDone]);

  // Handler for Get Started button
  const handleGetStarted = () => {
    setAuthMode('signup');
    setShowAuth(true);
  };
  // Handler for I'm already a member button
  const handleAlreadyMember = () => {
    setAuthMode('signin');
    setShowAuth(true);
  };

  return (
    <div>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <OnDemandLandingPage onGetStarted={handleGetStarted} onAlreadyMember={handleAlreadyMember} />
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30">
          <div className="w-full max-w-md bg-white rounded-t-3xl shadow-xl pb-8 pt-4 px-6 animate-slide-up" style={{ height: '320px' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold mx-auto">{authMode === 'signup' ? 'Sign up' : 'Sign in'}</h2>
              <button onClick={() => setShowAuth(false)} className="text-2xl font-light absolute right-6 top-6">&times;</button>
            </div>
            <AuthOptions onboardingData={{}} onAuthSuccess={() => {
              setShowAuth(false);
              // Only handle non-OAuth flows here (like email sign-in)
              // OAuth flows are handled by AuthCallback component
              if (authMode === 'signup') {
                navigate('/welcome-screen');
              } else if (authMode === 'signin') {
                // For signin, check if user has completed onboarding
                if (profile?.onboarding_completed) {
                  navigate('/custom-plan');
                } else {
                  navigate('/welcome-screen');
                }
              }
            }} mode={authMode} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing; 