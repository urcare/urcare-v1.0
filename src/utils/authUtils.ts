
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole, UserStatus } from '@/types/auth';

export const createDefaultProfile = (userId: string, user: User): UserProfile => {
  return {
    id: userId,
    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || null,
    role: 'Patient' as UserRole,
    email: user.email || '',
    status: 'active' as UserStatus,
    auth_id: userId
  };
};

export const fetchUserProfile = async (userId: string, user?: User): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error);
    }

    if (data) {
      const userProfile: UserProfile = {
        id: data.id,
        full_name: data.full_name,
        role: data.role,
        email: user?.email || '',
        status: 'active' as UserStatus,
        auth_id: userId
        // Removed phone property since it doesn't exist in the database table
      };
      return userProfile;
    } else if (user) {
      return createDefaultProfile(userId, user);
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    if (user) {
      return createDefaultProfile(userId, user);
    }
    return null;
  }
};

export const handleAuthFromUrl = async () => {
  const hasHashParams = window.location.hash && window.location.hash.length > 0;
  
  if (hasHashParams) {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      // Clean the URL by removing hash params
      window.history.replaceState({}, document.title, window.location.pathname);
      
      return data?.session;
    } catch (error: any) {
      console.error('Error processing auth token from URL:', error);
      throw error;
    }
  }
  
  return null;
};
