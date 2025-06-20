
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getAuthRedirectURL, getPostLoginRedirectURL } from '@/utils/authUtils';

export const useAuthOperations = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signIn = async (email: string, password: string, rememberMe = false) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error('Sign in failed', {
          description: error.message
        });
        return { error };
      }

      if (data.user) {
        toast.success('Welcome back!', {
          description: 'You have been signed in successfully.'
        });
        
        // Get the appropriate redirect URL
        const redirectURL = getPostLoginRedirectURL();
        const path = new URL(redirectURL).pathname;
        navigate(path);
      }

      return { data };
    } catch (error: any) {
      toast.error('An unexpected error occurred', {
        description: error.message
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    
    try {
      const redirectUrl = getAuthRedirectURL();
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });

      if (error) {
        toast.error('Google sign in failed', {
          description: error.message
        });
        return { error };
      }

      return { data };
    } catch (error: any) {
      toast.error('An unexpected error occurred', {
        description: error.message
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    setLoading(true);
    
    try {
      const redirectUrl = getAuthRedirectURL();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (error) {
        toast.error('Sign up failed', {
          description: error.message
        });
        return { error };
      }

      if (data.user) {
        toast.success('Account created successfully!', {
          description: 'Please check your email to verify your account.'
        });
        
        // Redirect to onboarding for new users
        navigate('/onboarding');
      }

      return { data };
    } catch (error: any) {
      toast.error('An unexpected error occurred', {
        description: error.message
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error('Sign out failed', {
          description: error.message
        });
        return { error };
      }

      toast.success('Signed out successfully');
      navigate('/');
      
      return { success: true };
    } catch (error: any) {
      toast.error('An unexpected error occurred', {
        description: error.message
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    loading
  };
};
