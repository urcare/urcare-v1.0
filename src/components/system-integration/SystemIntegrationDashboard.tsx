
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Link, 
  Settings, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  Shield, 
  Zap,
  Network,
  FileText,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit
} from 'lucide-react';
import { IntegrationMonitoring } from './IntegrationMonitoring';
import { APIConfiguration } from './APIConfiguration';
import { HL7MessageViewer } from './HL7MessageViewer';
import { EHRSynchronization } from './EHRSynchronization';
import { InsuranceVerification } from './InsuranceVerification';
import { LaboratoryInterface } from './LaboratoryInterface';

export const SystemIntegrationDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const integrationMetrics = {
    totalConnections: 47,
    activeConnections: 42,
    errorConnections: 3,
    pendingMessages: 156,
    processedToday: 2847,
    avgResponseTime: 245,
    uptime: 99.8,
    criticalAlerts: 2
  };

  const recentActivities = [
    {
      id: '1',
      type: 'HL7',
      message: 'ADT^A08 message processed',
      status: 'success',
      timestamp: '2 mins ago',
      source: 'EMR-EPIC'
    },
    {
      id: '2',
      type: 'FHIR',
      message: 'Patient resource updated',
      status: 'success',
      timestamp: '5 mins ago',
      source: 'EHR-CERNER'
    },
    {
      id: '3',
      type: 'LAB',
      message: 'Critical result alert sent',
      status: 'warning',
      timestamp: '8 mins ago',
      source: 'LIMS-SUNQUEST'
    },
    {
      id: '4',
      type: 'INSURANCE',
      message: 'Eligibility verification failed',
      status: 'error',
      timestamp: '12 mins ago',
      source: 'PAYER-ANTHEM'
    }
  ];

  const connectionStatus = [
    {
      name: 'Epic EMR',
      type: 'HL7',
      status: 'connected',
      lastSync: '2 mins ago',
      messages: 1247,
      errors: 0
    },
    {
      name: 'Cerner EHR',
      type: 'FHIR',
      status: 'connected',
      lastSync: '1 min ago',
      messages: 856,
      errors: 0
    },
    {
      name: 'Sunquest LIMS',
      type: 'API',
      status: 'connected',
      lastSync: '3 mins ago',
      messages: 423,
      errors: 1
    },
    {
      name: 'Anthem Payer',
      type: 'REST',
      status: 'error',
      lastSync: '15 mins ago',
      messages: 67,
      errors: 5
    },
    {
      name: 'Quest Diagnostics',
      type: 'HL7',
      status: 'connected',
      lastSync: '1 min ago',
      messages: 234,
      errors: 0
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Integration Hub</h1>
          <p className="text-gray-600 mt-2">Centralized monitoring and management of all system integrations</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh All
          </Button>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Settings className="h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="hl7-fhir">HL7/FHIR</TabsTrigger>
          <TabsTrigger value="ehr-sync">EHR Sync</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Network className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{integrationMetrics.totalConnections}</p>
                    <p className="text-sm text-blue-700">Total Connections</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-900">{integrationMetrics.activeConnections}</p>
                    <p className="text-sm text-green-700">Active Connections</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-900">{integrationMetrics.errorConnections}</p>
                    <p className="text-sm text-red-700">Error Connections</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Activity className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-900">{integrationMetrics.processedToday}</p>
                    <p className="text-sm text-purple-700">Messages Today</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Status Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Connection Status</CardTitle>
                <CardDescription>Real-time status of all system integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {connectionStatus.map((connection, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          connection.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <h5 className="font-medium text-gray-900">{connection.name}</h5>
                          <p className="text-sm text-gray-600">{connection.type} • {connection.lastSync}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={`${
                          connection.status === 'connected' ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700'
                        }`}>
                          {connection.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{connection.messages} msgs</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest integration events and messages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className={`flex items-center gap-3 p-3 border-l-4 rounded ${
                      activity.status === 'success' ? 'border-l-green-500 bg-green-50' :
                      activity.status === 'warning' ? 'border-l-orange-500 bg-orange-50' :
                      'border-l-red-500 bg-red-50'
                    }`}>
                      <div className={`p-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-100' :
                        activity.status === 'warning' ? 'bg-orange-100' :
                        'bg-red-100'
                      }`}>
                        <FileText className={`h-4 w-4 ${
                          activity.status === 'success' ? 'text-green-600' :
                          activity.status === 'warning' ? 'text-orange-600' :
                          'text-red-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-600">{activity.source} • {activity.timestamp}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{integrationMetrics.avgResponseTime}ms</p>
                <p className="text-sm text-gray-600">Avg Response Time</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{integrationMetrics.uptime}%</p>
                <p className="text-sm text-gray-600">System Uptime</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Database className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{integrationMetrics.pendingMessages}</p>
                <p className="text-sm text-gray-600">Pending Messages</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{integrationMetrics.criticalAlerts}</p>
                <p className="text-sm text-gray-600">Critical Alerts</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring">
          <IntegrationMonitoring />
        </TabsContent>

        <TabsContent value="configuration">
          <APIConfiguration />
        </TabsContent>

        <TabsContent value="hl7-fhir">
          <HL7MessageViewer />
        </TabsContent>

        <TabsContent value="ehr-sync">
          <EHRSynchronization />
        </TabsContent>

        <TabsContent value="insurance">
          <InsuranceVerification />
        </TabsContent>
      </Tabs>
    </div>
  );
};
