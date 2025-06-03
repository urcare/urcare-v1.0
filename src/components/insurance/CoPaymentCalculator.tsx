
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Percent, 
  Calculator, 
  DollarSign, 
  Users,
  Shield,
  AlertCircle,
  TrendingDown,
  Building,
  Calendar
} from 'lucide-react';

interface CopayRule {
  serviceType: string;
  networkTier: string;
  copayType: 'percentage' | 'fixed';
  copayValue: number;
  deductibleApplicable: boolean;
  maxCopay?: number;
  minCopay?: number;
}

interface CopayCalculation {
  serviceAmount: number;
  deductibleAmount: number;
  copayAmount: number;
  insuranceCoverage: number;
  patientResponsibility: number;
  outOfPocketMax: number;
  outOfPocketUsed: number;
}

export const CoPaymentCalculator = () => {
  const [selectedService, setSelectedService] = useState('opd_consultation');
  const [serviceAmount, setServiceAmount] = useState(5000);
  const [networkTier, setNetworkTier] = useState('tier1');
  const [familyDeductible, setFamilyDeductible] = useState(false);
  const [annualOutOfPocket, setAnnualOutOfPocket] = useState(45000);

  const copayRules: CopayRule[] = [
    {
      serviceType: 'OPD Consultation',
      networkTier: 'Tier 1',
      copayType: 'fixed',
      copayValue: 500,
      deductibleApplicable: false
    },
    {
      serviceType: 'OPD Consultation',
      networkTier: 'Out-of-Network',
      copayType: 'percentage',
      copayValue: 30,
      deductibleApplicable: true
    },
    {
      serviceType: 'IPD Services',
      networkTier: 'Tier 1',
      copayType: 'percentage',
      copayValue: 10,
      deductibleApplicable: true,
      maxCopay: 25000
    },
    {
      serviceType: 'Emergency Services',
      networkTier: 'Any',
      copayType: 'fixed',
      copayValue: 1000,
      deductibleApplicable: false
    },
    {
      serviceType: 'Specialist Consultation',
      networkTier: 'Tier 1',
      copayType: 'fixed',
      copayValue: 1000,
      deductibleApplicable: false
    },
    {
      serviceType: 'Diagnostic Tests',
      networkTier: 'Tier 1',
      copayType: 'percentage',
      copayValue: 20,
      deductibleApplicable: false,
      maxCopay: 2000
    }
  ];

  const serviceTypes = [
    { value: 'opd_consultation', label: 'OPD Consultation', baseAmount: 2000 },
    { value: 'specialist', label: 'Specialist Consultation', baseAmount: 3000 },
    { value: 'ipd_services', label: 'IPD Services', baseAmount: 50000 },
    { value: 'emergency', label: 'Emergency Services', baseAmount: 8000 },
    { value: 'diagnostic', label: 'Diagnostic Tests', baseAmount: 1500 },
    { value: 'surgery', label: 'Surgical Procedures', baseAmount: 100000 }
  ];

  const networkTiers = [
    { value: 'tier1', label: 'Tier 1 (In-Network)', discount: 100 },
    { value: 'tier2', label: 'Tier 2 (Preferred)', discount: 80 },
    { value: 'out_network', label: 'Out-of-Network', discount: 60 }
  ];

  const familyMembers = [
    { name: 'John Doe (Self)', deductibleMet: 15000, outOfPocketUsed: 25000 },
    { name: 'Jane Doe (Spouse)', deductibleMet: 8000, outOfPocketUsed: 18000 },
    { name: 'Emily Doe (Child)', deductibleMet: 0, outOfPocketUsed: 5000 }
  ];

  const deductibleLimits = {
    individual: 25000,
    family: 50000
  };

  const outOfPocketLimits = {
    individual: 100000,
    family: 200000
  };

  const calculateCopay = (): CopayCalculation => {
    const selectedServiceData = serviceTypes.find(s => s.value === selectedService);
    const selectedTierData = networkTiers.find(t => t.value === networkTier);
    
    if (!selectedServiceData || !selectedTierData) {
      return {
        serviceAmount: 0,
        deductibleAmount: 0,
        copayAmount: 0,
        insuranceCoverage: 0,
        patientResponsibility: 0,
        outOfPocketMax: 100000,
        outOfPocketUsed: 0
      };
    }

    const serviceType = selectedServiceData.label;
    const tier = selectedTierData.label;
    
    // Find applicable copay rule
    const rule = copayRules.find(r => 
      r.serviceType === serviceType && 
      (r.networkTier === tier.split(' ')[0] + ' ' + tier.split(' ')[1] || r.networkTier === 'Any')
    );

    if (!rule) {
      return {
        serviceAmount,
        deductibleAmount: 0,
        copayAmount: serviceAmount,
        insuranceCoverage: 0,
        patientResponsibility: serviceAmount,
        outOfPocketMax: 100000,
        outOfPocketUsed: annualOutOfPocket
      };
    }

    let copayAmount = 0;
    let deductibleAmount = 0;
    
    // Calculate copay
    if (rule.copayType === 'fixed') {
      copayAmount = rule.copayValue;
    } else {
      copayAmount = (serviceAmount * rule.copayValue) / 100;
      if (rule.maxCopay) {
        copayAmount = Math.min(copayAmount, rule.maxCopay);
      }
      if (rule.minCopay) {
        copayAmount = Math.max(copayAmount, rule.minCopay);
      }
    }

    // Calculate deductible if applicable
    if (rule.deductibleApplicable) {
      const currentDeductibleMet = familyDeductible 
        ? familyMembers.reduce((sum, member) => sum + member.deductibleMet, 0)
        : familyMembers[0].deductibleMet;
      
      const deductibleLimit = familyDeductible ? deductibleLimits.family : deductibleLimits.individual;
      const remainingDeductible = Math.max(0, deductibleLimit - currentDeductibleMet);
      
      deductibleAmount = Math.min(serviceAmount, remainingDeductible);
    }

    // Apply network tier discount
    const effectiveServiceAmount = (serviceAmount * selectedTierData.discount) / 100;
    const insuranceCoverage = Math.max(0, effectiveServiceAmount - copayAmount - deductibleAmount);
    const patientResponsibility = serviceAmount - insuranceCoverage;

    return {
      serviceAmount,
      deductibleAmount,
      copayAmount,
      insuranceCoverage,
      patientResponsibility,
      outOfPocketMax: familyDeductible ? outOfPocketLimits.family : outOfPocketLimits.individual,
      outOfPocketUsed: annualOutOfPocket
    };
  };

  const calculation = calculateCopay();
  const outOfPocketProgress = (calculation.outOfPocketUsed / calculation.outOfPocketMax) * 100;

  const copayScenarios = [
    { scenario: 'Preventive Care', copay: 0, description: 'Annual checkups, vaccinations' },
    { scenario: 'Primary Care', copay: 500, description: 'General physician visits' },
    { scenario: 'Specialist Care', copay: 1000, description: 'Cardiologist, dermatologist' },
    { scenario: 'Emergency Care', copay: 1000, description: 'ER visits, urgent care' },
    { scenario: 'Inpatient Care', copay: '10%', description: 'Hospital admissions' },
    { scenario: 'Out-of-Network', copay: '30%', description: 'Non-network providers' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Co-Payment Calculator</h2>
          <p className="text-gray-600">Calculate patient responsibility and insurance coverage</p>
        </div>
        
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Copay History
        </Button>
      </div>

      {/* Copay Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Copay Calculator
            </CardTitle>
            <CardDescription>Calculate copayment for services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="service">Service Type</Label>
              <select 
                id="service"
                value={selectedService}
                onChange={(e) => {
                  setSelectedService(e.target.value);
                  const service = serviceTypes.find(s => s.value === e.target.value);
                  if (service) setServiceAmount(service.baseAmount);
                }}
                className="w-full mt-1 p-2 border rounded-md"
              >
                {serviceTypes.map((service) => (
                  <option key={service.value} value={service.value}>
                    {service.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="amount">Service Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={serviceAmount}
                onChange={(e) => setServiceAmount(parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="tier">Network Tier</Label>
              <select 
                id="tier"
                value={networkTier}
                onChange={(e) => setNetworkTier(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                {networkTiers.map((tier) => (
                  <option key={tier.value} value={tier.value}>
                    {tier.label} ({tier.discount}% coverage)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input 
                type="checkbox"
                id="family"
                checked={familyDeductible}
                onChange={(e) => setFamilyDeductible(e.target.checked)}
              />
              <Label htmlFor="family">Apply family deductible aggregation</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
            <CardDescription>Detailed payment calculation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Service Amount:</span>
                <span className="font-semibold">₹{calculation.serviceAmount.toLocaleString()}</span>
              </div>
              
              {calculation.deductibleAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Deductible:</span>
                  <span>₹{calculation.deductibleAmount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between text-red-600">
                <span>Copay:</span>
                <span>₹{calculation.copayAmount.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-green-600">
                <span>Insurance Coverage:</span>
                <span>₹{calculation.insuranceCoverage.toLocaleString()}</span>
              </div>
              
              <hr />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Patient Pays:</span>
                <span className="text-red-600">₹{calculation.patientResponsibility.toLocaleString()}</span>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Coverage Summary</span>
                </div>
                <div className="text-xs text-gray-600">
                  Insurance covers {((calculation.insuranceCoverage / calculation.serviceAmount) * 100).toFixed(1)}% of the service cost
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Out-of-Pocket Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Annual Out-of-Pocket Tracker
          </CardTitle>
          <CardDescription>Track progress toward maximum out-of-pocket limit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Annual Out-of-Pocket Used:</span>
              <span className="font-semibold">₹{calculation.outOfPocketUsed.toLocaleString()} / ₹{calculation.outOfPocketMax.toLocaleString()}</span>
            </div>
            
            <Progress value={outOfPocketProgress} className="h-3" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-semibold text-blue-600">₹{(calculation.outOfPocketMax - calculation.outOfPocketUsed).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
              
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-semibold text-green-600">{(100 - outOfPocketProgress).toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Coverage Left</div>
              </div>
              
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <div className="text-lg font-semibold text-amber-600">
                  {calculation.outOfPocketUsed >= calculation.outOfPocketMax ? '100%' : outOfPocketProgress.toFixed(1) + '%'}
                </div>
                <div className="text-sm text-gray-600">Utilized</div>
              </div>
            </div>

            {calculation.outOfPocketUsed >= calculation.outOfPocketMax && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <TrendingDown className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">Maximum out-of-pocket reached. Future covered services are 100% covered.</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Family Deductible Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Family Deductible & Out-of-Pocket Status
          </CardTitle>
          <CardDescription>Individual and family contribution tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {familyMembers.map((member, index) => {
              const deductibleProgress = (member.deductibleMet / deductibleLimits.individual) * 100;
              const outOfPocketProgress = (member.outOfPocketUsed / outOfPocketLimits.individual) * 100;
              
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">{member.name}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Deductible Met:</span>
                        <span>₹{member.deductibleMet.toLocaleString()} / ₹{deductibleLimits.individual.toLocaleString()}</span>
                      </div>
                      <Progress value={deductibleProgress} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Out-of-Pocket Used:</span>
                        <span>₹{member.outOfPocketUsed.toLocaleString()} / ₹{outOfPocketLimits.individual.toLocaleString()}</span>
                      </div>
                      <Progress value={outOfPocketProgress} className="h-2" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Copay Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" />
            Copay Structure Overview
          </CardTitle>
          <CardDescription>Standard copayment amounts by service type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {copayScenarios.map((scenario, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{scenario.scenario}</h4>
                  <Badge variant="outline">
                    {typeof scenario.copay === 'number' ? `₹${scenario.copay}` : scenario.copay}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{scenario.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Copay Waiver Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Copay Waivers & Special Cases
          </CardTitle>
          <CardDescription>Services with copay exemptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <h4 className="font-medium text-green-800">Preventive Care Services</h4>
                <p className="text-sm text-green-700">Annual checkups, vaccinations, and screenings are copay-free</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <h4 className="font-medium text-blue-800">Emergency Services</h4>
                <p className="text-sm text-blue-700">Fixed copay regardless of network status for true emergencies</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div>
                <h4 className="font-medium text-purple-800">Generic Medications</h4>
                <p className="text-sm text-purple-700">Lower copay for generic vs. brand-name prescriptions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
