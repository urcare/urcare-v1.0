import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const TestAuth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  const testSession = async () => {
    setLoading(true);
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('Current session:', session);
      console.log('Session error:', error);
      setSessionInfo({ session, error });
    } catch (error) {
      console.error('Test session error:', error);
      setSessionInfo({ error });
    } finally {
      setLoading(false);
    }
  };

  const testGoogleSignIn = async () => {
    setLoading(true);
    try {
      console.log('Testing Google sign-in...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      console.log('Google OAuth result:', { data, error });
      
      if (error) {
        toast.error('Google sign-in failed', { description: error.message });
      } else if (data?.url) {
        toast.success('Redirecting to Google OAuth...');
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Test Google sign-in error:', error);
      toast.error('Test failed', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const clearSession = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      toast.success('Session cleared');
      setSessionInfo(null);
    } catch (error: any) {
      console.error('Clear session error:', error);
      toast.error('Failed to clear session', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Auth Test Page</h1>
        
        <div className="space-y-4">
          <button
            onClick={testSession}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Current Session'}
          </button>
          
          <button
            onClick={testGoogleSignIn}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Google Sign-In'}
          </button>
          
          <button
            onClick={clearSession}
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Clearing...' : 'Clear Session'}
          </button>
        </div>
        
        {sessionInfo && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Session Info:</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(sessionInfo, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-600">
          <p><strong>Current URL:</strong> {window.location.href}</p>
          <p><strong>Origin:</strong> {window.location.origin}</p>
          <p><strong>Hostname:</strong> {window.location.hostname}</p>
        </div>
      </div>
    </div>
  );
}; 