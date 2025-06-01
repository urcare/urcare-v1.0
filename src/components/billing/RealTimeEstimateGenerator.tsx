
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calculator, 
  Heart, 
  Activity,
  Clock,
  DollarSign,
  Shield,
  Zap,
  TrendingUp
} from 'lucide-react';

interface ProcedureComponent {
  name: string;
  baseAmount: number;
  isRequired: boolean;
  complexityMultiplier?: number;
}

interface InsurancePlan {
  name: string;
  coverage: number;
  copay: number;
  deductible: number;
}

interface EstimateRequest {
  procedure: string;
  patientCategory: string;
  insurancePlan?: string;
  complexity: 'Standard' | 'Moderate' | 'High';
  urgency: 'Routine' | 'Urgent' | 'Emergency';
}

export const RealTimeEstimateGenerator = () => {
  const [estimateRequest, setEstimateRequest] = useState<EstimateRequest>({
    procedure: '',
    patientCategory: 'General',
    complexity: 'Standard',
    urgency: 'Routine'
  });

  const procedures = [
    {
      name: 'Cardiac Catheterization',
      components: [
        { name: 'Base Procedure', baseAmount: 3500.00, isRequired: true },
        { name: 'Anesthesia', baseAmount: 500.00, isRequired: true },
        { name: 'ICU (1 day)', baseAmount: 800.00, isRequired: true },
        { name: 'Medications', baseAmount: 300.00, isRequired: true },
        { name: 'Consumables', baseAmount: 400.00, isRequired: true }
      ]
    },
    {
      name: 'Appendectomy',
      components: [
        { name: 'Surgery', baseAmount: 2500.00, isRequired: true },
        { name: 'Anesthesia', baseAmount: 400.00, isRequired: true },
        { name: 'Room (2 days)', baseAmount: 600.00, isRequired: true },
        { name: 'Medications', baseAmount: 200.00, isRequired: true },
        { name: 'Lab Tests', baseAmount: 150.00, isRequired: true }
      ]
    }
  ];

  const insurancePlans: InsurancePlan[] = [
    { name: 'Premium Health Plus', coverage: 0.9, copay: 100, deductible: 500 },
    { name: 'Standard Health', coverage: 0.8, copay: 200, deductible: 1000 },
    { name: 'Basic Coverage', coverage: 0.7, copay: 300, deductible: 1500 },
    { name: 'Government Scheme', coverage: 0.6, copay: 0, deductible: 0 }
  ];

  const complexityMultipliers = {
    'Standard': 1.0,
    'Moderate': 1.3,
    'High': 1.6
  };

  const urgencyMultipliers = {
    'Routine': 1.0,
    'Urgent': 1.2,
    'Emergency': 1.5
  };

  const patientCategoryDiscounts = {
    'General': 0,
    'Senior Citizen': 0.1,
    'Employee': 0.5,
    'Corporate': 0.15
  };

  const calculateEstimate = () => {
    const selectedProcedure = procedures.find(p => p.name === estimateRequest.procedure);
    if (!selectedProcedure) return null;

    const baseTotal = selectedProcedure.components.reduce((sum, comp) => sum + comp.baseAmount, 0);
    const complexityAdjusted = baseTotal * complexityMultipliers[estimateRequest.complexity];
    const urgencyAdjusted = complexityAdjusted * urgencyMultipliers[estimateRequest.urgency];
    const categoryDiscount = urgencyAdjusted * (patientCategoryDiscounts[estimateRequest.patientCategory as keyof typeof patientCategoryDiscounts] || 0);
    const finalAmount = urgencyAdjusted - categoryDiscount;

    let insuranceCoverage = 0;
    let patientResponsibility = finalAmount;

    if (estimateRequest.insurancePlan) {
      const plan = insurancePlans.find(p => p.name === estimateRequest.insurancePlan);
      if (plan) {
        const amountAfterDeductible = Math.max(0, finalAmount - plan.deductible);
        insuranceCoverage = amountAfterDeductible * plan.coverage;
        patientResponsibility = finalAmount - insuranceCoverage + plan.copay;
      }
    }

    return {
      components: selectedProcedure.components,
      baseTotal,
      complexityAdjustment: complexityAdjusted - baseTotal,
      urgencyAdjustment: urgencyAdjusted - complexityAdjusted,
      categoryDiscount,
      finalAmount,
      insuranceCoverage,
      patientResponsibility
    };
  };

  const estimate = calculateEstimate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Real-time Estimate Generator</h2>
          <p className="text-gray-600">Comprehensive procedure cost estimation with insurance integration</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Calculator className="w-4 h-4 mr-2" />
          Save Estimate
        </Button>
      </div>

      {/* Estimate Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Estimate Configuration</CardTitle>
          <CardDescription>Configure parameters for accurate cost estimation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Procedure</label>
              <Select value={estimateRequest.procedure} onValueChange={(value) => 
                setEstimateRequest(prev => ({ ...prev, procedure: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select procedure" />
                </SelectTrigger>
                <SelectContent>
                  {procedures.map(proc => (
                    <SelectItem key={proc.name} value={proc.name}>{proc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Patient Category</label>
              <Select value={estimateRequest.patientCategory} onValueChange={(value) => 
                setEstimateRequest(prev => ({ ...prev, patientCategory: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Senior Citizen">Senior Citizen</SelectItem>
                  <SelectItem value="Employee">Employee</SelectItem>
                  <SelectItem value="Corporate">Corporate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Complexity</label>
              <Select value={estimateRequest.complexity} onValueChange={(value: any) => 
                setEstimateRequest(prev => ({ ...prev, complexity: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Urgency</label>
              <Select value={estimateRequest.urgency} onValueChange={(value: any) => 
                setEstimateRequest(prev => ({ ...prev, urgency: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Routine">Routine</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Insurance Plan</label>
              <Select value={estimateRequest.insurancePlan} onValueChange={(value) => 
                setEstimateRequest(prev => ({ ...prev, insurancePlan: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  {insurancePlans.map(plan => (
                    <SelectItem key={plan.name} value={plan.name}>{plan.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estimate Results */}
      {estimate && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                {estimateRequest.procedure} - Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {estimate.components.map((component, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm">{component.name}</span>
                    <span className="font-medium">${component.baseAmount.toFixed(2)}</span>
                  </div>
                ))}
                
                <div className="pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Base Total:</span>
                    <span>${estimate.baseTotal.toFixed(2)}</span>
                  </div>
                  
                  {estimate.complexityAdjustment > 0 && (
                    <div className="flex justify-between text-sm text-amber-600">
                      <span>Complexity Adjustment:</span>
                      <span>+${estimate.complexityAdjustment.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {estimate.urgencyAdjustment > 0 && (
                    <div className="flex justify-between text-sm text-orange-600">
                      <span>Urgency Surcharge:</span>
                      <span>+${estimate.urgencyAdjustment.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {estimate.categoryDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Category Discount:</span>
                      <span>-${estimate.categoryDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total Estimate:</span>
                    <span>${estimate.finalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insurance & Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Insurance & Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {estimateRequest.insurancePlan && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">{estimateRequest.insurancePlan}</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Coverage:</span>
                        <span>{(insurancePlans.find(p => p.name === estimateRequest.insurancePlan)?.coverage || 0) * 100}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Insurance Pays:</span>
                        <span className="font-medium text-green-600">${estimate.insuranceCoverage.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Patient Responsibility</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {estimateRequest.patientCategory}
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">
                    ${estimate.patientResponsibility.toFixed(2)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Savings</p>
                    <p className="text-lg font-semibold text-green-600">
                      ${(estimate.categoryDiscount + estimate.insuranceCoverage).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Processing Fee</p>
                    <p className="text-lg font-semibold text-purple-600">
                      ${(estimate.finalAmount * 0.02).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Generate Invoice
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Activity className="w-4 h-4 mr-2" />
                      Schedule Procedure
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
