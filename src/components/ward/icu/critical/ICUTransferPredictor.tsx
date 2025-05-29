
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingDown, Clock, Activity, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface TransferPrediction {
  patientId: string;
  patientName: string;
  currentRoom: string;
  targetWard: string;
  readinessScore: number;
  expectedTransferDate: Date;
  confidence: number;
  stabilityMetrics: {
    vitals: number;
    consciousness: number;
    respiratory: number;
    cardiovascular: number;
  };
  requiredCriteria: {
    name: string;
    status: 'met' | 'pending' | 'not_met';
    details: string;
  }[];
  riskFactors: string[];
  recommendations: string[];
  nursingHours: number;
  equipmentDependency: string[];
}

const mockPredictions: TransferPrediction[] = [
  {
    patientId: 'ICU002',
    patientName: 'Michael Chen',
    currentRoom: 'ICU-B2',
    targetWard: 'General Medicine',
    readinessScore: 78,
    expectedTransferDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    confidence: 85,
    stabilityMetrics: {
      vitals: 82,
      consciousness: 90,
      respiratory: 75,
      cardiovascular: 80
    },
    requiredCriteria: [
      { name: 'Stable vitals >24hr', status: 'met', details: 'HR 72-88, BP stable' },
      { name: 'O2 requirement <4L', status: 'met', details: 'Currently on 2L NC' },
      { name: 'GCS >12', status: 'met', details: 'GCS 15, alert and oriented' },
      { name: 'No vasopressors', status: 'pending', details: 'Weaning off low-dose levophed' },
      { name: 'Adequate oral intake', status: 'not_met', details: 'Still on TPN, tolerating sips' }
    ],
    riskFactors: ['Recent extubation', 'History of COPD'],
    recommendations: ['Continue weaning support', 'Speech therapy consult'],
    nursingHours: 8,
    equipmentDependency: ['Cardiac monitor', 'O2 therapy']
  },
  {
    patientId: 'ICU004',
    patientName: 'Emma Davis',
    currentRoom: 'ICU-C1',
    targetWard: 'Step-down Unit',
    readinessScore: 92,
    expectedTransferDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    confidence: 95,
    stabilityMetrics: {
      vitals: 95,
      consciousness: 100,
      respiratory: 88,
      cardiovascular: 92
    },
    requiredCriteria: [
      { name: 'Stable vitals >24hr', status: 'met', details: 'All parameters stable' },
      { name: 'O2 requirement <4L', status: 'met', details: 'Room air, O2 sat 98%' },
      { name: 'GCS >12', status: 'met', details: 'GCS 15, fully oriented' },
      { name: 'No vasopressors', status: 'met', details: 'Off all pressors 48hr' },
      { name: 'Adequate oral intake', status: 'met', details: 'Eating regular diet' }
    ],
    riskFactors: [],
    recommendations: ['Ready for transfer', 'Continue monitoring'],
    nursingHours: 4,
    equipmentDependency: ['Basic monitoring']
  }
];

export const ICUTransferPredictor = () => {
  const [predictions, setPredictions] = useState<TransferPrediction[]>(mockPredictions);

  const getReadinessColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'met': return 'bg-green-500 text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      case 'not_met': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatTimeToTransfer = (date: Date) => {
    const hours = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60));
    if (hours < 24) return `${hours} hours`;
    const days = Math.ceil(hours / 24);
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            ICU-to-Ward Transfer Predictor
          </CardTitle>
          <CardDescription>
            AI-powered transfer readiness assessment with predictive analytics and criteria tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">1</p>
                  <p className="text-sm text-gray-600">Ready to Transfer</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">1</p>
                  <p className="text-sm text-gray-600">Near Ready</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Activity className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">6</p>
                  <p className="text-sm text-gray-600">Average ICU Days</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-purple-200 bg-purple-50">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">12</p>
                  <p className="text-sm text-gray-600">Transfers This Week</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {predictions.map((prediction) => (
              <Card key={prediction.patientId} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{prediction.patientName}</h3>
                      <Badge variant="outline">{prediction.currentRoom}</Badge>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <Badge className="bg-blue-500 text-white">{prediction.targetWard}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Expected: {formatTimeToTransfer(prediction.expectedTransferDate)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Confidence: {prediction.confidence}%
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Transfer Readiness</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Overall Score</span>
                            <span className={`text-lg font-bold ${getReadinessColor(prediction.readinessScore)}`}>
                              {prediction.readinessScore}%
                            </span>
                          </div>
                          <Progress value={prediction.readinessScore} className="h-3" />
                        </div>
                        <div className="text-sm">
                          <p><strong>Nursing Hours Required:</strong> {prediction.nursingHours}h/day</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Stability Metrics</h4>
                      <div className="space-y-2">
                        {Object.entries(prediction.stabilityMetrics).map(([metric, score]) => (
                          <div key={metric} className="flex justify-between items-center">
                            <span className="text-sm capitalize">{metric}:</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-gray-200 rounded-full">
                                <div 
                                  className={`h-full rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{score}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Equipment Dependency</h4>
                      <div className="space-y-2">
                        {prediction.equipmentDependency.map((equipment, index) => (
                          <div key={index} className="text-sm p-2 bg-blue-50 rounded">
                            <Activity className="h-3 w-3 inline mr-2 text-blue-600" />
                            {equipment}
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Transfer Criteria</h4>
                      <div className="space-y-2">
                        {prediction.requiredCriteria.map((criteria, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(criteria.status)} size="sm">
                                  {criteria.status.replace('_', ' ')}
                                </Badge>
                                <span className="text-sm font-medium">{criteria.name}</span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{criteria.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Risk Factors & Recommendations</h4>
                      <div className="space-y-3">
                        {prediction.riskFactors.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-red-600 mb-2">Risk Factors:</h5>
                            <ul className="space-y-1">
                              {prediction.riskFactors.map((risk, index) => (
                                <li key={index} className="text-sm text-red-700 flex items-center gap-2">
                                  <AlertTriangle className="h-3 w-3" />
                                  {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div>
                          <h5 className="text-sm font-medium text-blue-600 mb-2">Recommendations:</h5>
                          <ul className="space-y-1">
                            {prediction.recommendations.map((rec, index) => (
                              <li key={index} className="text-sm text-blue-700 flex items-center gap-2">
                                <CheckCircle className="h-3 w-3" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="flex gap-2">
                    {prediction.readinessScore >= 85 && (
                      <Button size="sm" variant="default">
                        <ArrowRight className="h-4 w-4 mr-1" />
                        Initiate Transfer
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Clock className="h-4 w-4 mr-1" />
                      Update Assessment
                    </Button>
                    <Button size="sm" variant="outline">
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
