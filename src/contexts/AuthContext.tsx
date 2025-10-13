import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
      // Try unified_user_profiles first (newest table)
      let { data, error } = await supabase
        .from('unified_user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.log('unified_user_profiles not found, trying user_profiles...');
        // Fallback to user_profiles
        const result = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        data = result.data;
        error = result.error;
      }

      if (error) {
        console.log('user_profiles not found, trying profiles...');
        // Fallback to profiles
        const result = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        data = result.data;
        error = result.error;
      }

      if (error) {
        console.log('No profile found in any table, creating basic profile...');
        // Create a basic profile if none exists
        return {
          id: userId,
          email: '',
          full_name: '',
          avatar_url: '',
          provider: 'email',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as UserProfile;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Return basic profile on error
      return {
        id: userId,
        email: '',
        full_name: '',
        avatar_url: '',
        provider: 'email',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as UserProfile;
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('⏰ Auth loading timeout - forcing loading to false');
      setLoading(false);
    }, 10000); // 10 second timeout

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
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
