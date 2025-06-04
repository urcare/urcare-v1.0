
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, Award, Calendar } from 'lucide-react';

interface HealthScore {
  id: string;
  patientName: string;
  age: number;
  currentScore: number;
  previousScore: number;
  trend: 'improving' | 'stable' | 'declining';
  physicalHealth: number;
  mentalHealth: number;
  socialWellbeing: number;
  milestones: string[];
  improvements: string[];
  lastUpdate: string;
  nextGoal: string;
}

const mockHealthScores: HealthScore[] = [
  {
    id: 'HS001',
    patientName: 'Emily Johnson',
    age: 29,
    currentScore: 78,
    previousScore: 65,
    trend: 'improving',
    physicalHealth: 82,
    mentalHealth: 75,
    socialWellbeing: 77,
    milestones: ['Completed 30 days meditation', 'Improved sleep quality', 'Regular exercise routine'],
    improvements: ['Stress management', 'Social connections', 'Medication adherence'],
    lastUpdate: '2024-01-15',
    nextGoal: 'Achieve 85% health score by month end'
  },
  {
    id: 'HS002',
    patientName: 'Robert Kim',
    age: 41,
    currentScore: 52,
    previousScore: 58,
    trend: 'declining',
    physicalHealth: 48,
    mentalHealth: 45,
    socialWellbeing: 62,
    milestones: ['Completed CBT sessions'],
    improvements: ['Sleep hygiene', 'Anxiety management', 'Physical activity'],
    lastUpdate: '2024-01-14',
    nextGoal: 'Stabilize mood and improve daily functioning'
  }
];

export const HealthScoreTracker = () => {
  const [healthScores, setHealthScores] = useState<HealthScore[]>(mockHealthScores);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Target className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'bg-green-100 text-green-800';
      case 'declining': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Health Score Evolution Tracker
          </CardTitle>
          <CardDescription>
            Comprehensive wellness tracking with trend analysis and milestone achievement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">1</p>
                    <p className="text-sm text-gray-600">Improving</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-yellow-200 bg-yellow-50">
                <div className="flex items-center gap-2">
                  <Target className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">0</p>
                    <p className="text-sm text-gray-600">Stable</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">1</p>
                    <p className="text-sm text-gray-600">Declining</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Award className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">67.5</p>
                    <p className="text-sm text-gray-600">Avg Score</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            {healthScores.sort((a, b) => {
              const trendOrder = { declining: 3, stable: 2, improving: 1 };
              return trendOrder[b.trend] - trendOrder[a.trend];
            }).map((patient) => (
              <Card key={patient.id} className={`border-l-4 ${patient.trend === 'improving' ? 'border-l-green-500' : patient.trend === 'declining' ? 'border-l-red-500' : 'border-l-yellow-500'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{patient.patientName}</h3>
                      <Badge variant="outline">Age {patient.age}</Badge>
                      <Badge className={getTrendColor(patient.trend)}>
                        {getTrendIcon(patient.trend)}
                        {patient.trend.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Last update: {patient.lastUpdate}</p>
                      <p className="text-sm font-medium">
                        Score: {patient.currentScore} 
                        <span className={patient.currentScore > patient.previousScore ? 'text-green-600' : 'text-red-600'}>
                          ({patient.currentScore > patient.previousScore ? '+' : ''}{patient.currentScore - patient.previousScore})
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Overall Health Score</span>
                          <span className="text-sm font-bold">{patient.currentScore}/100</span>
                        </div>
                        <Progress value={patient.currentScore} className="h-3" />
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Physical Health</span>
                            <span className="text-sm">{patient.physicalHealth}%</span>
                          </div>
                          <Progress value={patient.physicalHealth} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Mental Health</span>
                            <span className="text-sm">{patient.mentalHealth}%</span>
                          </div>
                          <Progress value={patient.mentalHealth} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Social Wellbeing</span>
                            <span className="text-sm">{patient.socialWellbeing}%</span>
                          </div>
                          <Progress value={patient.socialWellbeing} className="h-2" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Recent Milestones:</h4>
                        <div className="space-y-1">
                          {patient.milestones.map((milestone, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Award className="h-3 w-3 text-blue-500" />
                              <span className="text-sm">{milestone}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Next Goal:</h4>
                    <p className="text-sm">{patient.nextGoal}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Improvement Areas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {patient.improvements.map((improvement, index) => (
                        <Badge key={index} variant="outline">{improvement}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      View Trends
                    </Button>
                    <Button size="sm" variant="outline">
                      <Target className="h-4 w-4 mr-1" />
                      Set Goals
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule Review
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
