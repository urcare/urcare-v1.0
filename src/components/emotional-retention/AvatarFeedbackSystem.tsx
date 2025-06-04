
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Smile, 
  MessageCircle, 
  TrendingUp,
  Star,
  Users,
  Activity,
  Target
} from 'lucide-react';

interface AvatarInteraction {
  id: string;
  patientId: string;
  patientName: string;
  avatarType: string;
  interactionScore: number;
  responseTime: number;
  engagementLevel: 'low' | 'medium' | 'high' | 'excellent';
  feedbackRating: number;
  lastInteraction: string;
  totalInteractions: number;
  preferredStyle: string;
  improvementAreas: string[];
}

const mockInteractions: AvatarInteraction[] = [
  {
    id: 'AI001',
    patientId: 'P2847',
    patientName: 'Sarah Johnson',
    avatarType: 'Caring Companion',
    interactionScore: 87,
    responseTime: 2.3,
    engagementLevel: 'high',
    feedbackRating: 4.5,
    lastInteraction: '2024-01-20 14:30',
    totalInteractions: 156,
    preferredStyle: 'empathetic',
    improvementAreas: ['response speed', 'emotional depth']
  },
  {
    id: 'AI002',
    patientId: 'P1932',
    patientName: 'Michael Chen',
    avatarType: 'Motivational Coach',
    interactionScore: 92,
    responseTime: 1.8,
    engagementLevel: 'excellent',
    feedbackRating: 4.8,
    lastInteraction: '2024-01-20 13:45',
    totalInteractions: 203,
    preferredStyle: 'encouraging',
    improvementAreas: ['personalization']
  },
  {
    id: 'AI003',
    patientId: 'P3156',
    patientName: 'Emma Davis',
    avatarType: 'Wellness Guide',
    interactionScore: 74,
    responseTime: 3.1,
    engagementLevel: 'medium',
    feedbackRating: 3.9,
    lastInteraction: '2024-01-20 15:15',
    totalInteractions: 89,
    preferredStyle: 'informative',
    improvementAreas: ['engagement', 'relevance', 'timing']
  }
];

export const AvatarFeedbackSystem = () => {
  const [interactions] = useState<AvatarInteraction[]>(mockInteractions);
  const [selectedInteraction, setSelectedInteraction] = useState<AvatarInteraction | null>(null);

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'bg-green-500 text-white';
      case 'high': return 'bg-blue-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Avatar Feedback System
          </CardTitle>
          <CardDescription>
            Patient interaction analysis with response optimization and engagement improvement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Star className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">4.4</p>
                    <p className="text-sm text-gray-600">Avg Rating</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {interactions.reduce((sum, i) => sum + i.totalInteractions, 0)}
                    </p>
                    <p className="text-sm text-gray-600">Total Interactions</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(interactions.reduce((sum, i) => sum + i.interactionScore, 0) / interactions.length)}
                    </p>
                    <p className="text-sm text-gray-600">Avg Score</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Activity className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      {(interactions.reduce((sum, i) => sum + i.responseTime, 0) / interactions.length).toFixed(1)}s
                    </p>
                    <p className="text-sm text-gray-600">Avg Response</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Avatar Interactions</h3>
              {interactions.map((interaction) => (
                <Card 
                  key={interaction.id} 
                  className={`cursor-pointer transition-colors ${selectedInteraction?.id === interaction.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-pink-400`}
                  onClick={() => setSelectedInteraction(interaction)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold mb-1">{interaction.patientName}</h4>
                        <p className="text-sm text-gray-600 mb-1">{interaction.avatarType}</p>
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Score: {interaction.interactionScore}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getEngagementColor(interaction.engagementLevel)}>
                          {interaction.engagementLevel.toUpperCase()}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-bold">{interaction.feedbackRating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Interaction Score</span>
                        <span className={`font-bold ${getScoreColor(interaction.interactionScore)}`}>
                          {interaction.interactionScore}%
                        </span>
                      </div>
                      <Progress value={interaction.interactionScore} className="h-2" />
                      
                      <div className="flex justify-between items-center mt-3 text-sm">
                        <div className="flex items-center gap-1 text-gray-500">
                          <MessageCircle className="h-3 w-3" />
                          <span>{interaction.totalInteractions} interactions</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-600">
                          <Activity className="h-3 w-3" />
                          <span>{interaction.responseTime}s avg</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedInteraction ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedInteraction.patientName}</CardTitle>
                    <CardDescription>Avatar interaction analysis and optimization recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Performance Metrics</h4>
                          <div className="space-y-1 text-sm">
                            <p>Score: <strong className={getScoreColor(selectedInteraction.interactionScore)}>
                              {selectedInteraction.interactionScore}%
                            </strong></p>
                            <p>Rating: <strong>{selectedInteraction.feedbackRating}/5</strong></p>
                            <p>Response Time: <strong>{selectedInteraction.responseTime}s</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Interaction Details</h4>
                          <div className="space-y-1 text-sm">
                            <p>Avatar: <strong>{selectedInteraction.avatarType}</strong></p>
                            <p>Style: <strong>{selectedInteraction.preferredStyle}</strong></p>
                            <p>Total: <strong>{selectedInteraction.totalInteractions}</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Engagement Analysis</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Engagement Level</span>
                            <Badge className={getEngagementColor(selectedInteraction.engagementLevel)}>
                              {selectedInteraction.engagementLevel.toUpperCase()}
                            </Badge>
                          </div>
                          <Progress value={
                            selectedInteraction.engagementLevel === 'excellent' ? 100 :
                            selectedInteraction.engagementLevel === 'high' ? 80 :
                            selectedInteraction.engagementLevel === 'medium' ? 60 : 40
                          } className="h-2" />
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Improvement Areas</h4>
                        <div className="space-y-2">
                          {selectedInteraction.improvementAreas.map((area, index) => (
                            <div key={index} className="text-sm bg-orange-50 p-2 rounded">
                              <div className="flex items-start gap-2">
                                <Target className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                <span className="text-orange-700">{area}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Optimization Recommendations</h4>
                        <div className="space-y-2">
                          <div className="text-sm bg-blue-50 p-2 rounded">
                            <p className="font-medium text-blue-800">Personalization</p>
                            <p className="text-blue-700">Adjust avatar responses to match patient's preferred communication style</p>
                          </div>
                          <div className="text-sm bg-green-50 p-2 rounded">
                            <p className="font-medium text-green-800">Timing Optimization</p>
                            <p className="text-green-700">Schedule interactions during patient's most engaged hours</p>
                          </div>
                          <div className="text-sm bg-purple-50 p-2 rounded">
                            <p className="font-medium text-purple-800">Content Enhancement</p>
                            <p className="text-purple-700">Incorporate more relevant health topics and motivational content</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <Star className="h-4 w-4 mr-1" />
                          Optimize Avatar
                        </Button>
                        <Button variant="outline">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Test Interaction
                        </Button>
                        <Button variant="outline">
                          <Users className="h-4 w-4 mr-1" />
                          Patient Feedback
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select an avatar interaction to view detailed analysis and optimization recommendations</p>
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
