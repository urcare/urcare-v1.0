
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Video, Clock, Users, Bell, CheckCircle, AlertTriangle } from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimary: boolean;
  preferences: {
    updateFrequency: 'immediate' | 'hourly' | 'daily';
    communicationMethod: 'phone' | 'text' | 'email' | 'app';
    visitScheduled: boolean;
  };
  lastUpdate: Date;
  status: 'available' | 'busy' | 'unreachable';
}

interface PatientCommunication {
  patientId: string;
  patientName: string;
  room: string;
  familyMembers: FamilyMember[];
  scheduledUpdates: {
    time: Date;
    type: 'daily_round' | 'procedure_update' | 'condition_change' | 'discharge_planning';
    status: 'pending' | 'completed' | 'missed';
    recipients: string[];
  }[];
  recentMessages: {
    id: string;
    timestamp: Date;
    sender: string;
    recipient: string;
    type: 'call' | 'text' | 'email' | 'video_call';
    subject: string;
    status: 'sent' | 'delivered' | 'read' | 'failed';
  }[];
  visitingHours: {
    start: string;
    end: string;
    restrictions: string[];
    currentVisitors: number;
    maxVisitors: number;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

const mockCommunicationData: PatientCommunication[] = [
  {
    patientId: 'ICU001',
    patientName: 'Sarah Johnson',
    room: 'ICU-A1',
    familyMembers: [
      {
        id: 'FM001',
        name: 'John Johnson',
        relationship: 'Husband',
        phone: '+1-555-0123',
        email: 'john.johnson@email.com',
        isPrimary: true,
        preferences: {
          updateFrequency: 'immediate',
          communicationMethod: 'phone',
          visitScheduled: true
        },
        lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'available'
      },
      {
        id: 'FM002',
        name: 'Emily Johnson',
        relationship: 'Daughter',
        phone: '+1-555-0124',
        email: 'emily.johnson@email.com',
        isPrimary: false,
        preferences: {
          updateFrequency: 'daily',
          communicationMethod: 'text',
          visitScheduled: false
        },
        lastUpdate: new Date(Date.now() - 6 * 60 * 60 * 1000),
        status: 'busy'
      }
    ],
    scheduledUpdates: [
      {
        time: new Date(Date.now() + 2 * 60 * 60 * 1000),
        type: 'daily_round',
        status: 'pending',
        recipients: ['FM001', 'FM002']
      },
      {
        time: new Date(Date.now() - 4 * 60 * 60 * 1000),
        type: 'condition_change',
        status: 'completed',
        recipients: ['FM001']
      }
    ],
    recentMessages: [
      {
        id: 'MSG001',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        sender: 'Dr. Wilson',
        recipient: 'John Johnson',
        type: 'call',
        subject: 'Daily condition update',
        status: 'delivered'
      },
      {
        id: 'MSG002',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        sender: 'Nurse Smith',
        recipient: 'Emily Johnson',
        type: 'text',
        subject: 'Treatment progress update',
        status: 'read'
      }
    ],
    visitingHours: {
      start: '08:00',
      end: '20:00',
      restrictions: ['Max 2 visitors', 'Health screening required'],
      currentVisitors: 1,
      maxVisitors: 2
    },
    emergencyContact: {
      name: 'John Johnson',
      phone: '+1-555-0123',
      relationship: 'Husband'
    }
  },
  {
    patientId: 'ICU002',
    patientName: 'Michael Chen',
    room: 'ICU-B2',
    familyMembers: [
      {
        id: 'FM003',
        name: 'Lisa Chen',
        relationship: 'Wife',
        phone: '+1-555-0125',
        email: 'lisa.chen@email.com',
        isPrimary: true,
        preferences: {
          updateFrequency: 'hourly',
          communicationMethod: 'app',
          visitScheduled: true
        },
        lastUpdate: new Date(Date.now() - 1 * 60 * 60 * 1000),
        status: 'available'
      }
    ],
    scheduledUpdates: [
      {
        time: new Date(Date.now() + 1 * 60 * 60 * 1000),
        type: 'discharge_planning',
        status: 'pending',
        recipients: ['FM003']
      }
    ],
    recentMessages: [
      {
        id: 'MSG003',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        sender: 'Dr. Chen',
        recipient: 'Lisa Chen',
        type: 'video_call',
        subject: 'Recovery progress discussion',
        status: 'delivered'
      }
    ],
    visitingHours: {
      start: '08:00',
      end: '20:00',
      restrictions: ['Health screening required'],
      currentVisitors: 0,
      maxVisitors: 2
    },
    emergencyContact: {
      name: 'Lisa Chen',
      phone: '+1-555-0125',
      relationship: 'Wife'
    }
  }
];

export const FamilyCommunicationInterface = () => {
  const [communicationData, setCommunicationData] = useState<PatientCommunication[]>(mockCommunicationData);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500 text-white';
      case 'busy': return 'bg-yellow-500 text-white';
      case 'unreachable': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getUpdateStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'pending': return 'bg-blue-500 text-white';
      case 'missed': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'video_call': return <Video className="h-4 w-4" />;
      case 'text': return <MessageCircle className="h-4 w-4" />;
      case 'email': return <MessageCircle className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatTimeSince = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  const handleSendUpdate = (patientId: string, recipients: string[]) => {
    console.log(`Sending update for patient ${patientId} to recipients:`, recipients);
    // Implementation for sending updates
  };

  const handleScheduleCall = (patientId: string, familyMemberId: string) => {
    console.log(`Scheduling call for patient ${patientId} with family member ${familyMemberId}`);
    // Implementation for scheduling calls
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Family Communication Interface
          </CardTitle>
          <CardDescription>
            Centralized communication hub for keeping families informed about ICU patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">3</p>
                  <p className="text-sm text-gray-600">Family Members</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">2</p>
                  <p className="text-sm text-gray-600">Updates Sent</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">2</p>
                  <p className="text-sm text-gray-600">Pending Updates</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-purple-200 bg-purple-50">
              <div className="flex items-center gap-2">
                <Bell className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">1</p>
                  <p className="text-sm text-gray-600">Current Visitors</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {communicationData.map((patient) => (
              <Card key={patient.patientId} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{patient.patientName}</h3>
                      <Badge variant="outline">{patient.room}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Visitors: {patient.visitingHours.currentVisitors}/{patient.visitingHours.maxVisitors}
                      </p>
                      <p className="text-sm text-gray-500">
                        Visiting: {patient.visitingHours.start} - {patient.visitingHours.end}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Family Members</h4>
                      <div className="space-y-3">
                        {patient.familyMembers.map((member) => (
                          <div key={member.id} className="p-2 border rounded">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-sm text-gray-600">{member.relationship}</p>
                              </div>
                              <div className="flex gap-2">
                                {member.isPrimary && (
                                  <Badge className="bg-blue-500 text-white">Primary</Badge>
                                )}
                                <Badge className={getStatusColor(member.status)}>
                                  {member.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>Phone: {member.phone}</p>
                              <p>Prefers: {member.preferences.communicationMethod}</p>
                              <p>Updates: {member.preferences.updateFrequency}</p>
                              <p>Last contact: {formatTimeSince(member.lastUpdate)}</p>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleScheduleCall(patient.patientId, member.id)}
                              >
                                <Phone className="h-3 w-3 mr-1" />
                                Call
                              </Button>
                              <Button size="sm" variant="outline">
                                <Video className="h-3 w-3 mr-1" />
                                Video
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Scheduled Updates</h4>
                      <div className="space-y-3">
                        {patient.scheduledUpdates.map((update, index) => (
                          <div key={index} className="p-2 border rounded">
                            <div className="flex items-center justify-between mb-2">
                              <Badge className={getUpdateStatusColor(update.status)}>
                                {update.status}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {update.status === 'pending' ? formatTime(update.time) : formatTimeSince(update.time)}
                              </span>
                            </div>
                            <p className="text-sm font-medium">{update.type.replace('_', ' ')}</p>
                            <p className="text-sm text-gray-600">
                              Recipients: {update.recipients.length} family member(s)
                            </p>
                            {update.status === 'pending' && (
                              <Button 
                                size="sm" 
                                className="mt-2 w-full"
                                onClick={() => handleSendUpdate(patient.patientId, update.recipients)}
                              >
                                <Bell className="h-3 w-3 mr-1" />
                                Send Now
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Recent Communications</h4>
                      <div className="space-y-3">
                        {patient.recentMessages.map((message) => (
                          <div key={message.id} className="p-2 border rounded">
                            <div className="flex items-center gap-2 mb-1">
                              {getMessageIcon(message.type)}
                              <span className="text-sm font-medium">{message.sender}</span>
                              <span className="text-sm text-gray-500">→ {message.recipient}</span>
                            </div>
                            <p className="text-sm text-gray-700">{message.subject}</p>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-gray-500">{formatTimeSince(message.timestamp)}</span>
                              <Badge className={`text-xs ${message.status === 'read' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {message.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <Card className="p-4 mb-4">
                    <h4 className="font-medium mb-3">Emergency Contact & Visiting Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Emergency Contact</h5>
                        <div className="p-2 bg-red-50 rounded">
                          <p className="font-medium">{patient.emergencyContact.name}</p>
                          <p className="text-sm">{patient.emergencyContact.relationship}</p>
                          <p className="text-sm">{patient.emergencyContact.phone}</p>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm mb-2">Visiting Restrictions</h5>
                        <div className="space-y-1">
                          {patient.visitingHours.restrictions.map((restriction, index) => (
                            <div key={index} className="text-sm p-1 bg-yellow-50 rounded flex items-center gap-2">
                              <AlertTriangle className="h-3 w-3 text-yellow-600" />
                              {restriction}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>

                  <div className="flex gap-2">
                    <Button size="sm" variant="default">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Send Update
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Conference Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <Users className="h-4 w-4 mr-1" />
                      Manage Contacts
                    </Button>
                    <Button size="sm" variant="outline">
                      <Clock className="h-4 w-4 mr-1" />
                      Schedule Update
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
