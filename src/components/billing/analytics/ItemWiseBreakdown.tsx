
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { TrendingUp, Eye, Filter } from 'lucide-react';

interface RevenueBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

interface TopGenerator {
  service: string;
  amount: number;
  growth: number;
  trend: 'up' | 'down' | 'stable';
}

export const ItemWiseBreakdown = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  const revenueBreakdown: RevenueBreakdown[] = [
    { category: 'Consultations', amount: 12500, percentage: 25, color: '#3b82f6' },
    { category: 'Procedures', amount: 30000, percentage: 60, color: '#059669' },
    { category: 'Medications', amount: 5000, percentage: 10, color: '#dc2626' },
    { category: 'Diagnostics', amount: 2500, percentage: 5, color: '#f59e0b' }
  ];

  const topGenerators: TopGenerator[] = [
    { service: 'Cardiac Procedures', amount: 15000, growth: 12.5, trend: 'up' },
    { service: 'Orthopedic Surgery', amount: 8000, growth: -3.2, trend: 'down' },
    { service: 'ICU Services', amount: 7000, growth: 8.7, trend: 'up' },
    { service: 'Emergency Visits', amount: 5500, growth: 0.0, trend: 'stable' },
    { service: 'Radiology', amount: 4500, growth: 15.3, trend: 'up' }
  ];

  const hourlyTrend = [
    { hour: '08:00', revenue: 2500 },
    { hour: '09:00', revenue: 4200 },
    { hour: '10:00', revenue: 6800 },
    { hour: '11:00', revenue: 8500 },
    { hour: '12:00', revenue: 7200 },
    { hour: '13:00', revenue: 5900 },
    { hour: '14:00', revenue: 8100 },
    { hour: '15:00', revenue: 9400 },
    { hour: '16:00', revenue: 8800 },
    { hour: '17:00', revenue: 6300 }
  ];

  const totalRevenue = revenueBreakdown.reduce((sum, item) => sum + item.amount, 0);

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '↗️';
    if (trend === 'down') return '↘️';
    return '➡️';
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Item-wise Billing Breakdown</h2>
          <p className="text-gray-600">Comprehensive revenue analysis with drill-down capabilities</p>
        </div>
        
        <div className="flex gap-2">
          {(['today', 'week', 'month'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={selectedPeriod === period ? 'bg-blue-600' : ''}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {revenueBreakdown.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <Badge variant="outline">{item.percentage}%</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">{item.category}</p>
                <p className="text-2xl font-bold" style={{ color: item.color }}>
                  ${item.amount.toLocaleString()}
                </p>
                <Progress value={item.percentage} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
            <CardDescription>Today's revenue breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                  label={(entry) => `${entry.category}: ${entry.percentage}%`}
                >
                  {revenueBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hourly Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Hourly Revenue Trend</CardTitle>
            <CardDescription>Revenue collection throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Revenue Generators */}
      <Card>
        <CardHeader>
          <CardTitle>Top Revenue Generators</CardTitle>
          <CardDescription>Services driving the highest revenue today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topGenerators.map((generator, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium">{generator.service}</h3>
                    <p className="text-sm text-gray-600">Revenue today</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-semibold">${generator.amount.toLocaleString()}</p>
                    <div className={`flex items-center gap-1 text-sm ${getTrendColor(generator.trend)}`}>
                      <span>{getTrendIcon(generator.trend)}</span>
                      <span>{Math.abs(generator.growth)}%</span>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Service Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Service Category Analysis</CardTitle>
          <CardDescription>Comparative performance across service categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={revenueBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
