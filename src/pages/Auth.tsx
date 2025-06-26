import React from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Auth = () => {
  const { user, profile, loading, isInitialized } = useAuth();

  // Add debugging information
  console.log('Auth Component Debug:', {
    user: !!user,
    profile: !!profile,
    loading,
    isInitialized,
    userEmail: user?.email,
    profileRole: profile?.role
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

  // Redirect to appropriate dashboard if already authenticated
  if (user && profile) {
    // Map roles to existing routes in the application
    const roleRoutes = {
      'patient': '/', // Main dashboard
      'doctor': '/ai-diagnostics', // AI Diagnostics for doctors
      'nurse': '/mental-health', // Mental Health for nurses
      'admin': '/analytics', // Analytics for admins
      'pharmacy': '/lims', // LIMS for pharmacy
      'lab': '/lims', // LIMS for lab
      'reception': '/clinical-analytics' // Clinical Analytics for reception
    };
    
    const redirectPath = roleRoutes[profile.role] || '/';
    console.log('Redirecting authenticated user to:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  // Show the full AuthForm for unauthenticated users
  return <AuthForm />;
};

export default Auth;
