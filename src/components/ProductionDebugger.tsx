import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const ProductionDebugger: React.FC = () => {
  const { user, profile, loading, isInitialized } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const gatherInfo = () => {
      setDebugInfo({
        timestamp: new Date().toISOString(),
        user: user ? { id: user.id, email: user.email } : null,
        profile: profile ? { 
          id: profile.id, 
          onboarding_completed: profile.onboarding_completed,
          status: profile.status 
        } : null,
        loading,
        isInitialized,
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash
      });
    };

    gatherInfo();
    
    // Update every 2 seconds to track changes
    const interval = setInterval(gatherInfo, 2000);
    
    return () => clearInterval(interval);
  }, [user, profile, loading, isInitialized]);

  // Only show in production and when there are issues
  if (import.meta.env.DEV) return null;
  
  // Only show if there's a potential issue
  if (loading || isInitialized) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-100 border border-red-300 rounded-lg p-3 max-w-sm text-xs font-mono z-50">
      <div className="font-bold text-red-800 mb-2">Production Debug</div>
      <pre className="whitespace-pre-wrap text-red-700">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
};
