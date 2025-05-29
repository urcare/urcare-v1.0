
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle, Clock, TrendingUp } from 'lucide-react';

interface DischargeCriteria {
  id: string;
  category: string;
  criterion: string;
  status: 'met' | 'pending' | 'not-met';
  weight: number;
  lastUpdated: string;
  notes?: string;
}

interface PatientReadiness {
  patientId: string;
  patientName: string;
  bedNumber: string;
  admissionDate: string;
  targetDischargeDate: string;
  overallScore: number;
  readinessLevel: 'ready' | 'almost-ready' | 'needs-work' | 'not-ready';
  criteria: DischargeCriteria[];
  blockers: string[];
  estimatedDischarge?: string;
}

const mockPatientReadiness: PatientReadiness[] = [
  {
    patientId: 'W003',
    patientName: 'Mike Davis',
    bedNumber: 'A-105',
    admissionDate: '2024-01-18',
    targetDischargeDate: '2024-01-22',
    overallScore: 92,
    readinessLevel: 'ready',
    estimatedDischarge: 'Today',
    blockers: [],
    criteria: [
      {
        id: 'medical-1',
        category: 'Medical',
        criterion: 'Vital signs stable for 24h',
        status: 'met',
        weight: 20,
        lastUpdated: '2024-01-21 14:00'
      },
      {
        id: 'medical-2',
        category: 'Medical',
        criterion: 'Pain managed adequately',
        status: 'met',
        weight: 15,
        lastUpdated: '2024-01-21 12:00'
      },
      {
        id: 'admin-1',
        category: 'Administrative',
        criterion: 'Discharge summary completed',
        status: 'met',
        weight: 15,
        lastUpdated: '2024-01-21 10:30'
      },
      {
        id: 'social-1',
        category: 'Social',
        criterion: 'Home care arrangements',
        status: 'met',
        weight: 20,
        lastUpdated: '2024-01-21 09:00'
      },
      {
        id: 'pharma-1',
        category: 'Pharmacy',
        criterion: 'Medications reconciled',
        status: 'met',
        weight: 15,
        lastUpdated: '2024-01-21 11:15'
      },
      {
        id: 'edu-1',
        category: 'Education',
        criterion: 'Patient education completed',
        status: 'pending',
        weight: 15,
        lastUpdated: '2024-01-21 08:00',
        notes: 'Scheduled for 2:00 PM today'
      }
    ]
  },
  {
    patientId: 'W007',
    patientName: 'Sarah Johnson',
    bedNumber: 'B-204',
    admissionDate: '2024-01-19',
    targetDischargeDate: '2024-01-24',
    overallScore: 68,
    readinessLevel: 'needs-work',
    blockers: ['Social work consultation pending', 'Home oxygen setup required'],
    criteria: [
      {
        id: 'medical-1',
        category: 'Medical',
        criterion: 'Vital signs stable for 24h',
        status: 'met',
        weight: 20,
        lastUpdated: '2024-01-21 14:00'
      },
      {
        id: 'medical-2',
        category: 'Medical',
        criterion: 'Oxygen requirements stable',
        status: 'pending',
        weight: 25,
        lastUpdated: '2024-01-21 12:00',
        notes: 'Still requiring 2L O2, weaning in progress'
      },
      {
        id: 'social-1',
        category: 'Social',
        criterion: 'Home care arrangements',
        status: 'not-met',
        weight: 20,
        lastUpdated: '2024-01-20 15:00',
        notes: 'Family meeting scheduled for tomorrow'
      },
      {
        id: 'equipment-1',
        category: 'Equipment',
        criterion: 'DME ordered and available',
        status: 'not-met',
        weight: 15,
        lastUpdated: '2024-01-20 10:00',
        notes: 'Home oxygen concentrator delivery pending'
      }
    ]
  }
];

export const DischargeReadinessEngine = () => {
  const [patients, setPatients] = useState<PatientReadiness[]>(mockPatientReadiness);

  const getReadinessColor = (level: string) => {
    switch (level) {
      case 'ready': return 'bg-green-500 text-white';
      case 'almost-ready': return 'bg-blue-500 text-white';
      case 'needs-work': return 'bg-yellow-500 text-white';
      case 'not-ready': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'met': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'not-met': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const calculateCategoryScore = (criteria: DischargeCriteria[], category: string) => {
    const categoryCriteria = criteria.filter(c => c.category === category);
    const totalWeight = categoryCriteria.reduce((sum, c) => sum + c.weight, 0);
    const metWeight = categoryCriteria
      .filter(c => c.status === 'met')
      .reduce((sum, c) => sum + c.weight, 0);
    return totalWeight > 0 ? Math.round((metWeight / totalWeight) * 100) : 0;
  };

  const categories = ['Medical', 'Administrative', 'Social', 'Pharmacy', 'Education', 'Equipment'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Discharge Readiness Engine
          </CardTitle>
          <CardDescription>
            AI-powered assessment of patient discharge readiness with predictive scoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {patients.map((patient) => (
              <Card key={patient.patientId} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{patient.patientName}</CardTitle>
                      <CardDescription>
                        Bed {patient.bedNumber} • Admitted: {patient.admissionDate} • Target: {patient.targetDischargeDate}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge className={getReadinessColor(patient.readinessLevel)}>
                        {patient.readinessLevel.replace('-', ' ').toUpperCase()}
                      </Badge>
                      <div className="mt-2">
                        <span className="text-2xl font-bold">{patient.overallScore}%</span>
                        <Progress value={patient.overallScore} className="w-32 mt-1" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {patient.blockers.length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        Active Blockers
                      </h4>
                      <ul className="list-disc list-inside text-sm text-red-700">
                        {patient.blockers.map((blocker, index) => (
                          <li key={index}>{blocker}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {categories.map((category) => {
                      const score = calculateCategoryScore(patient.criteria, category);
                      const categoryItems = patient.criteria.filter(c => c.category === category);
                      return (
                        <div key={category} className="text-center p-3 border rounded-lg">
                          <h4 className="font-semibold text-sm mb-1">{category}</h4>
                          <div className="text-lg font-bold">{score}%</div>
                          <div className="text-xs text-gray-500">
                            {categoryItems.filter(c => c.status === 'met').length}/{categoryItems.length} criteria
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold">Detailed Criteria</h4>
                    {patient.criteria.map((criterion) => (
                      <div 
                        key={criterion.id}
                        className={`p-3 border rounded-lg ${
                          criterion.status === 'met' ? 'bg-green-50 border-green-200' :
                          criterion.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                          'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(criterion.status)}
                            <span className="font-medium">{criterion.criterion}</span>
                            <Badge variant="outline" className="text-xs">
                              {criterion.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Weight: {criterion.weight}%
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">
                            Updated: {criterion.lastUpdated}
                          </span>
                        </div>
                        {criterion.notes && (
                          <p className="text-sm text-gray-600 mt-2">{criterion.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                      {patient.estimatedDischarge && (
                        <span className="text-sm font-medium text-green-600">
                          Estimated Discharge: {patient.estimatedDischarge}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Update Criteria
                      </Button>
                      <Button 
                        size="sm"
                        disabled={patient.readinessLevel !== 'ready'}
                        className={patient.readinessLevel === 'ready' ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        {patient.readinessLevel === 'ready' ? 'Initiate Discharge' : 'Not Ready'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Readiness Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['ready', 'almost-ready', 'needs-work', 'not-ready'].map((level) => {
              const count = patients.filter(p => p.readinessLevel === level).length;
              return (
                <div key={level} className="text-center p-4 border rounded-lg">
                  <Badge className={getReadinessColor(level)} variant="secondary">
                    {level.replace('-', ' ').toUpperCase()}
                  </Badge>
                  <p className="text-2xl font-bold mt-2">{count}</p>
                  <p className="text-sm text-gray-500">Patients</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
