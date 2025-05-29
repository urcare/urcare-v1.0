
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clipboard, CheckCircle, AlertTriangle, Clock, User, FileText } from 'lucide-react';

interface ConsentProcess {
  processId: string;
  patientId: string;
  patientName: string;
  room: string;
  procedure: string;
  riskLevel: 'moderate' | 'high' | 'very_high' | 'experimental';
  urgency: 'elective' | 'semi_urgent' | 'urgent' | 'emergency';
  completionPercentage: number;
  status: 'initiated' | 'in_progress' | 'pending_signature' | 'completed' | 'expired';
  steps: {
    name: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    assignedTo: string;
    completedAt?: Date;
    notes?: string;
  }[];
  riskFactors: string[];
  alternatives: string[];
  familyInvolved: boolean;
  witnessRequired: boolean;
  witnesses: string[];
  ethicsConsult: boolean;
  estimatedDuration: number;
  startedAt: Date;
  deadline?: Date;
}

const mockConsentProcesses: ConsentProcess[] = [
  {
    processId: 'CNS001',
    patientId: 'ICU001',
    patientName: 'Sarah Johnson',
    room: 'ICU-A1',
    procedure: 'ECMO Cannulation',
    riskLevel: 'very_high',
    urgency: 'urgent',
    completionPercentage: 75,
    status: 'pending_signature',
    familyInvolved: true,
    witnessRequired: true,
    witnesses: ['Nurse Smith', 'Dr. Wilson'],
    ethicsConsult: false,
    estimatedDuration: 45,
    startedAt: new Date(Date.now() - 1800000),
    deadline: new Date(Date.now() + 1800000),
    steps: [
      { name: 'Risk Assessment', status: 'completed', assignedTo: 'Dr. Martinez', completedAt: new Date(Date.now() - 1500000) },
      { name: 'Patient Discussion', status: 'completed', assignedTo: 'Dr. Martinez', completedAt: new Date(Date.now() - 1200000) },
      { name: 'Family Consultation', status: 'completed', assignedTo: 'Social Worker', completedAt: new Date(Date.now() - 900000) },
      { name: 'Witness Arrangement', status: 'completed', assignedTo: 'Nurse Smith', completedAt: new Date(Date.now() - 600000) },
      { name: 'Final Consent', status: 'in_progress', assignedTo: 'Dr. Martinez' },
      { name: 'Documentation', status: 'pending', assignedTo: 'Medical Records' }
    ],
    riskFactors: ['High mortality risk (30-50%)', 'Bleeding complications', 'Infection risk', 'Vascular injury'],
    alternatives: ['Conservative management', 'Conventional ventilation', 'Palliative care']
  },
  {
    processId: 'CNS002',
    patientId: 'ICU003',
    patientName: 'Michael Chen',
    room: 'ICU-B2',
    procedure: 'Experimental Drug Trial',
    riskLevel: 'experimental',
    urgency: 'elective',
    completionPercentage: 40,
    status: 'in_progress',
    familyInvolved: true,
    witnessRequired: true,
    witnesses: [],
    ethicsConsult: true,
    estimatedDuration: 90,
    startedAt: new Date(Date.now() - 3600000),
    steps: [
      { name: 'Ethics Review', status: 'completed', assignedTo: 'Ethics Committee', completedAt: new Date(Date.now() - 3000000) },
      { name: 'Research Coordinator', status: 'completed', assignedTo: 'Dr. Kim', completedAt: new Date(Date.now() - 2400000) },
      { name: 'Detailed Explanation', status: 'in_progress', assignedTo: 'Dr. Kim' },
      { name: 'Family Discussion', status: 'pending', assignedTo: 'Social Worker' },
      { name: 'Consent Signing', status: 'pending', assignedTo: 'Dr. Kim' },
      { name: 'Trial Enrollment', status: 'pending', assignedTo: 'Research Team' }
    ],
    riskFactors: ['Unknown side effects', 'Potential organ toxicity', 'May not be effective'],
    alternatives: ['Standard treatment protocol', 'Supportive care only']
  }
];

export const HighRiskConsentFlow = () => {
  const [processes, setProcesses] = useState<ConsentProcess[]>(mockConsentProcesses);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'experimental': return 'bg-purple-600 text-white';
      case 'very_high': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-600 text-white animate-pulse';
      case 'urgent': return 'bg-red-500 text-white';
      case 'semi_urgent': return 'bg-yellow-500 text-white';
      case 'elective': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'pending_signature': return 'bg-yellow-500 text-white';
      case 'in_progress': return 'bg-blue-500 text-white';
      case 'expired': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatTimeRemaining = (deadline?: Date) => {
    if (!deadline) return 'No deadline';
    const remaining = deadline.getTime() - Date.now();
    if (remaining < 0) return 'Overdue';
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clipboard className="h-5 w-5" />
            High-Risk Procedure Consent Flow
          </CardTitle>
          <CardDescription>
            Comprehensive consent management for high-risk procedures with step-by-step tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Clipboard className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">2</p>
                  <p className="text-sm text-gray-600">Active Processes</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">1</p>
                  <p className="text-sm text-gray-600">Pending Signature</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-purple-200 bg-purple-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">1</p>
                  <p className="text-sm text-gray-600">Ethics Review</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">5</p>
                  <p className="text-sm text-gray-600">Completed Today</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {processes.map((process) => (
              <Card key={process.processId} className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{process.patientName}</h3>
                      <Badge variant="outline">{process.room}</Badge>
                      <Badge className={getRiskColor(process.riskLevel)}>
                        {process.riskLevel.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge className={getUrgencyColor(process.urgency)}>
                        {process.urgency.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(process.status)}>
                        {process.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">ID: {process.processId}</p>
                      <p className="text-sm text-gray-500">{formatTimeRemaining(process.deadline)}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-lg mb-2">{process.procedure}</h4>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm">Progress: {process.completionPercentage}%</span>
                      <Progress value={process.completionPercentage} className="flex-1 h-2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Process Steps</h4>
                      <div className="space-y-3">
                        {process.steps.map((step, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 border rounded">
                            {getStepIcon(step.status)}
                            <div className="flex-1">
                              <p className="text-sm font-medium">{step.name}</p>
                              <p className="text-xs text-gray-600">{step.assignedTo}</p>
                            </div>
                            {step.completedAt && (
                              <span className="text-xs text-green-600">
                                {step.completedAt.toLocaleTimeString()}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Risk Factors</h4>
                      <div className="space-y-2">
                        {process.riskFactors.map((risk, index) => (
                          <div key={index} className="text-sm p-2 bg-red-50 border border-red-200 rounded">
                            <AlertTriangle className="h-3 w-3 inline mr-2 text-red-600" />
                            {risk}
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Process Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Family Involved:</span>
                          <Badge className={process.familyInvolved ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}>
                            {process.familyInvolved ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Ethics Consult:</span>
                          <Badge className={process.ethicsConsult ? 'bg-blue-500 text-white' : 'bg-gray-400 text-white'}>
                            {process.ethicsConsult ? 'Required' : 'Not Required'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Witnesses:</span>
                          <span>{process.witnesses.length}/{process.witnessRequired ? '2' : '0'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Est. Duration:</span>
                          <span>{process.estimatedDuration} min</span>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg mb-4">
                    <h4 className="font-medium mb-2">Alternative Options Discussed</h4>
                    <ul className="text-sm space-y-1">
                      {process.alternatives.map((alt, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {alt}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    {process.status === 'pending_signature' && (
                      <Button size="sm" variant="default">
                        <FileText className="h-4 w-4 mr-1" />
                        Complete Consent
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <User className="h-4 w-4 mr-1" />
                      Add Witness
                    </Button>
                    <Button size="sm" variant="outline">
                      <Clock className="h-4 w-4 mr-1" />
                      Update Timeline
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      Generate Document
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
