
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, AlertTriangle, TrendingDown, Activity, Heart, Thermometer } from 'lucide-react';

interface PatientRisk {
  id: string;
  patientName: string;
  room: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  aiConfidence: number;
  keyFactors: string[];
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSat: number;
    respiratoryRate: number;
  };
  trending: 'improving' | 'stable' | 'declining';
  lastUpdate: string;
  prediction: string;
}

const mockPatients: PatientRisk[] = [
  {
    id: 'ICU001',
    patientName: 'Sarah Johnson',
    room: 'ICU-A1',
    riskScore: 85,
    riskLevel: 'critical',
    aiConfidence: 92,
    keyFactors: ['Declining oxygen saturation', 'Increased heart rate variability', 'Abnormal respiratory pattern'],
    vitals: {
      heartRate: 125,
      bloodPressure: '90/60',
      temperature: 38.9,
      oxygenSat: 88,
      respiratoryRate: 28
    },
    trending: 'declining',
    lastUpdate: '2 min ago',
    prediction: 'High probability of deterioration within next 4 hours'
  },
  {
    id: 'ICU002',
    patientName: 'Michael Chen',
    room: 'ICU-B3',
    riskScore: 45,
    riskLevel: 'medium',
    aiConfidence: 78,
    keyFactors: ['Mild blood pressure fluctuation', 'Recent medication adjustment'],
    vitals: {
      heartRate: 88,
      bloodPressure: '110/70',
      temperature: 37.2,
      oxygenSat: 95,
      respiratoryRate: 18
    },
    trending: 'stable',
    lastUpdate: '5 min ago',
    prediction: 'Stable condition expected over next 12 hours'
  }
];

export const ICUDeterioration = () => {
  const [patients, setPatients] = useState<PatientRisk[]>(mockPatients);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTrendingIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '↗️';
      case 'declining': return '↘️';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            ICU Deterioration Predictor
          </CardTitle>
          <CardDescription>
            AI-powered early warning system for patient deterioration prediction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">2</p>
                    <p className="text-sm text-gray-600">Critical Risk</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-yellow-200 bg-yellow-50">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">4</p>
                    <p className="text-sm text-gray-600">High Risk</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Activity className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">8</p>
                    <p className="text-sm text-gray-600">Medium Risk</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Heart className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">12</p>
                    <p className="text-sm text-gray-600">Stable</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            {patients.map((patient) => (
              <Card key={patient.id} className={`border-l-4 ${patient.riskLevel === 'critical' ? 'border-l-red-600' : patient.riskLevel === 'high' ? 'border-l-red-400' : patient.riskLevel === 'medium' ? 'border-l-yellow-400' : 'border-l-green-400'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{patient.patientName}</h3>
                      <Badge variant="outline">{patient.room}</Badge>
                      <Badge className={getRiskColor(patient.riskLevel)}>
                        {patient.riskLevel.toUpperCase()} RISK
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {getTrendingIcon(patient.trending)} {patient.trending}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Last update: {patient.lastUpdate}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Risk Score</span>
                          <span className="text-sm font-bold">{patient.riskScore}%</span>
                        </div>
                        <Progress value={patient.riskScore} className="h-3" />
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">AI Confidence</span>
                          <span className="text-sm">{patient.aiConfidence}%</span>
                        </div>
                        <Progress value={patient.aiConfidence} className="h-2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <div>
                          <p className="text-xs text-gray-500">Heart Rate</p>
                          <p className="font-medium">{patient.vitals.heartRate} bpm</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-xs text-gray-500">Blood Pressure</p>
                          <p className="font-medium">{patient.vitals.bloodPressure}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="text-xs text-gray-500">Temperature</p>
                          <p className="font-medium">{patient.vitals.temperature}°C</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-xs text-gray-500">O2 Sat</p>
                          <p className="font-medium">{patient.vitals.oxygenSat}%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Key Risk Factors:</h4>
                    <div className="flex flex-wrap gap-2">
                      {patient.keyFactors.map((factor, index) => (
                        <Badge key={index} variant="outline">{factor}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-1">AI Prediction:</h4>
                    <p className="text-sm">{patient.prediction}</p>
                  </div>

                  {patient.riskLevel === 'critical' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="destructive">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Alert Doctor
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Adjust Thresholds
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
