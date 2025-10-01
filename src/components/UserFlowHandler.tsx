import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UserFlowHandlerProps {
  children: React.ReactNode;
}

export const UserFlowHandler: React.FC<UserFlowHandlerProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, profile, loading, isInitialized } = useAuth();

  useEffect(() => {
    // Don't redirect if still loading or not initialized
    if (!isInitialized || loading) return;

    // If no user, redirect to landing
    if (!user) {
      navigate('/');
      return;
    }

    // If no profile, redirect to onboarding
    if (!profile) {
      navigate('/onboarding');
      return;
    }

    // Check if onboarding is completed
    if (!profile.onboarding_completed) {
      navigate('/onboarding');
      return;
    }

    // Check if user has active subscription
    const hasActiveSubscription = profile.subscription_status === 'active' || 
                                 profile.subscription_status === 'trialing';

    // If no active subscription, redirect to paywall
    if (!hasActiveSubscription) {
      navigate('/paywall');
      return;
    }

    // If everything is complete, allow access to dashboard
    // This will be handled by the specific route components

  }, [user, profile, loading, isInitialized, navigate]);

  return <>{children}</>;
};

export default UserFlowHandler;
