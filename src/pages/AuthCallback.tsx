import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('🔄 AuthCallback - Auth state:', { user: !!user, loading, userEmail: user?.email });
    
    // If user is authenticated, redirect immediately (don't wait for loading)
    if (user) {
      console.log('✅ User authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }

    // If auth is still loading, wait
    if (loading) {
      console.log('⏳ Auth still loading, waiting...');
      return;
    }

    // If no user after loading is complete, redirect to landing
    console.log('❌ No user found, redirecting to landing');
    navigate('/', { replace: true });
  }, [user, loading, navigate]);

  // Add a timeout fallback in case something goes wrong
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('⚠️ AuthCallback timeout - forcing redirect to dashboard');
      navigate('/dashboard', { replace: true });
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [navigate]);

  return null;
};

export default AuthCallback;