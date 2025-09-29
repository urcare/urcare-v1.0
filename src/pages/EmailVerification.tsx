import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Mail, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { emailService } from '@/services/emailService';

const EmailVerification: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();
  const { signInWithEmailVerification } = useAuth();

  useEffect(() => {
    // Get email from localStorage
    const pendingAuth = localStorage.getItem('pendingEmailAuth');
    if (pendingAuth) {
      const authData = JSON.parse(pendingAuth);
      setEmail(authData.email);
      setUserData(authData);
    } else {
      // If no pending auth data, redirect back to email auth
      navigate('/email-auth', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    // Countdown timer
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(numericValue);
    setError('');
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code');
      return;
    }

    if (!userData) {
      setError('User data not found. Please try again.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Verify the code using the email service
      const result = await emailService.verifyCode(email, verificationCode);
      
      if (result.success) {
        // Create user account with Supabase
        await signInWithEmailVerification(
          userData.email,
          userData.password,
          userData.fullName,
          userData.city
        );
        
        // Clear pending auth data
        localStorage.removeItem('pendingEmailAuth');
        
        toast.success('Email verified successfully!', {
          description: 'Redirecting to onboarding...'
        });
        
        // Redirect to onboarding
        setTimeout(() => {
          navigate('/onboarding', { replace: true });
        }, 1000);
      } else {
        throw new Error(result.message || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Verification error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Verification failed';
      setError(errorMessage);
      toast.error('Verification failed', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend || !userData) return;
    
    setIsLoading(true);
    setError('');

    try {
      const result = await emailService.sendVerificationCode({
        email: email,
        fullName: userData.fullName,
        resend: true
      });

      if (result.success) {
        setTimeLeft(300); // Reset timer
        setCanResend(false);
        setVerificationCode('');
        toast.success('Verification code resent!', {
          description: 'Please check your email for the new code.'
        });
      } else {
        throw new Error(result.message || 'Failed to resend verification code');
      }
    } catch (error) {
      console.error('Resend error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend code';
      setError(errorMessage);
      toast.error('Resend failed', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/email-auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Verify Your Email
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Enter the 6-digit code sent to your email
                </CardDescription>
              </div>
              <div className="w-10" /> {/* Spacer for centering */}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">
                We sent a verification code to
              </p>
              <p className="font-medium text-gray-900">{email}</p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="verificationCode" className="text-sm font-medium text-gray-700">
                  Verification Code
                </Label>
                <Input
                  id="verificationCode"
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className="text-center text-2xl font-mono tracking-widest"
                  maxLength={6}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify Email
                  </div>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center space-y-4">
              {timeLeft > 0 ? (
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  Code expires in {formatTime(timeLeft)}
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend Code
                </Button>
              )}
              
              <p className="text-xs text-gray-500">
                Didn't receive the code? Check your spam folder or try resending.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EmailVerification;
