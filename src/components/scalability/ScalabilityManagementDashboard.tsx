
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AutoScalingDashboard } from './AutoScalingDashboard';
import { LoadBalancerManagement } from './LoadBalancerManagement';
import { ResourceAllocationInterface } from './ResourceAllocationInterface';
import { GlobalTrafficManagement } from './GlobalTrafficManagement';
import { MicroservicesHealthMonitor } from './MicroservicesHealthMonitor';
import { 
  Activity, 
  BarChart3, 
  Globe, 
  Server, 
  Zap,
  TrendingUp,
  Shield,
  GitBranch,
  Gauge,
  Map
} from 'lucide-react';

export const ScalabilityManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('auto-scaling');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Activity className="h-8 w-8 text-blue-600" />
          Scalability Management System
          <TrendingUp className="h-8 w-8 text-green-600" />
        </h1>
        <p className="text-gray-600">
          Intelligent auto-scaling, load balancing, and resource optimization
        </p>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <Zap className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Auto-scaling</h3>
              <p className="text-sm text-gray-600">Smart resource scaling</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Shield className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Load Balancing</h3>
              <p className="text-sm text-gray-600">Traffic distribution</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <BarChart3 className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Resources</h3>
              <p className="text-sm text-gray-600">Capacity planning</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Globe className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">Global Traffic</h3>
              <p className="text-sm text-gray-600">CDN management</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <GitBranch className="h-8 w-8 mx-auto text-cyan-600 mb-2" />
              <h3 className="font-bold text-cyan-800">Microservices</h3>
              <p className="text-sm text-gray-600">Service health</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Gauge className="h-5 w-5 text-blue-600" />
              System Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">72%</div>
            <p className="text-sm text-gray-600">Current capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Server className="h-5 w-5 text-green-600" />
              Active Instances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">24</div>
            <p className="text-sm text-gray-600">Scaled instances</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-600" />
              Global Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">89ms</div>
            <p className="text-sm text-gray-600">Average response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-orange-600" />
              Service Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">98.9%</div>
            <p className="text-sm text-gray-600">Overall uptime</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="auto-scaling" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Auto-scaling</span>
          </TabsTrigger>
          <TabsTrigger value="load-balancer" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Load Balancer</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Resources</span>
          </TabsTrigger>
          <TabsTrigger value="global-traffic" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Global</span>
          </TabsTrigger>
          <TabsTrigger value="microservices" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            <span className="hidden sm:inline">Services</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="auto-scaling" className="space-y-6">
          <AutoScalingDashboard />
        </TabsContent>

        <TabsContent value="load-balancer" className="space-y-6">
          <LoadBalancerManagement />
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <ResourceAllocationInterface />
        </TabsContent>

        <TabsContent value="global-traffic" className="space-y-6">
          <GlobalTrafficManagement />
        </TabsContent>

        <TabsContent value="microservices" className="space-y-6">
          <MicroservicesHealthMonitor />
        </TabsContent>
      </Tabs>
    </div>
  );
};
