import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface DebugInfoProps {
  show?: boolean;
}

export const DebugInfo: React.FC<DebugInfoProps> = ({ show = false }) => {
  const { user, profile, loading, isInitialized } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const gatherDebugInfo = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        setDebugInfo({
          timestamp: new Date().toISOString(),
          environment: import.meta.env.MODE,
          hostname: window.location.hostname,
          pathname: window.location.pathname,
          search: window.location.search,
          user: user ? {
            id: user.id,
            email: user.email,
            created_at: user.created_at
          } : null,
          profile: profile ? {
            id: profile.id,
            onboarding_completed: profile.onboarding_completed,
            status: profile.status
          } : null,
          session: session ? {
            access_token: session.access_token ? 'present' : 'missing',
            refresh_token: session.refresh_token ? 'present' : 'missing',
            expires_at: session.expires_at
          } : null,
          sessionError: sessionError ? sessionError.message : null,
          loading,
          isInitialized,
          supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'not set',
          supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'present' : 'missing'
        });
      } catch (error) {
        setDebugInfo({
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
      }
    };

    if (show) {
      gatherDebugInfo();
    }
  }, [user, profile, loading, isInitialized, show]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg max-w-md text-xs font-mono z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <pre className="whitespace-pre-wrap overflow-auto max-h-64">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
};
