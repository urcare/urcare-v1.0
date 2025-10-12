import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { handleUserRouting } from '@/utils/authRouting';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children, requireAuth = true }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('🛡️ RouteGuard - Auth state:', { user: !!user, loading, requireAuth });
    
    // If auth is still loading, wait
    if (loading) {
      console.log('⏳ RouteGuard - Auth still loading, waiting...');
      return;
    }

    // If no authentication required, render children
    if (!requireAuth) {
      console.log('✅ RouteGuard - No auth required, rendering children');
      return;
    }

    // If no user and auth is required, redirect to landing
    if (!user) {
      console.log('❌ RouteGuard - No user found, redirecting to landing');
      navigate('/', { replace: true });
      return;
    }

    // User is authenticated, check routing
    console.log('✅ RouteGuard - User authenticated, checking routing...');
    
    handleUserRouting(user).then((result) => {
      console.log('🎯 RouteGuard - Routing result:', result);
      
      if (result.shouldRedirect) {
        console.log(`📍 RouteGuard - Redirecting to ${result.redirectPath}: ${result.reason}`);
        navigate(result.redirectPath, { replace: true });
      }
    }).catch((error) => {
      console.error('❌ RouteGuard - Routing error:', error);
      // Fallback to dashboard on error
      navigate('/dashboard', { replace: true });
    });
  }, [user, loading, navigate, requireAuth]);

  // Show loading while auth is loading (but with timeout)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading</h2>
          <p className="text-gray-600">Please wait...</p>
          <p className="text-sm text-gray-500 mt-2">If this takes too long, try refreshing the page</p>
        </div>
      </div>
    );
  }

  // If no auth required or user is authenticated, render children
  if (!requireAuth || user) {
    return <>{children}</>;
  }

  // If auth required but no user, show loading (will redirect)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Redirecting</h2>
        <p className="text-gray-600">Please wait...</p>
      </div>
    </div>
  );
};

export default RouteGuard;
