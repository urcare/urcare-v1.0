
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Computer, 
  Lock,
  Timer,
  Shield,
  Settings,
  AlertTriangle,
  Users,
  Eye
} from 'lucide-react';

interface KioskSettings {
  timeoutEnabled: boolean;
  timeoutDuration: number; // minutes
  maintenanceMode: boolean;
  navigationLocked: boolean;
  fullScreenForced: boolean;
  idleTimeout: number; // minutes
}

export const KioskModeInterface = () => {
  const [isKioskActive, setIsKioskActive] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(300); // seconds
  const [timeRemaining, setTimeRemaining] = useState(300);
  
  const [kioskSettings, setKioskSettings] = useState<KioskSettings>({
    timeoutEnabled: true,
    timeoutDuration: 5,
    maintenanceMode: false,
    navigationLocked: true,
    fullScreenForced: true,
    idleTimeout: 2
  });

  const [kioskStats] = useState({
    activeSessions: 24,
    totalKiosks: 32,
    averageSessionTime: '4m 32s',
    maintenanceAlerts: 2,
    securityEvents: 0,
    uptime: 99.7
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isKioskActive && kioskSettings.timeoutEnabled) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsKioskActive(false);
            return kioskSettings.timeoutDuration * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isKioskActive, kioskSettings.timeoutEnabled, kioskSettings.timeoutDuration]);

  const toggleKiosk = () => {
    setIsKioskActive(!isKioskActive);
    setTimeRemaining(kioskSettings.timeoutDuration * 60);
  };

  const updateSetting = <K extends keyof KioskSettings>(
    key: K, 
    value: KioskSettings[K]
  ) => {
    setKioskSettings(prev => ({ ...prev, [key]: value }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetSession = () => {
    setTimeRemaining(kioskSettings.timeoutDuration * 60);
  };

  return (
    <div className="space-y-6">
      {/* Kiosk Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Computer className="h-5 w-5" />
            Kiosk Mode Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Kiosk Mode</div>
              <div className="text-sm text-gray-600">
                {isKioskActive ? 'Active - Locked Navigation' : 'Inactive - Full Access'}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isKioskActive && (
                <Badge className="bg-green-100 text-green-800">
                  <Lock className="h-3 w-3 mr-1" />
                  Secured
                </Badge>
              )}
              <Switch
                checked={isKioskActive}
                onCheckedChange={toggleKiosk}
              />
            </div>
          </div>

          {isKioskActive && kioskSettings.timeoutEnabled && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Session Time Remaining</span>
                <span className="text-sm font-mono">{formatTime(timeRemaining)}</span>
              </div>
              <Progress 
                value={(timeRemaining / (kioskSettings.timeoutDuration * 60)) * 100} 
                className="h-2"
              />
              <Button 
                size="sm" 
                variant="outline" 
                onClick={resetSession}
                className="w-full"
              >
                <Timer className="h-4 w-4 mr-2" />
                Extend Session
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Kiosk Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Kiosk Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Session Timeout</div>
                <div className="text-sm text-gray-600">Auto-logout after inactivity</div>
              </div>
              <Switch
                checked={kioskSettings.timeoutEnabled}
                onCheckedChange={(checked) => updateSetting('timeoutEnabled', checked)}
              />
            </div>

            {kioskSettings.timeoutEnabled && (
              <div className="ml-4 space-y-2">
                <label className="text-sm font-medium">Timeout Duration (minutes)</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={kioskSettings.timeoutDuration}
                  onChange={(e) => updateSetting('timeoutDuration', parseInt(e.target.value))}
                >
                  <option value={1}>1 minute</option>
                  <option value={2}>2 minutes</option>
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                </select>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Navigation Lock</div>
                <div className="text-sm text-gray-600">Prevent navigation outside app</div>
              </div>
              <Switch
                checked={kioskSettings.navigationLocked}
                onCheckedChange={(checked) => updateSetting('navigationLocked', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Full Screen Mode</div>
                <div className="text-sm text-gray-600">Hide browser UI elements</div>
              </div>
              <Switch
                checked={kioskSettings.fullScreenForced}
                onCheckedChange={(checked) => updateSetting('fullScreenForced', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Maintenance Mode</div>
                <div className="text-sm text-gray-600">Admin access for updates</div>
              </div>
              <div className="flex items-center gap-2">
                {kioskSettings.maintenanceMode && (
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                )}
                <Switch
                  checked={kioskSettings.maintenanceMode}
                  onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kiosk Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Kiosk Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{kioskStats.activeSessions}</div>
              <div className="text-sm text-gray-600">Active Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{kioskStats.totalKiosks}</div>
              <div className="text-sm text-gray-600">Total Kiosks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{kioskStats.averageSessionTime}</div>
              <div className="text-sm text-gray-600">Avg Session Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{kioskStats.maintenanceAlerts}</div>
              <div className="text-sm text-gray-600">Maintenance Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{kioskStats.securityEvents}</div>
              <div className="text-sm text-gray-600">Security Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{kioskStats.uptime}%</div>
              <div className="text-sm text-gray-600">System Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Access Control</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Admin PIN Required</span>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Session Recording</span>
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>URL Restrictions</span>
                  <Badge className="bg-green-100 text-green-800">Enforced</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Monitoring</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>User Activity Logs</span>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Idle Detection</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Remote Monitoring</span>
                  <Badge className="bg-blue-100 text-blue-800">Connected</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Emergency Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">Emergency Override</span>
              </div>
              <p className="text-sm text-red-700 mb-3">
                Use this for emergency access when normal authentication fails
              </p>
              <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                Request Emergency Access
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Emergency access requires supervisor authorization</p>
              <p>• All emergency access attempts are logged and audited</p>
              <p>• Contact IT support for assistance with kiosk issues</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
