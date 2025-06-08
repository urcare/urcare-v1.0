
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Clock, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Award,
  AlertCircle,
  UserCheck,
  Timer,
  Target
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface StaffProductivityProps {
  dateRange: string;
  department: string;
}

const mockProductivityData = [
  { hour: '08:00', doctors: 45, nurses: 120, support: 80, utilization: 85 },
  { hour: '10:00', doctors: 50, nurses: 130, support: 85, utilization: 92 },
  { hour: '12:00', doctors: 48, nurses: 125, support: 82, utilization: 88 },
  { hour: '14:00', doctors: 52, nurses: 135, support: 90, utilization: 95 },
  { hour: '16:00', doctors: 46, nurses: 128, support: 85, utilization: 89 },
  { hour: '18:00', doctors: 42, nurses: 115, support: 75, utilization: 82 }
];

const departmentStaffData = [
  { department: 'Emergency', doctors: 12, nurses: 35, support: 15, efficiency: 92, workload: 'High' },
  { department: 'ICU', doctors: 8, nurses: 25, support: 10, efficiency: 88, workload: 'High' },
  { department: 'Surgery', doctors: 15, nurses: 20, support: 12, efficiency: 85, workload: 'Medium' },
  { department: 'Cardiology', doctors: 10, nurses: 18, support: 8, efficiency: 90, workload: 'Medium' },
  { department: 'Pediatrics', doctors: 8, nurses: 22, support: 10, efficiency: 87, workload: 'Medium' },
  { department: 'Orthopedics', doctors: 6, nurses: 15, support: 8, efficiency: 83, workload: 'Low' }
];

const performanceMetrics = [
  { metric: 'Patient Care', value: 92 },
  { metric: 'Documentation', value: 88 },
  { metric: 'Communication', value: 90 },
  { metric: 'Efficiency', value: 85 },
  { metric: 'Compliance', value: 95 },
  { metric: 'Innovation', value: 78 }
];

const topPerformers = [
  { name: 'Dr. Sarah Johnson', department: 'Cardiology', score: 96, patients: 28, rating: 4.9 },
  { name: 'Nurse Michael Chen', department: 'ICU', score: 94, patients: 45, rating: 4.8 },
  { name: 'Dr. Priya Sharma', department: 'Emergency', score: 93, patients: 52, rating: 4.7 },
  { name: 'Nurse Lisa Wang', department: 'Surgery', score: 91, patients: 32, rating: 4.8 },
  { name: 'Dr. Robert Kim', department: 'Pediatrics', score: 90, patients: 38, rating: 4.6 }
];

export const StaffProductivityAnalytics = ({ dateRange, department }: StaffProductivityProps) => {
  const [selectedMetric, setSelectedMetric] = useState('utilization');

  const chartConfig = {
    doctors: {
      label: "Doctors",
      color: "#3b82f6",
    },
    nurses: {
      label: "Nurses",
      color: "#10b981",
    },
    support: {
      label: "Support Staff",
      color: "#f59e0b",
    },
    utilization: {
      label: "Utilization %",
      color: "#8b5cf6",
    },
  };

  const getWorkloadColor = (workload: string) => {
    switch (workload) {
      case 'High': return 'bg-red-500 text-white';
      case 'Medium': return 'bg-yellow-500 text-white';
      case 'Low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-blue-200 bg-blue-50">
          <div className="flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-600">342</p>
              <p className="text-sm text-gray-600">Active Staff</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+5%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-600">89%</p>
              <p className="text-sm text-gray-600">Avg Utilization</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+3%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-purple-200 bg-purple-50">
          <div className="flex items-center gap-2">
            <Clock className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-purple-600">7.8h</p>
              <p className="text-sm text-gray-600">Avg Work Hours</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="h-3 w-3 text-red-500" />
                <span className="text-xs text-red-600">-0.2h</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-orange-200 bg-orange-50">
          <div className="flex items-center gap-2">
            <Target className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold text-orange-600">4.7</p>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+0.1</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Staff Utilization Trends</CardTitle>
            <CardDescription>Hourly staff allocation and utilization rates</CardDescription>
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
                <LineChart data={mockProductivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
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
            <CardTitle>Performance Radar</CardTitle>
            <CardDescription>Overall staff performance across key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={performanceMetrics}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Staff Overview</CardTitle>
            <CardDescription>Staff allocation and efficiency by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentStaffData.map((dept) => (
                <div key={dept.department} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{dept.department}</span>
                      <Badge className={getWorkloadColor(dept.workload)}>
                        {dept.workload}
                      </Badge>
                    </div>
                    <Badge variant="outline">
                      {dept.efficiency}% efficiency
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-blue-600 font-bold">{dept.doctors}</p>
                      <p className="text-gray-500">Doctors</p>
                    </div>
                    <div className="text-center">
                      <p className="text-green-600 font-bold">{dept.nurses}</p>
                      <p className="text-gray-500">Nurses</p>
                    </div>
                    <div className="text-center">
                      <p className="text-orange-600 font-bold">{dept.support}</p>
                      <p className="text-gray-500">Support</p>
                    </div>
                  </div>
                  <Progress value={dept.efficiency} className="mt-3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Highest rated staff members this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.map((performer, index) => (
                <div key={performer.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-8 h-8 flex items-center justify-center p-0">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium">{performer.name}</p>
                      <p className="text-sm text-gray-500">{performer.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{performer.score}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {performer.patients} patients • ⭐ {performer.rating}
                    </p>
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
