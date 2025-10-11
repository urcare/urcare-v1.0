// Cache bust: 2024-01-15 - Clean authentication popup
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SplashScreen } from "@/components/ui/SplashScreen";
import { OnDemandLandingPage } from "@/components/landing/OnDemandLandingPage";
import { User, Mail, Smartphone, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { handleUserRouting } from "@/utils/authRouting";
import { config } from "@/config";

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
    console.log('🚀 handleEmailAuth called!');
    console.log('📧 Email:', email);
    console.log('🔒 Password length:', password.length);
    
    if (!email || !password) {
      console.log('❌ Missing email or password');
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
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        
        if (error) {
          throw error;
        }
        
        if (data.user && !data.user.email_confirmed_at) {
          toast.success("Please check your email to confirm your account");
          setShowAuth(false);
          setShowEmailForm(false);
        } else {
          toast.success("Account created successfully!");
          navigate("/welcome");
        }
      } else {
        // Simple sign-in for both localhost and production
        console.log('🔐 Attempting sign-in...');
        console.log('🌐 Environment:', window.location.hostname);
        console.log('🔧 Supabase URL:', config.supabase.url);
        console.log('🔑 Supabase Key:', config.supabase.anonKey ? 'Present' : 'Missing');
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          console.log('📊 Sign-in response:', { data, error });
          
          if (error) {
            console.error('❌ Supabase sign-in error:', error);
            console.error('❌ Error details:', {
              message: error.message,
              status: error.status,
              statusText: error.statusText
            });
            throw error;
          }
        } catch (supabaseError) {
          console.error('❌ Supabase request failed:', supabaseError);
          throw new Error(`Authentication failed: ${supabaseError.message}`);
        }
        
        console.log('✅ Sign-in successful:', data.user?.email);
        
        // Check if user needs email confirmation
        if (data.user && !data.user.email_confirmed_at) {
          console.log('⚠️ User needs email confirmation');
          toast.error("Please check your email and click the confirmation link before signing in");
          return;
        }
        
        console.log('🔄 Starting routing logic...');
        
        // Simple success and redirect
        toast.success("Signed in successfully!");
        
        // Use the same routing logic as AuthCallback with timeout
        console.log('🎯 Calling handleUserRouting...');
        
        const routingTimeout = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Routing timeout')), 10000);
        });
        
        try {
          const routingResult = await Promise.race([
            handleUserRouting(data.user),
            routingTimeout
          ]);
          
          console.log('📍 Routing result:', routingResult);
          
          if (routingResult.shouldRedirect) {
            console.log('🚀 Navigating to:', routingResult.redirectPath);
            navigate(routingResult.redirectPath, { replace: true });
          } else {
            console.log('❌ No redirect path provided');
          }
        } catch (routingError) {
          console.error('❌ Routing failed:', routingError);
          // Fallback to welcome page
          navigate('/welcome', { replace: true });
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      let errorMessage = error.message || `Failed to ${authMode === "signup" ? "sign up" : "sign in"}`;
      
      // Handle specific error cases
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (error.message?.includes("User already registered")) {
        errorMessage = "An account with this email already exists. Try signing in instead.";
      } else if (error.message?.includes("Password should be at least")) {
        errorMessage = "Password must be at least 6 characters long";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Please check your email and click the confirmation link before signing in";
      } else if (error.message?.includes("Too many requests")) {
        errorMessage = "Too many attempts. Please wait a moment and try again";
      } else if (error.message?.includes("Network")) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message?.includes("fetch")) {
        errorMessage = "Connection error. Please try again.";
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
                    onClick={() => {
                      console.log('🖱️ Sign-in button clicked!');
                      console.log('📧 Email value:', email);
                      console.log('🔒 Password value:', password);
                      console.log('⏳ Loading state:', isLoading);
                      handleEmailAuth();
                    }}
                    disabled={isLoading || !email || !password}
                    style={{ pointerEvents: 'auto' }}
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