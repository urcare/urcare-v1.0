import React from 'react';
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

  // Show simple auth form for unauthenticated users
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            UrCare Health Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Secure access to your comprehensive health management system
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <button
            type="button"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign In
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
