
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Tablet, 
  Smartphone, 
  Monitor, 
  Wifi, 
  WifiOff,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Battery,
  Signal,
  Zap,
  Globe,
  Cloud,
  HardDrive
} from 'lucide-react';

export const MobileOptimized = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState('synced');

  const deviceStats = {
    connectedDevices: 12,
    activeReadingSessions: 5,
    offlineCapability: 'Enabled',
    lastSync: '2 mins ago',
    dataUsage: '2.4 GB',
    batteryOptimization: 'Active'
  };

  const connectedDevices = [
    {
      id: 'TAB001',
      type: 'Tablet',
      location: 'Reading Room 1',
      status: 'Active',
      battery: 85,
      signal: 'Strong',
      lastActivity: '2 mins ago'
    },
    {
      id: 'TAB002',
      type: 'Tablet',
      location: 'Emergency Dept',
      status: 'Reading',
      battery: 92,
      signal: 'Strong',
      lastActivity: 'Now'
    },
    {
      id: 'PHN001',
      type: 'Phone',
      location: 'On-call Room',
      status: 'Standby',
      battery: 67,
      signal: 'Moderate',
      lastActivity: '15 mins ago'
    }
  ];

  const syncQueue = [
    {
      id: 'IMG001',
      type: 'DICOM Study',
      size: '45 MB',
      progress: 100,
      status: 'Completed'
    },
    {
      id: 'RPT001',
      type: 'Report',
      size: '2 KB',
      progress: 100,
      status: 'Completed'
    },
    {
      id: 'IMG002',
      type: 'DICOM Study',
      size: '78 MB',
      progress: 65,
      status: 'Syncing'
    }
  ];

  const optimizationSettings = [
    {
      setting: 'Image Compression',
      status: 'Enabled',
      description: 'Reduce image size for mobile viewing'
    },
    {
      setting: 'Offline Cache',
      status: 'Enabled',
      description: 'Store recent studies locally'
    },
    {
      setting: 'Auto-sync',
      status: 'Enabled',
      description: 'Sync when connected to WiFi'
    },
    {
      setting: 'Battery Optimization',
      status: 'Enabled',
      description: 'Optimize performance for battery life'
    }
  ];

  const handleSyncData = () => {
    setSyncStatus('syncing');
    setTimeout(() => setSyncStatus('synced'), 3000);
  };

  const handleToggleOffline = () => {
    setIsOnline(!isOnline);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Mobile-Optimized Interface</h3>
          <p className="text-gray-600">Tablet and mobile device management for radiology</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleToggleOffline}
            className={`flex items-center gap-2 ${isOnline ? 'text-green-600' : 'text-red-600'}`}
          >
            {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {isOnline ? 'Online' : 'Offline'}
          </Button>
          <Button onClick={handleSyncData} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync Data
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="sync">Sync Status</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Tablet className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{deviceStats.connectedDevices}</p>
                    <p className="text-sm text-blue-700">Connected Devices</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Monitor className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-900">{deviceStats.activeReadingSessions}</p>
                    <p className="text-sm text-green-700">Active Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Cloud className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-900">{deviceStats.dataUsage}</p>
                    <p className="text-sm text-purple-700">Data Usage</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current mobile system performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className={`h-5 w-5 ${isOnline ? 'text-green-600' : 'text-red-600'}`} />
                      <span className="text-sm text-gray-700">Connection Status</span>
                    </div>
                    <Badge variant="outline" className={`${
                      isOnline ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700'
                    }`}>
                      {isOnline ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <RefreshCw className={`h-5 w-5 ${
                        syncStatus === 'synced' ? 'text-green-600' : 'text-blue-600'
                      }`} />
                      <span className="text-sm text-gray-700">Sync Status</span>
                    </div>
                    <Badge variant="outline" className={`${
                      syncStatus === 'synced' ? 'border-green-500 text-green-700' : 'border-blue-500 text-blue-700'
                    }`}>
                      {syncStatus === 'synced' ? 'Synced' : 'Syncing...'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <HardDrive className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-700">Offline Capability</span>
                    </div>
                    <Badge variant="outline" className="border-blue-500 text-blue-700">
                      {deviceStats.offlineCapability}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Battery className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-gray-700">Battery Optimization</span>
                    </div>
                    <Badge variant="outline" className="border-green-500 text-green-700">
                      {deviceStats.batteryOptimization}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest mobile device interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 border-l-4 border-l-green-500 bg-green-50">
                    <Tablet className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Study completed on TAB002</p>
                      <p className="text-xs text-gray-600">Emergency Department - Dr. Johnson</p>
                    </div>
                    <span className="text-xs text-gray-500">2 mins ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 border-l-4 border-l-blue-500 bg-blue-50">
                    <Download className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Study downloaded to TAB001</p>
                      <p className="text-xs text-gray-600">CT Chest - Reading Room 1</p>
                    </div>
                    <span className="text-xs text-gray-500">5 mins ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 border-l-4 border-l-purple-500 bg-purple-50">
                    <Upload className="h-4 w-4 text-purple-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Report uploaded from PHN001</p>
                      <p className="text-xs text-gray-600">X-Ray Report - Dr. Smith</p>
                    </div>
                    <span className="text-xs text-gray-500">8 mins ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Devices</CardTitle>
              <CardDescription>Manage mobile devices and tablet access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connectedDevices.map((device, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {device.type === 'Tablet' ? 
                        <Tablet className="h-6 w-6 text-blue-600" /> : 
                        <Smartphone className="h-6 w-6 text-green-600" />
                      }
                      <div>
                        <h5 className="font-medium text-gray-900">{device.id}</h5>
                        <p className="text-sm text-gray-600">{device.location}</p>
                        <p className="text-xs text-gray-500">Last activity: {device.lastActivity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Battery className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{device.battery}%</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Signal className="h-4 w-4 text-gray-500" />
                          <span className="text-xs text-gray-600">{device.signal}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={`${
                        device.status === 'Active' ? 'border-green-500 text-green-700' :
                        device.status === 'Reading' ? 'border-blue-500 text-blue-700' :
                        'border-gray-500 text-gray-700'
                      }`}>
                        {device.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Synchronization Status</CardTitle>
              <CardDescription>Monitor data sync across mobile devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syncQueue.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {item.status === 'Completed' ? 
                        <Download className="h-5 w-5 text-green-600" /> : 
                        <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                      }
                      <div>
                        <h5 className="font-medium text-gray-900">{item.id}</h5>
                        <p className="text-sm text-gray-600">{item.type}</p>
                        <p className="text-xs text-gray-500">{item.size}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={`${
                        item.status === 'Completed' ? 'border-green-500 text-green-700' : 'border-blue-500 text-blue-700'
                      }`}>
                        {item.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{item.progress}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Optimization Settings</CardTitle>
              <CardDescription>Configure mobile device performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizationSettings.map((setting, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h5 className="font-medium text-gray-900">{setting.setting}</h5>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`${
                        setting.status === 'Enabled' ? 'border-green-500 text-green-700' : 'border-gray-500 text-gray-700'
                      }`}>
                        {setting.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
