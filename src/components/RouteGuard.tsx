import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authUtils, AuthState, RouteDecision } from '@/utils/authUtils';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredAuth?: boolean;
  allowedPaths?: string[];
}

const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  requiredAuth = true, 
  allowedPaths = [] 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [routeDecision, setRouteDecision] = useState<RouteDecision | null>(null);

  useEffect(() => {
    const checkAuthAndRoute = async () => {
      try {
        setIsChecking(true);
        
        // Get current auth state
        const currentAuthState = await authUtils.getAuthState();
        setAuthState(currentAuthState);

        // Quick check: If not authenticated and auth is required, redirect immediately
        if (requiredAuth && !currentAuthState.isAuthenticated) {
          console.log(`🚫 RouteGuard: Authentication required for ${location.pathname}, redirecting to landing`);
          navigate('/', { replace: true });
          return;
        }

        // Quick check: If not authenticated but path is allowed, allow access
        if (!requiredAuth && !currentAuthState.isAuthenticated) {
          if (allowedPaths.includes(location.pathname)) {
            console.log(`✅ RouteGuard: Allowing unauthenticated access to ${location.pathname}`);
            setIsChecking(false);
            return;
          } else {
            console.log(`🚫 RouteGuard: Path ${location.pathname} not allowed for unauthenticated users`);
            navigate('/', { replace: true });
            return;
          }
        }

        // For authenticated users, get route decision
        const decision = await authUtils.getRouteDecision(location.pathname, currentAuthState);
        setRouteDecision(decision);

        // Handle redirects for authenticated users
        if (decision.shouldRedirect && decision.redirectTo) {
          console.log(`🔄 RouteGuard: Redirecting from ${location.pathname} to ${decision.redirectTo} - ${decision.reason}`);
          navigate(decision.redirectTo, { replace: true });
          return;
        }

        console.log(`✅ RouteGuard: Access granted to ${location.pathname} - ${decision.reason}`);
        setIsChecking(false);

      } catch (error) {
        console.error('❌ RouteGuard: Error checking auth:', error);
        setAuthState({
          isInitialized: true,
          isAuthenticated: false,
          user: null,
          profile: null,
          onboardingCompleted: false,
          hasActiveSubscription: false,
          healthAssessmentCompleted: false,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        setIsChecking(false);
      }
    };

    checkAuthAndRoute();
  }, [location.pathname, navigate, requiredAuth, allowedPaths]);

  // Show loading while checking auth
  if (isChecking || !authState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Checking authentication and permissions.</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (authState.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{authState.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
};

export default RouteGuard;
