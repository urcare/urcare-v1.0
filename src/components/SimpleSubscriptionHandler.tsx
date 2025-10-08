import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const SimpleSubscriptionHandler: React.FC = () => {
  const { user, profile, isInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only run if auth is initialized and user exists
    if (!isInitialized || !user || !profile) {
      return;
    }

    // Skip for public routes
    const publicRoutes = ['/', '/legal', '/auth', '/auth/callback', '/onboarding'];
    if (publicRoutes.includes(location.pathname)) {
      return;
    }

    // STEP 2: Check subscription status after onboarding completion
    if (profile.onboarding_completed) {
      // For now, just redirect to dashboard if onboarding is completed
      // TODO: Add actual subscription check here
      if (location.pathname !== '/dashboard') {
        console.log('🔄 STEP 2: Onboarding completed, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, profile, isInitialized, location.pathname, navigate]);

  // This component doesn't render anything
  return null;
};
