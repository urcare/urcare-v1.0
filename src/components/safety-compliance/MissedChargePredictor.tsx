
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  FileText,
  CheckCircle,
  XCircle,
  BarChart3,
  Activity,
  Search
} from 'lucide-react';

interface MissedCharge {
  id: string;
  patientId: string;
  patientName: string;
  serviceDate: string;
  department: string;
  providerId: string;
  providerName: string;
  serviceType: string;
  procedureCode: string;
  missedAmount: number;
  confidence: number;
  status: 'identified' | 'reviewed' | 'billed' | 'disputed' | 'written_off';
  reason: string;
  evidence: string[];
  recoveryProbability: number;
  daysMissed: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface RevenueOptimization {
  id: string;
  department: string;
  timeframe: string;
  totalMissed: number;
  recoveredAmount: number;
  opportunities: number;
  improvementSuggestions: string[];
  trend: 'improving' | 'stable' | 'declining';
  targetRecovery: number;
}

const mockMissedCharges: MissedCharge[] = [
  {
    id: 'MC001',
    patientId: 'P2847',
    patientName: 'Sarah Johnson',
    serviceDate: '2024-01-18',
    department: 'Emergency',
    providerId: 'D1234',
    providerName: 'Dr. Michael Roberts',
    serviceType: 'Emergency Consultation',
    procedureCode: '99285',
    missedAmount: 1250,
    confidence: 92,
    status: 'identified',
    reason: 'Documentation complete but not billed - system error',
    evidence: ['Completed EMR notes', 'Procedure performed', 'Patient discharged'],
    recoveryProbability: 95,
    daysMissed: 2,
    priority: 'high'
  },
  {
    id: 'MC002',
    patientId: 'P1932',
    patientName: 'Robert Davis',
    serviceDate: '2024-01-15',
    department: 'Cardiology',
    providerId: 'D5678',
    providerName: 'Dr. Lisa Thompson',
    serviceType: 'Cardiac Catheterization',
    procedureCode: '93458',
    missedAmount: 3420,
    confidence: 87,
    status: 'reviewed',
    reason: 'Additional procedures not captured in billing',
    evidence: ['Procedure notes', 'Equipment usage logs', 'Medications administered'],
    recoveryProbability: 88,
    daysMissed: 5,
    priority: 'critical'
  },
  {
    id: 'MC003',
    patientId: 'P3156',
    patientName: 'Emily Rodriguez',
    serviceDate: '2024-01-12',
    department: 'Surgery',
    providerId: 'D9012',
    providerName: 'Dr. James Wilson',
    serviceType: 'Surgical Consultation',
    procedureCode: '99243',
    missedAmount: 875,
    confidence: 79,
    status: 'billed',
    reason: 'Late documentation submission',
    evidence: ['Consultation notes', 'Patient history review'],
    recoveryProbability: 100,
    daysMissed: 8,
    priority: 'medium'
  }
];

const mockOptimizations: RevenueOptimization[] = [
  {
    id: 'RO001',
    department: 'Emergency',
    timeframe: 'Last 30 days',
    totalMissed: 45680,
    recoveredAmount: 32450,
    opportunities: 23,
    improvementSuggestions: [
      'Implement real-time charge capture alerts',
      'Improve documentation workflow',
      'Add automated billing validation'
    ],
    trend: 'improving',
    targetRecovery: 52000
  },
  {
    id: 'RO002',
    department: 'Cardiology',
    timeframe: 'Last 30 days',
    totalMissed: 78920,
    recoveredAmount: 54230,
    opportunities: 18,
    improvementSuggestions: [
      'Enhance procedure code mapping',
      'Streamline billing processes',
      'Training for complex procedures'
    ],
    trend: 'stable',
    targetRecovery: 71000
  }
];

export const MissedChargePredictor = () => {
  const [missedCharges] = useState<MissedCharge[]>(mockMissedCharges);
  const [optimizations] = useState<RevenueOptimization[]>(mockOptimizations);
  const [selectedCharge, setSelectedCharge] = useState<MissedCharge | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'identified': return 'bg-red-500 text-white';
      case 'reviewed': return 'bg-yellow-500 text-white';
      case 'billed': return 'bg-green-500 text-white';
      case 'disputed': return 'bg-orange-500 text-white';
      case 'written_off': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateTotalMissed = () => {
    return missedCharges.reduce((total, charge) => total + charge.missedAmount, 0);
  };

  const calculateRecoveryPotential = () => {
    return missedCharges.reduce((total, charge) => 
      total + (charge.missedAmount * charge.recoveryProbability / 100), 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Missed Charge Predictor
          </CardTitle>
          <CardDescription>
            Revenue optimization through billing accuracy improvement and comprehensive audit preparation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-2">
                <DollarSign className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(calculateTotalMissed())}</p>
                  <p className="text-sm text-gray-600">Total Missed</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(calculateRecoveryPotential())}</p>
                  <p className="text-sm text-gray-600">Recovery Potential</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">{missedCharges.length}</p>
                  <p className="text-sm text-gray-600">Open Cases</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(calculateRecoveryPotential() / calculateTotalMissed() * 100)}%
                  </p>
                  <p className="text-sm text-gray-600">Recovery Rate</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Missed Charges</h3>
              {missedCharges.map((charge) => (
                <Card 
                  key={charge.id} 
                  className={`cursor-pointer transition-colors ${selectedCharge?.id === charge.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-green-400`}
                  onClick={() => setSelectedCharge(charge)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold mb-1">{charge.patientName}</h4>
                        <p className="text-sm text-gray-600 mb-1">{charge.department} • {charge.serviceType}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{charge.serviceDate} ({charge.daysMissed} days ago)</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 text-right">
                        <Badge className={getStatusColor(charge.status)}>
                          {charge.status}
                        </Badge>
                        <p className="text-lg font-bold text-red-600">{formatCurrency(charge.missedAmount)}</p>
                        <p className={`text-sm font-medium ${getPriorityColor(charge.priority)}`}>
                          {charge.priority} priority
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Confidence</span>
                        <span className="font-bold">{charge.confidence}%</span>
                      </div>
                      <Progress value={charge.confidence} className="h-2" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Recovery Probability</span>
                        <span className="font-bold text-green-600">{charge.recoveryProbability}%</span>
                      </div>
                      <Progress value={charge.recoveryProbability} className="h-2 bg-green-100" />
                      
                      <div className="text-sm">
                        <p className="text-gray-600">Provider: <strong>{charge.providerName}</strong></p>
                        <p className="text-gray-600">Code: <strong>{charge.procedureCode}</strong></p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedCharge ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedCharge.patientName} - Charge Recovery</CardTitle>
                    <CardDescription>Detailed analysis and recovery workflow management</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Charge Information</h4>
                          <div className="space-y-1 text-sm">
                            <p>Charge ID: <strong>{selectedCharge.id}</strong></p>
                            <p>Patient: <strong>{selectedCharge.patientName}</strong></p>
                            <p>Service Date: <strong>{selectedCharge.serviceDate}</strong></p>
                            <p>Department: <strong>{selectedCharge.department}</strong></p>
                            <p>Provider: <strong>{selectedCharge.providerName}</strong></p>
                            <p>Service: <strong>{selectedCharge.serviceType}</strong></p>
                            <p>Code: <strong>{selectedCharge.procedureCode}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Recovery Analysis</h4>
                          <div className="space-y-1 text-sm">
                            <p>Amount: <strong className="text-red-600">{formatCurrency(selectedCharge.missedAmount)}</strong></p>
                            <p>Status: <strong>{selectedCharge.status}</strong></p>
                            <p>Priority: <strong className={getPriorityColor(selectedCharge.priority)}>
                              {selectedCharge.priority}
                            </strong></p>
                            <p>Days Missed: <strong>{selectedCharge.daysMissed}</strong></p>
                            <p>Confidence: <strong>{selectedCharge.confidence}%</strong></p>
                            <p>Recovery Prob: <strong className="text-green-600">{selectedCharge.recoveryProbability}%</strong></p>
                            <p>Expected Recovery: <strong className="text-green-600">
                              {formatCurrency(selectedCharge.missedAmount * selectedCharge.recoveryProbability / 100)}
                            </strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Reason for Missed Charge</h4>
                        <p className="text-sm bg-gray-50 p-3 rounded">{selectedCharge.reason}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Supporting Evidence</h4>
                        <div className="space-y-2">
                          {selectedCharge.evidence.map((evidence, index) => (
                            <div key={index} className="text-sm bg-green-50 p-2 rounded">
                              <div className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-green-700">{evidence}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {selectedCharge.status === 'identified' && (
                          <Button>
                            <DollarSign className="h-4 w-4 mr-1" />
                            Submit for Billing
                          </Button>
                        )}
                        {selectedCharge.status === 'reviewed' && (
                          <Button>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve Charge
                          </Button>
                        )}
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Generate Report
                        </Button>
                        <Button variant="outline">
                          <Search className="h-4 w-4 mr-1" />
                          Audit Trail
                        </Button>
                        {selectedCharge.status !== 'written_off' && (
                          <Button variant="destructive">
                            <XCircle className="h-4 w-4 mr-1" />
                            Write Off
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select a missed charge to view recovery analysis and management options</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Revenue Optimization Analysis</CardTitle>
              <CardDescription>Department-wise revenue recovery insights and improvement recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizations.map((optimization) => (
                  <div key={optimization.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{optimization.department}</h4>
                        <p className="text-sm text-gray-600">{optimization.timeframe}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">{formatCurrency(optimization.totalMissed)}</p>
                        <p className="text-sm text-gray-600">Total Missed</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Recovered</p>
                        <p className="font-semibold text-green-600">{formatCurrency(optimization.recoveredAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Target Recovery</p>
                        <p className="font-semibold">{formatCurrency(optimization.targetRecovery)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Opportunities</p>
                        <p className="font-semibold text-blue-600">{optimization.opportunities}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Trend</p>
                        <p className={`font-semibold ${getTrendColor(optimization.trend)}`}>
                          {optimization.trend}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Recovery Progress</span>
                        <span className="font-bold">
                          {Math.round(optimization.recoveredAmount / optimization.targetRecovery * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={optimization.recoveredAmount / optimization.targetRecovery * 100} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Improvement Suggestions</h5>
                      <div className="flex flex-wrap gap-2">
                        {optimization.improvementSuggestions.map((suggestion, index) => (
                          <Badge key={index} variant="outline" className="text-blue-600">
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
