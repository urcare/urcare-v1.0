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
      console.log('🔍 Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        
        // If profile doesn't exist, try to create it
        if (error.code === 'PGRST116') {
          console.log('📝 Profile not found, attempting to create one...');
          return await createProfile(userId);
        }
        
        return null;
      }

      console.log('✅ Profile fetched successfully:', data);
      return data as UserProfile;
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      return null;
    }
  };

  // Create profile if it doesn't exist
  const createProfile = async (userId: string) => {
    try {
      console.log('🔍 Getting user data for profile creation...');
      // Get user data from auth.users
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        console.error('❌ Error getting user data:', userError);
        return null;
      }

      const user = userData.user;
      console.log('👤 User data for profile:', {
        email: user.email,
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url
      });
      
      // Create profile with user data
      const profileData = {
        id: userId,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        avatar_url: user.user_metadata?.avatar_url || '',
        provider: user.app_metadata?.provider || 'email',
        last_sign_in: new Date().toISOString(),
        sign_in_count: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('📝 Creating profile with data:', profileData);
      
      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating profile:', error);
        return null;
      }

      console.log('✅ Profile created successfully:', data);
      return data as UserProfile;
    } catch (error) {
      console.error('❌ Error creating profile:', error);
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
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔍 Getting initial session...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('📊 Initial session result:', session?.user?.email || 'No user');
        
        if (mounted) {
          if (session?.user) {
            console.log('✅ User found in initial session');
            setUser(session.user);
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
          }
          console.log('🔄 Setting loading to false from initial session');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          console.log('🔄 Setting loading to false after error');
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email);
        
        if (!mounted) return;
        
        if (session?.user) {
          console.log('✅ User authenticated via auth state change');
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);
          console.log('👤 Profile data result:', profileData);
          setProfile(profileData);
        } else {
          console.log('❌ No user in auth state change');
          setUser(null);
          setProfile(null);
        }
        
        console.log('🔄 Setting loading to false');
        setLoading(false);
        
        // Force a re-render to ensure state updates
        setTimeout(() => {
          if (mounted) {
            console.log('🔄 Force setting loading to false');
            setLoading(false);
          }
        }, 100);
      }
    );

    return () => {
      mounted = false;
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
