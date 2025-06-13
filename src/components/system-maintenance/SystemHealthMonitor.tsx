
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Server, 
  Database, 
  Globe, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  TrendingUp,
  Eye,
  RefreshCw
} from 'lucide-react';

export const SystemHealthMonitor = () => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('24h');

  const systemComponents = [
    {
      id: '1',
      name: 'Web Servers',
      status: 'healthy',
      uptime: 99.98,
      responseTime: 45,
      throughput: 1250,
      errorRate: 0.02,
      lastCheck: '30 seconds ago',
      dependencies: ['Load Balancer', 'Database']
    },
    {
      id: '2',
      name: 'Database Cluster',
      status: 'warning',
      uptime: 99.85,
      responseTime: 89,
      throughput: 890,
      errorRate: 0.15,
      lastCheck: '1 minute ago',
      dependencies: ['Storage', 'Network']
    },
    {
      id: '3',
      name: 'API Gateway',
      status: 'healthy',
      uptime: 99.95,
      responseTime: 32,
      throughput: 2150,
      errorRate: 0.05,
      lastCheck: '15 seconds ago',
      dependencies: ['Web Servers', 'Authentication']
    },
    {
      id: '4',
      name: 'Cache Layer',
      status: 'critical',
      uptime: 97.50,
      responseTime: 156,
      throughput: 450,
      errorRate: 2.50,
      lastCheck: '2 minutes ago',
      dependencies: ['Memory', 'Network']
    },
    {
      id: '5',
      name: 'Storage Systems',
      status: 'healthy',
      uptime: 99.99,
      responseTime: 12,
      throughput: 3200,
      errorRate: 0.01,
      lastCheck: '45 seconds ago',
      dependencies: ['Disk Arrays', 'Controllers']
    },
    {
      id: '6',
      name: 'Monitoring Stack',
      status: 'healthy',
      uptime: 99.92,
      responseTime: 78,
      throughput: 567,
      errorRate: 0.08,
      lastCheck: '20 seconds ago',
      dependencies: ['Metrics DB', 'Alerting']
    }
  ];

  const healthTrends = [
    { period: 'Last Hour', availability: 99.2, performance: 95.8, errors: 0.8 },
    { period: 'Last 6 Hours', availability: 99.5, performance: 96.2, errors: 0.5 },
    { period: 'Last 24 Hours', availability: 99.1, performance: 94.9, errors: 0.9 },
    { period: 'Last Week', availability: 98.8, performance: 93.5, errors: 1.2 }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <Server className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComponentIcon = (name: string) => {
    if (name.includes('Web') || name.includes('API')) return <Globe className="h-5 w-5" />;
    if (name.includes('Database') || name.includes('Storage')) return <Database className="h-5 w-5" />;
    return <Server className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">98.5%</div>
              <div className="text-sm text-gray-600">Overall Health</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">6/6</div>
              <div className="text-sm text-gray-600">Components Up</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-gray-600">Warnings</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-sm text-gray-600">Critical Issues</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>System Components</span>
              <Button size="sm" variant="outline">
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemComponents.map((component) => (
                <Card 
                  key={component.id} 
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedComponent === component.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedComponent(component.id)}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {getComponentIcon(component.name)}
                        <h4 className="font-semibold">{component.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(component.status)}
                        <Badge className={getStatusColor(component.status)}>
                          {component.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Uptime</div>
                        <div className="text-gray-600">{component.uptime}%</div>
                      </div>
                      <div>
                        <div className="font-medium">Response Time</div>
                        <div className="text-gray-600">{component.responseTime}ms</div>
                      </div>
                      <div>
                        <div className="font-medium">Throughput</div>
                        <div className="text-gray-600">{component.throughput} req/min</div>
                      </div>
                      <div>
                        <div className="font-medium">Error Rate</div>
                        <div className="text-gray-600">{component.errorRate}%</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Health Score</span>
                        <span>{component.uptime}%</span>
                      </div>
                      <Progress 
                        value={component.uptime} 
                        className={`h-2 ${
                          component.uptime > 99 ? '[&>div]:bg-green-500' :
                          component.uptime > 95 ? '[&>div]:bg-yellow-500' :
                          '[&>div]:bg-red-500'
                        }`}
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Dependencies: {component.dependencies.join(', ')}</span>
                      <span>Last check: {component.lastCheck}</span>
                    </div>

                    <Button size="sm" variant="outline" className="w-full">
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Trends</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {healthTrends.map((trend, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-lg">
                <h4 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {trend.period}
                </h4>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Availability</span>
                      <span>{trend.availability}%</span>
                    </div>
                    <Progress value={trend.availability} className="h-2 [&>div]:bg-green-500" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Performance</span>
                      <span>{trend.performance}%</span>
                    </div>
                    <Progress value={trend.performance} className="h-2 [&>div]:bg-blue-500" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Error Rate</span>
                      <span>{trend.errors}%</span>
                    </div>
                    <Progress value={trend.errors} className="h-2 [&>div]:bg-red-500" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dependency Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
                <Globe className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <h4 className="font-semibold">Frontend Layer</h4>
                <p className="text-sm text-gray-600">Web Servers, CDN, Load Balancer</p>
                <Badge className="mt-2 bg-green-100 text-green-800">Healthy</Badge>
              </div>
            </div>

            <div className="text-center">
              <div className="p-4 border-2 border-yellow-200 rounded-lg bg-yellow-50">
                <Server className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
                <h4 className="font-semibold">Application Layer</h4>
                <p className="text-sm text-gray-600">API Gateway, Cache, Services</p>
                <Badge className="mt-2 bg-yellow-100 text-yellow-800">Warning</Badge>
              </div>
            </div>

            <div className="text-center">
              <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                <Database className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <h4 className="font-semibold">Data Layer</h4>
                <p className="text-sm text-gray-600">Database, Storage, Backup</p>
                <Badge className="mt-2 bg-blue-100 text-blue-800">Healthy</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
