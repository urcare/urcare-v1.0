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
  health_id: string | null;
  guardian_id: string | null;
  role: UserRole;
  status: string;
  preferences: any;
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

      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          const userProfile = await fetchUserProfile(session.user.id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          setUser(session.user);
          const userProfile = await fetchUserProfile(session.user.id);
          setProfile(userProfile);
        } else {
          setUser(null);
          setProfile(null);
        }
        
        setLoading(false);
        setIsInitialized(true);
      }
    );

    return () => subscription.unsubscribe();
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
            setProfile(profileData as UserProfile);
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
              setProfile(profileData as UserProfile);
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
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;

      // The OAuth flow will redirect the user, so we don't need to handle the response here
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast.error('Google sign-in failed', {
        description: error.message
      });
      throw error;
    } finally {
      setLoading(false);
    }
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

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error('No user logged in');

      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data as UserProfile);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error('Profile update failed', {
        description: error.message
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
    signInWithGoogle
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
