import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { clearCorruptedSession, checkSessionValidity, handleSessionError } from '@/utils/sessionUtils';

// User profile interface
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  provider?: string;
  last_sign_in?: string;
  sign_in_count?: number;
  created_at?: string;
  updated_at?: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If profile doesn't exist, try to create it
        if (error.code === 'PGRST116') {
          console.log('Profile not found, attempting to create one...');
          return await createProfile(userId);
        }
        
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  // Create profile if it doesn't exist
  const createProfile = async (userId: string) => {
    try {
      // Get user data from auth.users
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        console.error('Error getting user data:', userError);
        return null;
      }

      const user = userData.user;
      
      // Create profile with user data
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          avatar_url: user.user_metadata?.avatar_url || '',
          provider: user.app_metadata?.provider || 'email',
          last_sign_in: new Date().toISOString(),
          sign_in_count: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error creating profile:', error);
      return null;
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  // Sign out function with cleanup
  const signOut = async () => {
    try {
      console.log('🔍 Signing out user...');
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      
      // Clear any stored auth data
      try {
        localStorage.removeItem('sb-lvnkpserdydhnqbigfbz-auth-token');
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
      } catch (storageError) {
        console.warn('Error clearing storage:', storageError);
      }
      
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      // Force clear state even if signOut fails
      setUser(null);
      setProfile(null);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    // Get initial session with timeout and retry logic
    const getInitialSession = async () => {
      try {
        console.log('🔍 Getting initial session...');
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session fetch timeout')), 8000)
        );
        
        const sessionPromise = supabase.auth.getSession();
        const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) {
            setLoading(false);
          }
          return;
        }
        
        console.log('✅ Session retrieved:', session?.user?.email || 'No user');
        
        if (session?.user && isMounted) {
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);
          if (isMounted) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        // Handle session errors and clear corrupted data
        await handleSessionError(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes with better error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        if (!isMounted) return;
        
        try {
          if (session?.user) {
            setUser(session.user);
            const profileData = await fetchProfile(session.user.id);
            if (isMounted) {
              setProfile(profileData);
            }
          } else {
            setUser(null);
            setProfile(null);
          }
        } catch (error) {
          console.error('Error handling auth state change:', error);
          // Handle session errors
          await handleSessionError(error);
          // Clear state on error
          if (isMounted) {
            setUser(null);
            setProfile(null);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    loading,
    signOut,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
