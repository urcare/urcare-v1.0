
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Server
} from 'lucide-react';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

export const RealTimeMetricsDashboard = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const mockMetrics: SystemMetric[] = [
    { name: 'CPU Usage', value: 67, unit: '%', status: 'warning', trend: 'up' },
    { name: 'Memory Usage', value: 78, unit: '%', status: 'warning', trend: 'stable' },
    { name: 'Disk Usage', value: 45, unit: '%', status: 'good', trend: 'down' },
    { name: 'Network I/O', value: 234, unit: 'Mbps', status: 'good', trend: 'up' },
    { name: 'Active Connections', value: 1247, unit: 'connections', status: 'good', trend: 'stable' },
    { name: 'Response Time', value: 245, unit: 'ms', status: 'good', trend: 'down' },
    { name: 'Throughput', value: 5680, unit: 'req/min', status: 'good', trend: 'up' },
    { name: 'Error Rate', value: 0.8, unit: '%', status: 'good', trend: 'down' }
  ];

  useEffect(() => {
    setMetrics(mockMetrics);
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, metric.value + (Math.random() - 0.5) * 10)
      })));
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const refreshMetrics = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMetrics(mockMetrics);
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'good':
        return '[&>div]:bg-green-500';
      case 'warning':
        return '[&>div]:bg-yellow-500';
      case 'critical':
        return '[&>div]:bg-red-500';
      default:
        return '[&>div]:bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-6 w-6 text-blue-600" />
                Real-Time System Metrics
              </CardTitle>
              <CardDescription>
                Live monitoring of system performance and health indicators
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshMetrics}
                disabled={isRefreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(metric.status)}
                      <span className="font-medium text-sm">{metric.name}</span>
                    </div>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                  
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.value.toFixed(metric.unit === '%' ? 1 : 0)} {metric.unit}
                  </div>
                  
                  <Progress 
                    value={metric.unit === '%' ? metric.value : Math.min(100, (metric.value / 1000) * 100)} 
                    className={`h-2 ${getProgressColor(metric.status)}`}
                  />
                  
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Trend: {metric.trend}</span>
                    <span className={
                      metric.trend === 'up' ? 'text-green-600' :
                      metric.trend === 'down' ? 'text-red-600' : 
                      'text-gray-600'
                    }>
                      {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-blue-600" />
              CPU Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Current Load</span>
                <span className="font-bold">67%</span>
              </div>
              <Progress value={67} className="[&>div]:bg-blue-500" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Cores</p>
                  <p className="font-medium">8 cores</p>
                </div>
                <div>
                  <p className="text-gray-600">Frequency</p>
                  <p className="font-medium">3.2 GHz</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-green-600" />
              Storage Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Used Space</span>
                <span className="font-bold">45%</span>
              </div>
              <Progress value={45} className="[&>div]:bg-green-500" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total</p>
                  <p className="font-medium">2 TB</p>
                </div>
                <div>
                  <p className="text-gray-600">Available</p>
                  <p className="font-medium">1.1 TB</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-purple-600" />
              Network Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Bandwidth Usage</span>
                <span className="font-bold">234 Mbps</span>
              </div>
              <Progress value={70} className="[&>div]:bg-purple-500" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Inbound</p>
                  <p className="font-medium">156 Mbps</p>
                </div>
                <div>
                  <p className="text-gray-600">Outbound</p>
                  <p className="font-medium">78 Mbps</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
