import React, { useState, useEffect } from 'react';
import { OnDemandLandingPage } from '@/components/landing/OnDemandLandingPage';
import { SplashScreen } from '@/components/landing/SplashScreen';

export default function OnDemandLanding() {
  const [showSplash, setShowSplash] = useState(true);

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
} 