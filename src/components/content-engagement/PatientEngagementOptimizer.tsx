
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Brain,
  Heart,
  Activity,
  Clock,
  Lightbulb
} from 'lucide-react';

interface PatientEngagement {
  id: string;
  patientId: string;
  patientName: string;
  overallScore: number;
  interactionFrequency: number;
  contentPreferences: string[];
  engagementTrends: { date: string; score: number }[];
  responseTime: number;
  preferredChannels: string[];
  lastInteraction: string;
  personalizedRecommendations: string[];
}

interface EngagementInsight {
  id: string;
  type: 'preference' | 'behavior' | 'timing' | 'content';
  insight: string;
  confidence: number;
  actionable: boolean;
  impact: 'high' | 'medium' | 'low';
}

const mockEngagements: PatientEngagement[] = [
  {
    id: 'ENG001',
    patientId: 'P2847',
    patientName: 'Sarah Johnson',
    overallScore: 92,
    interactionFrequency: 85,
    contentPreferences: ['Short videos', 'Interactive quizzes', 'Visual infographics'],
    engagementTrends: [
      { date: '2024-01-15', score: 78 },
      { date: '2024-01-16', score: 82 },
      { date: '2024-01-17', score: 87 },
      { date: '2024-01-18', score: 90 },
      { date: '2024-01-19', score: 92 }
    ],
    responseTime: 2.5,
    preferredChannels: ['Mobile app', 'SMS', 'Email'],
    lastInteraction: '2024-01-20 14:30',
    personalizedRecommendations: [
      'Send content in morning hours (8-10 AM)',
      'Use visual learning materials',
      'Include interactive elements'
    ]
  },
  {
    id: 'ENG002',
    patientId: 'P1932',
    patientName: 'Michael Chen',
    overallScore: 67,
    interactionFrequency: 45,
    contentPreferences: ['Detailed articles', 'Print materials', 'Phone consultations'],
    engagementTrends: [
      { date: '2024-01-15', score: 72 },
      { date: '2024-01-16', score: 69 },
      { date: '2024-01-17', score: 65 },
      { date: '2024-01-18', score: 63 },
      { date: '2024-01-19', score: 67 }
    ],
    responseTime: 12.5,
    preferredChannels: ['Phone', 'Email', 'In-person'],
    lastInteraction: '2024-01-19 16:45',
    personalizedRecommendations: [
      'Use traditional communication methods',
      'Provide detailed written information',
      'Schedule regular check-in calls'
    ]
  },
  {
    id: 'ENG003',
    patientId: 'P3156',
    patientName: 'Emma Davis',
    overallScore: 78,
    interactionFrequency: 72,
    contentPreferences: ['Support groups', 'Peer stories', 'Wellness content'],
    engagementTrends: [
      { date: '2024-01-15', score: 65 },
      { date: '2024-01-16', score: 70 },
      { date: '2024-01-17', score: 74 },
      { date: '2024-01-18', score: 76 },
      { date: '2024-01-19', score: 78 }
    ],
    responseTime: 4.2,
    preferredChannels: ['Mobile app', 'Video calls', 'Community forums'],
    lastInteraction: '2024-01-20 11:15',
    personalizedRecommendations: [
      'Connect with peer support networks',
      'Share recovery success stories',
      'Provide community engagement opportunities'
    ]
  }
];

const mockInsights: EngagementInsight[] = [
  {
    id: 'INS001',
    type: 'timing',
    insight: 'Patients show 34% higher engagement during morning hours (8-11 AM)',
    confidence: 89,
    actionable: true,
    impact: 'high'
  },
  {
    id: 'INS002',
    type: 'content',
    insight: 'Video content receives 2.3x more interaction than text-based materials',
    confidence: 92,
    actionable: true,
    impact: 'high'
  },
  {
    id: 'INS003',
    type: 'behavior',
    insight: 'Patients with declining engagement often recover after personalized outreach',
    confidence: 76,
    actionable: true,
    impact: 'medium'
  },
  {
    id: 'INS004',
    type: 'preference',
    insight: 'Mobile app usage correlates with higher treatment adherence rates',
    confidence: 84,
    actionable: true,
    impact: 'high'
  }
];

export const PatientEngagementOptimizer = () => {
  const [engagements] = useState<PatientEngagement[]>(mockEngagements);
  const [insights] = useState<EngagementInsight[]>(mockInsights);
  const [selectedEngagement, setSelectedEngagement] = useState<PatientEngagement | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendDirection = (trends: { date: string; score: number }[]) => {
    if (trends.length < 2) return 'stable';
    const recent = trends[trends.length - 1].score;
    const previous = trends[trends.length - 2].score;
    if (recent > previous) return 'improving';
    if (recent < previous) return 'declining';
    return 'stable';
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'timing': return <Clock className="h-4 w-4" />;
      case 'content': return <Heart className="h-4 w-4" />;
      case 'behavior': return <Brain className="h-4 w-4" />;
      case 'preference': return <Target className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Patient Engagement Optimizer
          </CardTitle>
          <CardDescription>
            Interaction analysis, preference learning, and experience personalization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{engagements.length}</p>
                  <p className="text-sm text-gray-600">Active Patients</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(engagements.reduce((sum, e) => sum + e.overallScore, 0) / engagements.length)}
                  </p>
                  <p className="text-sm text-gray-600">Avg Score</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-purple-200 bg-purple-50">
              <div className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">{insights.length}</p>
                  <p className="text-sm text-gray-600">Insights</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-2">
                <Target className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {engagements.filter(e => getTrendDirection(e.engagementTrends) === 'improving').length}
                  </p>
                  <p className="text-sm text-gray-600">Improving</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Patient Engagement Profiles</h3>
              {engagements.map((engagement) => {
                const trendDirection = getTrendDirection(engagement.engagementTrends);
                return (
                  <Card 
                    key={engagement.id} 
                    className={`cursor-pointer transition-colors ${selectedEngagement?.id === engagement.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-indigo-400`}
                    onClick={() => setSelectedEngagement(engagement)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold mb-1">{engagement.patientName}</h4>
                          <p className="text-sm text-gray-600 mb-1">ID: {engagement.patientId}</p>
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {engagement.interactionFrequency}% interaction rate
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${getScoreColor(engagement.overallScore)}`}>
                              {engagement.overallScore}
                            </p>
                            <p className="text-xs text-gray-500">Engagement</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(trendDirection)}
                            <span className="text-sm font-medium capitalize">{trendDirection}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Overall Score</span>
                          <span className={`font-bold ${getScoreColor(engagement.overallScore)}`}>
                            {engagement.overallScore}%
                          </span>
                        </div>
                        <Progress value={engagement.overallScore} className="h-2" />
                        
                        <div className="flex justify-between items-center mt-3 text-sm">
                          <span className="text-gray-500">Response: {engagement.responseTime}h avg</span>
                          <span className="text-gray-500">Last: {engagement.lastInteraction}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Engagement Insights</h3>
              {insights.map((insight) => (
                <Card key={insight.id} className="border-l-4 border-l-yellow-400">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        {getInsightIcon(insight.type)}
                        <Badge variant="outline" className="capitalize">
                          {insight.type}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact.toUpperCase()}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm font-bold">{insight.confidence}%</p>
                          <p className="text-xs text-gray-500">Confidence</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-700">{insight.insight}</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      {insight.actionable && (
                        <Badge className="bg-green-500 text-white">
                          Actionable
                        </Badge>
                      )}
                      <Button size="sm" variant="outline">
                        Apply Insight
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {selectedEngagement && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{selectedEngagement.patientName} - Engagement Profile</CardTitle>
                <CardDescription>Detailed interaction analysis and personalization recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Engagement Metrics</h4>
                      <div className="space-y-1 text-sm">
                        <p>Overall Score: <strong className={getScoreColor(selectedEngagement.overallScore)}>
                          {selectedEngagement.overallScore}%
                        </strong></p>
                        <p>Interaction Rate: <strong>{selectedEngagement.interactionFrequency}%</strong></p>
                        <p>Avg Response Time: <strong>{selectedEngagement.responseTime}h</strong></p>
                        <p>Last Interaction: <strong>{selectedEngagement.lastInteraction}</strong></p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Communication Preferences</h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium mb-1">Preferred Channels:</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedEngagement.preferredChannels.map((channel, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Content Preferences:</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedEngagement.contentPreferences.map((pref, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {pref}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Personalized Recommendations</h4>
                    <div className="space-y-2">
                      {selectedEngagement.personalizedRecommendations.map((rec, index) => (
                        <div key={index} className="text-sm bg-blue-50 p-2 rounded">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-blue-700">{rec}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button>
                      <Target className="h-4 w-4 mr-1" />
                      Optimize Experience
                    </Button>
                    <Button variant="outline">
                      <Brain className="h-4 w-4 mr-1" />
                      Generate Insights
                    </Button>
                    <Button variant="outline">
                      <Heart className="h-4 w-4 mr-1" />
                      Send Personalized Content
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
