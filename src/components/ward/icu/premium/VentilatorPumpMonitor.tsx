
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Activity, AlertTriangle, Settings, TrendingUp, Wind, Droplets } from 'lucide-react';

interface EquipmentMonitor {
  deviceId: string;
  patientName: string;
  room: string;
  deviceType: 'ventilator' | 'infusion-pump' | 'dialysis' | 'ecmo';
  brand: string;
  model: string;
  status: 'normal' | 'warning' | 'alarm' | 'maintenance';
  batteryLevel: number;
  lastMaintenance: Date;
  nextMaintenance: Date;
  parameters: Record<string, any>;
  alerts: string[];
  uptime: number;
  assignedTech: string;
}

const mockEquipment: EquipmentMonitor[] = [
  {
    deviceId: 'VENT-001',
    patientName: 'Sarah Johnson',
    room: 'ICU-A1',
    deviceType: 'ventilator',
    brand: 'Medtronic',
    model: 'PB980',
    status: 'alarm',
    batteryLevel: 85,
    lastMaintenance: new Date('2024-01-15'),
    nextMaintenance: new Date('2024-02-15'),
    uptime: 72,
    assignedTech: 'RT Thompson',
    alerts: ['High pressure alarm', 'O2 concentration variance'],
    parameters: {
      mode: 'SIMV',
      tidalVolume: 450,
      respiratoryRate: 16,
      peep: 8,
      fio2: 60,
      pressure: 28,
      compliance: 35
    }
  },
  {
    deviceId: 'PUMP-003',
    patientName: 'Michael Chen',
    room: 'ICU-B3',
    deviceType: 'infusion-pump',
    brand: 'Baxter',
    model: 'Sigma 8000',
    status: 'warning',
    batteryLevel: 45,
    lastMaintenance: new Date('2024-01-10'),
    nextMaintenance: new Date('2024-02-10'),
    uptime: 96,
    assignedTech: 'Tech Martinez',
    alerts: ['Low battery warning', 'Flow rate deviation'],
    parameters: {
      medication: 'Norepinephrine',
      concentration: '4mg/250ml',
      rate: '8.5 ml/hr',
      dose: '0.12 mcg/kg/min',
      pressure: 'Normal',
      occlusion: 'None'
    }
  }
];

export const VentilatorPumpMonitor = () => {
  const [equipment, setEquipment] = useState<EquipmentMonitor[]>(mockEquipment);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'alarm': return 'bg-red-600 text-white animate-pulse';
      case 'warning': return 'bg-yellow-500 text-white';
      case 'maintenance': return 'bg-blue-500 text-white';
      case 'normal': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'ventilator': return <Wind className="h-6 w-6" />;
      case 'infusion-pump': return <Droplets className="h-6 w-6" />;
      case 'dialysis': return <Activity className="h-6 w-6" />;
      case 'ecmo': return <TrendingUp className="h-6 w-6" />;
      default: return <Settings className="h-6 w-6" />;
    }
  };

  const getBatteryColor = (level: number) => {
    if (level < 20) return 'text-red-600';
    if (level < 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Ventilator & Pump Monitor
          </CardTitle>
          <CardDescription>
            Real-time monitoring of critical ICU equipment with predictive maintenance alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">2</p>
                  <p className="text-sm text-gray-600">Active Alarms</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                <Settings className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">3</p>
                  <p className="text-sm text-gray-600">Warnings</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Activity className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">24</p>
                  <p className="text-sm text-gray-600">Online Devices</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">98.5%</p>
                  <p className="text-sm text-gray-600">Uptime</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {equipment.map((device) => (
              <Card key={device.deviceId} className={`border-l-4 ${device.status === 'alarm' ? 'border-l-red-600' : device.status === 'warning' ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getDeviceIcon(device.deviceType)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{device.patientName}</h3>
                        <p className="text-sm text-gray-600">{device.brand} {device.model}</p>
                      </div>
                      <Badge variant="outline">{device.room}</Badge>
                      <Badge className={getStatusColor(device.status)}>
                        {device.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Uptime: {device.uptime}h</p>
                      <p className="text-sm text-gray-500">Tech: {device.assignedTech}</p>
                    </div>
                  </div>

                  {device.alerts.length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-800">Active Alerts</span>
                      </div>
                      <div className="space-y-1">
                        {device.alerts.map((alert, index) => (
                          <p key={index} className="text-sm text-red-700">• {alert}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Device Status</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Battery Level</span>
                            <span className={`text-sm font-bold ${getBatteryColor(device.batteryLevel)}`}>
                              {device.batteryLevel}%
                            </span>
                          </div>
                          <Progress value={device.batteryLevel} className="h-2" />
                        </div>
                        <div className="text-sm">
                          <p><strong>Last Maintenance:</strong> {device.lastMaintenance.toLocaleDateString()}</p>
                          <p><strong>Next Due:</strong> {device.nextMaintenance.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Current Parameters</h4>
                      <div className="space-y-2">
                        {Object.entries(device.parameters).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Performance Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Efficiency:</span>
                          <span className="font-medium text-green-600">97.2%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Accuracy:</span>
                          <span className="font-medium text-green-600">99.1%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Reliability:</span>
                          <span className="font-medium text-green-600">98.5%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Response Time:</span>
                          <span className="font-medium">1.2s</span>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="flex gap-2">
                    {device.status === 'alarm' && (
                      <Button size="sm" variant="destructive">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Acknowledge Alarm
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-1" />
                      Adjust Parameters
                    </Button>
                    <Button size="sm" variant="outline">
                      View Trends
                    </Button>
                    <Button size="sm" variant="outline">
                      Schedule Maintenance
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
