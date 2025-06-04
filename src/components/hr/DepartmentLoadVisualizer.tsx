
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Users, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity,
  Clock,
  Target
} from 'lucide-react';

export const DepartmentLoadVisualizer = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');
  const [selectedMetric, setSelectedMetric] = useState('workload');

  const departmentData = [
    {
      id: 'icu',
      name: 'Intensive Care Unit',
      totalStaff: 24,
      activeStaff: 18,
      patientLoad: 45,
      capacity: 50,
      workloadScore: 85,
      efficiency: 78,
      overtime: 24,
      avgExperience: 4.2,
      criticalAlerts: 3,
      trends: {
        workload: 'up',
        efficiency: 'down',
        staffing: 'stable'
      }
    },
    {
      id: 'emergency',
      name: 'Emergency Department',
      totalStaff: 18,
      activeStaff: 16,
      patientLoad: 62,
      capacity: 80,
      workloadScore: 78,
      efficiency: 82,
      overtime: 16,
      avgExperience: 3.8,
      criticalAlerts: 1,
      trends: {
        workload: 'stable',
        efficiency: 'up',
        staffing: 'down'
      }
    },
    {
      id: 'surgery',
      name: 'Surgery Department',
      totalStaff: 15,
      activeStaff: 12,
      patientLoad: 18,
      capacity: 25,
      workloadScore: 65,
      efficiency: 88,
      overtime: 8,
      avgExperience: 5.1,
      criticalAlerts: 0,
      trends: {
        workload: 'down',
        efficiency: 'up',
        staffing: 'stable'
      }
    },
    {
      id: 'general',
      name: 'General Ward',
      totalStaff: 32,
      activeStaff: 28,
      patientLoad: 85,
      capacity: 100,
      workloadScore: 55,
      efficiency: 75,
      overtime: 12,
      avgExperience: 3.5,
      criticalAlerts: 2,
      trends: {
        workload: 'stable',
        efficiency: 'stable',
        staffing: 'up'
      }
    },
    {
      id: 'pediatric',
      name: 'Pediatric Ward',
      totalStaff: 16,
      activeStaff: 14,
      patientLoad: 28,
      capacity: 35,
      workloadScore: 60,
      efficiency: 85,
      overtime: 6,
      avgExperience: 4.0,
      criticalAlerts: 0,
      trends: {
        workload: 'down',
        efficiency: 'up',
        staffing: 'stable'
      }
    }
  ];

  const getWorkloadColor = (score) => {
    if (score >= 80) return 'text-red-600 bg-red-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getEfficiencyColor = (score) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
  };

  const getCapacityUtilization = (current, capacity) => {
    return Math.round((current / capacity) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Department Load Visualizer</h3>
          <p className="text-gray-600">Real-time workload analysis and capacity utilization</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button>
            <Activity className="w-4 h-4 mr-2" />
            Real-time View
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">105</div>
                <div className="text-sm text-gray-600">Total Active Staff</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">78%</div>
                <div className="text-sm text-gray-600">Avg Efficiency</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">66h</div>
                <div className="text-sm text-gray-600">Total Overtime</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">6</div>
                <div className="text-sm text-gray-600">Critical Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            Department Workload Comparison
          </CardTitle>
          <CardDescription>Workload distribution and capacity utilization across departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentData.map((dept) => (
              <div key={dept.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{dept.name}</h4>
                    <p className="text-sm text-gray-600">
                      {dept.activeStaff}/{dept.totalStaff} staff active
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Badge className={getWorkloadColor(dept.workloadScore)}>
                      Workload: {dept.workloadScore}%
                    </Badge>
                    <Badge className={getEfficiencyColor(dept.efficiency)}>
                      Efficiency: {dept.efficiency}%
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Patient Capacity</span>
                      <span>{getCapacityUtilization(dept.patientLoad, dept.capacity)}%</span>
                    </div>
                    <Progress value={getCapacityUtilization(dept.patientLoad, dept.capacity)} className="h-2" />
                    <div className="text-xs text-gray-500 mt-1">
                      {dept.patientLoad}/{dept.capacity} patients
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Staff Utilization</span>
                      <span>{Math.round((dept.activeStaff / dept.totalStaff) * 100)}%</span>
                    </div>
                    <Progress value={(dept.activeStaff / dept.totalStaff) * 100} className="h-2" />
                    <div className="text-xs text-gray-500 mt-1">
                      {dept.activeStaff}/{dept.totalStaff} staff
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Workload Intensity</span>
                      <span>{dept.workloadScore}%</span>
                    </div>
                    <Progress value={dept.workloadScore} className="h-2" />
                    <div className="text-xs text-gray-500 mt-1">
                      {dept.overtime}h overtime this week
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      {getTrendIcon(dept.trends.workload)}
                      <span>Workload</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(dept.trends.efficiency)}
                      <span>Efficiency</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(dept.trends.staffing)}
                      <span>Staffing</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {dept.criticalAlerts > 0 && (
                      <Badge className="bg-red-100 text-red-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {dept.criticalAlerts} alerts
                      </Badge>
                    )}
                    <span className="text-sm text-gray-600">
                      Avg exp: {dept.avgExperience}y
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Load Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Workload Distribution</CardTitle>
            <CardDescription>Current workload across all departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentData.map((dept) => (
                <div key={dept.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{dept.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          dept.workloadScore >= 80 ? 'bg-red-500' :
                          dept.workloadScore >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${dept.workloadScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{dept.workloadScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Efficiency Metrics</CardTitle>
            <CardDescription>Department efficiency and performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentData.map((dept) => (
                <div key={dept.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{dept.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          dept.efficiency >= 85 ? 'bg-green-500' :
                          dept.efficiency >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${dept.efficiency}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{dept.efficiency}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
          <CardDescription>Automated suggestions for workload optimization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-800">Critical: ICU Overload</span>
              </div>
              <p className="text-sm text-red-700">
                ICU workload at 85% capacity. Recommend immediate staff reallocation from General Ward.
              </p>
            </div>
            
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Warning: Emergency Staffing</span>
              </div>
              <p className="text-sm text-yellow-700">
                Emergency department showing 16% decrease in staffing. Consider overtime approval.
              </p>
            </div>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800">Opportunity: Surgery Efficiency</span>
              </div>
              <p className="text-sm text-green-700">
                Surgery department showing excellent efficiency (88%). Consider cross-training opportunities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
