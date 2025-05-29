
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Users, MessageCircle, Calendar, Trophy, Target, Award } from 'lucide-react';

interface EngagementMetric {
  label: string;
  value: number;
  max: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  earned: boolean;
  category: string;
}

export const EngagementTracker = () => {
  const [timeRange, setTimeRange] = useState('week');

  const engagementMetrics: EngagementMetric[] = [
    {
      label: 'Posts Created',
      value: 12,
      max: 20,
      change: +15,
      icon: <MessageCircle className="h-4 w-4" />,
      color: 'text-blue-600'
    },
    {
      label: 'Community Interactions',
      value: 45,
      max: 60,
      change: +23,
      icon: <Users className="h-4 w-4" />,
      color: 'text-green-600'
    },
    {
      label: 'Events Attended',
      value: 3,
      max: 5,
      change: +50,
      icon: <Calendar className="h-4 w-4" />,
      color: 'text-purple-600'
    },
    {
      label: 'Helpful Votes Received',
      value: 28,
      max: 40,
      change: +12,
      icon: <Trophy className="h-4 w-4" />,
      color: 'text-orange-600'
    }
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Community Helper',
      description: 'Help 10 community members this week',
      progress: 7,
      maxProgress: 10,
      earned: false,
      category: 'Social'
    },
    {
      id: '2',
      title: 'Consistent Contributor',
      description: 'Post daily for 7 days straight',
      progress: 5,
      maxProgress: 7,
      earned: false,
      category: 'Engagement'
    },
    {
      id: '3',
      title: 'Event Enthusiast',
      description: 'Attend 3 community events this month',
      progress: 3,
      maxProgress: 3,
      earned: true,
      category: 'Participation'
    },
    {
      id: '4',
      title: 'Knowledge Sharer',
      description: 'Share 5 helpful resources',
      progress: 2,
      maxProgress: 5,
      earned: false,
      category: 'Content'
    }
  ];

  const weeklyActivity = [
    { day: 'Mon', posts: 2, interactions: 8, events: 0 },
    { day: 'Tue', posts: 1, interactions: 12, events: 1 },
    { day: 'Wed', posts: 3, interactions: 6, events: 0 },
    { day: 'Thu', posts: 0, interactions: 15, events: 1 },
    { day: 'Fri', posts: 2, interactions: 9, events: 0 },
    { day: 'Sat', posts: 1, interactions: 5, events: 1 },
    { day: 'Sun', posts: 3, interactions: 11, events: 0 }
  ];

  const getEngagementLevel = () => {
    const totalProgress = engagementMetrics.reduce((sum, metric) => 
      sum + (metric.value / metric.max), 0
    ) / engagementMetrics.length;
    
    if (totalProgress >= 0.8) return { level: 'High', color: 'text-green-600', bg: 'bg-green-100' };
    if (totalProgress >= 0.5) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Low', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const engagementLevel = getEngagementLevel();

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Engagement Tracker
              </CardTitle>
              <CardDescription>
                Track your community participation and growth
              </CardDescription>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${engagementLevel.bg} ${engagementLevel.color}`}>
                <Target className="h-4 w-4 mr-1" />
                {engagementLevel.level} Engagement
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Time Range:</span>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {engagementMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={metric.color}>
                        {metric.icon}
                      </div>
                      <span className="font-medium">{metric.label}</span>
                    </div>
                    <Badge 
                      variant={metric.change > 0 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{metric.value} of {metric.max}</span>
                      <span>{Math.round((metric.value / metric.max) * 100)}%</span>
                    </div>
                    <Progress value={(metric.value / metric.max) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={achievement.earned ? 'bg-green-50 border-green-200' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${achievement.earned ? 'bg-green-200' : 'bg-gray-200'}`}>
                        <Award className={`h-5 w-5 ${achievement.earned ? 'text-green-700' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                    <Badge variant={achievement.earned ? "default" : "secondary"}>
                      {achievement.category}
                    </Badge>
                  </div>
                  
                  {!achievement.earned ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="h-2"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-700">
                      <Trophy className="h-4 w-4" />
                      <span className="text-sm font-medium">Achievement Unlocked!</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity Overview</CardTitle>
              <CardDescription>
                Your daily engagement patterns this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {weeklyActivity.map((day, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium text-gray-600">
                      {day.day}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-3 w-3 text-blue-600" />
                        <span className="text-xs text-gray-600 w-12">Posts</span>
                        <Progress value={(day.posts / 5) * 100} className="h-1 flex-1" />
                        <span className="text-xs text-gray-600 w-6">{day.posts}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-gray-600 w-12">Social</span>
                        <Progress value={(day.interactions / 20) * 100} className="h-1 flex-1" />
                        <span className="text-xs text-gray-600 w-6">{day.interactions}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-purple-600" />
                        <span className="text-xs text-gray-600 w-12">Events</span>
                        <Progress value={(day.events / 2) * 100} className="h-1 flex-1" />
                        <span className="text-xs text-gray-600 w-6">{day.events}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
