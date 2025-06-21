
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bell, 
  Clock, 
  Calendar, 
  Pill, 
  Heart, 
  Activity, 
  MapPin, 
  Users, 
  Brain,
  Plus,
  Edit,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Reminder {
  id: string;
  title: string;
  type: 'medication' | 'appointment' | 'exercise' | 'meal' | 'custom';
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
  time: string;
  daysOfWeek?: string[];
  isActive: boolean;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  contextualTriggers?: string[];
  nextDue: Date;
  completedToday?: boolean;
}

interface SmartSuggestion {
  id: string;
  title: string;
  description: string;
  type: 'medication' | 'appointment' | 'exercise' | 'meal';
  suggestedTime: string;
  reasoning: string;
}

export const IntelligentReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: 'Take Lisinopril',
      type: 'medication',
      frequency: 'daily',
      time: '08:00',
      isActive: true,
      priority: 'high',
      notes: 'Take with water, before breakfast',
      contextualTriggers: ['meal_breakfast', 'location_home'],
      nextDue: new Date(Date.now() + 2 * 60 * 60 * 1000),
      completedToday: false
    },
    {
      id: '2',
      title: 'Cardio Exercise',
      type: 'exercise',
      frequency: 'daily',
      time: '07:00',
      daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
      isActive: true,
      priority: 'medium',
      notes: '30 minutes moderate intensity',
      contextualTriggers: ['weather_good', 'energy_high'],
      nextDue: new Date(Date.now() + 18 * 60 * 60 * 1000),
      completedToday: true
    },
    {
      id: '3',
      title: 'Check Blood Pressure',
      type: 'custom',
      frequency: 'weekly',
      time: '19:00',
      daysOfWeek: ['Sunday'],
      isActive: true,
      priority: 'medium',
      notes: 'Record readings in app',
      nextDue: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([
    {
      id: '1',
      title: 'Hydration Reminder',
      description: 'Drink a glass of water',
      type: 'meal',
      suggestedTime: '10:00',
      reasoning: 'Based on your activity level and current weather conditions'
    },
    {
      id: '2',
      title: 'Medication Review',
      description: 'Review medication effectiveness with doctor',
      type: 'appointment',
      suggestedTime: '14:00',
      reasoning: 'It\'s been 3 months since your last review'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: '',
    type: 'custom',
    frequency: 'daily',
    time: '09:00',
    priority: 'medium',
    isActive: true
  });

  const [activeTab, setActiveTab] = useState('overview');

  // AI Context Analysis
  const [contextAnalysis, setContextAnalysis] = useState({
    currentLocation: 'Home',
    weatherCondition: 'Sunny, 72°F',
    energyLevel: 'High',
    stressLevel: 'Low',
    sleepQuality: 'Good (7.5 hours)',
    recentActivity: 'Morning walk completed'
  });

  const handleCompleteReminder = (reminderId: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === reminderId 
        ? { ...reminder, completedToday: true }
        : reminder
    ));
    toast.success('Reminder marked as completed!');
  };

  const handleToggleReminder = (reminderId: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === reminderId 
        ? { ...reminder, isActive: !reminder.isActive }
        : reminder
    ));
  };

  const handleAddReminder = () => {
    if (!newReminder.title) {
      toast.error('Please enter a reminder title');
      return;
    }

    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title!,
      type: newReminder.type!,
      frequency: newReminder.frequency!,
      time: newReminder.time!,
      isActive: newReminder.isActive!,
      priority: newReminder.priority!,
      notes: newReminder.notes,
      nextDue: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };

    setReminders(prev => [reminder, ...prev]);
    setNewReminder({
      title: '',
      type: 'custom',
      frequency: 'daily',
      time: '09:00',
      priority: 'medium',
      isActive: true
    });
    setShowAddForm(false);
    toast.success('Reminder added successfully!');
  };

  const handleAcceptSuggestion = (suggestion: SmartSuggestion) => {
    const reminder: Reminder = {
      id: Date.now().toString(),
      title: suggestion.title,
      type: suggestion.type,
      frequency: 'daily',
      time: suggestion.suggestedTime,
      isActive: true,
      priority: 'medium',
      notes: suggestion.description,
      nextDue: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };

    setReminders(prev => [reminder, ...prev]);
    setSmartSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    toast.success('Smart suggestion added to your reminders!');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication': return Pill;
      case 'appointment': return Calendar;
      case 'exercise': return Activity;
      case 'meal': return Heart;
      default: return Bell;
    }
  };

  const upcomingReminders = reminders
    .filter(r => r.isActive)
    .sort((a, b) => a.nextDue.getTime() - b.nextDue.getTime())
    .slice(0, 5);

  const todayStats = {
    total: reminders.filter(r => r.isActive).length,
    completed: reminders.filter(r => r.completedToday).length,
    overdue: reminders.filter(r => r.nextDue < new Date() && !r.completedToday).length
  };

  return (
    <div className="space-y-6">
      {/* AI Context Bar */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-4">
            <Brain className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold">AI Context Analysis</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{contextAnalysis.currentLocation}</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-gray-500" />
              <span>Energy: {contextAnalysis.energyLevel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-gray-500" />
              <span>Stress: {contextAnalysis.stressLevel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{contextAnalysis.sleepQuality}</span>
            </div>
            <div className="col-span-2">
              <span className="text-green-600">✓ {contextAnalysis.recentActivity}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Active</span>
            </div>
            <div className="text-2xl font-bold">{todayStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium">Completed</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{todayStats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-red-600" />
              <span className="font-medium">Overdue</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{todayStats.overdue}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-purple-600" />
              <span className="font-medium">Adherence</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((todayStats.completed / todayStats.total) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Suggestions */}
      {smartSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Smart Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {smartSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{suggestion.title}</h4>
                  <p className="text-sm text-gray-600">{suggestion.description}</p>
                  <p className="text-xs text-purple-600 mt-1">
                    💡 {suggestion.reasoning}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{suggestion.suggestedTime}</span>
                  <Button 
                    size="sm" 
                    onClick={() => handleAcceptSuggestion(suggestion)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Add
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Reminders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingReminders.map((reminder) => {
                const IconComponent = getTypeIcon(reminder.type);
                const isOverdue = reminder.nextDue < new Date() && !reminder.completedToday;
                const isDueSoon = reminder.nextDue < new Date(Date.now() + 2 * 60 * 60 * 1000);
                
                return (
                  <div 
                    key={reminder.id} 
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      reminder.completedToday 
                        ? 'bg-green-50 border-green-200' 
                        : isOverdue 
                        ? 'bg-red-50 border-red-200' 
                        : isDueSoon
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`h-5 w-5 ${
                        reminder.completedToday ? 'text-green-600' : 'text-blue-600'
                      }`} />
                      <div>
                        <h4 className={`font-medium ${
                          reminder.completedToday ? 'line-through text-gray-500' : ''
                        }`}>
                          {reminder.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{reminder.time}</span>
                          <Badge className={getPriorityColor(reminder.priority)}>
                            {reminder.priority}
                          </Badge>
                          {isOverdue && <Badge className="bg-red-100 text-red-800">Overdue</Badge>}
                          {isDueSoon && !isOverdue && <Badge className="bg-yellow-100 text-yellow-800">Due Soon</Badge>}
                        </div>
                        {reminder.notes && (
                          <p className="text-xs text-gray-500 mt-1">{reminder.notes}</p>
                        )}
                        {reminder.contextualTriggers && (
                          <div className="flex gap-1 mt-1">
                            {reminder.contextualTriggers.map((trigger, idx) => (
                              <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {trigger.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!reminder.completedToday && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteReminder(reminder.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Complete
                        </Button>
                      )}
                      <Switch
                        checked={reminder.isActive}
                        onCheckedChange={() => handleToggleReminder(reminder.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reminders
                  .filter(r => r.isActive && r.nextDue > new Date())
                  .sort((a, b) => a.nextDue.getTime() - b.nextDue.getTime())
                  .map((reminder) => {
                    const IconComponent = getTypeIcon(reminder.type);
                    
                    return (
                      <div key={reminder.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                        <div className="flex-1">
                          <h4 className="font-medium">{reminder.title}</h4>
                          <p className="text-sm text-gray-600">
                            {reminder.nextDue.toLocaleDateString()} at {reminder.time}
                          </p>
                        </div>
                        <Badge className={getPriorityColor(reminder.priority)}>
                          {reminder.priority}
                        </Badge>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Manage Reminders</h3>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </div>

          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Reminder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newReminder.title || ''}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter reminder title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={newReminder.type} onValueChange={(value) => 
                      setNewReminder(prev => ({ ...prev, type: value as Reminder['type'] }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medication">Medication</SelectItem>
                        <SelectItem value="appointment">Appointment</SelectItem>
                        <SelectItem value="exercise">Exercise</SelectItem>
                        <SelectItem value="meal">Meal</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newReminder.priority} onValueChange={(value) => 
                      setNewReminder(prev => ({ ...prev, priority: value as Reminder['priority'] }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select value={newReminder.frequency} onValueChange={(value) => 
                      setNewReminder(prev => ({ ...prev, frequency: value as Reminder['frequency'] }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">Once</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newReminder.time || ''}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={newReminder.notes || ''}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes or instructions"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={newReminder.isActive || false}
                    onCheckedChange={(checked) => setNewReminder(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddReminder}>Add Reminder</Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>All Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reminders.map((reminder) => {
                  const IconComponent = getTypeIcon(reminder.type);
                  
                  return (
                    <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium">{reminder.title}</h4>
                          <p className="text-sm text-gray-600">
                            {reminder.frequency} at {reminder.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(reminder.priority)}>
                          {reminder.priority}
                        </Badge>
                        <Switch
                          checked={reminder.isActive}
                          onCheckedChange={() => handleToggleReminder(reminder.id)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Smart Suggestions</Label>
                    <p className="text-sm text-gray-600">Let AI suggest reminders based on your patterns</p>
                  </div>
                  <Switch checked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Context-Aware Timing</Label>
                    <p className="text-sm text-gray-600">Adjust reminder timing based on your location and activity</p>
                  </div>
                  <Switch checked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Predictive Adjustments</Label>
                    <p className="text-sm text-gray-600">Automatically adjust reminders based on your compliance patterns</p>
                  </div>
                  <Switch checked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Emergency Override</Label>
                    <p className="text-sm text-gray-600">Allow critical reminders to override Do Not Disturb</p>
                  </div>
                  <Switch checked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Default Snooze Duration</Label>
                <Select defaultValue="10">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Reminder Sound</Label>
                <Select defaultValue="gentle">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gentle">Gentle Chime</SelectItem>
                    <SelectItem value="alert">Alert Tone</SelectItem>
                    <SelectItem value="bell">Bell</SelectItem>
                    <SelectItem value="vibrate">Vibrate Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
