
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Pill, AlertTriangle, TrendingDown, Calendar, Phone } from 'lucide-react';

interface MedicationAdherence {
  id: string;
  patientName: string;
  age: number;
  medications: string[];
  adherenceScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  missedDoses: number;
  totalDoses: number;
  lastTaken: string;
  predictions: string[];
  interventions: string[];
  pharmacyContact: boolean;
}

const mockAdherence: MedicationAdherence[] = [
  {
    id: 'MA001',
    patientName: 'John Thompson',
    age: 52,
    medications: ['Sertraline 50mg', 'Lorazepam 1mg', 'Lithium 300mg'],
    adherenceScore: 45,
    riskLevel: 'critical',
    missedDoses: 11,
    totalDoses: 20,
    lastTaken: '3 days ago',
    predictions: ['High risk of relapse within 2 weeks', 'Potential hospitalization risk'],
    interventions: ['Daily reminder calls', 'Pharmacy pickup alerts', 'Caregiver notification'],
    pharmacyContact: true
  },
  {
    id: 'MA002',
    patientName: 'Lisa Wang',
    age: 34,
    medications: ['Fluoxetine 20mg', 'Alprazolam 0.5mg'],
    adherenceScore: 78,
    riskLevel: 'moderate',
    missedDoses: 3,
    totalDoses: 14,
    lastTaken: 'Yesterday',
    predictions: ['Stable but requires monitoring', 'Side effect concerns'],
    interventions: ['Weekly check-ins', 'Side effect tracking'],
    pharmacyContact: false
  }
];

export const MedicationAdherenceMonitor = () => {
  const [adherenceData, setAdherenceData] = useState<MedicationAdherence[]>(mockAdherence);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Medication Adherence Monitoring
          </CardTitle>
          <CardDescription>
            AI-powered adherence prediction with patient engagement tools and pharmacy integration
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
                  <Pill className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">1</p>
                    <p className="text-sm text-gray-600">Moderate Risk</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Calendar className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">67</p>
                    <p className="text-sm text-gray-600">Good Adherence</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            {adherenceData.sort((a, b) => {
              const riskOrder = { critical: 4, high: 3, moderate: 2, low: 1 };
              return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
            }).map((patient) => (
              <Card key={patient.id} className={`border-l-4 ${patient.riskLevel === 'critical' ? 'border-l-red-600' : patient.riskLevel === 'high' ? 'border-l-red-400' : patient.riskLevel === 'moderate' ? 'border-l-yellow-400' : 'border-l-green-400'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{patient.patientName}</h3>
                      <Badge variant="outline">Age {patient.age}</Badge>
                      <Badge className={getRiskColor(patient.riskLevel)}>
                        {patient.riskLevel.toUpperCase()}
                      </Badge>
                      {patient.pharmacyContact && (
                        <Badge className="bg-blue-100 text-blue-800">Pharmacy Contacted</Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Last taken: {patient.lastTaken}</p>
                      <p className="text-sm font-medium">Missed: {patient.missedDoses}/{patient.totalDoses} doses</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Adherence Score</span>
                          <span className="text-sm font-bold">{patient.adherenceScore}%</span>
                        </div>
                        <Progress value={patient.adherenceScore} className="h-3" />
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Current Medications:</h4>
                        <div className="flex flex-wrap gap-2">
                          {patient.medications.map((med, index) => (
                            <Badge key={index} variant="outline">{med}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">AI Predictions:</h4>
                        <ul className="text-sm space-y-1">
                          {patient.predictions.map((prediction, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <AlertTriangle className="h-3 w-3 text-orange-500" />
                              {prediction}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Active Interventions:</h4>
                    <ul className="text-sm space-y-1">
                      {patient.interventions.map((intervention, index) => (
                        <li key={index}>• {intervention}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    {patient.riskLevel === 'critical' && (
                      <Button size="sm" variant="destructive">
                        <Phone className="h-4 w-4 mr-1" />
                        Contact Patient
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-1" />
                      Set Reminders
                    </Button>
                    <Button size="sm" variant="outline">
                      <Pill className="h-4 w-4 mr-1" />
                      Pharmacy Alert
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
