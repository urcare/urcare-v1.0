import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // If user is authenticated, go to dashboard
    if (user) {
      console.log('User authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }

    // If auth is still loading, wait
    if (loading) {
      return;
    }

    // If no user after loading, go to landing
    console.log('No user found, redirecting to landing');
    navigate('/', { replace: true });
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing Sign In</h2>
        <p className="text-gray-600">Please wait...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
