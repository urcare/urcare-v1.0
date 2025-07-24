import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

export type UserRole = 'patient' | 'doctor' | 'nurse' | 'admin' | 'pharmacy' | 'lab' | 'reception' | 'hr';

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
  role: UserRole;
  status: string;
  preferences: any;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: any | null; // Changed from User to any as User is no longer imported
  profile: UserProfile | null;
  loading: boolean;
  isInitialized: boolean;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  canAccess: (allowedRoles: UserRole[]) => boolean;
  isOnboardingComplete: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Changed from User to any
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch user profile from our user_profiles table
  const fetchUserProfile = async (userId: string) => {
    try {
      // This function is no longer used as supabase is removed.
      // Keeping it for now as it might be re-introduced or refactored.
      console.warn('fetchUserProfile is deprecated as supabase is removed.');
      return null;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        // Supabase authentication state is no longer managed here.
        // This block is kept for now as it might be re-introduced or refactored.
        console.warn('Supabase authentication state is no longer managed here.');
        setLoading(false);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        console.log('Auth initialization complete');
        setLoading(false);
        setIsInitialized(true);
      }
    };

    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('Auth initialization timeout - forcing completion');
      setLoading(false);
      setIsInitialized(true);
    }, 10000); // 10 second timeout

    initializeAuth().finally(() => {
      clearTimeout(timeoutId);
    });

    // Listen for auth changes
    // Supabase auth state change listener is no longer active.
    // This block is kept for now as it might be re-introduced or refactored.
    console.warn('Supabase auth state change listener is no longer active.');

    return () => {
      clearTimeout(timeoutId);
      // No subscription to unsubscribe from as supabase is removed.
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    try {
      setLoading(true);
      
      // Supabase sign-up logic is no longer available.
      // This function is kept for now as it might be re-introduced or refactored.
      console.warn('Supabase sign-up logic is no longer available.');
      toast.error('Signup functionality is currently unavailable.', {
        description: 'Please try again later or contact support.'
      });
      throw new Error('Supabase sign-up functionality is not implemented.');

    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error('Signup failed', {
        description: error.message
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Supabase sign-in logic is no longer available.
      // This function is kept for now as it might be re-introduced or refactored.
      console.warn('Supabase sign-in logic is no longer available.');
      toast.error('Login functionality is currently unavailable.', {
        description: 'Please try again later or contact support.'
      });
      throw new Error('Supabase sign-in functionality is not implemented.');

    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed', {
        description: error.message
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // Supabase Google OAuth logic is no longer available.
      // This function is kept for now as it might be re-introduced or refactored.
      console.warn('Supabase Google OAuth logic is no longer available.');
      toast.error('Google sign-in functionality is currently unavailable.', {
        description: 'Please try again later or contact support.'
      });
      throw new Error('Supabase Google OAuth functionality is not implemented.');

    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast.error('Google sign-in failed', {
        description: error.message || 'Failed to initialize Google sign-in'
      });
      setLoading(false); // Reset loading state on error
      throw error;
    }
    // Note: Don't set loading to false here as the page will redirect
  };

  const signOut = async () => {
    try {
      setLoading(true);
      // Supabase sign-out logic is no longer available.
      // This function is kept for now as it might be re-introduced or refactored.
      console.warn('Supabase sign-out logic is no longer available.');
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Signout error:', error);
      toast.error('Signout failed', {
        description: error.message
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    try {
      if (!user) throw new Error('No user logged in');

      console.log('Updating profile with data:', updates);
      setLoading(true);
      
      // Supabase profile update logic is no longer available.
      // This function is kept for now as it might be re-introduced or refactored.
      console.warn('Supabase profile update logic is no longer available.');
      toast.error('Profile update functionality is currently unavailable.', {
        description: 'Please try again later or contact support.'
      });
      throw new Error('Supabase profile update functionality is not implemented.');

    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error('Profile update failed', {
        description: error.message || 'An error occurred while updating your profile.'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      // Supabase profile refresh logic is no longer available.
      // This function is kept for now as it might be re-introduced or refactored.
      console.warn('Supabase profile refresh logic is no longer available.');
      setProfile(null); // Clear profile if refresh fails
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return profile?.role === role;
  };

  const canAccess = (allowedRoles: UserRole[]): boolean => {
    return profile ? allowedRoles.includes(profile.role) : false;
  };

  const isOnboardingComplete = (): boolean => {
    if (!profile) {
      console.log('isOnboardingComplete: No profile found');
      return false;
    }
    
    // Supabase onboarding completion logic is no longer available.
    // This function is kept for now as it might be re-introduced or refactored.
    console.warn('Supabase onboarding completion logic is no longer available.');
    return false; // Assume not complete if supabase is removed
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
    hasRole,
    canAccess,
    signInWithGoogle,
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
