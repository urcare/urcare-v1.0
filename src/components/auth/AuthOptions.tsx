import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { EmailSignupModal } from '@/components/EmailSignupModal';

interface AuthOptionsProps {
  onboardingData: any;
  onAuthSuccess: () => void;
  mode?: 'signup' | 'signin';
  showAdminPlaceholders?: boolean;
}

export const AuthOptions: React.FC<AuthOptionsProps> = ({ onboardingData, onAuthSuccess, mode = 'signup', showAdminPlaceholders = false }) => {
  const { signInWithGoogle, signInWithApple, signInWithEmail, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEmailSignupModal, setShowEmailSignupModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: onboardingData?.fullName || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // This function is no longer used as per the new_code, but kept for consistency
      // await signIn(formData.email, formData.password);
      onAuthSuccess();
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    try {
      // This function is no longer used as per the new_code, but kept for consistency
      // await signUp(formData.email, formData.password, formData.fullName, formData.role);
      onAuthSuccess();
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  // Improved handlers for Apple/Google/Email sign-in
  const handleAppleSignIn = async () => {
    console.log('Apple sign-in button clicked');
    if (isProcessing) {
      console.log('Already processing, ignoring click');
      return;
    }
    setIsProcessing(true);
    try {
      console.log('Calling signInWithApple...');
      await signInWithApple();
      console.log('signInWithApple completed');
      // OAuth will redirect to /auth/callback, so we don't need to call onAuthSuccess here
      // The AuthCallback component will handle the post-login flow
    } catch (error) {
      console.error('Apple sign-in error:', error);
      setIsProcessing(false);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('Google sign-in button clicked');
    if (isProcessing) {
      console.log('Already processing, ignoring click');
      return;
    }
    setIsProcessing(true);
    try {
      // Persist onboarding data before redirect
      console.log('handleGoogleSignIn: onboardingData to save:', onboardingData);
      localStorage.setItem('pendingOnboardingData', JSON.stringify(onboardingData));
      console.log('Saved onboardingData to localStorage before Google sign-in');
      
      console.log('Calling signInWithGoogle...');
      await signInWithGoogle();
      console.log('signInWithGoogle completed');
      // OAuth will redirect to /auth/callback, so we don't need to call onAuthSuccess here
      // The AuthCallback component will handle the post-login flow
    } catch (error) {
      console.error('Google sign-in error:', error);
      setIsProcessing(false);
    }
  };

  const handleEmailSignIn = async () => {
    console.log('Email sign-in button clicked');
    if (isProcessing) {
      console.log('Already processing, ignoring click');
      return;
    }
    setIsProcessing(true);
    try {
      // Check if admin/admin credentials are used
      if (showAdminPlaceholders && formData.email === 'admin' && formData.password === 'admin') {
        console.log('Admin credentials detected - proceeding with demo mode');
        toast.success('Admin login successful! (Demo Mode)');
        onAuthSuccess();
        return;
      }
      
      console.log('Calling signInWithEmail...');
      await signInWithEmail();
      console.log('signInWithEmail completed');
      setIsProcessing(false);
      // For now, just show a toast since email sign-in is not fully implemented
      toast.info('Email sign-in feature coming soon!');
    } catch (error) {
      console.error('Email sign-in error:', error);
      setIsProcessing(false);
    }
  };

  const handleEmailSignUp = async () => {
    console.log('Email sign-up button clicked');
    setShowEmailSignupModal(true);
  };

  // Add debug log to onAuthSuccess
  const handleAuthSuccess = async () => {
    console.log('onAuthSuccess called');
    // Ensure user profile row exists
    const user = JSON.parse(localStorage.getItem('supabase.auth.user') || 'null');
    if (user && user.id) {
      const { data: profile, error: selectError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (!profile) {
        const { error: upsertError } = await supabase.from('user_profiles').upsert([
          { id: user.id, full_name: user.email, onboarding_completed: false }
        ]);
        if (upsertError) {
          console.error('Failed to upsert user profile after sign-up:', upsertError);
        } else {
          console.log('Upserted user profile after sign-up for user:', user.id);
        }
      }
    }
    onAuthSuccess();
  };

  // Test button handler
  const handleTestClick = () => {
    console.log('Test button clicked!');
    toast.success('Test button works!');
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col min-h-[70vh] justify-between">
      <div>
        {/* Heading handled by parent modal, so skip here */}
        
        <div className="space-y-4">
          {/* Email/Password Form - Show only for admin placeholders (signin mode) */}
          {showAdminPlaceholders && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="admin"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-medium"
                disabled={isProcessing}
              >
                {isProcessing ? 'Signing in...' : 'Sign in with Email'}
              </Button>
            </form>
          )}

          {/* OAuth Buttons - Show when not using admin placeholders or when in signup mode */}
          {(!showAdminPlaceholders || mode === 'signup') && (
            <div className="space-y-4">
              {/* Only show Google and Email for signup mode */}
              {mode === 'signup' ? (
                <>
                  <button
                    onClick={handleGoogleSignIn}
                    onMouseDown={(e) => console.log('Google button mouse down')}
                    onTouchStart={(e) => console.log('Google button touch start')}
                    className="w-full flex items-center justify-center gap-3 border-2 border-black rounded-full py-4 text-lg font-medium mb-2 bg-white hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                    disabled={isProcessing}
                    style={{ pointerEvents: isProcessing ? 'none' : 'auto' }}
                    type="button"
                    aria-label="Sign up with Google"
                    tabIndex={0}
                  >
                    <svg className="h-6 w-6" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    {isProcessing ? 'Signing up...' : 'Sign up with Google'}
                  </button>
                  <button
                    onClick={handleEmailSignUp}
                    onMouseDown={(e) => console.log('Email button mouse down')}
                    onTouchStart={(e) => console.log('Email button touch start')}
                    className="w-full flex items-center justify-center gap-3 border-2 border-black rounded-full py-4 text-lg font-medium bg-white hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                    disabled={isProcessing}
                    style={{ pointerEvents: isProcessing ? 'none' : 'auto' }}
                    type="button"
                    aria-label="Sign up with Email"
                    tabIndex={0}
                  >
                    <Mail className="h-6 w-6" />
                    {isProcessing ? 'Signing up...' : 'Sign up with Email'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleAppleSignIn}
                    onMouseDown={(e) => console.log('Apple button mouse down')}
                    onTouchStart={(e) => console.log('Apple button touch start')}
                    className="w-full flex items-center justify-center gap-3 bg-black text-white rounded-full py-4 text-lg font-medium mb-2 hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                    disabled={isProcessing}
                    style={{ pointerEvents: isProcessing ? 'none' : 'auto' }}
                    type="button"
                    aria-label="Sign in with Apple"
                    tabIndex={0}
                  >
                    <svg width="24" height="24" fill="currentColor" className="inline-block"><path d="M16.365 1.43c0 1.14-.93 2.06-2.07 2.06-.03-1.18.95-2.06 2.07-2.06zm4.44 15.13c-.06-.12-2.13-1.04-2.13-3.09 0-2.43 1.98-3.5 2.07-3.56-1.13-1.66-2.89-1.89-3.5-1.91-1.5-.15-2.93.88-3.7.88-.77 0-1.97-.86-3.24-.84-1.67.03-3.22.97-4.08 2.47-1.74 3.01-.45 7.47 1.25 9.92.83 1.18 1.81 2.5 3.1 2.45 1.25-.05 1.72-.8 3.23-.8 1.51 0 1.92.8 3.24.78 1.34-.02 2.18-1.19 2.99-2.37.53-.77.75-1.18 1.17-2.07-3.07-1.18-3.56-5.6.07-6.7z"/></svg>
                    {isProcessing ? 'Signing in...' : 'Sign in with Apple'}
                  </button>
                  <button
                    onClick={handleGoogleSignIn}
                    onMouseDown={(e) => console.log('Google button mouse down')}
                    onTouchStart={(e) => console.log('Google button touch start')}
                    className="w-full flex items-center justify-center gap-3 border-2 border-black rounded-full py-4 text-lg font-medium mb-2 bg-white hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                    disabled={isProcessing}
                    style={{ pointerEvents: isProcessing ? 'none' : 'auto' }}
                    type="button"
                    aria-label="Sign in with Google"
                    tabIndex={0}
                  >
                    <svg className="h-6 w-6" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    {isProcessing ? 'Signing in...' : 'Sign in with Google'}
                  </button>
                  {/* Show Email button only when not using admin placeholders */}
                  {!showAdminPlaceholders && (
                    <button
                      onClick={handleEmailSignIn}
                      onMouseDown={(e) => console.log('Email button mouse down')}
                      onTouchStart={(e) => console.log('Email button touch start')}
                      className="w-full flex items-center justify-center gap-3 border-2 border-black rounded-full py-4 text-lg font-medium bg-white hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                      disabled={isProcessing}
                      style={{ pointerEvents: isProcessing ? 'none' : 'auto' }}
                      type="button"
                      aria-label="Continue with email"
                      tabIndex={0}
                    >
                      <Mail className="h-6 w-6" />
                      {isProcessing ? 'Signing in...' : 'Sign in with Email'}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Email Signup Modal */}
      <EmailSignupModal
        isOpen={showEmailSignupModal}
        onClose={() => setShowEmailSignupModal(false)}
        onSuccess={() => {
          setShowEmailSignupModal(false);
          onAuthSuccess();
        }}
      />
    </div>
  );
}; 