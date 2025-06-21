
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Clock, 
  Calendar, 
  Brain, 
  Pill, 
  Heart, 
  Activity,
  TestTube,
  User,
  Zap,
  Target,
  Smartphone
} from 'lucide-react';
import { toast } from 'sonner';

interface SmartReminder {
  id: string;
  title: string;
  description: string;
  type: 'medication' | 'appointment' | 'test' | 'vitals' | 'exercise' | 'wellness';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledTime: Date;
  isRecurring: boolean;
  frequency?: string;
  contextAware: boolean;
  smartTiming: boolean;
  completionRate: number;
  aiOptimized: boolean;
  channels: ('push' | 'sms' | 'email' | 'call')[];
}

interface ReminderPreference {
  id: string;
  type: string;
  enabled: boolean;
  preferredTime: string;
  channels: string[];
  smartTiming: boolean;
  contextAware: boolean;
}

interface HealthMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  progress: number;
  reminders: string[];
}

export const IntelligentReminders = () => {
  const [reminders, setReminders] = useState<SmartReminder[]>([
    {
      id: '1',
      title: 'Take Morning Medication',
      description: 'Lisinopril 10mg + Metformin 500mg',
      type: 'medication',
      priority: 'high',
      scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      isRecurring: true,
      frequency: 'Daily at 8:00 AM',
      contextAware: true,
      smartTiming: true,
      completionRate: 95,
      aiOptimized: true,
      channels: ['push', 'sms']
    },
    {
      id: '2',
      title: 'Blood Pressure Check',
      description: 'Weekly BP monitoring - due today',
      type: 'vitals',
      priority: 'medium',
      scheduledTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
      isRecurring: true,
      frequency: 'Weekly',
      contextAware: true,
      smartTiming: false,
      completionRate: 78,
      aiOptimized: false,
      channels: ['push']
    },
    {
      id: '3',
      title: 'Cardiology Follow-up',
      description: 'Dr. Smith - 3-month check-up',
      type: 'appointment',
      priority: 'high',
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isRecurring: false,
      contextAware: false,
      smartTiming: false,
      completionRate: 100,
      aiOptimized: false,
      channels: ['push', 'sms', 'email']
    }
  ]);

  const [preferences, setPreferences] = useState<ReminderPreference[]>([
    {
      id: '1',
      type: 'medication',
      enabled: true,
      preferredTime: '08:00',
      channels: ['push', 'sms'],
      smartTiming: true,
      contextAware: true
    },
    {
      id: '2',
      type: 'appointment',
      enabled: true,
      preferredTime: '18:00',
      channels: ['push', 'email'],
      smartTiming: false,
      contextAware: false
    }
  ]);

  const [milestones, setMilestones] = useState<HealthMilestone[]>([
    {
      id: '1',
      title: '10,000 Steps Goal',
      description: 'Daily step target for cardiovascular health',
      targetDate: new Date(),
      progress: 75,
      reminders: ['3 PM check-in', 'Evening motivation']
    },
    {
      id: '2',
      title: 'Quarterly Lab Tests',
      description: 'Complete metabolic panel due',
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      progress: 20,
      reminders: ['Book appointment', '12-hour fasting reminder']
    }
  ]);

  const [activeTab, setActiveTab] = useState('active');
  const [smartRemindersEnabled, setSmartRemindersEnabled] = useState(true);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication': return <Pill className="h-4 w-4" />;
      case 'appointment': return <Calendar className="h-4 w-4" />;
      case 'test': return <TestTube className="h-4 w-4" />;
      case 'vitals': return <Heart className="h-4 w-4" />;
      case 'exercise': return <Activity className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const handleReminderComplete = (reminderId: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === reminderId 
        ? { ...reminder, completionRate: Math.min(100, reminder.completionRate + 1) }
        : reminder
    ));
    toast.success('Reminder marked as complete');
  };

  const handleSnoozeReminder = (reminderId: string) => {
    toast.success('Reminder snoozed for 15 minutes');
  };

  const optimizeWithAI = (reminderId: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === reminderId 
        ? { ...reminder, aiOptimized: true, smartTiming: true }
        : reminder
    ));
    toast.success('AI optimization applied to reminder');
  };

  const upcomingReminders = reminders
    .filter(r => r.scheduledTime > new Date())
    .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());

  return (
    <div className="space-y-6">
      {/* Smart Features Toggle */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI-Powered Intelligent Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Smart Timing & Context Awareness</Label>
              <p className="text-sm text-gray-600">AI optimizes reminder timing based on your patterns and context</p>
            </div>
            <Switch 
              checked={smartRemindersEnabled} 
              onCheckedChange={setSmartRemindersEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {upcomingReminders.length}
              </div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {Math.round(reminders.reduce((acc, r) => acc + r.completionRate, 0) / reminders.length)}%
              </div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {reminders.filter(r => r.aiOptimized).length}
              </div>
              <div className="text-sm text-gray-600">AI Optimized</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {milestones.length}
              </div>
              <div className="text-sm text-gray-600">Active Goals</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active Reminders</TabsTrigger>
          <TabsTrigger value="milestones">Health Milestones</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {upcomingReminders.map((reminder) => (
            <Card key={reminder.id} className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeIcon(reminder.type)}
                      <h4 className="font-semibold">{reminder.title}</h4>
                      <Badge className={getPriorityColor(reminder.priority)}>
                        {reminder.priority}
                      </Badge>
                      {reminder.aiOptimized && (
                        <Badge variant="outline" className="text-purple-600 border-purple-200">
                          <Brain className="h-3 w-3 mr-1" />
                          AI
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{reminder.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {reminder.scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {reminder.isRecurring && (
                        <span>{reminder.frequency}</span>
                      )}
                      <span>
                        {reminder.completionRate}% completion rate
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      {reminder.contextAware && (
                        <Badge variant="outline" className="text-xs">
                          <Target className="h-3 w-3 mr-1" />
                          Context-Aware
                        </Badge>
                      )}
                      {reminder.smartTiming && (
                        <Badge variant="outline" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          Smart Timing
                        </Badge>
                      )}
                      {reminder.channels.map(channel => (
                        <Badge key={channel} variant="outline" className="text-xs">
                          <Smartphone className="h-3 w-3 mr-1" />
                          {channel.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button 
                      size="sm"
                      onClick={() => handleReminderComplete(reminder.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Complete
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSnoozeReminder(reminder.id)}
                    >
                      Snooze
                    </Button>
                    {!reminder.aiOptimized && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => optimizeWithAI(reminder.id)}
                        className="border-purple-200 text-purple-600"
                      >
                        <Brain className="h-3 w-3 mr-1" />
                        AI Optimize
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          {milestones.map((milestone) => (
            <Card key={milestone.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">{milestone.title}</h4>
                    <p className="text-sm text-gray-600">{milestone.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{milestone.progress}%</div>
                    <div className="text-xs text-gray-500">
                      Due: {milestone.targetDate.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${milestone.progress}%` }}
                  ></div>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm mb-2">Smart Reminders:</h5>
                  <div className="flex flex-wrap gap-1">
                    {milestone.reminders.map((reminder, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {reminder}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          {preferences.map((pref) => (
            <Card key={pref.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold capitalize">{pref.type} Reminders</h4>
                    <p className="text-sm text-gray-600">Configure timing and delivery preferences</p>
                  </div>
                  <Switch checked={pref.enabled} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Preferred Time</Label>
                    <input 
                      type="time" 
                      value={pref.preferredTime}
                      className="w-full mt-1 p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm">Delivery Channels</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {['push', 'sms', 'email', 'call'].map(channel => (
                        <Badge 
                          key={channel}
                          variant={pref.channels.includes(channel) ? 'default' : 'outline'}
                          className="cursor-pointer"
                        >
                          {channel.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch checked={pref.smartTiming} size="sm" />
                      <Label className="text-sm">Smart Timing</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={pref.contextAware} size="sm" />
                      <Label className="text-sm">Context Aware</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reminder Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Completion Rates by Type</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Medication</span>
                      <span className="text-sm font-medium">95%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Appointments</span>
                      <span className="text-sm font-medium">88%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Vitals Check</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">AI Optimization Impact</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Before AI</span>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">After AI</span>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                    <div className="flex justify-between items-center text-green-600">
                      <span className="text-sm">Improvement</span>
                      <span className="text-sm font-medium">+15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
