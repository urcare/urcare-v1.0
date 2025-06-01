
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp, TrendingDown, User, Clock, Heart } from 'lucide-react';

interface PatientAcuityScoring {
  nightMode: boolean;
}

export const PatientAcuityScoring = ({ nightMode }: PatientAcuityScoring) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('current');

  const patients = [
    {
      id: 1,
      patient: 'John Doe',
      room: '301A',
      acuityScore: 8,
      maxScore: 12,
      level: 'high',
      trend: 'improving',
      factors: [
        { category: 'Mobility', score: 2, maxScore: 3, description: 'Requires assistance' },
        { category: 'Vital Signs', score: 3, maxScore: 3, description: 'Unstable, frequent monitoring' },
        { category: 'Medication', score: 2, maxScore: 3, description: 'Multiple IV medications' },
        { category: 'Procedures', score: 1, maxScore: 3, description: 'Post-operative care' }
      ],
      nurseRatio: '1:4',
      lastAssessment: '2024-06-01 14:00',
      nextReview: '2024-06-01 18:00'
    },
    {
      id: 2,
      patient: 'Jane Smith',
      room: '302B',
      acuityScore: 10,
      maxScore: 12,
      level: 'critical',
      trend: 'stable',
      factors: [
        { category: 'Mobility', score: 3, maxScore: 3, description: 'Bed-bound, total care' },
        { category: 'Vital Signs', score: 3, maxScore: 3, description: 'Continuous monitoring' },
        { category: 'Medication', score: 3, maxScore: 3, description: 'Critical care medications' },
        { category: 'Procedures', score: 1, maxScore: 3, description: 'Routine care' }
      ],
      nurseRatio: '1:2',
      lastAssessment: '2024-06-01 15:30',
      nextReview: '2024-06-01 19:30'
    },
    {
      id: 3,
      patient: 'Mike Brown',
      room: '303A',
      acuityScore: 4,
      maxScore: 12,
      level: 'low',
      trend: 'improving',
      factors: [
        { category: 'Mobility', score: 1, maxScore: 3, description: 'Independent with assistance' },
        { category: 'Vital Signs', score: 1, maxScore: 3, description: 'Stable, routine monitoring' },
        { category: 'Medication', score: 1, maxScore: 3, description: 'Oral medications' },
        { category: 'Procedures', score: 1, maxScore: 3, description: 'Minimal care needs' }
      ],
      nurseRatio: '1:6',
      lastAssessment: '2024-06-01 12:00',
      nextReview: '2024-06-02 08:00'
    }
  ];

  const getAcuityLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <Heart className="h-4 w-4 text-blue-600" />;
      default: return <Heart className="h-4 w-4 text-gray-600" />;
    }
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 75) return 'text-red-600';
    if (percentage >= 50) return 'text-orange-600';
    if (percentage >= 25) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 75) return '[&>div]:bg-red-500';
    if (percentage >= 50) return '[&>div]:bg-orange-500';
    if (percentage >= 25) return '[&>div]:bg-yellow-500';
    return '[&>div]:bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          Patient Acuity Scoring System
        </h2>
        <div className="flex gap-2">
          <Button 
            variant={selectedTimeframe === 'current' ? 'default' : 'outline'}
            onClick={() => setSelectedTimeframe('current')}
          >
            Current
          </Button>
          <Button 
            variant={selectedTimeframe === 'trend' ? 'default' : 'outline'}
            onClick={() => setSelectedTimeframe('trend')}
          >
            Trend View
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={nightMode ? 'bg-gray-800 border-gray-700' : 'border-red-200 bg-red-50'}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {patients.filter(p => p.level === 'critical').length}
            </div>
            <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-red-800'}`}>Critical Acuity</p>
          </CardContent>
        </Card>
        <Card className={nightMode ? 'bg-gray-800 border-gray-700' : 'border-orange-200 bg-orange-50'}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {patients.filter(p => p.level === 'high').length}
            </div>
            <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-orange-800'}`}>High Acuity</p>
          </CardContent>
        </Card>
        <Card className={nightMode ? 'bg-gray-800 border-gray-700' : 'border-blue-200 bg-blue-50'}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(patients.reduce((sum, p) => sum + p.acuityScore, 0) / patients.length * 10) / 10}
            </div>
            <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-blue-800'}`}>Avg Acuity Score</p>
          </CardContent>
        </Card>
        <Card className={nightMode ? 'bg-gray-800 border-gray-700' : 'border-green-200 bg-green-50'}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {patients.filter(p => p.trend === 'improving').length}
            </div>
            <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-green-800'}`}>Improving</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {patients.map(patient => (
          <Card key={patient.id} className={`${nightMode ? 'bg-gray-800 border-gray-700' : ''} ${
            patient.level === 'critical' ? 'border-red-200 bg-red-50' :
            patient.level === 'high' ? 'border-orange-200 bg-orange-50' : ''
          }`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{patient.patient} - {patient.room}</CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Acuity Score:</span>
                      <span className={`text-lg font-bold ${getScoreColor(patient.acuityScore, patient.maxScore)}`}>
                        {patient.acuityScore}/{patient.maxScore}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Trend:</span>
                      {getTrendIcon(patient.trend)}
                      <span className="text-sm">{patient.trend}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getAcuityLevelColor(patient.level)}>
                    {patient.level.toUpperCase()} ACUITY
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    Ratio: {patient.nurseRatio}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Overall Acuity Level</span>
                  <span className={`font-medium ${getScoreColor(patient.acuityScore, patient.maxScore)}`}>
                    {Math.round((patient.acuityScore / patient.maxScore) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(patient.acuityScore / patient.maxScore) * 100} 
                  className={`h-3 ${getProgressColor(patient.acuityScore, patient.maxScore)}`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Acuity Factors</h4>
                  <div className="space-y-3">
                    {patient.factors.map((factor, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{factor.category}</span>
                          <span className={`font-bold ${getScoreColor(factor.score, factor.maxScore)}`}>
                            {factor.score}/{factor.maxScore}
                          </span>
                        </div>
                        <p className={`text-sm ${nightMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {factor.description}
                        </p>
                        <Progress 
                          value={(factor.score / factor.maxScore) * 100} 
                          className={`h-2 mt-2 ${getProgressColor(factor.score, factor.maxScore)}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Assessment Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Last Assessment: {patient.lastAssessment}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Next Review: {patient.nextReview}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>Recommended Nurse Ratio: {patient.nurseRatio}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <h5 className="font-medium">Care Recommendations</h5>
                    <div className={`p-3 rounded-lg ${
                      patient.level === 'critical' ? 'bg-red-100' :
                      patient.level === 'high' ? 'bg-orange-100' :
                      'bg-green-100'
                    }`}>
                      <ul className="text-sm space-y-1">
                        {patient.level === 'critical' && (
                          <>
                            <li>• Continuous monitoring required</li>
                            <li>• 1:2 nurse-to-patient ratio</li>
                            <li>• Hourly assessments</li>
                          </>
                        )}
                        {patient.level === 'high' && (
                          <>
                            <li>• Frequent monitoring required</li>
                            <li>• 1:4 nurse-to-patient ratio</li>
                            <li>• 2-hourly assessments</li>
                          </>
                        )}
                        {patient.level === 'low' && (
                          <>
                            <li>• Standard monitoring</li>
                            <li>• 1:6 nurse-to-patient ratio</li>
                            <li>• 4-hourly assessments</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Update Score
                </Button>
                <Button size="sm" variant="outline">
                  View History
                </Button>
                <Button size="sm" variant="outline">
                  Print Report
                </Button>
                {patient.level === 'critical' && (
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Escalate Care
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className={nightMode ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle>Acuity System Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className={`p-4 ${nightMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg`}>
              <div className="text-2xl font-bold text-blue-600">6.2</div>
              <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-blue-800'}`}>Ward Avg Score</p>
            </div>
            <div className={`p-4 ${nightMode ? 'bg-gray-700' : 'bg-green-50'} rounded-lg`}>
              <div className="text-2xl font-bold text-green-600">1:4.5</div>
              <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-green-800'}`}>Current Nurse Ratio</p>
            </div>
            <div className={`p-4 ${nightMode ? 'bg-gray-700' : 'bg-yellow-50'} rounded-lg`}>
              <div className="text-2xl font-bold text-yellow-600">15</div>
              <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-yellow-800'}`}>Assessments Today</p>
            </div>
            <div className={`p-4 ${nightMode ? 'bg-gray-700' : 'bg-purple-50'} rounded-lg`}>
              <div className="text-2xl font-bold text-purple-600">94%</div>
              <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-purple-800'}`}>Score Accuracy</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
