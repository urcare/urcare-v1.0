// Cache bust: 2024-01-15 - Clean authentication popup
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SplashScreen } from "@/components/ui/SplashScreen";
import { OnDemandLandingPage } from "@/components/landing/OnDemandLandingPage";
import { User, Mail, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

const Landing = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [splashDone, setSplashDone] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  // Removed authentication check - no more auto-redirect

  // Auth handlers (now with real authentication)
  const handleGetStarted = () => {
    setAuthMode("signup");
    setShowAuth(true);
  };

  const handleAlreadyMember = () => {
    setAuthMode("signin");
    setShowAuth(true);
  };

  // Email authentication handlers
  const handleEmailAuth = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Password validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      if (authMode === "signup") {
        console.log("🔐 Attempting to sign up with email:", email);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        
        if (error) {
          console.error("Sign up error:", error);
          throw error;
        }
        
        console.log("✅ Sign up response:", data);
        
        if (data.user && !data.user.email_confirmed_at) {
          toast.success("Please check your email to confirm your account");
          setShowAuth(false);
          setShowEmailForm(false);
        } else {
          toast.success("Account created successfully!");
          navigate("/welcome");
        }
      } else {
        console.log("🔐 Attempting to sign in with email:", email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          console.error("Sign in error:", error);
          throw error;
        }
        
        console.log("✅ Sign in response:", data);
        toast.success("Signed in successfully!");
        navigate("/welcome");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      let errorMessage = error.message || `Failed to ${authMode === "signup" ? "sign up" : "sign in"}`;
      
      // Handle specific error cases
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password";
      } else if (error.message?.includes("User already registered")) {
        errorMessage = "An account with this email already exists. Try signing in instead.";
      } else if (error.message?.includes("Password should be at least")) {
        errorMessage = "Password must be at least 6 characters long";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailOptionClick = () => {
    setShowEmailForm(true);
  };

  const handleBackToOptions = () => {
    setShowEmailForm(false);
    setEmail("");
    setPassword("");
  };

  const handleAuthOptionClick = async (provider: string) => {
    try {
      // Use HTTPS URL for Supabase OAuth (Supabase requires valid web URL)
      // AndroidManifest intent filters will catch https://urrcare.vercel.app/auth/callback
      // Custom scheme urcare://auth/callback is also registered as fallback
      const isNative = Capacitor.getPlatform() !== 'web';
      const redirectUrl = isNative
        ? 'https://urrcare.vercel.app/auth/callback'  // HTTPS required for Supabase, Android will intercept
        : `${window.location.origin}/auth/callback`;
      console.log('🔗 Current environment:', Capacitor.getPlatform());
      console.log('🔗 Redirect URL:', redirectUrl);

      if (provider === "Google") {
        const { supabase } = await import("@/integrations/supabase/client");
        
        // Set up browser listener before opening browser
        if (isNative) {
          // Remove any existing listeners first
          Browser.removeAllListeners();
          
          // Listen for when browser finishes (user closes or completes auth)
          Browser.addListener('browserFinished', async () => {
            console.log('🌐 Browser finished, checking authentication status...');
            // Small delay to allow redirect to complete
            setTimeout(async () => {
              try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                  console.log('✅ User authenticated, session found:', session.user.email);
                  // Navigate to callback page which will handle routing
                  window.location.href = '/auth/callback';
                } else {
                  console.log('⚠️ No session found after browser close');
                }
              } catch (err) {
                console.error('Error checking session after browser close:', err);
              }
            }, 1000);
          });
        }
        
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl,
            skipBrowserRedirect: false,
          },
        });
        if (error) throw error;
        if (data?.url) {
          console.log('🔗 Opening OAuth URL in browser:', data.url);
          
          // Open browser - Android will intercept the redirect URL and open app
          await Browser.open({ url: data.url });
        }
      } else if (provider === "Email") {
        // Show email form
        handleEmailOptionClick();
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
            style={{ height: showEmailForm ? "420px" : "320px" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold mx-auto">
                {authMode === "signup" ? "Sign up" : "Sign in"}
              </h2>
              <button
                onClick={() => {
                  setShowAuth(false);
                  setShowEmailForm(false);
                  setEmail("");
                  setPassword("");
                }}
                className="text-2xl font-light absolute right-6 top-6"
              >
                &times;
              </button>
            </div>

            {!showEmailForm ? (
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
                  onClick={() => handleAuthOptionClick("Email")}
                  variant="outline"
                  className="w-full h-12 flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-50"
                >
                  <Mail className="w-5 h-5" />
                  <span>Continue with Email</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <button
                    onClick={handleBackToOptions}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2"
                  >
                    ← Back to options
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12"
                    />
                  </div>
                  
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  <Button
                    onClick={handleEmailAuth}
                    disabled={isLoading || !email || !password}
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {authMode === "signup" ? "Creating Account..." : "Signing In..."}
                      </div>
                    ) : (
                      authMode === "signup" ? "Create Account" : "Sign In"
                    )}
                  </Button>
                  
                  <div className="text-center">
                    <button
                      onClick={() => {
                        setAuthMode(authMode === "signup" ? "signin" : "signup");
                        setEmail("");
                        setPassword("");
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      {authMode === "signup" 
                        ? "Already have an account? Sign in" 
                        : "Don't have an account? Sign up"
                      }
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Landing;