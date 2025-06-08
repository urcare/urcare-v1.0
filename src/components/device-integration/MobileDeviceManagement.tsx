
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Download, 
  Shield, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Lock,
  Wifi,
  Battery,
  Users,
  Package
} from 'lucide-react';

export const MobileDeviceManagement = () => {
  const [selectedDevice, setSelectedDevice] = useState('device-1');

  const mobileDevices = [
    {
      id: 'device-1',
      deviceName: 'iPad Pro - Nurse Station 1',
      user: 'Nurse Sarah Johnson',
      model: 'iPad Pro 12.9"',
      os: 'iOS 17.2',
      appVersion: '2.4.1',
      lastSync: '2 mins ago',
      batteryLevel: 78,
      connectivity: 'WiFi - Excellent',
      status: 'active',
      compliance: 'compliant',
      installedApps: 12,
      pendingUpdates: 0,
      alerts: []
    },
    {
      id: 'device-2',
      deviceName: 'iPhone 15 - Dr. Wilson',
      user: 'Dr. Michael Wilson',
      model: 'iPhone 15 Pro',
      os: 'iOS 17.1',
      appVersion: '2.3.8',
      lastSync: '15 mins ago',
      batteryLevel: 45,
      connectivity: 'Cellular - Good',
      status: 'active',
      compliance: 'non-compliant',
      installedApps: 8,
      pendingUpdates: 3,
      alerts: ['Security update required', 'Non-approved app detected']
    },
    {
      id: 'device-3',
      deviceName: 'Android Tablet - ICU',
      user: 'Nurse Maria Garcia',
      model: 'Samsung Galaxy Tab S9',
      os: 'Android 14',
      appVersion: '2.4.0',
      lastSync: '1 hour ago',
      batteryLevel: 23,
      connectivity: 'WiFi - Poor',
      status: 'warning',
      compliance: 'compliant',
      installedApps: 10,
      pendingUpdates: 1,
      alerts: ['Low battery', 'Sync failed']
    }
  ];

  const selectedDeviceData = mobileDevices.find(d => d.id === selectedDevice);

  const appCatalog = [
    { name: 'Medical Calculator', version: '3.2.1', status: 'installed', category: 'utility' },
    { name: 'Drug Reference', version: '5.1.0', status: 'update-available', category: 'reference' },
    { name: 'Lab Results Viewer', version: '2.8.3', status: 'installed', category: 'clinical' },
    { name: 'Patient Scheduler', version: '4.0.2', status: 'not-installed', category: 'workflow' },
    { name: 'Secure Messenger', version: '1.9.1', status: 'installed', category: 'communication' }
  ];

  const securityPolicies = [
    { name: 'Screen Lock', status: 'enforced', description: 'Auto-lock after 2 minutes' },
    { name: 'App Store Restrictions', status: 'enforced', description: 'Only approved apps allowed' },
    { name: 'Data Encryption', status: 'enforced', description: 'All data encrypted at rest' },
    { name: 'Remote Wipe', status: 'available', description: 'Device can be wiped remotely' },
    { name: 'VPN Required', status: 'enforced', description: 'Hospital VPN mandatory' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-green-500 bg-green-50';
      case 'warning': return 'border-orange-500 bg-orange-50';
      case 'offline': return 'border-red-500 bg-red-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getComplianceColor = (compliance: string) => {
    switch (compliance) {
      case 'compliant': return 'border-green-500 text-green-700';
      case 'non-compliant': return 'border-red-500 text-red-700';
      case 'pending': return 'border-orange-500 text-orange-700';
      default: return 'border-gray-500 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Mobile Device Management</h3>
          <p className="text-gray-600">Security policies, app deployment, and device monitoring</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            App Catalog
          </Button>
          <Button className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security Policies
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device List */}
        <Card>
          <CardHeader>
            <CardTitle>Managed Devices</CardTitle>
            <CardDescription>Mobile devices in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mobileDevices.map((device) => (
                <div
                  key={device.id}
                  className={`p-3 border-l-4 rounded cursor-pointer transition-colors ${
                    getStatusColor(device.status)
                  } ${selectedDevice === device.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedDevice(device.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">{device.deviceName}</h5>
                      <p className="text-sm text-gray-700">{device.user}</p>
                      <p className="text-sm text-gray-600">{device.model}</p>
                      <p className="text-xs text-gray-500">{device.lastSync}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={getComplianceColor(device.compliance)}>
                        {device.compliance}
                      </Badge>
                      {device.alerts.length > 0 && (
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-1 ml-auto" />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-600">Battery: {device.batteryLevel}%</span>
                      <span className="text-xs text-gray-600">Apps: {device.installedApps}</span>
                    </div>
                    {device.pendingUpdates > 0 && (
                      <Badge variant="outline" className="text-xs border-orange-500 text-orange-700">
                        {device.pendingUpdates} updates
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Details */}
        <div className="lg:col-span-2 space-y-4">
          {selectedDeviceData && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    {selectedDeviceData.deviceName}
                  </CardTitle>
                  <CardDescription>User: {selectedDeviceData.user}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 border rounded-lg bg-blue-50">
                      <Smartphone className="h-5 w-5 text-blue-600 mb-2" />
                      <p className="text-sm text-gray-600">Device Model</p>
                      <p className="font-bold text-gray-900 text-sm">{selectedDeviceData.model}</p>
                      <p className="text-xs text-gray-600">{selectedDeviceData.os}</p>
                    </div>
                    <div className="p-3 border rounded-lg bg-green-50">
                      <Battery className="h-5 w-5 text-green-600 mb-2" />
                      <p className="text-sm text-gray-600">Battery</p>
                      <p className="font-bold text-gray-900">{selectedDeviceData.batteryLevel}%</p>
                    </div>
                    <div className="p-3 border rounded-lg bg-purple-50">
                      <Wifi className="h-5 w-5 text-purple-600 mb-2" />
                      <p className="text-sm text-gray-600">Connectivity</p>
                      <p className="font-bold text-gray-900 text-sm">{selectedDeviceData.connectivity}</p>
                    </div>
                    <div className="p-3 border rounded-lg bg-orange-50">
                      <Package className="h-5 w-5 text-orange-600 mb-2" />
                      <p className="text-sm text-gray-600">Apps</p>
                      <p className="font-bold text-gray-900">{selectedDeviceData.installedApps}</p>
                      <p className="text-xs text-gray-600">Installed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* App Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Management</CardTitle>
                  <CardDescription>Installed and available applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {appCatalog.map((app, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            app.category === 'clinical' ? 'bg-blue-100' :
                            app.category === 'reference' ? 'bg-green-100' :
                            app.category === 'utility' ? 'bg-purple-100' :
                            app.category === 'workflow' ? 'bg-orange-100' :
                            'bg-gray-100'
                          }`}>
                            <Package className={`h-4 w-4 ${
                              app.category === 'clinical' ? 'text-blue-600' :
                              app.category === 'reference' ? 'text-green-600' :
                              app.category === 'utility' ? 'text-purple-600' :
                              app.category === 'workflow' ? 'text-orange-600' :
                              'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">{app.name}</h5>
                            <p className="text-sm text-gray-600">Version {app.version}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`${
                            app.status === 'installed' ? 'border-green-500 text-green-700' :
                            app.status === 'update-available' ? 'border-orange-500 text-orange-700' :
                            'border-gray-500 text-gray-700'
                          }`}>
                            {app.status.replace('-', ' ')}
                          </Badge>
                          {app.status === 'not-installed' && (
                            <Button size="sm" className="h-7">
                              <Download className="h-3 w-3 mr-1" />
                              Install
                            </Button>
                          )}
                          {app.status === 'update-available' && (
                            <Button size="sm" variant="outline" className="h-7">
                              Update
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Security Policies */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Compliance</CardTitle>
                  <CardDescription>Device security policy enforcement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {securityPolicies.map((policy, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-blue-600" />
                          <div>
                            <h5 className="font-medium text-gray-900">{policy.name}</h5>
                            <p className="text-sm text-gray-600">{policy.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {policy.status === 'enforced' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Lock className="h-5 w-5 text-orange-600" />
                          )}
                          <Badge variant="outline" className={`${
                            policy.status === 'enforced' ? 'border-green-500 text-green-700' :
                            'border-orange-500 text-orange-700'
                          }`}>
                            {policy.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Device Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Device Actions</CardTitle>
                  <CardDescription>Administrative controls for device management</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Lock Device
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Force Sync
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Configure
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2 text-red-600 border-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      Remote Wipe
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts Section */}
              {selectedDeviceData.alerts.length > 0 && (
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-800 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Device Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedDeviceData.alerts.map((alert, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-red-100 rounded">
                          <span className="text-red-800 font-medium">{alert}</span>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            Resolve
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
