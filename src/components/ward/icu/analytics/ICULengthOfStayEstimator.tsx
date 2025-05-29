
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Calendar, TrendingUp, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface StayEstimate {
  patientId: string;
  patientName: string;
  room: string;
  admissionDate: Date;
  currentStay: number;
  estimatedTotalStay: number;
  confidence: number;
  factors: {
    severity: number;
    comorbidities: number;
    responseToTreatment: number;
    complications: number;
  };
  milestones: {
    name: string;
    status: 'completed' | 'in_progress' | 'pending';
    estimatedDate: Date;
  }[];
  dischargeReadiness: number;
  riskFactors: string[];
}

const mockEstimates: StayEstimate[] = [
  {
    patientId: 'ICU001',
    patientName: 'Sarah Johnson',
    room: 'ICU-A1',
    admissionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    currentStay: 3,
    estimatedTotalStay: 8,
    confidence: 85,
    factors: {
      severity: 85,
      comorbidities: 60,
      responseToTreatment: 70,
      complications: 40
    },
    milestones: [
      { name: 'Stabilization', status: 'completed', estimatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { name: 'Weaning from ventilator', status: 'in_progress', estimatedDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
      { name: 'Neurological improvement', status: 'pending', estimatedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
      { name: 'Transfer ready', status: 'pending', estimatedDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) }
    ],
    dischargeReadiness: 35,
    riskFactors: ['Complex respiratory failure', 'Age > 65', 'Multiple comorbidities']
  },
  {
    patientId: 'ICU002',
    patientName: 'Michael Chen',
    room: 'ICU-B2',
    admissionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    currentStay: 5,
    estimatedTotalStay: 7,
    confidence: 92,
    factors: {
      severity: 50,
      comorbidities: 30,
      responseToTreatment: 90,
      complications: 20
    },
    milestones: [
      { name: 'Stabilization', status: 'completed', estimatedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
      { name: 'Weaning from ventilator', status: 'completed', estimatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { name: 'Neurological improvement', status: 'completed', estimatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { name: 'Transfer ready', status: 'in_progress', estimatedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) }
    ],
    dischargeReadiness: 78,
    riskFactors: ['Post-surgical complications (resolved)']
  }
];

export const ICULengthOfStayEstimator = () => {
  const [estimates, setEstimates] = useState<StayEstimate[]>(mockEstimates);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'in_progress': return 'bg-blue-500 text-white';
      case 'pending': return 'bg-gray-400 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            ICU Length of Stay Estimator
          </CardTitle>
          <CardDescription>
            AI-powered predictions for ICU length of stay with milestone tracking and discharge readiness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">6.2</p>
                  <p className="text-sm text-gray-600">Avg Stay (days)</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">87%</p>
                  <p className="text-sm text-gray-600">Prediction Accuracy</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">2</p>
                  <p className="text-sm text-gray-600">Extended Stays</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-purple-200 bg-purple-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">1</p>
                  <p className="text-sm text-gray-600">Ready for Transfer</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {estimates.map((estimate) => (
              <Card key={estimate.patientId} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{estimate.patientName}</h3>
                      <Badge variant="outline">{estimate.room}</Badge>
                      <Badge className={`${getConfidenceColor(estimate.confidence)} bg-opacity-10`}>
                        {estimate.confidence}% Confidence
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Day {estimate.currentStay} of est. {estimate.estimatedTotalStay}</p>
                      <p className="text-sm text-gray-500">Admitted: {formatDate(estimate.admissionDate)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Stay Progress</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Days Completed</span>
                            <span className="text-sm font-medium">{estimate.currentStay}/{estimate.estimatedTotalStay}</span>
                          </div>
                          <Progress value={(estimate.currentStay / estimate.estimatedTotalStay) * 100} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Discharge Readiness</span>
                            <span className="text-sm font-medium">{estimate.dischargeReadiness}%</span>
                          </div>
                          <Progress value={estimate.dischargeReadiness} className="h-2" />
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Contributing Factors</h4>
                      <div className="space-y-2">
                        {Object.entries(estimate.factors).map(([factor, value]) => (
                          <div key={factor} className="flex justify-between items-center">
                            <span className="text-sm capitalize">{factor.replace(/([A-Z])/g, ' $1')}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-gray-200 rounded-full">
                                <div 
                                  className={`h-full rounded-full ${value >= 70 ? 'bg-red-500' : value >= 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                  style={{ width: `${value}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium w-8">{value}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Risk Factors</h4>
                      <div className="space-y-2">
                        {estimate.riskFactors.map((risk, index) => (
                          <div key={index} className="text-sm p-2 bg-red-50 rounded flex items-center gap-2">
                            <AlertTriangle className="h-3 w-3 text-red-600" />
                            <span className="text-red-700">{risk}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <Card className="p-4 mb-4">
                    <h4 className="font-medium mb-3">Recovery Milestones</h4>
                    <div className="space-y-3">
                      {estimate.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <Badge className={getStatusColor(milestone.status)}>
                              {milestone.status.replace('_', ' ')}
                            </Badge>
                            <span className="font-medium">{milestone.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {milestone.status === 'completed' ? 'Completed' : 'Expected'}: {formatDate(milestone.estimatedDate)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <div className="flex gap-2">
                    <Button size="sm" variant="default">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Update Prediction
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-1" />
                      View Trend Analysis
                    </Button>
                    <Button size="sm" variant="outline">
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
