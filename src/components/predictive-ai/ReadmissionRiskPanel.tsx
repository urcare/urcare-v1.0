
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, AlertTriangle, Calendar, Users, FileText } from 'lucide-react';

interface ReadmissionPatient {
  id: string;
  name: string;
  age: number;
  lastDischarge: string;
  readmissionRisk: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  riskFactors: string[];
  primaryDiagnosis: string;
  comorbidities: string[];
  timeframe: string;
  preventionStrategies: string[];
  followUpStatus: 'scheduled' | 'overdue' | 'completed';
}

const mockReadmissionPatients: ReadmissionPatient[] = [
  {
    id: 'RA001',
    name: 'Robert Johnson',
    age: 72,
    lastDischarge: '2024-01-15',
    readmissionRisk: 85,
    riskLevel: 'very-high',
    riskFactors: ['Heart failure', 'Multiple medications', 'Social isolation', 'Previous readmission'],
    primaryDiagnosis: 'Congestive Heart Failure',
    comorbidities: ['Diabetes', 'Hypertension', 'COPD'],
    timeframe: 'Next 30 days',
    preventionStrategies: ['Medication review', 'Home nursing visits', 'Cardiology follow-up'],
    followUpStatus: 'overdue'
  },
  {
    id: 'RA002',
    name: 'Maria Garcia',
    age: 58,
    lastDischarge: '2024-01-20',
    readmissionRisk: 42,
    riskLevel: 'moderate',
    riskFactors: ['Complex medication regimen', 'Limited health literacy'],
    primaryDiagnosis: 'Pneumonia',
    comorbidities: ['Diabetes'],
    timeframe: 'Next 90 days',
    preventionStrategies: ['Patient education', 'Pharmacy consultation'],
    followUpStatus: 'scheduled'
  }
];

export const ReadmissionRiskPanel = () => {
  const [patients, setPatients] = useState<ReadmissionPatient[]>(mockReadmissionPatients);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'very-high': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getFollowUpBadge = (status: string) => {
    switch (status) {
      case 'overdue': return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      case 'scheduled': return <Badge className="bg-green-100 text-green-800">Scheduled</Badge>;
      case 'completed': return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Readmission Risk Assessment
          </CardTitle>
          <CardDescription>
            AI-powered prediction and prevention strategies for hospital readmissions
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
                    <p className="text-sm text-gray-600">Very High Risk</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">0</p>
                    <p className="text-sm text-gray-600">High Risk</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-yellow-200 bg-yellow-50">
                <div className="flex items-center gap-2">
                  <Calendar className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">1</p>
                    <p className="text-sm text-gray-600">Moderate Risk</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Users className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">8</p>
                    <p className="text-sm text-gray-600">Low Risk</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            {patients.sort((a, b) => b.readmissionRisk - a.readmissionRisk).map((patient) => (
              <Card key={patient.id} className={`border-l-4 ${patient.riskLevel === 'very-high' ? 'border-l-red-600' : patient.riskLevel === 'high' ? 'border-l-red-400' : patient.riskLevel === 'moderate' ? 'border-l-yellow-400' : 'border-l-green-400'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{patient.name}</h3>
                      <Badge variant="outline">Age {patient.age}</Badge>
                      <Badge className={getRiskColor(patient.riskLevel)}>
                        {patient.riskLevel.toUpperCase()} RISK
                      </Badge>
                      {getFollowUpBadge(patient.followUpStatus)}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Discharged: {patient.lastDischarge}</p>
                      <p className="text-sm font-medium">Risk window: {patient.timeframe}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Readmission Risk</span>
                          <span className="text-sm font-bold">{patient.readmissionRisk}%</span>
                        </div>
                        <Progress value={patient.readmissionRisk} className="h-3" />
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Primary Diagnosis:</h4>
                        <p className="text-sm">{patient.primaryDiagnosis}</p>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Comorbidities:</h4>
                        <div className="flex flex-wrap gap-2">
                          {patient.comorbidities.map((condition, index) => (
                            <Badge key={index} variant="outline">{condition}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Risk Factors:</h4>
                        <div className="space-y-1">
                          {patient.riskFactors.map((factor, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <AlertTriangle className="h-3 w-3 text-yellow-500" />
                              <span className="text-sm">{factor}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Prevention Strategies:</h4>
                    <ul className="text-sm space-y-1">
                      {patient.preventionStrategies.map((strategy, index) => (
                        <li key={index}>• {strategy}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    {patient.riskLevel === 'very-high' && (
                      <Button size="sm" variant="destructive">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        High Priority
                      </Button>
                    )}
                    {patient.followUpStatus === 'overdue' && (
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule Follow-up
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      Care Plan
                    </Button>
                    <Button size="sm" variant="outline">
                      Contact Patient
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
