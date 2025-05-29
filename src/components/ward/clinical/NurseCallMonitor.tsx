
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Phone, Clock, User, MapPin, AlertTriangle, CheckCircle, Timer } from 'lucide-react';

interface NurseCall {
  id: string;
  roomNumber: string;
  patientName: string;
  callType: 'assistance' | 'emergency' | 'comfort' | 'medication' | 'bathroom';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  callTime: string;
  responseTime?: string;
  assignedNurse?: string;
  status: 'pending' | 'acknowledged' | 'in-progress' | 'resolved';
  notes?: string;
}

const mockCalls: NurseCall[] = [
  {
    id: 'NC001',
    roomNumber: '101A',
    patientName: 'John Smith',
    callType: 'emergency',
    priority: 'emergency',
    callTime: '2024-01-22 14:30',
    assignedNurse: 'Nurse Johnson',
    status: 'in-progress',
    notes: 'Patient experiencing chest pain'
  },
  {
    id: 'NC002',
    roomNumber: '102B',
    patientName: 'Mary Wilson',
    callType: 'medication',
    priority: 'medium',
    callTime: '2024-01-22 14:25',
    responseTime: '2024-01-22 14:27',
    assignedNurse: 'Nurse Brown',
    status: 'acknowledged'
  },
  {
    id: 'NC003',
    roomNumber: '103A',
    patientName: 'Robert Davis',
    callType: 'comfort',
    priority: 'low',
    callTime: '2024-01-22 14:20',
    responseTime: '2024-01-22 14:22',
    status: 'resolved'
  }
];

export const NurseCallMonitor = () => {
  const [calls, setCalls] = useState<NurseCall[]>(mockCalls);

  const getCallTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-600 text-white';
      case 'medication': return 'bg-blue-500 text-white';
      case 'assistance': return 'bg-orange-500 text-white';
      case 'comfort': return 'bg-green-500 text-white';
      case 'bathroom': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'acknowledged': return 'bg-yellow-500';
      case 'pending': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getElapsedTime = (callTime: string) => {
    const now = new Date();
    const call = new Date(callTime);
    const diff = Math.floor((now.getTime() - call.getTime()) / (1000 * 60));
    return diff;
  };

  const getResponseProgress = (priority: string, elapsed: number) => {
    const targets = {
      emergency: 2,
      high: 5,
      medium: 10,
      low: 15
    };
    const target = targets[priority as keyof typeof targets] || 15;
    return Math.min((elapsed / target) * 100, 100);
  };

  const handleAcknowledge = (callId: string) => {
    setCalls(prev => prev.map(call => 
      call.id === callId 
        ? { ...call, status: 'acknowledged', responseTime: new Date().toISOString() }
        : call
    ));
  };

  const handleResolve = (callId: string) => {
    setCalls(prev => prev.map(call => 
      call.id === callId 
        ? { ...call, status: 'resolved' }
        : call
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Nurse Call Response Monitor
          </CardTitle>
          <CardDescription>
            Real-time tracking of patient call requests and response times
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">3</p>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">2</p>
                    <p className="text-sm text-gray-600">In Progress</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">15</p>
                    <p className="text-sm text-gray-600">Resolved Today</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Timer className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">3.2</p>
                    <p className="text-sm text-gray-600">Avg Response (min)</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            {calls.map((call) => {
              const elapsed = getElapsedTime(call.callTime);
              const progress = getResponseProgress(call.priority, elapsed);
              
              return (
                <Card key={call.id} className={`border-l-4 ${call.priority === 'emergency' ? 'border-l-red-500 animate-pulse' : 'border-l-blue-500'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-gray-500" />
                          <span className="font-semibold text-lg">Room {call.roomNumber}</span>
                        </div>
                        <span className="font-medium">{call.patientName}</span>
                        <Badge className={getCallTypeColor(call.callType)}>
                          {call.callType.toUpperCase()}
                        </Badge>
                        <Badge className={getPriorityColor(call.priority)}>
                          {call.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <Badge className={getStatusColor(call.status)}>
                        {call.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Response Time</span>
                        <span className="text-sm text-gray-600">
                          {elapsed} min elapsed
                        </span>
                      </div>
                      <Progress 
                        value={progress}
                        className={`h-2 ${progress > 90 ? 'bg-red-100' : progress > 70 ? 'bg-yellow-100' : 'bg-green-100'}`}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          <strong>Called:</strong> {call.callTime}
                        </span>
                      </div>
                      {call.responseTime && (
                        <div className="flex items-center gap-2">
                          <Timer className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            <strong>Responded:</strong> {call.responseTime}
                          </span>
                        </div>
                      )}
                      {call.assignedNurse && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            <strong>Assigned:</strong> {call.assignedNurse}
                          </span>
                        </div>
                      )}
                    </div>

                    {call.notes && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm"><strong>Notes:</strong> {call.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {call.status === 'pending' && (
                        <>
                          <Button size="sm" onClick={() => handleAcknowledge(call.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Acknowledge
                          </Button>
                          <Button size="sm" variant="outline">Assign Nurse</Button>
                        </>
                      )}
                      {call.status === 'acknowledged' && (
                        <>
                          <Button size="sm" onClick={() => handleResolve(call.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Resolved
                          </Button>
                          <Button size="sm" variant="outline">Add Notes</Button>
                        </>
                      )}
                      {call.status === 'in-progress' && (
                        <>
                          <Button size="sm" onClick={() => handleResolve(call.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                          <Button size="sm" variant="outline">Update Status</Button>
                        </>
                      )}
                      {call.priority === 'emergency' && call.status !== 'resolved' && (
                        <Button size="sm" variant="destructive">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Escalate
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
