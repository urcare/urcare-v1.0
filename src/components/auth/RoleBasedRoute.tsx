
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';

export const RoleBasedRoute: React.FC<{ children: React.ReactNode, fallbackPath?: string }> = ({ 
  children, 
  fallbackPath = '/auth'
}) => {
  const { user, profile, loading, isInitialized } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (!isInitialized || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to welcome if not authenticated
  if (!user || !profile) {
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
