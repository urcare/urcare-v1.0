
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

// Define types based on our database schema
export type UserRole = 'Patient' | 'Doctor' | 'Nurse' | 'Admin' | 'Pharmacy' | 'Lab' | 'Reception';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

// Update UserProfile to match the data coming from profiles table for now
interface UserProfile {
  id: string;
  full_name: string | null;
  role: UserRole;
  // Add these properties to make it compatible with the ProfileMenu component
  email: string;
  status: UserStatus;
  auth_id?: string;
  phone?: string | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: UserRole, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth event:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Defer fetching profile with setTimeout to avoid potential deadlocks
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
      setIsInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Use the profiles table which is defined in the TypeScript types
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }

      if (data) {
        // Create a compatible user profile object
        const userProfile: UserProfile = {
          id: data.id,
          full_name: data.full_name,
          role: data.role,
          // Since the profiles table doesn't have these fields, 
          // use defaults or get them from the auth user if needed
          email: user?.email || '',
          status: 'active' as UserStatus, // Default status
          auth_id: userId,
          phone: null
        };
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setProfile(null);
    }
  };

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
      
      // Fetch user profile and navigate based on role
      if (data?.user) {
        // Defer user profile fetching to avoid auth state listener conflicts
        setTimeout(async () => {
          const { data: profileData } = await supabase
            .from('profiles')  // Changed from 'users' to 'profiles'
            .select('*')
            .eq('id', data.user.id)  // Changed from 'auth_id' to 'id'
            .single();
            
          if (profileData) {
            const from = location.state?.from?.pathname || '/';
            navigate(from);
            toast.success('Logged in successfully', {
              description: `Welcome back, ${profileData.full_name}!`
            });
          }
        }, 0);
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
      // Instead of passing the role directly as a string, we ensure it's one of the valid enum values
      // This is to prevent type mismatches with the database
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            // Make sure role is a valid string that matches one of the UserRole values
            role: role as string,
            phone: phone || null
          }
        }
      });

      if (error) throw error;

      toast.success('Account created successfully', {
        description: 'Please check your email for verification instructions.'
      });
      
      // Navigate to login page after signup
      navigate('/auth');
    } catch (error: any) {
      toast.error('Registration failed', {
        description: error.message
      });
      console.error('Registration error:', error);
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

  const value = {
    session,
    user,
    profile,
    signIn,
    signUp,
    signOut,
    resetPassword,
    loading,
    isInitialized
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
