
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users,
  Mail,
  MessageSquare,
  Phone
} from 'lucide-react';

interface NotificationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  channels: string[];
  priority: 'low' | 'normal' | 'high' | 'critical';
  enabled: boolean;
  escalationTime: string;
}

interface NotificationHistory {
  id: string;
  type: string;
  recipient: string;
  channel: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  timestamp: string;
  content: string;
}

export const NotificationManagement = () => {
  const [rules, setRules] = useState<NotificationRule[]>([
    {
      id: 'rule-1',
      name: 'Critical Lab Results',
      description: 'Notify attending physician of critical lab values',
      trigger: 'Critical lab result',
      channels: ['SMS', 'Email', 'In-App'],
      priority: 'critical',
      enabled: true,
      escalationTime: '5 minutes'
    },
    {
      id: 'rule-2',
      name: 'Patient Deterioration',
      description: 'Alert care team when patient vitals indicate deterioration',
      trigger: 'Vital signs alert',
      channels: ['SMS', 'Voice Call'],
      priority: 'high',
      enabled: true,
      escalationTime: '2 minutes'
    },
    {
      id: 'rule-3',
      name: 'Medication Due',
      description: 'Remind nursing staff of scheduled medication administration',
      trigger: 'Medication schedule',
      channels: ['In-App', 'SMS'],
      priority: 'normal',
      enabled: true,
      escalationTime: '15 minutes'
    }
  ]);

  const notificationHistory: NotificationHistory[] = [
    {
      id: 'hist-1',
      type: 'Critical Lab Results',
      recipient: 'Dr. Smith',
      channel: 'SMS',
      status: 'delivered',
      timestamp: '10 minutes ago',
      content: 'Patient Johnson - Critical glucose level: 450 mg/dL'
    },
    {
      id: 'hist-2',
      type: 'Patient Deterioration',
      recipient: 'ICU Team',
      channel: 'Voice Call',
      status: 'delivered',
      timestamp: '25 minutes ago',
      content: 'Room 205 - Blood pressure dropping, heart rate elevated'
    },
    {
      id: 'hist-3',
      type: 'Medication Due',
      recipient: 'Nurse Davis',
      channel: 'In-App',
      status: 'sent',
      timestamp: '1 hour ago',
      content: 'Insulin due for Patient Williams in 15 minutes'
    }
  ];

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'SMS': return MessageSquare;
      case 'Email': return Mail;
      case 'Voice Call': return Phone;
      case 'In-App': return Bell;
      default: return Bell;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-gray-600">Total Sent Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">98.5%</p>
                <p className="text-sm text-gray-600">Delivery Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">18</p>
                <p className="text-sm text-gray-600">Failed Deliveries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">2.3s</p>
                <p className="text-sm text-gray-600">Avg Response Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Rules */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Notification Rules
                </CardTitle>
                <CardDescription>Configure automated notification triggers</CardDescription>
              </div>
              <Button size="sm">Add Rule</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{rule.name}</h4>
                    <p className="text-sm text-gray-600">{rule.description}</p>
                  </div>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(rule.priority)}>
                      {rule.priority}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Escalate after {rule.escalationTime}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {rule.channels.map((channel) => {
                      const ChannelIcon = getChannelIcon(channel);
                      return (
                        <div key={channel} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                          <ChannelIcon className="h-3 w-3" />
                          {channel}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notification History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Notifications
            </CardTitle>
            <CardDescription>Real-time notification delivery tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notificationHistory.map((notification) => {
              const ChannelIcon = getChannelIcon(notification.channel);
              return (
                <div key={notification.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ChannelIcon className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-sm">{notification.type}</span>
                    </div>
                    <Badge className={getStatusColor(notification.status)}>
                      {notification.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    To: {notification.recipient} • {notification.timestamp}
                  </div>
                  <p className="text-sm bg-gray-50 p-2 rounded">
                    {notification.content}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Channel Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Channel Configuration</CardTitle>
          <CardDescription>Configure delivery preferences for each notification channel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span className="font-medium">SMS</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enabled</span>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-1">
                  <label className="text-sm">Provider</label>
                  <Select defaultValue="twilio">
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="aws-sns">AWS SNS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="h-5 w-5 text-green-600" />
                <span className="font-medium">Email</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enabled</span>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-1">
                  <label className="text-sm">Provider</label>
                  <Select defaultValue="sendgrid">
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="aws-ses">AWS SES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Phone className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Voice Call</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enabled</span>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-1">
                  <label className="text-sm">Provider</label>
                  <Select defaultValue="twilio-voice">
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio-voice">Twilio Voice</SelectItem>
                      <SelectItem value="aws-connect">AWS Connect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="h-5 w-5 text-orange-600" />
                <span className="font-medium">In-App</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enabled</span>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-1">
                  <label className="text-sm">Retention</label>
                  <Select defaultValue="7days">
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">7 days</SelectItem>
                      <SelectItem value="30days">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
