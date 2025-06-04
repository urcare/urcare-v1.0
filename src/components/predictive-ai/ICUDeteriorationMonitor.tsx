
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, Brain, TrendingDown, AlertTriangle, Activity } from 'lucide-react';

interface ICUPatient {
  id: string;
  name: string;
  room: string;
  deteriorationRisk: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  aiConfidence: number;
  riskFactors: string[];
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSat: number;
    respiratoryRate: number;
  };
  trends: {
    heartRate: 'up' | 'down' | 'stable';
    bloodPressure: 'up' | 'down' | 'stable';
    oxygenSat: 'up' | 'down' | 'stable';
  };
  timeToDeterioration: string;
  interventions: string[];
}

const mockICUPatients: ICUPatient[] = [
  {
    id: 'ICU001',
    name: 'Emma Rodriguez',
    room: 'ICU-A1',
    deteriorationRisk: 87,
    riskLevel: 'critical',
    aiConfidence: 91,
    riskFactors: ['Declining oxygen saturation', 'Increased lactate', 'Reduced urine output'],
    vitals: {
      heartRate: 128,
      bloodPressure: '85/55',
      temperature: 38.9,
      oxygenSat: 89,
      respiratoryRate: 32
    },
    trends: {
      heartRate: 'up',
      bloodPressure: 'down',
      oxygenSat: 'down'
    },
    timeToDeterioration: '2-4 hours',
    interventions: ['Increase oxygen support', 'Fluid resuscitation', 'Consider vasopressors']
  },
  {
    id: 'ICU002',
    name: 'David Kim',
    room: 'ICU-B2',
    deteriorationRisk: 45,
    riskLevel: 'moderate',
    aiConfidence: 82,
    riskFactors: ['Recent surgery', 'Mild hypotension'],
    vitals: {
      heartRate: 92,
      bloodPressure: '105/68',
      temperature: 37.4,
      oxygenSat: 94,
      respiratoryRate: 20
    },
    trends: {
      heartRate: 'stable',
      bloodPressure: 'stable',
      oxygenSat: 'stable'
    },
    timeToDeterioration: '12+ hours',
    interventions: ['Continue monitoring', 'Pain management']
  }
];

export const ICUDeteriorationMonitor = () => {
  const [patients, setPatients] = useState<ICUPatient[]>(mockICUPatients);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            ICU Deterioration Monitor
          </CardTitle>
          <CardDescription>
            Real-time patient monitoring with AI-powered deterioration prediction
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
                    <p className="text-sm text-gray-600">Critical Risk</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-8 w-8 text-orange-600" />
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
                    <p className="text-2xl font-bold text-green-600">12</p>
                    <p className="text-sm text-gray-600">Stable</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            {patients.sort((a, b) => b.deteriorationRisk - a.deteriorationRisk).map((patient) => (
              <Card key={patient.id} className={`border-l-4 ${patient.riskLevel === 'critical' ? 'border-l-red-600' : patient.riskLevel === 'high' ? 'border-l-red-400' : patient.riskLevel === 'moderate' ? 'border-l-yellow-400' : 'border-l-green-400'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{patient.name}</h3>
                      <Badge variant="outline">{patient.room}</Badge>
                      <Badge className={getRiskColor(patient.riskLevel)}>
                        {patient.riskLevel.toUpperCase()} RISK
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Est. deterioration: {patient.timeToDeterioration}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Deterioration Risk</span>
                          <span className="text-sm font-bold">{patient.deteriorationRisk}%</span>
                        </div>
                        <Progress value={patient.deteriorationRisk} className="h-3" />
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
                          <p className="text-xs text-gray-500">Heart Rate {getTrendIcon(patient.trends.heartRate)}</p>
                          <p className="font-medium">{patient.vitals.heartRate} bpm</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-xs text-gray-500">Blood Pressure {getTrendIcon(patient.trends.bloodPressure)}</p>
                          <p className="font-medium">{patient.vitals.bloodPressure}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-xs text-gray-500">O2 Sat {getTrendIcon(patient.trends.oxygenSat)}</p>
                          <p className="font-medium">{patient.vitals.oxygenSat}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="text-xs text-gray-500">Resp Rate</p>
                          <p className="font-medium">{patient.vitals.respiratoryRate}/min</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Key Risk Factors:</h4>
                    <div className="flex flex-wrap gap-2">
                      {patient.riskFactors.map((factor, index) => (
                        <Badge key={index} variant="outline">{factor}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Recommended Interventions:</h4>
                    <ul className="text-sm space-y-1">
                      {patient.interventions.map((intervention, index) => (
                        <li key={index}>• {intervention}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    {patient.riskLevel === 'critical' && (
                      <Button size="sm" variant="destructive">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Urgent Alert
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      View Trends
                    </Button>
                    <Button size="sm" variant="outline">
                      Update Care Plan
                    </Button>
                    <Button size="sm" variant="outline">
                      Notify Team
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
