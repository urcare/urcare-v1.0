
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Share,
  Users,
  MessageCircle,
  Settings,
  Maximize,
  Clock,
  CheckCircle,
  AlertCircle,
  Camera
} from 'lucide-react';

export const VideoConsultationInterface = () => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isInCall, setIsInCall] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [waitingRoomActive, setWaitingRoomActive] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeConsultations = [
    {
      id: 1,
      patientName: 'Sarah Johnson',
      time: '10:00 AM',
      duration: '15:30',
      status: 'in-progress',
      type: 'Follow-up',
      urgency: 'routine'
    },
    {
      id: 2,
      patientName: 'Michael Chen',
      time: '10:30 AM',
      duration: '00:00',
      status: 'waiting',
      type: 'Initial Consultation',
      urgency: 'urgent'
    },
    {
      id: 3,
      patientName: 'Emily Davis',
      time: '11:00 AM',
      duration: '00:00',
      status: 'scheduled',
      type: 'Mental Health',
      urgency: 'routine'
    }
  ];

  const waitingRoomPatients = [
    {
      id: 1,
      name: 'Robert Wilson',
      waitTime: '00:03:45',
      appointmentTime: '10:15 AM',
      reason: 'Routine Check-up',
      priority: 'normal'
    },
    {
      id: 2,
      name: 'Lisa Anderson',
      waitTime: '00:01:20',
      appointmentTime: '10:20 AM',
      reason: 'Prescription Refill',
      priority: 'low'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'text-red-600';
      case 'routine': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleStartCall = () => {
    setIsInCall(true);
    setWaitingRoomActive(false);
    // Simulate camera activation
    if (videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.log('Error accessing camera:', err));
    }
  };

  const handleEndCall = () => {
    setIsInCall(false);
    setWaitingRoomActive(true);
    // Stop camera
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="consultation" className="w-full">
        <TabsList>
          <TabsTrigger value="consultation">Active Consultation</TabsTrigger>
          <TabsTrigger value="waiting">Waiting Room</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="consultation" className="space-y-4">
          {/* Video Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video Consultation
                </span>
                {isInCall && (
                  <Badge className="bg-green-100 text-green-800">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                      Live
                    </div>
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Provider Video */}
                <div className="relative">
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    {isInCall ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <div className="text-center">
                          <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>Camera Off</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-black bg-opacity-50 text-white">
                      Dr. Provider (You)
                    </Badge>
                  </div>
                </div>

                {/* Patient Video */}
                <div className="relative">
                  <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <div className="text-center">
                        <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>{isInCall ? 'Patient Connected' : 'No Patient Connected'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-black bg-opacity-50 text-white">
                      {isInCall ? 'Sarah Johnson' : 'Waiting for Patient'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Control Panel */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <Button
                  variant={isVideoOn ? "default" : "destructive"}
                  size="lg"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className="rounded-full"
                >
                  {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
                
                <Button
                  variant={isAudioOn ? "default" : "destructive"}
                  size="lg"
                  onClick={() => setIsAudioOn(!isAudioOn)}
                  className="rounded-full"
                >
                  {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>

                <Button
                  variant={isScreenSharing ? "secondary" : "outline"}
                  size="lg"
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className="rounded-full"
                >
                  <Share className="h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full"
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full"
                >
                  <Settings className="h-5 w-5" />
                </Button>

                {isInCall ? (
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={handleEndCall}
                    className="rounded-full"
                  >
                    <PhoneOff className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="lg"
                    onClick={handleStartCall}
                    className="rounded-full bg-green-600 hover:bg-green-700"
                  >
                    <Phone className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Active Consultations List */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeConsultations.map((consultation) => (
                  <div key={consultation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{consultation.time}</span>
                      </div>
                      <div>
                        <div className="font-medium">{consultation.patientName}</div>
                        <div className="text-sm text-gray-600">{consultation.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Duration: {consultation.duration}</div>
                        <div className={`text-sm ${getUrgencyColor(consultation.urgency)}`}>
                          {consultation.urgency}
                        </div>
                      </div>
                      <Badge className={getStatusColor(consultation.status)}>
                        {consultation.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Join
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waiting" className="space-y-4">
          {/* Virtual Waiting Room */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Virtual Waiting Room
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {waitingRoomPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="font-medium text-orange-600">{patient.waitTime}</span>
                      </div>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-gray-600">{patient.reason}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Scheduled: {patient.appointmentTime}</div>
                        <div className="text-sm text-gray-500">Priority: {patient.priority}</div>
                      </div>
                      <Button variant="default" size="sm">
                        Admit Patient
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          {/* Scheduled Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Scheduled Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeConsultations.filter(c => c.status === 'scheduled').map((consultation) => (
                  <div key={consultation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{consultation.patientName}</div>
                        <div className="text-sm text-gray-600">{consultation.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">{consultation.time}</div>
                        <div className="text-sm text-gray-600">{consultation.urgency}</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Prepare
                      </Button>
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
