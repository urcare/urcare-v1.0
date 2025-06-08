import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Tablet, 
  Wifi, 
  WifiOff,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Eye,
  MessageSquare,
  Video,
  Phone
} from 'lucide-react';

export const MobileOptimized = () => {
  const [connectionStatus, setConnectionStatus] = useState('online');
  const [syncStatus, setSyncStatus] = useState('synced');
  const [downloadProgress, setDownloadProgress] = useState(85);

  const mobileWorkflow = [
    {
      id: 'mobile1',
      patient: 'John Doe',
      study: 'Chest CT',
      priority: 'STAT',
      imageSize: '145 MB',
      downloaded: true,
      status: 'Ready for Reading'
    },
    {
      id: 'mobile2',
      patient: 'Jane Smith',
      study: 'Brain MRI',
      priority: 'Urgent',
      imageSize: '280 MB',
      downloaded: false,
      status: 'Downloading'
    },
    {
      id: 'mobile3',
      patient: 'Robert Brown',
      study: 'Abdomen CT',
      priority: 'Routine',
      imageSize: '198 MB',
      downloaded: true,
      status: 'Read'
    }
  ];

  const consultationTools = [
    {
      type: 'video',
      title: 'Video Consultation',
      description: 'Live video discussion with referring physician',
      icon: Video,
      active: false
    },
    {
      type: 'voice',
      title: 'Voice Call',
      description: 'Audio consultation for urgent findings',
      icon: Phone,
      active: true
    },
    {
      type: 'messaging',
      title: 'Secure Messaging',
      description: 'Text-based consultation platform',
      icon: MessageSquare,
      active: false
    }
  ];

  const offlineCapabilities = {
    cachedStudies: 12,
    offlineReports: 3,
    pendingSync: 5,
    storageUsed: 2.4,
    storageLimit: 8.0
  };

  const deviceOptimization = {
    tablet: {
      resolution: '2732 x 2048',
      colorAccuracy: '99% sRGB',
      brightness: '600 nits',
      recommended: true
    },
    phone: {
      resolution: '1284 x 2778',
      colorAccuracy: '95% sRGB',
      brightness: '1200 nits',
      recommended: false
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Mobile-Optimized Interface</h3>
          <p className="text-gray-600">Tablet-based reading and remote consultation capabilities</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Mobile Settings
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync Now
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`border-2 ${
          connectionStatus === 'online' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {connectionStatus === 'online' ? (
                <Wifi className="h-8 w-8 text-green-600" />
              ) : (
                <WifiOff className="h-8 w-8 text-red-600" />
              )}
              <div>
                <p className="text-lg font-bold">{connectionStatus === 'online' ? 'Online' : 'Offline'}</p>
                <p className="text-sm text-gray-600">Connection Status</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Tablet className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-lg font-bold">iPad Pro</p>
                <p className="text-sm text-blue-700">Optimized Device</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Download className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-lg font-bold">{offlineCapabilities.cachedStudies}</p>
                <p className="text-sm text-purple-700">Cached Studies</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mobile Workflow */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Reading Workflow</CardTitle>
              <CardDescription>Optimized for tablet-based interpretation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mobileWorkflow.map((study, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900">{study.patient}</h5>
                        <p className="text-sm text-gray-600">{study.study}</p>
                        <p className="text-xs text-gray-500">Image Size: {study.imageSize}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={`${
                          study.priority === 'STAT' ? 'border-red-500 text-red-700' :
                          study.priority === 'Urgent' ? 'border-orange-500 text-orange-700' :
                          'border-blue-500 text-blue-700'
                        }`}>
                          {study.priority}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">{study.status}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {study.downloaded ? (
                          <Badge className="bg-green-500">
                            <Download className="h-3 w-3 mr-1" />
                            Downloaded
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-orange-500 text-orange-700">
                            <Upload className="h-3 w-3 mr-1" />
                            Downloading {downloadProgress}%
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" disabled={!study.downloaded}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" disabled={!study.downloaded}>
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {!study.downloaded && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${downloadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Optimization */}
          <Card>
            <CardHeader>
              <CardTitle>Device Optimization</CardTitle>
              <CardDescription>Display specifications and reading environment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Tablet className="h-8 w-8 text-blue-600" />
                    <div>
                      <h5 className="font-medium text-gray-900">Tablet Display</h5>
                      <p className="text-sm text-gray-600">Professional reading setup</p>
                    </div>
                    {deviceOptimization.tablet.recommended && (
                      <Badge className="bg-green-500">Recommended</Badge>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Resolution</span>
                      <span className="font-medium">{deviceOptimization.tablet.resolution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Color Accuracy</span>
                      <span className="font-medium text-green-600">{deviceOptimization.tablet.colorAccuracy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Brightness</span>
                      <span className="font-medium">{deviceOptimization.tablet.brightness}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-8 w-8 text-gray-600" />
                    <div>
                      <h5 className="font-medium text-gray-900">Phone Display</h5>
                      <p className="text-sm text-gray-600">Emergency consultation only</p>
                    </div>
                    {!deviceOptimization.phone.recommended && (
                      <Badge variant="outline" className="border-orange-500 text-orange-700">Limited</Badge>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Resolution</span>
                      <span className="font-medium">{deviceOptimization.phone.resolution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Color Accuracy</span>
                      <span className="font-medium text-yellow-600">{deviceOptimization.phone.colorAccuracy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Brightness</span>
                      <span className="font-medium">{deviceOptimization.phone.brightness}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Consultation Tools */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Remote Consultation</CardTitle>
              <CardDescription>Multi-modal communication tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {consultationTools.map((tool, index) => (
                  <div key={index} className={`border rounded-lg p-3 ${
                    tool.active ? 'border-green-200 bg-green-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <tool.icon className={`h-5 w-5 ${
                        tool.active ? 'text-green-600' : 'text-gray-600'
                      }`} />
                      <h5 className="font-medium text-gray-900">{tool.title}</h5>
                      {tool.active && (
                        <Badge className="bg-green-500">Active</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                    <Button 
                      size="sm" 
                      className={`w-full ${
                        tool.active ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {tool.active ? 'End Call' : 'Start Session'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Offline Capabilities</CardTitle>
              <CardDescription>Local storage and sync management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 border rounded">
                    <p className="text-lg font-bold text-blue-600">{offlineCapabilities.cachedStudies}</p>
                    <p className="text-xs text-gray-600">Cached Studies</p>
                  </div>
                  <div className="p-3 border rounded">
                    <p className="text-lg font-bold text-purple-600">{offlineCapabilities.offlineReports}</p>
                    <p className="text-xs text-gray-600">Offline Reports</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Storage Used</span>
                    <span className="font-medium">{offlineCapabilities.storageUsed} / {offlineCapabilities.storageLimit} GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(offlineCapabilities.storageUsed / offlineCapabilities.storageLimit) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pending Sync</span>
                    <Badge variant="outline" className="border-orange-500 text-orange-700">
                      {offlineCapabilities.pendingSync} items
                    </Badge>
                  </div>
                  <Button size="sm" className="w-full flex items-center gap-2">
                    <Sync className="h-3 w-3" />
                    Sync When Online
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <Button size="sm" className="w-full flex items-center gap-2">
                <Download className="h-3 w-3" />
                Download Priority Studies
              </Button>
              <Button size="sm" variant="outline" className="w-full flex items-center gap-2">
                <Settings className="h-3 w-3" />
                Optimize Display
              </Button>
              <Button size="sm" variant="outline" className="w-full flex items-center gap-2">
                <Wifi className="h-3 w-3" />
                Connection Test
              </Button>
              <Button size="sm" variant="outline" className="w-full flex items-center gap-2">
                <RefreshCw className="h-3 w-3" />
                Sync When Online
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
