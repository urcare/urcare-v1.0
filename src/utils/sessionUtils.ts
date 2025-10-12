// Session token utilities for handling authentication issues
import { supabase } from '@/integrations/supabase/client';

export const clearCorruptedSession = async (): Promise<void> => {
  try {
    console.log('🧹 Clearing corrupted session data...');
    
    // Clear Supabase session
    await supabase.auth.signOut();
    
    // Clear all possible auth storage keys
    const authKeys = [
      'sb-lvnkpserdydhnqbigfbz-auth-token',
      'supabase.auth.token',
      'supabase.auth.refresh_token',
      'sb-lvnkpserdydhnqbigfbz-auth-token-code-verifier',
      'sb-lvnkpserdydhnqbigfbz-auth-token-code-challenge'
    ];
    
    authKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      } catch (error) {
        console.warn(`Failed to remove ${key}:`, error);
      }
    });
    
    // Clear all session storage
    try {
      sessionStorage.clear();
    } catch (error) {
      console.warn('Failed to clear session storage:', error);
    }
    
    console.log('✅ Session data cleared successfully');
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

export const checkSessionValidity = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.warn('Session check failed:', error);
      return false;
    }
    
    if (!session) {
      console.log('No active session found');
      return false;
    }
    
    // Check if session is expired
    const now = Math.floor(Date.now() / 1000);
    if (session.expires_at && session.expires_at < now) {
      console.log('Session expired');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking session validity:', error);
    return false;
  }
};

export const refreshSessionIfNeeded = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.warn('Session refresh failed:', error);
      return false;
    }
    
    if (!session) {
      console.log('No session after refresh');
      return false;
    }
    
    console.log('✅ Session refreshed successfully');
    return true;
  } catch (error) {
    console.error('Error refreshing session:', error);
    return false;
  }
};

export const handleSessionError = async (error: any): Promise<void> => {
  console.error('Session error detected:', error);
  
  // If it's a token-related error, clear the session
  if (error?.message?.includes('token') || 
      error?.message?.includes('session') ||
      error?.message?.includes('expired') ||
      error?.message?.includes('invalid')) {
    
    console.log('🧹 Token/session error detected, clearing session...');
    await clearCorruptedSession();
  }
};
