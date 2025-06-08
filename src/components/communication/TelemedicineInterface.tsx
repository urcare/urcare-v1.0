
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Monitor, 
  Calendar, 
  Clock, 
  Users,
  Settings,
  PlayCircle,
  StopCircle,
  FileText
} from 'lucide-react';

interface TelemedicineSession {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  scheduledTime: string;
  duration: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  type: 'consultation' | 'follow-up' | 'emergency';
  recordingEnabled: boolean;
}

interface TechnicalSettings {
  videoEnabled: boolean;
  audioEnabled: boolean;
  screenSharing: boolean;
  recording: boolean;
  quality: 'low' | 'medium' | 'high';
}

export const TelemedicineInterface = () => {
  const [activeSession, setActiveSession] = useState<string>('session-1');
  const [technicalSettings, setTechnicalSettings] = useState<TechnicalSettings>({
    videoEnabled: true,
    audioEnabled: true,
    screenSharing: false,
    recording: false,
    quality: 'high'
  });

  const sessions: TelemedicineSession[] = [
    {
      id: 'session-1',
      patientName: 'Sarah Johnson',
      patientId: 'PAT001',
      doctorName: 'Dr. Smith',
      scheduledTime: '10:30 AM',
      duration: '15 minutes',
      status: 'ongoing',
      type: 'consultation',
      recordingEnabled: true
    },
    {
      id: 'session-2',
      patientName: 'Michael Chen',
      patientId: 'PAT002',
      doctorName: 'Dr. Williams',
      scheduledTime: '11:00 AM',
      duration: '30 minutes',
      status: 'scheduled',
      type: 'follow-up',
      recordingEnabled: false
    },
    {
      id: 'session-3',
      patientName: 'Emma Davis',
      patientId: 'PAT003',
      doctorName: 'Dr. Brown',
      scheduledTime: '09:45 AM',
      duration: '25 minutes',
      status: 'completed',
      type: 'consultation',
      recordingEnabled: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'consultation': return 'bg-blue-100 text-blue-800';
      case 'follow-up': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleSetting = (setting: keyof TechnicalSettings) => {
    if (setting === 'quality') return; // Don't toggle quality, it's a select
    setTechnicalSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Telemedicine Platform</h2>
          <p className="text-gray-600">Secure video consultations and clinical sessions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Session
          </Button>
          <Button className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Start Session
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Session List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>Scheduled and ongoing consultations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 border-b ${
                    activeSession === session.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => setActiveSession(session.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{session.patientName}</h4>
                      <p className="text-xs text-gray-600">{session.patientId}</p>
                    </div>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-600">{session.scheduledTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-600">{session.doctorName}</span>
                    </div>
                    <Badge className={getTypeColor(session.type)} variant="outline">
                      {session.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Video Interface */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Video Conference</CardTitle>
                <CardDescription>Sarah Johnson - Consultation Session</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {technicalSettings.recording && (
                  <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    Recording
                  </Badge>
                )}
                <Badge className="bg-green-100 text-green-800">00:15:23</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Video Placeholder */}
            <div className="aspect-video bg-gray-900 rounded-lg mb-4 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <Video className="h-12 w-12 mx-auto mb-2 opacity-60" />
                  <p className="text-sm opacity-80">Video Stream Active</p>
                </div>
              </div>
              
              {/* Patient Video (Picture-in-Picture) */}
              <div className="absolute top-4 right-4 w-32 h-24 bg-gray-700 rounded border-2 border-white">
                <div className="flex items-center justify-center h-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Controls Overlay */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center gap-2 bg-black bg-opacity-50 rounded-full p-2">
                  <Button
                    size="sm"
                    variant={technicalSettings.audioEnabled ? "default" : "destructive"}
                    onClick={() => toggleSetting('audioEnabled')}
                    className="rounded-full"
                  >
                    {technicalSettings.audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant={technicalSettings.videoEnabled ? "default" : "destructive"}
                    onClick={() => toggleSetting('videoEnabled')}
                    className="rounded-full"
                  >
                    {technicalSettings.videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant={technicalSettings.screenSharing ? "default" : "outline"}
                    onClick={() => toggleSetting('screenSharing')}
                    className="rounded-full"
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="rounded-full"
                  >
                    <PhoneOff className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Session Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant={technicalSettings.recording ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => toggleSetting('recording')}
                  className="flex items-center gap-2"
                >
                  {technicalSettings.recording ? <StopCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                  {technicalSettings.recording ? 'Stop Recording' : 'Start Recording'}
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Session Notes
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Quality:</span>
                <select 
                  className="border rounded px-2 py-1 text-sm"
                  value={technicalSettings.quality}
                  onChange={(e) => setTechnicalSettings(prev => ({ ...prev, quality: e.target.value as 'low' | 'medium' | 'high' }))}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Information */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Session Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Patient Information</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-600">Name:</span> Sarah Johnson</p>
                <p><span className="text-gray-600">ID:</span> PAT001</p>
                <p><span className="text-gray-600">Age:</span> 34</p>
                <p><span className="text-gray-600">Type:</span> Consultation</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Session Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span>15:23</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Connection:</span>
                  <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Recording:</span>
                  <Badge className={technicalSettings.recording ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}>
                    {technicalSettings.recording ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Add Notes
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Follow-up
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Invite Specialist
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Sessions</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Video className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold">23m</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">98.5%</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recordings</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <PlayCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
