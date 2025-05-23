
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';
import { toast } from 'sonner';

export const useAuthOperations = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const signIn = async (email: string, password: string, rememberMe: boolean) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken: undefined
        }
      });

      if (error) throw error;
      
      if (data?.user) {
        const from = location.state?.from?.pathname || '/';
        navigate(from);
        toast.success('Logged in successfully', {
          description: `Welcome back!`
        });
      }
    } catch (error: any) {
      toast.error('Login failed', {
        description: error.message
      });
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    fullName: string, 
    role: UserRole, 
    phone?: string
  ) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
            phone: phone || null
          }
        }
      });

      if (error) throw error;

      toast.success('Account created successfully', {
        description: 'Please check your email for verification instructions.'
      });
      
      navigate('/auth');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error('Registration failed', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      navigate('/auth');
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error('Error signing out', {
        description: error.message
      });
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      toast.success('Password reset email sent', {
        description: 'Check your email for the reset link.'
      });
    } catch (error: any) {
      toast.error('Failed to send reset email', {
        description: error.message
      });
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    loading
  };
};
