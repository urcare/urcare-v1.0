
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Clock, Users, MapPin, Phone, AlertTriangle } from 'lucide-react';

interface CodeBlueEvent {
  id: string;
  room: string;
  patientName: string;
  triggeredBy: string;
  startTime: Date;
  status: 'active' | 'resolved' | 'cancelled';
  responseTeam: string[];
  estimatedArrival: number;
  eventType: 'cardiac-arrest' | 'respiratory-arrest' | 'medical-emergency';
  notes: string;
}

interface ResponseMember {
  name: string;
  role: string;
  eta: number;
  status: 'dispatched' | 'en-route' | 'arrived';
}

const mockCodeBlue: CodeBlueEvent = {
  id: 'CODE001',
  room: 'ICU-A1',
  patientName: 'Sarah Johnson',
  triggeredBy: 'Nurse Jennifer Smith',
  startTime: new Date(),
  status: 'active',
  responseTeam: ['Dr. Martinez', 'Nurse Johnson', 'RT Thompson'],
  estimatedArrival: 2,
  eventType: 'cardiac-arrest',
  notes: 'Patient found unresponsive, no pulse detected'
};

const mockResponseTeam: ResponseMember[] = [
  { name: 'Dr. Martinez', role: 'Emergency Physician', eta: 1, status: 'en-route' },
  { name: 'Nurse Johnson', role: 'ICU Nurse', eta: 0, status: 'arrived' },
  { name: 'RT Thompson', role: 'Respiratory Therapist', eta: 2, status: 'dispatched' },
  { name: 'Dr. Chen', role: 'Cardiologist', eta: 5, status: 'dispatched' }
];

export const CodeBlueSystem = () => {
  const [activeCode, setActiveCode] = useState<CodeBlueEvent | null>(mockCodeBlue);
  const [responseTeam, setResponseTeam] = useState<ResponseMember[]>(mockResponseTeam);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!activeCode || activeCode.status !== 'active') return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((new Date().getTime() - activeCode.startTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCode]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-600 text-white animate-pulse';
      case 'resolved': return 'bg-green-600 text-white';
      case 'cancelled': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getMemberStatusColor = (status: string) => {
    switch (status) {
      case 'arrived': return 'bg-green-500 text-white';
      case 'en-route': return 'bg-yellow-500 text-white';
      case 'dispatched': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (!activeCode) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Code Blue Emergency System
            </CardTitle>
            <CardDescription>
              Emergency response coordination and timing system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Zap className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Active Code Blue</h3>
              <p className="text-gray-500 mb-6">System ready for emergency activation</p>
              <Button size="lg" variant="destructive">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Trigger Code Blue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-red-500 border-2">
        <CardHeader className="bg-red-50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Zap className="h-5 w-5 animate-pulse" />
              ACTIVE CODE BLUE
            </CardTitle>
            <Badge className={getStatusColor(activeCode.status)}>
              {activeCode.status.toUpperCase()}
            </Badge>
          </div>
          <CardDescription className="text-red-600">
            Emergency response in progress - {activeCode.room}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-red-600" />
                <span className="font-medium">Elapsed Time</span>
              </div>
              <p className="text-3xl font-bold text-red-600">{formatTime(elapsedTime)}</p>
            </Card>

            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Location</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{activeCode.room}</p>
              <p className="text-sm text-gray-600">{activeCode.patientName}</p>
            </Card>

            <Card className="p-4 bg-orange-50 border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Response Team</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{responseTeam.length}</p>
              <p className="text-sm text-gray-600">Members</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Event Type:</span>
                  <Badge variant="destructive">{activeCode.eventType.replace('-', ' ').toUpperCase()}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Triggered By:</span>
                  <span>{activeCode.triggeredBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Start Time:</span>
                  <span>{activeCode.startTime.toLocaleTimeString()}</span>
                </div>
                <div className="pt-3 border-t">
                  <span className="font-medium">Notes:</span>
                  <p className="text-sm text-gray-600 mt-1">{activeCode.notes}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Response Team Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {responseTeam.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getMemberStatusColor(member.status)}>
                        {member.status.toUpperCase()}
                      </Badge>
                      {member.status !== 'arrived' && (
                        <p className="text-xs text-gray-500 mt-1">ETA: {member.eta} min</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="destructive">
              <Phone className="h-4 w-4 mr-2" />
              Call Additional Support
            </Button>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Update Team Status
            </Button>
            <Button variant="outline">
              Add Notes
            </Button>
            <Button variant="default">
              <Zap className="h-4 w-4 mr-2" />
              Resolve Code
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Code Blue Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">CODE002 - ICU-B2</p>
                <p className="text-sm text-gray-600">Resolved in 8:45 - Patient stabilized</p>
              </div>
              <Badge className="bg-green-500 text-white">RESOLVED</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">CODE003 - ICU-C1</p>
                <p className="text-sm text-gray-600">Cancelled - False alarm</p>
              </div>
              <Badge className="bg-gray-500 text-white">CANCELLED</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
