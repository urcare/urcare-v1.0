
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  Activity, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Download,
  Wrench
} from 'lucide-react';

export const EquipmentUtilizationDashboard = () => {
  const [selectedEquipment, setSelectedEquipment] = useState('all');
  const [selectedView, setSelectedView] = useState('utilization');

  const utilizationOverview = {
    averageUtilization: 78.9,
    activeEquipment: 23,
    maintenanceAlerts: 4,
    downtimePercentage: 3.2,
    costPerTest: 12.45,
    maintenanceCost: 89400
  };

  const equipmentStatus = [
    {
      name: 'Chemistry Analyzer - CA01',
      type: 'Chemistry',
      utilization: 85.4,
      uptime: 97.8,
      testsPerDay: 245,
      costPerTest: 8.50,
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-02-15',
      status: 'operational',
      alerts: 0
    },
    {
      name: 'Hematology Analyzer - HA02',
      type: 'Hematology',
      utilization: 92.1,
      uptime: 99.2,
      testsPerDay: 189,
      costPerTest: 6.25,
      lastMaintenance: '2024-01-08',
      nextMaintenance: '2024-02-08',
      status: 'operational',
      alerts: 0
    },
    {
      name: 'Immunoassay System - IA03',
      type: 'Immunology',
      utilization: 76.8,
      uptime: 94.5,
      testsPerDay: 156,
      costPerTest: 15.75,
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-01-25',
      status: 'warning',
      alerts: 2
    },
    {
      name: 'PCR Analyzer - PCR04',
      type: 'Molecular',
      utilization: 68.3,
      uptime: 91.7,
      testsPerDay: 87,
      costPerTest: 28.90,
      lastMaintenance: '2024-01-12',
      nextMaintenance: '2024-02-12',
      status: 'operational',
      alerts: 1
    },
    {
      name: 'Microbiology System - MB05',
      type: 'Microbiology',
      utilization: 71.5,
      uptime: 88.9,
      testsPerDay: 123,
      costPerTest: 18.45,
      lastMaintenance: '2024-01-18',
      nextMaintenance: '2024-01-30',
      status: 'maintenance',
      alerts: 3
    }
  ];

  const maintenanceSchedule = [
    {
      equipment: 'Immunoassay System - IA03',
      type: 'Preventive Maintenance',
      scheduledDate: '2024-01-25',
      estimatedDuration: 4,
      technician: 'Service Team A',
      priority: 'high',
      cost: 2500
    },
    {
      equipment: 'Microbiology System - MB05',
      type: 'Calibration',
      scheduledDate: '2024-01-30',
      estimatedDuration: 2,
      technician: 'Internal Team',
      priority: 'medium',
      cost: 500
    },
    {
      equipment: 'Chemistry Analyzer - CA01',
      type: 'Software Update',
      scheduledDate: '2024-02-05',
      estimatedDuration: 1,
      technician: 'IT Support',
      priority: 'low',
      cost: 0
    },
    {
      equipment: 'PCR Analyzer - PCR04',
      type: 'Component Replacement',
      scheduledDate: '2024-02-12',
      estimatedDuration: 6,
      technician: 'Service Team B',
      priority: 'high',
      cost: 4200
    }
  ];

  const costAnalysis = {
    totalOperatingCost: 156780,
    maintenanceCost: 34560,
    reagentCost: 89450,
    laborCost: 32770,
    costBreakdown: [
      { category: 'Reagents', cost: 89450, percentage: 57.1 },
      { category: 'Maintenance', cost: 34560, percentage: 22.0 },
      { category: 'Labor', cost: 32770, percentage: 20.9 }
    ]
  };

  const performanceMetrics = [
    {
      metric: 'Overall Equipment Effectiveness',
      value: 82.4,
      target: 85.0,
      trend: '+2.1',
      status: 'improving'
    },
    {
      metric: 'Mean Time Between Failures',
      value: 45.2,
      target: 50.0,
      trend: '+3.8',
      status: 'improving'
    },
    {
      metric: 'Mean Time To Repair',
      value: 2.8,
      target: '<3.0',
      trend: '-0.5',
      status: 'good'
    },
    {
      metric: 'Planned Maintenance Ratio',
      value: 87.5,
      target: 90.0,
      trend: '+1.2',
      status: 'improving'
    }
  ];

  const utilizationTrends = [
    { time: '6:00', utilization: 35.2 },
    { time: '8:00', utilization: 68.9 },
    { time: '10:00', utilization: 85.4 },
    { time: '12:00', utilization: 92.7 },
    { time: '14:00', utilization: 89.3 },
    { time: '16:00', utilization: 76.8 },
    { time: '18:00', utilization: 54.1 },
    { time: '20:00', utilization: 28.6 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Equipment Utilization Dashboard</h3>
          <p className="text-gray-600">Equipment performance monitoring and optimization analytics</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedEquipment} 
            onChange={(e) => setSelectedEquipment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Equipment</option>
            <option value="chemistry">Chemistry</option>
            <option value="hematology">Hematology</option>
            <option value="immunology">Immunology</option>
            <option value="molecular">Molecular</option>
            <option value="microbiology">Microbiology</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configure Alerts
          </Button>
        </div>
      </div>

      {/* Utilization Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Activity className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-blue-900">{utilizationOverview.averageUtilization}%</p>
            <p className="text-xs text-blue-700">Avg Utilization</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-green-900">{utilizationOverview.activeEquipment}</p>
            <p className="text-xs text-green-700">Active Equipment</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-red-900">{utilizationOverview.maintenanceAlerts}</p>
            <p className="text-xs text-red-700">Maintenance Alerts</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-orange-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-orange-900">{utilizationOverview.downtimePercentage}%</p>
            <p className="text-xs text-orange-700">Downtime</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 text-purple-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-purple-900">${utilizationOverview.costPerTest}</p>
            <p className="text-xs text-purple-700">Cost per Test</p>
          </CardContent>
        </Card>
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="p-4 text-center">
            <Wrench className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-indigo-900">${utilizationOverview.maintenanceCost.toLocaleString()}</p>
            <p className="text-xs text-indigo-700">Maintenance Cost</p>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Status */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment Status & Performance</CardTitle>
          <CardDescription>Real-time status and utilization metrics for all equipment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {equipmentStatus.map((equipment, index) => (
              <div key={index} className={`border rounded-lg p-4 ${
                equipment.status === 'operational' ? 'border-green-200 bg-green-50' :
                equipment.status === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{equipment.name}</h4>
                    <p className="text-sm text-gray-600">{equipment.type} • {equipment.testsPerDay} tests/day</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${
                      equipment.status === 'operational' ? 'bg-green-500' :
                      equipment.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    } text-white`}>
                      {equipment.status}
                    </Badge>
                    {equipment.alerts > 0 && (
                      <Badge variant="outline" className="text-xs border-red-500 text-red-700">
                        {equipment.alerts} alerts
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Utilization</p>
                    <p className="text-xl font-bold text-gray-900">{equipment.utilization}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Uptime</p>
                    <p className="text-xl font-bold text-gray-900">{equipment.uptime}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cost/Test</p>
                    <p className="text-xl font-bold text-gray-900">${equipment.costPerTest}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Next Maintenance</p>
                    <p className="text-sm font-medium text-gray-900">{equipment.nextMaintenance}</p>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Utilization</span>
                    <span>{equipment.utilization}%</span>
                  </div>
                  <Progress value={equipment.utilization} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Maintenance</CardTitle>
            <CardDescription>Scheduled maintenance activities and costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceSchedule.map((maintenance, index) => (
                <div key={index} className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">{maintenance.equipment}</h5>
                      <p className="text-sm text-gray-600">{maintenance.type}</p>
                    </div>
                    <Badge className={`text-xs ${
                      maintenance.priority === 'high' ? 'bg-red-500' :
                      maintenance.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    } text-white`}>
                      {maintenance.priority}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Scheduled Date</p>
                      <p className="font-medium">{maintenance.scheduledDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p className="font-medium">{maintenance.estimatedDuration} hours</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Technician</p>
                      <p className="font-medium">{maintenance.technician}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Cost</p>
                      <p className="font-medium">${maintenance.cost.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key equipment performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{metric.metric}</h5>
                    <Badge className={`text-xs ${
                      metric.status === 'good' ? 'bg-green-500' :
                      metric.status === 'improving' ? 'bg-blue-500' : 'bg-yellow-500'
                    } text-white`}>
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Current</p>
                      <p className="font-bold text-gray-900">{metric.value}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Target</p>
                      <p className="font-medium">{metric.target}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Trend</p>
                      <p className={`font-medium ${
                        metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.trend}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Analysis</CardTitle>
            <CardDescription>Equipment operating cost breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Total Operating Cost</h4>
                <p className="text-3xl font-bold text-gray-900">${costAnalysis.totalOperatingCost.toLocaleString()}</p>
                <p className="text-sm text-gray-600">per month</p>
              </div>
              
              <div className="space-y-3">
                {costAnalysis.costBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h5 className="font-medium text-gray-900">{item.category}</h5>
                      <p className="text-sm text-gray-600">{item.percentage}% of total</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${item.cost.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Utilization Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Utilization Trends</CardTitle>
            <CardDescription>Equipment usage patterns throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {utilizationTrends.map((trend, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-12">{trend.time}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div 
                      className="bg-blue-500 h-4 rounded-full" 
                      style={{ width: `${trend.utilization}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {trend.utilization}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
