import React from 'react';
import { AuthOptions } from '@/components/auth/AuthOptions';

interface AuthStepProps {
  onboardingData: any;
  onAuthSuccess: () => void;
}

export const AuthStep: React.FC<AuthStepProps> = ({ onboardingData, onAuthSuccess }) => (
  <div>
    <h2>Please authenticate to continue</h2>
    <AuthOptions onboardingData={onboardingData} onAuthSuccess={onAuthSuccess} />
  </div>
); 