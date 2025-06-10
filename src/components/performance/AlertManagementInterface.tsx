
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Settings,
  Mail,
  MessageSquare,
  Phone
} from 'lucide-react';

export const AlertManagementInterface = () => {
  const [activeAlerts, setActiveAlerts] = useState([
    {
      id: 1,
      title: 'High CPU Usage',
      description: 'Server CPU usage exceeded 90% threshold',
      severity: 'critical',
      timestamp: '2 minutes ago',
      status: 'active',
      source: 'System Monitor'
    },
    {
      id: 2,
      title: 'Slow Database Query',
      description: 'Query execution time exceeded 2000ms',
      severity: 'warning',
      timestamp: '5 minutes ago',
      status: 'acknowledged',
      source: 'Database Monitor'
    },
    {
      id: 3,
      title: 'API Response Time',
      description: '/api/patients endpoint response time > 1s',
      severity: 'warning',
      timestamp: '8 minutes ago',
      status: 'active',
      source: 'API Monitor'
    }
  ]);

  const alertRules = [
    {
      name: 'CPU Threshold',
      condition: 'CPU Usage > 80%',
      severity: 'warning',
      enabled: true,
      channels: ['email', 'slack']
    },
    {
      name: 'Memory Threshold',
      condition: 'Memory Usage > 85%',
      severity: 'critical',
      enabled: true,
      channels: ['email', 'sms', 'slack']
    },
    {
      name: 'Response Time',
      condition: 'API Response > 1000ms',
      severity: 'warning',
      enabled: true,
      channels: ['email']
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const acknowledgeAlert = (alertId: number) => {
    setActiveAlerts(alerts => 
      alerts.map(alert => 
        alert.id === alertId ? { ...alert, status: 'acknowledged' } : alert
      )
    );
  };

  const resolveAlert = (alertId: number) => {
    setActiveAlerts(alerts => 
      alerts.map(alert => 
        alert.id === alertId ? { ...alert, status: 'resolved' } : alert
      )
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-red-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alert Management Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-sm text-gray-600">Active Alerts</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <div className="text-sm text-gray-600">Critical</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-gray-600">Warning</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">15</div>
              <div className="text-sm text-gray-600">Resolved (24h)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="active-alerts" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="active-alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="alert-rules">Alert Rules</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="active-alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Active Alerts ({activeAlerts.filter(a => a.status !== 'resolved').length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeAlerts.map((alert) => (
                  <Card key={alert.id} className={`border-l-4 ${
                    alert.severity === 'critical' ? 'border-l-red-500' : 'border-l-yellow-500'
                  }`}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{alert.title}</h3>
                            <p className="text-sm text-gray-600">{alert.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            <Badge className={getStatusColor(alert.status)}>
                              {alert.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <div className="flex items-center gap-4">
                            <span>Source: {alert.source}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {alert.timestamp}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {alert.status === 'active' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => acknowledgeAlert(alert.id)}
                              >
                                Acknowledge
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => resolveAlert(alert.id)}
                            >
                              Resolve
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alert-rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Alert Rules Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertRules.map((rule, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{rule.name}</h3>
                          <p className="text-sm font-mono text-gray-600">{rule.condition}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(rule.severity)}>
                            {rule.severity}
                          </Badge>
                          <Badge className={rule.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {rule.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Notification channels:</span>
                          {rule.channels.map((channel, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            Test
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">Email Notifications</h3>
                        <p className="text-sm text-gray-600">admin@hospital.com, ops-team@hospital.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                      <Button size="sm" variant="outline">Configure</Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                      <div>
                        <h3 className="font-semibold">Slack Integration</h3>
                        <p className="text-sm text-gray-600">#alerts channel</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                      <Button size="sm" variant="outline">Configure</Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-orange-600" />
                      <div>
                        <h3 className="font-semibold">SMS Alerts</h3>
                        <p className="text-sm text-gray-600">Emergency contacts only</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>
                      <Button size="sm" variant="outline">Configure</Button>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
