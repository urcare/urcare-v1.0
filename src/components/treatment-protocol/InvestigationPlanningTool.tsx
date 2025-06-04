
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  TrendingUp, 
  DollarSign, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  Activity
} from 'lucide-react';

interface InvestigationPlan {
  id: string;
  patientName: string;
  clinicalQuestion: string;
  currentPhase: string;
  totalPhases: number;
  estimatedCost: number;
  estimatedDuration: string;
  priority: 'urgent' | 'high' | 'routine';
  diagnosticWorkflow: string[];
  completedTests: string[];
  pendingTests: string[];
  resourceOptimization: string;
  clinicalDecisionPoints: string[];
  expectedOutcomes: string[];
}

const mockPlans: InvestigationPlan[] = [
  {
    id: 'IP001',
    patientName: 'Jennifer Martinez',
    clinicalQuestion: 'Evaluate suspected autoimmune disorder with joint pain and fatigue',
    currentPhase: 'Phase 2: Autoimmune Panel',
    totalPhases: 4,
    estimatedCost: 2450,
    estimatedDuration: '2-3 weeks',
    priority: 'high',
    diagnosticWorkflow: [
      'Basic Lab Panel (CBC, CMP, ESR, CRP)',
      'Autoimmune Panel (ANA, RF, Anti-CCP)',
      'Imaging Studies (Joint X-rays, possible MRI)',
      'Specialist Consultation (Rheumatology)'
    ],
    completedTests: ['CBC with differential', 'Comprehensive metabolic panel', 'ESR, CRP'],
    pendingTests: ['ANA with pattern', 'Rheumatoid factor', 'Anti-CCP antibodies'],
    resourceOptimization: 'Bundle autoimmune tests to reduce cost by 15%',
    clinicalDecisionPoints: [
      'If ANA positive: proceed to specific autoantibody panel',
      'If inflammatory markers elevated: consider imaging',
      'If joint involvement: rheumatology referral'
    ],
    expectedOutcomes: [
      'Definitive diagnosis in 85% of cases',
      'Treatment plan initiation within 4 weeks',
      'Cost savings of $300 through bundled testing'
    ]
  },
  {
    id: 'IP002',
    patientName: 'Robert Chen',
    clinicalQuestion: 'Investigate abnormal liver enzymes in asymptomatic patient',
    currentPhase: 'Phase 1: Initial Assessment',
    totalPhases: 3,
    estimatedCost: 1850,
    estimatedDuration: '1-2 weeks',
    priority: 'routine',
    diagnosticWorkflow: [
      'Viral Hepatitis Panel (HBV, HCV, HAV)',
      'Metabolic Assessment (Iron studies, Alpha-1 antitrypsin)',
      'Imaging (Abdominal ultrasound)'
    ],
    completedTests: ['Repeat LFTs', 'Medication review'],
    pendingTests: ['Hepatitis B surface antigen', 'Hepatitis C antibody', 'Iron studies'],
    resourceOptimization: 'Order ultrasound only if initial labs suggest structural cause',
    clinicalDecisionPoints: [
      'If viral markers negative: proceed to metabolic causes',
      'If ultrasound normal and labs improve: monitoring approach',
      'If progressive elevation: consider liver biopsy'
    ],
    expectedOutcomes: [
      'Identify cause in 75% of cases',
      'Avoid unnecessary invasive procedures',
      'Cost-effective diagnostic approach'
    ]
  }
];

export const InvestigationPlanningTool = () => {
  const [plans] = useState<InvestigationPlan[]>(mockPlans);
  const [selectedPlan, setSelectedPlan] = useState<InvestigationPlan | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'routine': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPhaseProgress = (currentPhase: string, totalPhases: number) => {
    const phaseNumber = parseInt(currentPhase.match(/\d+/)?.[0] || '1');
    return (phaseNumber / totalPhases) * 100;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Investigation Planning Tool
          </CardTitle>
          <CardDescription>
            Diagnostic workflows with test sequencing and resource optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Search className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">45</p>
                    <p className="text-sm text-gray-600">Active Plans</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">$18K</p>
                    <p className="text-sm text-gray-600">Cost Savings</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">2.1w</p>
                    <p className="text-sm text-gray-600">Avg. Duration</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Target className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">87%</p>
                    <p className="text-sm text-gray-600">Diagnostic Yield</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Investigation Plans</h3>
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`cursor-pointer transition-colors ${selectedPlan?.id === plan.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-blue-400`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{plan.patientName}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{plan.clinicalQuestion}</p>
                        <p className="text-xs text-gray-500">{plan.currentPhase}</p>
                      </div>
                      <Badge className={getPriorityColor(plan.priority)}>
                        {plan.priority.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm font-bold">
                          {plan.currentPhase.match(/\d+/)?.[0] || '1'}/{plan.totalPhases}
                        </span>
                      </div>
                      <Progress value={getPhaseProgress(plan.currentPhase, plan.totalPhases)} className="h-2" />
                      
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-green-500" />
                          <span>${plan.estimatedCost}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-blue-500" />
                          <span>{plan.estimatedDuration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-purple-500" />
                          <span>{plan.completedTests.length} done</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedPlan ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedPlan.patientName} - Investigation Plan</CardTitle>
                    <CardDescription>{selectedPlan.clinicalQuestion}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Plan Overview</h4>
                          <div className="space-y-1 text-sm">
                            <p>Phase: <strong>{selectedPlan.currentPhase}</strong></p>
                            <p>Duration: {selectedPlan.estimatedDuration}</p>
                            <p>Cost: <span className="text-green-600">${selectedPlan.estimatedCost}</span></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Progress</h4>
                          <p className="text-2xl font-bold text-blue-600">
                            {Math.round(getPhaseProgress(selectedPlan.currentPhase, selectedPlan.totalPhases))}%
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Diagnostic Workflow</h4>
                        <ul className="space-y-1">
                          {selectedPlan.diagnosticWorkflow.map((step, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                index < parseInt(selectedPlan.currentPhase.match(/\d+/)?.[0] || '1') 
                                  ? 'bg-green-500 text-white' 
                                  : index === parseInt(selectedPlan.currentPhase.match(/\d+/)?.[0] || '1') - 1
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-200'
                              }`}>
                                {index + 1}
                              </div>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Completed Tests</h4>
                        <ul className="space-y-1">
                          {selectedPlan.completedTests.map((test, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {test}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Pending Tests</h4>
                        <ul className="space-y-1">
                          {selectedPlan.pendingTests.map((test, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Clock className="h-3 w-3 text-blue-500" />
                              {test}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Resource Optimization</h4>
                        <div className="bg-green-50 p-3 rounded text-sm">
                          <TrendingUp className="h-4 w-4 inline mr-2 text-green-600" />
                          {selectedPlan.resourceOptimization}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Clinical Decision Points</h4>
                        <ul className="space-y-1">
                          {selectedPlan.clinicalDecisionPoints.map((point, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Target className="h-3 w-3 text-orange-500" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Expected Outcomes</h4>
                        <ul className="space-y-1">
                          {selectedPlan.expectedOutcomes.map((outcome, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Activity className="h-3 w-3 text-purple-500" />
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <Search className="h-4 w-4 mr-1" />
                          Execute Next Phase
                        </Button>
                        <Button variant="outline">
                          <Clock className="h-4 w-4 mr-1" />
                          Modify Timeline
                        </Button>
                        <Button variant="outline">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Cost Analysis
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select an investigation plan to view details</p>
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
