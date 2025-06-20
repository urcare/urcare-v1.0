
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  allowedRoles,
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

  // Redirect to auth if not authenticated
  if (!user || !profile) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(profile.role)) {
    return (
      <Navigate 
        to="/unauthorized" 
        state={{ 
          from: location,
          requiredRoles: allowedRoles,
          userRole: profile.role 
        }} 
        replace 
      />
    );
  }

  return <>{children}</>;
};
