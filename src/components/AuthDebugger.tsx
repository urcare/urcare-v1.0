import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AuthDebugger: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          🔧 Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-h-96 overflow-y-auto">
      <Card className="bg-white shadow-lg border-2 border-blue-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-blue-800">Auth Debug</CardTitle>
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
              <span className="text-xs font-medium">Status:</span>
              <Badge variant={user ? 'default' : 'destructive'}>
                {loading ? 'Loading...' : user ? 'Authenticated' : 'Not authenticated'}
              </Badge>
            </div>

            {user && (
              <div className="text-xs space-y-1">
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>ID:</strong> {user.id}</div>
                <div><strong>Provider:</strong> {user.app_metadata?.provider || 'email'}</div>
              </div>
            )}

            {profile && (
              <div className="text-xs space-y-1">
                <div><strong>Name:</strong> {profile.full_name}</div>
                <div><strong>Profile ID:</strong> {profile.id}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthDebugger;
