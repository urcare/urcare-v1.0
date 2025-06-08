
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  CheckCircle, 
  Settings, 
  BarChart3,
  Calendar,
  TrendingUp,
  TrendingDown,
  Target,
  Wrench
} from 'lucide-react';

export const QualityControl = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const qcMetrics = {
    passRate: 98.5,
    controlsRun: 156,
    failedControls: 3,
    equipmentCalibrated: 23,
    pendingMaintenance: 2,
    outOfRangeAlerts: 7
  };

  const equipmentStatus = [
    {
      name: 'Chemistry Analyzer-01',
      model: 'ChemMax Pro 5000',
      status: 'operational',
      lastCalibration: '2024-01-19',
      nextMaintenance: '2024-02-15',
      qcStatus: 'passed',
      controlsToday: 12,
      uptime: 99.2
    },
    {
      name: 'Hematology Analyzer-02',
      model: 'HemaCount Elite',
      status: 'warning',
      lastCalibration: '2024-01-20',
      nextMaintenance: '2024-01-25',
      qcStatus: 'failed',
      controlsToday: 8,
      uptime: 97.8
    },
    {
      name: 'Immunoassay-03',
      model: 'ImmunoLite 2000',
      status: 'operational',
      lastCalibration: '2024-01-18',
      nextMaintenance: '2024-02-01',
      qcStatus: 'passed',
      controlsToday: 15,
      uptime: 98.9
    },
    {
      name: 'Microbiology Incubator-04',
      model: 'BioGrow 300',
      status: 'maintenance',
      lastCalibration: '2024-01-15',
      nextMaintenance: '2024-01-21',
      qcStatus: 'pending',
      controlsToday: 0,
      uptime: 0
    }
  ];

  const controlResults = [
    {
      test: 'Glucose Control',
      level: 'Level 1',
      target: 95,
      result: 97.2,
      range: '90-100',
      status: 'in_range',
      timestamp: '08:30',
      analyzer: 'Chemistry-01'
    },
    {
      test: 'Hemoglobin Control',
      level: 'Level 2',
      target: 14.5,
      result: 15.8,
      range: '13.0-16.0',
      status: 'out_of_range',
      timestamp: '08:15',
      analyzer: 'Hematology-02'
    },
    {
      test: 'Troponin Control',
      level: 'Level 3',
      target: 0.05,
      result: 0.048,
      range: '0.04-0.06',
      status: 'in_range',
      timestamp: '07:45',
      analyzer: 'Immunoassay-03'
    },
    {
      test: 'Cholesterol Control',
      level: 'Level 1',
      target: 200,
      result: 205.5,
      range: '190-210',
      status: 'in_range',
      timestamp: '07:30',
      analyzer: 'Chemistry-01'
    }
  ];

  const maintenanceAlerts = [
    {
      equipment: 'Hematology Analyzer-02',
      type: 'Calibration Required',
      priority: 'high',
      dueDate: '2024-01-21',
      description: 'Daily calibration overdue'
    },
    {
      equipment: 'Chemistry Analyzer-01',
      type: 'Preventive Maintenance',
      priority: 'medium',
      dueDate: '2024-01-25',
      description: 'Monthly maintenance approaching'
    },
    {
      equipment: 'Centrifuge-05',
      type: 'Temperature Check',
      priority: 'low',
      dueDate: '2024-01-22',
      description: 'Weekly temperature verification'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quality Control</h2>
          <p className="text-gray-600">Monitor equipment performance and quality control metrics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule QC
          </Button>
          <Button className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Run Controls
          </Button>
        </div>
      </div>

      {/* QC Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{qcMetrics.passRate}%</p>
            <p className="text-sm text-green-700">QC Pass Rate</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{qcMetrics.controlsRun}</p>
            <p className="text-sm text-blue-700">Controls Run</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">{qcMetrics.failedControls}</p>
            <p className="text-sm text-red-700">Failed Controls</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Settings className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{qcMetrics.equipmentCalibrated}</p>
            <p className="text-sm text-purple-700">Equipment Calibrated</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <Wrench className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-900">{qcMetrics.pendingMaintenance}</p>
            <p className="text-sm text-yellow-700">Pending Maintenance</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-900">{qcMetrics.outOfRangeAlerts}</p>
            <p className="text-sm text-orange-700">Out of Range Alerts</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment Status */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment Status</CardTitle>
            <CardDescription>Current status and performance of laboratory equipment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {equipmentStatus.map((equipment, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{equipment.name}</h4>
                      <p className="text-sm text-gray-600">{equipment.model}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${
                        equipment.status === 'operational' ? 'bg-green-500' :
                        equipment.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      } text-white`}>
                        {equipment.status}
                      </Badge>
                      <Badge className={`${
                        equipment.qcStatus === 'passed' ? 'bg-green-500' :
                        equipment.qcStatus === 'failed' ? 'bg-red-500' : 'bg-gray-500'
                      } text-white`}>
                        QC {equipment.qcStatus}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-600">Last Calibration</p>
                      <p className="font-medium">{equipment.lastCalibration}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Next Maintenance</p>
                      <p className="font-medium">{equipment.nextMaintenance}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Controls Today</p>
                      <p className="font-medium">{equipment.controlsToday}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Uptime</p>
                      <p className="font-medium">{equipment.uptime}%</p>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Uptime</span>
                      <span>{equipment.uptime}%</span>
                    </div>
                    <Progress value={equipment.uptime} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Control Results */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Control Results</CardTitle>
            <CardDescription>Latest quality control test results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {controlResults.map((control, index) => (
                <div key={index} className={`p-3 border rounded-lg ${
                  control.status === 'out_of_range' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">{control.test}</h5>
                      <p className="text-sm text-gray-600">{control.level} • {control.analyzer}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {control.status === 'in_range' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-xs text-gray-500">{control.timestamp}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Target</p>
                      <p className="font-medium">{control.target}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Result</p>
                      <p className={`font-medium ${
                        control.status === 'out_of_range' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {control.result}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Range</p>
                      <p className="font-medium">{control.range}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Alerts</CardTitle>
          <CardDescription>Upcoming calibrations and maintenance requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {maintenanceAlerts.map((alert, index) => (
              <div key={index} className={`flex items-center gap-4 p-3 border-l-4 rounded ${
                alert.priority === 'high' ? 'border-l-red-500 bg-red-50' :
                alert.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' : 'border-l-blue-500 bg-blue-50'
              }`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-medium text-gray-900">{alert.type}</h5>
                    <Badge variant="outline" className={`text-xs ${
                      alert.priority === 'high' ? 'border-red-500 text-red-700' :
                      alert.priority === 'medium' ? 'border-yellow-500 text-yellow-700' : 'border-blue-500 text-blue-700'
                    }`}>
                      {alert.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{alert.equipment}</p>
                  <p className="text-sm text-gray-500">{alert.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Due: {alert.dueDate}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Schedule
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
