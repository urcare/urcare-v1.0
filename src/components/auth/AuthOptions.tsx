import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Google, Apple, Mail } from 'lucide-react';

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
  const { signInWithGoogle, signInWithApple, signInWithEmail } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onAuthSuccess();
    } catch (error) {
      console.error('Google sign-in failed:', error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
      onAuthSuccess();
    } catch (error) {
      console.error('Apple sign-in failed:', error);
    }
  };

  const handleEmailSignIn = async () => {
    try {
      await signInWithEmail();
      onAuthSuccess();
    } catch (error) {
      console.error('Email sign-in failed:', error);
    }
  };

  return (
    <div className="space-y-3">
      {/* Google Sign In */}
      <Button
        onClick={handleGoogleSignIn}
        variant="outline"
        className="w-full h-12 flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-50"
      >
        <Google className="w-5 h-5" />
        <span>Continue with Google</span>
      </Button>

      {/* Apple Sign In */}
      <Button
        onClick={handleAppleSignIn}
        variant="outline"
        className="w-full h-12 flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-50"
      >
        <Apple className="w-5 h-5" />
        <span>Continue with Apple</span>
      </Button>

      {/* Email Sign In */}
      <Button
        onClick={handleEmailSignIn}
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
