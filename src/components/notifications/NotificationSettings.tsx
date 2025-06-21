
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Bell, 
  Mail, 
  MessageSquare, 
  Phone,
  Calendar,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface NotificationPreference {
  type: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
  priority: 'low' | 'medium' | 'high';
  icon: React.ReactNode;
}

export const NotificationSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      type: 'appointments',
      label: 'Appointment Reminders',
      description: 'Reminders for upcoming medical appointments',
      email: true,
      push: true,
      sms: true,
      priority: 'high',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      type: 'medication',
      label: 'Medication Reminders',
      description: 'Reminders to take prescribed medications',
      email: false,
      push: true,
      sms: false,
      priority: 'high',
      icon: <Clock className="h-4 w-4" />
    },
    {
      type: 'lab_results',
      label: 'Lab Results',
      description: 'Notifications when lab results are available',
      email: true,
      push: true,
      sms: false,
      priority: 'medium',
      icon: <Mail className="h-4 w-4" />
    },
    {
      type: 'messages',
      label: 'Doctor Messages',
      description: 'Messages from your healthcare providers',
      email: true,
      push: true,
      sms: false,
      priority: 'medium',
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      type: 'emergency',
      label: 'Emergency Alerts',
      description: 'Critical health alerts and emergency notifications',
      email: true,
      push: true,
      sms: true,
      priority: 'high',
      icon: <AlertTriangle className="h-4 w-4" />
    },
    {
      type: 'wellness',
      label: 'Wellness Updates',
      description: 'Health tips and wellness reminders',
      email: false,
      push: false,
      sms: false,
      priority: 'low',
      icon: <Bell className="h-4 w-4" />
    }
  ]);

  const [globalSettings, setGlobalSettings] = useState({
    masterEmail: true,
    masterPush: true,
    masterSMS: false,
    quietHours: { enabled: true, start: '22:00', end: '07:00' },
    frequency: 'immediate' as 'immediate' | 'digest_daily' | 'digest_weekly'
  });

  const updatePreference = (type: string, channel: 'email' | 'push' | 'sms', value: boolean) => {
    setPreferences(prev => 
      prev.map(pref => 
        pref.type === type ? { ...pref, [channel]: value } : pref
      )
    );
    toast.success('Notification preference updated');
  };

  const updatePriority = (type: string, priority: 'low' | 'medium' | 'high') => {
    setPreferences(prev => 
      prev.map(pref => 
        pref.type === type ? { ...pref, priority } : pref
      )
    );
    toast.success('Priority updated');
  };

  const updateGlobalSetting = (setting: string, value: any) => {
    setGlobalSettings(prev => ({ ...prev, [setting]: value }));
    toast.success('Global setting updated');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Global Notification Settings
          </CardTitle>
          <CardDescription>
            Master controls for all notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="font-medium">Email Notifications</span>
              </div>
              <Switch
                checked={globalSettings.masterEmail}
                onCheckedChange={(value) => updateGlobalSetting('masterEmail', value)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="font-medium">Push Notifications</span>
              </div>
              <Switch
                checked={globalSettings.masterPush}
                onCheckedChange={(value) => updateGlobalSetting('masterPush', value)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="font-medium">SMS Notifications</span>
              </div>
              <Switch
                checked={globalSettings.masterSMS}
                onCheckedChange={(value) => updateGlobalSetting('masterSMS', value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Notification Frequency</Label>
              <Select 
                value={globalSettings.frequency} 
                onValueChange={(value: any) => updateGlobalSetting('frequency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="digest_daily">Daily Digest</SelectItem>
                  <SelectItem value="digest_weekly">Weekly Digest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quiet Hours</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={globalSettings.quietHours.enabled}
                  onCheckedChange={(value) => 
                    updateGlobalSetting('quietHours', { 
                      ...globalSettings.quietHours, 
                      enabled: value 
                    })
                  }
                />
                <span className="text-sm text-gray-600">
                  {globalSettings.quietHours.start} - {globalSettings.quietHours.end}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Configure notifications for different types of events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {preferences.map((pref) => (
              <Card key={pref.type} className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {pref.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{pref.label}</h4>
                      <p className="text-sm text-gray-600">{pref.description}</p>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(pref.priority)}>
                    {pref.priority}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`${pref.type}-email`} className="text-sm">Email</Label>
                    <Switch
                      id={`${pref.type}-email`}
                      checked={pref.email && globalSettings.masterEmail}
                      onCheckedChange={(value) => updatePreference(pref.type, 'email', value)}
                      disabled={!globalSettings.masterEmail}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor={`${pref.type}-push`} className="text-sm">Push</Label>
                    <Switch
                      id={`${pref.type}-push`}
                      checked={pref.push && globalSettings.masterPush}
                      onCheckedChange={(value) => updatePreference(pref.type, 'push', value)}
                      disabled={!globalSettings.masterPush}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor={`${pref.type}-sms`} className="text-sm">SMS</Label>
                    <Switch
                      id={`${pref.type}-sms`}
                      checked={pref.sms && globalSettings.masterSMS}
                      onCheckedChange={(value) => updatePreference(pref.type, 'sms', value)}
                      disabled={!globalSettings.masterSMS}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm">Priority:</Label>
                  <Select 
                    value={pref.priority} 
                    onValueChange={(value: any) => updatePriority(pref.type, value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={() => toast.success('Settings saved successfully')}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};
