
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Activity, 
  AlertTriangle, 
  Calendar, 
  Clock,
  Settings,
  Wrench,
  TrendingUp,
  BarChart3,
  Zap,
  ThermometerSun,
  Gauge,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const EquipmentTracking = () => {
  const [selectedEquipment, setSelectedEquipment] = useState('ct-1');
  const [timeRange, setTimeRange] = useState('today');

  const equipmentList = [
    {
      id: 'ct-1',
      name: 'CT Scanner 1',
      model: 'Siemens SOMATOM Drive',
      location: 'Radiology Wing A',
      status: 'Active',
      utilization: 85,
      uptime: 99.2,
      lastMaintenance: '2024-01-01',
      nextMaintenance: '2024-01-15',
      studiesCompleted: 156,
      avgScanTime: 12,
      temperatureC: 22,
      alertCount: 0
    },
    {
      id: 'mri-1',
      name: 'MRI Machine 1',
      model: 'GE Signa Explorer',
      location: 'Radiology Wing B',
      status: 'Active',
      utilization: 92,
      uptime: 98.8,
      lastMaintenance: '2023-12-20',
      nextMaintenance: '2024-01-10',
      studiesCompleted: 89,
      avgScanTime: 28,
      temperatureC: 18,
      alertCount: 1
    },
    {
      id: 'xr-1',
      name: 'X-Ray Room 1',
      model: 'Philips DigitalDiagnost',
      location: 'Emergency Department',
      status: 'Maintenance',
      utilization: 0,
      uptime: 95.5,
      lastMaintenance: '2024-01-08',
      nextMaintenance: '2024-01-10',
      studiesCompleted: 0,
      avgScanTime: 5,
      temperatureC: 24,
      alertCount: 2
    },
    {
      id: 'us-1',
      name: 'Ultrasound 1',
      model: 'Mindray DC-70',
      location: 'Cardiology',
      status: 'Active',
      utilization: 67,
      uptime: 99.8,
      lastMaintenance: '2023-12-15',
      nextMaintenance: '2024-01-20',
      studiesCompleted: 78,
      avgScanTime: 18,
      temperatureC: 21,
      alertCount: 0
    }
  ];

  const maintenanceSchedule = [
    {
      equipment: 'MRI Machine 1',
      type: 'Preventive',
      date: '2024-01-10',
      duration: '4 hours',
      technician: 'GE Service',
      priority: 'High',
      status: 'Scheduled'
    },
    {
      equipment: 'CT Scanner 1',
      type: 'Calibration',
      date: '2024-01-15',
      duration: '2 hours',
      technician: 'Siemens Service',
      priority: 'Medium',
      status: 'Scheduled'
    },
    {
      equipment: 'Ultrasound 1',
      type: 'Software Update',
      date: '2024-01-20',
      duration: '1 hour',
      technician: 'Internal IT',
      priority: 'Low',
      status: 'Pending'
    }
  ];

  const utilizationData = [
    { hour: '06:00', ct1: 20, mri1: 0, xr1: 45, us1: 10 },
    { hour: '08:00', ct1: 60, mri1: 40, xr1: 80, us1: 30 },
    { hour: '10:00', ct1: 90, mri1: 85, xr1: 95, us1: 70 },
    { hour: '12:00', ct1: 85, mri1: 90, xr1: 75, us1: 80 },
    { hour: '14:00', ct1: 95, mri1: 95, xr1: 85, us1: 85 },
    { hour: '16:00', ct1: 80, mri1: 70, xr1: 60, us1: 60 },
    { hour: '18:00', ct1: 40, mri1: 30, xr1: 30, us1: 25 }
  ];

  const alerts = [
    {
      equipment: 'MRI Machine 1',
      type: 'Temperature Warning',
      severity: 'Medium',
      time: '14:30',
      message: 'Helium temperature slightly elevated'
    },
    {
      equipment: 'X-Ray Room 1',
      type: 'System Error',
      severity: 'High',
      time: '12:15',
      message: 'Detector calibration failed'
    },
    {
      equipment: 'X-Ray Room 1',
      type: 'Maintenance Required',
      severity: 'Medium',
      time: '10:00',
      message: 'Scheduled maintenance overdue'
    }
  ];

  const costMetrics = [
    { equipment: 'CT Scanner 1', costPerStudy: 125, monthlyMaintenance: 8500, utilization: 85 },
    { equipment: 'MRI Machine 1', costPerStudy: 285, monthlyMaintenance: 12000, utilization: 92 },
    { equipment: 'X-Ray Room 1', costPerStudy: 35, monthlyMaintenance: 2500, utilization: 0 },
    { equipment: 'Ultrasound 1', costPerStudy: 65, monthlyMaintenance: 1800, utilization: 67 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Equipment Tracking & Management</h3>
          <p className="text-gray-600">Real-time monitoring, maintenance scheduling, and performance analytics</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Maintenance
          </Button>
          <Button className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Equipment Settings
          </Button>
        </div>
      </div>

      {/* Equipment Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {equipmentList.map((equipment) => (
          <Card
            key={equipment.id}
            className={`cursor-pointer transition-all ${
              selectedEquipment === equipment.id ? 'ring-2 ring-blue-500' : ''
            } ${
              equipment.status === 'Active' ? 'border-green-200 bg-green-50' :
              equipment.status === 'Maintenance' ? 'border-red-200 bg-red-50' : 'border-gray-200'
            }`}
            onClick={() => setSelectedEquipment(equipment.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Activity className={`h-5 w-5 ${
                  equipment.status === 'Active' ? 'text-green-600' : 'text-red-600'
                }`} />
                <Badge variant="outline" className={`text-xs ${
                  equipment.status === 'Active' ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700'
                }`}>
                  {equipment.status}
                </Badge>
              </div>
              <h5 className="font-medium text-gray-900">{equipment.name}</h5>
              <p className="text-sm text-gray-600">{equipment.model}</p>
              <p className="text-xs text-gray-500">{equipment.location}</p>
              
              <div className="mt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Utilization</span>
                  <span className="text-xs font-medium">{equipment.utilization}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      equipment.utilization >= 90 ? 'bg-red-500' :
                      equipment.utilization >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${equipment.utilization}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Uptime: {equipment.uptime}%</span>
                  {equipment.alertCount > 0 && (
                    <span className="text-red-600">{equipment.alertCount} alerts</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment Details */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Performance Dashboard</CardTitle>
              <CardDescription>Real-time monitoring and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const equipment = equipmentList.find(eq => eq.id === selectedEquipment);
                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-blue-900">{equipment.studiesCompleted}</p>
                        <p className="text-sm text-blue-700">Studies Today</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-green-900">{equipment.avgScanTime}min</p>
                        <p className="text-sm text-green-700">Avg Scan Time</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <ThermometerSun className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-purple-900">{equipment.temperatureC}°C</p>
                        <p className="text-sm text-purple-700">Temperature</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Hourly Utilization</h4>
                      <div className="space-y-2">
                        {utilizationData.map((data, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <span className="text-sm font-medium w-12">{data.hour}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                              <div 
                                className="bg-blue-500 h-4 rounded-full" 
                                style={{ width: `${data[equipment.id.replace('-', '')]}%` }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-medium text-white">
                                  {data[equipment.id.replace('-', '')]}%
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Equipment Information</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Model</p>
                          <p className="font-medium">{equipment.model}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Location</p>
                          <p className="font-medium">{equipment.location}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Last Maintenance</p>
                          <p className="font-medium">{equipment.lastMaintenance}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Next Maintenance</p>
                          <p className="font-medium">{equipment.nextMaintenance}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
              <CardDescription>Equipment cost efficiency and ROI metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costMetrics.map((cost, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h5 className="font-medium text-gray-900">{cost.equipment}</h5>
                      <p className="text-sm text-gray-600">Cost per study: ${cost.costPerStudy}</p>
                      <p className="text-sm text-gray-600">Monthly maintenance: ${cost.monthlyMaintenance}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">{cost.utilization}% utilized</p>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${cost.utilization}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance & Alerts */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Active Alerts</CardTitle>
              <CardDescription className="text-xs">Equipment alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div key={index} className={`p-3 border-l-4 rounded ${
                    alert.severity === 'High' ? 'border-l-red-500 bg-red-50' :
                    alert.severity === 'Medium' ? 'border-l-yellow-500 bg-yellow-50' : 'border-l-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <AlertTriangle className={`h-4 w-4 ${
                        alert.severity === 'High' ? 'text-red-600' :
                        alert.severity === 'Medium' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
                    <h5 className="font-medium text-sm text-gray-900">{alert.equipment}</h5>
                    <p className="text-xs text-gray-600">{alert.type}</p>
                    <p className="text-xs text-gray-700 mt-1">{alert.message}</p>
                    <div className="flex gap-1 mt-2">
                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                        Acknowledge
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Maintenance Schedule</CardTitle>
              <CardDescription className="text-xs">Upcoming maintenance and service</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-3">
                {maintenanceSchedule.map((maintenance, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={`text-xs ${
                        maintenance.priority === 'High' ? 'border-red-500 text-red-700' :
                        maintenance.priority === 'Medium' ? 'border-yellow-500 text-yellow-700' : 'border-blue-500 text-blue-700'
                      }`}>
                        {maintenance.priority}
                      </Badge>
                      <Badge className={`text-xs ${
                        maintenance.status === 'Scheduled' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}>
                        {maintenance.status}
                      </Badge>
                    </div>
                    <h5 className="font-medium text-sm text-gray-900">{maintenance.equipment}</h5>
                    <p className="text-xs text-gray-600">{maintenance.type}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      <p>Date: {maintenance.date}</p>
                      <p>Duration: {maintenance.duration}</p>
                      <p>Technician: {maintenance.technician}</p>
                    </div>
                    <Button size="sm" className="w-full mt-2 text-xs">
                      <Wrench className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Performance Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Equipment Online</span>
                <span className="text-xs font-medium">3/4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Avg Utilization</span>
                <span className="text-xs font-medium">73%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Studies Today</span>
                <span className="text-xs font-medium">323</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Active Alerts</span>
                <span className="text-xs font-medium text-red-600">3</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
