
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Wrench,
  Calendar,
  Activity,
  Thermometer,
  Gauge
} from 'lucide-react';

export const EquipmentMonitoringDashboard = () => {
  const [equipment] = useState([
    {
      id: 'MRI-001',
      name: 'MRI Scanner - Unit 1',
      type: 'Medical Imaging',
      status: 'operational',
      health: 94.2,
      lastMaintenance: '2024-05-15',
      nextMaintenance: '2024-07-15',
      predictedFailure: null,
      temperature: 22.5,
      vibration: 0.2,
      efficiency: 91.8
    },
    {
      id: 'CT-002',
      name: 'CT Scanner - Emergency',
      type: 'Medical Imaging',
      status: 'warning',
      health: 78.4,
      lastMaintenance: '2024-04-20',
      nextMaintenance: '2024-06-20',
      predictedFailure: '2024-06-25',
      temperature: 28.1,
      vibration: 0.8,
      efficiency: 82.3
    },
    {
      id: 'VENT-003',
      name: 'Ventilator - ICU Wing',
      type: 'Life Support',
      status: 'critical',
      health: 65.7,
      lastMaintenance: '2024-03-10',
      nextMaintenance: '2024-06-10',
      predictedFailure: '2024-06-15',
      temperature: 24.3,
      vibration: 1.2,
      efficiency: 75.6
    },
    {
      id: 'XRAY-004',
      name: 'X-Ray Machine - OR 3',
      type: 'Medical Imaging',
      status: 'operational',
      health: 88.9,
      lastMaintenance: '2024-05-01',
      nextMaintenance: '2024-08-01',
      predictedFailure: null,
      temperature: 21.8,
      vibration: 0.3,
      efficiency: 89.4
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'text-green-700 border-green-300';
      case 'warning': return 'text-yellow-700 border-yellow-300';
      case 'critical': return 'text-red-700 border-red-300';
      default: return 'text-gray-700 border-gray-300';
    }
  };

  const getHealthColor = (health) => {
    if (health >= 90) return 'text-green-600';
    if (health >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Equipment Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-gray-600">Operational</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">3</div>
            <div className="text-sm text-gray-600">Warning</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">1</div>
            <div className="text-sm text-gray-600">Critical</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">87.2%</div>
            <div className="text-sm text-gray-600">Avg Health</div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment List */}
      <div className="space-y-4">
        {equipment.map((item) => (
          <Card key={item.id} className={`border-l-4 ${getStatusColor(item.status).includes('red') ? 'border-l-red-500' : item.status === 'warning' ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <p className="text-sm text-gray-600">{item.id} • {item.type}</p>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(item.status)}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Health Score</div>
                  <div className={`text-2xl font-bold ${getHealthColor(item.health)}`}>
                    {item.health.toFixed(1)}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.health >= 90 ? 'bg-green-600' : item.health >= 70 ? 'bg-yellow-600' : 'bg-red-600'}`}
                      style={{ width: `${item.health}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center gap-1">
                    <Thermometer className="h-4 w-4" />
                    Temperature
                  </div>
                  <div className="text-lg font-semibold">{item.temperature}°C</div>
                  <div className="text-xs text-gray-500">Normal: 20-25°C</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    Vibration
                  </div>
                  <div className="text-lg font-semibold">{item.vibration} mm/s</div>
                  <div className="text-xs text-gray-500">Normal: &lt;0.5 mm/s</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center gap-1">
                    <Gauge className="h-4 w-4" />
                    Efficiency
                  </div>
                  <div className="text-lg font-semibold text-blue-600">{item.efficiency}%</div>
                  <div className="text-xs text-gray-500">Target: &gt;85%</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Maintenance Schedule</div>
                  <div className="text-sm text-gray-600">
                    Last: {new Date(item.lastMaintenance).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Next: {new Date(item.nextMaintenance).toLocaleDateString()}
                  </div>
                </div>

                {item.predictedFailure && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-red-600 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      Predicted Failure
                    </div>
                    <div className="text-sm text-red-600 font-semibold">
                      {new Date(item.predictedFailure).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-red-500">Preventive action required</div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button size="sm">
                  <Wrench className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </Button>
                <Button variant="outline" size="sm">
                  <Activity className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                {item.predictedFailure && (
                  <Button variant="destructive" size="sm">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Emergency Maintenance
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
