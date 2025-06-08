
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Send, 
  Calendar, 
  FileText, 
  Shield, 
  Clock,
  BookOpen,
  Bell
} from 'lucide-react';

interface PatientMessage {
  id: string;
  patientId: string;
  patientName: string;
  subject: string;
  content: string;
  timestamp: string;
  status: 'new' | 'replied' | 'resolved';
  priority: 'low' | 'normal' | 'high';
  category: 'general' | 'appointment' | 'prescription' | 'results';
}

interface EducationalContent {
  id: string;
  title: string;
  category: string;
  description: string;
  readTime: string;
  priority: number;
}

export const PatientPortalMessaging = () => {
  const [selectedMessage, setSelectedMessage] = useState<string>('msg-1');
  const [replyContent, setReplyContent] = useState('');

  const patientMessages: PatientMessage[] = [
    {
      id: 'msg-1',
      patientId: 'PAT001',
      patientName: 'Sarah Johnson',
      subject: 'Question about medication side effects',
      content: 'I\'ve been experiencing some dizziness since starting the new medication. Is this normal?',
      timestamp: '30 minutes ago',
      status: 'new',
      priority: 'high',
      category: 'prescription'
    },
    {
      id: 'msg-2',
      patientId: 'PAT002',
      patientName: 'Michael Chen',
      subject: 'Appointment rescheduling request',
      content: 'Could I reschedule my appointment next week? I have a work conflict.',
      timestamp: '2 hours ago',
      status: 'replied',
      priority: 'normal',
      category: 'appointment'
    },
    {
      id: 'msg-3',
      patientId: 'PAT003',
      patientName: 'Emma Davis',
      subject: 'Lab results inquiry',
      content: 'I received my lab results but have some questions about the values.',
      timestamp: '1 day ago',
      status: 'resolved',
      priority: 'normal',
      category: 'results'
    }
  ];

  const educationalContent: EducationalContent[] = [
    {
      id: 'edu-1',
      title: 'Managing Diabetes: Daily Care Tips',
      category: 'Diabetes',
      description: 'Essential daily care practices for diabetes management',
      readTime: '5 min',
      priority: 1
    },
    {
      id: 'edu-2',
      title: 'Heart-Healthy Diet Guidelines',
      category: 'Cardiology',
      description: 'Nutritional guidelines for cardiovascular health',
      readTime: '8 min',
      priority: 2
    },
    {
      id: 'edu-3',
      title: 'Medication Adherence Best Practices',
      category: 'General',
      description: 'Tips for staying consistent with medication schedules',
      readTime: '4 min',
      priority: 3
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'replied': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'appointment': return Calendar;
      case 'prescription': return FileText;
      case 'results': return FileText;
      default: return Users;
    }
  };

  const handleSendReply = () => {
    if (replyContent.trim()) {
      console.log('Sending reply:', replyContent);
      setReplyContent('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-700">HIPAA Compliant Messaging</span>
        </div>
        <Button className="flex items-center gap-2">
          <Send className="h-4 w-4" />
          Compose Message
        </Button>
      </div>

      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="messages">Patient Messages</TabsTrigger>
          <TabsTrigger value="reminders">Appointment Reminders</TabsTrigger>
          <TabsTrigger value="education">Educational Content</TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Message List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Patient Messages</CardTitle>
                <CardDescription>Secure communication with patients</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {patientMessages.map((message) => {
                    const CategoryIcon = getCategoryIcon(message.category);
                    return (
                      <div
                        key={message.id}
                        className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 border-b ${
                          selectedMessage === message.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onClick={() => setSelectedMessage(message.id)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {message.patientName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm truncate">{message.patientName}</span>
                              <CategoryIcon className="h-3 w-3 text-gray-500" />
                            </div>
                            <h4 className="font-medium text-sm mb-1 truncate">{message.subject}</h4>
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{message.content}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">{message.timestamp}</span>
                              <Badge className={getStatusColor(message.status)}>
                                {message.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Message Detail */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Question about medication side effects</CardTitle>
                    <CardDescription>From: Sarah Johnson (PAT001) • 30 minutes ago</CardDescription>
                  </div>
                  <Badge className="bg-red-100 text-red-800">High Priority</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm">I've been experiencing some dizziness since starting the new medication. Is this normal? Should I be concerned? The dizziness happens mostly in the morning and lasts for about an hour.</p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Send Reply</h4>
                  <div className="space-y-3">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Type your reply to the patient..."
                      className="w-full p-3 border rounded-lg resize-none h-32"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded" />
                          Mark as resolved
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded" />
                          Schedule follow-up
                        </label>
                      </div>
                      <Button onClick={handleSendReply} className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reminders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Appointment Reminders
              </CardTitle>
              <CardDescription>Automated reminder system for patient appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">24-Hour Reminder</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Sent 24 hours before appointment via SMS and email
                  </p>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">2-Hour Reminder</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Final reminder sent 2 hours before appointment
                  </p>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Pre-Visit Forms</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Forms sent 48 hours before first-time visits
                  </p>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Educational Content Delivery
              </CardTitle>
              <CardDescription>Personalized health education for patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {educationalContent.map((content) => (
                  <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{content.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{content.description}</p>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{content.category}</Badge>
                        <span className="text-xs text-gray-500">{content.readTime} read</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">Preview</Button>
                      <Button size="sm">Send to Patients</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
