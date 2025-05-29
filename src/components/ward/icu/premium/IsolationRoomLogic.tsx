
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wifi, Shield, AlertTriangle, Users, Clock, Lock } from 'lucide-react';

interface IsolationRoom {
  roomId: string;
  patientName: string;
  isolationType: 'airborne' | 'droplet' | 'contact' | 'protective';
  infectionType: string;
  startDate: Date;
  duration: number;
  ventilationStatus: 'negative' | 'positive' | 'normal';
  accessLog: AccessEntry[];
  ppeRequired: string[];
  alertLevel: 'low' | 'medium' | 'high' | 'critical';
  staffAssigned: string[];
  restrictions: string[];
}

interface AccessEntry {
  time: Date;
  person: string;
  role: string;
  purpose: string;
  ppeCompliance: boolean;
  duration: number;
}

const mockIsolationRooms: IsolationRoom[] = [
  {
    roomId: 'ICU-ISO-1',
    patientName: 'David Wilson',
    isolationType: 'airborne',
    infectionType: 'Tuberculosis (suspected)',
    startDate: new Date('2024-01-20'),
    duration: 14,
    ventilationStatus: 'negative',
    alertLevel: 'high',
    staffAssigned: ['Nurse Johnson', 'Dr. Martinez'],
    restrictions: ['N95 mask required', 'Gown and gloves', 'Eye protection'],
    ppeRequired: ['N95 Respirator', 'Gown', 'Gloves', 'Eye Protection'],
    accessLog: [
      {
        time: new Date(),
        person: 'Dr. Martinez',
        role: 'Physician',
        purpose: 'Patient examination',
        ppeCompliance: true,
        duration: 15
      },
      {
        time: new Date(Date.now() - 30 * 60 * 1000),
        person: 'Nurse Johnson',
        role: 'ICU Nurse',
        purpose: 'Medication administration',
        ppeCompliance: true,
        duration: 10
      }
    ]
  },
  {
    roomId: 'ICU-ISO-2',
    patientName: 'Maria Garcia',
    isolationType: 'contact',
    infectionType: 'MRSA',
    startDate: new Date('2024-01-21'),
    duration: 7,
    ventilationStatus: 'normal',
    alertLevel: 'medium',
    staffAssigned: ['Nurse Davis', 'Dr. Chen'],
    restrictions: ['Gown and gloves required', 'Hand hygiene critical'],
    ppeRequired: ['Gown', 'Gloves'],
    accessLog: [
      {
        time: new Date(Date.now() - 15 * 60 * 1000),
        person: 'Nurse Davis',
        role: 'ICU Nurse',
        purpose: 'Vital signs check',
        ppeCompliance: true,
        duration: 8
      }
    ]
  }
];

export const IsolationRoomLogic = () => {
  const [rooms, setRooms] = useState<IsolationRoom[]>(mockIsolationRooms);

  const getIsolationColor = (type: string) => {
    switch (type) {
      case 'airborne': return 'bg-red-600 text-white';
      case 'droplet': return 'bg-orange-500 text-white';
      case 'contact': return 'bg-yellow-500 text-white';
      case 'protective': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getVentilationIcon = (status: string) => {
    switch (status) {
      case 'negative': return '🔽';
      case 'positive': return '🔼';
      case 'normal': return '➡️';
      default: return '❓';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Isolation Room Logic & Infection Control
          </CardTitle>
          <CardDescription>
            Advanced isolation monitoring with ventilation control and access tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-2">
                <Lock className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">2</p>
                  <p className="text-sm text-gray-600">Active Isolation</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">3</p>
                  <p className="text-sm text-gray-600">PPE Violations</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">12</p>
                  <p className="text-sm text-gray-600">Staff Entries</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">98%</p>
                  <p className="text-sm text-gray-600">Compliance Rate</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {rooms.map((room) => (
              <Card key={room.roomId} className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{room.patientName}</h3>
                      <Badge variant="outline">{room.roomId}</Badge>
                      <Badge className={getIsolationColor(room.isolationType)}>
                        {room.isolationType.toUpperCase()}
                      </Badge>
                      <Badge className={getAlertColor(room.alertLevel)}>
                        {room.alertLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Day {Math.ceil((new Date().getTime() - room.startDate.getTime()) / (1000 * 60 * 60 * 24))} of {room.duration}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Infection Details</h4>
                      <div className="space-y-2">
                        <p className="text-sm"><strong>Type:</strong> {room.infectionType}</p>
                        <p className="text-sm"><strong>Started:</strong> {room.startDate.toLocaleDateString()}</p>
                        <p className="text-sm flex items-center gap-2">
                          <strong>Ventilation:</strong> 
                          {getVentilationIcon(room.ventilationStatus)} {room.ventilationStatus}
                        </p>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">PPE Requirements</h4>
                      <div className="space-y-1">
                        {room.ppeRequired.map((ppe, index) => (
                          <Badge key={index} variant="outline" className="block w-fit mb-1">
                            {ppe}
                          </Badge>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Assigned Staff</h4>
                      <div className="space-y-1">
                        {room.staffAssigned.map((staff, index) => (
                          <p key={index} className="text-sm flex items-center gap-2">
                            <Users className="h-3 w-3" />
                            {staff}
                          </p>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <Card className="mb-4">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Recent Access Log</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {room.accessLog.slice(0, 3).map((entry, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${entry.ppeCompliance ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <div>
                                <p className="font-medium">{entry.person}</p>
                                <p className="text-sm text-gray-600">{entry.role} - {entry.purpose}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm">{entry.time.toLocaleTimeString()}</p>
                              <p className="text-xs text-gray-500">{entry.duration} min</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium mb-2">Current Restrictions:</h4>
                    <div className="space-y-1">
                      {room.restrictions.map((restriction, index) => (
                        <p key={index} className="text-sm text-yellow-800">• {restriction}</p>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      PPE Alert
                    </Button>
                    <Button size="sm" variant="outline">
                      <Clock className="h-4 w-4 mr-1" />
                      Access Log
                    </Button>
                    <Button size="sm" variant="outline">
                      Update Status
                    </Button>
                    <Button size="sm" variant="outline">
                      End Isolation
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
