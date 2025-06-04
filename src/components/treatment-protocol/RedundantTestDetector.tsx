
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ShieldCheck, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  TrendingDown,
  Target,
  Activity
} from 'lucide-react';

interface RedundantTest {
  id: string;
  patientName: string;
  duplicateTest: string;
  originalTest: string;
  originalDate: string;
  proposedDate: string;
  costSaving: number;
  clinicalNecessity: 'unnecessary' | 'questionable' | 'justified';
  alternatives: string[];
  timeInterval: string;
  department: string;
  orderingPhysician: string;
  reason: string;
  recommendations: string[];
}

const mockRedundantTests: RedundantTest[] = [
  {
    id: 'RT001',
    patientName: 'Amanda Foster',
    duplicateTest: 'Complete Blood Count (CBC)',
    originalTest: 'CBC with differential',
    originalDate: '2024-01-10',
    proposedDate: '2024-01-12',
    costSaving: 45,
    clinicalNecessity: 'unnecessary',
    alternatives: ['Review previous CBC results', 'Order only if clinical change'],
    timeInterval: '2 days',
    department: 'Internal Medicine',
    orderingPhysician: 'Dr. Smith',
    reason: 'Routine pre-procedure workup',
    recommendations: [
      'Cancel duplicate order',
      'Use existing CBC results',
      'Set up automated alerts for similar tests'
    ]
  },
  {
    id: 'RT002',
    patientName: 'James Wilson',
    duplicateTest: 'Chest X-ray',
    originalTest: 'Chest X-ray (2-view)',
    originalDate: '2024-01-14',
    proposedDate: '2024-01-15',
    costSaving: 120,
    clinicalNecessity: 'questionable',
    alternatives: ['Clinical assessment', 'Review existing imaging'],
    timeInterval: '1 day',
    department: 'Emergency Medicine',
    orderingPhysician: 'Dr. Johnson',
    reason: 'Follow-up chest pain evaluation',
    recommendations: [
      'Consider clinical correlation',
      'Defer if patient stable',
      'Consult radiologist for interpretation'
    ]
  },
  {
    id: 'RT003',
    patientName: 'Lisa Chen',
    duplicateTest: 'Lipid Panel',
    originalTest: 'Comprehensive Metabolic Panel + Lipids',
    originalDate: '2024-01-08',
    proposedDate: '2024-01-16',
    costSaving: 85,
    clinicalNecessity: 'justified',
    alternatives: ['Monitor current medications', 'Lifestyle modifications'],
    timeInterval: '8 days',
    department: 'Cardiology',
    orderingPhysician: 'Dr. Davis',
    reason: 'Medication adjustment follow-up',
    recommendations: [
      'Proceed with test - medication change justifies recheck',
      'Consider 2-week interval for future monitoring',
      'Patient education on lipid management'
    ]
  }
];

export const RedundantTestDetector = () => {
  const [redundantTests] = useState<RedundantTest[]>(mockRedundantTests);
  const [selectedTest, setSelectedTest] = useState<RedundantTest | null>(null);

  const getNecessityColor = (necessity: string) => {
    switch (necessity) {
      case 'unnecessary': return 'bg-red-500 text-white';
      case 'questionable': return 'bg-yellow-500 text-white';
      case 'justified': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTotalSavings = () => {
    return redundantTests.reduce((total, test) => total + test.costSaving, 0);
  };

  const getUnnecessaryCount = () => {
    return redundantTests.filter(test => test.clinicalNecessity === 'unnecessary').length;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Redundant Test Detector
          </CardTitle>
          <CardDescription>
            Cost analysis with clinical necessity evaluation and alternative suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">{getUnnecessaryCount()}</p>
                    <p className="text-sm text-gray-600">Unnecessary Tests</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">${getTotalSavings()}</p>
                    <p className="text-sm text-gray-600">Potential Savings</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">89%</p>
                    <p className="text-sm text-gray-600">Detection Accuracy</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">23%</p>
                    <p className="text-sm text-gray-600">Cost Reduction</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Detected Redundant Tests</h3>
              {redundantTests.map((test) => (
                <Card 
                  key={test.id} 
                  className={`cursor-pointer transition-colors ${selectedTest?.id === test.id ? 'ring-2 ring-blue-500' : ''} border-l-4 ${test.clinicalNecessity === 'unnecessary' ? 'border-l-red-500' : test.clinicalNecessity === 'questionable' ? 'border-l-yellow-400' : 'border-l-green-400'}`}
                  onClick={() => setSelectedTest(test)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{test.patientName}</h4>
                        <p className="text-sm text-gray-600">{test.duplicateTest}</p>
                        <p className="text-xs text-gray-500">Interval: {test.timeInterval}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getNecessityColor(test.clinicalNecessity)}>
                          {test.clinicalNecessity.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Potential Savings</span>
                        <span className="text-sm font-bold text-green-600">${test.costSaving}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-blue-500" />
                          <span>Original: {test.originalDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3 text-purple-500" />
                          <span>{test.department}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3 text-orange-500" />
                          <span>{test.alternatives.length} alternatives</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedTest ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedTest.patientName} - Redundant Test Analysis</CardTitle>
                    <CardDescription>{selectedTest.duplicateTest}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Test Comparison</h4>
                          <div className="space-y-1 text-sm">
                            <p>Original: <strong>{selectedTest.originalTest}</strong></p>
                            <p>Date: {selectedTest.originalDate}</p>
                            <p>Proposed: <strong>{selectedTest.duplicateTest}</strong></p>
                            <p>Date: {selectedTest.proposedDate}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Cost Analysis</h4>
                          <p className="text-2xl font-bold text-green-600">${selectedTest.costSaving}</p>
                          <p className="text-sm text-gray-500">Potential savings</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Clinical Details</h4>
                          <div className="space-y-1 text-sm">
                            <p>Department: {selectedTest.department}</p>
                            <p>Physician: {selectedTest.orderingPhysician}</p>
                            <p>Time Interval: {selectedTest.timeInterval}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Clinical Necessity</h4>
                          <Badge className={getNecessityColor(selectedTest.clinicalNecessity)}>
                            {selectedTest.clinicalNecessity.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Reason for Test</h4>
                        <p className="text-sm bg-gray-50 p-2 rounded">{selectedTest.reason}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Alternative Approaches</h4>
                        <ul className="space-y-1">
                          {selectedTest.alternatives.map((alternative, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Target className="h-3 w-3 text-blue-500" />
                              {alternative}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">AI Recommendations</h4>
                        <ul className="space-y-1">
                          {selectedTest.recommendations.map((recommendation, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {recommendation}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex gap-2">
                        {selectedTest.clinicalNecessity === 'unnecessary' ? (
                          <Button>
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Cancel Test
                          </Button>
                        ) : selectedTest.clinicalNecessity === 'questionable' ? (
                          <Button variant="outline">
                            <Clock className="h-4 w-4 mr-1" />
                            Defer Test
                          </Button>
                        ) : (
                          <Button>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve Test
                          </Button>
                        )}
                        <Button variant="outline">
                          <Target className="h-4 w-4 mr-1" />
                          Alternative Plan
                        </Button>
                        <Button variant="outline">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Cost Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a redundant test detection to view analysis</p>
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
