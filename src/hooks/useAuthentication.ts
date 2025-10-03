import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface AuthState {
  user: any | null; // Changed from User to any as User type is no longer imported
  loading: boolean;
  session: any | null; // Changed from Session to any as Session type is no longer imported
}

interface AuthOperations {
  signUp: (email: string, password: string, metadata?: any) => Promise<{ user: any | null; error: any | null }>; // Changed from AuthError to any
  signIn: (email: string, password: string) => Promise<{ user: any | null; error: any | null }>; // Changed from AuthError to any
  signInWithProvider: (provider: 'google' | 'github' | 'facebook') => Promise<{ user: any | null; error: any | null }>; // Changed from AuthError to any
  signOut: () => Promise<{ error: any | null }>; // Changed from AuthError to any
  resetPassword: (email: string) => Promise<{ error: any | null }>; // Changed from AuthError to any
  updatePassword: (password: string) => Promise<{ error: any | null }>; // Changed from AuthError to any
  updateProfile: (updates: any) => Promise<{ error: any | null }>; // Changed from AuthError to any
  deleteAccount: () => Promise<{ error: any | null }>; // Changed from AuthError to any
}

export const useAuthentication = (): AuthState & AuthOperations => {
  const [user, setUser] = useState<any | null>(null); // Changed from User to any
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any | null>(null); // Changed from Session to any

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        // Remove supabase.auth.getSession()
        // Remove supabase.auth.onAuthStateChange()
        // Remove setSession(session) and setUser(session?.user ?? null)
        // Remove setLoading(false)
        // Remove toast.error('Authentication error', { description: error.message })
        // Remove toast.error('Unexpected authentication error')
        // Remove setLoading(false)
      } catch (error) {
        console.error('Unexpected error getting session:', error);
        toast.error('Unexpected authentication error');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    // Remove supabase.auth.onAuthStateChange()
    // Remove setSession(session) and setUser(session?.user ?? null)
    // Remove setLoading(false)
    // Remove toast.success('Successfully signed in')
    // Remove toast.success('Successfully signed out')
  }, []);

  // Authentication operations
  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setLoading(true);
      // Remove supabase.auth.signUp()
      // Remove toast.error('Sign up failed', { description: error.message })
      // Remove return { user: null, error }
      // Remove if (data.user && !data.session) { toast.success('Check your email for the confirmation link'); }
      // Remove return { user: data.user, error: null }
    } catch (error) {
      const authError = error as any; // Changed from AuthError to any
      toast.error('Unexpected error during sign up');
      return { user: null, error: authError };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Remove supabase.auth.signInWithPassword()
      // Remove toast.error('Sign in failed', { description: error.message })
      // Remove return { user: null, error }
    } catch (error) {
      const authError = error as any; // Changed from AuthError to any
      toast.error('Unexpected error during sign in');
      return { user: null, error: authError };
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: 'google' | 'github' | 'facebook') => {
    try {
      setLoading(true);
      // Remove supabase.auth.signInWithOAuth()
      // Remove toast.error(`${provider} sign in failed`, { description: error.message })
      // Remove return { user: null, error }
      // Remove // OAuth redirects to provider, user will be set via onAuthStateChange
      // Remove return { user: null, error: null }
    } catch (error) {
      const authError = error as any; // Changed from AuthError to any
      toast.error(`Unexpected error during ${provider} sign in`);
      return { user: null, error: authError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      // Remove supabase.auth.signOut()
      // Remove toast.error('Sign out failed', { description: error.message })
      // Remove return { error }
    } catch (error) {
      const authError = error as any; // Changed from AuthError to any
      toast.error('Unexpected error during sign out');
      return { error: authError };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Remove supabase.auth.resetPasswordForEmail()
      // Remove toast.error('Password reset failed', { description: error.message })
      // Remove return { error }
    } catch (error) {
      const authError = error as any; // Changed from AuthError to any
      toast.error('Unexpected error during password reset');
      return { error: authError };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      // Remove supabase.auth.updateUser()
      // Remove toast.error('Password update failed', { description: error.message })
      // Remove return { error }
    } catch (error) {
      const authError = error as any; // Changed from AuthError to any
      toast.error('Unexpected error during password update');
      return { error: authError };
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      // Remove supabase.auth.updateUser()
      // Remove toast.error('Profile update failed', { description: error.message })
      // Remove return { error }
    } catch (error) {
      const authError = error as any; // Changed from AuthError to any
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
      const authError = error as any; // Changed from AuthError to any
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