
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Clock, Eye, TrendingDown, Smartphone, Monitor, Tablet } from 'lucide-react';

export const UserSessionAnalytics = () => {
  const userJourneys = [
    {
      page: '/dashboard',
      loadTime: 1.2,
      bounceRate: 15,
      avgSessionTime: '4:32',
      visitors: 2456,
      score: 87
    },
    {
      page: '/appointments',
      loadTime: 2.1,
      bounceRate: 28,
      avgSessionTime: '6:45',
      visitors: 1834,
      score: 72
    },
    {
      page: '/medical-records',
      loadTime: 1.8,
      bounceRate: 22,
      avgSessionTime: '5:12',
      visitors: 1567,
      score: 79
    }
  ];

  const deviceBreakdown = [
    { device: 'Desktop', users: 45, icon: Monitor, color: 'blue' },
    { device: 'Mobile', users: 35, icon: Smartphone, color: 'green' },
    { device: 'Tablet', users: 20, icon: Tablet, color: 'purple' }
  ];

  const performanceMetrics = [
    { metric: 'First Contentful Paint', value: '1.2s', score: 92, status: 'good' },
    { metric: 'Largest Contentful Paint', value: '2.1s', score: 78, status: 'fair' },
    { metric: 'First Input Delay', value: '45ms', score: 95, status: 'good' },
    { metric: 'Cumulative Layout Shift', value: '0.08', score: 85, status: 'good' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Session Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">8,423</div>
              <div className="text-sm text-gray-600">Active Sessions</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">5:34</div>
              <div className="text-sm text-gray-600">Avg Session Duration</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">1.8s</div>
              <div className="text-sm text-gray-600">Avg Page Load Time</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">21%</div>
              <div className="text-sm text-gray-600">Bounce Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Page Performance Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userJourneys.map((journey, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="font-mono text-sm">{journey.page}</div>
                      <div className={`text-lg font-bold ${getScoreColor(journey.score)}`}>
                        {journey.score}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{journey.loadTime}s load time</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingDown className="h-3 w-3" />
                          <span>{journey.bounceRate}% bounce rate</span>
                        </div>
                      </div>
                      <div className="space-y-1 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{journey.visitors.toLocaleString()} visitors</span>
                        </div>
                        <div className="text-gray-600">{journey.avgSessionTime} avg session</div>
                      </div>
                    </div>
                    <Progress value={journey.score} className={`h-2 ${getScoreColor(journey.score).includes('green') ? '[&>div]:bg-green-500' : getScoreColor(journey.score).includes('yellow') ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'}`} />
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceBreakdown.map((device, index) => {
                const IconComponent = device.icon;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`h-4 w-4 ${
                          device.color === 'blue' ? 'text-blue-600' :
                          device.color === 'green' ? 'text-green-600' :
                          'text-purple-600'
                        }`} />
                        <span className="font-medium">{device.device}</span>
                      </div>
                      <span className="font-bold">{device.users}%</span>
                    </div>
                    <Progress 
                      value={device.users} 
                      className={`h-3 ${
                        device.color === 'blue' ? '[&>div]:bg-blue-500' :
                        device.color === 'green' ? '[&>div]:bg-green-500' :
                        '[&>div]:bg-purple-500'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Core Web Vitals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="space-y-2">
                  <div className="text-sm font-medium">{metric.metric}</div>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex justify-between items-center">
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                    <div className={`font-bold ${getScoreColor(metric.score)}`}>
                      {metric.score}
                    </div>
                  </div>
                  <Progress 
                    value={metric.score} 
                    className={`h-2 ${getScoreColor(metric.score).includes('green') ? '[&>div]:bg-green-500' : getScoreColor(metric.score).includes('yellow') ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Flow Bottlenecks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-l-red-500 bg-red-50">
              <h4 className="font-semibold text-red-800">Critical: Appointment Booking Flow</h4>
              <p className="text-sm text-red-700 mt-1">
                65% of users abandon the booking process at the payment step. Average load time: 4.2s
              </p>
            </div>
            <div className="p-4 border-l-4 border-l-yellow-500 bg-yellow-50">
              <h4 className="font-semibold text-yellow-800">Warning: Medical Records Access</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Document viewer takes 3.1s to load on mobile devices, causing 23% user drop-off
              </p>
            </div>
            <div className="p-4 border-l-4 border-l-blue-500 bg-blue-50">
              <h4 className="font-semibold text-blue-800">Optimization: Dashboard Navigation</h4>
              <p className="text-sm text-blue-700 mt-1">
                Implementing lazy loading could reduce initial dashboard load time by 40%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
