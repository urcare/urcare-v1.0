
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  ArrowRight,
  Calculator,
  Target
} from 'lucide-react';

interface CostIntervention {
  id: string;
  patientName: string;
  procedure: string;
  currentCost: number;
  suggestedAlternative: string;
  alternativeCost: number;
  potentialSavings: number;
  riskLevel: 'low' | 'medium' | 'high';
  priority: 'urgent' | 'high' | 'normal';
  clinicalEquivalence: number;
  budgetImpact: string;
  evidenceLevel: string;
}

const mockInterventions: CostIntervention[] = [
  {
    id: 'CI001',
    patientName: 'John Smith',
    procedure: 'Cardiac Catheterization',
    currentCost: 15000,
    suggestedAlternative: 'CT Coronary Angiography + Stress Test',
    alternativeCost: 8500,
    potentialSavings: 6500,
    riskLevel: 'low',
    priority: 'high',
    clinicalEquivalence: 92,
    budgetImpact: 'High savings potential',
    evidenceLevel: 'Level A - Strong'
  },
  {
    id: 'CI002',
    patientName: 'Maria Garcia',
    procedure: 'MRI Brain with Contrast',
    currentCost: 3200,
    suggestedAlternative: 'CT Brain with Contrast',
    alternativeCost: 1800,
    potentialSavings: 1400,
    riskLevel: 'medium',
    priority: 'normal',
    clinicalEquivalence: 78,
    budgetImpact: 'Moderate savings',
    evidenceLevel: 'Level B - Moderate'
  }
];

export const CostInterventionDashboard = () => {
  const [interventions] = useState<CostIntervention[]>(mockInterventions);
  const [selectedIntervention, setSelectedIntervention] = useState<CostIntervention | null>(null);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'high': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const totalSavings = interventions.reduce((sum, intervention) => sum + intervention.potentialSavings, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Cost Intervention Dashboard
          </CardTitle>
          <CardDescription>
            High-cost procedure alerts with alternative treatment suggestions and budget impact analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">${totalSavings.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Potential Savings</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{interventions.length}</p>
                    <p className="text-sm text-gray-600">Active Alerts</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <Calculator className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">87%</p>
                    <p className="text-sm text-gray-600">Avg Equivalence</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Target className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">94%</p>
                    <p className="text-sm text-gray-600">Success Rate</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cost Intervention Opportunities</h3>
              {interventions.map((intervention) => (
                <Card 
                  key={intervention.id} 
                  className={`cursor-pointer transition-colors ${selectedIntervention?.id === intervention.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-green-400`}
                  onClick={() => setSelectedIntervention(intervention)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{intervention.patientName}</h4>
                        <p className="text-sm text-gray-600">{intervention.procedure}</p>
                        <p className="text-sm font-medium text-green-600">Save ${intervention.potentialSavings.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(intervention.priority)}>
                          {intervention.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getRiskColor(intervention.riskLevel)}>
                          {intervention.riskLevel.toUpperCase()} RISK
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Current: ${intervention.currentCost.toLocaleString()}</span>
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                        <span>Alternative: ${intervention.alternativeCost.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Clinical Equivalence</span>
                        <span className="text-sm font-bold text-blue-600">{intervention.clinicalEquivalence}%</span>
                      </div>
                      <Progress value={intervention.clinicalEquivalence} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedIntervention ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedIntervention.patientName} - Cost Analysis</CardTitle>
                    <CardDescription>{selectedIntervention.procedure}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Cost Breakdown</h4>
                          <div className="space-y-1 text-sm">
                            <p>Current Cost: <strong>${selectedIntervention.currentCost.toLocaleString()}</strong></p>
                            <p>Alternative Cost: <strong>${selectedIntervention.alternativeCost.toLocaleString()}</strong></p>
                            <p className="text-green-600">Savings: <strong>${selectedIntervention.potentialSavings.toLocaleString()}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Clinical Equivalence</h4>
                          <p className="text-2xl font-bold text-blue-600">{selectedIntervention.clinicalEquivalence}%</p>
                          <p className="text-sm text-gray-600">{selectedIntervention.evidenceLevel}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Suggested Alternative</h4>
                        <p className="text-sm bg-blue-50 p-3 rounded">{selectedIntervention.suggestedAlternative}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Budget Impact Analysis</h4>
                        <p className="text-sm">{selectedIntervention.budgetImpact}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Risk Assessment</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={getRiskColor(selectedIntervention.riskLevel)}>
                            {selectedIntervention.riskLevel.toUpperCase()} RISK
                          </Badge>
                          <span className="text-sm text-gray-600">Clinical risk evaluation</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve Alternative
                        </Button>
                        <Button variant="outline">
                          <Clock className="h-4 w-4 mr-1" />
                          Schedule Review
                        </Button>
                        <Button variant="outline">
                          <Calculator className="h-4 w-4 mr-1" />
                          Detailed Analysis
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a cost intervention to view detailed analysis</p>
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
