
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Users, MapPin, Radio } from 'lucide-react';

export const DisasterResponseInterface = () => {
  const [disasterMode, setDisasterMode] = useState(false);
  
  return (
    <div className="space-y-6">
      {!disasterMode ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Disaster Response Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">Emergency department is operating in normal mode.</p>
              <Button 
                onClick={() => setDisasterMode(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                Activate Disaster Response Mode
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>DISASTER RESPONSE MODE ACTIVE</AlertTitle>
          <AlertDescription>
            Mass casualty protocols are now in effect. All non-essential activities have been suspended.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
