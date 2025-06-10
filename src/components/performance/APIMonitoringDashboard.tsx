
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Globe, Clock, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export const APIMonitoringDashboard = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('all');

  const apiEndpoints = [
    {
      endpoint: '/api/patients',
      method: 'GET',
      avgResponseTime: 145,
      requests24h: 12456,
      errorRate: 0.02,
      status: 'healthy',
      uptime: 99.9
    },
    {
      endpoint: '/api/appointments',
      method: 'POST',
      avgResponseTime: 234,
      requests24h: 8934,
      errorRate: 0.15,
      status: 'warning',
      uptime: 99.5
    },
    {
      endpoint: '/api/medical-records',
      method: 'GET',
      avgResponseTime: 89,
      requests24h: 15678,
      errorRate: 0.01,
      status: 'healthy',
      uptime: 99.8
    }
  ];

  const statusCodes = [
    { code: '200', count: 45678, percentage: 95.2 },
    { code: '404', count: 1234, percentage: 2.6 },
    { code: '500', count: 567, percentage: 1.2 },
    { code: '401', count: 234, percentage: 0.5 },
    { code: '403', count: 123, percentage: 0.3 },
    { code: '429', count: 89, percentage: 0.2 }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
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

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            API Monitoring Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">47,892</div>
              <div className="text-sm text-gray-600">Total Requests (24h)</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">156ms</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">0.08%</div>
              <div className="text-sm text-gray-600">Error Rate</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">99.7%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Endpoints Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiEndpoints.map((api, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-mono text-sm">{api.endpoint}</div>
                        <Badge variant="outline" className="text-xs">{api.method}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(api.status)}
                        <Badge className={getStatusColor(api.status)}>
                          {api.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{api.avgResponseTime}ms avg</span>
                        </div>
                        <div className="text-gray-600">{api.requests24h.toLocaleString()} requests</div>
                      </div>
                      <div>
                        <div className="text-right">
                          <div className={`font-bold ${api.errorRate > 0.1 ? 'text-red-600' : 'text-green-600'}`}>
                            {api.errorRate}% errors
                          </div>
                          <div className="text-gray-600">{api.uptime}% uptime</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>HTTP Status Code Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statusCodes.map((status, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant={status.code.startsWith('2') ? 'default' : 
                                   status.code.startsWith('4') ? 'secondary' : 'destructive'}>
                        {status.code}
                      </Badge>
                      <span className="text-sm">{status.count.toLocaleString()} requests</span>
                    </div>
                    <span className="text-sm font-medium">{status.percentage}%</span>
                  </div>
                  <Progress 
                    value={status.percentage} 
                    className={`h-2 ${
                      status.code.startsWith('2') ? '[&>div]:bg-green-500' :
                      status.code.startsWith('4') ? '[&>div]:bg-yellow-500' :
                      '[&>div]:bg-red-500'
                    }`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Geographic Response Times</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold">North America</h4>
              <div className="text-2xl font-bold text-blue-600">124ms</div>
              <div className="text-sm text-gray-600">Average response time</div>
              <Progress value={75} className="mt-2 h-2 [&>div]:bg-blue-500" />
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold">Europe</h4>
              <div className="text-2xl font-bold text-green-600">189ms</div>
              <div className="text-sm text-gray-600">Average response time</div>
              <Progress value={60} className="mt-2 h-2 [&>div]:bg-green-500" />
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold">Asia Pacific</h4>
              <div className="text-2xl font-bold text-orange-600">267ms</div>
              <div className="text-sm text-gray-600">Average response time</div>
              <Progress value={45} className="mt-2 h-2 [&>div]:bg-orange-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
