
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Stethoscope, 
  AlertTriangle, 
  Eye, 
  Clock, 
  CheckCircle,
  Brain,
  Search,
  Users
} from 'lucide-react';

interface DiagnosisAlert {
  id: string;
  patientName: string;
  primaryDiagnosis: string;
  alertType: 'red_flag' | 'differential' | 'second_opinion' | 'pattern_match';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  suspectedConditions: string[];
  redFlags: string[];
  differentialSuggestions: string[];
  missDiagnosisRisk: number;
  recommendedActions: string[];
  clinicalEvidence: string[];
  timeToReview: string;
}

const mockDiagnosisAlerts: DiagnosisAlert[] = [
  {
    id: 'DA001',
    patientName: 'John Stevens',
    primaryDiagnosis: 'Viral gastroenteritis',
    alertType: 'red_flag',
    severity: 'high',
    suspectedConditions: ['Acute appendicitis', 'Mesenteric ischemia', 'Small bowel obstruction'],
    redFlags: ['Age >65', 'Severe abdominal pain', 'Elevated lactate', 'WBC >15,000'],
    differentialSuggestions: [
      'Consider CT abdomen/pelvis',
      'Surgical consultation',
      'Serial lactate monitoring',
      'Pain assessment with movement'
    ],
    missDiagnosisRisk: 78,
    recommendedActions: [
      'Immediate surgical consultation',
      'CT abdomen/pelvis with IV contrast',
      'Serial physical examinations',
      'Lactate monitoring every 2 hours'
    ],
    clinicalEvidence: [
      'Patient age and presentation atypical for viral gastroenteritis',
      'Elevated inflammatory markers suggest serious pathology',
      'Pain pattern concerning for surgical condition'
    ],
    timeToReview: '15 minutes'
  },
  {
    id: 'DA002',
    patientName: 'Emma Thompson',
    primaryDiagnosis: 'Tension headache',
    alertType: 'differential',
    severity: 'moderate',
    suspectedConditions: ['Subarachnoid hemorrhage', 'Meningitis', 'Temporal arteritis'],
    redFlags: ['Sudden onset', 'Worst headache ever', 'Age >50', 'Visual symptoms'],
    differentialSuggestions: [
      'Consider CT head without contrast',
      'Lumbar puncture if CT negative',
      'ESR/CRP for temporal arteritis',
      'Fundoscopic examination'
    ],
    missDiagnosisRisk: 45,
    recommendedActions: [
      'CT head without contrast',
      'Neurological examination',
      'Blood pressure monitoring',
      'Pain scale assessment'
    ],
    clinicalEvidence: [
      'Sudden onset headache requires exclusion of secondary causes',
      'Patient age and description concerning',
      'Visual symptoms warrant immediate evaluation'
    ],
    timeToReview: '30 minutes'
  }
];

export const MissedDiagnosisAlertSystem = () => {
  const [diagnosisAlerts] = useState<DiagnosisAlert[]>(mockDiagnosisAlerts);
  const [selectedAlert, setSelectedAlert] = useState<DiagnosisAlert | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-700 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'red_flag': return AlertTriangle;
      case 'differential': return Search;
      case 'second_opinion': return Users;
      case 'pattern_match': return Brain;
      default: return AlertTriangle;
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 70) return 'text-red-600';
    if (risk >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Missed Diagnosis Alert System
          </CardTitle>
          <CardDescription>
            AI-powered diagnostic assistance with red flag detection and differential diagnosis suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">3</p>
                    <p className="text-sm text-gray-600">Critical Alerts</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-yellow-200 bg-yellow-50">
                <div className="flex items-center gap-2">
                  <Eye className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">12</p>
                    <p className="text-sm text-gray-600">Needs Review</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Brain className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">94.7%</p>
                    <p className="text-sm text-gray-600">Detection Accuracy</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">89</p>
                    <p className="text-sm text-gray-600">Diagnoses Prevented</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Active Diagnostic Alerts</h3>
              {diagnosisAlerts.sort((a, b) => {
                const severityOrder = { critical: 4, high: 3, moderate: 2, low: 1 };
                return severityOrder[b.severity] - severityOrder[a.severity];
              }).map((alert) => {
                const AlertIcon = getAlertTypeIcon(alert.alertType);
                return (
                  <Card 
                    key={alert.id} 
                    className={`cursor-pointer transition-colors ${selectedAlert?.id === alert.id ? 'ring-2 ring-blue-500' : ''} border-l-4 ${alert.severity === 'critical' || alert.severity === 'high' ? 'border-l-red-500' : alert.severity === 'moderate' ? 'border-l-yellow-400' : 'border-l-blue-400'}`}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{alert.patientName}</h4>
                            <AlertIcon className="h-4 w-4 text-red-500" />
                          </div>
                          <p className="text-sm text-gray-600">Primary: {alert.primaryDiagnosis}</p>
                          <p className="text-xs text-gray-500 capitalize">{alert.alertType.replace('_', ' ')} alert</p>
                        </div>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Miss-Diagnosis Risk</span>
                          <span className={`text-sm font-bold ${getRiskColor(alert.missDiagnosisRisk)}`}>
                            {alert.missDiagnosisRisk}%
                          </span>
                        </div>
                        <Progress value={alert.missDiagnosisRisk} className="h-2" />
                        
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                            <span>{alert.redFlags.length} red flags</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Search className="h-3 w-3 text-blue-500" />
                            <span>{alert.suspectedConditions.length} differentials</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-orange-500" />
                            <span>Review in {alert.timeToReview}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div>
              {selectedAlert ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {React.createElement(getAlertTypeIcon(selectedAlert.alertType), { className: "h-5 w-5" })}
                      {selectedAlert.patientName} - Diagnostic Alert
                    </CardTitle>
                    <CardDescription>
                      {selectedAlert.alertType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Alert
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Current Assessment</h4>
                          <div className="space-y-1 text-sm">
                            <p>Primary Diagnosis: <strong>{selectedAlert.primaryDiagnosis}</strong></p>
                            <p>Risk Level: <span className={getRiskColor(selectedAlert.missDiagnosisRisk)}>{selectedAlert.missDiagnosisRisk}%</span></p>
                            <p>Review Time: <strong>{selectedAlert.timeToReview}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Alert Details</h4>
                          <div className="space-y-1 text-sm">
                            <p>Type: <span className="capitalize">{selectedAlert.alertType.replace('_', ' ')}</span></p>
                            <p>Severity: <span className="capitalize">{selectedAlert.severity}</span></p>
                          </div>
                        </div>
                      </div>
                      
                      {selectedAlert.redFlags.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2 text-red-600">Red Flag Indicators</h4>
                          <ul className="space-y-1">
                            {selectedAlert.redFlags.map((flag, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm text-red-600">
                                <AlertTriangle className="h-3 w-3" />
                                {flag}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-medium mb-2">Suspected Conditions</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedAlert.suspectedConditions.map((condition, index) => (
                            <Badge key={index} variant="outline" className="text-orange-600 border-orange-300">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Differential Workup Suggestions</h4>
                        <ul className="space-y-1">
                          {selectedAlert.differentialSuggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Search className="h-3 w-3 text-blue-500" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Recommended Actions</h4>
                        <ul className="space-y-1">
                          {selectedAlert.recommendedActions.map((action, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Clinical Evidence</h4>
                        <ul className="space-y-1">
                          {selectedAlert.clinicalEvidence.map((evidence, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                              <Brain className="h-3 w-3 text-purple-500" />
                              {evidence}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex gap-2">
                        {selectedAlert.severity === 'critical' || selectedAlert.severity === 'high' ? (
                          <Button size="sm" variant="destructive">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Urgent Review
                          </Button>
                        ) : (
                          <Button size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Review Case
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Users className="h-4 w-4 mr-1" />
                          Request Consultation
                        </Button>
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Reviewed
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a diagnostic alert to view detailed analysis and recommendations</p>
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
