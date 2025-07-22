import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
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
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch user profile from our user_profiles table
  const fetchUserProfile = async (userId: string) => {
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

      // Map database fields to UserProfile interface with fallbacks for missing fields
      return {
        id: data.id,
        full_name: data.full_name,
        phone: data.phone,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        address: data.address,
        emergency_contact: data.emergency_contact,
        emergency_phone: (data as any).emergency_phone || null,
        health_id: data.health_id,
        guardian_id: data.guardian_id,
        role: data.role as UserRole,
        status: data.status,
        preferences: data.preferences || {},
        onboarding_completed: (data as any).onboarding_completed || false,
        created_at: data.created_at,
        updated_at: data.updated_at
      } as UserProfile;
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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setLoading(false);
          setIsInitialized(true);
          return;
        }
        
        if (session?.user) {
          console.log('Found existing session for user:', session.user.id);
          setUser(session.user);
          try {
            const userProfile = await fetchUserProfile(session.user.id);
            setProfile(userProfile);
            console.log('Profile loaded:', userProfile ? 'success' : 'failed');
          } catch (profileError) {
            console.error('Profile fetch error:', profileError);
            // Continue without profile
          }
        } else {
          console.log('No existing session found');
        }
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          setUser(session.user);
          try {
            const userProfile = await fetchUserProfile(session.user.id);
            setProfile(userProfile);
          } catch (profileError) {
            console.error('Profile fetch error in auth state change:', profileError);
            // Continue without profile
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        
        setLoading(false);
        setIsInitialized(true);
      }
    );

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Wait a moment for the trigger to create the user profile
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Try to fetch the user profile
        const userProfile = await fetchUserProfile(data.user.id);
        
        if (userProfile) {
          setUser(data.user);
          setProfile(userProfile);
          toast.success('Account created successfully!', {
            description: `Welcome, ${userProfile.full_name || 'User'}!`
          });
        } else {
          // If profile doesn't exist, create it manually
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('user_profiles')
              .insert({
                id: data.user.id,
                full_name: fullName,
                role: role,
                status: 'active'
              })
              .select()
              .single();

            if (profileError) throw profileError;

            setUser(data.user);
            setProfile({
              ...profileData,
              emergency_phone: null,
              onboarding_completed: false
            } as UserProfile);
            toast.success('Account created successfully!', {
              description: `Welcome, ${fullName}!`
            });
          } catch (profileError: any) {
            console.error('Profile creation error:', profileError);
            toast.error('Account created but profile setup failed', {
              description: 'Please contact support.'
            });
          }
        }
      }
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
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        const userProfile = await fetchUserProfile(data.user.id);
        
        if (userProfile) {
          setUser(data.user);
          setProfile(userProfile);
          toast.success('Login successful!', {
            description: `Welcome back, ${userProfile.full_name || 'User'}!`
          });
        } else {
          // If profile doesn't exist, try to create it from user metadata
          const userMetaData = data.user.user_metadata;
          if (userMetaData?.full_name) {
            try {
              const { data: profileData, error: profileError } = await supabase
                .from('user_profiles')
                .insert({
                  id: data.user.id,
                  full_name: userMetaData.full_name,
                  role: userMetaData.role || 'patient',
                  status: 'active'
                })
                .select()
                .single();

              if (profileError) throw profileError;

              setUser(data.user);
              setProfile({
                ...profileData,
                emergency_phone: null,
                onboarding_completed: (profileData as any)?.onboarding_completed || false
              } as UserProfile);
              toast.success('Login successful!', {
                description: `Welcome back, ${userMetaData.full_name}!`
              });
            } catch (profileError: any) {
              console.error('Profile creation error:', profileError);
              toast.error('Login successful but profile setup failed', {
                description: 'Please contact support.'
              });
            }
          } else {
            setUser(data.user);
            toast.success('Login successful!', {
              description: 'Welcome back!'
            });
          }
        }
      }
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
      
      // Get the current origin and ensure proper callback URL
      const redirectUrl = `${window.location.origin}/auth/callback`;
      console.log('Google OAuth redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Google OAuth initialization error:', error);
        throw error;
      }

      console.log('Google OAuth initiated successfully');
      // The OAuth flow will redirect the user, so we don't need to handle the response here
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
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
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
      
      // Prepare the update data, handling the onboarding_completed field
      const updateData: any = { ...updates };
      
      // If onboarding_completed is being set, ensure it's handled properly
      if (updates.onboarding_completed !== undefined) {
        updateData.onboarding_completed = updates.onboarding_completed;
      }
      
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }

      console.log('Profile updated successfully:', data);

      // Update local state with the returned data, handling missing fields
      const updatedProfile = {
        ...data,
        emergency_phone: (data as any).emergency_phone || null,
        onboarding_completed: (data as any).onboarding_completed || false
      } as UserProfile;
      
      setProfile(updatedProfile);
      toast.success('Profile updated successfully');
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
      const userProfile = await fetchUserProfile(user.id);
      setProfile(userProfile);
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
    
    // Check the onboarding_completed flag
    const flagComplete = profile.onboarding_completed === true;
    
    // Additional validation: check if essential data is present
    const preferences = profile.preferences as any;
    const hasEssentialData = !!(
      profile.full_name &&
      profile.date_of_birth &&
      profile.gender &&
      preferences?.meals?.breakfast_time &&
      preferences?.schedule?.sleep_time &&
      preferences?.health?.blood_group
    );
    
    const isComplete = flagComplete && hasEssentialData;
    
    console.log('isOnboardingComplete comprehensive check:', { 
      profile: !!profile, 
      onboarding_completed: profile?.onboarding_completed, 
      flagComplete,
      hasEssentialData,
      isComplete,
      fullName: profile.full_name,
      dateOfBirth: profile.date_of_birth,
      gender: profile.gender
    });
    
    return isComplete;
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
