
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react';

interface ScreeningAssessment {
  id: string;
  patientName: string;
  age: number;
  assessmentType: 'PHQ-9' | 'GAD-7' | 'PTSD-5' | 'Bipolar' | 'Comprehensive';
  riskScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'severe';
  completionDate: string;
  responses: number;
  totalQuestions: number;
  interventionRecommendations: string[];
  followUpRequired: boolean;
  clinicianReview: 'pending' | 'completed' | 'urgent';
}

const mockAssessments: ScreeningAssessment[] = [
  {
    id: 'MHS001',
    patientName: 'Sarah Chen',
    age: 28,
    assessmentType: 'PHQ-9',
    riskScore: 18,
    riskLevel: 'severe',
    completionDate: '2024-01-15 14:30',
    responses: 9,
    totalQuestions: 9,
    interventionRecommendations: ['Immediate psychiatric evaluation', 'Crisis safety plan', 'Medication review'],
    followUpRequired: true,
    clinicianReview: 'urgent'
  },
  {
    id: 'MHS002',
    patientName: 'Michael Rodriguez',
    age: 45,
    assessmentType: 'GAD-7',
    riskScore: 11,
    riskLevel: 'moderate',
    completionDate: '2024-01-15 16:45',
    responses: 7,
    totalQuestions: 7,
    interventionRecommendations: ['Cognitive behavioral therapy', 'Relaxation techniques', 'Lifestyle modifications'],
    followUpRequired: true,
    clinicianReview: 'pending'
  }
];

export const MentalHealthScreening = () => {
  const [assessments, setAssessments] = useState<ScreeningAssessment[]>(mockAssessments);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'severe': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getReviewBadge = (status: string) => {
    switch (status) {
      case 'urgent': return <Badge className="bg-red-100 text-red-800">Urgent Review</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case 'completed': return <Badge className="bg-green-100 text-green-800">Reviewed</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Mental Health Screening Dashboard
          </CardTitle>
          <CardDescription>
            AI-powered adaptive questionnaires with risk scoring and intervention recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">1</p>
                    <p className="text-sm text-gray-600">Severe Risk</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">0</p>
                    <p className="text-sm text-gray-600">High Risk</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-yellow-200 bg-yellow-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">1</p>
                    <p className="text-sm text-gray-600">Moderate Risk</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">23</p>
                    <p className="text-sm text-gray-600">Low Risk</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            {assessments.sort((a, b) => {
              const riskOrder = { severe: 4, high: 3, moderate: 2, low: 1 };
              return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
            }).map((assessment) => (
              <Card key={assessment.id} className={`border-l-4 ${assessment.riskLevel === 'severe' ? 'border-l-red-600' : assessment.riskLevel === 'high' ? 'border-l-red-400' : assessment.riskLevel === 'moderate' ? 'border-l-yellow-400' : 'border-l-green-400'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{assessment.patientName}</h3>
                      <Badge variant="outline">Age {assessment.age}</Badge>
                      <Badge variant="outline">{assessment.assessmentType}</Badge>
                      <Badge className={getRiskColor(assessment.riskLevel)}>
                        {assessment.riskLevel.toUpperCase()}
                      </Badge>
                      {getReviewBadge(assessment.clinicianReview)}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Completed: {assessment.completionDate}</p>
                      <p className="text-sm font-medium">Score: {assessment.riskScore}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Assessment Progress</span>
                          <span className="text-sm">{assessment.responses}/{assessment.totalQuestions}</span>
                        </div>
                        <Progress value={(assessment.responses / assessment.totalQuestions) * 100} className="h-2" />
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Risk Score</span>
                          <span className="text-sm font-bold">{assessment.riskScore}/27</span>
                        </div>
                        <Progress value={(assessment.riskScore / 27) * 100} className="h-3" />
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">AI Recommendations:</h4>
                        <ul className="text-sm space-y-1">
                          {assessment.interventionRecommendations.map((rec, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-blue-500" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {assessment.riskLevel === 'severe' && (
                      <Button size="sm" variant="destructive">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Urgent Review
                      </Button>
                    )}
                    {assessment.followUpRequired && (
                      <Button size="sm" variant="outline">
                        <Clock className="h-4 w-4 mr-1" />
                        Schedule Follow-up
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      View Details
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
