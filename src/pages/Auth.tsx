import React from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Auth = () => {
  const { user, profile, loading, isInitialized, isOnboardingComplete } = useAuth();

  // Add debugging information
  console.log('Auth Component Debug:', {
    user: !!user,
    profile: !!profile,
    loading,
    isInitialized,
    userEmail: user?.email,
    profileRole: profile?.role,
    profileComplete: isOnboardingComplete()
  });

  // Show loading while initializing
  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to appropriate page if already authenticated
  if (user) {
    // Check if profile is complete using the new method
    const onboardingComplete = isOnboardingComplete();
    console.log('Auth: User found, checking onboarding status:', {
      onboardingComplete,
      profile: !!profile,
      profileData: profile
    });
    
    if (!onboardingComplete) {
      // New user or incomplete onboarding - redirect to onboarding
      console.log('User onboarding incomplete, redirecting to onboarding');
      return <Navigate to="/onboarding" replace />;
    } else {
      // Returning user with complete onboarding - redirect to custom plan
      console.log('User onboarding complete, redirecting to custom plan');
      return <Navigate to="/custom-plan" replace />;
    }
  }

  // Show the full AuthForm for unauthenticated users
  return <AuthForm />;
};

export default Auth;
