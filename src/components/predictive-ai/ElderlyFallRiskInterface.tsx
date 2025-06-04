
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, AlertTriangle, Shield, Activity, Pill } from 'lucide-react';

interface FallRiskPatient {
  id: string;
  name: string;
  age: number;
  room: string;
  fallRiskScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'severe';
  mobilityScore: number;
  riskFactors: string[];
  medications: string[];
  interventions: string[];
  lastAssessment: string;
  fallHistory: number;
  cognitiveStatus: 'intact' | 'mild-impairment' | 'moderate-impairment';
}

const mockFallRiskPatients: FallRiskPatient[] = [
  {
    id: 'FR001',
    name: 'Dorothy Williams',
    age: 84,
    room: 'Ward-C15',
    fallRiskScore: 92,
    riskLevel: 'severe',
    mobilityScore: 35,
    riskFactors: ['Age >80', 'Multiple medications', 'History of falls', 'Cognitive impairment'],
    medications: ['Sedatives', 'Diuretics', 'Antihypertensives'],
    interventions: ['Bed alarm', 'Hourly rounds', 'Fall prevention equipment'],
    lastAssessment: '2 hours ago',
    fallHistory: 3,
    cognitiveStatus: 'moderate-impairment'
  },
  {
    id: 'FR002',
    name: 'Frank Thompson',
    age: 69,
    room: 'Ward-D08',
    fallRiskScore: 45,
    riskLevel: 'moderate',
    mobilityScore: 68,
    riskFactors: ['Recent surgery', 'Pain medication'],
    medications: ['Opioids'],
    interventions: ['Education provided', 'Regular assistance'],
    lastAssessment: '6 hours ago',
    fallHistory: 0,
    cognitiveStatus: 'intact'
  }
];

export const ElderlyFallRiskInterface = () => {
  const [patients, setPatients] = useState<FallRiskPatient[]>(mockFallRiskPatients);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'severe': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCognitiveBadge = (status: string) => {
    const config = {
      'intact': { className: 'bg-green-100 text-green-800', label: 'Intact' },
      'mild-impairment': { className: 'bg-yellow-100 text-yellow-800', label: 'Mild Impairment' },
      'moderate-impairment': { className: 'bg-red-100 text-red-800', label: 'Moderate Impairment' }
    };
    return <Badge className={config[status].className}>{config[status].label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Elderly Fall Risk Assessment
          </CardTitle>
          <CardDescription>
            AI-powered fall risk prediction with mobility assessments and safety protocols
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">1</p>
                    <p className="text-sm text-gray-600">Severe Risk</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Users className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">0</p>
                    <p className="text-sm text-gray-600">High Risk</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-yellow-200 bg-yellow-50">
                <div className="flex items-center gap-2">
                  <Activity className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">1</p>
                    <p className="text-sm text-gray-600">Moderate Risk</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Shield className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">15</p>
                    <p className="text-sm text-gray-600">Low Risk</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            {patients.sort((a, b) => b.fallRiskScore - a.fallRiskScore).map((patient) => (
              <Card key={patient.id} className={`border-l-4 ${patient.riskLevel === 'severe' ? 'border-l-red-600' : patient.riskLevel === 'high' ? 'border-l-red-400' : patient.riskLevel === 'moderate' ? 'border-l-yellow-400' : 'border-l-green-400'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{patient.name}</h3>
                      <Badge variant="outline">Age {patient.age}</Badge>
                      <Badge variant="outline">{patient.room}</Badge>
                      <Badge className={getRiskColor(patient.riskLevel)}>
                        {patient.riskLevel.toUpperCase()} RISK
                      </Badge>
                      {getCognitiveBadge(patient.cognitiveStatus)}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Last assessment: {patient.lastAssessment}</p>
                      <p className="text-sm font-medium">Fall history: {patient.fallHistory} falls</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Fall Risk Score</span>
                          <span className="text-sm font-bold">{patient.fallRiskScore}/100</span>
                        </div>
                        <Progress value={patient.fallRiskScore} className="h-3" />
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Mobility Score</span>
                          <span className="text-sm font-bold">{patient.mobilityScore}/100</span>
                        </div>
                        <Progress value={patient.mobilityScore} className="h-2" />
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Risk Factors:</h4>
                        <div className="flex flex-wrap gap-2">
                          {patient.riskFactors.map((factor, index) => (
                            <Badge key={index} variant="outline">{factor}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">High-Risk Medications:</h4>
                        <div className="space-y-1">
                          {patient.medications.map((medication, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Pill className="h-3 w-3 text-orange-500" />
                              <span className="text-sm">{medication}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Active Interventions:</h4>
                        <ul className="text-sm space-y-1">
                          {patient.interventions.map((intervention, index) => (
                            <li key={index}>✓ {intervention}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {patient.riskLevel === 'severe' && (
                      <Button size="sm" variant="destructive">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        High Priority
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Activity className="h-4 w-4 mr-1" />
                      Assess Mobility
                    </Button>
                    <Button size="sm" variant="outline">
                      <Shield className="h-4 w-4 mr-1" />
                      Update Plan
                    </Button>
                    <Button size="sm" variant="outline">
                      Education Materials
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
