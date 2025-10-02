import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { userFlowService, type UserFlowState } from '@/services/userFlowService';
import { toast } from 'sonner';

interface UserFlowHandlerProps {
  children: React.ReactNode;
}

export const UserFlowHandler: React.FC<UserFlowHandlerProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, profile, loading, isInitialized } = useAuth();
  const [flowState, setFlowState] = useState<UserFlowState | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleUserFlow = async () => {
      console.log("UserFlowHandler: Effect triggered", { isInitialized, loading, isProcessing, user: !!user, pathname: window.location.pathname });
      
      // Don't redirect if still loading or not initialized
      if (!isInitialized || loading || isProcessing) {
        console.log("UserFlowHandler: Skipping - not ready", { isInitialized, loading, isProcessing });
        return;
      }

      // Don't redirect if already on dashboard and user is authenticated
      if (window.location.pathname === '/dashboard' && user) {
        console.log("UserFlowHandler: Already on dashboard with authenticated user, skipping flow check");
        return;
      }

      // In development mode, if we're on dashboard and no user (due to localhost bypass), stay on dashboard
      if (window.location.pathname === '/dashboard' && !user && 
          (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        console.log("UserFlowHandler: Development mode - staying on dashboard without user");
        return;
      }

      try {
        setIsProcessing(true);

        // Handle special users (admin/test) first
        if (user) {
          const email = user.email?.toLowerCase() || '';
          if (email === 'admin@urcare.com' || email === 'admin' || 
              email === 'test@email.com' || email === 'test@urcare.com') {
            const specialFlow = await userFlowService.handleSpecialUserFlow(user, profile);
            setFlowState(specialFlow);
            
            if (specialFlow.nextRoute !== window.location.pathname) {
              navigate(specialFlow.nextRoute, { replace: true });
            }
            return;
          }
        }

        // Handle regular user flow
        const flow = await userFlowService.getUserFlowState(user, profile);
        setFlowState(flow);

        console.log("UserFlowHandler: Flow state:", flow);
        console.log("UserFlowHandler: Current path:", window.location.pathname);
        console.log("UserFlowHandler: Next route:", flow.nextRoute);

        // Only redirect if we're not already on the correct route
        if (flow.nextRoute !== window.location.pathname) {
          console.log("UserFlowHandler: Redirecting from", window.location.pathname, "to", flow.nextRoute);
          navigate(flow.nextRoute, { replace: true });
        } else {
          console.log("UserFlowHandler: Already on correct route, no redirect needed");
        }

      } catch (error) {
        console.error('Error handling user flow:', error);
        // Fallback to onboarding
        navigate('/onboarding', { replace: true });
      } finally {
        setIsProcessing(false);
      }
    };

    handleUserFlow();
  }, [user, profile, loading, isInitialized, navigate, isProcessing]);

  // Show loading state while processing
  if (isProcessing || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default UserFlowHandler;
