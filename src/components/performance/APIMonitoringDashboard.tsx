
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react';

interface APIEndpoint {
  id: string;
  endpoint: string;
  method: string;
  responseTime: number;
  successRate: number;
  requestsPerMinute: number;
  status: 'healthy' | 'degraded' | 'down';
  errorCount: number;
}

export const APIMonitoringDashboard = () => {
  const [endpoints] = useState<APIEndpoint[]>([
    {
      id: '1',
      endpoint: '/api/v1/patients',
      method: 'GET',
      responseTime: 145,
      successRate: 99.8,
      requestsPerMinute: 340,
      status: 'healthy',
      errorCount: 2
    },
    {
      id: '2',
      endpoint: '/api/v1/appointments',
      method: 'POST',
      responseTime: 420,
      successRate: 97.5,
      requestsPerMinute: 180,
      status: 'degraded',
      errorCount: 8
    },
    {
      id: '3',
      endpoint: '/api/v1/medical-records',
      method: 'GET',
      responseTime: 890,
      successRate: 85.2,
      requestsPerMinute: 95,
      status: 'down',
      errorCount: 25
    },
    {
      id: '4',
      endpoint: '/api/v1/auth/login',
      method: 'POST',
      responseTime: 234,
      successRate: 99.9,
      requestsPerMinute: 120,
      status: 'healthy',
      errorCount: 0
    },
    {
      id: '5',
      endpoint: '/api/v1/prescriptions',
      method: 'GET',
      responseTime: 320,
      successRate: 98.7,
      requestsPerMinute: 210,
      status: 'healthy',
      errorCount: 3
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'down':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'down':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-100 text-blue-800';
      case 'POST':
        return 'bg-green-100 text-green-800';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRequests = endpoints.reduce((sum, ep) => sum + ep.requestsPerMinute, 0);
  const avgResponseTime = endpoints.reduce((sum, ep) => sum + ep.responseTime, 0) / endpoints.length;
  const healthyEndpoints = endpoints.filter(ep => ep.status === 'healthy').length;
  const totalErrors = endpoints.reduce((sum, ep) => sum + ep.errorCount, 0);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-600" />
            API Performance Monitoring
          </CardTitle>
          <CardDescription>
            Real-time monitoring of API endpoints and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Activity className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-600">{totalRequests}</div>
              <div className="text-sm text-gray-600">Requests/min</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Clock className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-600">{Math.round(avgResponseTime)}ms</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <CheckCircle className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-purple-600">{healthyEndpoints}/{endpoints.length}</div>
              <div className="text-sm text-gray-600">Healthy Endpoints</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <div className="text-2xl font-bold text-orange-600">{totalErrors}</div>
              <div className="text-sm text-gray-600">Total Errors</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Endpoints Status</CardTitle>
          <CardDescription>Current status and performance of all API endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {endpoints.map((endpoint) => (
              <Card key={endpoint.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(endpoint.status)}
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge className={getMethodColor(endpoint.method)}>
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm font-mono">{endpoint.endpoint}</code>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(endpoint.status)}>
                      {endpoint.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Response Time</span>
                        <span className="font-medium">{endpoint.responseTime}ms</span>
                      </div>
                      <Progress 
                        value={Math.min(100, (endpoint.responseTime / 1000) * 100)} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Success Rate</span>
                        <span className="font-medium">{endpoint.successRate}%</span>
                      </div>
                      <Progress 
                        value={endpoint.successRate} 
                        className="h-2 [&>div]:bg-green-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Requests/min</span>
                        <span className="font-medium">{endpoint.requestsPerMinute}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Traffic: {endpoint.requestsPerMinute > 200 ? 'High' : endpoint.requestsPerMinute > 100 ? 'Medium' : 'Low'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Errors (24h)</span>
                        <span className="font-medium text-red-600">{endpoint.errorCount}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Last error: {endpoint.errorCount > 0 ? '2 min ago' : 'None'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Error Logs
                    </Button>
                    {endpoint.status !== 'healthy' && (
                      <Button size="sm" variant="outline" className="text-red-600">
                        Troubleshoot
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Average Response Time</span>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">-12% vs last week</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">{Math.round(avgResponseTime)}ms</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Error Rate</span>
                  <div className="flex items-center gap-1 text-red-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">+5% vs last week</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-red-600">2.1%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border-l-4 border-l-red-500 bg-red-50">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="font-medium text-red-800">Critical</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  Medical records API showing high error rate (15%)
                </p>
              </div>
              
              <div className="p-3 border-l-4 border-l-yellow-500 bg-yellow-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium text-yellow-800">Warning</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Appointments API response time above threshold (420ms)
                </p>
              </div>
              
              <div className="p-3 border-l-4 border-l-blue-500 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-blue-800">Info</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Patient API showing improved performance (+15%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
