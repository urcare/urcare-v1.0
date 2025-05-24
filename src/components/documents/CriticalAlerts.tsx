import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Bell, MessageSquare, Mail, Phone, Settings, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';

interface CriticalAlert {
  id: string;
  type: 'critical-result' | 'abnormal-value' | 'urgent-referral' | 'medication-alert';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: Date;
  document: string;
  value?: string;
  normalRange?: string;
  acknowledged: boolean;
  notificationsSent: string[];
}

interface AlertThresholds {
  bloodPressure: { systolic: number; diastolic: number };
  glucose: { min: number; max: number };
  cholesterol: number;
}

interface NotificationSettings {
  enableCriticalAlerts: boolean;
  notificationMethods: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  emergencyContacts: string[];
  alertThresholds: AlertThresholds;
}

const sampleAlerts: CriticalAlert[] = [
  {
    id: '1',
    type: 'critical-result',
    title: 'Critical Blood Pressure Reading',
    description: 'Blood pressure reading of 180/110 mmHg is significantly elevated and requires immediate attention.',
    severity: 'high',
    timestamp: new Date('2024-01-15T14:30:00'),
    document: 'Blood Pressure Monitoring Report',
    value: '180/110 mmHg',
    normalRange: '<140/90 mmHg',
    acknowledged: false,
    notificationsSent: ['push', 'email', 'emergency-contact']
  },
  {
    id: '2',
    type: 'abnormal-value',
    title: 'Elevated Glucose Level',
    description: 'Fasting glucose level of 156 mg/dL is above normal range.',
    severity: 'medium',
    timestamp: new Date('2024-01-14T09:15:00'),
    document: 'Lab Results - Metabolic Panel',
    value: '156 mg/dL',
    normalRange: '70-100 mg/dL',
    acknowledged: true,
    notificationsSent: ['push', 'email']
  },
  {
    id: '3',
    type: 'urgent-referral',
    title: 'Urgent Cardiology Referral',
    description: 'Immediate cardiology consultation recommended based on ECG findings.',
    severity: 'high',
    timestamp: new Date('2024-01-13T16:45:00'),
    document: 'ECG Report',
    acknowledged: false,
    notificationsSent: ['push', 'email', 'sms']
  }
];

const defaultSettings: NotificationSettings = {
  enableCriticalAlerts: true,
  notificationMethods: {
    push: true,
    email: true,
    sms: true
  },
  emergencyContacts: ['spouse', 'primary-care-doctor'],
  alertThresholds: {
    bloodPressure: { systolic: 140, diastolic: 90 },
    glucose: { min: 70, max: 140 },
    cholesterol: 200
  }
};

export const CriticalAlerts = () => {
  const [alerts, setAlerts] = useState<CriticalAlert[]>(sampleAlerts);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [showSettings, setShowSettings] = useState(false);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    toast.success('Alert acknowledged');
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    toast.info('Alert dismissed');
  };

  const updateNotificationMethod = (method: keyof NotificationSettings['notificationMethods'], enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      notificationMethods: {
        ...prev.notificationMethods,
        [method]: enabled
      }
    }));
    toast.success(`${method} notifications ${enabled ? 'enabled' : 'disabled'}`);
  };

  const updateThreshold = (type: keyof AlertThresholds, field: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      alertThresholds: {
        ...prev.alertThresholds,
        [type]: {
          ...(prev.alertThresholds[type] as any),
          [field]: value
        }
      }
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'critical-result': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'abnormal-value': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'urgent-referral': return <Bell className="h-5 w-5 text-orange-500" />;
      case 'medication-alert': return <AlertTriangle className="h-5 w-5 text-purple-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.acknowledged);
  const acknowledgedAlerts = alerts.filter(alert => alert.acknowledged);

  return (
    <div className="space-y-6">
      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{activeAlerts.length}</div>
            <p className="text-sm text-gray-600">Active Alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {activeAlerts.filter(a => a.severity === 'high').length}
            </div>
            <p className="text-sm text-gray-600">High Priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{acknowledgedAlerts.length}</div>
            <p className="text-sm text-gray-600">Acknowledged</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">24/7</div>
            <p className="text-sm text-gray-600">Monitoring</p>
          </CardContent>
        </Card>
      </div>

      {/* Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Alert Settings
              </CardTitle>
              <CardDescription>
                Configure critical result notifications and thresholds
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? 'Hide' : 'Show'} Settings
            </Button>
          </div>
        </CardHeader>
        {showSettings && (
          <CardContent className="space-y-6">
            {/* Notification Methods */}
            <div>
              <h4 className="font-medium mb-3">Notification Methods</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span>Push Notifications</span>
                  </div>
                  <Switch
                    checked={settings.notificationMethods.push}
                    onCheckedChange={(checked) => updateNotificationMethod('push', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Email Notifications</span>
                  </div>
                  <Switch
                    checked={settings.notificationMethods.email}
                    onCheckedChange={(checked) => updateNotificationMethod('email', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>SMS Notifications</span>
                  </div>
                  <Switch
                    checked={settings.notificationMethods.sms}
                    onCheckedChange={(checked) => updateNotificationMethod('sms', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Alert Thresholds */}
            <div>
              <h4 className="font-medium mb-3">Alert Thresholds</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Blood Pressure (Systolic)</label>
                  <Select 
                    value={settings.alertThresholds.bloodPressure.systolic.toString()}
                    onValueChange={(value) => updateThreshold('bloodPressure', 'systolic', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="130">130 mmHg</SelectItem>
                      <SelectItem value="140">140 mmHg</SelectItem>
                      <SelectItem value="150">150 mmHg</SelectItem>
                      <SelectItem value="160">160 mmHg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Glucose (Max)</label>
                  <Select 
                    value={settings.alertThresholds.glucose.max.toString()}
                    onValueChange={(value) => updateThreshold('glucose', 'max', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="126">126 mg/dL</SelectItem>
                      <SelectItem value="140">140 mg/dL</SelectItem>
                      <SelectItem value="180">180 mg/dL</SelectItem>
                      <SelectItem value="200">200 mg/dL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Active Critical Alerts ({activeAlerts.length})
            </CardTitle>
            <CardDescription>
              Immediate attention required for these critical results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      {getTypeIcon(alert.type)}
                      <div>
                        <h4 className="font-medium">{alert.title}</h4>
                        <p className="text-sm mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span><strong>Document:</strong> {alert.document}</span>
                          {alert.value && (
                            <span><strong>Value:</strong> {alert.value}</span>
                          )}
                          {alert.normalRange && (
                            <span><strong>Normal:</strong> {alert.normalRange}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="secondary" className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-600">
                        {alert.timestamp.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Notifications sent:</span>
                      {alert.notificationsSent.map((method, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {method}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Acknowledge
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => dismissAlert(alert.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Acknowledged Alerts */}
      {acknowledgedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Acknowledged Alerts ({acknowledgedAlerts.length})
            </CardTitle>
            <CardDescription>
              Previously acknowledged critical alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {acknowledgedAlerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div>
                        <h5 className="font-medium text-sm">{alert.title}</h5>
                        <p className="text-xs text-gray-600">{alert.document}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {alert.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
