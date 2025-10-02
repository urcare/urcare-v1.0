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
      // Don't redirect if still loading or not initialized
      if (!isInitialized || loading || isProcessing) return;

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

        // Only redirect if we're not already on the correct route
        if (flow.nextRoute !== window.location.pathname) {
          navigate(flow.nextRoute, { replace: true });
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
