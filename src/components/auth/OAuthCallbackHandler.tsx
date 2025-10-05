import { supabase } from "@/integrations/supabase/client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface OAuthCallbackHandlerProps {
  onSuccess: (user: any) => void;
  onError: (error: string) => void;
}

export const OAuthCallbackHandler: React.FC<OAuthCallbackHandlerProps> = ({
  onSuccess,
  onError,
}) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log("🔄 OAuthCallbackHandler: Starting OAuth callback processing");
        
        // Get the current URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        console.log("🔍 OAuthCallbackHandler: URL params:", {
          code: code ? "present" : "missing",
          error,
          errorDescription
        });

        // Check for OAuth errors
        if (error) {
          console.error("❌ OAuthCallbackHandler: OAuth error:", error, errorDescription);
          setError(`OAuth error: ${errorDescription || error}`);
          onError(errorDescription || error);
          return;
        }

        // If no code, try to get existing session
        if (!code) {
          console.log("⚠️ OAuthCallbackHandler: No code parameter, checking existing session");
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error("❌ OAuthCallbackHandler: Session error:", sessionError);
            setError("Failed to get session");
            onError(sessionError.message);
            return;
          }

          if (session?.user) {
            console.log("✅ OAuthCallbackHandler: Existing session found");
            onSuccess(session.user);
            return;
          } else {
            console.log("⚠️ OAuthCallbackHandler: No existing session");
            setError("No authentication session found");
            onError("No authentication session found");
            return;
          }
        }

        // Handle OAuth code exchange
        console.log("🔄 OAuthCallbackHandler: Processing OAuth code");
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          console.error("❌ OAuthCallbackHandler: Code exchange error:", exchangeError);
          setError(`Authentication failed: ${exchangeError.message}`);
          onError(exchangeError.message);
          return;
        }

        if (data.session?.user) {
          console.log("✅ OAuthCallbackHandler: Authentication successful");
          onSuccess(data.session.user);
        } else {
          console.error("❌ OAuthCallbackHandler: No user in session");
          setError("Authentication failed - no user data");
          onError("Authentication failed - no user data");
        }

      } catch (error) {
        console.error("❌ OAuthCallbackHandler: Unexpected error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        setError(`Authentication failed: ${errorMessage}`);
        onError(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    };

    handleOAuthCallback();
  }, [onSuccess, onError]);

  if (error) {
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

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-logo-text border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Completing authentication...</p>
        </div>
      </div>
    );
  }

  return null;
};
