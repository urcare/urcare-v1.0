
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  PhoneMissed,
  Mic, 
  MicOff, 
  Users, 
  Clock, 
  Settings,
  PlayCircle,
  PauseCircle,
  Volume2,
  VolumeX
} from 'lucide-react';

interface CallRecord {
  id: string;
  caller: string;
  callee: string;
  type: 'incoming' | 'outgoing' | 'conference';
  duration: string;
  timestamp: string;
  status: 'completed' | 'missed' | 'ongoing';
  recorded: boolean;
}

interface ActiveCall {
  id: string;
  participant: string;
  type: 'direct' | 'conference';
  duration: string;
  status: 'ringing' | 'connected' | 'on-hold';
  muted: boolean;
  recording: boolean;
}

export const VoIPIntegration = () => {
  const [activeTab, setActiveTab] = useState<'calls' | 'conference' | 'history' | 'settings'>('calls');
  const [currentCall, setCurrentCall] = useState<ActiveCall | null>({
    id: 'call-1',
    participant: 'Dr. Smith',
    type: 'direct',
    duration: '02:34',
    status: 'connected',
    muted: false,
    recording: false
  });

  const recentCalls: CallRecord[] = [
    {
      id: 'call-1',
      caller: 'Dr. Smith',
      callee: 'Nurse Johnson',
      type: 'outgoing',
      duration: '5:23',
      timestamp: '10 minutes ago',
      status: 'completed',
      recorded: true
    },
    {
      id: 'call-2',
      caller: 'Emergency Dept',
      callee: 'ICU Coordinator',
      type: 'incoming',
      duration: '12:45',
      timestamp: '25 minutes ago',
      status: 'completed',
      recorded: true
    },
    {
      id: 'call-3',
      caller: 'Dr. Williams',
      callee: 'Lab Technician',
      type: 'outgoing',
      duration: '0:00',
      timestamp: '1 hour ago',
      status: 'missed',
      recorded: false
    }
  ];

  const conferenceRooms = [
    {
      id: 'room-1',
      name: 'Emergency Response Team',
      participants: 5,
      status: 'active',
      duration: '45:12'
    },
    {
      id: 'room-2',
      name: 'Surgery Planning',
      participants: 3,
      status: 'scheduled',
      scheduledTime: '2:00 PM'
    },
    {
      id: 'room-3',
      name: 'Morning Rounds',
      participants: 8,
      status: 'completed',
      duration: '1:23:45'
    }
  ];

  const getCallStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return PhoneCall;
      case 'missed': return PhoneMissed;
      case 'ongoing': return Phone;
      default: return Phone;
    }
  };

  const getCallStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'missed': return 'text-red-600';
      case 'ongoing': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const handleEndCall = () => {
    setCurrentCall(null);
  };

  const toggleMute = () => {
    if (currentCall) {
      setCurrentCall({ ...currentCall, muted: !currentCall.muted });
    }
  };

  const toggleRecording = () => {
    if (currentCall) {
      setCurrentCall({ ...currentCall, recording: !currentCall.recording });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">VoIP Integration</h2>
          <p className="text-gray-600">Voice communication and call management system</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Join Conference
          </Button>
          <Button className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Make Call
          </Button>
        </div>
      </div>

      {/* Active Call Interface */}
      {currentCall && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>DS</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{currentCall.participant}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className={`${currentCall.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {currentCall.status}
                    </Badge>
                    <span className="text-sm text-gray-600">{currentCall.duration}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={currentCall.muted ? "destructive" : "outline"}
                  size="sm"
                  onClick={toggleMute}
                >
                  {currentCall.muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  variant={currentCall.recording ? "default" : "outline"}
                  size="sm"
                  onClick={toggleRecording}
                >
                  {currentCall.recording ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                </Button>
                <Button variant="destructive" onClick={handleEndCall}>
                  <PhoneOff className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Dial & Call Management */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Dial</CardTitle>
            <CardDescription>Frequently contacted staff</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>ER</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">Emergency Room</p>
                    <p className="text-xs text-gray-600">Ext. 911</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Phone className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>ICU</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">ICU Station</p>
                    <p className="text-xs text-gray-600">Ext. 234</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Phone className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>PH</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">Pharmacy</p>
                    <p className="text-xs text-gray-600">Ext. 567</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Phone className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="flex gap-2">
                <Input placeholder="Enter extension or number" className="flex-1" />
                <Button size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conference Rooms */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Conference Rooms</CardTitle>
            <CardDescription>Active and scheduled conference calls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {conferenceRooms.map((room) => (
              <div key={room.id} className="p-3 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{room.name}</h4>
                  <Badge className={room.status === 'active' ? 'bg-green-100 text-green-800' : 
                                  room.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-gray-100 text-gray-800'}>
                    {room.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-3 w-3" />
                    <span>{room.participants} participants</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {room.status === 'active' && (
                      <Button size="sm" variant="outline">Join</Button>
                    )}
                    {room.status === 'scheduled' && (
                      <Button size="sm" variant="outline">Schedule</Button>
                    )}
                  </div>
                </div>
                {room.duration && (
                  <p className="text-xs text-gray-500 mt-1">Duration: {room.duration}</p>
                )}
                {room.scheduledTime && (
                  <p className="text-xs text-gray-500 mt-1">Scheduled: {room.scheduledTime}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Call History */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Calls</CardTitle>
            <CardDescription>Call history and recordings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {recentCalls.map((call) => {
                const StatusIcon = getCallStatusIcon(call.status);
                return (
                  <div key={call.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`h-4 w-4 ${getCallStatusColor(call.status)}`} />
                      <div>
                        <p className="font-medium text-sm">
                          {call.type === 'outgoing' ? call.callee : call.caller}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span>{call.timestamp}</span>
                          {call.duration !== '0:00' && (
                            <>
                              <span>•</span>
                              <span>{call.duration}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {call.recorded && (
                        <Button size="sm" variant="ghost">
                          <PlayCircle className="h-3 w-3" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <Phone className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Calls Today</p>
                <p className="text-2xl font-bold">47</p>
                <p className="text-sm text-green-600">+8 from yesterday</p>
              </div>
              <Phone className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Call Duration</p>
                <p className="text-2xl font-bold">4:32</p>
                <p className="text-sm text-gray-600">minutes</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Conferences</p>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-blue-600">2 scheduled</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Call Quality</p>
                <p className="text-2xl font-bold">98.5%</p>
                <p className="text-sm text-green-600">Excellent</p>
              </div>
              <Volume2 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
