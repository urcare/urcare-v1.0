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

  useEffect(() => {
    if (isInitialized && !loading && user && profile?.onboarding_completed) {
      navigate('/custom-plan', { replace: true });
    }
  }, [isInitialized, loading, user, profile, navigate]);

  const handleSplashComplete = () => {
    setTimeout(() => {
      setShowSplash(false);
    }, 300);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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
          <div className="w-full max-w-md bg-white rounded-t-3xl shadow-xl pb-8 pt-4 px-6 animate-slide-up" style={{ minHeight: '50vh' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold mx-auto">{authMode === 'signup' ? 'Sign up' : 'Sign in'}</h2>
              <button onClick={() => setShowAuth(false)} className="text-2xl font-light absolute right-6 top-6">&times;</button>
            </div>
            <AuthOptions onboardingData={{}} onAuthSuccess={() => setShowAuth(false)} mode={authMode} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing; 