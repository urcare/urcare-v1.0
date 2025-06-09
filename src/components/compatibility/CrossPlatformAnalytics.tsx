
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp,
  Users,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Tv,
  Watch
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface PlatformMetric {
  platform: string;
  users: number;
  sessions: number;
  avgDuration: number;
  satisfaction: number;
  performance: number;
}

export const CrossPlatformAnalytics = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month'>('week');

  const platformData: PlatformMetric[] = [
    { platform: 'Mobile', users: 2134, sessions: 8947, avgDuration: 12.5, satisfaction: 4.6, performance: 92 },
    { platform: 'Web', users: 1247, sessions: 5632, avgDuration: 18.3, satisfaction: 4.4, performance: 89 },
    { platform: 'Tablet', users: 456, sessions: 1823, avgDuration: 22.7, satisfaction: 4.7, performance: 94 },
    { platform: 'Watch', users: 234, sessions: 987, avgDuration: 3.2, satisfaction: 4.2, performance: 88 },
    { platform: 'Kiosk', users: 89, sessions: 234, avgDuration: 8.1, satisfaction: 4.1, performance: 91 },
    { platform: 'TV', users: 67, sessions: 145, avgDuration: 15.4, satisfaction: 4.3, performance: 87 }
  ];

  const performanceData = [
    { time: '00:00', mobile: 45, web: 32, tablet: 12, watch: 8, kiosk: 3 },
    { time: '06:00', mobile: 89, web: 67, tablet: 23, watch: 15, kiosk: 7 },
    { time: '12:00', mobile: 156, web: 134, tablet: 45, watch: 34, kiosk: 12 },
    { time: '18:00', mobile: 198, web: 176, tablet: 56, watch: 42, kiosk: 15 },
    { time: '24:00', mobile: 134, web: 98, tablet: 34, watch: 28, kiosk: 9 }
  ];

  const deviceDistribution = [
    { name: 'Mobile', value: 45, color: '#3b82f6' },
    { name: 'Web', value: 28, color: '#10b981' },
    { name: 'Tablet', value: 15, color: '#f59e0b' },
    { name: 'Watch', value: 8, color: '#ef4444' },
    { name: 'Other', value: 4, color: '#8b5cf6' }
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'mobile': return Smartphone;
      case 'web': return Monitor;
      case 'tablet': return Tablet;
      case 'tv': return Tv;
      case 'watch': return Watch;
      default: return Monitor;
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Time Frame Selection */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Cross-Platform Analytics</h3>
          <p className="text-sm text-gray-600">Performance metrics across all platforms and devices</p>
        </div>
        <div className="flex gap-2">
          {(['day', 'week', 'month'] as const).map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe)}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Platform Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platformData.map((platform) => {
          const IconComponent = getPlatformIcon(platform.platform);
          return (
            <Card key={platform.platform}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">{platform.platform}</span>
                  </div>
                  <Badge className={`${getPerformanceColor(platform.performance)} bg-transparent border-current`}>
                    {platform.performance}%
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Users</span>
                    <span className="font-medium">{platform.users.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sessions</span>
                    <span className="font-medium">{platform.sessions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Duration</span>
                    <span className="font-medium">{platform.avgDuration}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Satisfaction</span>
                    <span className="font-medium">{platform.satisfaction}/5.0</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Performance</span>
                    <span>{platform.performance}%</span>
                  </div>
                  <Progress value={platform.performance} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Usage Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Usage Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Platform Usage Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#3b82f6" name="Active Users" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Device Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                >
                  {deviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            24-Hour Usage Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="mobile" stroke="#3b82f6" strokeWidth={2} name="Mobile" />
              <Line type="monotone" dataKey="web" stroke="#10b981" strokeWidth={2} name="Web" />
              <Line type="monotone" dataKey="tablet" stroke="#f59e0b" strokeWidth={2} name="Tablet" />
              <Line type="monotone" dataKey="watch" stroke="#ef4444" strokeWidth={2} name="Watch" />
              <Line type="monotone" dataKey="kiosk" stroke="#8b5cf6" strokeWidth={2} name="Kiosk" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2.3s</div>
              <div className="text-sm text-gray-600">Avg Load Time</div>
              <div className="text-xs text-green-600 mt-1">↓ 12% vs last week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.7%</div>
              <div className="text-sm text-gray-600">Uptime</div>
              <div className="text-xs text-green-600 mt-1">↑ 0.2% vs last week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">4.5/5</div>
              <div className="text-sm text-gray-600">User Satisfaction</div>
              <div className="text-xs text-green-600 mt-1">↑ 0.3 vs last week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">91%</div>
              <div className="text-sm text-gray-600">Feature Adoption</div>
              <div className="text-xs text-green-600 mt-1">↑ 5% vs last week</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues and Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="font-medium text-blue-800 mb-2">Performance Optimization</div>
              <p className="text-sm text-blue-700">
                Mobile platform shows highest usage but slower performance. Consider implementing lazy loading and image optimization.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="font-medium text-green-800 mb-2">High User Satisfaction</div>
              <p className="text-sm text-green-700">
                Tablet interface has the highest satisfaction score (4.7/5). Consider applying similar UX patterns to other platforms.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="font-medium text-yellow-800 mb-2">Feature Adoption Opportunity</div>
              <p className="text-sm text-yellow-700">
                Smartwatch platform has room for growth. Enhanced health monitoring features could increase engagement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
