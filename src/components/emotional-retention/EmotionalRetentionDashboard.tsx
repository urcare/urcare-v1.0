
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Heart, 
  AlertTriangle, 
  Trophy, 
  TrendingDown, 
  Monitor,
  Activity,
  Bell,
  Smile,
  Trending-up
} from 'lucide-react';
import { MoodPatternAnalyzer } from './MoodPatternAnalyzer';
import { AvatarFeedbackSystem } from './AvatarFeedbackSystem';
import { CrisisCommunicationDetector } from './CrisisCommunicationDetector';
import { GamifiedHabitTracker } from './GamifiedHabitTracker';
import { RetentionRiskDashboard } from './RetentionRiskDashboard';
import { SleepEnergyMonitoring } from './SleepEnergyMonitoring';

interface EngagementMetrics {
  totalPatients: number;
  activeUsers: number;
  riskPatients: number;
  interventionsNeeded: number;
  averageEngagement: number;
  moodTrend: 'improving' | 'stable' | 'declining';
}

const mockMetrics: EngagementMetrics = {
  totalPatients: 2847,
  activeUsers: 2156,
  riskPatients: 234,
  interventionsNeeded: 47,
  averageEngagement: 78,
  moodTrend: 'improving'
};

export const EmotionalRetentionDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics] = useState<EngagementMetrics>(mockMetrics);

  const getMoodTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getMoodTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return Trending-up;
      case 'stable': return Activity;
      case 'declining': return TrendingDown;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Emotional & Retention AI Dashboard
          </CardTitle>
          <CardDescription>
            Advanced patient engagement intelligence with mood analysis and retention optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Heart className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{metrics.totalPatients}</p>
                  <p className="text-sm text-gray-600">Total Patients</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <Activity className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{metrics.activeUsers}</p>
                  <p className="text-sm text-gray-600">Active Users</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">{metrics.riskPatients}</p>
                  <p className="text-sm text-gray-600">At Risk</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-2">
                <Bell className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">{metrics.interventionsNeeded}</p>
                  <p className="text-sm text-gray-600">Interventions</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-purple-200 bg-purple-50">
              <div className="flex items-center gap-2">
                <Trophy className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">{metrics.averageEngagement}%</p>
                  <p className="text-sm text-gray-600">Engagement</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-teal-200 bg-teal-50">
              <div className="flex items-center gap-2">
                {React.createElement(getMoodTrendIcon(metrics.moodTrend), { 
                  className: `h-8 w-8 ${getMoodTrendColor(metrics.moodTrend)}` 
                })}
                <div>
                  <p className={`text-2xl font-bold ${getMoodTrendColor(metrics.moodTrend)}`}>
                    {metrics.moodTrend}
                  </p>
                  <p className="text-sm text-gray-600">Mood Trend</p>
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="mood" className="flex items-center gap-2">
            <Smile className="h-4 w-4" />
            <span className="hidden sm:inline">Mood</span>
          </TabsTrigger>
          <TabsTrigger value="avatar" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Avatar</span>
          </TabsTrigger>
          <TabsTrigger value="crisis" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Crisis</span>
          </TabsTrigger>
          <TabsTrigger value="habits" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Habits</span>
          </TabsTrigger>
          <TabsTrigger value="retention" className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            <span className="hidden sm:inline">Retention</span>
          </TabsTrigger>
          <TabsTrigger value="wellness" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span className="hidden sm:inline">Wellness</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Insights</CardTitle>
                <CardDescription>Key engagement intelligence at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Trending-up className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Engagement improving</span>
                    </div>
                    <Badge className="bg-green-500 text-white">+12%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">AI interventions active</span>
                    </div>
                    <Badge className="bg-blue-500 text-white">47</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <span className="font-medium">Crisis alerts today</span>
                    </div>
                    <Badge className="bg-orange-500 text-white">3</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest engagement events and interventions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-sm">Crisis intervention triggered</p>
                      <p className="text-xs text-gray-500">Patient #2847 - 5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-sm">Habit milestone achieved</p>
                      <p className="text-xs text-gray-500">Patient #1932 - 12 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-sm">Mood pattern detected</p>
                      <p className="text-xs text-gray-500">Patient #3156 - 18 minutes ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mood" className="space-y-6">
          <MoodPatternAnalyzer />
        </TabsContent>

        <TabsContent value="avatar" className="space-y-6">
          <AvatarFeedbackSystem />
        </TabsContent>

        <TabsContent value="crisis" className="space-y-6">
          <CrisisCommunicationDetector />
        </TabsContent>

        <TabsContent value="habits" className="space-y-6">
          <GamifiedHabitTracker />
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          <RetentionRiskDashboard />
        </TabsContent>

        <TabsContent value="wellness" className="space-y-6">
          <SleepEnergyMonitoring />
        </TabsContent>
      </Tabs>
    </div>
  );
};
