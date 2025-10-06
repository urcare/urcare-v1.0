import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Smartphone, User } from 'lucide-react';

interface AuthOptionsProps {
  onboardingData: any;
  onAuthSuccess: () => void;
  mode: 'signup' | 'signin';
  showAdminPlaceholders?: boolean;
}

export const AuthOptions: React.FC<AuthOptionsProps> = ({
  onboardingData,
  onAuthSuccess,
  mode,
  showAdminPlaceholders = false
}) => {
  const { signInWithGoogle, signInWithApple, signInWithEmail, setEmailAuthMode, setShowEmailSignupPopup } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleGoogleSignIn = async () => {
    if (isRedirecting) return; // Prevent multiple clicks
    
    try {
      setIsRedirecting(true);
      console.log('Google sign-in button clicked');
      await signInWithGoogle();
      // Note: onAuthSuccess() will be called by the auth state change listener
      // when the user returns from Google OAuth
    } catch (error) {
      console.error('Google sign-in failed:', error);
      setIsRedirecting(false);
      // Error handling is done in the AuthContext
    }
  };

  const handleAppleSignIn = async () => {
    if (isRedirecting) return; // Prevent multiple clicks
    
    try {
      setIsRedirecting(true);
      console.log('Apple sign-in button clicked');
      await signInWithApple();
      // Note: onAuthSuccess() will be called by the auth state change listener
      // when the user returns from Apple OAuth
    } catch (error) {
      console.error('Apple sign-in failed:', error);
      setIsRedirecting(false);
      // Error handling is done in the AuthContext
    }
  };

  const handleEmailAuth = async () => {
    try {
      // Set the appropriate mode and show email popup
      setEmailAuthMode(mode);
      setShowEmailSignupPopup(true);
      // Don't call onAuthSuccess here as the popup will handle it
    } catch (error) {
      console.error('Email authentication failed:', error);
    }
  };

  return (
    <div className="space-y-3">
      {/* Google Sign In */}
      <Button
        onClick={handleGoogleSignIn}
        disabled={isRedirecting}
        variant="outline"
        className="w-full h-12 flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <User className="w-5 h-5" />
        <span>{isRedirecting ? 'Redirecting...' : 'Continue with Google'}</span>
      </Button>

      {/* Apple Sign In */}
      <Button
        onClick={handleAppleSignIn}
        disabled={isRedirecting}
        variant="outline"
        className="w-full h-12 flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Smartphone className="w-5 h-5" />
        <span>{isRedirecting ? 'Redirecting...' : 'Continue with Apple'}</span>
      </Button>

      {/* Email Authentication */}
      <Button
        onClick={handleEmailAuth}
        variant="outline"
        className="w-full h-12 flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-50"
      >
        <Mail className="w-5 h-5" />
        <span>Continue with Email</span>
      </Button>

      {/* Admin Placeholders (if needed) */}
      {showAdminPlaceholders && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Admin options would appear here
          </p>
        </div>
      )}
    </div>
  );
};
