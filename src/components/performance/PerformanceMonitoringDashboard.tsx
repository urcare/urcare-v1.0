
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RealTimeMetricsDashboard } from './RealTimeMetricsDashboard';
import { DatabaseQueryAnalyzer } from './DatabaseQueryAnalyzer';
import { APIMonitoringDashboard } from './APIMonitoringDashboard';
import { UserSessionAnalytics } from './UserSessionAnalytics';
import { AlertManagementInterface } from './AlertManagementInterface';
import { PerformanceChartsInterface } from './PerformanceChartsInterface';
import { 
  Monitor, 
  Activity, 
  Database, 
  Globe, 
  Users, 
  Bell,
  BarChart3,
  Zap,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export const PerformanceMonitoringDashboard = () => {
  const [activeTab, setActiveTab] = useState('metrics');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Monitor className="h-8 w-8 text-blue-600" />
          Performance Monitoring System
          <Activity className="h-8 w-8 text-purple-600" />
        </h1>
        <p className="text-gray-600">
          Real-time system monitoring with comprehensive analytics and alerting
        </p>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <Activity className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Real-time</h3>
              <p className="text-sm text-gray-600">Live metrics</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <BarChart3 className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Charts</h3>
              <p className="text-sm text-gray-600">Performance graphs</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Database className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Database</h3>
              <p className="text-sm text-gray-600">Query analysis</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Globe className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">API</h3>
              <p className="text-sm text-gray-600">Endpoint monitoring</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Users className="h-8 w-8 mx-auto text-cyan-600 mb-2" />
              <h3 className="font-bold text-cyan-800">Users</h3>
              <p className="text-sm text-gray-600">Session analytics</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Bell className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Alerts</h3>
              <p className="text-sm text-gray-600">Notification center</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98.7%</div>
            <p className="text-sm text-gray-600">Overall uptime</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">245ms</div>
            <p className="text-sm text-gray-600">Average API response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">1,247</div>
            <p className="text-sm text-gray-600">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">3</div>
            <p className="text-sm text-gray-600">Requiring attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Metrics</span>
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Charts</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Database</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          <RealTimeMetricsDashboard />
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <PerformanceChartsInterface />
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <DatabaseQueryAnalyzer />
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <APIMonitoringDashboard />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UserSessionAnalytics />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <AlertManagementInterface />
        </TabsContent>
      </Tabs>
    </div>
  );
};
