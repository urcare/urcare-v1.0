
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Brain, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Clock,
  Star,
  Shield
} from 'lucide-react';

interface AIDecisionAudit {
  id: string;
  decisionType: string;
  aiModel: string;
  timestamp: string;
  patientId: string;
  patientName: string;
  input: string;
  output: string;
  confidenceScore: number;
  reasoning: string[];
  evidenceUsed: string[];
  humanOverride: boolean;
  outcomeTracking: string;
  qualityScore: number;
  biasDetection: string[];
  transparency: number;
  explainability: number;
}

const mockAudits: AIDecisionAudit[] = [
  {
    id: 'ADA001',
    decisionType: 'Treatment Recommendation',
    aiModel: 'ClinicalGPT-v2.1',
    timestamp: '2024-01-15 14:30:22',
    patientId: 'PT001',
    patientName: 'Sarah Johnson',
    input: 'Patient with chest pain, elevated troponin, ECG changes',
    output: 'Recommend immediate cardiac catheterization',
    confidenceScore: 94,
    reasoning: [
      'Elevated troponin indicates myocardial injury',
      'ECG shows ST-segment elevation',
      'Patient presentation consistent with STEMI',
      'Time-sensitive intervention required'
    ],
    evidenceUsed: [
      'ACC/AHA STEMI Guidelines 2023',
      'ESC Acute Coronary Syndrome Guidelines',
      'Institutional protocols for cardiac cath'
    ],
    humanOverride: false,
    outcomeTracking: 'Successful PCI performed, patient stable',
    qualityScore: 96,
    biasDetection: [],
    transparency: 92,
    explainability: 88
  },
  {
    id: 'ADA002',
    decisionType: 'Medication Dosing',
    aiModel: 'PharmAI-v3.0',
    timestamp: '2024-01-15 16:45:18',
    patientId: 'PT002',
    patientName: 'Michael Chen',
    input: 'Warfarin dosing for atrial fibrillation, CrCl 45, age 78',
    output: 'Start warfarin 2.5mg daily, check INR in 3 days',
    confidenceScore: 87,
    reasoning: [
      'Reduced kidney function requires dose adjustment',
      'Advanced age increases bleeding risk',
      'Target INR 2.0-3.0 for stroke prevention',
      'Conservative approach recommended'
    ],
    evidenceUsed: [
      'Warfarin dosing algorithms',
      'Renal adjustment guidelines',
      'Bleeding risk calculators (HAS-BLED)'
    ],
    humanOverride: true,
    outcomeTracking: 'Physician adjusted to 2mg daily',
    qualityScore: 89,
    biasDetection: ['Potential age bias detected in recommendation'],
    transparency: 85,
    explainability: 91
  }
];

export const AIDecisionAuditSystem = () => {
  const [audits] = useState<AIDecisionAudit[]>(mockAudits);
  const [selectedAudit, setSelectedAudit] = useState<AIDecisionAudit | null>(null);

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'bg-green-500 text-white';
    if (score >= 70) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };

  const averageQuality = audits.reduce((sum, audit) => sum + audit.qualityScore, 0) / audits.length;
  const averageTransparency = audits.reduce((sum, audit) => sum + audit.transparency, 0) / audits.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            AI Decision Audit System
          </CardTitle>
          <CardDescription>
            Transparency reports with reasoning explanations and quality assurance tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Star className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">{averageQuality.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Avg Quality Score</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{averageTransparency.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Transparency</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <Brain className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{audits.length}</p>
                    <p className="text-sm text-gray-600">AI Decisions</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">3</p>
                    <p className="text-sm text-gray-600">Bias Alerts</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">AI Decision Audit Trail</h3>
              {audits.map((audit) => (
                <Card 
                  key={audit.id} 
                  className={`cursor-pointer transition-colors ${selectedAudit?.id === audit.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-blue-400`}
                  onClick={() => setSelectedAudit(audit)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{audit.patientName}</h4>
                        <p className="text-sm text-gray-600">{audit.decisionType}</p>
                        <p className="text-sm font-medium text-blue-600">{audit.aiModel}</p>
                        <p className="text-xs text-gray-500">{audit.timestamp}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge className={getQualityColor(audit.qualityScore)}>
                          Quality: {audit.qualityScore}%
                        </Badge>
                        {audit.humanOverride && (
                          <Badge className="bg-orange-500 text-white">
                            Override
                          </Badge>
                        )}
                        {audit.biasDetection.length > 0 && (
                          <Badge className="bg-red-500 text-white">
                            Bias Alert
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Confidence Score</span>
                        <span className={`text-sm font-bold ${getConfidenceColor(audit.confidenceScore)}`}>
                          {audit.confidenceScore}%
                        </span>
                      </div>
                      <Progress value={audit.confidenceScore} className="h-2" />
                      
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Brain className="h-3 w-3 text-purple-500" />
                          <span>Transparency: {audit.transparency}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3 text-blue-500" />
                          <span>Explainable: {audit.explainability}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-green-500" />
                          <span>{audit.reasoning.length} steps</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedAudit ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedAudit.patientName} - Decision Audit</CardTitle>
                    <CardDescription>{selectedAudit.decisionType} by {selectedAudit.aiModel}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Decision Metrics</h4>
                          <div className="space-y-1 text-sm">
                            <p>Confidence: <strong className={getConfidenceColor(selectedAudit.confidenceScore)}>{selectedAudit.confidenceScore}%</strong></p>
                            <p>Quality Score: <strong>{selectedAudit.qualityScore}%</strong></p>
                            <p>Transparency: <strong>{selectedAudit.transparency}%</strong></p>
                            <p>Explainability: <strong>{selectedAudit.explainability}%</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Decision Details</h4>
                          <div className="space-y-1 text-sm">
                            <p>Model: <strong>{selectedAudit.aiModel}</strong></p>
                            <p>Timestamp: <strong>{selectedAudit.timestamp}</strong></p>
                            <p>Override: <strong>{selectedAudit.humanOverride ? 'Yes' : 'No'}</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Input Data</h4>
                        <p className="text-sm bg-gray-50 p-3 rounded">{selectedAudit.input}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">AI Output</h4>
                        <p className="text-sm bg-blue-50 p-3 rounded">{selectedAudit.output}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">AI Reasoning Steps</h4>
                        <ol className="space-y-1">
                          {selectedAudit.reasoning.map((step, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                                {index + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Evidence Sources</h4>
                        <ul className="space-y-1">
                          {selectedAudit.evidenceUsed.map((evidence, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <FileText className="h-3 w-3 text-green-500" />
                              {evidence}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {selectedAudit.biasDetection.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Bias Detection Alerts</h4>
                          <ul className="space-y-1">
                            {selectedAudit.biasDetection.map((bias, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <AlertTriangle className="h-3 w-3 text-red-500" />
                                {bias}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-medium mb-2">Outcome Tracking</h4>
                        <p className="text-sm bg-green-50 p-3 rounded">{selectedAudit.outcomeTracking}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve Decision
                        </Button>
                        <Button variant="outline">
                          <Search className="h-4 w-4 mr-1" />
                          Detailed Audit
                        </Button>
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Export Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select an AI decision to view detailed audit information</p>
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
