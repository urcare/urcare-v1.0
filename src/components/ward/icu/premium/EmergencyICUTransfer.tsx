
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRightLeft, Clock, Users, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';

interface TransferRequest {
  transferId: string;
  patientName: string;
  patientId: string;
  fromLocation: string;
  toLocation: string;
  urgency: 'emergency' | 'urgent' | 'routine';
  reason: string;
  requestedBy: string;
  requestTime: Date;
  estimatedDuration: number;
  currentStatus: 'pending' | 'approved' | 'in-transit' | 'completed' | 'cancelled';
  transportTeam: string[];
  equipmentNeeded: string[];
  vitalSigns: {
    heartRate: number;
    bloodPressure: string;
    oxygenSat: number;
    consciousness: string;
  };
  complications: string[];
  bedAssignment: string;
  handoffNotes: string;
  progress: number;
}

const mockTransfers: TransferRequest[] = [
  {
    transferId: 'TXF001',
    patientName: 'Maria Rodriguez',
    patientId: 'P001',
    fromLocation: 'Emergency Department - Bay 3',
    toLocation: 'ICU - Room A2',
    urgency: 'emergency',
    reason: 'Respiratory failure requiring mechanical ventilation',
    requestedBy: 'Dr. Johnson',
    requestTime: new Date(),
    estimatedDuration: 15,
    currentStatus: 'in-transit',
    transportTeam: ['RN Smith', 'RT Davis', 'Tech Wilson'],
    equipmentNeeded: ['Portable ventilator', 'Crash cart', 'Oxygen tank'],
    vitalSigns: {
      heartRate: 125,
      bloodPressure: '90/60',
      oxygenSat: 88,
      consciousness: 'Sedated/Intubated'
    },
    complications: ['Hypotension', 'Desaturation events'],
    bedAssignment: 'ICU-A2',
    handoffNotes: 'Patient intubated in ED, started on norepinephrine drip, requires close monitoring',
    progress: 75
  },
  {
    transferId: 'TXF002',
    patientName: 'John Patterson',
    patientId: 'P002',
    fromLocation: 'Medical Ward - Room 204',
    toLocation: 'ICU - Room B1',
    urgency: 'urgent',
    reason: 'Deteriorating condition - sepsis workup needed',
    requestedBy: 'Dr. Thompson',
    requestTime: new Date(Date.now() - 30 * 60 * 1000),
    estimatedDuration: 20,
    currentStatus: 'approved',
    transportTeam: ['RN Martinez', 'Tech Brown'],
    equipmentNeeded: ['Portable monitor', 'IV pump'],
    vitalSigns: {
      heartRate: 110,
      bloodPressure: '95/55',
      oxygenSat: 92,
      consciousness: 'Alert and oriented'
    },
    complications: ['Mild confusion', 'Temperature spike'],
    bedAssignment: 'ICU-B1',
    handoffNotes: 'Fever 39.2°C, lactate elevated at 3.2, blood cultures pending',
    progress: 25
  }
];

export const EmergencyICUTransfer = () => {
  const [transfers, setTransfers] = useState<TransferRequest[]>(mockTransfers);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-600 text-white animate-pulse';
      case 'urgent': return 'bg-orange-500 text-white';
      case 'routine': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600 text-white';
      case 'in-transit': return 'bg-blue-600 text-white';
      case 'approved': return 'bg-yellow-500 text-white';
      case 'pending': return 'bg-gray-500 text-white';
      case 'cancelled': return 'bg-red-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-transit': return <ArrowRightLeft className="h-4 w-4" />;
      case 'approved': return <Clock className="h-4 w-4" />;
      case 'pending': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Emergency to ICU Transfer Sync
          </CardTitle>
          <CardDescription>
            Real-time coordination of emergency transfers with automated ICU bed assignment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">1</p>
                  <p className="text-sm text-gray-600">Emergency</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">1</p>
                  <p className="text-sm text-gray-600">In Transit</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">3</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">12</p>
                  <p className="text-sm text-gray-600">Completed Today</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {transfers.map((transfer) => (
              <Card key={transfer.transferId} className={`border-l-4 ${transfer.urgency === 'emergency' ? 'border-l-red-600' : 'border-l-orange-500'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{transfer.patientName}</h3>
                      <Badge variant="outline">{transfer.transferId}</Badge>
                      <Badge className={getUrgencyColor(transfer.urgency)}>
                        {transfer.urgency.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(transfer.currentStatus)}>
                        {getStatusIcon(transfer.currentStatus)}
                        {transfer.currentStatus.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Requested: {transfer.requestTime.toLocaleTimeString()}</p>
                      <p className="text-sm text-gray-500">ETA: {transfer.estimatedDuration} min</p>
                    </div>
                  </div>

                  {transfer.currentStatus === 'in-transit' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Transfer Progress</span>
                        <span className="text-sm">{transfer.progress}%</span>
                      </div>
                      <Progress value={transfer.progress} className="h-3" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Transfer Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-3 w-3 text-gray-500" />
                          <span className="font-medium">From:</span> {transfer.fromLocation}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-3 w-3 text-blue-500" />
                          <span className="font-medium">To:</span> {transfer.toLocation}
                        </div>
                        <p className="text-sm"><strong>Reason:</strong> {transfer.reason}</p>
                        <p className="text-sm"><strong>Requested by:</strong> {transfer.requestedBy}</p>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Current Vitals</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Heart Rate:</span>
                          <span className="font-medium">{transfer.vitalSigns.heartRate} bpm</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Blood Pressure:</span>
                          <span className="font-medium">{transfer.vitalSigns.bloodPressure}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>O2 Saturation:</span>
                          <span className="font-medium">{transfer.vitalSigns.oxygenSat}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Consciousness:</span>
                          <span className="font-medium">{transfer.vitalSigns.consciousness}</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Transport Team</h4>
                      <div className="space-y-1">
                        {transfer.transportTeam.map((member, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Users className="h-3 w-3 text-blue-500" />
                            {member}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1">Bed Assignment:</p>
                        <Badge variant="outline">{transfer.bedAssignment}</Badge>
                      </div>
                    </Card>
                  </div>

                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Equipment Required:</h4>
                    <div className="flex flex-wrap gap-2">
                      {transfer.equipmentNeeded.map((equipment, index) => (
                        <Badge key={index} variant="outline">
                          {equipment}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {transfer.complications.length > 0 && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium mb-2 text-yellow-800">Complications/Concerns:</h4>
                      <div className="space-y-1">
                        {transfer.complications.map((complication, index) => (
                          <p key={index} className="text-sm text-yellow-700">• {complication}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-1 text-blue-800">Handoff Notes:</h4>
                    <p className="text-sm text-blue-700">{transfer.handoffNotes}</p>
                  </div>

                  <div className="flex gap-2">
                    {transfer.currentStatus === 'in-transit' && (
                      <Button size="sm" variant="destructive">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Emergency Stop
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Clock className="h-4 w-4 mr-1" />
                      Update Status
                    </Button>
                    <Button size="sm" variant="outline">
                      Contact Team
                    </Button>
                    <Button size="sm" variant="outline">
                      ICU Handoff
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
