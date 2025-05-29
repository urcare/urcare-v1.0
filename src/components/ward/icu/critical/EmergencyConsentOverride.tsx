
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileCheck, AlertTriangle, Clock, User, Shield, CheckCircle } from 'lucide-react';

interface ConsentOverride {
  overrideId: string;
  patientId: string;
  patientName: string;
  room: string;
  procedure: string;
  urgencyLevel: 'emergency' | 'urgent' | 'life_threatening';
  initiatedBy: string;
  approvedBy: string[];
  reason: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'documented' | 'completed';
  witnesses: string[];
  documentation: string;
  familyNotified: boolean;
  legalReview: boolean;
}

const mockOverrides: ConsentOverride[] = [
  {
    overrideId: 'EMG001',
    patientId: 'ICU001',
    patientName: 'Sarah Johnson',
    room: 'ICU-A1',
    procedure: 'Emergency Intubation',
    urgencyLevel: 'life_threatening',
    initiatedBy: 'Dr. Wilson',
    approvedBy: ['Dr. Martinez', 'Nurse Supervisor'],
    reason: 'Patient unconscious, respiratory failure imminent',
    timestamp: new Date(Date.now() - 1800000),
    status: 'documented',
    witnesses: ['Nurse Smith', 'Respiratory Therapist Brown'],
    documentation: 'Patient presented with acute respiratory distress, GCS 6, unable to obtain consent. Life-saving intervention required immediately.',
    familyNotified: true,
    legalReview: false
  },
  {
    overrideId: 'EMG002',
    patientId: 'ICU003',
    patientName: 'Michael Chen',
    room: 'ICU-B2',
    procedure: 'Emergency Blood Transfusion',
    urgencyLevel: 'emergency',
    initiatedBy: 'Dr. Kim',
    approvedBy: ['Dr. Lee'],
    reason: 'Massive hemorrhage, patient declining rapidly',
    timestamp: new Date(Date.now() - 600000),
    status: 'pending',
    witnesses: ['Nurse Davis'],
    documentation: 'Active bleeding, Hgb 4.2, patient hemodynamically unstable',
    familyNotified: false,
    legalReview: true
  }
];

export const EmergencyConsentOverride = () => {
  const [overrides, setOverrides] = useState<ConsentOverride[]>(mockOverrides);

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'life_threatening': return 'bg-red-600 text-white animate-pulse';
      case 'emergency': return 'bg-red-500 text-white';
      case 'urgent': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-white';
      case 'approved': return 'bg-blue-500 text-white';
      case 'documented': return 'bg-green-500 text-white';
      case 'completed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const formatTimeSince = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Emergency Consent Override Tracker
          </CardTitle>
          <CardDescription>
            Monitor and document emergency procedures performed without prior patient consent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">2</p>
                  <p className="text-sm text-gray-600">Active Overrides</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">1</p>
                  <p className="text-sm text-gray-600">Pending Review</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">1</p>
                  <p className="text-sm text-gray-600">Legal Review</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">8</p>
                  <p className="text-sm text-gray-600">Completed Today</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {overrides.map((override) => (
              <Card key={override.overrideId} className="border-l-4 border-l-red-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{override.patientName}</h3>
                      <Badge variant="outline">{override.room}</Badge>
                      <Badge className={getUrgencyColor(override.urgencyLevel)}>
                        {override.urgencyLevel.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(override.status)}>
                        {override.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Override ID: {override.overrideId}</p>
                      <p className="text-sm text-gray-500">Initiated: {formatTimeSince(override.timestamp)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Procedure Details</h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <strong>Procedure:</strong>
                          <p className="mt-1 font-medium text-blue-600">{override.procedure}</p>
                        </div>
                        <div className="text-sm">
                          <strong>Initiated by:</strong>
                          <p className="mt-1">{override.initiatedBy}</p>
                        </div>
                        <div className="text-sm">
                          <strong>Reason:</strong>
                          <p className="mt-1 text-gray-700">{override.reason}</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Approvals & Witnesses</h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <strong>Approved by:</strong>
                          <ul className="mt-1 space-y-1">
                            {override.approvedBy.map((approver, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {approver}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-sm">
                          <strong>Witnesses:</strong>
                          <ul className="mt-1 space-y-1">
                            {override.witnesses.map((witness, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <User className="h-3 w-3 text-blue-600" />
                                {witness}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Compliance Status</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Family Notified:</span>
                          <Badge className={override.familyNotified ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                            {override.familyNotified ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Legal Review:</span>
                          <Badge className={override.legalReview ? 'bg-blue-500 text-white' : 'bg-yellow-500 text-white'}>
                            {override.legalReview ? 'Required' : 'Not Required'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Documentation:</span>
                          <Badge className="bg-green-500 text-white">Complete</Badge>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg mb-4">
                    <h4 className="font-medium mb-2">Clinical Documentation</h4>
                    <p className="text-sm text-gray-700">{override.documentation}</p>
                  </div>

                  <div className="flex gap-2">
                    {override.status === 'pending' && (
                      <Button size="sm" variant="destructive">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve Override
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <FileCheck className="h-4 w-4 mr-1" />
                      Update Documentation
                    </Button>
                    <Button size="sm" variant="outline">
                      <User className="h-4 w-4 mr-1" />
                      Notify Family
                    </Button>
                    <Button size="sm" variant="outline">
                      <Shield className="h-4 w-4 mr-1" />
                      Legal Review
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
