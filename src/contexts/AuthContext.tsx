
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserProfile, UserRole } from '@/types/auth';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import { fetchUserProfile, handleAuthFromUrl } from '@/utils/authUtils';

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
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  
  const { signIn, signUp, signOut, resetPassword, loading } = useAuthOperations();

  useEffect(() => {
    // Check for auth tokens in URL (for magic link authentication)
    const handleAuthFromUrlEffect = async () => {
      try {
        const session = await handleAuthFromUrl();
        if (session) {
          navigate('/');
          toast.success('Successfully authenticated!');
        }
      } catch (error: any) {
        console.error('Error processing auth token from URL:', error);
        toast.error('Authentication failed', {
          description: error.message
        });
      }
    };
    
    handleAuthFromUrlEffect();
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth event:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Defer fetching profile with setTimeout to avoid potential deadlocks
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id, currentSession.user).then(setProfile);
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
        fetchUserProfile(currentSession.user.id, currentSession.user).then(setProfile);
      }
      setIsInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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
