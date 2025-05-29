
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, TrendingUp, Calendar, Share2, Target } from 'lucide-react';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  earnedDate: string;
  points: number;
}

interface WeekStats {
  week: string;
  totalPoints: number;
  achievements: Achievement[];
  habitsCompleted: number;
  totalHabits: number;
  streaks: Array<{ habit: string; days: number; isRecord: boolean }>;
  improvements: Array<{ metric: string; improvement: string; percentage: number }>;
}

export const BestWeekRecap = () => {
  const [selectedWeek, setSelectedWeek] = useState('current');
  
  const weekData: Record<string, WeekStats> = {
    'current': {
      week: 'Jan 14-20, 2024',
      totalPoints: 485,
      achievements: [
        {
          id: '1',
          title: 'Hydration Hero',
          description: 'Drank 8+ glasses of water every day',
          category: 'hydration',
          earnedDate: 'Jan 18',
          points: 50
        },
        {
          id: '2',
          title: 'Sleep Champion',
          description: 'Got 8+ hours of sleep for 5 days',
          category: 'sleep',
          earnedDate: 'Jan 20',
          points: 75
        }
      ],
      habitsCompleted: 28,
      totalHabits: 35,
      streaks: [
        { habit: 'Morning Exercise', days: 12, isRecord: true },
        { habit: 'Meditation', days: 8, isRecord: false },
        { habit: 'Healthy Breakfast', days: 15, isRecord: true }
      ],
      improvements: [
        { metric: 'Sleep Quality', improvement: '+25%', percentage: 25 },
        { metric: 'Exercise Consistency', improvement: '+40%', percentage: 40 },
        { metric: 'Hydration', improvement: '+15%', percentage: 15 }
      ]
    },
    'best': {
      week: 'Dec 10-16, 2023',
      totalPoints: 520,
      achievements: [
        {
          id: '3',
          title: 'Perfect Week',
          description: 'Completed all habits every single day',
          category: 'consistency',
          earnedDate: 'Dec 16',
          points: 100
        },
        {
          id: '4',
          title: 'Exercise Elite',
          description: 'Worked out 7 days in a row',
          category: 'fitness',
          earnedDate: 'Dec 16',
          points: 85
        }
      ],
      habitsCompleted: 35,
      totalHabits: 35,
      streaks: [
        { habit: 'Morning Exercise', days: 21, isRecord: true },
        { habit: 'Meditation', days: 14, isRecord: true },
        { habit: 'Healthy Breakfast', days: 18, isRecord: false }
      ],
      improvements: [
        { metric: 'Overall Health Score', improvement: '+45%', percentage: 45 },
        { metric: 'Energy Levels', improvement: '+35%', percentage: 35 },
        { metric: 'Mood Rating', improvement: '+30%', percentage: 30 }
      ]
    }
  };

  const currentData = weekData[selectedWeek];
  const completionRate = (currentData.habitsCompleted / currentData.totalHabits) * 100;

  const getCategoryIcon = (category: string) => {
    const icons = {
      hydration: '💧',
      sleep: '😴',
      consistency: '🎯',
      fitness: '💪',
      nutrition: '🥗'
    };
    return icons[category as keyof typeof icons] || '⭐';
  };

  const handleShare = () => {
    const shareText = `Just had an amazing week! 🌟 Completed ${currentData.habitsCompleted}/${currentData.totalHabits} habits and earned ${currentData.totalPoints} points! #HealthGoals #WellnessJourney`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Best Health Week',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Week recap copied to clipboard for sharing!');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Best Week Recap
          </CardTitle>
          <CardDescription>
            Celebrate your achievements and track your health journey progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Button
              variant={selectedWeek === 'current' ? 'default' : 'outline'}
              onClick={() => setSelectedWeek('current')}
              size="sm"
            >
              This Week
            </Button>
            <Button
              variant={selectedWeek === 'best' ? 'default' : 'outline'}
              onClick={() => setSelectedWeek('best')}
              size="sm"
            >
              Best Week Ever
            </Button>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-yellow-600">{currentData.week}</h2>
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{currentData.totalPoints}</div>
                  <p className="text-sm text-gray-600">Total Points</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">{Math.round(completionRate)}%</div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{currentData.achievements.length}</div>
                  <p className="text-sm text-gray-600">Achievements</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🏆 Achievements Unlocked</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentData.achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                        <span className="text-2xl">{getCategoryIcon(achievement.category)}</span>
                        <div className="flex-1">
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {achievement.points} pts
                            </Badge>
                            <span className="text-xs text-gray-500">{achievement.earnedDate}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🔥 Habit Streaks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentData.streaks.map((streak, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{streak.habit}</h4>
                          <p className="text-sm text-gray-600">{streak.days} days</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {streak.isRecord && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              New Record!
                            </Badge>
                          )}
                          <div className="text-2xl font-bold text-orange-600">{streak.days}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Key Improvements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentData.improvements.map((improvement, index) => (
                    <div key={index} className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {improvement.improvement}
                      </div>
                      <p className="text-sm font-medium">{improvement.metric}</p>
                      <Progress value={improvement.percentage} className="mt-2 h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 justify-center">
              <Button onClick={handleShare} className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share My Success
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Set New Goals
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
