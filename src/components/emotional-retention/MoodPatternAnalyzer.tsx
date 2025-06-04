
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Smile,
  Calendar,
  Bell,
  Target
} from 'lucide-react';

interface MoodPattern {
  id: string;
  patientId: string;
  patientName: string;
  currentMood: string;
  moodTrend: 'improving' | 'stable' | 'declining' | 'critical';
  confidence: number;
  triggers: string[];
  interventions: string[];
  lastUpdate: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

const mockPatterns: MoodPattern[] = [
  {
    id: 'MP001',
    patientId: 'P2847',
    patientName: 'Sarah Johnson',
    currentMood: 'anxious',
    moodTrend: 'declining',
    confidence: 89,
    triggers: ['work stress', 'sleep issues', 'medication side effects'],
    interventions: ['breathing exercises', 'sleep hygiene education', 'medication review'],
    lastUpdate: '2024-01-20 14:30',
    riskLevel: 'high'
  },
  {
    id: 'MP002',
    patientId: 'P1932',
    patientName: 'Michael Chen',
    currentMood: 'optimistic',
    moodTrend: 'improving',
    confidence: 76,
    triggers: ['exercise routine', 'social interaction', 'therapy sessions'],
    interventions: ['continue current plan', 'increase social activities'],
    lastUpdate: '2024-01-20 13:45',
    riskLevel: 'low'
  },
  {
    id: 'MP003',
    patientId: 'P3156',
    patientName: 'Emma Davis',
    currentMood: 'sad',
    moodTrend: 'critical',
    confidence: 94,
    triggers: ['isolation', 'financial stress', 'relationship issues'],
    interventions: ['immediate counseling', 'crisis intervention', 'support group referral'],
    lastUpdate: '2024-01-20 15:15',
    riskLevel: 'critical'
  }
];

export const MoodPatternAnalyzer = () => {
  const [patterns] = useState<MoodPattern[]>(mockPatterns);
  const [selectedPattern, setSelectedPattern] = useState<MoodPattern | null>(null);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      case 'declining': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return TrendingUp;
      case 'stable': return Brain;
      case 'declining': return TrendingDown;
      case 'critical': return AlertTriangle;
      default: return Brain;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'critical': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Mood Pattern Analyzer
          </CardTitle>
          <CardDescription>
            Emotional trend tracking with trigger identification and intervention recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {patterns.filter(p => p.moodTrend === 'improving').length}
                    </p>
                    <p className="text-sm text-gray-600">Improving</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Brain className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {patterns.filter(p => p.moodTrend === 'stable').length}
                    </p>
                    <p className="text-sm text-gray-600">Stable</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      {patterns.filter(p => p.moodTrend === 'declining').length}
                    </p>
                    <p className="text-sm text-gray-600">Declining</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {patterns.filter(p => p.moodTrend === 'critical').length}
                    </p>
                    <p className="text-sm text-gray-600">Critical</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Patient Mood Patterns</h3>
              {patterns.map((pattern) => {
                const TrendIcon = getTrendIcon(pattern.moodTrend);
                return (
                  <Card 
                    key={pattern.id} 
                    className={`cursor-pointer transition-colors ${selectedPattern?.id === pattern.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-purple-400`}
                    onClick={() => setSelectedPattern(pattern)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold mb-1">{pattern.patientName}</h4>
                          <p className="text-sm text-gray-600 mb-1">ID: {pattern.patientId}</p>
                          <div className="flex items-center gap-2">
                            <Smile className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              Current: {pattern.currentMood}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge className={getRiskColor(pattern.riskLevel)}>
                            {pattern.riskLevel.toUpperCase()}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <TrendIcon className={`h-4 w-4 ${getTrendColor(pattern.moodTrend)}`} />
                            <span className={`text-sm font-medium ${getTrendColor(pattern.moodTrend)}`}>
                              {pattern.moodTrend}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>AI Confidence</span>
                          <span className="font-bold">{pattern.confidence}%</span>
                        </div>
                        <Progress value={pattern.confidence} className="h-2" />
                        
                        <div className="flex justify-between items-center mt-3 text-sm">
                          <div className="flex items-center gap-1 text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>Updated: {pattern.lastUpdate}</span>
                          </div>
                          <div className="flex items-center gap-1 text-blue-600">
                            <Target className="h-3 w-3" />
                            <span>{pattern.interventions.length} interventions</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div>
              {selectedPattern ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedPattern.patientName}</CardTitle>
                    <CardDescription>Detailed mood pattern analysis and recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Current Status</h4>
                          <div className="space-y-1 text-sm">
                            <p>Mood: <strong>{selectedPattern.currentMood}</strong></p>
                            <p>Trend: <strong className={getTrendColor(selectedPattern.moodTrend)}>
                              {selectedPattern.moodTrend}
                            </strong></p>
                            <p>Risk: <strong>{selectedPattern.riskLevel}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">AI Analysis</h4>
                          <div className="space-y-1 text-sm">
                            <p>Confidence: <strong>{selectedPattern.confidence}%</strong></p>
                            <p>Last Update: <strong>{selectedPattern.lastUpdate}</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Identified Triggers</h4>
                        <div className="space-y-2">
                          {selectedPattern.triggers.map((trigger, index) => (
                            <div key={index} className="text-sm bg-red-50 p-2 rounded">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                <span className="text-red-700">{trigger}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Recommended Interventions</h4>
                        <div className="space-y-2">
                          {selectedPattern.interventions.map((intervention, index) => (
                            <div key={index} className="text-sm bg-blue-50 p-2 rounded">
                              <div className="flex items-start gap-2">
                                <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span className="text-blue-700">{intervention}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <Bell className="h-4 w-4 mr-1" />
                          Create Alert
                        </Button>
                        <Button variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule Follow-up
                        </Button>
                        <Button variant="outline">
                          <Brain className="h-4 w-4 mr-1" />
                          AI Analysis
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a patient to view detailed mood pattern analysis and intervention recommendations</p>
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
