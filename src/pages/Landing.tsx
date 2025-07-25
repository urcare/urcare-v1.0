import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { OnDemandLandingPage } from '@/components/landing/OnDemandLandingPage';
import { SplashScreen } from '@/components/ui/SplashScreen';

const Landing = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const { user, profile, isInitialized, loading } = useAuth();

  useEffect(() => {
    if (isInitialized && !loading && user && profile?.onboarding_completed) {
      navigate('/custom-plan', { replace: true });
    }
  }, [isInitialized, loading, user, profile, navigate]);

  const handleSplashComplete = () => {
    // Add a small delay to ensure smooth transition
    setTimeout(() => {
      setShowSplash(false);
    }, 300);
  };

  // Also hide splash screen after 3 seconds as a fallback
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <OnDemandLandingPage />
    </div>
  );
};

export default Landing; 