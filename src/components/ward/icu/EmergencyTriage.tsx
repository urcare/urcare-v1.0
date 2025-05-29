
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Brain, Clock, Star, Zap } from 'lucide-react';

interface TriageCase {
  id: string;
  patientName: string;
  age: number;
  chiefComplaint: string;
  aiScore: number;
  priority: 'immediate' | 'urgent' | 'less-urgent' | 'non-urgent';
  estimatedWaitTime: number;
  symptoms: string[];
  vitalSigns: {
    conscious: boolean;
    breathing: 'normal' | 'labored' | 'absent';
    circulation: 'normal' | 'weak' | 'absent';
    temperature: number;
  };
  riskFactors: string[];
  arrivalTime: string;
  aiConfidence: number;
}

const mockCases: TriageCase[] = [
  {
    id: 'TRIAGE001',
    patientName: 'Robert Martinez',
    age: 65,
    chiefComplaint: 'Chest pain with shortness of breath',
    aiScore: 95,
    priority: 'immediate',
    estimatedWaitTime: 0,
    symptoms: ['Chest pain', 'Dyspnea', 'Diaphoresis', 'Nausea'],
    vitalSigns: {
      conscious: true,
      breathing: 'labored',
      circulation: 'weak',
      temperature: 37.8
    },
    riskFactors: ['History of MI', 'Hypertension', 'Diabetes'],
    arrivalTime: '10:45 AM',
    aiConfidence: 92
  },
  {
    id: 'TRIAGE002',
    patientName: 'Lisa Thompson',
    age: 28,
    chiefComplaint: 'Severe abdominal pain',
    aiScore: 78,
    priority: 'urgent',
    estimatedWaitTime: 15,
    symptoms: ['Abdominal pain', 'Vomiting', 'Fever'],
    vitalSigns: {
      conscious: true,
      breathing: 'normal',
      circulation: 'normal',
      temperature: 38.9
    },
    riskFactors: ['Appendicitis suspected'],
    arrivalTime: '11:20 AM',
    aiConfidence: 85
  },
  {
    id: 'TRIAGE003',
    patientName: 'James Wilson',
    age: 45,
    chiefComplaint: 'Minor laceration on hand',
    aiScore: 25,
    priority: 'less-urgent',
    estimatedWaitTime: 45,
    symptoms: ['Laceration', 'Minor bleeding'],
    vitalSigns: {
      conscious: true,
      breathing: 'normal',
      circulation: 'normal',
      temperature: 36.8
    },
    riskFactors: [],
    arrivalTime: '11:30 AM',
    aiConfidence: 88
  }
];

export const EmergencyTriage = () => {
  const [cases, setCases] = useState<TriageCase[]>(mockCases);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'immediate': return 'bg-red-600 text-white';
      case 'urgent': return 'bg-orange-500 text-white';
      case 'less-urgent': return 'bg-yellow-500 text-white';
      case 'non-urgent': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'immediate': return <Zap className="h-4 w-4" />;
      case 'urgent': return <AlertTriangle className="h-4 w-4" />;
      case 'less-urgent': return <Clock className="h-4 w-4" />;
      case 'non-urgent': return <Star className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Emergency Case Triage AI
          </CardTitle>
          <CardDescription>
            AI-powered emergency triage with priority scoring and wait time estimation
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
                    <p className="text-sm text-gray-600">Immediate</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">1</p>
                    <p className="text-sm text-gray-600">Urgent</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-yellow-200 bg-yellow-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">1</p>
                    <p className="text-sm text-gray-600">Less Urgent</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Star className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">0</p>
                    <p className="text-sm text-gray-600">Non-Urgent</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            {cases.sort((a, b) => b.aiScore - a.aiScore).map((triageCase) => (
              <Card key={triageCase.id} className={`border-l-4 ${triageCase.priority === 'immediate' ? 'border-l-red-600' : triageCase.priority === 'urgent' ? 'border-l-orange-500' : triageCase.priority === 'less-urgent' ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{triageCase.patientName}</h3>
                      <Badge variant="outline">Age {triageCase.age}</Badge>
                      <Badge className={getPriorityColor(triageCase.priority)}>
                        {getPriorityIcon(triageCase.priority)}
                        {triageCase.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Arrived: {triageCase.arrivalTime}</p>
                      <p className="text-sm font-medium">Wait: {triageCase.estimatedWaitTime} min</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">AI Triage Score</span>
                          <span className="text-sm font-bold">{triageCase.aiScore}/100</span>
                        </div>
                        <Progress value={triageCase.aiScore} className="h-3" />
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">AI Confidence</span>
                          <span className="text-sm">{triageCase.aiConfidence}%</span>
                        </div>
                        <Progress value={triageCase.aiConfidence} className="h-2" />
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Chief Complaint:</h4>
                        <p className="text-sm">{triageCase.chiefComplaint}</p>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Vital Signs Assessment:</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${triageCase.vitalSigns.conscious ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span>Conscious: {triageCase.vitalSigns.conscious ? 'Yes' : 'No'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${triageCase.vitalSigns.breathing === 'normal' ? 'bg-green-500' : triageCase.vitalSigns.breathing === 'labored' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                            <span>Breathing: {triageCase.vitalSigns.breathing}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${triageCase.vitalSigns.circulation === 'normal' ? 'bg-green-500' : triageCase.vitalSigns.circulation === 'weak' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                            <span>Circulation: {triageCase.vitalSigns.circulation}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${triageCase.vitalSigns.temperature < 38 ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                            <span>Temp: {triageCase.vitalSigns.temperature}°C</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Symptoms:</h4>
                    <div className="flex flex-wrap gap-2">
                      {triageCase.symptoms.map((symptom, index) => (
                        <Badge key={index} variant="outline">{symptom}</Badge>
                      ))}
                    </div>
                  </div>

                  {triageCase.riskFactors.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Risk Factors:</h4>
                      <div className="flex flex-wrap gap-2">
                        {triageCase.riskFactors.map((factor, index) => (
                          <Badge key={index} variant="destructive">{factor}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {triageCase.priority === 'immediate' && (
                      <Button size="sm" variant="destructive">
                        <Zap className="h-4 w-4 mr-1" />
                        Send to Resus
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      Assign Bed
                    </Button>
                    <Button size="sm" variant="outline">
                      Update Triage
                    </Button>
                    <Button size="sm" variant="outline">
                      View History
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
