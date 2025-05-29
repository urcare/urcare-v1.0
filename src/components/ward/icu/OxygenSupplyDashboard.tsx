
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Wind, AlertTriangle, CheckCircle, TrendingDown, Settings } from 'lucide-react';

interface OxygenSupply {
  location: string;
  type: 'central' | 'backup' | 'portable';
  capacity: number;
  currentLevel: number;
  flowRate: number;
  pressure: number;
  status: 'normal' | 'warning' | 'critical' | 'maintenance';
  connectedPatients: number;
  lastMaintenance: string;
  nextMaintenance: string;
  alerts: string[];
}

const mockOxygenSupplies: OxygenSupply[] = [
  {
    location: 'ICU Central Supply',
    type: 'central',
    capacity: 10000,
    currentLevel: 8500,
    flowRate: 450,
    pressure: 50,
    status: 'normal',
    connectedPatients: 12,
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-02-15',
    alerts: []
  },
  {
    location: 'ICU Wing A',
    type: 'backup',
    capacity: 5000,
    currentLevel: 1200,
    flowRate: 120,
    pressure: 45,
    status: 'warning',
    connectedPatients: 4,
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-02-10',
    alerts: ['Low oxygen level - 24% remaining']
  },
  {
    location: 'Room ICU-A1',
    type: 'portable',
    capacity: 2000,
    currentLevel: 350,
    flowRate: 15,
    pressure: 40,
    status: 'critical',
    connectedPatients: 1,
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-02-20',
    alerts: ['Critical oxygen level - 17% remaining', 'Pressure below optimal range']
  }
];

export const OxygenSupplyDashboard = () => {
  const [supplies, setSupplies] = useState<OxygenSupply[]>(mockOxygenSupplies);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-600 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      case 'normal': return 'bg-green-500 text-white';
      case 'maintenance': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'central': return '🏢';
      case 'backup': return '🔄';
      case 'portable': return '📦';
      default: return '💨';
    }
  };

  const calculatePercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage <= 20) return 'bg-red-500';
    if (percentage <= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="h-5 w-5" />
            Oxygen Supply Dashboard
          </CardTitle>
          <CardDescription>
            Real-time monitoring of oxygen supplies with automated alerts and maintenance tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Wind className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {supplies.reduce((sum, supply) => sum + supply.connectedPatients, 0)}
                    </p>
                    <p className="text-sm text-gray-600">Connected Patients</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {supplies.filter(s => s.status === 'normal').length}
                    </p>
                    <p className="text-sm text-gray-600">Normal Status</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-yellow-200 bg-yellow-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {supplies.filter(s => s.status === 'warning').length}
                    </p>
                    <p className="text-sm text-gray-600">Warnings</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {supplies.filter(s => s.status === 'critical').length}
                    </p>
                    <p className="text-sm text-gray-600">Critical</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            {supplies.map((supply, index) => (
              <Card key={index} className={`border-l-4 ${supply.status === 'critical' ? 'border-l-red-600' : supply.status === 'warning' ? 'border-l-yellow-500' : supply.status === 'normal' ? 'border-l-green-500' : 'border-l-blue-500'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(supply.type)}</span>
                      <div>
                        <h3 className="font-semibold text-lg">{supply.location}</h3>
                        <p className="text-sm text-gray-600 capitalize">{supply.type} Supply Unit</p>
                      </div>
                      <Badge className={getStatusColor(supply.status)}>
                        {supply.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Oxygen Level</span>
                          <span className="text-sm font-bold">
                            {calculatePercentage(supply.currentLevel, supply.capacity)}%
                          </span>
                        </div>
                        <Progress 
                          value={calculatePercentage(supply.currentLevel, supply.capacity)} 
                          className="h-3"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {supply.currentLevel}L / {supply.capacity}L
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Flow Rate</p>
                        <p className="font-medium">{supply.flowRate} L/min</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Pressure</p>
                        <p className="font-medium">{supply.pressure} PSI</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Connected</p>
                        <p className="font-medium">{supply.connectedPatients} patients</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Capacity</p>
                        <p className="font-medium">{supply.capacity}L</p>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2">
                        <p className="text-xs text-gray-500 mb-1">Last Maintenance</p>
                        <p className="font-medium text-sm">{supply.lastMaintenance}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Next Maintenance</p>
                        <p className="font-medium text-sm">{supply.nextMaintenance}</p>
                      </div>
                    </div>
                  </div>

                  {supply.alerts.length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-800">Active Alerts</span>
                      </div>
                      <div className="space-y-1">
                        {supply.alerts.map((alert, alertIndex) => (
                          <p key={alertIndex} className="text-sm text-red-700">• {alert}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {supply.status === 'critical' && (
                      <Button size="sm" variant="destructive">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Emergency Refill
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      View History
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
