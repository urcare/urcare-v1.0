
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  UserCheck, 
  Calendar, 
  Pill, 
  FileText,
  CheckCircle,
  Clock,
  Home,
  Phone
} from 'lucide-react';

interface DischargeSummary {
  id: string;
  patientName: string;
  admissionDate: string;
  dischargeDate: string;
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  procedures: string[];
  dischargeMedications: string[];
  followUpInstructions: string[];
  warningSigns: string[];
  completionStatus: number;
  urgency: 'routine' | 'urgent' | 'same-day';
  careCoordinator: string;
}

const mockSummaries: DischargeSummary[] = [
  {
    id: 'DS001',
    patientName: 'Elena Rodriguez',
    admissionDate: '2024-01-10',
    dischargeDate: '2024-01-15',
    primaryDiagnosis: 'Acute Myocardial Infarction',
    secondaryDiagnoses: ['Type 2 Diabetes Mellitus', 'Hypertension'],
    procedures: ['Percutaneous Coronary Intervention', 'Cardiac Catheterization'],
    dischargeMedications: [
      'Aspirin 81mg daily',
      'Clopidogrel 75mg daily',
      'Atorvastatin 80mg daily',
      'Metoprolol 50mg BID'
    ],
    followUpInstructions: [
      'Cardiology follow-up in 1 week',
      'Primary care in 3-5 days',
      'Cardiac rehabilitation referral'
    ],
    warningSigns: [
      'Chest pain or pressure',
      'Shortness of breath',
      'Irregular heartbeat',
      'Swelling in legs or feet'
    ],
    completionStatus: 85,
    urgency: 'urgent',
    careCoordinator: 'Sarah Johnson, RN'
  },
  {
    id: 'DS002',
    patientName: 'David Kim',
    admissionDate: '2024-01-12',
    dischargeDate: '2024-01-16',
    primaryDiagnosis: 'Pneumonia, Community-Acquired',
    secondaryDiagnoses: ['COPD', 'Smoking History'],
    procedures: ['Chest X-ray', 'Sputum Culture'],
    dischargeMedications: [
      'Amoxicillin-Clavulanate 875mg BID x 7 days',
      'Albuterol inhaler PRN',
      'Prednisone 40mg daily x 5 days'
    ],
    followUpInstructions: [
      'Primary care in 1 week',
      'Pulmonology follow-up in 2 weeks',
      'Smoking cessation counseling'
    ],
    warningSigns: [
      'Worsening cough or fever',
      'Difficulty breathing',
      'Chest pain'
    ],
    completionStatus: 92,
    urgency: 'routine',
    careCoordinator: 'Michael Chen, RN'
  }
];

export const DischargeSummaryGenerator = () => {
  const [summaries] = useState<DischargeSummary[]>(mockSummaries);
  const [selectedSummary, setSelectedSummary] = useState<DischargeSummary | null>(null);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'same-day': return 'bg-red-500 text-white';
      case 'urgent': return 'bg-orange-500 text-white';
      case 'routine': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCompletionColor = (status: number) => {
    if (status >= 90) return 'text-green-600';
    if (status >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Discharge Summary Generator
          </CardTitle>
          <CardDescription>
            Automated treatment summaries with follow-up instructions and care continuity plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">34</p>
                    <p className="text-sm text-gray-600">Discharges Today</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">12</p>
                    <p className="text-sm text-gray-600">Pending Summaries</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">2.3h</p>
                    <p className="text-sm text-gray-600">Avg. Completion Time</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Home className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">97.2%</p>
                    <p className="text-sm text-gray-600">Care Continuity</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Discharge Summaries</h3>
              {summaries.map((summary) => (
                <Card 
                  key={summary.id} 
                  className={`cursor-pointer transition-colors ${selectedSummary?.id === summary.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-green-400`}
                  onClick={() => setSelectedSummary(summary)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{summary.patientName}</h4>
                        <p className="text-sm text-gray-600">{summary.primaryDiagnosis}</p>
                        <p className="text-xs text-gray-500">Discharge: {summary.dischargeDate}</p>
                      </div>
                      <Badge className={getUrgencyColor(summary.urgency)}>
                        {summary.urgency.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Completion Status</span>
                        <span className={`text-sm font-bold ${getCompletionColor(summary.completionStatus)}`}>
                          {summary.completionStatus}%
                        </span>
                      </div>
                      <Progress value={summary.completionStatus} className="h-2" />
                      
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Pill className="h-3 w-3 text-blue-500" />
                          <span>{summary.dischargeMedications.length} meds</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-green-500" />
                          <span>{summary.followUpInstructions.length} follow-ups</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-purple-500" />
                          <span>{summary.careCoordinator.split(',')[0]}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedSummary ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedSummary.patientName} - Discharge Summary</CardTitle>
                    <CardDescription>Comprehensive care transition planning</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Admission Details</h4>
                          <div className="space-y-1 text-sm">
                            <p>Admitted: <strong>{selectedSummary.admissionDate}</strong></p>
                            <p>Discharged: <strong>{selectedSummary.dischargeDate}</strong></p>
                            <p>Primary Dx: {selectedSummary.primaryDiagnosis}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Care Coordinator</h4>
                          <p className="text-sm font-semibold text-blue-600">{selectedSummary.careCoordinator}</p>
                          <p className="text-xs text-gray-500">Completion: {selectedSummary.completionStatus}%</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Secondary Diagnoses</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedSummary.secondaryDiagnoses.map((dx, index) => (
                            <Badge key={index} variant="outline">{dx}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Procedures Performed</h4>
                        <ul className="space-y-1">
                          {selectedSummary.procedures.map((procedure, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {procedure}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Discharge Medications</h4>
                        <ul className="space-y-1">
                          {selectedSummary.dischargeMedications.map((med, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Pill className="h-3 w-3 text-blue-500" />
                              {med}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Follow-up Instructions</h4>
                        <ul className="space-y-1">
                          {selectedSummary.followUpInstructions.map((instruction, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Calendar className="h-3 w-3 text-green-500" />
                              {instruction}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 text-red-600">Warning Signs - Return to Hospital If:</h4>
                        <ul className="space-y-1">
                          {selectedSummary.warningSigns.map((sign, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-red-600">
                              <Clock className="h-3 w-3" />
                              {sign}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <FileText className="h-4 w-4 mr-1" />
                          Generate Final Summary
                        </Button>
                        <Button variant="outline">
                          <Phone className="h-4 w-4 mr-1" />
                          Schedule Follow-ups
                        </Button>
                        <Button variant="outline">
                          <Home className="h-4 w-4 mr-1" />
                          Patient Portal
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a discharge summary to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
