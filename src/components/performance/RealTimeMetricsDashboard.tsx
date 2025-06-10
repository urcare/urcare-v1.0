
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Database,
  Users,
  Activity,
  Zap
} from 'lucide-react';

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: any;
}

export const RealTimeMetricsDashboard = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      id: 'cpu',
      name: 'CPU Usage',
      value: 45,
      unit: '%',
      status: 'good',
      trend: 'stable',
      icon: Cpu
    },
    {
      id: 'memory',
      name: 'Memory Usage',
      value: 68,
      unit: '%',
      status: 'warning',
      trend: 'up',
      icon: Monitor
    },
    {
      id: 'disk',
      name: 'Disk Usage',
      value: 72,
      unit: '%',
      status: 'warning',
      trend: 'stable',
      icon: HardDrive
    },
    {
      id: 'network',
      name: 'Network I/O',
      value: 35,
      unit: 'Mbps',
      status: 'good',
      trend: 'down',
      icon: Wifi
    },
    {
      id: 'database',
      name: 'DB Connections',
      value: 25,
      unit: 'active',
      status: 'good',
      trend: 'stable',
      icon: Database
    },
    {
      id: 'sessions',
      name: 'Active Sessions',
      value: 1247,
      unit: 'users',
      status: 'good',
      trend: 'up',
      icon: Users
    }
  ]);

  const [liveData, setLiveData] = useState({
    timestamp: new Date(),
    requests: 5420,
    errors: 12,
    avgResponseTime: 245
  });

  useEffect(() => {
    // Simulate real-time metric updates
    const interval = setInterval(() => {
      setMetrics(prevMetrics => 
        prevMetrics.map(metric => ({
          ...metric,
          value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 10)),
          trend: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'up' : 'down') : metric.trend
        }))
      );

      setLiveData(prev => ({
        timestamp: new Date(),
        requests: prev.requests + Math.floor(Math.random() * 20),
        errors: prev.errors + Math.floor(Math.random() * 3),
        avgResponseTime: Math.max(100, prev.avgResponseTime + (Math.random() - 0.5) * 50)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'good': return '[&>div]:bg-green-500';
      case 'warning': return '[&>div]:bg-yellow-500';
      case 'critical': return '[&>div]:bg-red-500';
      default: return '[&>div]:bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Status Header */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            Live System Status
            <Badge variant="outline" className="bg-green-100 text-green-800">
              LIVE
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{liveData.requests.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{liveData.errors}</div>
              <div className="text-sm text-gray-600">Errors (24h)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.round(liveData.avgResponseTime)}ms</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">99.7%</div>
              <div className="text-sm text-gray-600">Uptime (30d)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <Card key={metric.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`h-5 w-5 ${getStatusColor(metric.status)}`} />
                    {metric.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTrendIcon(metric.trend)}</span>
                    <Badge className={
                      metric.status === 'good' ? 'bg-green-100 text-green-800' :
                      metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {metric.status}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">
                    {metric.unit === '%' ? Math.round(metric.value) : metric.value}
                  </span>
                  <span className="text-gray-600">{metric.unit}</span>
                </div>
                <Progress 
                  value={metric.unit === '%' ? metric.value : (metric.value / 100) * 100} 
                  className={`h-3 ${getProgressColor(metric.status)}`}
                />
                <div className="text-xs text-gray-500">
                  Last updated: {liveData.timestamp.toLocaleTimeString()}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Network and Performance Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              Network Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Inbound Traffic</span>
                <span className="font-bold">125.4 MB/s</span>
              </div>
              <Progress value={75} className="h-2 [&>div]:bg-blue-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Outbound Traffic</span>
                <span className="font-bold">89.2 MB/s</span>
              </div>
              <Progress value={60} className="h-2 [&>div]:bg-green-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Packet Loss</span>
                <span className="font-bold text-green-600">0.01%</span>
              </div>
              <Progress value={1} className="h-2 [&>div]:bg-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-2 bg-blue-50 rounded">
                <div className="font-medium">Page Load Time</div>
                <div className="text-lg font-bold text-blue-600">0.8s</div>
              </div>
              <div className="p-2 bg-green-50 rounded">
                <div className="font-medium">API Calls/min</div>
                <div className="text-lg font-bold text-green-600">2,457</div>
              </div>
              <div className="p-2 bg-purple-50 rounded">
                <div className="font-medium">Cache Hit Rate</div>
                <div className="text-lg font-bold text-purple-600">94.2%</div>
              </div>
              <div className="p-2 bg-orange-50 rounded">
                <div className="font-medium">Error Rate</div>
                <div className="text-lg font-bold text-orange-600">0.03%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
