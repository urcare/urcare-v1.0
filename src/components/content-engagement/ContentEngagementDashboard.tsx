
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Heart, 
  TrendingUp, 
  Users,
  BookOpen,
  Mic,
  Video,
  Target,
  Lightbulb,
  MessageSquare
} from 'lucide-react';
import { ContentPersonalizationDashboard } from './ContentPersonalizationDashboard';
import { LabResultVisualization } from './LabResultVisualization';
import { RecoveryEncouragement } from './RecoveryEncouragement';
import { VoiceEmotionAnalysis } from './VoiceEmotionAnalysis';
import { PatientEngagementOptimizer } from './PatientEngagementOptimizer';
import { HealthEducationCurator } from './HealthEducationCurator';

interface ContentMetrics {
  totalPatients: number;
  personalizedContent: number;
  engagementRate: number;
  videoGenerated: number;
  recoveryMilestones: number;
  voiceAnalysisComplete: number;
  educationModules: number;
  averageScore: number;
}

const mockMetrics: ContentMetrics = {
  totalPatients: 3247,
  personalizedContent: 2856,
  engagementRate: 89,
  videoGenerated: 1432,
  recoveryMilestones: 567,
  voiceAnalysisComplete: 2134,
  educationModules: 234,
  averageScore: 87
};

export const ContentEngagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics] = useState<ContentMetrics>(mockMetrics);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-indigo-600" />
            Content & Engagement AI Dashboard
          </CardTitle>
          <CardDescription>
            Personalized patient experience with intelligent content optimization and engagement analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-6">
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{metrics.totalPatients}</p>
                  <p className="text-sm text-gray-600">Total Patients</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-purple-200 bg-purple-50">
              <div className="flex items-center gap-2">
                <Target className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">{metrics.personalizedContent}</p>
                  <p className="text-sm text-gray-600">Personalized</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{metrics.engagementRate}%</p>
                  <p className="text-sm text-gray-600">Engagement</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-2">
                <Video className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">{metrics.videoGenerated}</p>
                  <p className="text-sm text-gray-600">Videos</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-teal-200 bg-teal-50">
              <div className="flex items-center gap-2">
                <Heart className="h-8 w-8 text-teal-600" />
                <div>
                  <p className="text-2xl font-bold text-teal-600">{metrics.recoveryMilestones}</p>
                  <p className="text-sm text-gray-600">Milestones</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-pink-200 bg-pink-50">
              <div className="flex items-center gap-2">
                <Mic className="h-8 w-8 text-pink-600" />
                <div>
                  <p className="text-2xl font-bold text-pink-600">{metrics.voiceAnalysisComplete}</p>
                  <p className="text-sm text-gray-600">Voice Analysis</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                <BookOpen className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{metrics.educationModules}</p>
                  <p className="text-sm text-gray-600">Education</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-indigo-200 bg-indigo-50">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-8 w-8 text-indigo-600" />
                <div>
                  <p className="text-2xl font-bold text-indigo-600">{metrics.averageScore}</p>
                  <p className="text-sm text-gray-600">Avg Score</p>
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="personalization" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Content</span>
          </TabsTrigger>
          <TabsTrigger value="lab-results" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Lab Results</span>
          </TabsTrigger>
          <TabsTrigger value="recovery" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Recovery</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            <span className="hidden sm:inline">Voice</span>
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Engagement</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Education</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Intelligence Overview</CardTitle>
                <CardDescription>Key performance metrics and engagement insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Engagement increasing</span>
                    </div>
                    <Badge className="bg-green-500 text-white">+15%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Automated videos generated</span>
                    </div>
                    <Badge className="bg-blue-500 text-white">1,432</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Personalization active</span>
                    </div>
                    <Badge className="bg-purple-500 text-white">88%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest content generation and engagement events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-sm">Lab result video generated</p>
                      <p className="text-xs text-gray-500">Patient #3247 - 3 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-sm">Recovery milestone achieved</p>
                      <p className="text-xs text-gray-500">Patient #2134 - 8 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-sm">Voice emotion analysis completed</p>
                      <p className="text-xs text-gray-500">Patient #1987 - 12 minutes ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="personalization" className="space-y-6">
          <ContentPersonalizationDashboard />
        </TabsContent>

        <TabsContent value="lab-results" className="space-y-6">
          <LabResultVisualization />
        </TabsContent>

        <TabsContent value="recovery" className="space-y-6">
          <RecoveryEncouragement />
        </TabsContent>

        <TabsContent value="voice" className="space-y-6">
          <VoiceEmotionAnalysis />
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <PatientEngagementOptimizer />
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <HealthEducationCurator />
        </TabsContent>
      </Tabs>
    </div>
  );
};
