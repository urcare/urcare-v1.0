
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertTriangle,
  Activity,
  ArrowRight,
  UserPlus,
  UserMinus
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface PatientFlowProps {
  dateRange: string;
  department: string;
}

const mockFlowData = [
  { time: '00:00', admissions: 2, discharges: 1, emergency: 4, total: 245 },
  { time: '04:00', admissions: 1, discharges: 0, emergency: 6, total: 250 },
  { time: '08:00', admissions: 8, discharges: 3, emergency: 12, total: 267 },
  { time: '12:00', admissions: 15, discharges: 8, emergency: 8, total: 282 },
  { time: '16:00', admissions: 12, discharges: 18, emergency: 6, total: 276 },
  { time: '20:00', admissions: 6, discharges: 12, emergency: 9, total: 279 }
];

const departmentFlowData = [
  { department: 'Emergency', patients: 67, capacity: 80, utilization: 84 },
  { department: 'ICU', patients: 24, capacity: 30, utilization: 80 },
  { department: 'Surgery', patients: 18, capacity: 25, utilization: 72 },
  { department: 'Cardiology', patients: 42, capacity: 50, utilization: 84 },
  { department: 'Pediatrics', patients: 28, capacity: 40, utilization: 70 },
  { department: 'Orthopedics', patients: 35, capacity: 45, utilization: 78 }
];

const admissionSourceData = [
  { source: 'Emergency', value: 45, color: '#ef4444' },
  { source: 'Referral', value: 30, color: '#3b82f6' },
  { source: 'Scheduled', value: 20, color: '#10b981' },
  { source: 'Transfer', value: 5, color: '#f59e0b' }
];

export const PatientFlowAnalytics = ({ dateRange, department }: PatientFlowProps) => {
  const [selectedMetric, setSelectedMetric] = useState('admissions');

  const chartConfig = {
    admissions: {
      label: "Admissions",
      color: "#3b82f6",
    },
    discharges: {
      label: "Discharges",
      color: "#10b981",
    },
    emergency: {
      label: "Emergency",
      color: "#ef4444",
    },
    total: {
      label: "Total Patients",
      color: "#8b5cf6",
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-blue-200 bg-blue-50">
          <div className="flex items-center gap-2">
            <UserPlus className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-600">142</p>
              <p className="text-sm text-gray-600">Admissions Today</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+12%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center gap-2">
            <UserMinus className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-600">128</p>
              <p className="text-sm text-gray-600">Discharges Today</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+8%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-red-600">23</p>
              <p className="text-sm text-gray-600">Emergency Cases</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="h-3 w-3 text-red-500" />
                <span className="text-xs text-red-600">-5%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-purple-200 bg-purple-50">
          <div className="flex items-center gap-2">
            <Clock className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-purple-600">23 min</p>
              <p className="text-sm text-gray-600">Avg Wait Time</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">-2 min</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Flow Over Time</CardTitle>
            <CardDescription>Hourly patient movement patterns</CardDescription>
            <div className="flex gap-2">
              {Object.keys(chartConfig).map((metric) => (
                <Button
                  key={metric}
                  variant={selectedMetric === metric ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMetric(metric)}
                >
                  {chartConfig[metric as keyof typeof chartConfig].label}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey={selectedMetric} 
                    stroke={chartConfig[selectedMetric as keyof typeof chartConfig].color} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admission Sources</CardTitle>
            <CardDescription>Distribution of patient admission sources</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={admissionSourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {admissionSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Patient Flow</CardTitle>
          <CardDescription>Current patient distribution across departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentFlowData.map((dept) => (
              <div key={dept.department} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">{dept.department}</span>
                  </div>
                  <Badge variant={dept.utilization > 85 ? "destructive" : dept.utilization > 70 ? "default" : "secondary"}>
                    {dept.utilization}% utilized
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{dept.patients}/{dept.capacity} patients</p>
                    <Progress value={dept.utilization} className="w-20 h-2" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
