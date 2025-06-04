
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TestTube, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Award
} from 'lucide-react';

interface TestRecommendation {
  id: string;
  patientName: string;
  clinicalScenario: string;
  recommendedTests: {
    name: string;
    priority: 'urgent' | 'routine' | 'optional';
    cost: number;
    expectedTurnaround: string;
    clinicalValue: number;
  }[];
  evidenceLevel: string;
  costEffectiveness: number;
  guidelines: string[];
  alternativeApproaches: string[];
  expectedOutcomes: string[];
}

const mockTestRecommendations: TestRecommendation[] = [
  {
    id: 'TR001',
    patientName: 'Jennifer Davis',
    clinicalScenario: 'Suspected acute coronary syndrome, chest pain 6 hours',
    recommendedTests: [
      {
        name: 'Troponin I (serial)',
        priority: 'urgent',
        cost: 45,
        expectedTurnaround: '1 hour',
        clinicalValue: 95
      },
      {
        name: '12-lead ECG',
        priority: 'urgent',
        cost: 25,
        expectedTurnaround: '15 minutes',
        clinicalValue: 90
      },
      {
        name: 'D-dimer',
        priority: 'routine',
        cost: 35,
        expectedTurnaround: '2 hours',
        clinicalValue: 70
      }
    ],
    evidenceLevel: 'Level I (Strong evidence)',
    costEffectiveness: 88,
    guidelines: ['ACC/AHA Chest Pain Guidelines', 'ESC NSTEMI Guidelines'],
    alternativeApproaches: ['CT coronary angiography', 'Stress testing (if stable)'],
    expectedOutcomes: ['Rule out MI in 99% of cases', 'Early risk stratification', 'Reduce length of stay']
  }
];

export const DiagnosticTestRecommender = () => {
  const [testRecommendations] = useState<TestRecommendation[]>(mockTestRecommendations);
  const [selectedRecommendation, setSelectedRecommendation] = useState<TestRecommendation | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'routine': return 'bg-yellow-500 text-white';
      case 'optional': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCostEffectivenessColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Diagnostic Test Recommender
          </CardTitle>
          <CardDescription>
            Evidence-based test recommendations with cost-effectiveness analysis and clinical guidelines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <TestTube className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">89</p>
                    <p className="text-sm text-gray-600">Tests Ordered Today</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">94.2%</p>
                    <p className="text-sm text-gray-600">Diagnostic Yield</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">$12K</p>
                    <p className="text-sm text-gray-600">Cost Savings</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">2.3h</p>
                    <p className="text-sm text-gray-600">Avg. Decision Time</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Recommendations</h3>
              {testRecommendations.map((recommendation) => (
                <Card 
                  key={recommendation.id} 
                  className={`cursor-pointer transition-colors ${selectedRecommendation?.id === recommendation.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-blue-400`}
                  onClick={() => setSelectedRecommendation(recommendation)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{recommendation.patientName}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{recommendation.clinicalScenario}</p>
                      </div>
                      <Badge variant="outline">{recommendation.evidenceLevel}</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Cost-Effectiveness</span>
                        <span className={`text-sm font-bold ${getCostEffectivenessColor(recommendation.costEffectiveness)}`}>
                          {recommendation.costEffectiveness}%
                        </span>
                      </div>
                      <Progress value={recommendation.costEffectiveness} className="h-2" />
                      
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <TestTube className="h-3 w-3 text-blue-500" />
                          <span>{recommendation.recommendedTests.length} tests</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-green-500" />
                          <span>${recommendation.recommendedTests.reduce((sum, test) => sum + test.cost, 0)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3 text-purple-500" />
                          <span>{recommendation.guidelines.length} guidelines</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedRecommendation ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedRecommendation.patientName} - Test Recommendations</CardTitle>
                    <CardDescription>{selectedRecommendation.clinicalScenario}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Evidence Assessment</h4>
                          <div className="space-y-1 text-sm">
                            <p>Level: <strong>{selectedRecommendation.evidenceLevel}</strong></p>
                            <p>Cost-Effectiveness: <span className={getCostEffectivenessColor(selectedRecommendation.costEffectiveness)}>{selectedRecommendation.costEffectiveness}%</span></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Total Cost</h4>
                          <p className="text-2xl font-bold text-green-600">
                            ${selectedRecommendation.recommendedTests.reduce((sum, test) => sum + test.cost, 0)}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Recommended Tests</h4>
                        <div className="space-y-2">
                          {selectedRecommendation.recommendedTests.map((test, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center gap-2">
                                <Badge className={getPriorityColor(test.priority)} size="sm">
                                  {test.priority.toUpperCase()}
                                </Badge>
                                <span className="font-medium">{test.name}</span>
                              </div>
                              <div className="text-right text-sm">
                                <p className="font-semibold">${test.cost}</p>
                                <p className="text-gray-600">{test.expectedTurnaround}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Clinical Guidelines</h4>
                        <ul className="space-y-1">
                          {selectedRecommendation.guidelines.map((guideline, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Award className="h-3 w-3 text-blue-500" />
                              {guideline}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Expected Outcomes</h4>
                        <ul className="space-y-1">
                          {selectedRecommendation.expectedOutcomes.map((outcome, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Alternative Approaches</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedRecommendation.alternativeApproaches.map((alt, index) => (
                            <Badge key={index} variant="outline">{alt}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm">
                          <TestTube className="h-4 w-4 mr-1" />
                          Order Tests
                        </Button>
                        <Button size="sm" variant="outline">
                          <Clock className="h-4 w-4 mr-1" />
                          Schedule Later
                        </Button>
                        <Button size="sm" variant="outline">
                          <BookOpen className="h-4 w-4 mr-1" />
                          View Guidelines
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a test recommendation to view detailed analysis</p>
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
