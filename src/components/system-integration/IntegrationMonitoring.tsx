
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  Filter,
  Download,
  Search,
  Settings,
  TrendingUp,
  TrendingDown,
  Zap,
  Database
} from 'lucide-react';

export const IntegrationMonitoring = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const messageQueue = [
    {
      id: 'MSG001',
      type: 'HL7 ADT',
      source: 'Epic EMR',
      destination: 'HIMS',
      status: 'processing',
      priority: 'normal',
      timestamp: '14:32:15',
      retries: 0
    },
    {
      id: 'MSG002',
      type: 'FHIR Patient',
      source: 'Cerner EHR',
      destination: 'Analytics DB',
      status: 'completed',
      priority: 'normal',
      timestamp: '14:31:45',
      retries: 0
    },
    {
      id: 'MSG003',
      type: 'Lab Result',
      source: 'Sunquest LIMS',
      destination: 'EMR',
      status: 'failed',
      priority: 'critical',
      timestamp: '14:30:22',
      retries: 2
    },
    {
      id: 'MSG004',
      type: 'Insurance Verify',
      source: 'Registration',
      destination: 'Anthem API',
      status: 'pending',
      priority: 'high',
      timestamp: '14:29:33',
      retries: 1
    }
  ];

  const errorLogs = [
    {
      id: 'ERR001',
      timestamp: '14:30:22',
      system: 'Sunquest LIMS',
      error: 'Connection timeout',
      severity: 'high',
      message: 'Failed to establish connection to LIMS after 30 seconds',
      resolution: 'Retry scheduled'
    },
    {
      id: 'ERR002',
      timestamp: '14:25:15',
      system: 'Anthem API',
      error: 'Authentication failed',
      severity: 'medium',
      message: 'Invalid API credentials provided',
      resolution: 'Credentials refreshed'
    },
    {
      id: 'ERR003',
      timestamp: '14:20:08',
      system: 'Epic EMR',
      error: 'Rate limit exceeded',
      severity: 'low',
      message: 'API rate limit of 1000 requests per minute exceeded',
      resolution: 'Throttling applied'
    }
  ];

  const performanceMetrics = [
    {
      name: 'Messages Per Minute',
      current: 47,
      trend: 'up',
      change: '+12%'
    },
    {
      name: 'Average Latency',
      current: '245ms',
      trend: 'down',
      change: '-8%'
    },
    {
      name: 'Success Rate',
      current: '98.7%',
      trend: 'up',
      change: '+0.3%'
    },
    {
      name: 'Queue Length',
      current: 156,
      trend: 'down',
      change: '-23%'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Integration Monitoring</h3>
          <p className="text-gray-600">Real-time monitoring of message processing and system health</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.current}</p>
                </div>
                <div className={`flex items-center gap-1 ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="text-sm">{metric.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="queue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="queue">Message Queue</TabsTrigger>
          <TabsTrigger value="errors">Error Logs</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Message Queue</CardTitle>
              <CardDescription>Real-time view of message processing status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {messageQueue.map((message, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        message.status === 'completed' ? 'bg-green-100' :
                        message.status === 'processing' ? 'bg-blue-100' :
                        message.status === 'failed' ? 'bg-red-100' :
                        'bg-orange-100'
                      }`}>
                        {message.status === 'completed' ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                         message.status === 'processing' ? <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" /> :
                         message.status === 'failed' ? <AlertTriangle className="h-4 w-4 text-red-600" /> :
                         <Clock className="h-4 w-4 text-orange-600" />}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{message.id}</h5>
                        <p className="text-sm text-gray-600">{message.type}</p>
                        <p className="text-xs text-gray-500">{message.source} → {message.destination}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={`${
                        message.priority === 'critical' ? 'border-red-500 text-red-700' :
                        message.priority === 'high' ? 'border-orange-500 text-orange-700' :
                        'border-gray-500 text-gray-700'
                      }`}>
                        {message.priority}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                      {message.retries > 0 && (
                        <p className="text-xs text-red-600">Retries: {message.retries}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Logs</CardTitle>
              <CardDescription>Integration errors and resolution status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {errorLogs.map((error, index) => (
                  <div key={index} className={`p-4 border-l-4 rounded ${
                    error.severity === 'high' ? 'border-l-red-500 bg-red-50' :
                    error.severity === 'medium' ? 'border-l-orange-500 bg-orange-50' :
                    'border-l-yellow-500 bg-yellow-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-gray-900">{error.error}</h5>
                          <Badge variant="outline" className={`text-xs ${
                            error.severity === 'high' ? 'border-red-500 text-red-700' :
                            error.severity === 'medium' ? 'border-orange-500 text-orange-700' :
                            'border-yellow-500 text-yellow-700'
                          }`}>
                            {error.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">{error.message}</p>
                        <p className="text-xs text-gray-600">{error.system} • {error.timestamp}</p>
                        <p className="text-xs text-green-600 mt-1">Resolution: {error.resolution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Throughput Analysis</CardTitle>
                <CardDescription>Message processing rates over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-700">Peak Hourly Rate</span>
                    </div>
                    <span className="font-medium">2,847 msgs/hr</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-gray-700">Current Queue Size</span>
                    </div>
                    <span className="font-medium">156 messages</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-purple-600" />
                      <span className="text-sm text-gray-700">Processing Speed</span>
                    </div>
                    <span className="font-medium">47 msgs/min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Load</CardTitle>
                <CardDescription>Resource utilization and capacity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span>67%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>82%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Network I/O</span>
                      <span>45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
