
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, Activity, Thermometer, Heart } from 'lucide-react';

interface SepsisPatient {
  id: string;
  name: string;
  age: number;
  room: string;
  sepsisRisk: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'severe';
  qSofaScore: number;
  sepsisScore: number;
  biomarkers: {
    lactate: number;
    procalcitonin: number;
    whiteBloodCells: number;
  };
  vitals: {
    temperature: number;
    heartRate: number;
    bloodPressure: string;
    respiratoryRate: number;
  };
  clinicalSigns: string[];
  protocols: string[];
  timeToSepsis: string;
  interventionStatus: 'pending' | 'initiated' | 'completed';
}

const mockSepsisPatients: SepsisPatient[] = [
  {
    id: 'SEP001',
    name: 'Patricia Davis',
    age: 67,
    room: 'ICU-B1',
    sepsisRisk: 89,
    riskLevel: 'severe',
    qSofaScore: 2,
    sepsisScore: 4,
    biomarkers: {
      lactate: 4.2,
      procalcitonin: 15.8,
      whiteBloodCells: 18000
    },
    vitals: {
      temperature: 38.9,
      heartRate: 125,
      bloodPressure: '85/55',
      respiratoryRate: 28
    },
    clinicalSigns: ['Fever', 'Tachycardia', 'Altered mental status', 'Hypotension'],
    protocols: ['Blood cultures ordered', 'Antibiotic protocol', 'Fluid resuscitation'],
    timeToSepsis: '2-4 hours',
    interventionStatus: 'initiated'
  },
  {
    id: 'SEP002',
    name: 'James Miller',
    age: 52,
    room: 'Ward-A7',
    sepsisRisk: 38,
    riskLevel: 'moderate',
    qSofaScore: 1,
    sepsisScore: 2,
    biomarkers: {
      lactate: 2.1,
      procalcitonin: 3.2,
      whiteBloodCells: 12000
    },
    vitals: {
      temperature: 38.2,
      heartRate: 98,
      bloodPressure: '110/70',
      respiratoryRate: 22
    },
    clinicalSigns: ['Fever', 'Elevated WBC'],
    protocols: ['Monitoring enhanced', 'Infection workup'],
    timeToSepsis: '24+ hours',
    interventionStatus: 'pending'
  }
];

export const SepsisDetectionSystem = () => {
  const [patients, setPatients] = useState<SepsisPatient[]>(mockSepsisPatients);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'severe': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getInterventionBadge = (status: string) => {
    const config = {
      pending: { className: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      initiated: { className: 'bg-blue-100 text-blue-800', label: 'Initiated' },
      completed: { className: 'bg-green-100 text-green-800', label: 'Completed' }
    };
    return <Badge className={config[status].className}>{config[status].label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sepsis Detection System
          </CardTitle>
          <CardDescription>
            AI-powered sepsis prediction with biomarker tracking and protocol activation
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
                  <Shield className="h-8 w-8 text-orange-600" />
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
                  <Heart className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">8</p>
                    <p className="text-sm text-gray-600">Low Risk</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            {patients.sort((a, b) => b.sepsisRisk - a.sepsisRisk).map((patient) => (
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
                      {getInterventionBadge(patient.interventionStatus)}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Time to sepsis: {patient.timeToSepsis}</p>
                      <p className="text-sm font-medium">qSOFA: {patient.qSofaScore} | SEPSIS: {patient.sepsisScore}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Sepsis Risk</span>
                          <span className="text-sm font-bold">{patient.sepsisRisk}%</span>
                        </div>
                        <Progress value={patient.sepsisRisk} className="h-3" />
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Biomarkers:</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Lactate: {patient.biomarkers.lactate} mmol/L</div>
                          <div>PCT: {patient.biomarkers.procalcitonin} ng/mL</div>
                          <div>WBC: {patient.biomarkers.whiteBloodCells}/μL</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Clinical Signs:</h4>
                        <div className="flex flex-wrap gap-2">
                          {patient.clinicalSigns.map((sign, index) => (
                            <Badge key={index} variant="outline">{sign}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Vital Signs:</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Thermometer className="h-3 w-3 text-orange-500" />
                            <span>Temp: {patient.vitals.temperature}°C</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3 text-red-500" />
                            <span>HR: {patient.vitals.heartRate} bpm</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="h-3 w-3 text-blue-500" />
                            <span>BP: {patient.vitals.bloodPressure}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="h-3 w-3 text-green-500" />
                            <span>RR: {patient.vitals.respiratoryRate}/min</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Active Protocols:</h4>
                        <ul className="text-sm space-y-1">
                          {patient.protocols.map((protocol, index) => (
                            <li key={index}>✓ {protocol}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {patient.riskLevel === 'severe' && (
                      <Button size="sm" variant="destructive">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Activate Sepsis Protocol
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Shield className="h-4 w-4 mr-1" />
                      Update Protocol
                    </Button>
                    <Button size="sm" variant="outline">
                      <Activity className="h-4 w-4 mr-1" />
                      View Trends
                    </Button>
                    <Button size="sm" variant="outline">
                      Lab Orders
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
