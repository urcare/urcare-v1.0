
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckSquare, Clock, AlertTriangle, TrendingUp, FileText, User } from 'lucide-react';

interface ProtocolStep {
  id: string;
  description: string;
  timeframe: string;
  completed: boolean;
  completedBy?: string;
  completedTime?: string;
  required: boolean;
}

interface TreatmentProtocol {
  id: string;
  patientId: string;
  patientName: string;
  protocolName: string;
  category: 'medication' | 'procedure' | 'monitoring' | 'discharge';
  startDate: string;
  targetDate: string;
  status: 'active' | 'completed' | 'delayed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  steps: ProtocolStep[];
  notes?: string;
}

const mockProtocols: TreatmentProtocol[] = [
  {
    id: 'TP001',
    patientId: 'P001',
    patientName: 'John Smith',
    protocolName: 'Post-Operative Cardiac Care',
    category: 'monitoring',
    startDate: '2024-01-22 08:00',
    targetDate: '2024-01-24 08:00',
    status: 'active',
    priority: 'high',
    steps: [
      {
        id: 'S001',
        description: 'Baseline vitals check every 2 hours',
        timeframe: 'Every 2 hours',
        completed: true,
        completedBy: 'Nurse Johnson',
        completedTime: '2024-01-22 10:00',
        required: true
      },
      {
        id: 'S002',
        description: 'ECG monitoring continuous',
        timeframe: 'Continuous',
        completed: true,
        completedBy: 'Tech Smith',
        completedTime: '2024-01-22 08:30',
        required: true
      },
      {
        id: 'S003',
        description: 'Pain assessment every 4 hours',
        timeframe: 'Every 4 hours',
        completed: false,
        required: true
      },
      {
        id: 'S004',
        description: 'Ambulation attempt day 2',
        timeframe: 'Day 2 post-op',
        completed: false,
        required: false
      }
    ]
  },
  {
    id: 'TP002',
    patientId: 'P002',
    patientName: 'Mary Wilson',
    protocolName: 'Diabetes Management Protocol',
    category: 'medication',
    startDate: '2024-01-22 06:00',
    targetDate: '2024-01-25 06:00',
    status: 'delayed',
    priority: 'medium',
    steps: [
      {
        id: 'S005',
        description: 'Blood glucose check before meals',
        timeframe: 'Before meals',
        completed: true,
        completedBy: 'Nurse Brown',
        completedTime: '2024-01-22 07:30',
        required: true
      },
      {
        id: 'S006',
        description: 'Insulin administration as prescribed',
        timeframe: 'With meals',
        completed: false,
        required: true
      },
      {
        id: 'S007',
        description: 'Dietary consultation',
        timeframe: 'Within 24 hours',
        completed: false,
        required: true
      }
    ]
  }
];

export const ProtocolAdherenceTracker = () => {
  const [protocols, setProtocols] = useState<TreatmentProtocol[]>(mockProtocols);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      case 'delayed': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medication': return 'bg-blue-500 text-white';
      case 'procedure': return 'bg-purple-500 text-white';
      case 'monitoring': return 'bg-green-500 text-white';
      case 'discharge': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const calculateCompletionRate = (steps: ProtocolStep[]) => {
    const requiredSteps = steps.filter(step => step.required);
    const completedRequiredSteps = requiredSteps.filter(step => step.completed);
    return requiredSteps.length > 0 ? (completedRequiredSteps.length / requiredSteps.length) * 100 : 0;
  };

  const handleStepToggle = (protocolId: string, stepId: string, completed: boolean) => {
    setProtocols(prev => prev.map(protocol => 
      protocol.id === protocolId 
        ? {
            ...protocol,
            steps: protocol.steps.map(step => 
              step.id === stepId 
                ? {
                    ...step,
                    completed,
                    completedBy: completed ? 'Current User' : undefined,
                    completedTime: completed ? new Date().toISOString() : undefined
                  }
                : step
            )
          }
        : protocol
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Treatment Protocol Adherence Tracker
          </CardTitle>
          <CardDescription>
            Monitor compliance with standardized treatment protocols and care pathways
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">8</p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">5</p>
                    <p className="text-sm text-gray-600">Active</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">2</p>
                    <p className="text-sm text-gray-600">Delayed</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">87%</p>
                    <p className="text-sm text-gray-600">Adherence Rate</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            {protocols.map((protocol) => {
              const completionRate = calculateCompletionRate(protocol.steps);
              
              return (
                <Card key={protocol.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{protocol.patientName}</h3>
                        <Badge variant="outline">{protocol.patientId}</Badge>
                        <Badge className={getPriorityColor(protocol.priority)}>
                          {protocol.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getCategoryColor(protocol.category)}>
                          {protocol.category.toUpperCase()}
                        </Badge>
                      </div>
                      <Badge className={getStatusColor(protocol.status)}>
                        {protocol.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-lg mb-2">{protocol.protocolName}</h4>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Protocol Completion</span>
                        <span className="text-sm text-gray-600">
                          {completionRate.toFixed(0)}% complete
                        </span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          <strong>Started:</strong> {protocol.startDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          <strong>Target:</strong> {protocol.targetDate}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="font-medium">Protocol Steps</h5>
                      {protocol.steps.map((step) => (
                        <div key={step.id} className="flex items-start gap-3 p-3 border rounded-lg">
                          <Checkbox
                            checked={step.completed}
                            onCheckedChange={(checked) => handleStepToggle(protocol.id, step.id, !!checked)}
                            className="mt-0.5"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-sm font-medium ${step.completed ? 'line-through text-gray-500' : ''}`}>
                                {step.description}
                              </span>
                              {step.required && <Badge variant="outline" className="text-xs">Required</Badge>}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                              <span><strong>Timeframe:</strong> {step.timeframe}</span>
                              {step.completedBy && (
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span><strong>By:</strong> {step.completedBy}</span>
                                </div>
                              )}
                              {step.completedTime && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span><strong>At:</strong> {step.completedTime}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        View Full Protocol
                      </Button>
                      <Button size="sm" variant="outline">Add Notes</Button>
                      {protocol.status === 'delayed' && (
                        <Button size="sm" variant="destructive">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Review Delays
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
