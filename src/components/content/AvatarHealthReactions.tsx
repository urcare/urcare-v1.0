
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Brain, Activity, Smile, AlertTriangle, TrendingUp } from 'lucide-react';

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  trend: 'up' | 'down' | 'stable';
}

interface AvatarReaction {
  expression: string;
  message: string;
  color: string;
  emotion: string;
}

interface Props {
  userMood: 'positive' | 'neutral' | 'concerned' | 'motivated';
}

const healthMetrics: HealthMetric[] = [
  {
    id: 'glucose',
    name: 'Blood Glucose',
    value: 125,
    unit: 'mg/dL',
    status: 'good',
    trend: 'stable'
  },
  {
    id: 'bp',
    name: 'Blood Pressure',
    value: 128,
    unit: 'mmHg',
    status: 'fair',
    trend: 'down'
  },
  {
    id: 'weight',
    name: 'Weight',
    value: 75,
    unit: 'kg',
    status: 'good',
    trend: 'down'
  },
  {
    id: 'steps',
    name: 'Daily Steps',
    value: 8500,
    unit: 'steps',
    status: 'excellent',
    trend: 'up'
  }
];

export const AvatarHealthReactions = ({ userMood }: Props) => {
  const [currentReaction, setCurrentReaction] = useState<AvatarReaction | null>(null);
  const [avatarState, setAvatarState] = useState('neutral');

  const getAvatarReaction = (metrics: HealthMetric[], mood: string): AvatarReaction => {
    const excellentCount = metrics.filter(m => m.status === 'excellent').length;
    const poorCount = metrics.filter(m => m.status === 'poor').length;
    const improvingCount = metrics.filter(m => m.trend === 'up').length;

    if (poorCount > 0) {
      return {
        expression: '😟',
        message: 'I notice some metrics need attention. Let\'s work on improving them together!',
        color: 'text-orange-600',
        emotion: 'concerned'
      };
    }

    if (excellentCount >= 2) {
      return {
        expression: '😊',
        message: 'You\'re doing amazing! Your health metrics look fantastic!',
        color: 'text-green-600',
        emotion: 'happy'
      };
    }

    if (improvingCount >= 2) {
      return {
        expression: '😌',
        message: 'Great progress! I can see your efforts are paying off.',
        color: 'text-blue-600',
        emotion: 'proud'
      };
    }

    if (mood === 'motivated') {
      return {
        expression: '💪',
        message: 'I love your energy! Let\'s tackle your health goals together!',
        color: 'text-purple-600',
        emotion: 'motivated'
      };
    }

    if (mood === 'concerned') {
      return {
        expression: '🤗',
        message: 'I\'m here to support you. Small steps lead to big improvements.',
        color: 'text-pink-600',
        emotion: 'supportive'
      };
    }

    return {
      expression: '😊',
      message: 'Your health journey looks good. Keep up the steady progress!',
      color: 'text-gray-600',
      emotion: 'neutral'
    };
  };

  useEffect(() => {
    const reaction = getAvatarReaction(healthMetrics, userMood);
    setCurrentReaction(reaction);
    setAvatarState(reaction.emotion);
  }, [userMood]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      case 'stable': return <div className="w-3 h-0.5 bg-gray-500" />;
      default: return null;
    }
  };

  const getStatusPercentage = (status: string) => {
    switch (status) {
      case 'excellent': return 90;
      case 'good': return 75;
      case 'fair': return 60;
      case 'poor': return 30;
      default: return 50;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Avatar Health Reactions</CardTitle>
          <CardDescription>
            Your health companion responds to your wellness data and mood
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Avatar Display */}
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="text-8xl animate-pulse">
                {currentReaction?.expression || '😊'}
              </div>
              <div className="absolute -top-2 -right-2">
                <div className={`w-4 h-4 rounded-full ${getStatusColor('good')} animate-ping`} />
              </div>
            </div>
            
            <div className="space-y-2">
              <p className={`font-medium ${currentReaction?.color}`}>
                {currentReaction?.message}
              </p>
              <Badge variant="outline" className="capitalize">
                Feeling {currentReaction?.emotion}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Current Health Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {healthMetrics.map((metric) => (
            <div key={metric.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{metric.name}</span>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">
                    {metric.value} {metric.unit}
                  </span>
                  <Badge className={`${getStatusColor(metric.status)} text-white text-xs`}>
                    {metric.status}
                  </Badge>
                </div>
              </div>
              <Progress 
                value={getStatusPercentage(metric.status)} 
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Avatar Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Avatar Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Health Pattern Recognition:</strong> Your avatar notices you tend to have better glucose readings in the morning.
            </p>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              <strong>Motivation Boost:</strong> Based on your recent progress, your avatar suggests celebrating with a healthy treat!
            </p>
          </div>
          
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-700">
              <strong>Mood Connection:</strong> Your avatar has learned that walking improves both your steps and your mood.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Avatar Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Avatar Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Heart className="h-4 w-4 mr-2" />
            "Let's do a 5-minute breathing exercise"
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Activity className="h-4 w-4 mr-2" />
            "How about a gentle walk after lunch?"
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Smile className="h-4 w-4 mr-2" />
            "Time to update your mood in the tracker"
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
