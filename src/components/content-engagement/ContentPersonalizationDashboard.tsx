
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Users, 
  TrendingUp, 
  Brain,
  Heart,
  Eye,
  MessageSquare,
  Lightbulb
} from 'lucide-react';

interface PatientSegment {
  id: string;
  name: string;
  count: number;
  characteristics: string[];
  engagementRate: number;
  preferredContent: string[];
  personalizedContent: number;
  lastUpdate: string;
}

interface ContentRecommendation {
  id: string;
  title: string;
  type: 'article' | 'video' | 'interactive' | 'assessment';
  targetSegment: string;
  engagementScore: number;
  status: 'active' | 'pending' | 'draft';
  views: number;
  interactions: number;
}

const mockSegments: PatientSegment[] = [
  {
    id: 'SEG001',
    name: 'Diabetes Management - Young Adults',
    count: 847,
    characteristics: ['Age 25-35', 'Tech-savvy', 'Mobile-first', 'Social media active'],
    engagementRate: 92,
    preferredContent: ['Short videos', 'Interactive tools', 'Gamified content'],
    personalizedContent: 234,
    lastUpdate: '2024-01-20'
  },
  {
    id: 'SEG002',
    name: 'Heart Health - Seniors',
    count: 623,
    characteristics: ['Age 65+', 'Traditional learners', 'Detailed information', 'Email communication'],
    engagementRate: 78,
    preferredContent: ['Detailed articles', 'Print materials', 'Personal consultations'],
    personalizedContent: 189,
    lastUpdate: '2024-01-19'
  },
  {
    id: 'SEG003',
    name: 'Mental Health - High Risk',
    count: 324,
    characteristics: ['Crisis-prone', 'Needs support', 'Frequent check-ins', 'Immediate response'],
    engagementRate: 95,
    preferredContent: ['Crisis resources', 'Support groups', 'Immediate contact'],
    personalizedContent: 156,
    lastUpdate: '2024-01-20'
  }
];

const mockRecommendations: ContentRecommendation[] = [
  {
    id: 'REC001',
    title: 'Managing Blood Sugar with Smart Technology',
    type: 'video',
    targetSegment: 'Diabetes Management - Young Adults',
    engagementScore: 94,
    status: 'active',
    views: 1247,
    interactions: 356
  },
  {
    id: 'REC002',
    title: 'Heart-Healthy Living After 65',
    type: 'article',
    targetSegment: 'Heart Health - Seniors',
    engagementScore: 89,
    status: 'active',
    views: 892,
    interactions: 234
  },
  {
    id: 'REC003',
    title: 'Crisis Support Interactive Guide',
    type: 'interactive',
    targetSegment: 'Mental Health - High Risk',
    engagementScore: 97,
    status: 'pending',
    views: 0,
    interactions: 0
  }
];

export const ContentPersonalizationDashboard = () => {
  const [segments] = useState<PatientSegment[]>(mockSegments);
  const [recommendations] = useState<ContentRecommendation[]>(mockRecommendations);
  const [selectedSegment, setSelectedSegment] = useState<PatientSegment | null>(null);

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Eye className="h-4 w-4" />;
      case 'article': return <MessageSquare className="h-4 w-4" />;
      case 'interactive': return <Brain className="h-4 w-4" />;
      case 'assessment': return <Lightbulb className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      case 'draft': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Content Personalization Dashboard
          </CardTitle>
          <CardDescription>
            Patient segment analysis, content recommendation, and engagement tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {segments.reduce((sum, seg) => sum + seg.count, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Patients</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-purple-200 bg-purple-50">
              <div className="flex items-center gap-2">
                <Target className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">{segments.length}</p>
                  <p className="text-sm text-gray-600">Segments</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(segments.reduce((sum, seg) => sum + seg.engagementRate, 0) / segments.length)}%
                  </p>
                  <p className="text-sm text-gray-600">Avg Engagement</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {segments.reduce((sum, seg) => sum + seg.personalizedContent, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Personalized</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Patient Segments</h3>
              {segments.map((segment) => (
                <Card 
                  key={segment.id} 
                  className={`cursor-pointer transition-colors ${selectedSegment?.id === segment.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-blue-400`}
                  onClick={() => setSelectedSegment(segment)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold mb-1">{segment.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{segment.count} patients</p>
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium">
                            {segment.engagementRate}% engaged
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-blue-500 text-white">
                        {segment.personalizedContent} content
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Engagement Rate</span>
                        <span className="font-bold">{segment.engagementRate}%</span>
                      </div>
                      <Progress value={segment.engagementRate} className="h-2" />
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        {segment.characteristics.slice(0, 2).map((char, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {char}
                          </Badge>
                        ))}
                        {segment.characteristics.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{segment.characteristics.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Content Recommendations</h3>
              {recommendations.map((rec) => (
                <Card key={rec.id} className="border-l-4 border-l-green-400">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold mb-1">{rec.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{rec.targetSegment}</p>
                        <div className="flex items-center gap-2">
                          {getContentTypeIcon(rec.type)}
                          <span className="text-sm font-medium capitalize">
                            {rec.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getStatusColor(rec.status)}>
                          {rec.status.toUpperCase()}
                        </Badge>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">{rec.engagementScore}</p>
                          <p className="text-xs text-gray-500">Score</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Views</p>
                        <p className="font-bold">{rec.views.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Interactions</p>
                        <p className="font-bold">{rec.interactions.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {selectedSegment && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{selectedSegment.name} - Detailed Analysis</CardTitle>
                <CardDescription>Comprehensive segment characteristics and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Patient Characteristics</h4>
                    <div className="space-y-2">
                      {selectedSegment.characteristics.map((char, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">{char}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Preferred Content Types</h4>
                    <div className="space-y-2">
                      {selectedSegment.preferredContent.map((content, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <Heart className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{content}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-6">
                  <Button>
                    <Brain className="h-4 w-4 mr-1" />
                    Generate Content
                  </Button>
                  <Button variant="outline">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Analyze Engagement
                  </Button>
                  <Button variant="outline">
                    <Target className="h-4 w-4 mr-1" />
                    Update Segment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
