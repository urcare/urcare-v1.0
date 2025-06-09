
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Monitor, 
  TrendingUp, 
  Clock, 
  Eye,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  threshold: number;
}

interface UserExperienceMetric {
  metric: string;
  score: number;
  change: number;
  status: 'good' | 'warning' | 'critical';
}

export const PerformanceMonitoringDashboard = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    {
      id: 'lcp',
      name: 'Largest Contentful Paint',
      value: 2.1,
      unit: 's',
      status: 'warning',
      trend: 'down',
      threshold: 2.5
    },
    {
      id: 'fid',
      name: 'First Input Delay',
      value: 15,
      unit: 'ms',
      status: 'good',
      trend: 'stable',
      threshold: 100
    },
    {
      id: 'cls',
      name: 'Cumulative Layout Shift',
      value: 0.05,
      unit: '',
      status: 'good',
      trend: 'down',
      threshold: 0.1
    },
    {
      id: 'fcp',
      name: 'First Contentful Paint',
      value: 0.8,
      unit: 's',
      status: 'good',
      trend: 'down',
      threshold: 1.8
    }
  ]);

  const [uxMetrics] = useState<UserExperienceMetric[]>([
    { metric: 'Page Load Speed', score: 87, change: +5, status: 'good' },
    { metric: 'Interaction Responsiveness', score: 92, change: +2, status: 'good' },
    { metric: 'Visual Stability', score: 94, change: 0, status: 'good' },
    { metric: 'Bundle Size Efficiency', score: 78, change: -3, status: 'warning' }
  ]);

  useEffect(() => {
    // Simulate real-time metric updates
    const interval = setInterval(() => {
      setMetrics(prevMetrics => 
        prevMetrics.map(metric => ({
          ...metric,
          value: Math.max(0, metric.value + (Math.random() - 0.5) * 0.1),
          trend: Math.random() > 0.5 ? 'down' : metric.trend
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return Monitor;
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

  const overallScore = Math.round(
    uxMetrics.reduce((acc, metric) => acc + metric.score, 0) / uxMetrics.length
  );

  const recommendations = [
    'Optimize largest contentful paint by reducing image sizes',
    'Enable compression for faster data transfer',
    'Implement service worker for better caching',
    'Reduce JavaScript bundle size',
    'Use CDN for static asset delivery'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Performance Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
          <div className="text-3xl font-bold text-primary mb-2">{overallScore}</div>
          <div className="text-sm text-gray-600">Overall Performance Score</div>
          <Progress value={overallScore} className="mt-2 h-2" />
        </div>

        {/* Core Web Vitals */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Core Web Vitals</h4>
          <div className="grid grid-cols-1 gap-3">
            {metrics.map((metric) => {
              const StatusIcon = getStatusIcon(metric.status);
              const progress = Math.min(100, (metric.value / metric.threshold) * 100);
              
              return (
                <div key={metric.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`h-4 w-4 ${
                        metric.status === 'good' ? 'text-green-600' : 
                        metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                      <span className="font-medium text-sm">{metric.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTrendIcon(metric.trend)}</span>
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xl font-bold">
                      {metric.value.toFixed(metric.unit === 'ms' ? 0 : 2)}{metric.unit}
                    </div>
                    <div className="text-sm text-gray-600">
                      Target: {metric.threshold}{metric.unit}
                    </div>
                  </div>
                  
                  <Progress 
                    value={progress} 
                    className={`h-2 ${
                      metric.status === 'good' ? '[&>div]:bg-green-500' : 
                      metric.status === 'warning' ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                    }`} 
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* User Experience Metrics */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">User Experience Metrics</h4>
          <div className="grid grid-cols-2 gap-3">
            {uxMetrics.map((metric, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{metric.metric}</span>
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.score}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <Progress value={metric.score} className="flex-1 mr-2 h-1" />
                  <span className={`${
                    metric.change > 0 ? 'text-green-600' : 
                    metric.change < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center p-2 bg-blue-50 rounded">
            <Eye className="h-4 w-4 mx-auto mb-1 text-blue-600" />
            <div className="font-medium">1,247</div>
            <div className="text-xs text-gray-600">Active Users</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <Zap className="h-4 w-4 mx-auto mb-1 text-green-600" />
            <div className="font-medium">0.8s</div>
            <div className="text-xs text-gray-600">Avg Load Time</div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded">
            <TrendingUp className="h-4 w-4 mx-auto mb-1 text-purple-600" />
            <div className="font-medium">99.7%</div>
            <div className="text-xs text-gray-600">Uptime</div>
          </div>
        </div>

        {/* Optimization Recommendations */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Optimization Recommendations</h4>
          <div className="space-y-1">
            {recommendations.slice(0, 3).map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <TrendingUp className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Real-time Core Web Vitals monitoring</p>
          <p>• Automated performance recommendations</p>
          <p>• User experience optimization tracking</p>
        </div>
      </CardContent>
    </Card>
  );
};
