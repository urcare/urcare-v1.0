
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Bell, 
  Calendar, 
  MessageSquare, 
  Phone,
  Mail,
  CheckCircle,
  Clock,
  User,
  Send
} from 'lucide-react';

interface FollowUpReminder {
  id: string;
  patientName: string;
  condition: string;
  lastVisit: string;
  nextDue: string;
  reminderType: 'medication' | 'appointment' | 'test' | 'lifestyle';
  priority: 'high' | 'medium' | 'low';
  communicationChannel: 'sms' | 'email' | 'phone' | 'app';
  engagementScore: number;
  responseRate: number;
  status: 'scheduled' | 'sent' | 'responded' | 'overdue';
}

const mockReminders: FollowUpReminder[] = [
  {
    id: 'FR001',
    patientName: 'Maria Garcia',
    condition: 'Diabetes Management',
    lastVisit: '2024-01-15',
    nextDue: '2024-01-25',
    reminderType: 'medication',
    priority: 'high',
    communicationChannel: 'sms',
    engagementScore: 85,
    responseRate: 92,
    status: 'scheduled'
  },
  {
    id: 'FR002',
    patientName: 'John Smith',
    condition: 'Hypertension',
    lastVisit: '2024-01-10',
    nextDue: '2024-01-23',
    reminderType: 'appointment',
    priority: 'medium',
    communicationChannel: 'email',
    engagementScore: 72,
    responseRate: 78,
    status: 'sent'
  }
];

export const FollowUpReminderSystem = () => {
  const [reminders] = useState<FollowUpReminder[]>(mockReminders);
  const [selectedReminder, setSelectedReminder] = useState<FollowUpReminder | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-orange-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500 text-white';
      case 'sent': return 'bg-purple-500 text-white';
      case 'responded': return 'bg-green-500 text-white';
      case 'overdue': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return MessageSquare;
      case 'email': return Mail;
      case 'phone': return Phone;
      case 'app': return Bell;
      default: return Bell;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Follow-up Reminder System
          </CardTitle>
          <CardDescription>
            Patient engagement optimization with intelligent communication scheduling and response tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Bell className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{reminders.length}</p>
                    <p className="text-sm text-gray-600">Active Reminders</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">85%</p>
                    <p className="text-sm text-gray-600">Response Rate</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">147</p>
                    <p className="text-sm text-gray-600">Messages Sent</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Calendar className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">23</p>
                    <p className="text-sm text-gray-600">Due Today</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Upcoming Reminders</h3>
              {reminders.map((reminder) => {
                const ChannelIcon = getChannelIcon(reminder.communicationChannel);
                return (
                  <Card 
                    key={reminder.id} 
                    className={`cursor-pointer transition-colors ${selectedReminder?.id === reminder.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-orange-400`}
                    onClick={() => setSelectedReminder(reminder)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-4 w-4 text-gray-500" />
                            <h4 className="font-semibold">{reminder.patientName}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{reminder.condition}</p>
                          <p className="text-sm font-medium text-blue-600 capitalize">{reminder.reminderType} Reminder</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge className={getPriorityColor(reminder.priority)}>
                            {reminder.priority.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(reminder.status)}>
                            {reminder.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Engagement Score</span>
                          <span className="font-bold">{reminder.engagementScore}%</span>
                        </div>
                        <Progress value={reminder.engagementScore} className="h-2" />
                        
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>Due: {reminder.nextDue}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-blue-600">
                            <ChannelIcon className="h-3 w-3" />
                            <span>{reminder.communicationChannel.toUpperCase()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div>
              {selectedReminder ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedReminder.patientName}</CardTitle>
                    <CardDescription>{selectedReminder.condition} • {selectedReminder.reminderType} reminder</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Reminder Details</h4>
                          <div className="space-y-1 text-sm">
                            <p>Type: <strong>{selectedReminder.reminderType}</strong></p>
                            <p>Priority: <strong>{selectedReminder.priority}</strong></p>
                            <p>Due Date: <strong>{selectedReminder.nextDue}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Engagement Metrics</h4>
                          <div className="space-y-1 text-sm">
                            <p>Score: <strong>{selectedReminder.engagementScore}%</strong></p>
                            <p>Response Rate: <strong>{selectedReminder.responseRate}%</strong></p>
                            <p>Channel: <strong>{selectedReminder.communicationChannel}</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">AI-Optimized Message</h4>
                        <div className="text-sm bg-blue-50 p-3 rounded">
                          <p><strong>Subject:</strong> Your diabetes check-up reminder</p>
                          <p className="mt-2">Hi {selectedReminder.patientName}, this is a gentle reminder about your upcoming diabetes management appointment. Based on your recent progress, Dr. Martinez would like to review your blood sugar logs and adjust your medication if needed. Please bring your glucose monitor readings from the past month.</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Communication History</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm p-2 bg-green-50 rounded">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Initial reminder sent via SMS - Responded</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm p-2 bg-blue-50 rounded">
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                            <span>Follow-up email scheduled for tomorrow</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Personalization Factors</h4>
                        <div className="text-sm bg-green-50 p-3 rounded space-y-1">
                          <p>• Prefers morning appointments (9-11 AM)</p>
                          <p>• Responds well to educational content</p>
                          <p>• Best engagement via SMS</p>
                          <p>• Appreciates progress acknowledgment</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <Send className="h-4 w-4 mr-1" />
                          Send Now
                        </Button>
                        <Button variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule
                        </Button>
                        <Button variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Customize
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a reminder to view details and communication optimization</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
