
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
  Award,
  AlertTriangle,
  BarChart3,
  PieChart,
  Filter,
  Download
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, PieChart as RechartsPieChart, Cell, LineChart, Line, CartesianGrid } from 'recharts';

export const AnalyticsOverview = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const kpiData = [
    { label: 'Total Employees', value: 1247, change: '+5.2%', trend: 'up' },
    { label: 'Employee Satisfaction', value: '87%', change: '+2.1%', trend: 'up' },
    { label: 'Avg Training Hours', value: 24.5, change: '+8.3%', trend: 'up' },
    { label: 'Turnover Rate', value: '3.2%', change: '-1.5%', trend: 'down' },
  ];

  const departmentData = [
    { name: 'ICU', employees: 156, satisfaction: 89, training: 28 },
    { name: 'Emergency', employees: 134, satisfaction: 85, training: 32 },
    { name: 'Surgery', employees: 98, satisfaction: 91, training: 35 },
    { name: 'General Ward', employees: 245, satisfaction: 84, training: 22 },
    { name: 'Pharmacy', employees: 67, satisfaction: 90, training: 18 },
    { name: 'Lab', employees: 89, satisfaction: 88, training: 25 },
  ];

  const performanceData = [
    { month: 'Jan', performance: 85, satisfaction: 82, training: 78 },
    { month: 'Feb', performance: 87, satisfaction: 84, training: 80 },
    { month: 'Mar', performance: 86, satisfaction: 85, training: 82 },
    { month: 'Apr', performance: 89, satisfaction: 87, training: 85 },
    { month: 'May', performance: 91, satisfaction: 88, training: 87 },
    { month: 'Jun', performance: 90, satisfaction: 87, training: 89 },
  ];

  const complianceData = [
    { name: 'Training Complete', value: 78, color: '#10b981' },
    { name: 'Pending', value: 15, color: '#f59e0b' },
    { name: 'Overdue', value: 7, color: '#ef4444' },
  ];

  const getTrendIcon = (trend) => {
    return trend === 'up' ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">HR Analytics Overview</h3>
          <p className="text-gray-600">Comprehensive insights into workforce metrics and trends</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{kpi.label}</p>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(kpi.trend)}
                  <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Department Overview
            </CardTitle>
            <CardDescription>Employee distribution and metrics by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentData.map((dept, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{dept.name}</h4>
                    <Badge variant="outline">{dept.employees} staff</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Satisfaction</p>
                      <div className="flex items-center gap-2">
                        <Progress value={dept.satisfaction} className="h-2 flex-1" />
                        <span className="font-medium">{dept.satisfaction}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600">Training Hours</p>
                      <p className="font-medium">{dept.training}h avg</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance Trends
            </CardTitle>
            <CardDescription>Monthly performance, satisfaction, and training metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                performance: { label: "Performance", color: "#3b82f6" },
                satisfaction: { label: "Satisfaction", color: "#10b981" },
                training: { label: "Training", color: "#f59e0b" }
              }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="performance" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="satisfaction" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="training" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Compliance Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Training Compliance
            </CardTitle>
            <CardDescription>Current training completion status across organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ChartContainer
                config={{
                  complete: { label: "Complete", color: "#10b981" },
                  pending: { label: "Pending", color: "#f59e0b" },
                  overdue: { label: "Overdue", color: "#ef4444" }
                }}
                className="h-48 w-48"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <RechartsPieChart data={complianceData} cx="50%" cy="50%" innerRadius={40} outerRadius={80}>
                      {complianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="mt-4 space-y-2">
              {complianceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Recent Alerts
            </CardTitle>
            <CardDescription>Critical HR notifications requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-800">Training Overdue</span>
                </div>
                <p className="text-sm text-red-700">15 employees have overdue mandatory training</p>
              </div>
              
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Certification Expiry</span>
                </div>
                <p className="text-sm text-yellow-700">8 certifications expiring within 30 days</p>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Performance Review</span>
                </div>
                <p className="text-sm text-blue-700">Q2 performance reviews ready for 45 employees</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
