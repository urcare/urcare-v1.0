
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, AlertTriangle, Clock, Activity, Zap } from 'lucide-react';

interface TriagePatient {
  id: string;
  name: string;
  age: number;
  chiefComplaint: string;
  aiUrgencyScore: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  waitTime: number;
  symptoms: string[];
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSat: number;
  };
  aiConfidence: number;
  recommendedAction: string;
}

const mockPatients: TriagePatient[] = [
  {
    id: 'T001',
    name: 'John Martinez',
    age: 67,
    chiefComplaint: 'Chest pain with radiation to left arm',
    aiUrgencyScore: 92,
    priority: 'critical',
    waitTime: 0,
    symptoms: ['Chest pain', 'Dyspnea', 'Diaphoresis', 'Nausea'],
    vitals: {
      heartRate: 110,
      bloodPressure: '95/65',
      temperature: 37.8,
      oxygenSat: 91
    },
    aiConfidence: 94,
    recommendedAction: 'Immediate cardiac evaluation - possible STEMI'
  },
  {
    id: 'T002',
    name: 'Sarah Williams',
    age: 34,
    chiefComplaint: 'Severe headache with visual changes',
    aiUrgencyScore: 78,
    priority: 'high',
    waitTime: 8,
    symptoms: ['Headache', 'Visual disturbance', 'Photophobia'],
    vitals: {
      heartRate: 88,
      bloodPressure: '165/95',
      temperature: 36.9,
      oxygenSat: 98
    },
    aiConfidence: 87,
    recommendedAction: 'Neurological assessment - rule out intracranial pressure'
  },
  {
    id: 'T003',
    name: 'Mike Thompson',
    age: 28,
    chiefComplaint: 'Ankle sprain from sports injury',
    aiUrgencyScore: 25,
    priority: 'low',
    waitTime: 45,
    symptoms: ['Ankle pain', 'Swelling', 'Limited mobility'],
    vitals: {
      heartRate: 72,
      bloodPressure: '120/80',
      temperature: 36.6,
      oxygenSat: 99
    },
    aiConfidence: 91,
    recommendedAction: 'Standard orthopedic evaluation'
  }
];

export const AITriageDashboard = () => {
  const [patients, setPatients] = useState<TriagePatient[]>(mockPatients);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <Zap className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Activity className="h-4 w-4" />;
      case 'low': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Emergency Triage
          </CardTitle>
          <CardDescription>
            Intelligent patient prioritization with urgency scoring and automated recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <Zap className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">1</p>
                    <p className="text-sm text-gray-600">Critical</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">1</p>
                    <p className="text-sm text-gray-600">High Priority</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-yellow-200 bg-yellow-50">
                <div className="flex items-center gap-2">
                  <Activity className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">0</p>
                    <p className="text-sm text-gray-600">Medium Priority</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">1</p>
                    <p className="text-sm text-gray-600">Low Priority</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            {patients.sort((a, b) => b.aiUrgencyScore - a.aiUrgencyScore).map((patient) => (
              <Card key={patient.id} className={`border-l-4 ${patient.priority === 'critical' ? 'border-l-red-600' : patient.priority === 'high' ? 'border-l-orange-500' : patient.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{patient.name}</h3>
                      <Badge variant="outline">Age {patient.age}</Badge>
                      <Badge className={getPriorityColor(patient.priority)}>
                        {getPriorityIcon(patient.priority)}
                        {patient.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Wait: {patient.waitTime} min</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">AI Urgency Score</span>
                          <span className="text-sm font-bold">{patient.aiUrgencyScore}/100</span>
                        </div>
                        <Progress value={patient.aiUrgencyScore} className="h-3" />
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">AI Confidence</span>
                          <span className="text-sm">{patient.aiConfidence}%</span>
                        </div>
                        <Progress value={patient.aiConfidence} className="h-2" />
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Chief Complaint:</h4>
                        <p className="text-sm">{patient.chiefComplaint}</p>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Vital Signs:</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>HR: {patient.vitals.heartRate} bpm</div>
                          <div>BP: {patient.vitals.bloodPressure}</div>
                          <div>Temp: {patient.vitals.temperature}°C</div>
                          <div>O2 Sat: {patient.vitals.oxygenSat}%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Symptoms:</h4>
                    <div className="flex flex-wrap gap-2">
                      {patient.symptoms.map((symptom, index) => (
                        <Badge key={index} variant="outline">{symptom}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-1">AI Recommendation:</h4>
                    <p className="text-sm">{patient.recommendedAction}</p>
                  </div>

                  <div className="flex gap-2">
                    {patient.priority === 'critical' && (
                      <Button size="sm" variant="destructive">
                        <Zap className="h-4 w-4 mr-1" />
                        Immediate Care
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      Assign Bed
                    </Button>
                    <Button size="sm" variant="outline">
                      Override Priority
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
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
