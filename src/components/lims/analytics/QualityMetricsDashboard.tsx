
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Clock,
  Settings,
  Download
} from 'lucide-react';

export const QualityMetricsDashboard = () => {
  const [selectedMetric, setSelectedMetric] = useState('overall');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const qualityOverview = {
    overallScore: 96.8,
    qcPassRate: 98.5,
    calibrationCompliance: 99.2,
    errorRate: 0.8,
    customerSatisfaction: 94.7,
    proficiencyTestScore: 97.3
  };

  const departmentQuality = [
    {
      department: 'Hematology',
      score: 99.2,
      qcPass: 99.8,
      errorRate: 0.2,
      status: 'excellent',
      trend: 'up',
      issues: 0
    },
    {
      department: 'Chemistry',
      score: 97.8,
      qcPass: 98.9,
      errorRate: 0.5,
      status: 'good',
      trend: 'up',
      issues: 2
    },
    {
      department: 'Immunology',
      score: 96.5,
      qcPass: 97.8,
      errorRate: 0.9,
      status: 'good',
      trend: 'stable',
      issues: 3
    },
    {
      department: 'Microbiology',
      score: 95.1,
      qcPass: 96.2,
      errorRate: 1.2,
      status: 'warning',
      trend: 'down',
      issues: 5
    },
    {
      department: 'Molecular',
      score: 94.8,
      qcPass: 95.9,
      errorRate: 1.5,
      status: 'warning',
      trend: 'stable',
      issues: 4
    }
  ];

  const qualityIndicators = [
    {
      indicator: 'Sample Rejection Rate',
      value: 2.1,
      target: '<2.5',
      status: 'good',
      trend: '-0.3',
      unit: '%'
    },
    {
      indicator: 'Turnaround Time Compliance',
      value: 94.8,
      target: '>95',
      status: 'warning',
      trend: '+1.2',
      unit: '%'
    },
    {
      indicator: 'Critical Value Notification',
      value: 98.7,
      target: '>98',
      status: 'excellent',
      trend: '+0.5',
      unit: '%'
    },
    {
      indicator: 'Equipment Downtime',
      value: 1.8,
      target: '<3',
      status: 'good',
      trend: '-0.4',
      unit: '%'
    },
    {
      indicator: 'Reagent Lot Tracking',
      value: 99.5,
      target: '>99',
      status: 'excellent',
      trend: '+0.2',
      unit: '%'
    },
    {
      indicator: 'Temperature Monitoring',
      value: 99.8,
      target: '>99.5',
      status: 'excellent',
      trend: '+0.1',
      unit: '%'
    }
  ];

  const proficiencyTesting = [
    {
      program: 'CAP Surveys',
      tests: 24,
      passed: 23,
      score: 95.8,
      lastUpdate: '2024-01-15',
      status: 'excellent'
    },
    {
      program: 'AAFP Proficiency',
      tests: 12,
      passed: 12,
      score: 100.0,
      lastUpdate: '2024-01-10',
      status: 'excellent'
    },
    {
      program: 'ACOG Quality',
      tests: 8,
      passed: 7,
      score: 87.5,
      lastUpdate: '2024-01-08',
      status: 'warning'
    }
  ];

  const correctionActions = [
    {
      id: 'CA001',
      issue: 'Hematology QC variance detected',
      severity: 'medium',
      status: 'in-progress',
      assignedTo: 'Sarah Johnson',
      dueDate: '2024-01-25',
      progress: 75
    },
    {
      id: 'CA002',
      issue: 'Chemistry calibration drift',
      severity: 'high',
      status: 'pending',
      assignedTo: 'Michael Chen',
      dueDate: '2024-01-22',
      progress: 25
    },
    {
      id: 'CA003',
      issue: 'Molecular contamination event',
      severity: 'high',
      status: 'completed',
      assignedTo: 'Lisa Wang',
      dueDate: '2024-01-20',
      progress: 100
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Quality Metrics Dashboard</h3>
          <p className="text-gray-600">Comprehensive quality assurance and performance monitoring</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configure Metrics
          </Button>
        </div>
      </div>

      {/* Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-green-900">{qualityOverview.overallScore}%</p>
            <p className="text-xs text-green-700">Overall Score</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-blue-900">{qualityOverview.qcPassRate}%</p>
            <p className="text-xs text-blue-700">QC Pass Rate</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Settings className="h-6 w-6 text-purple-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-purple-900">{qualityOverview.calibrationCompliance}%</p>
            <p className="text-xs text-purple-700">Calibration</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-red-900">{qualityOverview.errorRate}%</p>
            <p className="text-xs text-red-700">Error Rate</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-orange-900">{qualityOverview.customerSatisfaction}%</p>
            <p className="text-xs text-orange-700">Customer Satisfaction</p>
          </CardContent>
        </Card>
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-indigo-900">{qualityOverview.proficiencyTestScore}%</p>
            <p className="text-xs text-indigo-700">Proficiency Tests</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Quality Scores */}
        <Card>
          <CardHeader>
            <CardTitle>Department Quality Scores</CardTitle>
            <CardDescription>Quality performance by laboratory department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentQuality.map((dept, index) => (
                <div key={index} className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{dept.department}</h5>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${
                        dept.status === 'excellent' ? 'bg-green-500' :
                        dept.status === 'good' ? 'bg-blue-500' : 'bg-yellow-500'
                      } text-white`}>
                        {dept.status}
                      </Badge>
                      <span className="text-lg font-bold text-gray-900">{dept.score}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                    <div>
                      <p className="text-gray-600">QC Pass</p>
                      <p className="font-medium">{dept.qcPass}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Error Rate</p>
                      <p className="font-medium">{dept.errorRate}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Issues</p>
                      <p className="font-medium">{dept.issues}</p>
                    </div>
                  </div>
                  <Progress value={dept.score} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quality Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Quality Indicators</CardTitle>
            <CardDescription>Key performance indicators and compliance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {qualityIndicators.map((indicator, index) => (
                <div key={index} className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{indicator.indicator}</h5>
                    <Badge className={`text-xs ${
                      indicator.status === 'excellent' ? 'bg-green-500' :
                      indicator.status === 'good' ? 'bg-blue-500' : 'bg-yellow-500'
                    } text-white`}>
                      {indicator.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Current</p>
                      <p className="font-bold text-gray-900">{indicator.value}{indicator.unit}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Target</p>
                      <p className="font-medium">{indicator.target}{indicator.unit}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Trend</p>
                      <p className={`font-medium ${
                        indicator.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {indicator.trend}
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
        {/* Proficiency Testing */}
        <Card>
          <CardHeader>
            <CardTitle>Proficiency Testing Results</CardTitle>
            <CardDescription>External quality assessment program results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proficiencyTesting.map((program, index) => (
                <div key={index} className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{program.program}</h5>
                    <Badge className={`text-xs ${
                      program.status === 'excellent' ? 'bg-green-500' : 'bg-yellow-500'
                    } text-white`}>
                      {program.score}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Tests</p>
                      <p className="font-medium">{program.tests}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Passed</p>
                      <p className="font-medium">{program.passed}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Update</p>
                      <p className="font-medium">{program.lastUpdate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Corrective Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Corrective Actions</CardTitle>
            <CardDescription>Active quality improvement initiatives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {correctionActions.map((action, index) => (
                <div key={index} className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">{action.id}</h5>
                      <p className="text-sm text-gray-600">{action.issue}</p>
                    </div>
                    <Badge className={`text-xs ${
                      action.severity === 'high' ? 'bg-red-500' :
                      action.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    } text-white`}>
                      {action.severity}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                    <div>
                      <p className="text-gray-600">Assigned To</p>
                      <p className="font-medium">{action.assignedTo}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Due Date</p>
                      <p className="font-medium">{action.dueDate}</p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{action.progress}%</span>
                    </div>
                    <Progress value={action.progress} className="h-2" />
                  </div>
                  <Badge variant="outline" className={`text-xs ${
                    action.status === 'completed' ? 'border-green-500 text-green-700' :
                    action.status === 'in-progress' ? 'border-blue-500 text-blue-700' : 'border-yellow-500 text-yellow-700'
                  }`}>
                    {action.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
