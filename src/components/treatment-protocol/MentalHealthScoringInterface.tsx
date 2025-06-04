
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Target,
  Activity,
  Heart
} from 'lucide-react';

interface MentalHealthAssessment {
  id: string;
  patientName: string;
  assessmentType: 'PHQ-9' | 'GAD-7' | 'Beck-Depression' | 'PTSD-PCL5';
  currentScore: number;
  previousScore: number | null;
  riskLevel: 'low' | 'moderate' | 'high' | 'severe';
  lastAssessment: string;
  nextDue: string;
  interventionRecommendations: string[];
  progressTrend: 'improving' | 'stable' | 'declining';
  treatmentGoals: string[];
  supportingSources: string[];
  alertFlags: string[];
}

const mockAssessments: MentalHealthAssessment[] = [
  {
    id: 'MH001',
    patientName: 'Emily Johnson',
    assessmentType: 'PHQ-9',
    currentScore: 12,
    previousScore: 16,
    riskLevel: 'moderate',
    lastAssessment: '2024-01-15',
    nextDue: '2024-02-15',
    interventionRecommendations: [
      'Cognitive Behavioral Therapy (CBT)',
      'Antidepressant medication consideration',
      'Exercise therapy program',
      'Sleep hygiene counseling'
    ],
    progressTrend: 'improving',
    treatmentGoals: [
      'Reduce PHQ-9 score to <10',
      'Improve sleep quality',
      'Increase social engagement',
      'Return to work activities'
    ],
    supportingSources: ['Family support', 'Employee assistance program', 'Primary care physician'],
    alertFlags: ['Previous suicidal ideation', 'Family history of depression']
  },
  {
    id: 'MH002',
    patientName: 'Marcus Williams',
    assessmentType: 'GAD-7',
    currentScore: 15,
    previousScore: 14,
    riskLevel: 'high',
    lastAssessment: '2024-01-12',
    nextDue: '2024-01-26',
    interventionRecommendations: [
      'Immediate psychiatric consultation',
      'Anxiolytic medication trial',
      'Mindfulness-based therapy',
      'Crisis intervention plan'
    ],
    progressTrend: 'stable',
    treatmentGoals: [
      'Reduce anxiety symptoms to manageable level',
      'Develop coping strategies',
      'Improve work performance',
      'Reduce panic attack frequency'
    ],
    supportingSources: ['Spouse support', 'Therapist', 'Support group'],
    alertFlags: ['Panic disorder', 'Substance use history', 'Work-related stress']
  }
];

export const MentalHealthScoringInterface = () => {
  const [assessments] = useState<MentalHealthAssessment[]>(mockAssessments);
  const [selectedAssessment, setSelectedAssessment] = useState<MentalHealthAssessment | null>(null);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'severe': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'stable': return 'text-yellow-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return TrendingUp;
      case 'stable': return Activity;
      case 'declining': return AlertTriangle;
      default: return Activity;
    }
  };

  const getScoreInterpretation = (type: string, score: number) => {
    switch (type) {
      case 'PHQ-9':
        if (score <= 4) return 'Minimal depression';
        if (score <= 9) return 'Mild depression';
        if (score <= 14) return 'Moderate depression';
        if (score <= 19) return 'Moderately severe depression';
        return 'Severe depression';
      case 'GAD-7':
        if (score <= 4) return 'Minimal anxiety';
        if (score <= 9) return 'Mild anxiety';
        if (score <= 14) return 'Moderate anxiety';
        return 'Severe anxiety';
      default:
        return 'Assessment completed';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Mental Health Scoring Interface
          </CardTitle>
          <CardDescription>
            Assessment tools with progress tracking and intervention recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <Brain className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">127</p>
                    <p className="text-sm text-gray-600">Active Assessments</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">8</p>
                    <p className="text-sm text-gray-600">High Risk Patients</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">67%</p>
                    <p className="text-sm text-gray-600">Showing Improvement</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Target className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">23</p>
                    <p className="text-sm text-gray-600">Interventions Active</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Mental Health Assessments</h3>
              {assessments.map((assessment) => {
                const TrendIcon = getTrendIcon(assessment.progressTrend);
                return (
                  <Card 
                    key={assessment.id} 
                    className={`cursor-pointer transition-colors ${selectedAssessment?.id === assessment.id ? 'ring-2 ring-blue-500' : ''} border-l-4 ${assessment.riskLevel === 'high' || assessment.riskLevel === 'severe' ? 'border-l-red-500' : assessment.riskLevel === 'moderate' ? 'border-l-yellow-400' : 'border-l-green-400'}`}
                    onClick={() => setSelectedAssessment(assessment)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{assessment.patientName}</h4>
                          <p className="text-sm text-gray-600">{assessment.assessmentType} Assessment</p>
                          <p className="text-sm font-medium">{getScoreInterpretation(assessment.assessmentType, assessment.currentScore)}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getRiskColor(assessment.riskLevel)}>
                            {assessment.riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Current Score</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">{assessment.currentScore}</span>
                            {assessment.previousScore && (
                              <div className="flex items-center gap-1">
                                <TrendIcon className={`h-3 w-3 ${getTrendColor(assessment.progressTrend)}`} />
                                <span className={`text-xs ${getTrendColor(assessment.progressTrend)}`}>
                                  {assessment.progressTrend}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-blue-500" />
                            <span>Next: {assessment.nextDue}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3 text-green-500" />
                            <span>{assessment.treatmentGoals.length} goals</span>
                          </div>
                          {assessment.alertFlags.length > 0 && (
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3 text-red-500" />
                              <span>{assessment.alertFlags.length} alerts</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div>
              {selectedAssessment ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedAssessment.patientName} - {selectedAssessment.assessmentType}</CardTitle>
                    <CardDescription>{getScoreInterpretation(selectedAssessment.assessmentType, selectedAssessment.currentScore)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Assessment Details</h4>
                          <div className="space-y-1 text-sm">
                            <p>Current Score: <strong>{selectedAssessment.currentScore}</strong></p>
                            {selectedAssessment.previousScore && (
                              <p>Previous Score: {selectedAssessment.previousScore}</p>
                            )}
                            <p>Risk Level: <span className="capitalize">{selectedAssessment.riskLevel}</span></p>
                            <p>Last Assessment: {selectedAssessment.lastAssessment}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Progress Trend</h4>
                          <div className={`text-2xl font-bold ${getTrendColor(selectedAssessment.progressTrend)}`}>
                            {selectedAssessment.progressTrend.toUpperCase()}
                          </div>
                          <p className="text-sm text-gray-500">Next due: {selectedAssessment.nextDue}</p>
                        </div>
                      </div>
                      
                      {selectedAssessment.alertFlags.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2 text-red-600">Alert Flags</h4>
                          <ul className="space-y-1">
                            {selectedAssessment.alertFlags.map((flag, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm text-red-600">
                                <AlertTriangle className="h-3 w-3" />
                                {flag}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-medium mb-2">Intervention Recommendations</h4>
                        <ul className="space-y-1">
                          {selectedAssessment.interventionRecommendations.map((intervention, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Target className="h-3 w-3 text-blue-500" />
                              {intervention}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Treatment Goals</h4>
                        <ul className="space-y-1">
                          {selectedAssessment.treatmentGoals.map((goal, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Supporting Resources</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedAssessment.supportingSources.map((source, index) => (
                            <Badge key={index} variant="outline">{source}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <Brain className="h-4 w-4 mr-1" />
                          New Assessment
                        </Button>
                        <Button variant="outline">
                          <Target className="h-4 w-4 mr-1" />
                          Update Goals
                        </Button>
                        <Button variant="outline">
                          <Heart className="h-4 w-4 mr-1" />
                          Care Plan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select an assessment to view detailed analysis</p>
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
