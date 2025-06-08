
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Calendar, 
  FileText, 
  MessageCircle, 
  Bell, 
  Upload,
  Download,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

export const ParticipantPortal = () => {
  const [selectedParticipant, setSelectedParticipant] = useState('cardio-001-001');

  const participantData = {
    'cardio-001-001': {
      subjectId: 'CARDIO-001-001',
      initials: 'J.D.',
      studyArm: 'Treatment A',
      enrollmentDate: '2024-01-15',
      nextVisit: '2024-02-20',
      completedVisits: 3,
      totalVisits: 8,
      unreadMessages: 2,
      pendingForms: 1
    }
  };

  const currentParticipant = participantData[selectedParticipant as keyof typeof participantData];

  const upcomingActivities = [
    {
      id: '1',
      type: 'visit',
      title: 'Month 3 Follow-up Visit',
      date: '2024-02-20',
      time: '10:00 AM',
      location: 'Cardiology Clinic',
      status: 'scheduled'
    },
    {
      id: '2',
      type: 'form',
      title: 'Quality of Life Questionnaire',
      date: '2024-02-15',
      time: 'Any time',
      location: 'Online',
      status: 'pending'
    },
    {
      id: '3',
      type: 'reminder',
      title: 'Medication Adherence Check',
      date: '2024-02-18',
      time: '8:00 AM',
      location: 'Self-assessment',
      status: 'upcoming'
    }
  ];

  const dataCollectionForms = [
    {
      id: '1',
      name: 'Daily Symptom Diary',
      type: 'daily',
      status: 'active',
      lastCompleted: '2024-01-25',
      completionRate: 92
    },
    {
      id: '2',
      name: 'Quality of Life Assessment',
      type: 'monthly',
      status: 'pending',
      dueDate: '2024-02-15',
      completionRate: 100
    },
    {
      id: '3',
      name: 'Medication Adherence Log',
      type: 'weekly',
      status: 'completed',
      lastCompleted: '2024-01-22',
      completionRate: 87
    }
  ];

  const communications = [
    {
      id: '1',
      from: 'Dr. Sarah Johnson',
      subject: 'Upcoming Visit Reminder',
      date: '2024-01-24',
      read: false,
      preview: 'Your next visit is scheduled for February 20th...'
    },
    {
      id: '2',
      from: 'Study Coordinator',
      subject: 'New Questionnaire Available',
      date: '2024-01-22',
      read: false,
      preview: 'Please complete the quality of life questionnaire...'
    },
    {
      id: '3',
      from: 'Research Team',
      subject: 'Study Progress Update',
      date: '2024-01-20',
      read: true,
      preview: 'Thank you for your continued participation...'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'visit': return <Calendar className="h-4 w-4" />;
      case 'form': return <FileText className="h-4 w-4" />;
      case 'reminder': return <Bell className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      scheduled: 'bg-blue-500',
      pending: 'bg-yellow-500',
      upcoming: 'bg-purple-500',
      completed: 'bg-green-500',
      active: 'bg-green-500'
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Participant Portal</h2>
          <p className="text-gray-600">Research participant interface and communication</p>
        </div>
        <Select value={selectedParticipant} onValueChange={setSelectedParticipant}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select participant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cardio-001-001">CARDIO-001-001 (J.D.)</SelectItem>
            <SelectItem value="cardio-001-002">CARDIO-001-002 (M.S.)</SelectItem>
            <SelectItem value="neuro-002-001">NEURO-002-001 (R.T.)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Participant Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Participant {currentParticipant.subjectId}
              </CardTitle>
              <CardDescription>
                Study Arm: {currentParticipant.studyArm} | Enrolled: {currentParticipant.enrollmentDate}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {currentParticipant.unreadMessages > 0 && (
                <Badge className="bg-red-500 text-white">
                  {currentParticipant.unreadMessages} unread
                </Badge>
              )}
              {currentParticipant.pendingForms > 0 && (
                <Badge className="bg-yellow-500 text-white">
                  {currentParticipant.pendingForms} pending
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{currentParticipant.completedVisits}</p>
              <p className="text-sm text-gray-600">Completed Visits</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{currentParticipant.totalVisits}</p>
              <p className="text-sm text-gray-600">Total Visits</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{currentParticipant.nextVisit}</p>
              <p className="text-sm text-gray-600">Next Visit</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {Math.round((currentParticipant.completedVisits / currentParticipant.totalVisits) * 100)}%
              </p>
              <p className="text-sm text-gray-600">Progress</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="activities" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="forms">Data Collection</TabsTrigger>
          <TabsTrigger value="communications">Messages</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Activities</CardTitle>
              <CardDescription>Scheduled visits, forms, and reminders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    <div className={`p-2 rounded-full ${getStatusColor(activity.status)} text-white`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-600">
                        {activity.date} at {activity.time} | {activity.location}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(activity.status)} text-white`}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Collection Forms</CardTitle>
              <CardDescription>Complete questionnaires and assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataCollectionForms.map((form) => (
                  <div key={form.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{form.name}</h4>
                        <Badge className={`${getStatusColor(form.status)} text-white`}>
                          {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {form.type.charAt(0).toUpperCase() + form.type.slice(1)} form | 
                        Completion rate: {form.completionRate}%
                      </p>
                      {form.lastCompleted && (
                        <p className="text-xs text-gray-500">Last completed: {form.lastCompleted}</p>
                      )}
                      {form.dueDate && (
                        <p className="text-xs text-orange-600">Due: {form.dueDate}</p>
                      )}
                    </div>
                    <Button variant={form.status === 'pending' ? 'default' : 'outline'} size="sm">
                      {form.status === 'pending' ? 'Complete Now' : 'View Form'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>Communication with the research team</CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  New Message
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communications.map((message) => (
                  <div key={message.id} className={`flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 ${!message.read ? 'bg-blue-50 border-blue-200' : ''}`}>
                    <div className={`w-3 h-3 rounded-full mt-2 ${!message.read ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-semibold ${!message.read ? 'text-blue-900' : 'text-gray-900'}`}>
                          {message.subject}
                        </h4>
                        {!message.read && <Badge className="bg-blue-500 text-white text-xs">New</Badge>}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">From: {message.from}</p>
                      <p className="text-sm text-gray-600">{message.preview}</p>
                      <p className="text-xs text-gray-500 mt-2">{message.date}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Open
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Study Documents</CardTitle>
                  <CardDescription>Access study materials and upload documents</CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-6 w-6 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">Informed Consent</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Version 3.0 - Signed on 2024-01-15</p>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-6 w-6 text-green-600" />
                      <h4 className="font-semibold text-gray-900">Study Protocol</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Patient summary version</p>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-6 w-6 text-purple-600" />
                      <h4 className="font-semibold text-gray-900">Visit Schedules</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Personalized visit calendar</p>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-6 w-6 text-orange-600" />
                      <h4 className="font-semibold text-gray-900">Contact Information</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Research team contacts</p>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
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
