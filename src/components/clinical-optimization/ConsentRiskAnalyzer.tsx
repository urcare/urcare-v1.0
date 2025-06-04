
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  FileText, 
  Shield, 
  TrendingUp,
  Brain,
  Clock,
  CheckCircle,
  Users
} from 'lucide-react';

interface ConsentRiskAnalysis {
  id: string;
  patientName: string;
  procedure: string;
  overallRisk: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  majorComplications: ComplicationRisk[];
  minorComplications: ComplicationRisk[];
  patientFactors: string[];
  educationMaterials: string[];
  consentReadiness: number;
  informedDecisionScore: number;
  recommendedDiscussion: string[];
  alternativeOptions: string[];
}

interface ComplicationRisk {
  name: string;
  probability: number;
  severity: 'minor' | 'major' | 'life-threatening';
  description: string;
}

const mockAnalyses: ConsentRiskAnalysis[] = [
  {
    id: 'CRA001',
    patientName: 'Jennifer Adams',
    procedure: 'Laparoscopic Cholecystectomy',
    overallRisk: 15,
    riskLevel: 'low',
    majorComplications: [
      { name: 'Bile duct injury', probability: 0.3, severity: 'major', description: 'Injury to bile duct requiring repair' },
      { name: 'Bleeding requiring transfusion', probability: 0.5, severity: 'major', description: 'Significant bleeding needing blood transfusion' }
    ],
    minorComplications: [
      { name: 'Port site infection', probability: 2.0, severity: 'minor', description: 'Infection at trocar insertion sites' },
      { name: 'Nausea/vomiting', probability: 15.0, severity: 'minor', description: 'Post-operative nausea and vomiting' }
    ],
    patientFactors: ['Age 45', 'No significant comorbidities', 'Previous abdominal surgery'],
    educationMaterials: ['Laparoscopic surgery video', 'Post-op care instructions', 'Diet recommendations'],
    consentReadiness: 85,
    informedDecisionScore: 78,
    recommendedDiscussion: ['Benefits vs risks', 'Alternative treatments', 'Post-operative expectations'],
    alternativeOptions: ['Open cholecystectomy', 'Medical management', 'ERCP if indicated']
  },
  {
    id: 'CRA002',
    patientName: 'Thomas Rodriguez',
    procedure: 'Coronary Artery Bypass Graft (CABG)',
    overallRisk: 45,
    riskLevel: 'moderate',
    majorComplications: [
      { name: 'Stroke', probability: 2.0, severity: 'life-threatening', description: 'Neurological complications during surgery' },
      { name: 'Myocardial infarction', probability: 3.5, severity: 'life-threatening', description: 'Heart attack during or after surgery' },
      { name: 'Renal failure', probability: 1.8, severity: 'major', description: 'Kidney dysfunction requiring dialysis' }
    ],
    minorComplications: [
      { name: 'Atrial fibrillation', probability: 25.0, severity: 'minor', description: 'Irregular heart rhythm' },
      { name: 'Wound infection', probability: 8.0, severity: 'minor', description: 'Surgical site infection' }
    ],
    patientFactors: ['Age 67', 'Diabetes', 'Hypertension', 'Previous MI', 'Reduced EF'],
    educationMaterials: ['Heart surgery guide', 'Cardiac rehabilitation info', 'Risk factor modification'],
    consentReadiness: 72,
    informedDecisionScore: 68,
    recommendedDiscussion: ['Surgical vs medical therapy', 'Quality of life expectations', 'Long-term prognosis'],
    alternativeOptions: ['PCI with stenting', 'Optimal medical therapy', 'Hybrid revascularization']
  }
];

export const ConsentRiskAnalyzer = () => {
  const [analyses] = useState<ConsentRiskAnalysis[]>(mockAnalyses);
  const [selectedAnalysis, setSelectedAnalysis] = useState<ConsentRiskAnalysis | null>(null);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'very-high': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'text-green-600';
      case 'major': return 'text-orange-600';
      case 'life-threatening': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getReadinessColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const averageRisk = analyses.reduce((sum, analysis) => sum + analysis.overallRisk, 0) / analyses.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Consent Risk Analyzer
          </CardTitle>
          <CardDescription>
            Complication probability summaries with patient education tools and informed decision support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{averageRisk.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Avg Risk Level</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{analyses.length}</p>
                    <p className="text-sm text-gray-600">Active Consents</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <Brain className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">89%</p>
                    <p className="text-sm text-gray-600">Decision Support</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Shield className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">94%</p>
                    <p className="text-sm text-gray-600">Risk Accuracy</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Consent Risk Analyses</h3>
              {analyses.map((analysis) => (
                <Card 
                  key={analysis.id} 
                  className={`cursor-pointer transition-colors ${selectedAnalysis?.id === analysis.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-orange-400`}
                  onClick={() => setSelectedAnalysis(analysis)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{analysis.patientName}</h4>
                        <p className="text-sm text-gray-600">{analysis.procedure}</p>
                        <p className="text-sm font-medium text-orange-600">Overall Risk: {analysis.overallRisk}%</p>
                      </div>
                      <Badge className={getRiskColor(analysis.riskLevel)}>
                        {analysis.riskLevel.toUpperCase().replace('-', ' ')} RISK
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Consent Readiness</span>
                        <span className={`text-sm font-bold ${getReadinessColor(analysis.consentReadiness)}`}>
                          {analysis.consentReadiness}%
                        </span>
                      </div>
                      <Progress value={analysis.consentReadiness} className="h-2" />
                      
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                          <span>{analysis.majorComplications.length} major</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-yellow-500" />
                          <span>{analysis.minorComplications.length} minor</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3 text-blue-500" />
                          <span>{analysis.educationMaterials.length} materials</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedAnalysis ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedAnalysis.patientName} - Risk Analysis</CardTitle>
                    <CardDescription>{selectedAnalysis.procedure}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Risk Assessment</h4>
                          <div className="space-y-1 text-sm">
                            <p>Overall Risk: <strong>{selectedAnalysis.overallRisk}%</strong></p>
                            <p>Risk Level: <strong className="capitalize">{selectedAnalysis.riskLevel.replace('-', ' ')}</strong></p>
                            <p>Consent Readiness: <strong className={getReadinessColor(selectedAnalysis.consentReadiness)}>{selectedAnalysis.consentReadiness}%</strong></p>
                            <p>Decision Score: <strong>{selectedAnalysis.informedDecisionScore}%</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Complication Summary</h4>
                          <div className="space-y-1 text-sm">
                            <p>Major Complications: <strong>{selectedAnalysis.majorComplications.length}</strong></p>
                            <p>Minor Complications: <strong>{selectedAnalysis.minorComplications.length}</strong></p>
                            <p>Patient Factors: <strong>{selectedAnalysis.patientFactors.length}</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Major Complications</h4>
                        <div className="space-y-2">
                          {selectedAnalysis.majorComplications.map((comp, index) => (
                            <div key={index} className="bg-red-50 p-3 rounded">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-sm">{comp.name}</span>
                                <Badge className={`${getSeverityColor(comp.severity)} bg-transparent border`}>
                                  {comp.probability}%
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600">{comp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Minor Complications</h4>
                        <div className="space-y-2">
                          {selectedAnalysis.minorComplications.map((comp, index) => (
                            <div key={index} className="bg-yellow-50 p-3 rounded">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-sm">{comp.name}</span>
                                <Badge className={`${getSeverityColor(comp.severity)} bg-transparent border`}>
                                  {comp.probability}%
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600">{comp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Patient Factors</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedAnalysis.patientFactors.map((factor, index) => (
                            <Badge key={index} variant="outline">{factor}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Education Materials</h4>
                        <ul className="space-y-1">
                          {selectedAnalysis.educationMaterials.map((material, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <FileText className="h-3 w-3 text-blue-500" />
                              {material}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Recommended Discussion Points</h4>
                        <ul className="space-y-1">
                          {selectedAnalysis.recommendedDiscussion.map((point, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Alternative Options</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedAnalysis.alternativeOptions.map((option, index) => (
                            <Badge key={index} className="bg-purple-500 text-white">{option}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <FileText className="h-4 w-4 mr-1" />
                          Generate Consent
                        </Button>
                        <Button variant="outline">
                          <Users className="h-4 w-4 mr-1" />
                          Patient Education
                        </Button>
                        <Button variant="outline">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Update Risk
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a consent analysis to view detailed risk assessment</p>
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
