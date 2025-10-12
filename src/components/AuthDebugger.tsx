import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AuthDebugInfo {
  user: any;
  profile: any;
  session: any;
  authState: string;
  profileExists: boolean;
  profileError: string | null;
  lastSignIn: string | null;
  signInCount: number | null;
}

const AuthDebugger: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [debugInfo, setDebugInfo] = useState<AuthDebugInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const fetchDebugInfo = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      let profileData = null;
      let profileError = null;
      let profileExists = false;

      if (user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          profileError = error.message;
        } else {
          profileData = data;
          profileExists = true;
        }
      }

      setDebugInfo({
        user,
        profile: profileData,
        session,
        authState: sessionError ? 'error' : session ? 'authenticated' : 'unauthenticated',
        profileExists,
        profileError,
        lastSignIn: profileData?.last_sign_in || null,
        signInCount: profileData?.sign_in_count || null
      });
    } catch (error) {
      console.error('Error fetching debug info:', error);
    }
  };

  useEffect(() => {
    fetchDebugInfo();
  }, [user, profile]);

  const createProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          avatar_url: user.user_metadata?.avatar_url || '',
          provider: user.app_metadata?.provider || 'email',
          last_sign_in: new Date().toISOString(),
          sign_in_count: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('Error creating profile:', error);
      } else {
        console.log('Profile created successfully:', data);
        fetchDebugInfo();
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const refreshProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error refreshing profile:', error);
      } else {
        console.log('Profile refreshed:', data);
        fetchDebugInfo();
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          🔧 Auth Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 overflow-y-auto">
      <Card className="bg-white shadow-lg border-2 border-blue-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-blue-800">Auth Debugger</CardTitle>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">Auth State:</span>
              <Badge variant={debugInfo?.authState === 'authenticated' ? 'default' : 'destructive'}>
                {debugInfo?.authState || 'loading...'}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">Profile:</span>
              <Badge variant={debugInfo?.profileExists ? 'default' : 'destructive'}>
                {debugInfo?.profileExists ? 'Exists' : 'Missing'}
              </Badge>
            </div>

            {debugInfo?.profileError && (
              <Alert variant="destructive">
                <AlertDescription className="text-xs">
                  Profile Error: {debugInfo.profileError}
                </AlertDescription>
              </Alert>
            )}

            {user && (
              <div className="text-xs space-y-1">
                <div><strong>User ID:</strong> {user.id}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Provider:</strong> {user.app_metadata?.provider || 'email'}</div>
                <div><strong>Name:</strong> {user.user_metadata?.full_name || user.user_metadata?.name || 'N/A'}</div>
              </div>
            )}

            {debugInfo?.profile && (
              <div className="text-xs space-y-1">
                <div><strong>Last Sign In:</strong> {debugInfo.lastSignIn || 'N/A'}</div>
                <div><strong>Sign In Count:</strong> {debugInfo.signInCount || 'N/A'}</div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={createProfile}
                size="sm"
                variant="outline"
                className="text-xs"
                disabled={!user || debugInfo?.profileExists}
              >
                Create Profile
              </Button>
              <Button
                onClick={refreshProfile}
                size="sm"
                variant="outline"
                className="text-xs"
                disabled={!user}
              >
                Refresh
              </Button>
              <Button
                onClick={fetchDebugInfo}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                Reload
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthDebugger;
