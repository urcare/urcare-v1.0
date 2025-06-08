
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Users,
  Settings,
  Download,
  Calendar,
  Target,
  Activity,
  Zap
} from 'lucide-react';

export const LabEfficiencyDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');

  const efficiencyMetrics = {
    turnaroundTime: {
      average: '4.2 hours',
      target: '4.0 hours',
      trend: '+0.3h',
      status: 'warning'
    },
    throughput: {
      current: 1567,
      target: 1600,
      completion: 97.9,
      trend: '+12%'
    },
    bottlenecks: [
      { stage: 'Sample Processing', delay: '35 min', impact: 'high', samples: 89 },
      { stage: 'Centrifugation', delay: '12 min', impact: 'medium', samples: 34 },
      { stage: 'Result Review', delay: '28 min', impact: 'high', samples: 67 }
    ],
    staffEfficiency: {
      technicians: { available: 12, active: 11, efficiency: 91.7 },
      pathologists: { available: 4, active: 3, efficiency: 75.0 },
      support: { available: 8, active: 8, efficiency: 100.0 }
    }
  };

  const departmentMetrics = [
    {
      name: 'Chemistry',
      volume: 456,
      target: 500,
      tat: '3.8h',
      efficiency: 91.2,
      status: 'good',
      backlog: 23
    },
    {
      name: 'Hematology',
      volume: 289,
      target: 300,
      tat: '2.1h',
      efficiency: 96.3,
      status: 'excellent',
      backlog: 8
    },
    {
      name: 'Microbiology',
      volume: 178,
      target: 200,
      tat: '24.5h',
      efficiency: 89.0,
      status: 'good',
      backlog: 45
    },
    {
      name: 'Immunology',
      volume: 234,
      target: 250,
      tat: '6.2h',
      efficiency: 93.6,
      status: 'good',
      backlog: 12
    },
    {
      name: 'Molecular',
      volume: 67,
      target: 80,
      tat: '8.5h',
      efficiency: 83.8,
      status: 'warning',
      backlog: 18
    }
  ];

  const workflowStages = [
    { stage: 'Registration', samples: 245, avgTime: '2.3 min', efficiency: 98.2, issues: 0 },
    { stage: 'Collection', samples: 234, avgTime: '5.7 min', efficiency: 94.5, issues: 2 },
    { stage: 'Transport', samples: 229, avgTime: '12.4 min', efficiency: 87.3, issues: 5 },
    { stage: 'Processing', samples: 201, avgTime: '45.2 min', efficiency: 76.8, issues: 12 },
    { stage: 'Analysis', samples: 189, avgTime: '2.8 hrs', efficiency: 91.7, issues: 3 },
    { stage: 'Review', samples: 167, avgTime: '28.5 min', efficiency: 83.4, issues: 8 },
    { stage: 'Reporting', samples: 156, avgTime: '6.2 min', efficiency: 96.8, issues: 1 }
  ];

  const performanceAlerts = [
    {
      type: 'Turnaround Time',
      severity: 'high',
      message: 'Chemistry department TAT exceeding target by 15%',
      affectedSamples: 45,
      timestamp: '14:30'
    },
    {
      type: 'Bottleneck',
      severity: 'medium',
      message: 'Sample processing queue backup detected',
      affectedSamples: 89,
      timestamp: '13:45'
    },
    {
      type: 'Staff Efficiency',
      severity: 'low',
      message: 'Pathologist review capacity at 75%',
      affectedSamples: 23,
      timestamp: '12:15'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lab Efficiency Dashboard</h2>
          <p className="text-gray-600">Real-time performance monitoring and optimization insights</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedTimeframe} 
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configure KPIs
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-900">{efficiencyMetrics.turnaroundTime.average}</p>
                <p className="text-sm text-blue-700">Avg Turnaround Time</p>
                <p className="text-xs text-blue-600">Target: {efficiencyMetrics.turnaroundTime.target}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-900">{efficiencyMetrics.throughput.current}</p>
                <p className="text-sm text-green-700">Samples Processed</p>
                <p className="text-xs text-green-600">+{efficiencyMetrics.throughput.trend} vs yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-900">{efficiencyMetrics.bottlenecks.length}</p>
                <p className="text-sm text-red-700">Active Bottlenecks</p>
                <p className="text-xs text-red-600">Affecting {efficiencyMetrics.bottlenecks.reduce((sum, b) => sum + b.samples, 0)} samples</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-900">{efficiencyMetrics.throughput.completion}%</p>
                <p className="text-sm text-purple-700">Target Achievement</p>
                <p className="text-xs text-purple-600">{efficiencyMetrics.throughput.current}/{efficiencyMetrics.throughput.target} samples</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
          <CardDescription>Real-time efficiency metrics by laboratory department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentMetrics.map((dept, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                      <p className="text-sm text-gray-600">{dept.volume}/{dept.target} samples processed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${
                      dept.status === 'excellent' ? 'bg-green-500' :
                      dept.status === 'good' ? 'bg-blue-500' : 'bg-yellow-500'
                    } text-white`}>
                      {dept.status}
                    </Badge>
                    <span className="text-lg font-bold text-gray-900">{dept.efficiency}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Volume</p>
                    <p className="text-xl font-bold text-blue-600">{dept.volume}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">TAT</p>
                    <p className="text-xl font-bold text-purple-600">{dept.tat}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Efficiency</p>
                    <p className="text-xl font-bold text-green-600">{dept.efficiency}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Backlog</p>
                    <p className={`text-xl font-bold ${dept.backlog > 30 ? 'text-red-600' : 'text-orange-600'}`}>{dept.backlog}</p>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress to Target</span>
                    <span>{Math.round((dept.volume / dept.target) * 100)}%</span>
                  </div>
                  <Progress value={(dept.volume / dept.target) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workflow Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Stage Analysis</CardTitle>
            <CardDescription>Performance metrics for each processing stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workflowStages.map((stage, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      stage.efficiency >= 95 ? 'bg-green-500' :
                      stage.efficiency >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <h5 className="font-medium text-gray-900">{stage.stage}</h5>
                      <p className="text-sm text-gray-600">{stage.samples} samples • {stage.avgTime} avg</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{stage.efficiency}%</p>
                    {stage.issues > 0 && (
                      <p className="text-xs text-red-600">{stage.issues} issues</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottleneck Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Current Bottlenecks</CardTitle>
            <CardDescription>Identified performance constraints and delays</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {efficiencyMetrics.bottlenecks.map((bottleneck, index) => (
                <div key={index} className={`border-l-4 p-4 rounded ${
                  bottleneck.impact === 'high' ? 'border-l-red-500 bg-red-50' :
                  bottleneck.impact === 'medium' ? 'border-l-yellow-500 bg-yellow-50' : 'border-l-blue-500 bg-blue-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{bottleneck.stage}</h4>
                    <Badge className={`${
                      bottleneck.impact === 'high' ? 'bg-red-500' :
                      bottleneck.impact === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    } text-white text-xs`}>
                      {bottleneck.impact} impact
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">Delay: <span className="font-semibold">{bottleneck.delay}</span></p>
                  <p className="text-sm text-gray-600">Affecting {bottleneck.samples} samples</p>
                  <Button size="sm" variant="outline" className="mt-2">
                    <Zap className="h-4 w-4 mr-1" />
                    Optimize
                  </Button>
                </div>
              ))}
            </div>
            
            {/* Staff Efficiency */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Staff Efficiency</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Technicians ({efficiencyMetrics.staffEfficiency.technicians.active}/{efficiencyMetrics.staffEfficiency.technicians.available})</span>
                  <span className="font-medium">{efficiencyMetrics.staffEfficiency.technicians.efficiency}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pathologists ({efficiencyMetrics.staffEfficiency.pathologists.active}/{efficiencyMetrics.staffEfficiency.pathologists.available})</span>
                  <span className="font-medium">{efficiencyMetrics.staffEfficiency.pathologists.efficiency}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Support Staff ({efficiencyMetrics.staffEfficiency.support.active}/{efficiencyMetrics.staffEfficiency.support.available})</span>
                  <span className="font-medium">{efficiencyMetrics.staffEfficiency.support.efficiency}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Alerts</CardTitle>
          <CardDescription>Real-time notifications about efficiency issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {performanceAlerts.map((alert, index) => (
              <div key={index} className={`flex items-center gap-4 p-3 border-l-4 rounded ${
                alert.severity === 'high' ? 'border-l-red-500 bg-red-50' :
                alert.severity === 'medium' ? 'border-l-yellow-500 bg-yellow-50' : 'border-l-blue-500 bg-blue-50'
              }`}>
                <AlertTriangle className={`h-5 w-5 ${
                  alert.severity === 'high' ? 'text-red-600' :
                  alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                }`} />
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{alert.type}</h5>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.affectedSamples} samples affected • {alert.timestamp}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Acknowledge
                  </Button>
                  <Button size="sm">
                    <Zap className="h-4 w-4 mr-1" />
                    Resolve
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
