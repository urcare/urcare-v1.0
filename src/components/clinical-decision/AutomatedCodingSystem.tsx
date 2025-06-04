
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  DollarSign,
  AlertTriangle,
  BookOpen,
  Zap
} from 'lucide-react';

interface CodingSuggestion {
  id: string;
  patientName: string;
  visitType: string;
  clinicalNotes: string;
  suggestedICD: string[];
  suggestedCPT: string[];
  confidenceScore: number;
  estimatedReimbursement: number;
  documentationGaps: string[];
  complianceScore: number;
  billingOptimization: string[];
}

const mockCodingSuggestions: CodingSuggestion[] = [
  {
    id: 'CS001',
    patientName: 'Robert Martinez',
    visitType: 'Emergency Department',
    clinicalNotes: 'Patient presents with chest pain, elevated troponins, EKG changes consistent with NSTEMI...',
    suggestedICD: ['I21.4 - Non-ST elevation myocardial infarction', 'I25.10 - Atherosclerotic heart disease'],
    suggestedCPT: ['99284 - ED visit high complexity', '93000 - Electrocardiogram'],
    confidenceScore: 94,
    estimatedReimbursement: 1250,
    documentationGaps: [],
    complianceScore: 98,
    billingOptimization: ['Consider adding cardiac enzyme interpretation code']
  },
  {
    id: 'CS002',
    patientName: 'Lisa Thompson',
    visitType: 'Outpatient Consultation',
    clinicalNotes: 'Follow-up for diabetes management, A1C elevated, adjusting medication regimen...',
    suggestedICD: ['E11.9 - Type 2 diabetes without complications', 'Z79.4 - Long term use of insulin'],
    suggestedCPT: ['99213 - Office visit established patient', '83036 - Hemoglobin A1C'],
    confidenceScore: 87,
    estimatedReimbursement: 180,
    documentationGaps: ['Missing detailed medication review documentation'],
    complianceScore: 85,
    billingOptimization: ['Document time spent on care coordination', 'Add diabetic education code if provided']
  }
];

export const AutomatedCodingSystem = () => {
  const [codingSuggestions] = useState<CodingSuggestion[]>(mockCodingSuggestions);
  const [selectedSuggestion, setSelectedSuggestion] = useState<CodingSuggestion | null>(null);

  const getComplianceColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Automated Coding System
          </CardTitle>
          <CardDescription>
            AI-powered ICD/CPT code suggestions with documentation optimization and billing compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">156</p>
                    <p className="text-sm text-gray-600">Cases Coded Today</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">97.2%</p>
                    <p className="text-sm text-gray-600">Coding Accuracy</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">$45K</p>
                    <p className="text-sm text-gray-600">Revenue Optimized</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">68%</p>
                    <p className="text-sm text-gray-600">Time Saved</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Coding Suggestions</h3>
              {codingSuggestions.map((suggestion) => (
                <Card 
                  key={suggestion.id} 
                  className={`cursor-pointer transition-colors ${selectedSuggestion?.id === suggestion.id ? 'ring-2 ring-blue-500' : ''} border-l-4 ${suggestion.complianceScore >= 95 ? 'border-l-green-400' : suggestion.complianceScore >= 85 ? 'border-l-yellow-400' : 'border-l-red-400'}`}
                  onClick={() => setSelectedSuggestion(suggestion)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{suggestion.patientName}</h4>
                        <p className="text-sm text-gray-600">{suggestion.visitType}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">${suggestion.estimatedReimbursement}</Badge>
                        <p className={`text-xs font-medium mt-1 ${getComplianceColor(suggestion.complianceScore)}`}>
                          {suggestion.complianceScore}% Compliance
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">AI Confidence</span>
                        <span className="text-sm font-bold">{suggestion.confidenceScore}%</span>
                      </div>
                      <Progress value={suggestion.confidenceScore} className="h-2" />
                      
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3 text-blue-500" />
                          <span>{suggestion.suggestedICD.length} ICD codes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-purple-500" />
                          <span>{suggestion.suggestedCPT.length} CPT codes</span>
                        </div>
                        {suggestion.documentationGaps.length > 0 && (
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 text-orange-500" />
                            <span>{suggestion.documentationGaps.length} gaps</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedSuggestion ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedSuggestion.patientName} - Coding Analysis</CardTitle>
                    <CardDescription>{selectedSuggestion.visitType}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Revenue Impact</h4>
                          <div className="space-y-1 text-sm">
                            <p>Estimated: <strong>${selectedSuggestion.estimatedReimbursement}</strong></p>
                            <p>Confidence: {selectedSuggestion.confidenceScore}%</p>
                            <p>Compliance: <span className={getComplianceColor(selectedSuggestion.complianceScore)}>{selectedSuggestion.complianceScore}%</span></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Clinical Notes Preview</h4>
                          <p className="text-sm text-gray-600 line-clamp-3">{selectedSuggestion.clinicalNotes}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Suggested ICD-10 Codes</h4>
                        <div className="space-y-1">
                          {selectedSuggestion.suggestedICD.map((code, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span className="font-mono">{code}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Suggested CPT Codes</h4>
                        <div className="space-y-1">
                          {selectedSuggestion.suggestedCPT.map((code, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-blue-500" />
                              <span className="font-mono">{code}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {selectedSuggestion.documentationGaps.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2 text-orange-600">Documentation Gaps</h4>
                          <ul className="space-y-1">
                            {selectedSuggestion.documentationGaps.map((gap, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm text-orange-600">
                                <AlertTriangle className="h-3 w-3" />
                                {gap}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-medium mb-2">Billing Optimization</h4>
                        <ul className="space-y-1">
                          {selectedSuggestion.billingOptimization.map((opt, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-blue-600">
                              <DollarSign className="h-3 w-3" />
                              {opt}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Apply Codes
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Review Documentation
                        </Button>
                        <Button size="sm" variant="outline">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Optimize Billing
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a coding suggestion to view detailed analysis</p>
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
