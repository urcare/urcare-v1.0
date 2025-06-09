
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Smartphone, 
  Download, 
  Settings,
  Battery,
  Wifi,
  Bell,
  Camera,
  Fingerprint,
  MapPin
} from 'lucide-react';

interface NativeFeature {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  enabled: boolean;
  status: 'available' | 'configured' | 'unavailable';
  description: string;
}

export const MobileAppWrapper = () => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  
  const [nativeFeatures, setNativeFeatures] = useState<NativeFeature[]>([
    {
      id: 'push',
      name: 'Push Notifications',
      icon: Bell,
      enabled: true,
      status: 'configured',
      description: 'Send targeted notifications to users'
    },
    {
      id: 'camera',
      name: 'Camera Access',
      icon: Camera,
      enabled: true,
      status: 'configured',
      description: 'Document scanning and photo capture'
    },
    {
      id: 'biometric',
      name: 'Biometric Auth',
      icon: Fingerprint,
      enabled: true,
      status: 'configured',
      description: 'Fingerprint and face recognition'
    },
    {
      id: 'location',
      name: 'Location Services',
      icon: MapPin,
      enabled: false,
      status: 'available',
      description: 'GPS location for emergency services'
    },
    {
      id: 'offline',
      name: 'Offline Storage',
      icon: Download,
      enabled: true,
      status: 'configured',
      description: 'Local data storage and sync'
    }
  ]);

  const [buildConfig] = useState({
    platform: 'both', // ios, android, both
    buildType: 'release',
    version: '1.2.3',
    bundleId: 'com.urcare.healthcare',
    performanceOptimized: true,
    debugEnabled: false
  });

  const toggleFeature = (featureId: string) => {
    setNativeFeatures(prev => 
      prev.map(feature => 
        feature.id === featureId 
          ? { ...feature, enabled: !feature.enabled }
          : feature
      )
    );
  };

  const buildApp = async () => {
    setIsBuilding(true);
    setBuildProgress(0);
    
    // Simulate build process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setBuildProgress(i);
    }
    
    setIsBuilding(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'configured': return 'bg-green-100 text-green-800';
      case 'available': return 'bg-blue-100 text-blue-800';
      case 'unavailable': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Build Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Build Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Platform</label>
              <div className="mt-1 p-2 border rounded-md bg-gray-50">
                {buildConfig.platform === 'both' ? 'iOS & Android' : buildConfig.platform}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Version</label>
              <div className="mt-1 p-2 border rounded-md bg-gray-50">
                v{buildConfig.version}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Build Type</label>
              <div className="mt-1 p-2 border rounded-md bg-gray-50">
                {buildConfig.buildType}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Bundle ID</label>
              <div className="mt-1 p-2 border rounded-md bg-gray-50 text-xs">
                {buildConfig.bundleId}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button 
              onClick={buildApp}
              disabled={isBuilding}
              className="flex items-center gap-2"
            >
              <Smartphone className="h-4 w-4" />
              {isBuilding ? 'Building...' : 'Build App'}
            </Button>
            
            {isBuilding && (
              <div className="flex-1 ml-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Build Progress</span>
                  <span>{buildProgress}%</span>
                </div>
                <Progress value={buildProgress} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Native Features */}
      <Card>
        <CardHeader>
          <CardTitle>Native Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nativeFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-sm text-gray-600">{feature.description}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(feature.status)}>
                      {feature.status}
                    </Badge>
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={() => toggleFeature(feature.id)}
                      disabled={feature.status === 'unavailable'}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Battery className="h-5 w-5" />
            Performance Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">App Size Optimization</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Bundle Size</span>
                  <span className="font-medium">4.2 MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Assets</span>
                  <span className="font-medium">2.8 MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Code</span>
                  <span className="font-medium">1.4 MB</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Runtime Performance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Startup Time</span>
                  <span className="font-medium">1.2s</span>
                </div>
                <div className="flex justify-between">
                  <span>Memory Usage</span>
                  <span className="font-medium">45 MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Battery Impact</span>
                  <span className="font-medium">Low</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Store Deployment */}
      <Card>
        <CardHeader>
          <CardTitle>Store Deployment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center">A</div>
                  <span className="font-medium">Google Play Store</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Status</span>
                    <Badge className="bg-green-100 text-green-800">Ready</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Version</span>
                    <span>v{buildConfig.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target API</span>
                    <span>33</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gray-800 rounded text-white text-xs flex items-center justify-center">🍎</div>
                  <span className="font-medium">App Store</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Status</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Review</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Version</span>
                    <span>v{buildConfig.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>iOS Target</span>
                    <span>15.0+</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Deployment Checklist</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>App signing certificates configured</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Privacy policy and terms of service added</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>App store assets prepared</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <span>Beta testing completed</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
