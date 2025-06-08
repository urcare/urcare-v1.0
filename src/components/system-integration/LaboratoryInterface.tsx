
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TestTube, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  RefreshCw,
  Download,
  Eye,
  Filter,
  TrendingUp,
  Activity,
  FileText
} from 'lucide-react';

export const LaboratoryInterface = () => {
  const labSystems = [
    {
      name: 'Sunquest LIMS',
      status: 'connected',
      lastSync: '1 min ago',
      testsToday: 1247,
      criticalResults: 3,
      avgTurnaround: '2.4 hrs'
    },
    {
      name: 'Cerner PowerChart',
      status: 'connected',
      lastSync: '3 mins ago',
      testsToday: 856,
      criticalResults: 1,
      avgTurnaround: '1.8 hrs'
    },
    {
      name: 'Quest Diagnostics',
      status: 'warning',
      lastSync: '15 mins ago',
      testsToday: 423,
      criticalResults: 0,
      avgTurnaround: '4.2 hrs'
    }
  ];

  const criticalResults = [
    {
      id: 'CRIT001',
      patient: 'John Doe',
      mrn: '123456',
      test: 'Troponin I',
      result: '15.2 ng/mL',
      critical: 'HIGH',
      normalRange: '< 0.04 ng/mL',
      timestamp: '14:32:15',
      status: 'notified',
      physician: 'Dr. Smith'
    },
    {
      id: 'CRIT002',
      patient: 'Jane Smith',
      mrn: '789012',
      test: 'Potassium',
      result: '6.8 mEq/L',
      critical: 'HIGH',
      normalRange: '3.5-5.0 mEq/L',
      timestamp: '14:28:33',
      status: 'pending',
      physician: 'Dr. Johnson'
    },
    {
      id: 'CRIT003',
      patient: 'Mike Wilson',
      mrn: '345678',
      test: 'Glucose',
      result: '25 mg/dL',
      critical: 'LOW',
      normalRange: '70-100 mg/dL',
      timestamp: '14:25:47',
      status: 'acknowledged',
      physician: 'Dr. Brown'
    }
  ];

  const resultRouting = [
    {
      id: 'ROUTE001',
      testType: 'Chemistry Panel',
      source: 'Sunquest LIMS',
      destination: 'Epic EMR',
      status: 'active',
      processed: 1247,
      failed: 2,
      avgTime: '1.2 min'
    },
    {
      id: 'ROUTE002',
      testType: 'Microbiology',
      source: 'Cerner PowerChart',
      destination: 'Epic EMR',
      status: 'active',
      processed: 856,
      failed: 0,
      avgTime: '0.8 min'
    },
    {
      id: 'ROUTE003',
      testType: 'Pathology',
      source: 'Quest Diagnostics',
      destination: 'Cerner EHR',
      status: 'warning',
      processed: 423,
      failed: 12,
      avgTime: '3.4 min'
    }
  ];

  const qualityMetrics = [
    {
      metric: 'Turnaround Time',
      target: '< 4 hours',
      actual: '2.8 hours',
      status: 'good',
      trend: 'down'
    },
    {
      metric: 'Critical Result Notification',
      target: '< 15 minutes',
      actual: '8.2 minutes',
      status: 'excellent',
      trend: 'down'
    },
    {
      metric: 'Interface Uptime',
      target: '> 99%',
      actual: '99.7%',
      status: 'excellent',
      trend: 'stable'
    },
    {
      metric: 'Result Accuracy',
      target: '> 99.5%',
      actual: '99.8%',
      status: 'excellent',
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Laboratory Interface</h3>
          <p className="text-gray-600">Monitor lab result routing and critical value handling</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="critical">Critical Results</TabsTrigger>
          <TabsTrigger value="routing">Result Routing</TabsTrigger>
          <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Lab System Status */}
          <Card>
            <CardHeader>
              <CardTitle>Laboratory System Status</CardTitle>
              <CardDescription>Real-time status of connected laboratory systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {labSystems.map((system, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        system.status === 'connected' ? 'bg-green-500' : 'bg-orange-500'
                      }`} />
                      <div>
                        <h5 className="font-medium text-gray-900">{system.name}</h5>
                        <p className="text-sm text-gray-600">Last sync: {system.lastSync}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">{system.testsToday} tests today</span>
                          <span className="text-xs text-gray-500">Avg TAT: {system.avgTurnaround}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={`${
                        system.status === 'connected' ? 'border-green-500 text-green-700' : 'border-orange-500 text-orange-700'
                      }`}>
                        {system.status}
                      </Badge>
                      {system.criticalResults > 0 && (
                        <p className="text-xs text-red-600 mt-1">{system.criticalResults} critical results</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Today's Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4 text-center">
                <TestTube className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-900">2,526</p>
                <p className="text-sm text-blue-700">Tests Processed</p>
              </CardContent>
            </Card>
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-900">4</p>
                <p className="text-sm text-red-700">Critical Results</p>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-900">2.8</p>
                <p className="text-sm text-green-700">Avg TAT (hours)</p>
              </CardContent>
            </Card>
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-900">99.7%</p>
                <p className="text-sm text-purple-700">Interface Uptime</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Critical Results</CardTitle>
              <CardDescription>Critical lab values requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criticalResults.map((result, index) => (
                  <div key={index} className={`p-4 border-l-4 rounded ${
                    result.critical === 'HIGH' ? 'border-l-red-500 bg-red-50' : 'border-l-orange-500 bg-orange-50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900">{result.patient} (MRN: {result.mrn})</h5>
                        <p className="text-sm text-gray-600">{result.test}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={`${
                          result.status === 'notified' ? 'border-green-500 text-green-700' :
                          result.status === 'acknowledged' ? 'border-blue-500 text-blue-700' :
                          'border-orange-500 text-orange-700'
                        }`}>
                          {result.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{result.timestamp}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Result:</span>
                        <p className={`font-medium ${
                          result.critical === 'HIGH' ? 'text-red-600' : 'text-orange-600'
                        }`}>
                          {result.result} ({result.critical})
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Normal Range:</span>
                        <p className="font-medium">{result.normalRange}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Physician:</span>
                        <p className="font-medium">{result.physician}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {result.status === 'pending' && (
                        <>
                          <Button size="sm">Notify Physician</Button>
                          <Button size="sm" variant="outline">Acknowledge</Button>
                        </>
                      )}
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Result Routing</CardTitle>
              <CardDescription>Monitor test result routing and processing status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resultRouting.map((route, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900">{route.testType}</h5>
                        <p className="text-sm text-gray-600">{route.source} → {route.destination}</p>
                      </div>
                      <Badge variant="outline" className={`${
                        route.status === 'active' ? 'border-green-500 text-green-700' : 'border-orange-500 text-orange-700'
                      }`}>
                        {route.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <p className="text-blue-600 font-medium text-lg">{route.processed}</p>
                        <p className="text-gray-600">Processed</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded">
                        <p className="text-red-600 font-medium text-lg">{route.failed}</p>
                        <p className="text-gray-600">Failed</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <p className="text-green-600 font-medium text-lg">{route.avgTime}</p>
                        <p className="text-gray-600">Avg Time</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm">
                        <Activity className="h-4 w-4 mr-2" />
                        Monitor
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Logs
                      </Button>
                      {route.status === 'warning' && (
                        <Button variant="outline" size="sm">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Troubleshoot
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Assurance Metrics</CardTitle>
              <CardDescription>Track performance indicators and quality metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualityMetrics.map((metric, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900">{metric.metric}</h5>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${
                          metric.status === 'excellent' ? 'border-green-500 text-green-700' :
                          metric.status === 'good' ? 'border-blue-500 text-blue-700' :
                          'border-orange-500 text-orange-700'
                        }`}>
                          {metric.status}
                        </Badge>
                        {metric.trend === 'up' ? 
                          <TrendingUp className="h-4 w-4 text-green-600" /> :
                          metric.trend === 'down' ? 
                          <TrendingUp className="h-4 w-4 text-red-600 rotate-180" /> :
                          <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                        }
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Target:</span>
                        <p className="font-medium">{metric.target}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Actual:</span>
                        <p className={`font-medium ${
                          metric.status === 'excellent' ? 'text-green-600' :
                          metric.status === 'good' ? 'text-blue-600' :
                          'text-orange-600'
                        }`}>
                          {metric.actual}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${
                          metric.status === 'excellent' ? 'bg-green-600' :
                          metric.status === 'good' ? 'bg-blue-600' :
                          'bg-orange-600'
                        }`} style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
