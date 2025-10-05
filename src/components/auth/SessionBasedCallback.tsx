import { supabase } from "@/integrations/supabase/client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export const SessionBasedCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const handleSessionCallback = async () => {
      try {
        console.log("🔄 SessionBasedCallback: Starting session-based callback handling");
        
        // Get URL parameters for debugging
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        
        const debugData = {
          url: window.location.href,
          hasCode: !!code,
          hasError: !!error,
          error,
          errorDescription,
          timestamp: new Date().toISOString()
        };
        
        setDebugInfo(debugData);
        console.log("🔍 Debug Info:", debugData);

        // Check for OAuth errors first
        if (error) {
          console.error("❌ OAuth Error:", error, errorDescription);
          setError(`OAuth Error: ${errorDescription || error}`);
          setStatus('error');
          return;
        }

        // Try to get the current session (this should work with implicit flow)
        console.log("🔄 Getting current session...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("❌ Session error:", sessionError);
          setError(`Session error: ${sessionError.message}`);
          setStatus('error');
          return;
        }

        if (session?.user) {
          console.log("✅ Session found, user:", session.user.id);
          setStatus('success');
          
          // Show success message
          toast.success("Welcome back!", {
            description: "Redirecting to your dashboard...",
          });
          
          // Redirect to appropriate page
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1500);
        } else {
          console.log("⚠️ No session found");
          
          // If we have a code, try to handle it manually
          if (code) {
            console.log("🔄 Attempting manual code handling...");
            // For implicit flow, we don't need to exchange the code
            // The session should already be available
            setError("Authentication session not found. Please try logging in again.");
            setStatus('error');
          } else {
            setError("No authentication session found. Please try logging in again.");
            setStatus('error');
          }
        }

      } catch (error) {
        console.error("❌ Unexpected error in session callback:", error);
        setError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setStatus('error');
      }
    };

    handleSessionCallback();
  }, []);

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="text-center p-6 max-w-md mx-auto">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Authentication Error</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          
          {debugInfo && import.meta.env.DEV && (
            <div className="mb-6 p-4 bg-gray-100 rounded text-left text-xs">
              <h3 className="font-bold mb-2">Debug Info:</h3>
              <pre className="whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
          
          <div className="space-y-2">
            <button
              onClick={() => window.location.href = "/"}
              className="w-full bg-logo-text text-white px-6 py-3 rounded-lg hover:bg-logo-text/90 transition-colors"
            >
              Return to Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Try Again
            </button>
          </div>
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
        {debugInfo && import.meta.env.DEV && (
          <div className="mt-4 p-4 bg-gray-100 rounded text-left text-xs max-w-md">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <pre className="whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
