
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Users,
  Record,
  Clock,
  User,
  Settings
} from 'lucide-react';

interface Call {
  id: string;
  caller: string;
  callee: string;
  status: 'incoming' | 'outgoing' | 'active' | 'ended' | 'missed';
  duration: string;
  timestamp: string;
  recorded: boolean;
  type: 'patient' | 'internal' | 'external';
}

interface Extension {
  id: string;
  number: string;
  name: string;
  department: string;
  status: 'available' | 'busy' | 'away' | 'offline';
  currentCall?: string;
}

export const VoIPIntegration = () => {
  const [currentCall, setCurrentCall] = useState<Call | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [dialNumber, setDialNumber] = useState('');

  const recentCalls: Call[] = [
    {
      id: 'call-1',
      caller: 'Dr. Smith (Ext: 1234)',
      callee: 'ICU Nurse Station',
      status: 'ended',
      duration: '5:32',
      timestamp: '10 minutes ago',
      recorded: true,
      type: 'internal'
    },
    {
      id: 'call-2',
      caller: 'Patient Family',
      callee: 'Room 205',
      status: 'ended',
      duration: '12:45',
      timestamp: '1 hour ago',
      recorded: false,
      type: 'patient'
    },
    {
      id: 'call-3',
      caller: 'Dr. Williams',
      callee: 'Pharmacy',
      status: 'missed',
      duration: '0:00',
      timestamp: '2 hours ago',
      recorded: false,
      type: 'internal'
    }
  ];

  const extensions: Extension[] = [
    {
      id: 'ext-1',
      number: '1234',
      name: 'Dr. Smith',
      department: 'Cardiology',
      status: 'available'
    },
    {
      id: 'ext-2',
      number: '2345',
      name: 'Nurse Johnson',
      department: 'ICU',
      status: 'busy',
      currentCall: 'Patient consultation'
    },
    {
      id: 'ext-3',
      number: '3456',
      name: 'Reception Desk',
      department: 'Reception',
      status: 'available'
    },
    {
      id: 'ext-4',
      number: '4567',
      name: 'Emergency Line',
      department: 'Emergency',
      status: 'available'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-red-100 text-red-800';
      case 'away': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCallStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'incoming': return 'bg-blue-100 text-blue-800';
      case 'outgoing': return 'bg-orange-100 text-orange-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      case 'missed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const startCall = (number: string) => {
    const newCall: Call = {
      id: `call-${Date.now()}`,
      caller: 'You',
      callee: number,
      status: 'outgoing',
      duration: '0:00',
      timestamp: 'Now',
      recorded: false,
      type: 'internal'
    };
    setCurrentCall(newCall);
  };

  const endCall = () => {
    setCurrentCall(null);
    setIsMuted(false);
    setIsSpeakerOn(false);
  };

  return (
    <div className="space-y-6">
      {/* Current Call Status */}
      {currentCall && (
        <Card className="border-blue-500 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <PhoneCall className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{currentCall.callee}</h3>
                  <p className="text-sm text-gray-600">Call in progress • 2:34</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={isMuted ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="flex items-center gap-2"
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  {isMuted ? 'Unmute' : 'Mute'}
                </Button>
                <Button
                  variant={isSpeakerOn ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  className="flex items-center gap-2"
                >
                  {isSpeakerOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  Speaker
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Record className="h-4 w-4" />
                  Record
                </Button>
                <Button
                  variant="destructive"
                  onClick={endCall}
                  className="flex items-center gap-2"
                >
                  <PhoneOff className="h-4 w-4" />
                  End Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dialer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Dialer
            </CardTitle>
            <CardDescription>Make calls to internal extensions or external numbers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                value={dialNumber}
                onChange={(e) => setDialNumber(e.target.value)}
                placeholder="Enter extension or phone number"
                className="text-center text-lg"
              />
              <Button 
                onClick={() => startCall(dialNumber)}
                className="w-full flex items-center gap-2"
                disabled={!dialNumber}
              >
                <PhoneCall className="h-4 w-4" />
                Call
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                <Button
                  key={digit}
                  variant="outline"
                  className="h-12"
                  onClick={() => setDialNumber(prev => prev + digit)}
                >
                  {digit}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Quick Dial</h4>
              <div className="space-y-1">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  Emergency Line (911)
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  Reception (0)
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  ICU Nurse Station (2001)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Extensions Directory */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Extensions
            </CardTitle>
            <CardDescription>Internal phone directory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {extensions.map((extension) => (
              <div
                key={extension.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <h4 className="font-medium text-sm">{extension.name}</h4>
                    <p className="text-xs text-gray-600">{extension.department}</p>
                    <p className="text-xs text-gray-500">Ext: {extension.number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(extension.status)}>
                    {extension.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startCall(extension.number)}
                    disabled={extension.status === 'offline'}
                  >
                    <Phone className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Calls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Calls
            </CardTitle>
            <CardDescription>Call history and recordings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {recentCalls.map((call) => (
              <div
                key={call.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    call.status === 'incoming' ? 'bg-blue-100' :
                    call.status === 'outgoing' ? 'bg-green-100' :
                    call.status === 'missed' ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <Phone className={`h-4 w-4 ${
                      call.status === 'incoming' ? 'text-blue-600' :
                      call.status === 'outgoing' ? 'text-green-600' :
                      call.status === 'missed' ? 'text-red-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{call.caller}</h4>
                    <p className="text-xs text-gray-600">to {call.callee}</p>
                    <p className="text-xs text-gray-500">{call.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <Badge className={getCallStatusColor(call.status)}>
                      {call.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{call.duration}</p>
                    {call.recorded && (
                      <p className="text-xs text-blue-600">Recorded</p>
                    )}
                  </div>
                  <Button size="sm" variant="outline">
                    <PhoneCall className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Conference Calling */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Conference Calling
          </CardTitle>
          <CardDescription>Manage multi-party calls and meetings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">ICU Team Meeting</h4>
              <p className="text-sm text-gray-600 mb-3">3 participants active</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Dr. Smith</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Nurse Johnson</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Dr. Williams</span>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3">Join Conference</Button>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Surgery Briefing</h4>
              <p className="text-sm text-gray-600 mb-3">Scheduled for 2:00 PM</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-sm">Dr. Brown</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-sm">OR Team</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-sm">Anesthesiologist</span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-3">Schedule Reminder</Button>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Create New Conference</h4>
              <p className="text-sm text-gray-600 mb-3">Set up a new multi-party call</p>
              <div className="space-y-2">
                <Input placeholder="Conference name" size={undefined} />
                <Input placeholder="Add participants" size={undefined} />
              </div>
              <Button size="sm" className="w-full mt-3">Create Conference</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            VoIP System Settings
          </CardTitle>
          <CardDescription>Configure phone system parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Call Recording</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Auto-record all calls
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Patient consent required
                </label>
                <p className="text-xs text-gray-500">Recordings stored for 90 days</p>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Call Routing</h4>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-600">Emergency calls:</span>
                  <p className="font-medium">Auto-route to on-call doctor</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">After hours:</span>
                  <p className="font-medium">Voice mail system</p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Audio Quality</h4>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-600">Codec:</span>
                  <p className="font-medium">G.722 (HD Voice)</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Noise cancellation:</span>
                  <p className="font-medium">Enabled</p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Integration</h4>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-600">PBX System:</span>
                  <p className="font-medium">Asterisk Connected</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">EMR Integration:</span>
                  <p className="font-medium">Active</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
