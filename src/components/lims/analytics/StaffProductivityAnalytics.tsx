
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Target,
  Activity,
  BarChart3,
  Download,
  Settings
} from 'lucide-react';

export const StaffProductivityAnalytics = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('productivity');

  const productivityOverview = {
    overallEfficiency: 87.3,
    averageTestsPerHour: 12.8,
    staffUtilization: 82.5,
    workloadBalance: 78.9,
    performanceScore: 91.2,
    overtimePercentage: 8.4
  };

  const staffMetrics = [
    {
      name: 'Sarah Johnson',
      role: 'Senior Technologist',
      department: 'Chemistry',
      testsCompleted: 456,
      efficiency: 94.2,
      accuracy: 99.1,
      utilization: 88.5,
      overtime: 4.2
    },
    {
      name: 'Michael Chen',
      role: 'Lab Technician',
      department: 'Hematology',
      testsCompleted: 389,
      efficiency: 89.7,
      accuracy: 97.8,
      utilization: 85.3,
      overtime: 6.1
    },
    {
      name: 'Lisa Wang',
      role: 'Microbiologist',
      department: 'Microbiology',
      testsCompleted: 234,
      efficiency: 91.5,
      accuracy: 98.5,
      utilization: 79.2,
      overtime: 2.8
    },
    {
      name: 'David Rodriguez',
      role: 'Molecular Technologist',
      department: 'Molecular',
      testsCompleted: 178,
      efficiency: 86.3,
      accuracy: 96.7,
      utilization: 83.7,
      overtime: 12.4
    },
    {
      name: 'Emily Davis',
      role: 'Immunology Specialist',
      department: 'Immunology',
      testsCompleted: 298,
      efficiency: 88.9,
      accuracy: 98.2,
      utilization: 81.6,
      overtime: 7.3
    }
  ];

  const departmentProductivity = [
    {
      department: 'Chemistry',
      staff: 8,
      efficiency: 92.1,
      testsPerStaff: 15.3,
      utilization: 86.7,
      workloadBalance: 82.4,
      status: 'excellent'
    },
    {
      department: 'Hematology',
      staff: 6,
      efficiency: 88.7,
      testsPerStaff: 14.8,
      utilization: 84.2,
      workloadBalance: 79.8,
      status: 'good'
    },
    {
      department: 'Microbiology',
      staff: 5,
      efficiency: 85.4,
      testsPerStaff: 11.2,
      utilization: 78.9,
      workloadBalance: 75.6,
      status: 'warning'
    },
    {
      department: 'Immunology',
      staff: 4,
      efficiency: 87.3,
      testsPerStaff: 13.1,
      utilization: 82.1,
      workloadBalance: 77.3,
      status: 'good'
    },
    {
      department: 'Molecular',
      staff: 3,
      efficiency: 83.9,
      testsPerStaff: 9.8,
      utilization: 76.4,
      workloadBalance: 71.2,
      status: 'warning'
    }
  ];

  const workloadDistribution = [
    { shift: 'Day (7 AM - 3 PM)', staff: 18, workload: 65.2, efficiency: 91.3 },
    { shift: 'Evening (3 PM - 11 PM)', staff: 12, workload: 24.8, efficiency: 85.7 },
    { shift: 'Night (11 PM - 7 AM)', staff: 6, workload: 10.0, efficiency: 78.4 },
    { shift: 'Weekend', staff: 8, workload: 18.5, efficiency: 82.1 }
  ];

  const performanceKPIs = [
    {
      kpi: 'Tests per Hour',
      current: 12.8,
      target: 13.5,
      trend: '+0.4',
      status: 'improving'
    },
    {
      kpi: 'Error Rate',
      current: 1.2,
      target: '<1.5',
      trend: '-0.2',
      status: 'good'
    },
    {
      kpi: 'Rework Rate',
      current: 2.8,
      target: '<3.0',
      trend: '+0.1',
      status: 'stable'
    },
    {
      kpi: 'Training Hours',
      current: 4.2,
      target: '>4.0',
      trend: '+0.3',
      status: 'exceeding'
    }
  ];

  const skillsMatrix = [
    { skill: 'Chemistry Testing', proficiency: 94.2, staff: 12, gaps: 1 },
    { skill: 'Hematology Analysis', proficiency: 91.7, staff: 8, gaps: 2 },
    { skill: 'Microbiology Culture', proficiency: 87.3, staff: 6, gaps: 1 },
    { skill: 'Molecular Diagnostics', proficiency: 82.9, staff: 4, gaps: 3 },
    { skill: 'Quality Control', proficiency: 96.8, staff: 15, gaps: 0 },
    { skill: 'Equipment Maintenance', proficiency: 78.4, staff: 10, gaps: 4 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Staff Productivity Analytics</h3>
          <p className="text-gray-600">Performance monitoring and workforce optimization insights</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedDepartment} 
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Departments</option>
            <option value="chemistry">Chemistry</option>
            <option value="hematology">Hematology</option>
            <option value="microbiology">Microbiology</option>
            <option value="immunology">Immunology</option>
            <option value="molecular">Molecular</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Analytics
          </Button>
          <Button className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Performance Settings
          </Button>
        </div>
      </div>

      {/* Productivity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-blue-900">{productivityOverview.overallEfficiency}%</p>
            <p className="text-xs text-blue-700">Overall Efficiency</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-green-900">{productivityOverview.averageTestsPerHour}</p>
            <p className="text-xs text-green-700">Tests/Hour</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Activity className="h-6 w-6 text-purple-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-purple-900">{productivityOverview.staffUtilization}%</p>
            <p className="text-xs text-purple-700">Staff Utilization</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-orange-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-orange-900">{productivityOverview.workloadBalance}%</p>
            <p className="text-xs text-orange-700">Workload Balance</p>
          </CardContent>
        </Card>
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-indigo-900">{productivityOverview.performanceScore}%</p>
            <p className="text-xs text-indigo-700">Performance Score</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-red-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-red-900">{productivityOverview.overtimePercentage}%</p>
            <p className="text-xs text-red-700">Overtime</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Individual Staff Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Individual Staff Performance</CardTitle>
            <CardDescription>Performance metrics by staff member</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {staffMetrics.map((staff, index) => (
                <div key={index} className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">{staff.name}</h5>
                      <p className="text-sm text-gray-600">{staff.role} • {staff.department}</p>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{staff.efficiency}%</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm mb-2">
                    <div>
                      <p className="text-gray-600">Tests</p>
                      <p className="font-medium">{staff.testsCompleted}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Accuracy</p>
                      <p className="font-medium">{staff.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Utilization</p>
                      <p className="font-medium">{staff.utilization}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Overtime</p>
                      <p className={`font-medium ${staff.overtime > 10 ? 'text-red-600' : 'text-green-600'}`}>
                        {staff.overtime}%
                      </p>
                    </div>
                  </div>
                  <Progress value={staff.efficiency} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Productivity */}
        <Card>
          <CardHeader>
            <CardTitle>Department Productivity</CardTitle>
            <CardDescription>Performance comparison across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentProductivity.map((dept, index) => (
                <div key={index} className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">{dept.department}</h5>
                      <p className="text-sm text-gray-600">{dept.staff} staff members</p>
                    </div>
                    <Badge className={`text-xs ${
                      dept.status === 'excellent' ? 'bg-green-500' :
                      dept.status === 'good' ? 'bg-blue-500' : 'bg-yellow-500'
                    } text-white`}>
                      {dept.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                    <div>
                      <p className="text-gray-600">Efficiency</p>
                      <p className="font-medium">{dept.efficiency}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tests/Staff</p>
                      <p className="font-medium">{dept.testsPerStaff}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Utilization</p>
                      <p className="font-medium">{dept.utilization}%</p>
                    </div>
                  </div>
                  <Progress value={dept.efficiency} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workload Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Workload Distribution</CardTitle>
            <CardDescription>Work distribution across shifts and time periods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workloadDistribution.map((shift, index) => (
                <div key={index} className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{shift.shift}</h5>
                    <span className="text-sm font-medium text-gray-700">{shift.staff} staff</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                    <div>
                      <p className="text-gray-600">Workload</p>
                      <p className="font-medium">{shift.workload}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Efficiency</p>
                      <p className="font-medium">{shift.efficiency}%</p>
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                    <div 
                      className="bg-blue-500 h-3 rounded-full" 
                      style={{ width: `${shift.workload}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skills Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Skills & Competency Matrix</CardTitle>
            <CardDescription>Staff competency levels and skill gaps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillsMatrix.map((skill, index) => (
                <div key={index} className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{skill.skill}</h5>
                    <span className="text-sm font-medium text-gray-700">{skill.proficiency}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                    <div>
                      <p className="text-gray-600">Skilled Staff</p>
                      <p className="font-medium">{skill.staff}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Skill Gaps</p>
                      <p className={`font-medium ${skill.gaps > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {skill.gaps}
                      </p>
                    </div>
                  </div>
                  <Progress value={skill.proficiency} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance KPIs */}
      <Card>
        <CardHeader>
          <CardTitle>Performance KPIs</CardTitle>
          <CardDescription>Key performance indicators and benchmarks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceKPIs.map((kpi, index) => (
              <div key={index} className="p-4 border rounded">
                <div className="text-center">
                  <h5 className="font-medium text-gray-900 mb-2">{kpi.kpi}</h5>
                  <p className="text-2xl font-bold text-gray-900">{kpi.current}</p>
                  <p className="text-sm text-gray-600">Target: {kpi.target}</p>
                  <div className="mt-2">
                    <Badge className={`text-xs ${
                      kpi.status === 'exceeding' ? 'bg-green-500' :
                      kpi.status === 'good' ? 'bg-blue-500' :
                      kpi.status === 'improving' ? 'bg-purple-500' : 'bg-gray-500'
                    } text-white`}>
                      {kpi.status}
                    </Badge>
                  </div>
                  <p className={`text-sm mt-1 ${
                    kpi.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.trend} vs last period
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
