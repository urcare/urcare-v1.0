// Cache bust: 2024-01-15 - Clean authentication popup
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SplashScreen } from "@/components/ui/SplashScreen";
import { OnDemandLandingPage } from "@/components/landing/OnDemandLandingPage";
import { User, Mail, Smartphone } from "lucide-react";
import { toast } from "sonner";

const Landing = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [splashDone, setSplashDone] = useState(false);
  const navigate = useNavigate();

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setSplashDone(true);
    setShowSplash(false);
  };

  // Auto-hide splash screen after timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!splashDone) {
        setSplashDone(true);
        setShowSplash(false);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [splashDone]);

  // Check for authenticated user and redirect to welcome screen
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('🔐 User authenticated, redirecting to welcome screen');
          navigate('/welcome', { replace: true });
        }
      } catch (error) {
        console.log('🔐 No authenticated user found');
      }
    };

    // Check auth after splash screen is done
    if (splashDone) {
      checkAuth();
    }
  }, [splashDone, navigate]);

  // Auth handlers (now with real authentication)
  const handleGetStarted = () => {
    setAuthMode("signup");
    setShowAuth(true);
  };

  const handleAlreadyMember = () => {
    setAuthMode("signin");
    setShowAuth(true);
  };

  const handleAuthOptionClick = async (provider: string) => {
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`; // Use auth/callback for localhost
      console.log('🔗 Current origin:', window.location.origin); // Debug log
      console.log('🔗 Redirect URL:', redirectUrl); // Debug log
      
      if (provider === "Google") {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl, // Explicitly set localhost redirect
          },
        });
        if (error) throw error;
        if (data?.url) {
          console.log('🔗 OAuth URL:', data.url); // Debug log
          window.location.replace(data.url);
        }
      } else if (provider === "Apple") {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'apple',
          options: {
            redirectTo: redirectUrl, // Explicitly set localhost redirect
          },
        });
        if (error) throw error;
        if (data?.url) {
          console.log('🔗 OAuth URL:', data.url); // Debug log
          window.location.replace(data.url);
        }
      } else if (provider === "Email") {
        // Show email form
        toast.info("Email authentication coming soon!");
      }
    } catch (error) {
      toast.error(`Failed to ${authMode === "signup" ? "sign up" : "sign in"} with ${provider}`);
    }
  };

  return (
    <div>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      <OnDemandLandingPage
        onGetStarted={handleGetStarted}
        onAlreadyMember={handleAlreadyMember}
      />

      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="w-full max-w-md bg-white rounded-t-3xl shadow-xl pb-8 pt-4 px-6"
            style={{ height: "320px" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold mx-auto">
                {authMode === "signup" ? "Sign up" : "Sign in"}
              </h2>
              <button
                onClick={() => setShowAuth(false)}
                className="text-2xl font-light absolute right-6 top-6"
              >
                &times;
              </button>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => handleAuthOptionClick("Google")}
                variant="outline"
                className="w-full h-12 flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-50"
              >
                <User className="w-5 h-5" />
                <span>Continue with Google</span>
              </Button>
              <Button
                onClick={() => handleAuthOptionClick("Apple")}
                variant="outline"
                className="w-full h-12 flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-50"
              >
                <Smartphone className="w-5 h-5" />
                <span>Continue with Apple</span>
              </Button>
              <Button
                onClick={() => handleAuthOptionClick("Email")}
                variant="outline"
                className="w-full h-12 flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-50"
              >
                <Mail className="w-5 h-5" />
                <span>Continue with Email</span>
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Landing;