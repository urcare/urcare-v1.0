
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Bed, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Users,
  Activity,
  MapPin
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface BedUtilizationProps {
  dateRange: string;
  department: string;
}

const mockBedData = [
  { time: '00:00', occupied: 245, total: 300, icu: 28, general: 180, emergency: 37 },
  { time: '06:00', occupied: 258, total: 300, icu: 29, general: 192, emergency: 37 },
  { time: '12:00', occupied: 275, total: 300, icu: 30, general: 205, emergency: 40 },
  { time: '18:00', occupied: 267, total: 300, icu: 29, general: 198, emergency: 40 },
  { time: '24:00', occupied: 252, total: 300, icu: 28, general: 186, emergency: 38 }
];

const wardBedData = [
  { ward: 'General Ward 1', total: 50, occupied: 42, available: 8, utilization: 84, status: 'Normal' },
  { ward: 'General Ward 2', total: 45, occupied: 38, available: 7, utilization: 84, status: 'Normal' },
  { ward: 'ICU', total: 30, occupied: 28, available: 2, utilization: 93, status: 'Critical' },
  { ward: 'Emergency', total: 40, occupied: 35, available: 5, utilization: 88, status: 'High' },
  { ward: 'Pediatrics', total: 25, occupied: 18, available: 7, utilization: 72, status: 'Normal' },
  { ward: 'Maternity', total: 35, occupied: 22, available: 13, utilization: 63, status: 'Low' },
  { ward: 'Surgery', total: 20, occupied: 16, available: 4, utilization: 80, status: 'Normal' },
  { ward: 'Cardiology', total: 25, occupied: 21, available: 4, utilization: 84, status: 'Normal' }
];

const bedTypeData = [
  { type: 'General', count: 180, utilization: 85, color: '#3b82f6' },
  { type: 'ICU', count: 30, utilization: 93, color: '#ef4444' },
  { type: 'Emergency', count: 40, utilization: 88, color: '#f59e0b' },
  { type: 'Isolation', count: 15, utilization: 60, color: '#8b5cf6' },
  { type: 'VIP', count: 10, utilization: 70, color: '#10b981' },
  { type: 'Day Care', count: 25, utilization: 45, color: '#06b6d4' }
];

const lengthOfStayData = [
  { days: '1 day', patients: 45, percentage: 18 },
  { days: '2-3 days', patients: 89, percentage: 36 },
  { days: '4-7 days', patients: 72, percentage: 29 },
  { days: '1-2 weeks', patients: 28, percentage: 11 },
  { days: '2+ weeks', patients: 15, percentage: 6 }
];

export const BedUtilizationAnalytics = ({ dateRange, department }: BedUtilizationProps) => {
  const [selectedView, setSelectedView] = useState('overview');

  const chartConfig = {
    occupied: {
      label: "Occupied Beds",
      color: "#3b82f6",
    },
    available: {
      label: "Available Beds",
      color: "#10b981",
    },
    icu: {
      label: "ICU",
      color: "#ef4444",
    },
    general: {
      label: "General",
      color: "#3b82f6",
    },
    emergency: {
      label: "Emergency",
      color: "#f59e0b",
    },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical': return 'bg-red-500 text-white';
      case 'High': return 'bg-orange-500 text-white';
      case 'Normal': return 'bg-blue-500 text-white';
      case 'Low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getUtilizationIcon = (utilization: number) => {
    if (utilization > 90) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (utilization > 80) return <Activity className="h-4 w-4 text-orange-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-blue-200 bg-blue-50">
          <div className="flex items-center gap-2">
            <Bed className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-600">267/300</p>
              <p className="text-sm text-gray-600">Total Occupancy</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-blue-600">89% utilization</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-600">33</p>
              <p className="text-sm text-gray-600">Available Beds</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+5 from yesterday</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-red-600">2</p>
              <p className="text-sm text-gray-600">Critical Wards</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-red-600">ICU at 93%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-purple-200 bg-purple-50">
          <div className="flex items-center gap-2">
            <Clock className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-purple-600">4.2</p>
              <p className="text-sm text-gray-600">Avg Length of Stay</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">-0.3 days</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bed Utilization Over Time</CardTitle>
            <CardDescription>Hourly bed occupancy trends</CardDescription>
            <div className="flex gap-2">
              <Button
                variant={selectedView === 'overview' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedView('overview')}
              >
                Overview
              </Button>
              <Button
                variant={selectedView === 'breakdown' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedView('breakdown')}
              >
                By Type
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {selectedView === 'overview' ? (
                  <LineChart data={mockBedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="occupied" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                ) : (
                  <BarChart data={mockBedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="icu" stackId="a" fill="#ef4444" />
                    <Bar dataKey="general" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="emergency" stackId="a" fill="#f59e0b" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bed Type Distribution</CardTitle>
            <CardDescription>Current utilization by bed type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bedTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {bedTypeData.map((entry, index) => (
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
          <CardTitle>Ward-wise Bed Status</CardTitle>
          <CardDescription>Real-time bed availability across all wards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wardBedData.map((ward) => (
              <div key={ward.ward} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{ward.ward}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getUtilizationIcon(ward.utilization)}
                    <Badge className={getStatusColor(ward.status)}>
                      {ward.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                  <div className="text-center">
                    <p className="text-blue-600 font-bold">{ward.total}</p>
                    <p className="text-gray-500">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-red-600 font-bold">{ward.occupied}</p>
                    <p className="text-gray-500">Occupied</p>
                  </div>
                  <div className="text-center">
                    <p className="text-green-600 font-bold">{ward.available}</p>
                    <p className="text-gray-500">Available</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Utilization</span>
                    <span className="font-medium">{ward.utilization}%</span>
                  </div>
                  <Progress value={ward.utilization} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Length of Stay Analysis</CardTitle>
            <CardDescription>Patient distribution by length of stay</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lengthOfStayData.map((stay) => (
                <div key={stay.days} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">{stay.days}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{stay.patients} patients</p>
                    <p className="text-xs text-gray-500">{stay.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bed Turnover Metrics</CardTitle>
            <CardDescription>Weekly bed turnover and efficiency metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Daily Turnover Rate</span>
                  <span className="text-blue-600 font-bold">12.5%</span>
                </div>
                <Progress value={12.5} className="mt-2 h-2" />
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Cleaning Time</span>
                  <span className="text-green-600 font-bold">45 min avg</span>
                </div>
                <Progress value={75} className="mt-2 h-2" />
              </div>
              
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Discharge Efficiency</span>
                  <span className="text-orange-600 font-bold">88%</span>
                </div>
                <Progress value={88} className="mt-2 h-2" />
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Bed Utilization Rate</span>
                  <span className="text-purple-600 font-bold">89%</span>
                </div>
                <Progress value={89} className="mt-2 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
