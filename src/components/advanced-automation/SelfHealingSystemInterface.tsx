
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wrench,
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Zap,
  Server,
  Database,
  Network,
  Clock
} from 'lucide-react';

export const SelfHealingSystemInterface = () => {
  const [healingInProgress, setHealingInProgress] = useState(false);

  const systemHealth = [
    {
      component: 'Patient Database',
      status: 'healthy',
      uptime: '99.9%',
      lastIssue: 'None',
      autoHealing: true,
      responseTime: '245ms'
    },
    {
      component: 'Authentication Service',
      status: 'warning',
      uptime: '98.2%',
      lastIssue: '2 hours ago',
      autoHealing: true,
      responseTime: '156ms'
    },
    {
      component: 'Billing System',
      status: 'healthy',
      uptime: '99.7%',
      lastIssue: '1 day ago',
      autoHealing: true,
      responseTime: '302ms'
    },
    {
      component: 'Laboratory Interface',
      status: 'critical',
      uptime: '95.1%',
      lastIssue: '15 min ago',
      autoHealing: false,
      responseTime: '1.2s'
    }
  ];

  const healingActions = [
    {
      id: 1,
      timestamp: '2024-06-09 14:25',
      component: 'Authentication Service',
      issue: 'High memory usage detected (>85%)',
      action: 'Automatically restarted service instances',
      status: 'completed',
      duration: '2.3 min'
    },
    {
      id: 2,
      timestamp: '2024-06-09 14:15',
      component: 'Patient Database',
      issue: 'Connection pool exhaustion',
      action: 'Increased connection pool size and cleared stale connections',
      status: 'completed',
      duration: '1.8 min'
    },
    {
      id: 3,
      timestamp: '2024-06-09 14:10',
      component: 'Laboratory Interface',
      issue: 'API timeout errors increasing',
      action: 'Failed to auto-resolve - Manual intervention required',
      status: 'failed',
      duration: '5 min'
    }
  ];

  const monitoringAlerts = [
    {
      id: 1,
      severity: 'warning',
      component: 'Authentication Service',
      message: 'Response time degradation detected',
      detected: '2024-06-09 14:30',
      threshold: '500ms',
      current: '650ms',
      autoResolve: true
    },
    {
      id: 2,
      severity: 'critical',
      component: 'Laboratory Interface',
      message: 'Service unavailable - Connection refused',
      detected: '2024-06-09 14:25',
      threshold: '99% uptime',
      current: '95.1% uptime',
      autoResolve: false
    },
    {
      id: 3,
      severity: 'info',
      component: 'Billing System',
      message: 'Scheduled maintenance completed successfully',
      detected: '2024-06-09 14:20',
      threshold: 'N/A',
      current: 'Healthy',
      autoResolve: true
    }
  ];

  const getHealthColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getComponentIcon = (component) => {
    if (component.includes('Database')) return <Database className="h-5 w-5" />;
    if (component.includes('Service') || component.includes('System')) return <Server className="h-5 w-5" />;
    if (component.includes('Interface')) return <Network className="h-5 w-5" />;
    return <Activity className="h-5 w-5" />;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">98.7%</div>
            <div className="text-sm text-gray-600">System Health</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">23</div>
            <div className="text-sm text-gray-600">Auto-Healed Issues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">3.2min</div>
            <div className="text-sm text-gray-600">Avg Recovery Time</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">1</div>
            <div className="text-sm text-gray-600">Manual Interventions</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="health" className="w-full">
        <TabsList>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="healing">Healing Actions</TabsTrigger>
          <TabsTrigger value="alerts">Monitoring Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-4">
          {/* System Health Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Real-Time System Health Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemHealth.map((system, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getComponentIcon(system.component)}
                      <div>
                        <div className="font-medium">{system.component}</div>
                        <div className="text-sm text-gray-600">
                          Uptime: {system.uptime} • Response: {system.responseTime}
                        </div>
                        <div className="text-xs text-gray-500">
                          Last issue: {system.lastIssue}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge variant={system.autoHealing ? 'default' : 'secondary'}>
                          {system.autoHealing ? 'Auto-healing enabled' : 'Manual only'}
                        </Badge>
                      </div>
                      <Badge className={getHealthColor(system.status)}>
                        {getHealthIcon(system.status)}
                        {system.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="healing" className="space-y-4">
          {/* Self-Healing Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Automated Healing Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healingActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {action.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : action.status === 'failed' ? (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      ) : (
                        <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                      )}
                      <div>
                        <div className="font-medium">{action.component}</div>
                        <div className="text-sm text-gray-700">{action.issue}</div>
                        <div className="text-sm text-blue-600">{action.action}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {action.timestamp} • Duration: {action.duration}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge className={getHealthColor(action.status === 'completed' ? 'healthy' : 'critical')}>
                        {action.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Log
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {/* Monitoring Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                System Monitoring Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monitoringAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <AlertTriangle className={`h-5 w-5 ${
                        alert.severity === 'critical' ? 'text-red-600' :
                        alert.severity === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                      <div>
                        <div className="font-medium">{alert.component}</div>
                        <div className="text-sm text-gray-700">{alert.message}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Detected: {alert.detected}
                        </div>
                        <div className="text-xs text-gray-600">
                          Threshold: {alert.threshold} • Current: {alert.current}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge variant={alert.autoResolve ? 'default' : 'destructive'}>
                          {alert.autoResolve ? 'Auto-resolving' : 'Manual action required'}
                        </Badge>
                      </div>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Acknowledge
                      </Button>
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
