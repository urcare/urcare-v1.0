
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Settings,
  Plus,
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
  source: string;
  category: string;
}

interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  notifications: string[];
}

export const AlertManagementInterface = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadAlerts();
    loadAlertRules();
    
    // Simulate real-time alert updates
    const interval = setInterval(() => {
      generateRandomAlert();
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = () => {
    const mockAlerts: Alert[] = [
      {
        id: '1',
        title: 'High CPU Usage',
        description: 'Server CPU usage exceeded 85% for more than 5 minutes',
        severity: 'high',
        status: 'active',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        source: 'System Monitor',
        category: 'Performance'
      },
      {
        id: '2',
        title: 'Database Connection Pool Full',
        description: 'All database connections are in use',
        severity: 'critical',
        status: 'acknowledged',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        source: 'Database Monitor',
        category: 'Database'
      },
      {
        id: '3',
        title: 'API Response Time High',
        description: 'Average API response time above 2 seconds',
        severity: 'medium',
        status: 'resolved',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        source: 'API Monitor',
        category: 'API'
      }
    ];
    setAlerts(mockAlerts);
  };

  const loadAlertRules = () => {
    const mockRules: AlertRule[] = [
      {
        id: '1',
        name: 'High CPU Usage',
        condition: 'cpu_usage > threshold',
        threshold: 85,
        severity: 'high',
        enabled: true,
        notifications: ['email', 'slack']
      },
      {
        id: '2',
        name: 'Low Memory',
        condition: 'available_memory < threshold',
        threshold: 20,
        severity: 'critical',
        enabled: true,
        notifications: ['email', 'sms', 'slack']
      },
      {
        id: '3',
        name: 'High Error Rate',
        condition: 'error_rate > threshold',
        threshold: 5,
        severity: 'medium',
        enabled: false,
        notifications: ['email']
      }
    ];
    setAlertRules(mockRules);
  };

  const generateRandomAlert = () => {
    const alertTypes = [
      { title: 'Memory Usage Warning', severity: 'medium' as const, category: 'Performance' },
      { title: 'Network Latency High', severity: 'low' as const, category: 'Network' },
      { title: 'Disk Space Low', severity: 'high' as const, category: 'Storage' }
    ];
    
    const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const newAlert: Alert = {
      id: Date.now().toString(),
      title: randomAlert.title,
      description: `${randomAlert.title} detected at ${new Date().toLocaleTimeString()}`,
      severity: randomAlert.severity,
      status: 'active',
      timestamp: new Date(),
      source: 'System Monitor',
      category: randomAlert.category
    };
    
    setAlerts(prev => [newAlert, ...prev]);
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'acknowledged' as const } : alert
    ));
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'resolved' as const } : alert
    ));
  };

  const toggleAlertRule = (ruleId: string) => {
    setAlertRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const filteredAlerts = alerts.filter(alert => {
    const severityMatch = filterSeverity === 'all' || alert.severity === filterSeverity;
    const statusMatch = filterStatus === 'all' || alert.status === filterStatus;
    return severityMatch && statusMatch;
  });

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-red-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-red-600" />
            Alert Management System
          </CardTitle>
          <CardDescription>
            Comprehensive alerting and notification management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <div className="text-2xl font-bold text-red-600">
                {alerts.filter(a => a.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active Alerts</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Clock className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
              <div className="text-2xl font-bold text-yellow-600">
                {alerts.filter(a => a.status === 'acknowledged').length}
              </div>
              <div className="text-sm text-gray-600">Acknowledged</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {alerts.filter(a => a.status === 'resolved').length}
              </div>
              <div className="text-sm text-gray-600">Resolved</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Settings className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {alertRules.filter(r => r.enabled).length}
              </div>
              <div className="text-sm text-gray-600">Active Rules</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Active Alerts</CardTitle>
                <div className="flex gap-2">
                  <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="acknowledged">Acknowledged</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <Card key={alert.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{alert.title}</h3>
                          <p className="text-sm text-gray-600">{alert.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span>{alert.source}</span>
                            <span>•</span>
                            <span>{alert.timestamp.toLocaleString()}</span>
                          </div>
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
                      
                      {alert.status === 'active' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
                            Acknowledge
                          </Button>
                          <Button size="sm" onClick={() => resolveAlert(alert.id)}>
                            Resolve
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Alert Rules
              <Button size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Rule
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertRules.map((rule) => (
                <div key={rule.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{rule.name}</h4>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => toggleAlertRule(rule.id)}
                    />
                  </div>
                  <p className="text-sm text-gray-600">{rule.condition}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getSeverityColor(rule.severity)}>
                      {rule.severity}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Threshold: {rule.threshold}
                    </span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {rule.notifications.includes('email') && (
                      <Mail className="h-4 w-4 text-gray-400" />
                    )}
                    {rule.notifications.includes('sms') && (
                      <Smartphone className="h-4 w-4 text-gray-400" />
                    )}
                    {rule.notifications.includes('slack') && (
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
