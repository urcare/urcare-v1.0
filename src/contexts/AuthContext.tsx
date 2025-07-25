import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  emergency_contact: string | null;
  emergency_phone: string | null;
  health_id: string | null;
  guardian_id: string | null;
  status: string;
  preferences: any;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  isInitialized: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithEmail: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  isOnboardingComplete: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch user profile from user_profiles table
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Helper: Ensure user profile row exists
  const ensureUserProfile = async (user: any) => {
    if (!user) return;
    // Try to fetch the profile
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (fetchError && fetchError.code !== 'PGRST116') {
      // Some error other than "no rows"
      console.error('Error fetching user profile:', fetchError);
      return;
    }
    if (!profile) {
      // No profile exists, create a blank one
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert([{ id: user.id, full_name: user.user_metadata?.full_name || user.email }]);
      if (insertError) {
        console.error('Error inserting blank user profile:', insertError);
      } else {
        console.log('Blank user profile created for', user.id);
      }
    }
  };

  // Initialize auth state and listen for changes
  useEffect(() => {
    let mounted = true;
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (mounted) {
          setUser(user);
          if (user) {
            await ensureUserProfile(user);
            const profile = await fetchUserProfile(user.id);
            setProfile(profile);
            console.log('AuthContext: Loaded user and profile on init', { user, profile });
          } else {
            setProfile(null);
            console.log('AuthContext: No user on init');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };
    initializeAuth();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        await ensureUserProfile(session.user);
        const profile = await fetchUserProfile(session.user.id);
        setProfile(profile);
        console.log('AuthContext: Auth state changed, user logged in', { user: session.user, profile });
      } else {
        setUser(null);
        setProfile(null);
        console.log('AuthContext: Auth state changed, user logged out');
      }
    });
    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) throw error;
      toast.success('Signup successful! Please check your email to confirm your account.');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error('Signup failed', { description: error.message });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Login successful!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed', { description: error.message });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    console.log('signInWithGoogle called');
    setLoading(true);
    try {
      console.log('Calling supabase.auth.signInWithOAuth for Google');
      await supabase.auth.signInWithOAuth({ provider: 'google' });
      console.log('supabase.auth.signInWithOAuth for Google finished (should redirect or popup)');
    } catch (error: any) {
      setLoading(false);
      console.error('Google sign-in failed:', error);
      toast.error('Google sign-in failed', { description: error.message || 'Failed to initialize Google sign-in' });
      throw error;
    }
  };

  const signInWithApple = async () => {
    setLoading(true);
    try {
      await supabase.auth.signInWithOAuth({ provider: 'apple' });
    } catch (error: any) {
      setLoading(false);
      toast.error('Apple sign-in failed', { description: error.message || 'Failed to initialize Apple sign-in' });
      throw error;
    }
  };

  const signInWithEmail = async () => {
    setLoading(true);
    try {
      // For now, we'll use a simple email/password form approach
      // This could be enhanced with a modal or separate page
      toast.info('Email sign-in feature coming soon!');
      // You can implement a modal or redirect to email sign-in page here
    } catch (error: any) {
      console.error('Email sign-in error:', error);
      toast.error('Email sign-in failed', { description: error.message || 'Failed to initialize email sign-in' });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Signout error:', error);
      toast.error('Signout failed', { description: error.message });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);
      if (error) throw error;
      await refreshProfile();
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error('Profile update failed', { description: error.message || 'An error occurred while updating your profile.' });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const profile = await fetchUserProfile(user.id);
      setProfile(profile);
      console.log('AuthContext: Profile refreshed', { profile });
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const isOnboardingComplete = (): boolean => {
    if (!profile) {
      console.log('isOnboardingComplete: No profile found');
      return false;
    }
    return !!profile.onboarding_completed;
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    isInitialized,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
    signInWithGoogle,
    signInWithApple,
    signInWithEmail,
    isOnboardingComplete
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
