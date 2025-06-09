
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Watch, 
  Heart,
  Activity,
  Bell,
  Shield,
  Battery,
  Bluetooth,
  Zap
} from 'lucide-react';

interface WearableDevice {
  id: string;
  name: string;
  type: 'smartwatch' | 'fitness-tracker' | 'medical-device';
  batteryLevel: number;
  isConnected: boolean;
  lastSync: Date;
  healthMetrics: {
    heartRate: number;
    steps: number;
    calories: number;
    sleep: number;
  };
}

interface QuickAction {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  enabled: boolean;
  category: 'emergency' | 'health' | 'communication' | 'navigation';
}

export const SmartwatchCompanion = () => {
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [emergencyMode, setEmergencyMode] = useState(false);
  
  const [connectedDevices, setConnectedDevices] = useState<WearableDevice[]>([
    {
      id: 'watch1',
      name: 'Apple Watch Series 9',
      type: 'smartwatch',
      batteryLevel: 78,
      isConnected: true,
      lastSync: new Date(Date.now() - 300000),
      healthMetrics: {
        heartRate: 72,
        steps: 8542,
        calories: 1847,
        sleep: 7.5
      }
    },
    {
      id: 'tracker1',
      name: 'Fitbit Sense 2',
      type: 'fitness-tracker',
      batteryLevel: 45,
      isConnected: true,
      lastSync: new Date(Date.now() - 600000),
      healthMetrics: {
        heartRate: 68,
        steps: 9234,
        calories: 2103,
        sleep: 6.8
      }
    },
    {
      id: 'medical1',
      name: 'Medical Alert Device',
      type: 'medical-device',
      batteryLevel: 92,
      isConnected: true,
      lastSync: new Date(Date.now() - 120000),
      healthMetrics: {
        heartRate: 75,
        steps: 0,
        calories: 0,
        sleep: 0
      }
    }
  ]);

  const [quickActions, setQuickActions] = useState<QuickAction[]>([
    {
      id: 'emergency-call',
      title: 'Emergency Call',
      icon: Shield,
      enabled: true,
      category: 'emergency'
    },
    {
      id: 'nurse-call',
      title: 'Nurse Call',
      icon: Bell,
      enabled: true,
      category: 'emergency'
    },
    {
      id: 'heart-rate',
      title: 'Heart Rate Check',
      icon: Heart,
      enabled: true,
      category: 'health'
    },
    {
      id: 'medication-reminder',
      title: 'Medication Alert',
      icon: Bell,
      enabled: true,
      category: 'health'
    },
    {
      id: 'activity-log',
      title: 'Log Activity',
      icon: Activity,
      enabled: false,
      category: 'health'
    }
  ]);

  const toggleQuickAction = (actionId: string) => {
    setQuickActions(prev => 
      prev.map(action => 
        action.id === actionId 
          ? { ...action, enabled: !action.enabled }
          : action
      )
    );
  };

  const syncDevice = async (deviceId: string) => {
    setConnectedDevices(prev => 
      prev.map(device => 
        device.id === deviceId 
          ? { ...device, lastSync: new Date() }
          : device
      )
    );
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smartwatch': return '⌚';
      case 'fitness-tracker': return '📱';
      case 'medical-device': return '🏥';
      default: return '📱';
    }
  };

  const formatTime = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <div className="space-y-6">
      {/* Connected Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Watch className="h-5 w-5" />
            Connected Wearables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connectedDevices.map((device) => (
              <div key={device.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getDeviceIcon(device.type)}</span>
                    <div>
                      <div className="font-medium">{device.name}</div>
                      <div className="text-sm text-gray-600 capitalize">{device.type.replace('-', ' ')}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {device.isConnected ? (
                      <Badge className="bg-green-100 text-green-800">
                        <Bluetooth className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Disconnected</Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Battery</span>
                      <span className={`font-medium ${getBatteryColor(device.batteryLevel)}`}>
                        {device.batteryLevel}%
                      </span>
                    </div>
                    <Progress value={device.batteryLevel} className="h-2" />
                  </div>
                  
                  <div className="text-sm">
                    <div className="text-gray-600">Last Sync</div>
                    <div className="font-medium">{formatTime(device.lastSync)}</div>
                  </div>
                </div>

                {device.type !== 'medical-device' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-red-600">{device.healthMetrics.heartRate}</div>
                      <div className="text-gray-600">BPM</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-blue-600">{device.healthMetrics.steps.toLocaleString()}</div>
                      <div className="text-gray-600">Steps</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-orange-600">{device.healthMetrics.calories}</div>
                      <div className="text-gray-600">Calories</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-purple-600">{device.healthMetrics.sleep}h</div>
                      <div className="text-gray-600">Sleep</div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => syncDevice(device.id)}
                    className="flex-1"
                  >
                    <Bluetooth className="h-4 w-4 mr-2" />
                    Sync
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedDevice(device.id)}
                  >
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <div key={action.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">{action.title}</div>
                      <div className="text-sm text-gray-600 capitalize">{action.category}</div>
                    </div>
                  </div>
                  
                  <Switch
                    checked={action.enabled}
                    onCheckedChange={() => toggleQuickAction(action.id)}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Emergency Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Emergency Mode</div>
              <div className="text-sm text-gray-600">Enhanced emergency response features</div>
            </div>
            <Switch
              checked={emergencyMode}
              onCheckedChange={setEmergencyMode}
            />
          </div>

          {emergencyMode && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">Emergency Mode Active</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="font-medium text-red-700">Enabled Features:</div>
                  <ul className="mt-1 space-y-1 text-red-600">
                    <li>• Automatic location sharing</li>
                    <li>• Heart rate monitoring</li>
                    <li>• Fall detection</li>
                    <li>• Emergency contacts alert</li>
                  </ul>
                </div>
                <div>
                  <div className="font-medium text-red-700">Response Time:</div>
                  <div className="text-lg font-bold text-red-600 mt-1">&lt; 30 seconds</div>
                  <div className="text-red-600">Average emergency response</div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium">Emergency Contacts</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span>Primary Emergency</span>
                <span className="font-medium">911</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Nurse Station</span>
                <span className="font-medium">(555) 123-4567</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Family Contact</span>
                <span className="font-medium">(555) 987-6543</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Health Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Continuous Monitoring</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Heart Rate</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Activity Tracking</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sleep Monitoring</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Fall Detection</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Alert Thresholds</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Heart Rate Max</span>
                  <span className="font-medium">150 BPM</span>
                </div>
                <div className="flex justify-between">
                  <span>Heart Rate Min</span>
                  <span className="font-medium">50 BPM</span>
                </div>
                <div className="flex justify-between">
                  <span>Inactivity Alert</span>
                  <span className="font-medium">2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Battery Warning</span>
                  <span className="font-medium">20%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
