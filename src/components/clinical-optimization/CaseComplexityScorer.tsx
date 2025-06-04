
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Brain, 
  Clock, 
  AlertTriangle,
  Star,
  Activity,
  Shield,
  Target
} from 'lucide-react';

interface CaseComplexity {
  id: string;
  patientName: string;
  condition: string;
  complexityScore: number;
  complexityLevel: 'low' | 'moderate' | 'high' | 'critical';
  resourceRequirements: string[];
  staffingNeeds: string[];
  estimatedDuration: string;
  coordinationNeeds: string[];
  riskFactors: string[];
  specialtyConsults: string[];
  equipmentNeeds: string[];
  recommendedTeam: string[];
  urgencyLevel: 'routine' | 'urgent' | 'emergent';
}

const mockCases: CaseComplexity[] = [
  {
    id: 'CC001',
    patientName: 'Robert Wilson',
    condition: 'Multi-organ Trauma (Motor Vehicle Accident)',
    complexityScore: 95,
    complexityLevel: 'critical',
    resourceRequirements: ['ICU bed', 'OR availability', 'Blood bank', 'Imaging suite'],
    staffingNeeds: ['Trauma surgeon', 'Anesthesiologist', 'ICU nurses (2)', 'Respiratory therapist'],
    estimatedDuration: '6-12 hours',
    coordinationNeeds: ['Trauma team activation', 'OR coordination', 'Family communication'],
    riskFactors: ['Hemodynamic instability', 'Multiple injuries', 'Potential for complications'],
    specialtyConsults: ['Orthopedics', 'Neurosurgery', 'Vascular surgery'],
    equipmentNeeds: ['Ventilator', 'ECMO standby', 'Advanced monitoring'],
    recommendedTeam: ['Trauma surgeon', 'Anesthesiologist', 'ICU attending', 'Trauma coordinator'],
    urgencyLevel: 'emergent'
  },
  {
    id: 'CC002',
    patientName: 'Margaret Foster',
    condition: 'Complex Cardiac Surgery (Valve Replacement + CABG)',
    complexityScore: 78,
    complexityLevel: 'high',
    resourceRequirements: ['Cardiac OR', 'ICU bed', 'Perfusion services', 'Echo lab'],
    staffingNeeds: ['Cardiac surgeon', 'Perfusionist', 'Cardiac anesthesiologist', 'OR nurses (3)'],
    estimatedDuration: '4-6 hours',
    coordinationNeeds: ['Pre-op optimization', 'Post-op ICU care', 'Cardiac rehab planning'],
    riskFactors: ['Advanced age', 'Diabetes', 'Previous cardiac surgery'],
    specialtyConsults: ['Cardiology', 'Endocrinology'],
    equipmentNeeds: ['Heart-lung machine', 'TEE probe', 'IABP standby'],
    recommendedTeam: ['Cardiac surgeon', 'Anesthesiologist', 'Perfusionist', 'ICU team'],
    urgencyLevel: 'urgent'
  }
];

export const CaseComplexityScorer = () => {
  const [cases] = useState<CaseComplexity[]>(mockCases);
  const [selectedCase, setSelectedCase] = useState<CaseComplexity | null>(null);

  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'critical': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'routine': return 'bg-blue-500 text-white';
      case 'urgent': return 'bg-orange-500 text-white';
      case 'emergent': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-red-600';
    if (score >= 70) return 'text-orange-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const averageComplexity = cases.reduce((sum, case_) => sum + case_.complexityScore, 0) / cases.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Case Complexity Scorer
          </CardTitle>
          <CardDescription>
            Resource allocation recommendations with staffing suggestions and care coordination needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Brain className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{averageComplexity.toFixed(1)}</p>
                    <p className="text-sm text-gray-600">Avg Complexity</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{cases.length}</p>
                    <p className="text-sm text-gray-600">Active Cases</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <Star className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">92%</p>
                    <p className="text-sm text-gray-600">Resource Accuracy</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Target className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">87%</p>
                    <p className="text-sm text-gray-600">Care Coordination</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Case Complexity Analysis</h3>
              {cases.map((case_) => (
                <Card 
                  key={case_.id} 
                  className={`cursor-pointer transition-colors ${selectedCase?.id === case_.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-orange-400`}
                  onClick={() => setSelectedCase(case_)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{case_.patientName}</h4>
                        <p className="text-sm text-gray-600">{case_.condition}</p>
                        <p className="text-sm font-medium text-orange-600">Duration: {case_.estimatedDuration}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge className={getComplexityColor(case_.complexityLevel)}>
                          {case_.complexityLevel.toUpperCase()}
                        </Badge>
                        <Badge className={getUrgencyColor(case_.urgencyLevel)}>
                          {case_.urgencyLevel.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Complexity Score</span>
                        <span className={`text-sm font-bold ${getScoreColor(case_.complexityScore)}`}>
                          {case_.complexityScore}/100
                        </span>
                      </div>
                      <Progress value={case_.complexityScore} className="h-2" />
                      
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-blue-500" />
                          <span>{case_.staffingNeeds.length} staff</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3 text-purple-500" />
                          <span>{case_.specialtyConsults.length} consults</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-orange-500" />
                          <span>{case_.riskFactors.length} risks</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedCase ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedCase.patientName} - Complexity Analysis</CardTitle>
                    <CardDescription>{selectedCase.condition}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Complexity Metrics</h4>
                          <div className="space-y-1 text-sm">
                            <p>Score: <strong className={getScoreColor(selectedCase.complexityScore)}>{selectedCase.complexityScore}/100</strong></p>
                            <p>Level: <strong className="capitalize">{selectedCase.complexityLevel}</strong></p>
                            <p>Urgency: <strong className="capitalize">{selectedCase.urgencyLevel}</strong></p>
                            <p>Duration: <strong>{selectedCase.estimatedDuration}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Resource Planning</h4>
                          <div className="space-y-1 text-sm">
                            <p>Staff Needed: <strong>{selectedCase.staffingNeeds.length}</strong></p>
                            <p>Consultations: <strong>{selectedCase.specialtyConsults.length}</strong></p>
                            <p>Equipment: <strong>{selectedCase.equipmentNeeds.length}</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Staffing Requirements</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCase.staffingNeeds.map((staff, index) => (
                            <Badge key={index} variant="outline">{staff}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Resource Requirements</h4>
                        <ul className="space-y-1">
                          {selectedCase.resourceRequirements.map((resource, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Shield className="h-3 w-3 text-blue-500" />
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Specialty Consultations</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCase.specialtyConsults.map((consult, index) => (
                            <Badge key={index} className="bg-purple-500 text-white">{consult}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Equipment Needs</h4>
                        <ul className="space-y-1">
                          {selectedCase.equipmentNeeds.map((equipment, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Activity className="h-3 w-3 text-green-500" />
                              {equipment}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Risk Factors</h4>
                        <ul className="space-y-1">
                          {selectedCase.riskFactors.map((risk, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <AlertTriangle className="h-3 w-3 text-orange-500" />
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Coordination Needs</h4>
                        <ul className="space-y-1">
                          {selectedCase.coordinationNeeds.map((need, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Clock className="h-3 w-3 text-blue-500" />
                              {need}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <Users className="h-4 w-4 mr-1" />
                          Allocate Resources
                        </Button>
                        <Button variant="outline">
                          <Star className="h-4 w-4 mr-1" />
                          Assign Team
                        </Button>
                        <Button variant="outline">
                          <Clock className="h-4 w-4 mr-1" />
                          Schedule Case
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a case to view complexity analysis and resource recommendations</p>
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
