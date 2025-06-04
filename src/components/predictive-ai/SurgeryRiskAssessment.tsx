
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Scissors, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Shield,
  Heart,
  Activity,
  UserCheck
} from 'lucide-react';

interface SurgeryRisk {
  id: string;
  patientName: string;
  age: number;
  surgery: string;
  surgeonName: string;
  scheduledDate: string;
  overallRiskScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'very_high';
  complicationProbabilities: {
    infection: number;
    bleeding: number;
    anesthesia: number;
    cardiac: number;
    respiratory: number;
  };
  riskFactors: string[];
  mitigationStrategies: string[];
  preOpOptimization: string[];
}

const mockSurgeryRisks: SurgeryRisk[] = [
  {
    id: 'SR001',
    patientName: 'Margaret Johnson',
    age: 78,
    surgery: 'Total Hip Replacement',
    surgeonName: 'Dr. Anderson',
    scheduledDate: '2024-01-20',
    overallRiskScore: 78,
    riskLevel: 'high',
    complicationProbabilities: {
      infection: 12,
      bleeding: 18,
      anesthesia: 15,
      cardiac: 22,
      respiratory: 8
    },
    riskFactors: ['Advanced age', 'Diabetes', 'Previous cardiac event', 'BMI >30'],
    mitigationStrategies: [
      'Extended antibiotic prophylaxis',
      'Cardiac optimization pre-op',
      'Blood conservation techniques',
      'Enhanced recovery protocol'
    ],
    preOpOptimization: [
      'Cardiology clearance required',
      'Diabetes management optimization',
      'Nutritional assessment',
      'Physical therapy consultation'
    ]
  },
  {
    id: 'SR002',
    patientName: 'David Kim',
    age: 45,
    surgery: 'Laparoscopic Cholecystectomy',
    surgeonName: 'Dr. Patel',
    scheduledDate: '2024-01-18',
    overallRiskScore: 28,
    riskLevel: 'low',
    complicationProbabilities: {
      infection: 3,
      bleeding: 5,
      anesthesia: 4,
      cardiac: 2,
      respiratory: 3
    },
    riskFactors: ['Mild hypertension'],
    mitigationStrategies: [
      'Standard prophylaxis protocol',
      'Early mobilization',
      'Minimally invasive approach'
    ],
    preOpOptimization: [
      'Standard pre-op assessment',
      'Blood pressure optimization'
    ]
  }
];

export const SurgeryRiskAssessment = () => {
  const [surgeryRisks] = useState<SurgeryRisk[]>(mockSurgeryRisks);
  const [selectedRisk, setSelectedRisk] = useState<SurgeryRisk | null>(null);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'very_high': return 'bg-red-700 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getComplicationColor = (probability: number) => {
    if (probability >= 20) return 'text-red-600';
    if (probability >= 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Surgery Risk Assessment Dashboard
          </CardTitle>
          <CardDescription>
            AI-powered surgical risk prediction with complication analysis and mitigation strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Scissors className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">24</p>
                    <p className="text-sm text-gray-600">Scheduled Surgeries</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">3</p>
                    <p className="text-sm text-gray-600">High Risk Cases</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-yellow-200 bg-yellow-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">7</p>
                    <p className="text-sm text-gray-600">Require Optimization</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Shield className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">14</p>
                    <p className="text-sm text-gray-600">Low Risk</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Upcoming Surgeries</h3>
              {surgeryRisks.map((risk) => (
                <Card 
                  key={risk.id} 
                  className={`cursor-pointer transition-colors ${selectedRisk?.id === risk.id ? 'ring-2 ring-blue-500' : ''} border-l-4 ${risk.riskLevel === 'high' ? 'border-l-red-500' : risk.riskLevel === 'moderate' ? 'border-l-yellow-400' : 'border-l-green-400'}`}
                  onClick={() => setSelectedRisk(risk)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{risk.patientName}</h4>
                        <p className="text-sm text-gray-600">{risk.surgery}</p>
                        <p className="text-xs text-gray-500">Dr. {risk.surgeonName} • {risk.scheduledDate}</p>
                      </div>
                      <Badge className={getRiskColor(risk.riskLevel)}>
                        {risk.riskLevel.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Risk Score</span>
                      <span className="text-sm font-bold">{risk.overallRiskScore}/100</span>
                    </div>
                    <Progress value={risk.overallRiskScore} className="h-2 mt-1" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedRisk ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedRisk.patientName} - Risk Analysis</CardTitle>
                    <CardDescription>{selectedRisk.surgery}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="complications">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="complications">Complications</TabsTrigger>
                        <TabsTrigger value="mitigation">Mitigation</TabsTrigger>
                        <TabsTrigger value="optimization">Optimization</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="complications" className="space-y-4">
                        <h4 className="font-medium">Complication Probabilities</h4>
                        {Object.entries(selectedRisk.complicationProbabilities).map(([type, probability]) => (
                          <div key={type} className="flex items-center justify-between">
                            <span className="capitalize text-sm">{type}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${getComplicationColor(probability)}`}>
                                {probability}%
                              </span>
                              <div className="w-20">
                                <Progress value={probability} className="h-2" />
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Risk Factors</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedRisk.riskFactors.map((factor, index) => (
                              <Badge key={index} variant="outline">{factor}</Badge>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="mitigation" className="space-y-4">
                        <h4 className="font-medium">Mitigation Strategies</h4>
                        <ul className="space-y-2">
                          {selectedRisk.mitigationStrategies.map((strategy, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-blue-500" />
                              <span className="text-sm">{strategy}</span>
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                      
                      <TabsContent value="optimization" className="space-y-4">
                        <h4 className="font-medium">Pre-Operative Optimization</h4>
                        <ul className="space-y-2">
                          {selectedRisk.preOpOptimization.map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="flex gap-2 mt-4">
                      <Button size="sm">
                        <Activity className="h-4 w-4 mr-1" />
                        Update Risk Assessment
                      </Button>
                      <Button size="sm" variant="outline">
                        <Heart className="h-4 w-4 mr-1" />
                        Contact Surgeon
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a surgery to view detailed risk analysis</p>
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
