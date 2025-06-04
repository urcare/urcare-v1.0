
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Baby, 
  Heart, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  UserCheck,
  Stethoscope,
  Clock
} from 'lucide-react';

interface PregnancyRisk {
  id: string;
  patientName: string;
  age: number;
  gestationalAge: string;
  expectedDelivery: string;
  overallRiskScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'very_high';
  maternalFactors: {
    hypertension: boolean;
    diabetes: boolean;
    previousComplications: boolean;
    age: 'normal' | 'advanced';
  };
  fetalIndicators: {
    growthRestriction: boolean;
    heartAbnormalities: boolean;
    position: 'normal' | 'breech' | 'transverse';
    movements: 'normal' | 'reduced' | 'excessive';
  };
  monitoringProtocols: string[];
  specialistReferrals: string[];
  interventions: string[];
  lastAssessment: string;
}

const mockPregnancyRisks: PregnancyRisk[] = [
  {
    id: 'PR001',
    patientName: 'Amanda Rodriguez',
    age: 38,
    gestationalAge: '34 weeks 2 days',
    expectedDelivery: '2024-02-15',
    overallRiskScore: 82,
    riskLevel: 'high',
    maternalFactors: {
      hypertension: true,
      diabetes: false,
      previousComplications: true,
      age: 'advanced'
    },
    fetalIndicators: {
      growthRestriction: true,
      heartAbnormalities: false,
      position: 'normal',
      movements: 'reduced'
    },
    monitoringProtocols: [
      'Twice weekly NST',
      'Weekly biophysical profile',
      'Blood pressure monitoring',
      'Fetal growth scans every 2 weeks'
    ],
    specialistReferrals: [
      'Maternal-Fetal Medicine',
      'Neonatology consultation',
      'Anesthesia pre-assessment'
    ],
    interventions: [
      'Corticosteroids for lung maturity',
      'Antihypertensive therapy',
      'Hospital bed rest consideration'
    ],
    lastAssessment: '2024-01-15'
  },
  {
    id: 'PR002',
    patientName: 'Jennifer Chen',
    age: 28,
    gestationalAge: '28 weeks 5 days',
    expectedDelivery: '2024-03-20',
    overallRiskScore: 45,
    riskLevel: 'moderate',
    maternalFactors: {
      hypertension: false,
      diabetes: true,
      previousComplications: false,
      age: 'normal'
    },
    fetalIndicators: {
      growthRestriction: false,
      heartAbnormalities: false,
      position: 'normal',
      movements: 'normal'
    },
    monitoringProtocols: [
      'Weekly NST from 32 weeks',
      'Monthly growth scans',
      'Glucose monitoring',
      'Kick count tracking'
    ],
    specialistReferrals: [
      'Endocrinology',
      'Dietitian consultation'
    ],
    interventions: [
      'Insulin therapy optimization',
      'Dietary modifications',
      'Exercise program'
    ],
    lastAssessment: '2024-01-12'
  }
];

export const HighRiskPregnancyDashboard = () => {
  const [pregnancyRisks] = useState<PregnancyRisk[]>(mockPregnancyRisks);
  const [selectedRisk, setSelectedRisk] = useState<PregnancyRisk | null>(null);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'very_high': return 'bg-red-700 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Baby className="h-5 w-5" />
            High-Risk Pregnancy Dashboard
          </CardTitle>
          <CardDescription>
            Comprehensive risk assessment with monitoring protocols and specialist referrals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-pink-200 bg-pink-50">
                <div className="flex items-center gap-2">
                  <Baby className="h-8 w-8 text-pink-600" />
                  <div>
                    <p className="text-2xl font-bold text-pink-600">28</p>
                    <p className="text-sm text-gray-600">Active Pregnancies</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">4</p>
                    <p className="text-sm text-gray-600">High Risk Cases</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-yellow-200 bg-yellow-50">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">12</p>
                    <p className="text-sm text-gray-600">Specialist Referrals</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">16</p>
                    <p className="text-sm text-gray-600">Due This Month</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">High-Risk Pregnancies</h3>
              {pregnancyRisks.sort((a, b) => {
                const riskOrder = { very_high: 4, high: 3, moderate: 2, low: 1 };
                return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
              }).map((risk) => (
                <Card 
                  key={risk.id} 
                  className={`cursor-pointer transition-colors ${selectedRisk?.id === risk.id ? 'ring-2 ring-blue-500' : ''} border-l-4 ${risk.riskLevel === 'high' ? 'border-l-red-500' : risk.riskLevel === 'moderate' ? 'border-l-yellow-400' : 'border-l-green-400'}`}
                  onClick={() => setSelectedRisk(risk)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{risk.patientName}</h4>
                        <p className="text-sm text-gray-600">Age: {risk.age} • {risk.gestationalAge}</p>
                        <p className="text-xs text-gray-500">EDD: {risk.expectedDelivery}</p>
                      </div>
                      <Badge className={getRiskColor(risk.riskLevel)}>
                        {risk.riskLevel.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Risk Score</span>
                        <span className="text-sm font-bold">{risk.overallRiskScore}/100</span>
                      </div>
                      <Progress value={risk.overallRiskScore} className="h-2" />
                      
                      <div className="text-xs text-gray-500">
                        Last assessment: {risk.lastAssessment}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedRisk ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedRisk.patientName} - Risk Profile</CardTitle>
                    <CardDescription>{selectedRisk.gestationalAge}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="factors">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="factors">Factors</TabsTrigger>
                        <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                        <TabsTrigger value="referrals">Referrals</TabsTrigger>
                        <TabsTrigger value="interventions">Care</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="factors" className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Maternal Risk Factors</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${selectedRisk.maternalFactors.hypertension ? 'bg-red-500' : 'bg-green-500'}`}></div>
                              <span>Hypertension</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${selectedRisk.maternalFactors.diabetes ? 'bg-red-500' : 'bg-green-500'}`}></div>
                              <span>Diabetes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${selectedRisk.maternalFactors.previousComplications ? 'bg-red-500' : 'bg-green-500'}`}></div>
                              <span>Previous Complications</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${selectedRisk.maternalFactors.age === 'advanced' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                              <span>Advanced Age</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Fetal Indicators</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${selectedRisk.fetalIndicators.growthRestriction ? 'bg-red-500' : 'bg-green-500'}`}></div>
                              <span>Growth Restriction</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${selectedRisk.fetalIndicators.heartAbnormalities ? 'bg-red-500' : 'bg-green-500'}`}></div>
                              <span>Heart Abnormalities</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${selectedRisk.fetalIndicators.position !== 'normal' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                              <span>Position: {selectedRisk.fetalIndicators.position}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${selectedRisk.fetalIndicators.movements !== 'normal' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                              <span>Movements: {selectedRisk.fetalIndicators.movements}</span>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="monitoring" className="space-y-4">
                        <h4 className="font-medium">Monitoring Protocols</h4>
                        <ul className="space-y-2">
                          {selectedRisk.monitoringProtocols.map((protocol, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-blue-500" />
                              <span className="text-sm">{protocol}</span>
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                      
                      <TabsContent value="referrals" className="space-y-4">
                        <h4 className="font-medium">Specialist Referrals</h4>
                        <ul className="space-y-2">
                          {selectedRisk.specialistReferrals.map((referral, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{referral}</span>
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                      
                      <TabsContent value="interventions" className="space-y-4">
                        <h4 className="font-medium">Active Interventions</h4>
                        <ul className="space-y-2">
                          {selectedRisk.interventions.map((intervention, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4 text-purple-500" />
                              <span className="text-sm">{intervention}</span>
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="flex gap-2 mt-4">
                      <Button size="sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule Visit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Heart className="h-4 w-4 mr-1" />
                        Update Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a pregnancy to view detailed risk analysis</p>
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
