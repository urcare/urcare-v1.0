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
    // Check for auth tokens in URL (for magic link authentication)
    const handleAuthFromUrl = async () => {
      const hasHashParams = window.location.hash && window.location.hash.length > 0;
      
      if (hasHashParams) {
        try {
          setLoading(true);
          const { data, error } = await supabase.auth.getSessionFromUrl();
          if (error) throw error;
          
          // Clean the URL by removing hash params
          window.history.replaceState({}, document.title, window.location.pathname);
          
          if (data?.session) {
            // Redirect to home after successful authentication
            navigate('/');
            toast.success('Successfully authenticated!');
          }
        } catch (error: any) {
          console.error('Error processing auth token from URL:', error);
          toast.error('Authentication failed', {
            description: error.message
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    handleAuthFromUrl();
    
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
  }, [navigate]);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Use the profiles table which is defined in the TypeScript types
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to handle when no record exists

      if (error) {
        console.error('Error fetching user profile:', error);
        // Don't throw, just log the error
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
          phone: data.phone || null
        };
        setProfile(userProfile);
      } else if (user) {
        // If no profile is found, create a default one
        const defaultProfile: UserProfile = {
          id: userId,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || null,
          role: 'Patient' as UserRole,  // Default role
          email: user.email || '',
          status: 'active' as UserStatus,
          auth_id: userId
        };
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Create a default profile even on error so the app doesn't break
      if (user) {
        const defaultProfile: UserProfile = {
          id: userId,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || null,
          role: 'Patient' as UserRole,
          email: user.email || '',
          status: 'active' as UserStatus,
          auth_id: userId
        };
        setProfile(defaultProfile);
      }
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
      
      // Navigate immediately after successful login
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
      
      // Pass the role as a plain string without type conversion
      // This avoids the "user_role does not exist" error
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
      
      // Navigate to login page after signup
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
