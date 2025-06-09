
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Image, 
  Database, 
  Activity,
  Globe,
  Monitor,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { LazyLoadingManager } from './LazyLoadingManager';
import { ImageOptimizationDashboard } from './ImageOptimizationDashboard';
import { CacheManagementDashboard } from './CacheManagementDashboard';
import { RealTimeStreamingDashboard } from './RealTimeStreamingDashboard';
import { CDNIntegrationDashboard } from './CDNIntegrationDashboard';
import { PerformanceMonitoringDashboard } from './PerformanceMonitoringDashboard';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  target: number;
}

export const PerformanceOptimizationDashboard = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);

  const performanceFeatures = [
    { id: 'lazy-loading', name: 'Lazy Loading', icon: Zap, status: 'active', improvement: '+45%' },
    { id: 'image-optimization', name: 'Image Optimization', icon: Image, status: 'active', improvement: '+60%' },
    { id: 'caching', name: 'Advanced Caching', icon: Database, status: 'active', improvement: '+35%' },
    { id: 'streaming', name: 'Real-time Streaming', icon: Activity, status: 'active', improvement: '+25%' },
    { id: 'cdn', name: 'CDN Integration', icon: Globe, status: 'active', improvement: '+40%' },
    { id: 'monitoring', name: 'Performance Monitoring', icon: Monitor, status: 'active', improvement: '+30%' }
  ];

  useEffect(() => {
    loadPerformanceMetrics();
    
    // Auto-refresh metrics every 30 seconds
    const interval = setInterval(loadPerformanceMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadPerformanceMetrics = async () => {
    // Simulate loading performance metrics
    const metrics: PerformanceMetric[] = [
      {
        id: 'page-load',
        name: 'Page Load Time',
        value: 1.2,
        unit: 's',
        status: 'good',
        target: 2.0
      },
      {
        id: 'first-paint',
        name: 'First Contentful Paint',
        value: 0.8,
        unit: 's',
        status: 'good',
        target: 1.5
      },
      {
        id: 'largest-paint',
        name: 'Largest Contentful Paint',
        value: 2.1,
        unit: 's',
        status: 'warning',
        target: 2.5
      },
      {
        id: 'cumulative-shift',
        name: 'Cumulative Layout Shift',
        value: 0.05,
        unit: '',
        status: 'good',
        target: 0.1
      },
      {
        id: 'first-input',
        name: 'First Input Delay',
        value: 15,
        unit: 'ms',
        status: 'good',
        target: 100
      },
      {
        id: 'time-to-interactive',
        name: 'Time to Interactive',
        value: 2.8,
        unit: 's',
        status: 'warning',
        target: 3.8
      }
    ];
    
    setPerformanceMetrics(metrics);
  };

  const runOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    // Simulate optimization process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setOptimizationProgress(i);
    }
    
    setIsOptimizing(false);
    loadPerformanceMetrics(); // Refresh metrics after optimization
  };

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

  const overallScore = Math.round(
    performanceMetrics.reduce((acc, metric) => {
      const score = metric.status === 'good' ? 100 : metric.status === 'warning' ? 70 : 40;
      return acc + score;
    }, 0) / performanceMetrics.length
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Optimization</h1>
          <p className="text-gray-600">Intelligent optimization, caching, and real-time performance monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{overallScore}</div>
            <div className="text-sm text-gray-600">Performance Score</div>
          </div>
          <Button 
            onClick={runOptimization}
            disabled={isOptimizing}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            {isOptimizing ? 'Optimizing...' : 'Run Optimization'}
          </Button>
        </div>
      </div>

      {/* Optimization Progress */}
      {isOptimizing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Running Performance Optimization</span>
                <span className="text-sm text-gray-600">{optimizationProgress}%</span>
              </div>
              <Progress value={optimizationProgress} className="h-2" />
              <div className="text-sm text-gray-600">
                Analyzing lazy loading patterns, optimizing images, refreshing caches...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {performanceMetrics.map((metric) => {
          const StatusIcon = getStatusIcon(metric.status);
          return (
            <Card key={metric.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <StatusIcon className={`h-5 w-5 ${
                    metric.status === 'good' ? 'text-green-600' : 
                    metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">{metric.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <span className="text-sm text-gray-600">{metric.unit}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Target: {metric.target}{metric.unit}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {performanceFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="h-8 w-8 text-primary" />
                  <Badge className="bg-green-100 text-green-800">
                    {feature.improvement}
                  </Badge>
                </div>
                <h3 className="font-semibold mb-2">{feature.name}</h3>
                <div className="text-sm text-gray-600">
                  Active and optimized
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LazyLoadingManager />
        
        <ImageOptimizationDashboard />
        
        <CacheManagementDashboard />
        
        <RealTimeStreamingDashboard />
        
        <CDNIntegrationDashboard />
        
        <PerformanceMonitoringDashboard />
      </div>
    </div>
  );
};
