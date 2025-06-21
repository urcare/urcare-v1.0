
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Settings,
  Mail,
  MessageSquare,
  Smartphone
} from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  timestamp: Date;
  category: 'performance' | 'security' | 'system' | 'business';
  source: string;
}

interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: string;
  enabled: boolean;
  notifications: {
    email: boolean;
    sms: boolean;
    slack: boolean;
  };
}

export const AlertManagementInterface = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      title: 'High CPU Usage Detected',
      description: 'CPU usage has exceeded 85% for the past 10 minutes',
      severity: 'high',
      status: 'active',
      timestamp: new Date(Date.now() - 600000),
      category: 'performance',
      source: 'System Monitor'
    },
    {
      id: '2',
      title: 'Database Connection Pool Full',
      description: 'All database connections are in use, new requests are queued',
      severity: 'critical',
      status: 'active',
      timestamp: new Date(Date.now() - 300000),
      category: 'system',
      source: 'Database Monitor'
    },
    {
      id: '3',
      title: 'Unusual Login Pattern',
      description: 'Multiple failed login attempts from same IP address',
      severity: 'medium',
      status: 'acknowledged',
      timestamp: new Date(Date.now() - 1800000),
      category: 'security',
      source: 'Security Monitor'
    },
    {
      id: '4',
      title: 'API Response Time Slow',
      description: 'Patient API response time exceeding 500ms threshold',
      severity: 'medium',
      status: 'resolved',
      timestamp: new Date(Date.now() - 3600000),
      category: 'performance',
      source: 'API Monitor'
    }
  ]);

  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: '1',
      name: 'High CPU Usage',
      condition: 'CPU Usage > 80%',
      threshold: 'for 5 minutes',
      enabled: true,
      notifications: { email: true, sms: true, slack: false }
    },
    {
      id: '2',
      name: 'Memory Usage Critical',
      condition: 'Memory Usage > 90%',
      threshold: 'for 2 minutes',
      enabled: true,
      notifications: { email: true, sms: true, slack: true }
    },
    {
      id: '3',
      name: 'API Response Time',
      condition: 'Response Time > 500ms',
      threshold: 'for 3 consecutive requests',
      enabled: true,
      notifications: { email: true, sms: false, slack: true }
    },
    {
      id: '4',
      name: 'Failed Login Attempts',
      condition: 'Failed Logins > 5',
      threshold: 'within 10 minutes',
      enabled: false,
      notifications: { email: true, sms: false, slack: false }
    }
  ]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800';
      case 'acknowledged':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAlertAction = (alertId: string, action: 'acknowledge' | 'resolve') => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: action === 'acknowledge' ? 'acknowledged' : 'resolved' }
        : alert
    ));
  };

  const toggleAlertRule = (ruleId: string) => {
    setAlertRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const filteredAlerts = alerts.filter(alert => {
    switch (activeTab) {
      case 'active':
        return alert.status === 'active';
      case 'acknowledged':
        return alert.status === 'acknowledged';
      case 'resolved':
        return alert.status === 'resolved';
      default:
        return true;
    }
  });

  const alertCounts = {
    active: alerts.filter(a => a.status === 'active').length,
    acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    critical: alerts.filter(a => a.severity === 'critical' && a.status === 'active').length
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-red-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-red-600" />
            Alert Management Center
          </CardTitle>
          <CardDescription>
            Monitor, manage, and configure system alerts and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{alertCounts.active}</div>
              <div className="text-sm text-gray-600">Active Alerts</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{alertCounts.acknowledged}</div>
              <div className="text-sm text-gray-600">Acknowledged</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{alertCounts.resolved}</div>
              <div className="text-sm text-gray-600">Resolved Today</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{alertCounts.critical}</div>
              <div className="text-sm text-gray-600">Critical</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="active">Active ({alertCounts.active})</TabsTrigger>
          <TabsTrigger value="acknowledged">Acknowledged</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>Alerts requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <Card key={alert.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(alert.severity)}
                          <div className="flex-1">
                            <h4 className="font-semibold">{alert.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{alert.timestamp.toLocaleString()}</span>
                              <span>•</span>
                              <span>{alert.source}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAlertAction(alert.id, 'acknowledge')}
                          disabled={alert.status !== 'active'}
                        >
                          Acknowledge
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAlertAction(alert.id, 'resolve')}
                          disabled={alert.status === 'resolved'}
                        >
                          Resolve
                        </Button>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acknowledged" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Acknowledged Alerts</CardTitle>
              <CardDescription>Alerts that have been acknowledged but not resolved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <Card key={alert.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(alert.severity)}
                          <div className="flex-1">
                            <h4 className="font-semibold">{alert.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{alert.timestamp.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAlertAction(alert.id, 'resolve')}
                        >
                          Resolve
                        </Button>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resolved Alerts</CardTitle>
              <CardDescription>Recently resolved alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <Card key={alert.id} className="p-4 opacity-75">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <div className="flex-1">
                          <h4 className="font-semibold">{alert.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{alert.timestamp.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(alert.status)}>
                        {alert.status}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Rules Configuration</CardTitle>
              <CardDescription>Configure when and how alerts are triggered</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertRules.map((rule) => (
                  <Card key={rule.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{rule.name}</h4>
                          <p className="text-sm text-gray-600">
                            {rule.condition} {rule.threshold}
                          </p>
                        </div>
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={() => toggleAlertRule(rule.id)}
                        />
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <span className={rule.notifications.email ? 'text-green-600' : 'text-gray-400'}>
                            Email
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-green-600" />
                          <span className={rule.notifications.sms ? 'text-green-600' : 'text-gray-400'}>
                            SMS
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-purple-600" />
                          <span className={rule.notifications.slack ? 'text-green-600' : 'text-gray-400'}>
                            Slack
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-1" />
                          Configure
                        </Button>
                        <Button size="sm" variant="outline">
                          Test Alert
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
