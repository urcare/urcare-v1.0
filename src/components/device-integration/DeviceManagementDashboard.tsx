
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Monitor, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  Wifi,
  WifiOff,
  Settings
} from 'lucide-react';

export const DeviceManagementDashboard = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Device Management Dashboard
          </CardTitle>
          <CardDescription>
            Centralized overview of all medical device integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-green-50">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-900">231</p>
                  <p className="text-sm text-green-700">Connected Devices</p>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-red-50">
              <div className="flex items-center gap-3">
                <WifiOff className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-900">16</p>
                  <p className="text-sm text-red-700">Offline Devices</p>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-orange-50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-900">8</p>
                  <p className="text-sm text-orange-700">Active Alerts</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
