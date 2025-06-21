
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Clock, Calendar, Pill, Activity, Heart, Brain, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

interface SmartReminder {
  id: string;
  title: string;
  description: string;
  type: 'medication' | 'appointment' | 'health_check' | 'exercise' | 'hydration' | 'custom';
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  time: string;
  enabled: boolean;
  aiOptimized: boolean;
  adaptiveScheduling: boolean;
  successRate: number;
  nextReminder: string;
  customSettings?: {
    days?: string[];
    interval?: number;
    conditions?: string[];
  };
}

export const SmartReminders = () => {
  const [reminders, setReminders] = useState<SmartReminder[]>([
    {
      id: '1',
      title: 'Morning Medication',
      description: 'Take Lisinopril 10mg with breakfast',
      type: 'medication',
      frequency: 'daily',
      time: '08:00',
      enabled: true,
      aiOptimized: true,
      adaptiveScheduling: true,
      successRate: 94,
      nextReminder: 'Tomorrow at 8:00 AM',
      customSettings: {
        conditions: ['Taken with food', 'Check blood pressure']
      }
    },
    {
      id: '2',
      title: 'Dr. Smith Checkup',
      description: 'Quarterly health checkup appointment',
      type: 'appointment',
      frequency: 'monthly',
      time: '14:30',
      enabled: true,
      aiOptimized: true,
      adaptiveScheduling: false,
      successRate: 100,
      nextReminder: 'March 15th at 2:30 PM'
    },
    {
      id: '3',
      title: 'Evening Walk',
      description: 'AI suggests best time based on weather and schedule',
      type: 'exercise',
      frequency: 'daily',
      time: '18:00',
      enabled: true,
      aiOptimized: true,
      adaptiveScheduling: true,
      successRate: 78,
      nextReminder: 'Today at 6:00 PM',
      customSettings: {
        conditions: ['Weather-dependent', 'Schedule-adaptive']
      }
    },
    {
      id: '4',
      title: 'Blood Pressure Check',
      description: 'Weekly monitoring as recommended by doctor',
      type: 'health_check',
      frequency: 'weekly',
      time: '09:00',
      enabled: true,
      aiOptimized: true,
      adaptiveScheduling: false,
      successRate: 89,
      nextReminder: 'Sunday at 9:00 AM',
      customSettings: {
        days: ['Sunday']
      }
    },
    {
      id: '5',
      title: 'Hydration Reminder',
      description: 'AI-optimized water intake reminders',
      type: 'hydration',
      frequency: 'custom',
      time: 'Varies',
      enabled: true,
      aiOptimized: true,
      adaptiveScheduling: true,
      successRate: 72,
      nextReminder: 'Every 2 hours during day',
      customSettings: {
        interval: 2,
        conditions: ['Activity-based', 'Weather-adjusted']
      }
    }
  ]);

  const [aiSettings, setAiSettings] = useState({
    smartScheduling: true,
    contextualReminders: true,
    behaviorAnalysis: true,
    weatherIntegration: true,
    calendarSync: true
  });

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id 
        ? { ...reminder, enabled: !reminder.enabled }
        : reminder
    ));
    
    const reminder = reminders.find(r => r.id === id);
    toast.success(`${reminder?.title} ${reminder?.enabled ? 'disabled' : 'enabled'}`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication': return Pill;
      case 'appointment': return Calendar;
      case 'health_check': return Heart;
      case 'exercise': return Activity;
      case 'hydration': return '💧';
      default: return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medication': return 'bg-blue-100 text-blue-800';
      case 'appointment': return 'bg-green-100 text-green-800';
      case 'health_check': return 'bg-red-100 text-red-800';
      case 'exercise': return 'bg-purple-100 text-purple-800';
      case 'hydration': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const averageSuccessRate = Math.round(
    reminders.reduce((acc, reminder) => acc + reminder.successRate, 0) / reminders.length
  );

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            AI Smart Reminders
          </CardTitle>
          <CardDescription>
            Intelligent, adaptive reminders that learn from your behavior and optimize timing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{reminders.filter(r => r.enabled).length}</div>
              <p className="text-sm text-gray-600">Active Reminders</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{averageSuccessRate}%</div>
              <p className="text-sm text-gray-600">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{reminders.filter(r => r.aiOptimized).length}</div>
              <p className="text-sm text-gray-600">AI Optimized</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{reminders.filter(r => r.adaptiveScheduling).length}</div>
              <p className="text-sm text-gray-600">Adaptive</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="reminders" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reminders">My Reminders</TabsTrigger>
          <TabsTrigger value="ai-settings">AI Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="reminders" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reminders.map((reminder) => {
              const TypeIcon = getTypeIcon(reminder.type);
              return (
                <Card key={reminder.id} className={`${reminder.enabled ? '' : 'opacity-60'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {typeof TypeIcon === 'string' ? (
                          <span className="text-xl">{TypeIcon}</span>
                        ) : (
                          <TypeIcon className="h-5 w-5 text-gray-600" />
                        )}
                        <div>
                          <h3 className="font-medium">{reminder.title}</h3>
                          <p className="text-sm text-gray-600">{reminder.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={reminder.enabled}
                        onCheckedChange={() => toggleReminder(reminder.id)}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getTypeColor(reminder.type)}>
                          {reminder.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <div className="flex items-center gap-2">
                          {reminder.aiOptimized && (
                            <Badge variant="outline" className="text-xs">
                              <Brain className="h-3 w-3 mr-1" />
                              AI
                            </Badge>
                          )}
                          {reminder.adaptiveScheduling && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Adaptive
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Frequency:</span>
                          <div className="font-medium">{reminder.frequency}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Time:</span>
                          <div className="font-medium">{reminder.time}</div>
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-600 text-sm">Success Rate:</span>
                        <div className={`font-medium ${getSuccessRateColor(reminder.successRate)}`}>
                          {reminder.successRate}%
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Bell className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Next Reminder</span>
                        </div>
                        <p className="text-sm text-gray-700">{reminder.nextReminder}</p>
                      </div>

                      {reminder.customSettings && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">AI Optimizations:</h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {reminder.customSettings.conditions?.map((condition, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                {condition}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="ai-settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Optimization Settings</CardTitle>
              <CardDescription>
                Configure how AI adapts and optimizes your reminders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Smart Scheduling</h3>
                  <p className="text-sm text-gray-600">AI adjusts timing based on your routine</p>
                </div>
                <Switch
                  checked={aiSettings.smartScheduling}
                  onCheckedChange={(checked) => 
                    setAiSettings(prev => ({ ...prev, smartScheduling: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Contextual Reminders</h3>
                  <p className="text-sm text-gray-600">Considers location and activity</p>
                </div>
                <Switch
                  checked={aiSettings.contextualReminders}
                  onCheckedChange={(checked) => 
                    setAiSettings(prev => ({ ...prev, contextualReminders: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Behavior Analysis</h3>
                  <p className="text-sm text-gray-600">Learns from your response patterns</p>
                </div>
                <Switch
                  checked={aiSettings.behaviorAnalysis}
                  onCheckedChange={(checked) => 
                    setAiSettings(prev => ({ ...prev, behaviorAnalysis: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Weather Integration</h3>
                  <p className="text-sm text-gray-600">Adjusts outdoor activities based on weather</p>
                </div>
                <Switch
                  checked={aiSettings.weatherIntegration}
                  onCheckedChange={(checked) => 
                    setAiSettings(prev => ({ ...prev, weatherIntegration: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Calendar Sync</h3>
                  <p className="text-sm text-gray-600">Avoids conflicts with scheduled events</p>
                </div>
                <Switch
                  checked={aiSettings.calendarSync}
                  onCheckedChange={(checked) => 
                    setAiSettings(prev => ({ ...prev, calendarSync: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Push Notifications</h4>
                  <p className="text-sm text-gray-600 mb-3">Instant alerts on your device</p>
                  <Switch defaultChecked />
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Email Reminders</h4>
                  <p className="text-sm text-gray-600 mb-3">Backup email notifications</p>
                  <Switch />
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">SMS Alerts</h4>
                  <p className="text-sm text-gray-600 mb-3">Text message reminders</p>
                  <Switch />
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Smart Watch</h4>
                  <p className="text-sm text-gray-600 mb-3">Wearable device notifications</p>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Success Rates by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['medication', 'appointment', 'exercise', 'health_check'].map((type) => {
                    const typeReminders = reminders.filter(r => r.type === type);
                    const avgRate = typeReminders.length > 0 
                      ? Math.round(typeReminders.reduce((acc, r) => acc + r.successRate, 0) / typeReminders.length)
                      : 0;
                    
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${avgRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-10">{avgRate}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Optimization Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">+23%</div>
                    <p className="text-sm text-gray-600">Improvement with AI</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">47</div>
                    <p className="text-sm text-gray-600">Minutes saved per week</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">89%</div>
                    <p className="text-sm text-gray-600">User satisfaction</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
