import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthOptions } from '@/components/auth/AuthOptions';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <AuthOptions onboardingData={{}} onAuthSuccess={() => navigate('/onboarding')} />
    </div>
  );
};

export default Auth; 