
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, TrendingUp, Clock, AlertTriangle, Brain, Heart } from 'lucide-react';

interface AdmissionCandidate {
  patientId: string;
  patientName: string;
  age: number;
  currentLocation: string;
  primaryDiagnosis: string;
  severityScore: number;
  sofa: number;
  apache: number;
  priorityLevel: 'urgent' | 'high' | 'medium' | 'low';
  estimatedStay: number;
  riskFactors: string[];
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    oxygenSat: number;
  };
  comorbidities: string[];
  requestedBy: string;
  requestTime: Date;
  aiRecommendation: string;
  bedRequirement: 'standard' | 'isolation' | 'specialized';
}

const mockCandidates: AdmissionCandidate[] = [
  {
    patientId: 'P001',
    patientName: 'Robert Martinez',
    age: 68,
    currentLocation: 'Emergency Department',
    primaryDiagnosis: 'Septic Shock',
    severityScore: 95,
    sofa: 12,
    apache: 28,
    priorityLevel: 'urgent',
    estimatedStay: 7,
    riskFactors: ['Multi-organ failure', 'Hypotension', 'Altered mental status'],
    vitals: {
      bloodPressure: '80/45',
      heartRate: 135,
      temperature: 39.2,
      oxygenSat: 88
    },
    comorbidities: ['Diabetes', 'Hypertension', 'CKD'],
    requestedBy: 'Dr. Thompson',
    requestTime: new Date(),
    aiRecommendation: 'Immediate ICU admission required - high mortality risk without intervention',
    bedRequirement: 'standard'
  },
  {
    patientId: 'P002',
    patientName: 'Linda Chen',
    age: 54,
    currentLocation: 'Medical Ward',
    primaryDiagnosis: 'Acute Respiratory Failure',
    severityScore: 78,
    sofa: 8,
    apache: 18,
    priorityLevel: 'high',
    estimatedStay: 4,
    riskFactors: ['Ventilatory support needed', 'Pneumonia', 'Obesity'],
    vitals: {
      bloodPressure: '110/70',
      heartRate: 115,
      temperature: 38.5,
      oxygenSat: 85
    },
    comorbidities: ['Asthma', 'Obesity'],
    requestedBy: 'Dr. Williams',
    requestTime: new Date(Date.now() - 30 * 60 * 1000),
    aiRecommendation: 'High priority for ICU admission - respiratory support required',
    bedRequirement: 'standard'
  },
  {
    patientId: 'P003',
    patientName: 'James Wilson',
    age: 42,
    currentLocation: 'Surgical Ward',
    primaryDiagnosis: 'Post-op Complications',
    severityScore: 65,
    sofa: 6,
    apache: 14,
    priorityLevel: 'medium',
    estimatedStay: 3,
    riskFactors: ['Surgical bleeding', 'Hemodynamic instability'],
    vitals: {
      bloodPressure: '95/55',
      heartRate: 105,
      temperature: 37.8,
      oxygenSat: 92
    },
    comorbidities: ['None significant'],
    requestedBy: 'Dr. Garcia',
    requestTime: new Date(Date.now() - 60 * 60 * 1000),
    aiRecommendation: 'Monitor closely - may require ICU if bleeding continues',
    bedRequirement: 'standard'
  }
];

export const ICUAdmissionPrioritizer = () => {
  const [candidates, setCandidates] = useState<AdmissionCandidate[]>(mockCandidates);

  const getPriorityColor = (level: string) => {
    switch (level) {
      case 'urgent': return 'bg-red-600 text-white animate-pulse';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-red-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getBedRequirementColor = (req: string) => {
    switch (req) {
      case 'specialized': return 'bg-purple-500 text-white';
      case 'isolation': return 'bg-orange-500 text-white';
      case 'standard': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            ICU Admission Prioritizer
          </CardTitle>
          <CardDescription>
            AI-powered severity-based prioritization for ICU admissions with SOFA and APACHE scoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">1</p>
                  <p className="text-sm text-gray-600">Urgent</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">1</p>
                  <p className="text-sm text-gray-600">High Priority</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">1</p>
                  <p className="text-sm text-gray-600">Medium Priority</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <Heart className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">3</p>
                  <p className="text-sm text-gray-600">Available Beds</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {candidates.map((candidate) => (
              <Card key={candidate.patientId} className={`border-l-4 ${candidate.priorityLevel === 'urgent' ? 'border-l-red-600' : candidate.priorityLevel === 'high' ? 'border-l-red-400' : 'border-l-yellow-400'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{candidate.patientName}</h3>
                      <Badge variant="outline">Age {candidate.age}</Badge>
                      <Badge className={getPriorityColor(candidate.priorityLevel)}>
                        {candidate.priorityLevel.toUpperCase()}
                      </Badge>
                      <Badge className={getBedRequirementColor(candidate.bedRequirement)}>
                        {candidate.bedRequirement.toUpperCase()} BED
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Requested: {candidate.requestTime.toLocaleTimeString()}</p>
                      <p className="text-sm text-gray-500">By: {candidate.requestedBy}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Severity Score</span>
                          <span className={`text-sm font-bold ${getScoreColor(candidate.severityScore)}`}>{candidate.severityScore}%</span>
                        </div>
                        <Progress value={candidate.severityScore} className="h-3" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>SOFA Score:</span>
                          <span className="font-bold">{candidate.sofa}/24</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>APACHE II:</span>
                          <span className="font-bold">{candidate.apache}/71</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Est. Stay:</span>
                          <span className="font-medium">{candidate.estimatedStay} days</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Current Vitals</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>BP:</span>
                          <span className="font-medium">{candidate.vitals.bloodPressure}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>HR:</span>
                          <span className="font-medium">{candidate.vitals.heartRate} bpm</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Temp:</span>
                          <span className="font-medium">{candidate.vitals.temperature}°C</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>O2 Sat:</span>
                          <span className="font-medium">{candidate.vitals.oxygenSat}%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Clinical Details</h4>
                      <div className="space-y-2">
                        <p className="text-sm"><strong>Diagnosis:</strong> {candidate.primaryDiagnosis}</p>
                        <p className="text-sm"><strong>Location:</strong> {candidate.currentLocation}</p>
                        <div className="text-sm">
                          <strong>Comorbidities:</strong>
                          <div className="mt-1">
                            {candidate.comorbidities.map((condition, index) => (
                              <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                                {condition}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Risk Factors:</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.riskFactors.map((factor, index) => (
                        <Badge key={index} variant="outline" className="text-red-600 border-red-300">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">AI Recommendation:</span>
                    </div>
                    <p className="text-sm text-blue-700">{candidate.aiRecommendation}</p>
                  </div>

                  <div className="flex gap-2">
                    {candidate.priorityLevel === 'urgent' && (
                      <Button size="sm" variant="destructive">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Admit Now
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Users className="h-4 w-4 mr-1" />
                      Assign Bed
                    </Button>
                    <Button size="sm" variant="outline">
                      Update Priority
                    </Button>
                    <Button size="sm" variant="outline">
                      Clinical Notes
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
