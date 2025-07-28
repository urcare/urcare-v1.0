import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  full_name: string | null;
  age: number | null;
  date_of_birth: string | null;
  gender: string | null;
  unit_system: string | null;
  height_feet: string | null;
  height_inches: string | null;
  height_cm: string | null;
  weight_lb: string | null;
  weight_kg: string | null;
  wake_up_time: string | null;
  sleep_time: string | null;
  work_start: string | null;
  work_end: string | null;
  chronic_conditions: string[] | null;
  takes_medications: string | null;
  medications: string[] | null;
  has_surgery: string | null;
  surgery_details: string[] | null;
  health_goals: string[] | null;
  diet_type: string | null;
  blood_group: string | null;
  breakfast_time: string | null;
  lunch_time: string | null;
  dinner_time: string | null;
  workout_time: string | null;
  routine_flexibility: string | null;
  uses_wearable: string | null;
  wearable_type: string | null;
  track_family: string | null;
  share_progress: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  critical_conditions: string | null;
  has_health_reports: string | null;
  health_reports: string[] | null;
  referral_code: string | null;
  save_progress: string | null;
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
      
      // Use a simpler approach that works better
      const { data, error } = await supabase.auth.signInWithOAuth({ 
        provider: 'google',
        options: { 
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error('OAuth error:', error);
        throw error;
      }
      
      console.log('OAuth initiated successfully:', data);
      
      // The redirect should happen automatically
      // If we get a URL, it means we need to redirect manually
      if (data?.url) {
        console.log('Redirecting to OAuth URL:', data.url);
        window.location.href = data.url;
      }
      
    } catch (error: any) {
      setLoading(false);
      console.error('Google sign-in failed:', error);
      toast.error('Google sign-in failed', { 
        description: error.message || 'Failed to initialize Google sign-in' 
      });
      throw error;
    }
  };

  const signInWithApple = async () => {
    setLoading(true);
    try {
      console.log('Calling supabase.auth.signInWithOAuth for Apple');
      
      const { data, error } = await supabase.auth.signInWithOAuth({ 
        provider: 'apple',
        options: { 
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error('Apple OAuth error:', error);
        throw error;
      }
      
      console.log('Apple OAuth initiated successfully:', data);
      
      // The redirect should happen automatically
      // If we get a URL, it means we need to redirect manually
      if (data?.url) {
        console.log('Redirecting to Apple OAuth URL:', data.url);
        window.location.href = data.url;
      }
      
    } catch (error: any) {
      setLoading(false);
      console.error('Apple sign-in failed:', error);
      toast.error('Apple sign-in failed', { 
        description: error.message || 'Failed to initialize Apple sign-in' 
      });
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
