
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Server, 
  Activity, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  Database
} from 'lucide-react';

interface SystemMetrics {
  id: string;
  component: string;
  type: 'server' | 'database' | 'network' | 'application' | 'storage';
  currentLoad: number;
  averageLoad: number;
  maxCapacity: number;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  responseTime: number;
  uptime: number;
  location: string;
  lastUpdate: string;
  recommendations: string[];
}

interface LoadOptimization {
  id: string;
  system: string;
  action: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  priority: number;
  estimatedImprovement: number;
  implementation: string;
  resourcesRequired: string[];
  timeline: string;
  status: 'pending' | 'in_progress' | 'completed' | 'scheduled';
}

interface PerformanceAlert {
  id: string;
  system: string;
  alertType: 'high_load' | 'slow_response' | 'downtime' | 'capacity_limit' | 'resource_exhaustion';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  affectedUsers: number;
  status: 'active' | 'acknowledged' | 'resolved';
  resolution?: string;
}

const mockMetrics: SystemMetrics[] = [
  {
    id: 'SM001',
    component: 'EMR Application Server',
    type: 'application',
    currentLoad: 78,
    averageLoad: 65,
    maxCapacity: 100,
    status: 'warning',
    responseTime: 245,
    uptime: 99.2,
    location: 'Data Center A',
    lastUpdate: '2024-01-20 16:45:00',
    recommendations: ['Scale horizontally', 'Optimize database queries', 'Implement caching']
  },
  {
    id: 'SM002',
    component: 'Patient Database',
    type: 'database',
    currentLoad: 92,
    averageLoad: 75,
    maxCapacity: 100,
    status: 'critical',
    responseTime: 1250,
    uptime: 98.8,
    location: 'Data Center B',
    lastUpdate: '2024-01-20 16:46:00',
    recommendations: ['Immediate capacity upgrade', 'Archive old records', 'Optimize indexing']
  },
  {
    id: 'SM003',
    component: 'Network Infrastructure',
    type: 'network',
    currentLoad: 45,
    averageLoad: 52,
    maxCapacity: 100,
    status: 'healthy',
    responseTime: 15,
    uptime: 99.9,
    location: 'Network Core',
    lastUpdate: '2024-01-20 16:45:30',
    recommendations: ['Performance is optimal']
  },
  {
    id: 'SM004',
    component: 'Backup Storage',
    type: 'storage',
    currentLoad: 85,
    averageLoad: 72,
    maxCapacity: 100,
    status: 'warning',
    responseTime: 890,
    uptime: 99.5,
    location: 'Storage Array 1',
    lastUpdate: '2024-01-20 16:44:45',
    recommendations: ['Add storage capacity', 'Implement tiered storage', 'Archive old backups']
  }
];

const mockOptimizations: LoadOptimization[] = [
  {
    id: 'LO001',
    system: 'Patient Database',
    action: 'Implement database sharding and read replicas',
    impact: 'critical',
    priority: 1,
    estimatedImprovement: 40,
    implementation: 'Deploy additional database instances with read replicas',
    resourcesRequired: ['2 additional servers', 'Database licenses', '8 hours engineering time'],
    timeline: '48 hours',
    status: 'in_progress'
  },
  {
    id: 'LO002',
    system: 'EMR Application Server',
    action: 'Enable application caching and optimize queries',
    impact: 'high',
    priority: 2,
    estimatedImprovement: 25,
    implementation: 'Deploy Redis cache and optimize database queries',
    resourcesRequired: ['Redis cluster', '4 hours engineering time'],
    timeline: '24 hours',
    status: 'scheduled'
  },
  {
    id: 'LO003',
    system: 'Backup Storage',
    action: 'Implement automated data archiving',
    impact: 'medium',
    priority: 3,
    estimatedImprovement: 20,
    implementation: 'Set up automated archiving for data older than 2 years',
    resourcesRequired: ['Archive storage', '6 hours engineering time'],
    timeline: '72 hours',
    status: 'pending'
  }
];

const mockAlerts: PerformanceAlert[] = [
  {
    id: 'PA001',
    system: 'Patient Database',
    alertType: 'high_load',
    severity: 'critical',
    description: 'Database CPU utilization exceeding 90% for 15+ minutes',
    timestamp: '2024-01-20 16:30:00',
    affectedUsers: 150,
    status: 'active'
  },
  {
    id: 'PA002',
    system: 'EMR Application Server',
    alertType: 'slow_response',
    severity: 'high',
    description: 'Average response time increased to 245ms (threshold: 200ms)',
    timestamp: '2024-01-20 16:25:00',
    affectedUsers: 75,
    status: 'acknowledged'
  },
  {
    id: 'PA003',
    system: 'Backup Storage',
    alertType: 'capacity_limit',
    severity: 'medium',
    description: 'Storage utilization at 85% - approaching capacity limit',
    timestamp: '2024-01-20 16:20:00',
    affectedUsers: 0,
    status: 'resolved',
    resolution: 'Temporary cleanup completed, permanent solution scheduled'
  }
];

export const SystemLoadBalancer = () => {
  const [metrics] = useState<SystemMetrics[]>(mockMetrics);
  const [optimizations] = useState<LoadOptimization[]>(mockOptimizations);
  const [alerts] = useState<PerformanceAlert[]>(mockAlerts);
  const [selectedMetric, setSelectedMetric] = useState<SystemMetrics | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLoadColor = (load: number) => {
    if (load >= 90) return 'text-red-600';
    if (load >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'critical': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'critical': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getAlertStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500 text-white';
      case 'acknowledged': return 'bg-yellow-500 text-white';
      case 'resolved': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'server': return Server;
      case 'database': return Database;
      case 'network': return Wifi;
      case 'application': return Monitor;
      case 'storage': return HardDrive;
      default: return Activity;
    }
  };

  const calculateOverallHealth = () => {
    const totalSystems = metrics.length;
    const healthySystems = metrics.filter(m => m.status === 'healthy').length;
    return Math.round((healthySystems / totalSystems) * 100);
  };

  const getAverageLoad = () => {
    return Math.round(metrics.reduce((sum, metric) => sum + metric.currentLoad, 0) / metrics.length);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Load Balancer
          </CardTitle>
          <CardDescription>
            Real-time performance monitoring, resource allocation, and intelligent optimization recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Activity className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{getAverageLoad()}%</p>
                  <p className="text-sm text-gray-600">Average Load</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{calculateOverallHealth()}%</p>
                  <p className="text-sm text-gray-600">System Health</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {alerts.filter(a => a.status === 'active').length}
                  </p>
                  <p className="text-sm text-gray-600">Active Alerts</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-purple-200 bg-purple-50">
              <div className="flex items-center gap-2">
                <Zap className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">{optimizations.length}</p>
                  <p className="text-sm text-gray-600">Optimizations</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">System Metrics</h3>
              {metrics.map((metric) => {
                const IconComponent = getTypeIcon(metric.type);
                return (
                  <Card 
                    key={metric.id} 
                    className={`cursor-pointer transition-colors ${selectedMetric?.id === metric.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-blue-400`}
                    onClick={() => setSelectedMetric(metric)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-start gap-3">
                          <IconComponent className="h-8 w-8 text-blue-600 mt-1" />
                          <div>
                            <h4 className="font-semibold mb-1">{metric.component}</h4>
                            <p className="text-sm text-gray-600 mb-1">{metric.location}</p>
                            <p className="text-xs text-gray-500">Last update: {metric.lastUpdate}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(metric.status)}>
                          {metric.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Current Load</span>
                          <span className={`font-bold ${getLoadColor(metric.currentLoad)}`}>
                            {metric.currentLoad}%
                          </span>
                        </div>
                        <Progress value={metric.currentLoad} className="h-2" />
                        
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-gray-600">Average</p>
                            <p className="font-semibold">{metric.averageLoad}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Response</p>
                            <p className="font-semibold">{metric.responseTime}ms</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Uptime</p>
                            <p className="font-semibold text-green-600">{metric.uptime}%</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div>
              {selectedMetric ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedMetric.component} - Performance Details</CardTitle>
                    <CardDescription>Comprehensive performance analysis and optimization recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">System Information</h4>
                          <div className="space-y-1 text-sm">
                            <p>Type: <strong>{selectedMetric.type}</strong></p>
                            <p>Location: <strong>{selectedMetric.location}</strong></p>
                            <p>Status: <strong className={selectedMetric.status === 'critical' ? 'text-red-600' : 
                              selectedMetric.status === 'warning' ? 'text-yellow-600' : 'text-green-600'}>
                              {selectedMetric.status}
                            </strong></p>
                            <p>Last Update: <strong>{selectedMetric.lastUpdate}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Performance Metrics</h4>
                          <div className="space-y-1 text-sm">
                            <p>Current Load: <strong className={getLoadColor(selectedMetric.currentLoad)}>
                              {selectedMetric.currentLoad}%
                            </strong></p>
                            <p>Average Load: <strong>{selectedMetric.averageLoad}%</strong></p>
                            <p>Max Capacity: <strong>{selectedMetric.maxCapacity}%</strong></p>
                            <p>Response Time: <strong>{selectedMetric.responseTime}ms</strong></p>
                            <p>Uptime: <strong className="text-green-600">{selectedMetric.uptime}%</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Load Analysis</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Current Load</span>
                            <span className={`font-bold ${getLoadColor(selectedMetric.currentLoad)}`}>
                              {selectedMetric.currentLoad}%
                            </span>
                          </div>
                          <Progress value={selectedMetric.currentLoad} className="h-2" />
                          
                          <div className="flex items-center gap-2 text-sm mt-1">
                            {selectedMetric.currentLoad > selectedMetric.averageLoad ? (
                              <>
                                <TrendingUp className="h-4 w-4 text-red-600" />
                                <span className="text-red-600">
                                  {selectedMetric.currentLoad - selectedMetric.averageLoad}% above average
                                </span>
                              </>
                            ) : (
                              <>
                                <TrendingDown className="h-4 w-4 text-green-600" />
                                <span className="text-green-600">
                                  {selectedMetric.averageLoad - selectedMetric.currentLoad}% below average
                                </span>
                              </>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between text-sm mt-3">
                            <span>Capacity Utilization</span>
                            <span className="font-bold">
                              {Math.round((selectedMetric.currentLoad / selectedMetric.maxCapacity) * 100)}%
                            </span>
                          </div>
                          <Progress 
                            value={(selectedMetric.currentLoad / selectedMetric.maxCapacity) * 100}
                            className="h-2"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Optimization Recommendations</h4>
                        <div className="space-y-2">
                          {selectedMetric.recommendations.map((recommendation, index) => (
                            <div key={index} className="text-sm bg-blue-50 p-2 rounded">
                              <div className="flex items-start gap-2">
                                {recommendation === 'Performance is optimal' ? (
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                ) : (
                                  <Zap className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                )}
                                <span className={recommendation === 'Performance is optimal' ? 'text-green-700' : 'text-blue-700'}>
                                  {recommendation}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <Server className="h-4 w-4 mr-1" />
                          Resource Manager
                        </Button>
                        <Button variant="outline">
                          <Activity className="h-4 w-4 mr-1" />
                          View Trends
                        </Button>
                        <Button variant="outline">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Set Alerts
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select a system to view detailed performance metrics and optimization recommendations</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Optimization Recommendations</CardTitle>
                <CardDescription>Intelligent recommendations for improving system performance and resource allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimizations.map((opt) => (
                    <div key={opt.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-medium">{opt.system}</h5>
                          <p className="text-sm">{opt.action}</p>
                        </div>
                        <Badge className={getImpactColor(opt.impact)}>
                          {opt.impact}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                        <div>
                          <p className="text-gray-600">Priority</p>
                          <p className="font-medium">{opt.priority}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Improvement</p>
                          <p className="font-medium text-green-600">{opt.estimatedImprovement}%</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button size="sm">
                          {opt.status === 'pending' && "Approve"}
                          {opt.status === 'scheduled' && "Start Now"}
                          {opt.status === 'in_progress' && "View Progress"}
                          {opt.status === 'completed' && "View Results"}
                        </Button>
                        <p className="text-xs text-gray-500">Timeline: {opt.timeline}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Alerts</CardTitle>
                <CardDescription>Critical system performance issues requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                        alert.severity === 'critical' ? 'text-red-600' :
                        alert.severity === 'high' ? 'text-orange-600' :
                        alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm">{alert.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {alert.system} • {alert.timestamp}
                            </p>
                            {alert.affectedUsers > 0 && (
                              <p className="text-xs text-red-600 mt-1">
                                {alert.affectedUsers} users affected
                              </p>
                            )}
                            {alert.resolution && (
                              <p className="text-xs text-green-600 mt-1">
                                Resolution: {alert.resolution}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            <Badge className={getAlertStatusColor(alert.status)}>
                              {alert.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
