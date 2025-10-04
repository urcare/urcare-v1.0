import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { EmailSignupModal } from '@/components/EmailSignupModal';

interface AuthOptionsProps {
  onboardingData: any;
  onAuthSuccess: () => void;
  mode?: 'signup' | 'signin';
}

export const AuthOptions: React.FC<AuthOptionsProps> = ({ onboardingData, onAuthSuccess, mode = 'signup' }) => {
  const { signInWithGoogle, signInWithEmail, loading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEmailSignupModal, setShowEmailSignupModal] = useState(false);


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


  return (
    <div className="w-full max-w-md mx-auto flex flex-col min-h-[70vh] justify-between">
      <div>
        {/* Heading handled by parent modal, so skip here */}
        
        <div className="space-y-4">
          {/* OAuth Buttons - Show same options for both signup and signin modes */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              onMouseDown={(e) => console.log('Google button mouse down')}
              onTouchStart={(e) => console.log('Google button touch start')}
              className="w-full flex items-center justify-center gap-3 border-2 border-black rounded-full py-4 text-lg font-medium mb-2 bg-white hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              disabled={isProcessing}
              style={{ pointerEvents: isProcessing ? 'none' : 'auto' }}
              type="button"
              aria-label={mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
              tabIndex={0}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              {isProcessing ? (mode === 'signup' ? 'Signing up...' : 'Signing in...') : (mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google')}
            </button>
            <button
              onClick={mode === 'signup' ? handleEmailSignUp : handleEmailSignIn}
              onMouseDown={(e) => console.log('Email button mouse down')}
              onTouchStart={(e) => console.log('Email button touch start')}
              className="w-full flex items-center justify-center gap-3 border-2 border-black rounded-full py-4 text-lg font-medium bg-white hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              disabled={isProcessing}
              style={{ pointerEvents: isProcessing ? 'none' : 'auto' }}
              type="button"
              aria-label={mode === 'signup' ? 'Sign up with Email' : 'Sign in with Email'}
              tabIndex={0}
            >
              <Mail className="h-6 w-6" />
              {isProcessing ? (mode === 'signup' ? 'Signing up...' : 'Signing in...') : (mode === 'signup' ? 'Sign up with Email' : 'Sign in with Email')}
            </button>
          </div>
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