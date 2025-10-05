import { supabase } from "@/integrations/supabase/client";
import React, { useEffect, useState } from "react";

export const SimpleAuthCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("🔄 SimpleAuthCallback: Starting authentication...");
        
        // Wait a moment for Supabase to process the OAuth callback
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("❌ Session error:", sessionError);
          setError(`Session error: ${sessionError.message}`);
          setStatus('error');
          return;
        }

        if (session?.user) {
          console.log("✅ Authentication successful:", session.user.id);
          setStatus('success');
          
          // Redirect to dashboard immediately
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1000);
        } else {
          console.log("⚠️ No session found");
          setError("No authentication session found. Please try logging in again.");
          setStatus('error');
        }

      } catch (error) {
        console.error("❌ Authentication error:", error);
        setError(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, []);

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="text-center p-6 max-w-md mx-auto">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Authentication Error</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <button
            onClick={() => window.location.href = "/"}
            className="bg-logo-text text-white px-6 py-3 rounded-lg hover:bg-logo-text/90 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Authentication Successful!</h2>
          <p className="text-text-secondary mb-6">Redirecting you to your dashboard...</p>
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-logo-text border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-text-secondary">Completing authentication...</p>
      </div>
    </div>
  );
};
