
import React from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Auth = () => {
  const { user, profile, loading, isInitialized } = useAuth();

  // Show loading while initializing
  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to appropriate dashboard if already authenticated
  if (user && profile) {
    const roleRoutes = {
      'patient': '/dashboard/patient',
      'doctor': '/dashboard/doctor',
      'nurse': '/dashboard/nurse',
      'admin': '/dashboard/admin',
      'pharmacy': '/dashboard/pharmacy',
      'lab': '/dashboard/lab',
      'reception': '/dashboard/reception'
    };
    
    const redirectPath = roleRoutes[profile.role] || '/dashboard/patient';
    return <Navigate to={redirectPath} replace />;
  }

  return <AuthForm />;
};

export default Auth;
