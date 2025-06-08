
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  Users, 
  Calendar,
  Clock,
  Record,
  Settings,
  FileText,
  Camera,
  Phone,
  Share
} from 'lucide-react';

interface TelemedSession {
  id: string;
  patientName: string;
  patientId: string;
  doctor: string;
  scheduledTime: string;
  duration: string;
  status: 'scheduled' | 'active' | 'completed' | 'missed';
  type: 'consultation' | 'follow-up' | 'emergency';
  recordingEnabled: boolean;
}

interface VirtualRoom {
  id: string;
  name: string;
  participants: number;
  maxParticipants: number;
  status: 'active' | 'waiting' | 'ended';
  purpose: string;
  startTime: string;
}

export const TelemedicineInterface = () => {
  const [currentSession, setCurrentSession] = useState<TelemedSession | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const upcomingSessions: TelemedSession[] = [
    {
      id: 'session-1',
      patientName: 'Sarah Johnson',
      patientId: 'PAT001',
      doctor: 'Dr. Smith',
      scheduledTime: '2:00 PM Today',
      duration: '30 minutes',
      status: 'scheduled',
      type: 'consultation',
      recordingEnabled: true
    },
    {
      id: 'session-2',
      patientName: 'Michael Chen',
      patientId: 'PAT002',
      doctor: 'Dr. Williams',
      scheduledTime: '3:30 PM Today',
      duration: '15 minutes',
      status: 'scheduled',
      type: 'follow-up',
      recordingEnabled: false
    },
    {
      id: 'session-3',
      patientName: 'Emma Davis',
      patientId: 'PAT003',
      doctor: 'Dr. Brown',
      scheduledTime: '4:00 PM Today',
      duration: '45 minutes',
      status: 'scheduled',
      type: 'consultation',
      recordingEnabled: true
    }
  ];

  const virtualRooms: VirtualRoom[] = [
    {
      id: 'room-1',
      name: 'Cardiology Consultation Room',
      participants: 2,
      maxParticipants: 4,
      status: 'active',
      purpose: 'Patient consultation with family',
      startTime: '20 minutes ago'
    },
    {
      id: 'room-2',
      name: 'Multi-specialty Conference',
      participants: 0,
      maxParticipants: 8,
      status: 'waiting',
      purpose: 'Complex case discussion',
      startTime: 'Scheduled for 5:00 PM'
    },
    {
      id: 'room-3',
      name: 'Emergency Consultation',
      participants: 3,
      maxParticipants: 6,
      status: 'active',
      purpose: 'Urgent case review',
      startTime: '5 minutes ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'missed': return 'bg-red-100 text-red-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-blue-100 text-blue-800';
      case 'follow-up': return 'bg-green-100 text-green-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const startSession = (session: TelemedSession) => {
    setCurrentSession(session);
  };

  const endSession = () => {
    setCurrentSession(null);
    setIsVideoOn(true);
    setIsAudioOn(true);
    setIsScreenSharing(false);
    setIsRecording(false);
  };

  return (
    <div className="space-y-6">
      {/* Active Session */}
      {currentSession && (
        <Card className="border-green-500 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium">
                  Session with {currentSession.patientName}
                </h3>
                <p className="text-sm text-gray-600">
                  Patient ID: {currentSession.patientId} • Duration: 15:30
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">
                Live Session
              </Badge>
            </div>

            {/* Video Interface Mock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative">
                <div className="text-center text-white">
                  <Camera className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Patient Video Feed</p>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge className="bg-red-600 text-white">LIVE</Badge>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg aspect-video flex items-center justify-center relative">
                <div className="text-center text-white">
                  <Video className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Your Video Feed</p>
                </div>
                {isRecording && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-red-600 text-white flex items-center gap-1">
                      <Record className="h-3 w-3" />
                      REC
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Session Controls */}
            <div className="flex items-center justify-center gap-3">
              <Button
                variant={isVideoOn ? "default" : "destructive"}
                size="sm"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className="flex items-center gap-2"
              >
                {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                {isVideoOn ? 'Video On' : 'Video Off'}
              </Button>
              
              <Button
                variant={isAudioOn ? "default" : "destructive"}
                size="sm"
                onClick={() => setIsAudioOn(!isAudioOn)}
                className="flex items-center gap-2"
              >
                {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                {isAudioOn ? 'Mute' : 'Unmute'}
              </Button>

              <Button
                variant={isScreenSharing ? "default" : "outline"}
                size="sm"
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className="flex items-center gap-2"
              >
                <Monitor className="h-4 w-4" />
                {isScreenSharing ? 'Stop Share' : 'Share Screen'}
              </Button>

              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={() => setIsRecording(!isRecording)}
                className="flex items-center gap-2"
              >
                <Record className="h-4 w-4" />
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Notes
              </Button>

              <Button
                variant="destructive"
                onClick={endSession}
                className="flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                End Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Sessions
                </CardTitle>
                <CardDescription>Scheduled telemedicine appointments</CardDescription>
              </div>
              <Button size="sm">Schedule New</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{session.patientName}</h4>
                    <p className="text-sm text-gray-600">ID: {session.patientId}</p>
                    <p className="text-sm text-gray-600">
                      Dr: {session.doctor} • {session.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">{session.scheduledTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(session.type)}>
                      {session.type}
                    </Badge>
                    {session.recordingEnabled && (
                      <Badge variant="outline" className="text-xs">
                        <Record className="h-3 w-3 mr-1" />
                        Recording
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => startSession(session)}
                      disabled={currentSession !== null}
                    >
                      <Video className="h-3 w-3 mr-1" />
                      Start
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Virtual Rooms */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Virtual Rooms
                </CardTitle>
                <CardDescription>Multi-participant consultation rooms</CardDescription>
              </div>
              <Button size="sm">Create Room</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {virtualRooms.map((room) => (
              <div key={room.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{room.name}</h4>
                    <p className="text-sm text-gray-600">{room.purpose}</p>
                    <p className="text-sm text-gray-500">{room.startTime}</p>
                  </div>
                  <Badge className={getStatusColor(room.status)}>
                    {room.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {room.participants}/{room.maxParticipants} participants
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm"
                      disabled={room.status === 'ended'}
                    >
                      {room.status === 'active' ? 'Join' : 'Enter'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Session Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Session Analytics
          </CardTitle>
          <CardDescription>Telemedicine usage statistics and quality metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-600">Sessions This Week</div>
              <div className="text-xs text-green-600 mt-1">+12% from last week</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">94.2%</div>
              <div className="text-sm text-gray-600">Connection Success Rate</div>
              <div className="text-xs text-green-600 mt-1">+2.1% from last week</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">23 min</div>
              <div className="text-sm text-gray-600">Avg Session Duration</div>
              <div className="text-xs text-gray-600 mt-1">Standard: 30 min</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">4.8/5</div>
              <div className="text-sm text-gray-600">Patient Satisfaction</div>
              <div className="text-xs text-green-600 mt-1">+0.2 from last month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Platform Configuration
          </CardTitle>
          <CardDescription>Telemedicine system settings and integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Video Quality Settings</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Default Resolution</span>
                  <span className="text-sm font-medium">1080p HD</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Bandwidth Optimization</span>
                  <span className="text-sm font-medium">Enabled</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Auto Quality Adjustment</span>
                  <span className="text-sm font-medium">Enabled</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Security & Compliance</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">End-to-End Encryption</span>
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">HIPAA Compliance</span>
                  <span className="text-sm font-medium text-green-600">Verified</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Session Logging</span>
                  <span className="text-sm font-medium">Enabled</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">EMR Integration</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Auto Documentation</span>
                  <span className="text-sm font-medium">Enabled</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Session Notes Sync</span>
                  <span className="text-sm font-medium">Real-time</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Recording Storage</span>
                  <span className="text-sm font-medium">Secure Cloud</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
