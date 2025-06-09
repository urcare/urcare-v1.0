
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Watch, 
  Heart, 
  Activity, 
  Thermometer,
  Moon,
  Footprints,
  Battery,
  Wifi,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

interface WearableDevice {
  id: string;
  name: string;
  type: 'smartwatch' | 'fitness_tracker' | 'medical_device';
  brand: string;
  model: string;
  batteryLevel: number;
  connectionStatus: 'connected' | 'disconnected' | 'syncing';
  lastSync: Date;
  isActive: boolean;
}

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  icon: React.ComponentType<any>;
  trend: 'up' | 'down' | 'stable';
  normal: boolean;
  timestamp: Date;
}

interface ActivityData {
  steps: number;
  distance: number;
  calories: number;
  activeMinutes: number;
  sleepHours: number;
  heartRateAvg: number;
}

export const WearableIntegration = () => {
  const [devices, setDevices] = useState<WearableDevice[]>([
    {
      id: '1',
      name: 'Apple Watch Series 9',
      type: 'smartwatch',
      brand: 'Apple',
      model: 'Series 9',
      batteryLevel: 78,
      connectionStatus: 'connected',
      lastSync: new Date(Date.now() - 300000),
      isActive: true
    },
    {
      id: '2',
      name: 'Fitbit Charge 5',
      type: 'fitness_tracker',
      brand: 'Fitbit',
      model: 'Charge 5',
      batteryLevel: 45,
      connectionStatus: 'connected',
      lastSync: new Date(Date.now() - 600000),
      isActive: true
    },
    {
      id: '3',
      name: 'Continuous Glucose Monitor',
      type: 'medical_device',
      brand: 'Dexcom',
      model: 'G7',
      batteryLevel: 92,
      connectionStatus: 'syncing',
      lastSync: new Date(Date.now() - 120000),
      isActive: true
    }
  ]);

  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
    {
      id: '1',
      name: 'Heart Rate',
      value: 72,
      unit: 'bpm',
      icon: Heart,
      trend: 'stable',
      normal: true,
      timestamp: new Date()
    },
    {
      id: '2',
      name: 'Body Temperature',
      value: 98.6,
      unit: '°F',
      icon: Thermometer,
      trend: 'stable',
      normal: true,
      timestamp: new Date()
    },
    {
      id: '3',
      name: 'Blood Oxygen',
      value: 97,
      unit: '%',
      icon: Activity,
      trend: 'up',
      normal: true,
      timestamp: new Date()
    }
  ]);

  const [activityData, setActivityData] = useState<ActivityData>({
    steps: 8547,
    distance: 4.2,
    calories: 1847,
    activeMinutes: 67,
    sleepHours: 7.5,
    heartRateAvg: 74
  });

  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Simulate real-time health data updates
    const interval = setInterval(() => {
      setHealthMetrics(prev => 
        prev.map(metric => ({
          ...metric,
          value: metric.value + (Math.random() - 0.5) * 2,
          timestamp: new Date()
        }))
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const toggleDevice = (deviceId: string) => {
    setDevices(prev => 
      prev.map(device => 
        device.id === deviceId 
          ? { ...device, isActive: !device.isActive }
          : device
      )
    );
  };

  const syncDevice = async (deviceId: string) => {
    setDevices(prev => 
      prev.map(device => 
        device.id === deviceId 
          ? { ...device, connectionStatus: 'syncing' }
          : device
      )
    );

    // Simulate sync process
    setTimeout(() => {
      setDevices(prev => 
        prev.map(device => 
          device.id === deviceId 
            ? { 
                ...device, 
                connectionStatus: 'connected',
                lastSync: new Date()
              }
            : device
        )
      );
    }, 2000);
  };

  const scanForDevices = async () => {
    setIsScanning(true);
    
    // Simulate device scanning
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-red-100 text-red-800';
      case 'syncing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Connected Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Watch className="h-5 w-5" />
              Connected Devices
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={scanForDevices}
              disabled={isScanning}
            >
              <Wifi className="h-4 w-4 mr-2" />
              {isScanning ? 'Scanning...' : 'Scan'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {devices.map((device) => (
              <div key={device.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={device.isActive}
                      onCheckedChange={() => toggleDevice(device.id)}
                    />
                    <div>
                      <span className="font-medium">{device.name}</span>
                      <div className="text-sm text-gray-600">{device.brand} {device.model}</div>
                    </div>
                  </div>
                  <Badge className={getConnectionStatusColor(device.connectionStatus)}>
                    {device.connectionStatus}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Battery className="h-4 w-4" />
                    <span>{device.batteryLevel}%</span>
                  </div>
                  <div className="text-gray-600">
                    Last sync: {device.lastSync.toLocaleTimeString()}
                  </div>
                  <div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => syncDevice(device.id)}
                      disabled={device.connectionStatus === 'syncing'}
                    >
                      {device.connectionStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
                    </Button>
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Battery Level</span>
                    <span>{device.batteryLevel}%</span>
                  </div>
                  <Progress value={device.batteryLevel} className="h-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-Time Health Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Real-Time Health Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {healthMetrics.map((metric) => {
              const IconComponent = metric.icon;
              return (
                <div key={metric.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`h-4 w-4 ${metric.normal ? 'text-green-600' : 'text-red-600'}`} />
                      <span className="text-sm font-medium">{metric.name}</span>
                    </div>
                    <span className="text-lg">{getTrendIcon(metric.trend)}</span>
                  </div>
                  
                  <div className="text-2xl font-bold mb-1">
                    {metric.value.toFixed(1)} <span className="text-sm text-gray-600">{metric.unit}</span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Updated: {metric.timestamp.toLocaleTimeString()}
                  </div>
                  
                  {!metric.normal && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      <span>Outside normal range</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Daily Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Footprints className="h-5 w-5" />
            Daily Activity Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{activityData.steps.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Steps</div>
              <div className="text-xs text-gray-500">Goal: 10,000</div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{activityData.distance}</div>
              <div className="text-sm text-gray-600">Miles</div>
              <div className="text-xs text-gray-500">Goal: 5.0</div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{activityData.calories}</div>
              <div className="text-sm text-gray-600">Calories</div>
              <div className="text-xs text-gray-500">Goal: 2,000</div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{activityData.activeMinutes}</div>
              <div className="text-sm text-gray-600">Active Minutes</div>
              <div className="text-xs text-gray-500">Goal: 150</div>
            </div>
            
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{activityData.sleepHours}</div>
              <div className="text-sm text-gray-600">Sleep Hours</div>
              <div className="text-xs text-gray-500">Goal: 8.0</div>
            </div>
            
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{activityData.heartRateAvg}</div>
              <div className="text-sm text-gray-600">Avg Heart Rate</div>
              <div className="text-xs text-gray-500">Resting: 60-100</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Correlation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Clinical Correlation & Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="font-medium text-blue-800 mb-1">Sleep Quality Analysis</div>
              <div className="text-sm text-blue-700">
                Sleep efficiency: 87% (Good). REM sleep: 22% of total. 
                Recommend maintaining current sleep schedule.
              </div>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="font-medium text-green-800 mb-1">Cardiovascular Health</div>
              <div className="text-sm text-green-700">
                Resting heart rate trending downward (good). Heart rate variability: Normal. 
                VO2 max estimated at 42 ml/kg/min (Above Average).
              </div>
            </div>
            
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="font-medium text-yellow-800 mb-1">Activity Recommendations</div>
              <div className="text-sm text-yellow-700">
                Consider increasing daily step goal to 12,000. Add 2 strength training sessions per week. 
                Monitor blood pressure during intense activities.
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 border rounded-lg">
            <div className="font-medium mb-2">Integration with Clinical Systems</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span>EHR Integration</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Care Team Alerts</span>
                <Badge className="bg-green-100 text-green-800">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Medication Adherence</span>
                <Badge className="bg-blue-100 text-blue-800">Monitoring</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Risk Assessment</span>
                <Badge className="bg-purple-100 text-purple-800">AI-Powered</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
