
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Receipt,
  PieChart as PieChartIcon,
  Target,
  Calendar
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface RevenueAnalyticsProps {
  dateRange: string;
  department: string;
}

const mockRevenueData = [
  { month: 'Jan', revenue: 2200000, target: 2500000, opd: 800000, ipd: 1000000, pharmacy: 250000, diagnostics: 150000 },
  { month: 'Feb', revenue: 2450000, target: 2500000, opd: 900000, ipd: 1100000, pharmacy: 280000, diagnostics: 170000 },
  { month: 'Mar', revenue: 2680000, target: 2500000, opd: 950000, ipd: 1200000, pharmacy: 330000, diagnostics: 200000 },
  { month: 'Apr', revenue: 2580000, target: 2500000, opd: 920000, ipd: 1180000, pharmacy: 310000, diagnostics: 170000 },
  { month: 'May', revenue: 2750000, target: 2500000, opd: 980000, ipd: 1250000, pharmacy: 350000, diagnostics: 170000 },
  { month: 'Jun', revenue: 2820000, target: 2500000, opd: 1020000, ipd: 1300000, pharmacy: 330000, diagnostics: 170000 }
];

const departmentRevenueData = [
  { department: 'Cardiology', revenue: 450000, percentage: 18.5, color: '#ef4444' },
  { department: 'Surgery', revenue: 380000, percentage: 15.6, color: '#3b82f6' },
  { department: 'Emergency', revenue: 320000, percentage: 13.1, color: '#10b981' },
  { department: 'ICU', revenue: 280000, percentage: 11.5, color: '#f59e0b' },
  { department: 'Orthopedics', revenue: 250000, percentage: 10.3, color: '#8b5cf6' },
  { department: 'Others', revenue: 750000, percentage: 31.0, color: '#6b7280' }
];

const paymentMethodData = [
  { method: 'Insurance', amount: 1200000, percentage: 48, color: '#3b82f6' },
  { method: 'Cash', amount: 650000, percentage: 26, color: '#10b981' },
  { method: 'Card', amount: 500000, percentage: 20, color: '#f59e0b' },
  { method: 'Corporate', amount: 150000, percentage: 6, color: '#8b5cf6' }
];

export const RevenueAnalytics = ({ dateRange, department }: RevenueAnalyticsProps) => {
  const [selectedView, setSelectedView] = useState('overview');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#3b82f6",
    },
    target: {
      label: "Target",
      color: "#ef4444",
    },
    opd: {
      label: "OPD",
      color: "#10b981",
    },
    ipd: {
      label: "IPD",
      color: "#f59e0b",
    },
    pharmacy: {
      label: "Pharmacy",
      color: "#8b5cf6",
    },
    diagnostics: {
      label: "Diagnostics",
      color: "#06b6d4",
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-600">₹28.2L</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+15%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-blue-200 bg-blue-50">
          <div className="flex items-center gap-2">
            <Target className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-600">112.8%</p>
              <p className="text-sm text-gray-600">Target Achievement</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+2.8%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-purple-200 bg-purple-50">
          <div className="flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-purple-600">₹9,400</p>
              <p className="text-sm text-gray-600">Avg Transaction</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+8%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-orange-200 bg-orange-50">
          <div className="flex items-center gap-2">
            <Receipt className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold text-orange-600">3,247</p>
              <p className="text-sm text-gray-600">Total Bills</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+12%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue vs target comparison</CardDescription>
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
                Breakdown
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {selectedView === 'overview' ? (
                  <AreaChart data={mockRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}L`} />
                    <ChartTooltip 
                      content={<ChartTooltipContent 
                        formatter={(value) => formatCurrency(Number(value))}
                      />} 
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" />
                  </AreaChart>
                ) : (
                  <BarChart data={mockRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}L`} />
                    <ChartTooltip 
                      content={<ChartTooltipContent 
                        formatter={(value) => formatCurrency(Number(value))}
                      />} 
                    />
                    <Bar dataKey="opd" stackId="a" fill="#10b981" />
                    <Bar dataKey="ipd" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="pharmacy" stackId="a" fill="#8b5cf6" />
                    <Bar dataKey="diagnostics" stackId="a" fill="#06b6d4" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Revenue</CardTitle>
            <CardDescription>Revenue distribution by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentRevenueData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {departmentRevenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent 
                      formatter={(value) => formatCurrency(Number(value))}
                    />} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Revenue breakdown by payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethodData.map((method) => (
                <div key={method.method} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: method.color }}
                    ></div>
                    <span className="font-medium">{method.method}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(method.amount)}</p>
                    <p className="text-xs text-gray-500">{method.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Departments</CardTitle>
            <CardDescription>This month's revenue leaders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departmentRevenueData.slice(0, 5).map((dept, index) => (
                <div key={dept.department} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-8 h-8 flex items-center justify-center p-0">
                      {index + 1}
                    </Badge>
                    <span className="font-medium">{dept.department}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(dept.revenue)}</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600">{dept.percentage}%</span>
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
