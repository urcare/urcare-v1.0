
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Users, 
  Clock, 
  MousePointer, 
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  MapPin,
  TrendingUp
} from 'lucide-react';

interface UserSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  pageViews: number;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  location: string;
  isActive: boolean;
}

interface PageView {
  page: string;
  views: number;
  avgTime: number;
  bounceRate: number;
}

export const UserSessionAnalytics = () => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [timeframe, setTimeframe] = useState('24hours');

  useEffect(() => {
    loadSessionData();
    loadPageViewData();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      updateSessionData();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [timeframe]);

  const loadSessionData = () => {
    const mockSessions: UserSession[] = [
      {
        id: '1',
        userId: 'user_123',
        startTime: new Date(Date.now() - 30 * 60 * 1000),
        duration: 1800,
        pageViews: 12,
        device: 'desktop',
        browser: 'Chrome',
        location: 'New York, US',
        isActive: true
      },
      {
        id: '2',
        userId: 'user_456',
        startTime: new Date(Date.now() - 45 * 60 * 1000),
        endTime: new Date(Date.now() - 15 * 60 * 1000),
        duration: 1800,
        pageViews: 8,
        device: 'mobile',
        browser: 'Safari',
        location: 'London, UK',
        isActive: false
      }
    ];
    setSessions(mockSessions);
  };

  const loadPageViewData = () => {
    const mockPageViews: PageView[] = [
      { page: '/dashboard', views: 1247, avgTime: 180, bounceRate: 15 },
      { page: '/performance-monitoring', views: 890, avgTime: 240, bounceRate: 12 },
      { page: '/analytics', views: 756, avgTime: 320, bounceRate: 8 },
      { page: '/ai-diagnostics', views: 542, avgTime: 280, bounceRate: 18 },
      { page: '/appointments', views: 445, avgTime: 150, bounceRate: 25 }
    ];
    setPageViews(mockPageViews);
  };

  const updateSessionData = () => {
    setSessions(prev => prev.map(session => ({
      ...session,
      duration: session.isActive ? session.duration + 10 : session.duration,
      pageViews: session.isActive && Math.random() > 0.8 ? session.pageViews + 1 : session.pageViews
    })));
  };

  const sessionTrendData = [
    { time: '00:00', active: 145, new: 23 },
    { time: '04:00', active: 89, new: 12 },
    { time: '08:00', active: 234, new: 45 },
    { time: '12:00', active: 567, new: 89 },
    { time: '16:00', active: 445, new: 67 },
    { time: '20:00', active: 289, new: 34 },
    { time: '24:00', active: 178, new: 28 }
  ];

  const deviceData = [
    { name: 'Desktop', value: 65, color: '#3b82f6' },
    { name: 'Mobile', value: 28, color: '#10b981' },
    { name: 'Tablet', value: 7, color: '#f59e0b' }
  ];

  const geographicData = [
    { country: 'United States', sessions: 456, percentage: 35 },
    { country: 'United Kingdom', sessions: 234, percentage: 18 },
    { country: 'Germany', sessions: 189, percentage: 14 },
    { country: 'France', sessions: 156, percentage: 12 },
    { country: 'Canada', sessions: 123, percentage: 9 },
    { country: 'Others', sessions: 156, percentage: 12 }
  ];

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop': return Monitor;
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      default: return Monitor;
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m ${seconds % 60}s`;
  };

  const activeSessions = sessions.filter(s => s.isActive).length;
  const avgSessionDuration = sessions.reduce((acc, s) => acc + s.duration, 0) / sessions.length;
  const totalPageViews = pageViews.reduce((acc, p) => acc + p.views, 0);
  const avgBounceRate = pageViews.reduce((acc, p) => acc + p.bounceRate, 0) / pageViews.length;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-600" />
            User Session Analytics
          </CardTitle>
          <CardDescription>
            Real-time user behavior and session monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Users className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-purple-600">{activeSessions}</div>
              <div className="text-sm text-gray-600">Active Sessions</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Clock className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-600">{formatDuration(avgSessionDuration)}</div>
              <div className="text-sm text-gray-600">Avg Session Time</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Eye className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-600">{totalPageViews.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Page Views</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <MousePointer className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <div className="text-2xl font-bold text-orange-600">{avgBounceRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Bounce Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Session Trends</CardTitle>
            <CardDescription>Active sessions and new user registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sessionTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="active" stroke="#3b82f6" strokeWidth={2} name="Active Sessions" />
                <Line type="monotone" dataKey="new" stroke="#10b981" strokeWidth={2} name="New Users" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
            <CardDescription>User sessions by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-2">
                {deviceData.map((device) => {
                  const DeviceIcon = getDeviceIcon(device.name.toLowerCase());
                  return (
                    <div key={device.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DeviceIcon className="h-4 w-4" style={{ color: device.color }} />
                        <span className="text-sm">{device.name}</span>
                      </div>
                      <span className="text-sm font-medium">{device.value}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Visited Pages</CardTitle>
            <CardDescription>Page performance and user engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pageViews.map((page, index) => (
                <div key={page.page} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{page.page}</span>
                    <Badge variant="outline">{page.views} views</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>Avg Time: {page.avgTime}s</div>
                    <div>Bounce Rate: {page.bounceRate}%</div>
                  </div>
                  <Progress value={(page.views / Math.max(...pageViews.map(p => p.views))) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>User sessions by country</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {geographicData.map((country) => (
                <div key={country.country} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{country.country}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{country.sessions}</div>
                    <div className="text-sm text-gray-500">{country.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Currently active user sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.filter(s => s.isActive).map((session) => {
              const DeviceIcon = getDeviceIcon(session.device);
              return (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <DeviceIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium">User {session.userId.slice(-3)}</div>
                      <div className="text-sm text-gray-500">{session.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatDuration(session.duration)}</div>
                    <div className="text-sm text-gray-500">{session.pageViews} pages</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
