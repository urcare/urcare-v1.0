
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, Activity, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

interface DeviceAlert {
  deviceId: string;
  deviceName: string;
  deviceType: 'ventilator' | 'monitor' | 'pump' | 'dialysis' | 'ecmo';
  patientId: string;
  patientName: string;
  room: string;
  status: 'connected' | 'disconnected' | 'error' | 'warning';
  lastSync: Date;
  alertType: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  batteryLevel?: number;
  signalStrength: number;
}

const mockDeviceAlerts: DeviceAlert[] = [
  {
    deviceId: 'VEN001',
    deviceName: 'Ventilator Hamilton-G5',
    deviceType: 'ventilator',
    patientId: 'ICU001',
    patientName: 'Sarah Johnson',
    room: 'ICU-A1',
    status: 'error',
    lastSync: new Date(Date.now() - 300000),
    alertType: 'Communication Error',
    message: 'Device not responding to sync requests - manual intervention required',
    priority: 'critical',
    batteryLevel: 85,
    signalStrength: 45
  },
  {
    deviceId: 'MON002',
    deviceName: 'Philips MX800',
    deviceType: 'monitor',
    patientId: 'ICU002',
    patientName: 'Michael Chen',
    room: 'ICU-B2',
    status: 'warning',
    lastSync: new Date(Date.now() - 60000),
    alertType: 'Low Signal',
    message: 'Weak WiFi signal affecting data transmission quality',
    priority: 'medium',
    batteryLevel: 92,
    signalStrength: 25
  },
  {
    deviceId: 'PMP003',
    deviceName: 'B.Braun Infusomat',
    deviceType: 'pump',
    patientId: 'ICU003',
    patientName: 'Emma Davis',
    room: 'ICU-C1',
    status: 'connected',
    lastSync: new Date(Date.now() - 30000),
    alertType: 'Normal Operation',
    message: 'Device syncing normally with central monitoring system',
    priority: 'low',
    batteryLevel: 78,
    signalStrength: 95
  }
];

export const DeviceSyncAlerts = () => {
  const [alerts, setAlerts] = useState<DeviceAlert[]>(mockDeviceAlerts);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(prev => prev.map(alert => ({
        ...alert,
        lastSync: alert.status === 'connected' ? new Date() : alert.lastSync,
        signalStrength: alert.status === 'connected' ? 
          Math.max(20, Math.min(100, alert.signalStrength + Math.floor(Math.random() * 10) - 5)) : 
          alert.signalStrength
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      case 'error': return 'bg-red-500 text-white';
      case 'disconnected': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'ventilator': return <Activity className="h-5 w-5" />;
      case 'monitor': return <Activity className="h-5 w-5" />;
      case 'pump': return <Activity className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const formatTimeSince = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              <CardTitle>Device Sync Integration & Alerts</CardTitle>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <CardDescription>
            Real-time monitoring of ICU device connectivity and synchronization status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">1</p>
                  <p className="text-sm text-gray-600">Connected</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">1</p>
                  <p className="text-sm text-gray-600">Warnings</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-2">
                <WifiOff className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">1</p>
                  <p className="text-sm text-gray-600">Errors</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Activity className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">3</p>
                  <p className="text-sm text-gray-600">Total Devices</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.deviceId} className={`border-l-4 ${alert.priority === 'critical' ? 'border-l-red-600' : alert.priority === 'high' ? 'border-l-orange-400' : alert.priority === 'medium' ? 'border-l-yellow-400' : 'border-l-green-400'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getDeviceIcon(alert.deviceType)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{alert.deviceName}</h3>
                        <p className="text-sm text-gray-600">{alert.patientName} • {alert.room}</p>
                      </div>
                      <Badge className={getStatusColor(alert.status)}>
                        {alert.status.toUpperCase()}
                      </Badge>
                      <Badge className={`${getPriorityColor(alert.priority)} bg-opacity-10`}>
                        {alert.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Last Sync: {formatTimeSince(alert.lastSync)}</p>
                      <p className="text-sm text-gray-500">Device ID: {alert.deviceId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Connection Status</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Signal Strength:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div 
                                className={`h-full rounded-full ${alert.signalStrength >= 70 ? 'bg-green-500' : alert.signalStrength >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${alert.signalStrength}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{alert.signalStrength}%</span>
                          </div>
                        </div>
                        {alert.batteryLevel && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Battery Level:</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-gray-200 rounded-full">
                                <div 
                                  className={`h-full rounded-full ${alert.batteryLevel >= 50 ? 'bg-green-500' : alert.batteryLevel >= 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${alert.batteryLevel}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{alert.batteryLevel}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Alert Details</h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <strong>Type:</strong> {alert.alertType}
                        </div>
                        <div className="text-sm">
                          <strong>Device Type:</strong> {alert.deviceType}
                        </div>
                        <div className="text-sm">
                          <strong>Priority:</strong> <span className={getPriorityColor(alert.priority)}>{alert.priority}</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Message</h4>
                      <p className="text-sm p-2 bg-gray-50 rounded">{alert.message}</p>
                    </Card>
                  </div>

                  <div className="flex gap-2">
                    {alert.status === 'error' && (
                      <Button size="sm" variant="default">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Retry Connection
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Activity className="h-4 w-4 mr-1" />
                      View Device Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Contact Biomedical
                    </Button>
                    <Button size="sm" variant="outline">
                      Create Ticket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
