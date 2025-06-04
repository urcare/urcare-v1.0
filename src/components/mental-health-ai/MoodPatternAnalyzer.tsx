
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, TrendingDown, Calendar, Lightbulb, AlertTriangle } from 'lucide-react';

interface MoodPattern {
  id: string;
  patientName: string;
  age: number;
  currentMood: number;
  moodTrend: 'improving' | 'stable' | 'declining' | 'volatile';
  triggers: string[];
  copingStrategies: string[];
  lastEntry: string;
  riskFactors: string[];
  recommendations: string[];
  interventionNeeded: boolean;
}

const mockMoodData: MoodPattern[] = [
  {
    id: 'MP001',
    patientName: 'Amanda Foster',
    age: 26,
    currentMood: 3,
    moodTrend: 'declining',
    triggers: ['Work stress', 'Relationship issues', 'Sleep disruption'],
    copingStrategies: ['Deep breathing', 'Exercise', 'Journaling'],
    lastEntry: '2 hours ago',
    riskFactors: ['History of depression', 'Recent life changes'],
    recommendations: ['Increase therapy frequency', 'Consider medication adjustment', 'Crisis safety plan'],
    interventionNeeded: true
  },
  {
    id: 'MP002',
    patientName: 'David Park',
    age: 38,
    currentMood: 7,
    moodTrend: 'improving',
    triggers: ['Financial stress', 'Health concerns'],
    copingStrategies: ['Meditation', 'Social support', 'Routine'],
    lastEntry: '6 hours ago',
    riskFactors: ['Anxiety disorder'],
    recommendations: ['Continue current strategies', 'Maintain routine', 'Regular check-ins'],
    interventionNeeded: false
  }
];

export const MoodPatternAnalyzer = () => {
  const [moodData, setMoodData] = useState<MoodPattern[]>(mockMoodData);

  const getMoodColor = (mood: number) => {
    if (mood <= 3) return 'text-red-600';
    if (mood <= 5) return 'text-yellow-600';
    if (mood <= 7) return 'text-blue-600';
    return 'text-green-600';
  };

  const getTrendBadge = (trend: string) => {
    const config = {
      improving: { className: 'bg-green-100 text-green-800', label: 'Improving' },
      stable: { className: 'bg-blue-100 text-blue-800', label: 'Stable' },
      declining: { className: 'bg-red-100 text-red-800', label: 'Declining' },
      volatile: { className: 'bg-orange-100 text-orange-800', label: 'Volatile' }
    };
    return <Badge className={config[trend].className}>{config[trend].label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Mood Pattern Analyzer
          </CardTitle>
          <CardDescription>
            AI-powered emotional trend analysis with trigger identification and coping strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">1</p>
                    <p className="text-sm text-gray-600">Declining</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">0</p>
                    <p className="text-sm text-gray-600">Volatile</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Heart className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">0</p>
                    <p className="text-sm text-gray-600">Stable</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-8 w-8 text-green-600 rotate-180" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">1</p>
                    <p className="text-sm text-gray-600">Improving</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            {moodData.sort((a, b) => {
              if (a.interventionNeeded && !b.interventionNeeded) return -1;
              if (!a.interventionNeeded && b.interventionNeeded) return 1;
              return a.currentMood - b.currentMood;
            }).map((patient) => (
              <Card key={patient.id} className={`border-l-4 ${patient.interventionNeeded ? 'border-l-red-500' : patient.currentMood <= 5 ? 'border-l-yellow-400' : 'border-l-green-400'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{patient.patientName}</h3>
                      <Badge variant="outline">Age {patient.age}</Badge>
                      {getTrendBadge(patient.moodTrend)}
                      {patient.interventionNeeded && (
                        <Badge className="bg-red-100 text-red-800">Intervention Needed</Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Last entry: {patient.lastEntry}</p>
                      <p className={`text-lg font-bold ${getMoodColor(patient.currentMood)}`}>
                        Mood: {patient.currentMood}/10
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Current Mood Level</span>
                          <span className="text-sm">{patient.currentMood}/10</span>
                        </div>
                        <Progress value={patient.currentMood * 10} className="h-3" />
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Identified Triggers:</h4>
                        <div className="flex flex-wrap gap-2">
                          {patient.triggers.map((trigger, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{trigger}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Risk Factors:</h4>
                        <div className="space-y-1">
                          {patient.riskFactors.map((risk, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <AlertTriangle className="h-3 w-3 text-orange-500" />
                              <span className="text-sm">{risk}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Coping Strategies:</h4>
                        <ul className="text-sm space-y-1">
                          {patient.copingStrategies.map((strategy, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Lightbulb className="h-3 w-3 text-blue-500" />
                              {strategy}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">AI Recommendations:</h4>
                        <ul className="text-sm space-y-1">
                          {patient.recommendations.map((rec, index) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {patient.interventionNeeded && (
                      <Button size="sm" variant="destructive">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Urgent Care
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Heart className="h-4 w-4 mr-1" />
                      View Trends
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule Check-in
                    </Button>
                    <Button size="sm" variant="outline">
                      <Lightbulb className="h-4 w-4 mr-1" />
                      Coping Plan
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
