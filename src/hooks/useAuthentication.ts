import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import type { User, Session, AuthError } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  session: Session | null;
}

interface AuthOperations {
  signUp: (email: string, password: string, metadata?: any) => Promise<{ user: User | null; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signInWithProvider: (provider: 'google' | 'github' | 'facebook') => Promise<{ user: User | null; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: any) => Promise<{ error: AuthError | null }>;
  deleteAccount: () => Promise<{ error: AuthError | null }>;
}

export const useAuthentication = (): AuthState & AuthOperations => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          toast.error('Authentication error', { description: error.message });
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
        toast.error('Unexpected authentication error');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN') {
          toast.success('Successfully signed in');
        } else if (event === 'SIGNED_OUT') {
          toast.success('Successfully signed out');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Authentication operations
  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });
      
      if (error) {
        toast.error('Sign up failed', { description: error.message });
        return { user: null, error };
      }
      
      if (data.user && !data.session) {
        toast.success('Check your email for the confirmation link');
      }
      
      return { user: data.user, error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast.error('Unexpected error during sign up');
      return { user: null, error: authError };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error('Sign in failed', { description: error.message });
        return { user: null, error };
      }
      
      return { user: data.user, error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast.error('Unexpected error during sign in');
      return { user: null, error: authError };
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: 'google' | 'github' | 'facebook') => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        toast.error(`${provider} sign in failed`, { description: error.message });
        return { user: null, error };
      }
      
      // OAuth redirects to provider, user will be set via onAuthStateChange
      return { user: null, error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast.error(`Unexpected error during ${provider} sign in`);
      return { user: null, error: authError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error('Sign out failed', { description: error.message });
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast.error('Unexpected error during sign out');
      return { error: authError };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      
      if (error) {
        toast.error('Password reset failed', { description: error.message });
        return { error };
      }
      
      toast.success('Password reset email sent');
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast.error('Unexpected error during password reset');
      return { error: authError };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        toast.error('Password update failed', { description: error.message });
        return { error };
      }
      
      toast.success('Password updated successfully');
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast.error('Unexpected error during password update');
      return { error: authError };
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      const { error } = await supabase.auth.updateUser({ data: updates });
      
      if (error) {
        toast.error('Profile update failed', { description: error.message });
        return { error };
      }
      
      toast.success('Profile updated successfully');
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast.error('Unexpected error during profile update');
      return { error: authError };
    }
  };

  const deleteAccount = async () => {
    try {
      // Note: Account deletion typically requires server-side implementation
      // This is a placeholder for the client-side portion
      toast.warning('Account deletion requires admin approval');
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast.error('Unexpected error during account deletion');
      return { error: authError };
    }
  };

  return {
    user,
    loading,
    session,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    deleteAccount
  };
}; 