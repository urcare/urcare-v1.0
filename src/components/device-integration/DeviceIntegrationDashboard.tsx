
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Monitor, 
  Activity, 
  Droplets, 
  Wind, 
  Tablet, 
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wifi,
  WifiOff,
  Settings,
  RefreshCw,
  Download
} from 'lucide-react';
import { VitalSignsMonitoring } from './VitalSignsMonitoring';
import { InfusionPumpInterface } from './InfusionPumpInterface';
import { VentilatorMonitoring } from './VentilatorMonitoring';
import { BedsideTerminalInterface } from './BedsideTerminalInterface';
import { MobileDeviceManagement } from './MobileDeviceManagement';
import { DeviceManagementDashboard } from './DeviceManagementDashboard';

export const DeviceIntegrationDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const deviceMetrics = {
    totalDevices: 247,
    connectedDevices: 231,
    offlineDevices: 16,
    activeAlerts: 8,
    criticalAlerts: 2,
    dataPoints: 15847,
    avgResponseTime: 145,
    uptime: 99.2
  };

  const deviceCategories = [
    {
      name: 'Vital Signs Monitors',
      count: 89,
      connected: 85,
      icon: Activity,
      color: 'blue',
      alerts: 2
    },
    {
      name: 'Infusion Pumps',
      count: 67,
      connected: 63,
      icon: Droplets,
      color: 'purple',
      alerts: 3
    },
    {
      name: 'Ventilators',
      count: 34,
      connected: 32,
      icon: Wind,
      color: 'green',
      alerts: 1
    },
    {
      name: 'Bedside Terminals',
      count: 45,
      connected: 42,
      icon: Tablet,
      color: 'orange',
      alerts: 0
    },
    {
      name: 'Mobile Devices',
      count: 12,
      connected: 9,
      icon: Smartphone,
      color: 'pink',
      alerts: 2
    }
  ];

  const recentAlerts = [
    {
      id: 'ALT001',
      device: 'Infusion Pump - Room 201A',
      type: 'Critical',
      message: 'Occlusion detected - flow stopped',
      timestamp: '2 mins ago',
      status: 'active'
    },
    {
      id: 'ALT002',
      device: 'Vital Signs Monitor - ICU Bed 5',
      type: 'Warning',
      message: 'Low battery - 15% remaining',
      timestamp: '5 mins ago',
      status: 'acknowledged'
    },
    {
      id: 'ALT003',
      device: 'Ventilator - ICU Bed 3',
      type: 'Critical',
      message: 'High airway pressure alarm',
      timestamp: '8 mins ago',
      status: 'resolved'
    },
    {
      id: 'ALT004',
      device: 'Mobile Device - Nurse Station 2',
      type: 'Info',
      message: 'Software update available',
      timestamp: '15 mins ago',
      status: 'pending'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Device Integration Hub</h1>
          <p className="text-gray-600 mt-2">Centralized monitoring and management of all medical devices</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="h-4 w-4" />
            Refresh All
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vital-signs">Vital Signs</TabsTrigger>
          <TabsTrigger value="infusion">Infusion</TabsTrigger>
          <TabsTrigger value="ventilator">Ventilator</TabsTrigger>
          <TabsTrigger value="bedside">Bedside</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Monitor className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{deviceMetrics.totalDevices}</p>
                    <p className="text-sm text-blue-700">Total Devices</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Wifi className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-900">{deviceMetrics.connectedDevices}</p>
                    <p className="text-sm text-green-700">Connected</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <WifiOff className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-900">{deviceMetrics.offlineDevices}</p>
                    <p className="text-sm text-red-700">Offline</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-900">{deviceMetrics.activeAlerts}</p>
                    <p className="text-sm text-orange-700">Active Alerts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Device Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Categories</CardTitle>
                <CardDescription>Real-time status of device types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full bg-${category.color}-100`}>
                          <category.icon className={`h-5 w-5 text-${category.color}-600`} />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">{category.name}</h5>
                          <p className="text-sm text-gray-600">{category.connected}/{category.count} connected</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={`${
                          category.connected === category.count ? 'border-green-500 text-green-700' : 'border-orange-500 text-orange-700'
                        }`}>
                          {Math.round((category.connected / category.count) * 100)}%
                        </Badge>
                        {category.alerts > 0 && (
                          <p className="text-xs text-red-600 mt-1">{category.alerts} alerts</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Latest device alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAlerts.map((alert, index) => (
                    <div key={index} className={`flex items-start gap-3 p-3 border-l-4 rounded ${
                      alert.type === 'Critical' ? 'border-l-red-500 bg-red-50' :
                      alert.type === 'Warning' ? 'border-l-orange-500 bg-orange-50' :
                      'border-l-blue-500 bg-blue-50'
                    }`}>
                      <div className={`p-1 rounded-full ${
                        alert.type === 'Critical' ? 'bg-red-100' :
                        alert.type === 'Warning' ? 'bg-orange-100' :
                        'bg-blue-100'
                      }`}>
                        <AlertTriangle className={`h-4 w-4 ${
                          alert.type === 'Critical' ? 'text-red-600' :
                          alert.type === 'Warning' ? 'text-orange-600' :
                          'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-gray-900">{alert.device}</h5>
                          <Badge variant="outline" className={`text-xs ${
                            alert.type === 'Critical' ? 'border-red-500 text-red-700' :
                            alert.type === 'Warning' ? 'border-orange-500 text-orange-700' :
                            'border-blue-500 text-blue-700'
                          }`}>
                            {alert.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{deviceMetrics.dataPoints.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Data Points Today</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{deviceMetrics.avgResponseTime}ms</p>
                <p className="text-sm text-gray-600">Avg Response Time</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{deviceMetrics.uptime}%</p>
                <p className="text-sm text-gray-600">System Uptime</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Settings className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{deviceMetrics.criticalAlerts}</p>
                <p className="text-sm text-gray-600">Critical Alerts</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vital-signs">
          <VitalSignsMonitoring />
        </TabsContent>

        <TabsContent value="infusion">
          <InfusionPumpInterface />
        </TabsContent>

        <TabsContent value="ventilator">
          <VentilatorMonitoring />
        </TabsContent>

        <TabsContent value="bedside">
          <BedsideTerminalInterface />
        </TabsContent>

        <TabsContent value="mobile">
          <MobileDeviceManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};
