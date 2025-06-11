
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  GitBranch, 
  Activity, 
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Zap
} from 'lucide-react';

export const MicroservicesHealthMonitor = () => {
  const [selectedService, setSelectedService] = useState('user-service');

  const services = [
    {
      id: 'user-service',
      name: 'User Service',
      version: 'v2.1.4',
      status: 'healthy',
      instances: 6,
      healthyInstances: 6,
      responseTime: 45,
      errorRate: 0.02,
      uptime: 99.8,
      dependencies: ['auth-service', 'notification-service']
    },
    {
      id: 'auth-service',
      name: 'Authentication Service',
      version: 'v1.8.2',
      status: 'healthy',
      instances: 4,
      healthyInstances: 4,
      responseTime: 23,
      errorRate: 0.01,
      uptime: 99.9,
      dependencies: ['database', 'redis-cache']
    },
    {
      id: 'payment-service',
      name: 'Payment Service',
      version: 'v3.2.1',
      status: 'warning',
      instances: 3,
      healthyInstances: 2,
      responseTime: 156,
      errorRate: 2.1,
      uptime: 98.5,
      dependencies: ['user-service', 'notification-service', 'audit-service']
    },
    {
      id: 'notification-service',
      name: 'Notification Service',
      version: 'v1.5.3',
      status: 'healthy',
      instances: 5,
      healthyInstances: 5,
      responseTime: 67,
      errorRate: 0.15,
      uptime: 99.4,
      dependencies: ['queue-service']
    },
    {
      id: 'inventory-service',
      name: 'Inventory Service',
      version: 'v2.0.8',
      status: 'critical',
      instances: 2,
      healthyInstances: 0,
      responseTime: 0,
      errorRate: 100,
      uptime: 45.2,
      dependencies: ['database', 'cache-service']
    }
  ];

  const slaMetrics = [
    { service: 'User Service', sla: 99.9, current: 99.8, status: 'meeting' },
    { service: 'Auth Service', sla: 99.95, current: 99.9, status: 'at-risk' },
    { service: 'Payment Service', sla: 99.5, current: 98.5, status: 'breach' },
    { service: 'Notification Service', sla: 99.0, current: 99.4, status: 'exceeding' },
    { service: 'Inventory Service', sla: 99.0, current: 45.2, status: 'breach' }
  ];

  const circuitBreakers = [
    { service: 'payment-service → bank-api', status: 'open', failures: 15, threshold: 10 },
    { service: 'inventory-service → warehouse-api', status: 'open', failures: 25, threshold: 10 },
    { service: 'user-service → profile-api', status: 'closed', failures: 2, threshold: 10 },
    { service: 'auth-service → ldap', status: 'half-open', failures: 8, threshold: 10 }
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

  const getSLAColor = (status: string) => {
    switch (status) {
      case 'exceeding': return 'text-green-600';
      case 'meeting': return 'text-blue-600';
      case 'at-risk': return 'text-yellow-600';
      case 'breach': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCircuitBreakerColor = (status: string) => {
    switch (status) {
      case 'closed': return 'bg-green-100 text-green-800';
      case 'open': return 'bg-red-100 text-red-800';
      case 'half-open': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Microservices Health Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">17/20</div>
              <div className="text-sm text-gray-600">Healthy Services</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">64ms</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">99.1%</div>
              <div className="text-sm text-gray-600">Overall Uptime</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-gray-600">SLA Breaches</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Service Health Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {services.map((service) => (
                <Card 
                  key={service.id} 
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedService === service.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{service.name}</h4>
                        <div className="text-sm text-gray-600">{service.version}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(service.status)}
                        <Badge className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-3 text-sm">
                      <div>
                        <div className="font-medium">Instances</div>
                        <div className="text-gray-600">
                          {service.healthyInstances}/{service.instances}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Response</div>
                        <div className="text-gray-600">{service.responseTime}ms</div>
                      </div>
                      <div>
                        <div className="font-medium">Error Rate</div>
                        <div className="text-gray-600">{service.errorRate}%</div>
                      </div>
                      <div>
                        <div className="font-medium">Uptime</div>
                        <div className="text-gray-600">{service.uptime}%</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Health Score</span>
                        <span>{service.uptime}%</span>
                      </div>
                      <Progress 
                        value={service.uptime} 
                        className={`h-2 ${
                          service.uptime > 99 ? '[&>div]:bg-green-500' :
                          service.uptime > 95 ? '[&>div]:bg-yellow-500' :
                          '[&>div]:bg-red-500'
                        }`}
                      />
                    </div>

                    <div className="text-xs text-gray-500">
                      Dependencies: {service.dependencies.join(', ')}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Level Agreements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {slaMetrics.map((sla, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{sla.service}</h4>
                    <Badge className={
                      sla.status === 'exceeding' ? 'bg-green-100 text-green-800' :
                      sla.status === 'meeting' ? 'bg-blue-100 text-blue-800' :
                      sla.status === 'at-risk' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {sla.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                    <div>
                      <div className="text-gray-600">SLA Target</div>
                      <div className="font-medium">{sla.sla}%</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Current</div>
                      <div className={`font-medium ${getSLAColor(sla.status)}`}>
                        {sla.current}%
                      </div>
                    </div>
                  </div>

                  <Progress 
                    value={(sla.current / sla.sla) * 100} 
                    className={`h-2 ${
                      sla.current >= sla.sla ? '[&>div]:bg-green-500' :
                      sla.current >= sla.sla * 0.95 ? '[&>div]:bg-yellow-500' :
                      '[&>div]:bg-red-500'
                    }`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Circuit Breakers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {circuitBreakers.map((cb, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{cb.service}</div>
                    <div className="text-xs text-gray-600">
                      {cb.failures}/{cb.threshold} failures
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Progress 
                      value={(cb.failures / cb.threshold) * 100} 
                      className="w-16 h-2"
                    />
                    <Badge className={getCircuitBreakerColor(cb.status)}>
                      {cb.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Service Mesh Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">1,247</div>
                <div className="text-sm text-gray-600">Active Connections</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">15.2k</div>
                <div className="text-sm text-gray-600">Requests/min</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Success Rate</span>
                <span className="font-medium">98.7%</span>
              </div>
              <Progress value={98.7} className="h-2 [&>div]:bg-green-500" />
              
              <div className="flex justify-between">
                <span className="text-sm">P95 Latency</span>
                <span className="font-medium">89ms</span>
              </div>
              <Progress value={45} className="h-2 [&>div]:bg-blue-500" />
              
              <div className="flex justify-between">
                <span className="text-sm">Retry Rate</span>
                <span className="font-medium">2.1%</span>
              </div>
              <Progress value={21} className="h-2 [&>div]:bg-yellow-500" />
            </div>

            <Button className="w-full">View Service Topology</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
