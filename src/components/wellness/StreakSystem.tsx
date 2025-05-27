
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Calendar, TrendingUp, Star, Gift } from 'lucide-react';
import { toast } from 'sonner';

interface Streak {
  id: string;
  name: string;
  current: number;
  best: number;
  category: 'hydration' | 'exercise' | 'sleep' | 'nutrition' | 'meditation';
  lastUpdated: string;
  nextMilestone: number;
  milestoneReward: string;
}

interface Milestone {
  days: number;
  reward: string;
  claimed: boolean;
  category: string;
}

export const StreakSystem = () => {
  const [streaks, setStreaks] = useState<Streak[]>([
    {
      id: '1',
      name: 'Daily Hydration',
      current: 12,
      best: 18,
      category: 'hydration',
      lastUpdated: '2024-01-20',
      nextMilestone: 14,
      milestoneReward: 'Hydration Hero Badge'
    },
    {
      id: '2',
      name: 'Morning Exercise',
      current: 7,
      best: 15,
      category: 'exercise',
      lastUpdated: '2024-01-20',
      nextMilestone: 10,
      milestoneReward: 'Fitness Enthusiast Badge'
    },
    {
      id: '3',
      name: 'Quality Sleep',
      current: 5,
      best: 9,
      category: 'sleep',
      lastUpdated: '2024-01-20',
      nextMilestone: 7,
      milestoneReward: 'Sleep Champion Badge'
    }
  ]);

  const [milestones] = useState<Milestone[]>([
    { days: 7, reward: 'Weekly Warrior Badge', claimed: true, category: 'general' },
    { days: 14, reward: 'Hydration Hero Badge', claimed: false, category: 'hydration' },
    { days: 21, reward: 'Habit Master Badge', claimed: false, category: 'general' },
    { days: 30, reward: 'Monthly Champion Badge', claimed: false, category: 'general' },
    { days: 100, reward: 'Centurion Badge', claimed: false, category: 'general' }
  ]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hydration': return 'text-blue-600 bg-blue-100';
      case 'exercise': return 'text-green-600 bg-green-100';
      case 'sleep': return 'text-purple-600 bg-purple-100';
      case 'nutrition': return 'text-orange-600 bg-orange-100';
      case 'meditation': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hydration': return '💧';
      case 'exercise': return '💪';
      case 'sleep': return '😴';
      case 'nutrition': return '🥗';
      case 'meditation': return '🧘';
      default: return '⭐';
    }
  };

  const handleExtendStreak = (streakId: string) => {
    setStreaks(prev => 
      prev.map(streak => {
        if (streak.id === streakId) {
          const newCurrent = streak.current + 1;
          const newBest = Math.max(newCurrent, streak.best);
          
          if (newCurrent >= streak.nextMilestone) {
            toast.success(`🎉 Milestone reached! ${streak.milestoneReward} unlocked!`);
          }
          
          return {
            ...streak,
            current: newCurrent,
            best: newBest,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return streak;
      })
    );
  };

  const totalCurrentDays = streaks.reduce((sum, streak) => sum + streak.current, 0);
  const averageStreak = totalCurrentDays / streaks.length;
  const longestStreak = Math.max(...streaks.map(s => s.best));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Streak System & Milestones
          </CardTitle>
          <CardDescription>
            Build consistency and earn rewards for maintaining healthy habits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{totalCurrentDays}</div>
              <p className="text-sm text-gray-600">Total Active Days</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{Math.round(averageStreak)}</div>
              <p className="text-sm text-gray-600">Average Streak</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{longestStreak}</div>
              <p className="text-sm text-gray-600">Longest Streak</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {streaks.map((streak) => (
              <Card key={streak.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getCategoryIcon(streak.category)}</span>
                        <div>
                          <h3 className="font-medium">{streak.name}</h3>
                          <Badge className={getCategoryColor(streak.category)}>
                            {streak.category}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Current Streak</span>
                        <span className="text-2xl font-bold text-blue-600">{streak.current}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Best Streak</span>
                        <span className="text-lg font-semibold text-green-600">{streak.best}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>To next milestone</span>
                          <span>{streak.current}/{streak.nextMilestone}</span>
                        </div>
                        <Progress 
                          value={(streak.current / streak.nextMilestone) * 100} 
                          className="h-2"
                        />
                        <p className="text-xs text-gray-500">{streak.milestoneReward}</p>
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleExtendStreak(streak.id)}
                      className="w-full"
                      size="sm"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Continue Streak
                    </Button>

                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      Last updated: {streak.lastUpdated}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Milestone Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${
                  milestone.claimed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={milestone.claimed ? 'default' : 'outline'}>
                    {milestone.days} Days
                  </Badge>
                  {milestone.claimed && <Star className="h-5 w-5 text-yellow-500 fill-current" />}
                </div>
                
                <h4 className="font-medium mb-1">{milestone.reward}</h4>
                <p className="text-sm text-gray-600 capitalize">{milestone.category} category</p>
                
                {milestone.claimed ? (
                  <div className="mt-3 text-sm text-green-600 font-medium">
                    ✓ Claimed
                  </div>
                ) : (
                  <div className="mt-3 text-sm text-gray-500">
                    Keep going to unlock!
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
